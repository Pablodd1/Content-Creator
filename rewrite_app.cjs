const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// I will just read it, and carefully insert the conditions.
// We can use a regex that matches the sections by their headers.

// 1. Context Section
code = code.replace(
  /<section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">\s*<div className="flex items-center gap-3 mb-6">/g,
  '{activeTab === "context" && (<section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">\n              <div className="flex items-center gap-3 mb-6">'
);
code = code.replace(
  /<\/button>\s*<\/div>\s*<\/section>\s*\{\/\* Copies & Keywords Row \*\/\}/g,
  '</button>\n              </div>\n            </section>)}\n\n            {/* Copies & Keywords Row */}'
);

// 2. Copies & Keywords Row
code = code.replace(
  /<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">\s*<section className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">/g,
  '{(activeTab === "copies" || activeTab === "keywords") && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">\n              <section className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">'
);
code = code.replace(
  /<\/button>\s*<\/div>\s*<\/section>\s*<\/div>\s*\{\/\* Generate Video - Full Width \*\/\}/g,
  '</button>\n                  </div>\n               </section>\n            </div>)}\n\n            {/* Generate Video - Full Width */}'
);

// 3. Generate Video
code = code.replace(
  /<div id="video" className="w-full">/g,
  '{activeTab === "video" && (<div id="video" className="w-full">'
);
code = code.replace(
  /showToast=\{\(\) => \{\}\}\s*\/>\s*<\/div>\s*\{\/\* Bottom Row \*\/\}/g,
  'showToast={() => {}}\n              />\n            </div>)}\n\n            {/* Bottom Row */}'
);

// 4. Bottom Row
// Wait, the bottom row has Image & Thumbnail AND Scheduling in a single grid.
// Let's wrap the whole grid if either image or calendar is active, OR we can split them.
// Let's just conditionally render the entire bottom row if it's "image" or "calendar" or "export".
code = code.replace(
  /<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">\s*\{\/\* Image & Thumbnail \*\/\}/g,
  '{(activeTab === "image" || activeTab === "calendar" || activeTab === "export") && (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">\n              {/* Image & Thumbnail */}'
);
code = code.replace(
  /<\/section>\s*<\/div>\s*<\/div>\s*<\/main>/g,
  '</section>\n\n            </div>)}\n\n          </div>\n        </main>'
);

fs.writeFileSync('src/App.tsx', code);
