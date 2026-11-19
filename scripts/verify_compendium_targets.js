const fs = require('fs');

const html = fs.readFileSync('app/index.html', 'utf-8');

console.log("Checking for comp-sec-targets in app/index.html...");
if (html.includes('id="comp-sec-targets"')) {
  console.log("PASS: comp-sec-targets exists!");
} else {
  console.error("FAIL: comp-sec-targets missing!");
}

console.log("Checking for filter button...");
if (html.includes('data-filter="targets"')) {
  console.log("PASS: data-filter='targets' button exists!");
} else {
  console.error("FAIL: data-filter='targets' missing!");
}

console.log("Checking for T1-T5 inside comp-sec-targets...");
const secIndex = html.indexOf('id="comp-sec-targets"');
const secEnd = html.indexOf('</div><!-- /#comp-sec-targets -->');
const secHtml = html.substring(secIndex, secEnd);

if (secHtml.includes('comp-grid-t1') &&
    secHtml.includes('comp-grid-t2') &&
    secHtml.includes('comp-grid-t3') &&
    secHtml.includes('comp-t4-title') &&
    secHtml.includes('comp-grid-t5')) {
  console.log("PASS: All charts T1, T2, T3, T4, T5 are inside comp-sec-targets!");
} else {
  console.error("FAIL: Missing some chart in comp-sec-targets!");
}
