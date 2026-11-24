/**
 * Checks whether the website information inside public/bhy-chatbot.js is still current.
 *   npm run chatbot:check
 * Run it after changing doctors on the website. It never modifies anything. Exit code 1 = the chatbot needs refreshing.
 */
import { verifiedDoctors } from "../src/data/doctors";
import { CHATBOT_PATH, compareWebDirectory, extractArray, readChatbot, type WebRow } from "./chatbot-data";

const src = readChatbot();
const web = extractArray<WebRow[]>(src, "WEB");
const docs = extractArray<unknown[][]>(src, "DOCS");
const drift = compareWebDirectory(web, verifiedDoctors);

console.log(`Chatbot file: ${CHATBOT_PATH}`);
console.log(`Website directory in chatbot: ${web.length} doctors | website data: ${verifiedDoctors.length} doctors | schedule file: ${docs.length} doctors`);
if (!drift.length) {
  console.log("OK: the website information in the chatbot matches the website.");
} else {
  console.log(`\n${drift.length} difference(s) found:`);
  for (const d of drift) console.log(` - ${d.slug}: ${d.problem}`);
  console.log("\nHow to refresh: update the WEB array in public/bhy-chatbot.js (see docs/CHATBOT.md). The approved Excel schedule (DOCS) is not changed by this check.");
  process.exit(1);
}
