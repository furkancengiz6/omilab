const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file === 'page.js') {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('alert(')) {
        content = content.replace(/alert\(/g, 'toast.error(');
        if (!content.includes("import toast")) {
          // import'u 2. satıra ekleyelim (genellikle "use client" 1. satırdadır)
          const lines = content.split('\n');
          if (lines[0].includes('use client')) {
            lines.splice(1, 0, "import toast from 'react-hot-toast';");
          } else {
            lines.unshift("import toast from 'react-hot-toast';");
          }
          content = lines.join('\n');
        }
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'src/app'));
console.log("Done.");
