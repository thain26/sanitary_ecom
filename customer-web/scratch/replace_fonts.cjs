const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('d:/do_an_p1/sanitary_ecom/customer-web/src');
let updatedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Replace fontFamily: 'Jost', fontFamily: 'Outfit, sans-serif', etc.
    const newContent = content.replace(/fontFamily:\s*['"][A-Za-z\s,]+['"]/g, "fontFamily: 'Be Vietnam Pro, sans-serif'");
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Updated: ' + file);
        updatedCount++;
    }
});

console.log(`Updated ${updatedCount} files.`);
