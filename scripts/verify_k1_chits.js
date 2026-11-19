const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('app/index.html', 'utf-8');

// Check that tokens contain k1-chit-img
const matches = html.match(/class="k1-chit-img"/g);
console.log(`Total k1-chit-img occurrences in app/index.html: ${matches ? matches.length : 0}`);

// Check that specific tokens exist and have img tags
const checkTokens = [
  'token-optional',
  'token-midget-torp',
  'token-air1-weap',
  'token-cap-shibumi',
  'token-cap-leadership',
  'token-cap-torp',
  'token-rank',
  'token-medal-gk4',
  'token-medal-rising',
  'token-medal-wound',
  'token-sub-upgrades',
  'token-maneki-neko',
  'token-xo-vigilant',
  'token-eng-mech',
  'token-nav-expert',
  'token-med-expert',
  'token-kaiten-1'
];

let allOk = true;
for (const tid of checkTokens) {
  const reg = new RegExp(`<div id="${tid}"[^>]*>[\\s\\S]*?<img[^>]+src="assets/tokens/([^"]+)"`);
  const m = html.match(reg);
  if (m) {
    console.log(`✓ ${tid} -> ${m[1]}`);
  } else {
    console.log(`✗ ${tid} -> NOT FOUND`);
    allOk = false;
  }
}

if (allOk) {
  console.log('\nALL CHECKED TOKENS VERIFIED SUCCESSFULLY!');
} else {
  console.error('\nSOME TOKENS FAILED VERIFICATION');
  process.exit(1);
}
