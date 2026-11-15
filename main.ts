// Skill Issue (SKILL) — self-audit checker
// Node 22, standard library only. No network access.
// Copies LAUNCH.json from the bot dir to the output dir (required),
// then runs a small self-audit and prints a pass/fail checklist.
// Exit code is 0 even when audit findings exist — findings are printed,
// not fatal — except when LAUNCH.json cannot be read at all.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR || "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

const BASE58 = /^[1-9A-HJ-NP-Za-km-z]+$/;

function check(label, ok, detail) {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
  return ok;
}

let launchRaw;
try {
  launchRaw = readFileSync(join(botDir, "LAUNCH.json"), "utf8");
} catch (err) {
  console.error(`FATAL: cannot read LAUNCH.json in ${botDir}: ${err.message}`);
  process.exit(1);
}

let launch;
try {
  launch = JSON.parse(launchRaw);
} catch (err) {
  console.error(`FATAL: LAUNCH.json is not valid JSON: ${err.message}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(join(botDir, "LAUNCH.json"), join(outDir, "LAUNCH.json"));
console.log(`Copied LAUNCH.json -> ${join(outDir, "LAUNCH.json")}`);

// Status card: show who launched this coin, from the repo's owner record.
let creatorWallet = "(unknown)";
try {
  const owner = JSON.parse(readFileSync(join(botDir, ".makefun", "owner.json"), "utf8"));
  if (typeof owner.wallet === "string" && owner.wallet.length > 0) {
    creatorWallet = owner.wallet;
  }
} catch {
  // owner record missing or unreadable — keep the audit running.
}
console.log(`creator wallet: ${creatorWallet}`);

console.log("--- SKILL self-audit ---");
let passed = 0;
let total = 0;
function run(label, ok, detail) {
  total += 1;
  if (check(label, ok, detail)) passed += 1;
}

// Mint: base58, 32-44 chars
const mint = typeof launch.mint === "string" ? launch.mint : "";
run("mint is base58", BASE58.test(mint), mint || "(missing)");
run("mint length 32-44", mint.length >= 32 && mint.length <= 44, `length=${mint.length}`);

// Create signature: base58, 64-88 chars
const sig = typeof launch.create_signature === "string" ? launch.create_signature : "";
run("create_signature is base58", BASE58.test(sig), sig ? `${sig.slice(0, 12)}...` : "(missing)");
run("create_signature length 64-88", sig.length >= 64 && sig.length <= 88, `length=${sig.length}`);

// Metadata consistency: metadata.json (if present) must carry the coin
// identity for this launch — a non-empty name and symbol — and, when the
// launch record carries name/symbol fields, they must match exactly.
const metaPath = join(botDir, "metadata.json");
if (existsSync(metaPath)) {
  try {
    const meta = JSON.parse(readFileSync(metaPath, "utf8"));
    run("metadata name present", typeof meta.name === "string" && meta.name.length > 0, meta.name || "");
    run("metadata symbol present", typeof meta.symbol === "string" && meta.symbol.length > 0, meta.symbol || "");
    if (typeof launch.name === "string") {
      run("metadata name matches LAUNCH.json", meta.name === launch.name, `${meta.name} vs ${launch.name}`);
    }
    if (typeof launch.symbol === "string") {
      run("metadata symbol matches LAUNCH.json", meta.symbol === launch.symbol, `${meta.symbol} vs ${launch.symbol}`);
    }
    if (typeof launch.name !== "string" && typeof launch.symbol !== "string") {
      console.log("NOTE LAUNCH.json carries no name/symbol fields; metadata identity shown above.");
    }
  } catch (err) {
    run("metadata.json parses", false, err.message);
  }
} else {
  console.log("NOTE metadata.json not found in bot dir; skipping metadata checks.");
}

console.log(`--- audit: ${passed}/${total} checks passed ---`);
if (passed !== total) {
  console.log("Findings present (non-fatal): review the FAIL lines above. No excuses — skill issue or fix it.");
} else {
  console.log("All checks passed. Proven with work, not words.");
}
process.exit(0);

// revision: wallet5
console.log('audit note: receipts over excuses — every check above ran locally, no network needed.');
