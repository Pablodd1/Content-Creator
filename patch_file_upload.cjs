const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add a useRef for the file input
code = code.replace(
  "import { useState } from 'react';",
  "import { useState, useRef } from 'react';"
);

code = code.replace(
  "const [generatedImg, setGeneratedImg] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=200');",
  "const [generatedImg, setGeneratedImg] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=200');\n  const fileInputRef = useRef<HTMLInputElement>(null);\n  const imageInputRef = useRef<HTMLInputElement>(null);"
);

// Add handleFileUpload functions
const fileHandlers = `
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setDocs([...docs, file.name]);
    
    // Si es un archivo de texto, leemos su contenido y lo agregamos al contexto
    if (file.type === 'text/plain' || file.type === 'text/csv' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          setContextText(prev => prev + (prev ? '\\n\\n' : '') + \`--- Contenido de \${file.name} ---\\n\` + text);
        }
      };
      reader.readAsText(file);
    } else {
       // Mock for non text files like PDF or DOCX
       setContextText(prev => prev + (prev ? '\\n\\n' : '') + \`[El documento \${file.name} ha sido adjuntado. Su contenido será analizado en la nube para la campaña.]\`);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocs([...docs, file.name]);
  };
`;

code = code.replace(
  "const handleGenerateContent = async () => {",
  fileHandlers + "\n\n  const handleGenerateContent = async () => {"
);

// Update buttons in UI
const buttonsOld = `<button \n                      onClick={() => setDocs([...docs, \`Imagen_Referencia_\${docs.length + 1}.jpg\`])} \n                      className="flex items-center gap-1.5 text-xs font-semibold hover:text-slate-800 transition-colors bg-white px-2.5 py-1 rounded border border-gray-200 shadow-sm cursor-pointer"\n                    >\n                      <ImageIcon size={14} className="text-purple-600" /> + Imagen\n                    </button>\n                    <button \n                      onClick={() => setDocs([...docs, \`Documento_Campana_\${docs.length + 1}.pdf\`])} \n                      className="flex items-center gap-1.5 text-xs font-semibold hover:text-slate-800 transition-colors bg-white px-2.5 py-1 rounded border border-gray-200 shadow-sm cursor-pointer"\n                    >\n                      <FileText size={14} className="text-blue-600" /> + Documento\n                    </button>`;

const buttonsNew = `<input type="file" className="hidden" ref={imageInputRef} accept="image/*" onChange={handleImageUpload} />
                    <input type="file" className="hidden" ref={fileInputRef} accept=".txt,.pdf,.docx,.doc,.csv" onChange={handleFileUpload} />
                    
                    <button 
                      onClick={() => imageInputRef.current?.click()} 
                      className="flex items-center gap-1.5 text-xs font-semibold hover:text-slate-800 transition-colors bg-white px-2.5 py-1 rounded border border-gray-200 shadow-sm cursor-pointer"
                    >
                      <ImageIcon size={14} className="text-purple-600" /> + Imagen
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      className="flex items-center gap-1.5 text-xs font-semibold hover:text-slate-800 transition-colors bg-white px-2.5 py-1 rounded border border-gray-200 shadow-sm cursor-pointer"
                    >
                      <FileText size={14} className="text-blue-600" /> + Documento
                    </button>`;

code = code.replace(buttonsOld, buttonsNew);

// Actually the old code might have slightly different whitespace. Let's do a smarter replace.
code = code.replace(/<button[^>]*onClick=\{\(\) => setDocs\(\[\.\.\.docs, \`Imagen_Referencia_\$\{docs\.length \+ 1\}\.jpg\`\]\)\}[^>]*>[\s\S]*?<\/button>/, '');
code = code.replace(/<button[^>]*onClick=\{\(\) => setDocs\(\[\.\.\.docs, \`Documento_Campana_\$\{docs\.length \+ 1\}\.pdf\`\]\)\}[^>]*>[\s\S]*?<\/button>/, buttonsNew);


fs.writeFileSync('src/App.tsx', code);
