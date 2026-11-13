#!/usr/bin/env node
// PreToolUse guard for the Resend MCP tools.
// Blocks any send that could reach real people.
// Exit 0 = allow. Exit 2 = block (the reason on stderr is shown to Claude).

const ALLOWED_DOMAIN = "@resend.dev";

// These can reach whole lists of people, so they are always blocked.
const ALWAYS_BLOCK = new Set([
  "send-broadcast",
  "create-automation",
  "send-inbox-draft",
  "send-new-inbox-email",
]);

// These answer or pass on real inbox mail, so they can reach real people.
const INBOX_REPLIES = new Set([
  "reply-to-inbox-thread-email",
  "forward-inbox-thread-email",
]);

// These are checked address by address.
const CHECKED_SENDS = new Set(["send-email", "send-batch-emails"]);

function block(reason) {
  process.stderr.write(`Send guard: ${reason}\n`);
  process.exit(2);
}

// Accepts a string or an array. Pulls the address out of "Name <a@b.com>".
function addresses(value) {
  if (value == null) return [];
  const list = Array.isArray(value) ? value : [value];
  return list.map((item) => {
    const text = String(item).trim();
    const match = text.match(/<([^>]+)>/);
    return (match ? match[1] : text).trim().toLowerCase();
  });
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

let call;
try {
  call = JSON.parse(await readStdin());
} catch {
  // If we can't read the call, we can't check it. Fail closed.
  block("could not read the tool call, so it was blocked to be safe.");
}

const toolName = String(call?.tool_name ?? "");
const shortName = toolName.replace(/^mcp__resend__/, "");
const input = call?.tool_input ?? {};

if (ALWAYS_BLOCK.has(shortName)) {
  block(
    `${shortName} is always blocked because it can reach whole lists of people. ` +
      "Use send-email to a @resend.dev test address or the owner's own address instead."
  );
}

if (INBOX_REPLIES.has(shortName)) {
  block(
    `${shortName} is always blocked because it replies to or forwards real mail, ` +
      "which can reach real people. Save a draft instead."
  );
}

if (!CHECKED_SENDS.has(shortName)) {
  process.exit(0);
}

const myEmail = (process.env.MY_EMAIL ?? "").trim().toLowerCase();

// send-email has one message. send-batch-emails has a list of them.
const messages =
  shortName === "send-batch-emails"
    ? Array.isArray(input.emails) ? input.emails : []
    : [input];

const recipients = messages.flatMap((msg) => [
  ...addresses(msg?.to),
  ...addresses(msg?.cc),
  ...addresses(msg?.bcc),
]);

if (recipients.length === 0) {
  block(`${shortName} has no recipients to check, so it was blocked to be safe.`);
}

const notAllowed = recipients.filter(
  (addr) => !addr.endsWith(ALLOWED_DOMAIN) && !(myEmail && addr === myEmail)
);

if (notAllowed.length > 0) {
  const rule = myEmail
    ? `Only ${ALLOWED_DOMAIN} test addresses and the owner's own address are allowed.`
    : `Only ${ALLOWED_DOMAIN} test addresses are allowed (MY_EMAIL is not set).`;
  block(`blocked sending to ${notAllowed.join(", ")}. ${rule}`);
}

process.exit(0);
