/**
 * Creates (or you can run it again to add more) an administrator account.
 *
 *   npm run admin:create -- --email you@example.com --name "Your Name"
 *
 * Uses the DIRECT database connection (db.prisma.io), read from the environment or from .env.local (see docs/ADMIN-SETUP.md).
 *
 * The password is typed at a hidden prompt (or read from the ADMIN_PASSWORD environment variable for non-interactive use).
 * It is hashed with scrypt before it is stored; the plain password is never saved or printed.
 */
import { isPlausibleEmail, normalizeEmail, validateNewPassword } from "../src/lib/admin/auth";
import { hashPassword } from "../src/lib/admin/password";
import { PostgresAdminStore } from "../src/lib/admin/postgres-store";
import { closeDatabase, connectionInfo, DatabaseConfigError, errorCode, safeErrorText, useDirectConnection } from "../src/lib/db/client";
import { loadLocalEnv } from "./local-env";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function askHidden(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    const stdin = process.stdin;
    let value = "";
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    const onData = (ch: string) => {
      for (const c of ch) {
        if (c === "\r" || c === "\n" || c === "\u0004") {
          stdin.setRawMode?.(false);
          stdin.pause();
          stdin.removeListener("data", onData);
          process.stdout.write("\n");
          resolve(value);
          return;
        }
        if (c === "\u0003") process.exit(130);
        if (c === "\u007f" || c === "\b") value = value.slice(0, -1);
        else value += c;
      }
    };
    stdin.on("data", onData);
  });
}

async function main() {
  loadLocalEnv();
  useDirectConnection();
  const info = connectionInfo("direct"); // throws a safe message if there is no direct connection
  console.log(`Using ${info.source} (${info.kind} connection) to ${info.host}.`);
  const email = normalizeEmail(arg("email") ?? "");
  const name = (arg("name") ?? "").trim();
  if (!isPlausibleEmail(email) || !name) {
    console.error('Usage: npm run admin:create -- --email you@example.com --name "Your Name"');
    process.exit(1);
  }
  const password = process.env.ADMIN_PASSWORD ?? (await askHidden("Password (hidden): "));
  const problem = validateNewPassword(password);
  if (problem) {
    console.error(`Password rejected. ${problem}`);
    process.exit(1);
  }
  if (!process.env.ADMIN_PASSWORD) {
    const again = await askHidden("Repeat password: ");
    if (again !== password) {
      console.error("The passwords do not match.");
      process.exit(1);
    }
  }
  const admin = await new PostgresAdminStore().createAdmin({ email, displayName: name, passwordHash: await hashPassword(password) });
  console.log(`Administrator created: ${admin.displayName} <${admin.email}>`);
}

main()
  .catch((e) => {
    if (e instanceof DatabaseConfigError) console.error(e.message);
    else if (errorCode(e) === "23505") console.error("An administrator with this email already exists.");
    else console.error(`Failed. ${safeErrorText(e)}`);
    process.exitCode = 1;
  })
  .finally(() => closeDatabase());
