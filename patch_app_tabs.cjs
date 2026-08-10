const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace everything inside the main element to support conditional rendering, or at least conditionally show them.
const oldMainStart = '<main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">';
const oldMainEnd = '</main>';

// Let's just do simple string replacements for each section to wrap them conditionally.
code = code.replace(
  /{[\s\S]*?\/\* Context Section \*\//,
  (match) => match.replace('/* Context Section */', '{activeTab === "context" && (\n/* Context Section */')
);

code = code.replace(
  /{[\s\S]*?\/\* Copies & Keywords Row \*\//,
  (match) => match.replace('/* Copies & Keywords Row */', ')}\n{ (activeTab === "copies" || activeTab === "keywords") && (\n/* Copies & Keywords Row */')
);

code = code.replace(
  /{[\s\S]*?\/\* Generate Video - Full Width \*\//,
  (match) => match.replace('/* Generate Video - Full Width */', ')}\n{ activeTab === "video" && (\n/* Generate Video - Full Width */')
);

code = code.replace(
  /{[\s\S]*?\/\* Bottom Row \*\//,
  (match) => match.replace('/* Bottom Row */', ')}\n{ (activeTab === "image" || activeTab === "calendar") && (\n/* Bottom Row */')
);

// We need to close the last one before </main>
code = code.replace(
  /<\/div>\s*<\/main>/,
  ')}\n</div>\n</main>'
);

// Also we need to split the Bottom Row which contains BOTH Image and Scheduling
code = code.replace(
  /<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">[\s\S]*?{activeTab === "image" \? \(/, // not exactly, I will write a smarter script.
  ""
);

fs.writeFileSync('patch_temp.js', '');
