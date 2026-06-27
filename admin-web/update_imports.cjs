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

const files = walk('d:/do_an_p1/sanitary_ecom/admin-web/src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if file imports message from antd
    const antdImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]antd['"]/;
    const match = content.match(antdImportRegex);
    
    if (match && match[1].includes('message')) {
        // Remove message from antd import
        let newImport = match[1].split(',').map(s => s.trim()).filter(s => s !== 'message').join(', ');
        
        let newContent = content;
        if (newImport.length > 0) {
            newContent = newContent.replace(match[0], `import { ${newImport} } from 'antd'`);
        } else {
            // Remove the whole import line if message was the only one
            newContent = newContent.replace(match[0] + '\n', '');
            newContent = newContent.replace(match[0] + ';', '');
            newContent = newContent.replace(match[0], '');
        }
        
        // Add import { message } from utils/AntdGlobalContext
        // Determine relative path depth
        const rel = path.relative(path.dirname(file), 'd:/do_an_p1/sanitary_ecom/admin-web/src/utils/AntdGlobalContext');
        let importPath = rel.replace(/\\/g, '/');
        if (!importPath.startsWith('.')) {
            importPath = './' + importPath;
        }
        
        newContent = `import { message } from '${importPath}';\n` + newContent;
        
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Updated ' + file);
    }
});
