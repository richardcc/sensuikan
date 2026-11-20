const fs = require('fs');
const vm = require('vm');

const dataCode = fs.readFileSync('app/js/data.js', 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataCode, sandbox);

const subs = sandbox.SUB_DB.submarines;
const keys = Object.keys(subs);
console.log(`Total submarines in SUB_DB: ${keys.length}`);

const requiredFields = [
  'class_name', 'full_title', 'available_date', 'patrol_length',
  'torpedo_tubes', 'reload_capacity', 'deck_guns', 'stats', 'special_rules'
];

let allOk = true;
for (const k of keys) {
  const s = subs[k];
  for (const rf of requiredFields) {
    if (s[rf] === undefined || s[rf] === null) {
      console.error(`Submarine ${k} is missing field: ${rf}`);
      allOk = false;
    }
  }
}

if (allOk) {
  console.log("✅ All 24 submarines have all required fields in SUB_DB!");
}
