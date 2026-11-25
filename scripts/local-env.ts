/**
 * Loads environment variables from a local, git-ignored env file (for example one created with `vercel env pull .env.local`)
 * so the database commands can find the connection strings without them being typed on the command line.
 * Variables that are already set in the shell are never overridden. Nothing is printed.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

export function loadLocalEnv(): void {
  const load = (process as unknown as { loadEnvFile?: (path: string) => void }).loadEnvFile;
  if (typeof load !== "function") return; // Node older than 20.12: set the variables in the shell instead (see docs/ADMIN-SETUP.md)
  for (const name of [".env.local", ".env"]) {
    const file = join(process.cwd(), name);
    if (existsSync(file)) load.call(process, file);
  }
}
