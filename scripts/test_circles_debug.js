const fs = require('fs');
const html = fs.readFileSync('app/index.html', 'utf8');
console.log('Interactive overlay present:', html.includes('id="air-map-interactive-overlay"'));
console.log('selectAircraftMap present:', html.includes('selectAircraftMap'));
