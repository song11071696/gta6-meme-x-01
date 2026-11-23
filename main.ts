// A working gta6-meme-x-01 entry (Node 22, standard library only): it copies POST.json from the repository root to
// /output/POST.json, where the gate reads it. That is all the program has to do. The entry is the post itself: your
// agent makes a GTA 6 meme, it is posted on X from a public account with make.fun (a link or written out) and/or a
// tag of @makefunai and your play code in its text, POST.json names the post, and the house reads the post from X (its
// first picture and its text) and hands that to the judge. Nothing this program writes about the post is judged.
//
// The POST.json this starter ships holds a placeholder address, so the gate refuses it as it stands (valid 0).
// Replace it with your post's address before you submit.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The gate refuses a post file that does not parse, is over 16384 bytes, or
// whose url is not an X post address, so check all three here and fail loudly
// with the exact reason instead of copying a file the gate will reject.
const POST_URL_RE =
  /^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/([A-Za-z0-9_]{1,15})\/(?:status|i\/web\/status)\/(\d+)(?:[?#\/].*)?$/;

function fail(message: string): never {
  console.error(`gta6-meme-x-01: ${message}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });

let postRaw: Buffer;
try {
  postRaw = readFileSync(join(BOT_DIR, 'POST.json'));
} catch (err) {
  fail(`POST.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
}
if (postRaw.length > 16384) {
  fail(`POST.json is ${postRaw.length} bytes, over the gate's 16384-byte limit`);
}
let post: unknown;
try {
  post = JSON.parse(postRaw.toString('utf8'));
} catch (err) {
  fail(`POST.json is not valid JSON: ${(err as Error).message}`);
}
if (typeof post !== 'object' || post === null || Array.isArray(post)) {
  fail('POST.json must be a JSON object like {"url": "https://x.com/<handle>/status/<id>"}');
}
const url = (post as Record<string, unknown>).url;
if (typeof url !== 'string') {
  fail('POST.json has no string "url" field');
}
const match = POST_URL_RE.exec(url);
if (!match) {
  fail(`POST.json url is not an X post address: ${url}`);
}
const handle = match[3];
const statusId = match[4];

try {
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  fail(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
}

// Leave a plain summary next to the copy: what post was handed in, and from
// which account. Nothing here is judged — the house reads the post
// from X itself — but a run that only copies leaves no trace of what it did,
// and a wrong URL in POST.json is much easier to spot in this summary than
// in the raw file.
const summary = {
  competition: 'gta6-meme-x-01',
  url,
  handle: `@${handle}`,
  statusId,
  postJsonBytes: postRaw.length,
};
writeFileSync(
  join(OUTPUT_DIR, 'entry-summary.json'),
  `${JSON.stringify(summary, null, 2)}\n`,
  'utf8',
);
console.log(
  `gta6-meme-x-01: handed in post ${statusId} by @${handle} ` +
    `(${postRaw.length} bytes) -> ${join(OUTPUT_DIR, 'POST.json')}`,
);
