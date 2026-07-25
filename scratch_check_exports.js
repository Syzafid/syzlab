const fs = require('fs');
const path = require('path');

const modulesDir = 'js/modules';
const files = fs.readdirSync(modulesDir).filter(f => f.endsWith('.js'));

const exportsMap = {};

files.forEach(f => {
  const code = fs.readFileSync(path.join(modulesDir, f), 'utf8');
  const set = new Set();
  const reg = /export\s+(?:function|let|const|var|class)\s+([^;\n]+)/g;
  let m;
  while ((m = reg.exec(code)) !== null) {
    const decl = m[1].trim();
    // Handles functions like "setScene(val) {" or variables like "scene, camera, renderer"
    const names = decl.split(',').map(s => {
      let cleaned = s.trim();
      const fnMatch = cleaned.match(/^([a-zA-Z0-9_$]+)\s*\(/);
      if (fnMatch) return fnMatch[1];
      const eqMatch = cleaned.match(/^([a-zA-Z0-9_$]+)\s*=/);
      if (eqMatch) return eqMatch[1];
      const spaceMatch = cleaned.match(/^([a-zA-Z0-9_$]+)/);
      if (spaceMatch) return spaceMatch[1];
      return cleaned;
    });
    names.forEach(n => { if (n) set.add(n); });
  }
  exportsMap['./' + f] = set;
  exportsMap['./modules/' + f] = set;
});

let errors = 0;
const allFiles = ['js/app.js', ...files.map(f => 'js/modules/' + f)];

allFiles.forEach(fp => {
  const code = fs.readFileSync(fp, 'utf8');
  const reg = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
  let m;
  while ((m = reg.exec(code)) !== null) {
    const syms = m[1].split(',').map(s => s.trim().split(' as ')[0].trim());
    const src = m[2];
    if (exportsMap[src]) {
      syms.forEach(s => {
        if (s && !exportsMap[src].has(s)) {
          console.error(`❌ MISSING EXPORT in ${fp}: "${s}" is imported from "${src}", but "${src}" does NOT export it!`);
          errors++;
        }
      });
    }
  }
});

if (errors === 0) {
  console.log('🎉 ALL IMPORTS AND EXPORTS MATCHED 100% PERFECTLY!');
} else {
  console.log(`❌ FOUND ${errors} MISSING EXPORT ERRORS!`);
}
