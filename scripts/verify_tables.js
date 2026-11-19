const http = require('http');

// Simple test using CDP or direct DOM check via jsdom/node
const fs = require('fs');

const html = fs.readFileSync('app/index.html', 'utf-8');

console.log("Checking index.html for abort table...");
if (html.includes('id="p4-th-abort-cond"') && html.includes('id="p4-abort-fuel-title"')) {
  console.log("PASS: Abort table present!");
} else {
  console.error("FAIL: Abort table missing!");
}

console.log("Checking index.html for key station penalties table...");
if (html.includes('id="p4-th-pen-post"') && html.includes('id="p4-pen-title-captain"')) {
  console.log("PASS: Penalties table present!");
} else {
  console.error("FAIL: Penalties table missing!");
}

console.log("Checking gameflow_phase4_5.js for renderB7CasualtyTableHtml...");
const p4js = fs.readFileSync('app/js/gameflow_phase4_5.js', 'utf-8');
if (p4js.includes('renderB7CasualtyTableHtml') && p4js.includes('applyP4B7Tabletop')) {
  console.log("PASS: renderB7CasualtyTableHtml and tabletop function present in Phase 4!");
} else {
  console.error("FAIL: Missing functions in Phase 4!");
}

console.log("Checking gameflow_phase2.js for renderB7CasualtyTableHtml integration...");
const p2js = fs.readFileSync('app/js/gameflow_phase2.js', 'utf-8');
if (p2js.includes('renderB7CasualtyTableHtml')) {
  console.log("PASS: Patrol air encounter uses table format for casualties!");
} else {
  console.error("FAIL: Patrol air encounter missing table format!");
}
