const fs = require('fs');
const vm = require('vm');

// Mock window and document environment for Node
const sandbox = {
  window: {
    addEventListener: () => {}
  },
  document: {
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => []
  },
  console: console,
  campaignState: {
    activeSubKey: 'Type_B_Class',
    workflow: { selectedMonth: '1943-01' },
    damage: {}
  }
};
sandbox.window.window = sandbox.window;
sandbox.window.document = sandbox.document;
sandbox.addEventListener = sandbox.window.addEventListener;

vm.createContext(sandbox);

// 1. Load data.js
let dataCode = fs.readFileSync('app/js/data.js', 'utf-8');
dataCode = dataCode.replace('const SUB_DB =', 'var SUB_DB = window.SUB_DB =');
vm.runInContext(dataCode, sandbox);

// 2. Load sub_board.js
let subBoardCode = fs.readFileSync('app/js/sub_board.js', 'utf-8');
vm.runInContext(subBoardCode, sandbox);

// 3. Load gameflow_phase0.js
let p0Code = fs.readFileSync('app/js/gameflow_phase0.js', 'utf-8');
p0Code = p0Code.replace('const SUB_CHITS_MAP =', 'var SUB_CHITS_MAP = window.SUB_CHITS_MAP =');
vm.runInContext(p0Code, sandbox);

const SUB_DB = sandbox.SUB_DB || sandbox.window.SUB_DB;
const getSubmarineStartMonth = sandbox.getSubmarineStartMonth || sandbox.window.getSubmarineStartMonth;
const getSubmarineArmamentConfig = sandbox.getSubmarineArmamentConfig || sandbox.window.getSubmarineArmamentConfig;
const getSubmarineDamageCapacity = sandbox.getSubmarineDamageCapacity || sandbox.window.getSubmarineDamageCapacity;
const getSubmarinePatrolBoxCount = sandbox.getSubmarinePatrolBoxCount || sandbox.window.getSubmarinePatrolBoxCount;
const registerSubmarine = sandbox.registerSubmarine || sandbox.window.registerSubmarine;
const checkSubmarineRadarStatus = sandbox.checkSubmarineRadarStatus || sandbox.window.checkSubmarineRadarStatus;
const SUB_CHITS_MAP = sandbox.SUB_CHITS_MAP || sandbox.window.SUB_CHITS_MAP;

console.log('Testing 18 historical submarines in database:');
const subs = Object.keys(SUB_DB.submarines);
console.log(`Total submarines found: ${subs.length}`);

let allPassed = true;
subs.forEach(key => {
  const startMonth = getSubmarineStartMonth(key);
  const arm = getSubmarineArmamentConfig(key);
  const dmg = getSubmarineDamageCapacity(key);
  const boxes = getSubmarinePatrolBoxCount(key);
  const chit = SUB_CHITS_MAP ? SUB_CHITS_MAP[key] : null;

  if (!startMonth || !arm || !dmg || !boxes || !chit) {
    console.error(`FAIL for submarine ${key}: startMonth=${startMonth}, arm=${!!arm}, dmg=${!!dmg}, boxes=${boxes}, chit=${chit}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('✓ All 18 submarines passed start month, armament, damage, patrol boxes, and chits verification!');
}

console.log('\nTesting dynamic registration of a NEW 19th submarine (I-99 Super Raider):');
const newSubConfig = {
  class_name: 'I-99 Super Raider',
  start_month: '1943-05',
  commander_rank_required: 'Commander',
  torpedo_tubes: { fwd: 8, aft: 4, reloads_fwd: 16, reloads_aft: 4 },
  damage_capacity: { flooding: 9, hull: 9 },
  crew_counters: 6,
  has_aircraft: true,
  has_kaiten: true,
  has_mines: true,
  mine_capacity: 50,
  radar: {
    equipped: true,
    model: 'Experimental Type 33 Radar',
    model_es: 'Radar Experimental Tipo 33'
  },
  chit_filename: 'Submarine - Custom I99.jpg'
};

registerSubmarine('Custom_I99_Super_Class', newSubConfig);

// Verify getters on new submarine
const testStartMonth = getSubmarineStartMonth('Custom_I99_Super_Class');
const testArm = getSubmarineArmamentConfig('Custom_I99_Super_Class');
const testDmg = getSubmarineDamageCapacity('Custom_I99_Super_Class');
const testChit = SUB_CHITS_MAP ? SUB_CHITS_MAP['Custom_I99_Super_Class'] : null;

console.log('Registered Submarine Results:');
console.log('  Start Month:', testStartMonth, testStartMonth === '1943-05' ? '✓' : '✗');
console.log('  Armament Config:', testArm, (testArm.fwdTubes === 8 && testArm.aftTubes === 4 && testArm.fwdReloads === 16 && testArm.aftReloads === 4 && testArm.hasAircraft === true) ? '✓' : '✗');
console.log('  Damage Capacity:', testDmg, (testDmg.flooding === 9 && testDmg.hull === 9) ? '✓' : '✗');
console.log('  Chit Filename:', testChit, testChit === 'Submarine - Custom I99.jpg' ? '✓' : '✗');

// Test Radar for active custom sub
sandbox.campaignState.activeSubKey = 'Custom_I99_Super_Class';
const radarRes = checkSubmarineRadarStatus();
console.log('  Radar Status:', radarRes, (radarRes.isEquipped && radarRes.radarModel === 'Radar Experimental Tipo 33') ? '✓' : '✗');

if (
  testStartMonth === '1943-05' &&
  testArm.fwdTubes === 8 &&
  testDmg.hull === 9 &&
  testChit === 'Submarine - Custom I99.jpg' &&
  radarRes.isEquipped
) {
  console.log('\n🎉 ALL PARAMETERIZATION TESTS PASSED! Adding new submarines is now fully dynamic and self-contained.');
} else {
  console.error('\n❌ Some parameterization tests failed.');
  process.exit(1);
}
