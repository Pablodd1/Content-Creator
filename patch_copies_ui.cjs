const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Inside the Copies UI, we have a clipboard button. Let's make sure it copies text and add a download button.
code = code.replace(
  '<div className="bg-slate-50 border border-gray-200 rounded-xl p-4 relative group">',
  '<div className="bg-slate-50 border border-gray-200 rounded-xl p-4 relative group" id="copy-text-container">'
);

// We need to implement the clipboard button functionality.
const actionsReplacement = `
                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={handleExport} title="Download" className="p-1.5 bg-white text-slate-600 hover:text-blue-600 rounded-md shadow-sm border border-gray-200"><Download size={14}/></button>
                      <button onClick={() => { if(generatedText) { navigator.clipboard.writeText(generatedText); alert("Copied!"); } }} title="Copy" className="p-1.5 bg-white text-slate-600 hover:text-blue-600 rounded-md shadow-sm border border-gray-200"><Copy size={14} /></button>
                    </div>
`;

// wait, the original had PenTool, ↻, 📋
code = code.replace(
  /<div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">[\s\S]*?<\/div>/,
  actionsReplacement
);

fs.writeFileSync('src/App.tsx', code);
