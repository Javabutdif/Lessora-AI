// Set a new password for an existing Lessora admin account.
//
// Run from the repo root (loads MONGODB_URI / MONGODB_DBNAME from .env without printing them):
//   node --env-file=.env scripts/set-admin-password.mjs
// or use scripts/set-admin-password.ps1 / scripts/set-admin-password.sh
//
// The password is typed into a hidden prompt and never written to disk or logs.
// Only an existing admin is updated; no account is created.

import { createInterface } from "node:readline";
import { stdin, stdout, exit } from "node:process";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const DEFAULT_EMAIL = "admin@lessora.com";
const MIN_LENGTH = 15; // NIST 800-63B minimum without MFA
const MAX_LENGTH = 128; // matches loginSchema in src/lib/services/admin-auth.service.ts
const BCRYPT_COST = 12;

const rl = createInterface({ input: stdin, output: stdout, terminal: Boolean(stdin.isTTY) });
let muted = false;
const writeToOutput = rl._writeToOutput.bind(rl);
rl._writeToOutput = (text) => {
  if (!muted) writeToOutput(text);
};

// The async iterator buffers lines, so answers piped in all at once are not dropped
const lines = rl[Symbol.asyncIterator]();

async function ask(question, { hidden = false } = {}) {
  stdout.write(question);
  muted = hidden;
  const { value, done } = await lines.next();
  muted = false;
  if (hidden) stdout.write("\n");
  return done ? "" : value;
}

function fail(message) {
  console.error(`Error: ${message}`);
  rl.close();
  exit(1);
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME || "lessora";
if (!uri) {
  fail("MONGODB_URI is not set. Run with: node --env-file=.env scripts/set-admin-password.mjs");
}

const emailInput = (await ask(`Admin email [${DEFAULT_EMAIL}]: `)).trim().toLowerCase();
const email = emailInput || DEFAULT_EMAIL;

const password = await ask(`New password (min ${MIN_LENGTH} characters, input hidden): `, { hidden: true });
if (password.length < MIN_LENGTH) fail(`Password must be at least ${MIN_LENGTH} characters.`);
if (password.length > MAX_LENGTH) fail(`Password must be ${MAX_LENGTH} characters or less.`);

const confirmation = await ask("Repeat new password: ", { hidden: true });
if (confirmation !== password) fail("Passwords do not match.");
rl.close();

try {
  await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 10_000 });
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  const result = await mongoose.connection
    .collection("adminusers")
    .updateOne({ email }, { $set: { passwordHash, updatedAt: new Date() } });

  if (result.matchedCount === 0) {
    console.error(`No admin account found for ${email}. Nothing changed.`);
    process.exitCode = 1;
  } else {
    console.log(`Password updated for ${email}. Sign in again with the new password.`);
  }
} catch (error) {
  console.error(`Could not update the password: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect().catch(() => {});
}
