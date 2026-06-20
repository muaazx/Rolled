const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Remove dark: classes
      if (content.includes('dark:')) {
        content = content.replace(/dark:[^\s"'\`]+/g, '');
        changed = true;
      }

      // Fix table tag
      if (content.match(/<table className="[^"]*"/)) {
        content = content.replace(/<table className="[^"]*"/g, '<table className="data-table"');
        changed = true;
      }

      // Fix thead tag
      if (content.match(/<thead className="[^"]*"/)) {
        content = content.replace(/<thead className="[^"]*"/g, '<thead');
        changed = true;
      }

      // Specific fixes for employees/page.tsx
      if (file === 'page.tsx' && fullPath.includes('employees')) {
        // Change the gradient header of the card to a solid light color
        content = content.replace(/bg-gradient-to-r from-gray-100 to-gray-50/g, 'bg-[#EBE8FC]');
        changed = true;
      }

      if (changed) {
        // cleanup extra spaces created by removing classes
        content = content.replace(/ \s+/g, ' ');
        fs.writeFileSync(fullPath, content);
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir('./app');
processDir('./components');
