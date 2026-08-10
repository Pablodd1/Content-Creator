const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// State for documents
code = code.replace(
  "const [contextText, setContextText] = useState('');",
  "const [contextText, setContextText] = useState('');\n  const [docs, setDocs] = useState(['Ficha técnica.pdf', 'Referencia_producto.jpg', 'Guion_base.docx']);"
);

// New Project
code = code.replace(
  /<button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-sans text-sm font-semibold rounded-md transition-all shadow-sm">/,
  `<button onClick={() => { setContextText(''); setGeneratedText(''); setDocs(['Ficha técnica.pdf']); setActiveTab('context'); }} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-sans text-sm font-semibold rounded-md transition-all shadow-sm">`
);

// Bell
code = code.replace(
  /<button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">/,
  `<button onClick={() => alert(language === 'EN' ? 'No new notifications' : 'Sin nuevas notificaciones')} className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">`
);

// Context Documents
const docsReplacement = `
              <div className="flex flex-wrap gap-3 mb-4">
                {docs.map(doc => (
                  <div key={doc} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-slate-700 shadow-sm">
                    <div className="p-1 bg-blue-100 text-blue-600 rounded"><FileText size={14}/></div>
                    <span>{doc}</span>
                    <button onClick={() => setDocs(docs.filter(d => d !== doc))} className="ml-2 text-slate-400 hover:text-slate-600">×</button>
                  </div>
                ))}
              </div>
`;
code = code.replace(
  /<div className="flex flex-wrap gap-3 mb-4">[\s\S]*?<\/div>\s*<div className="relative">/,
  docsReplacement + '\n              <div className="relative">'
);

// File add buttons
code = code.replace(
  /<button className="flex items-center gap-1.5 text-xs font-semibold hover:text-slate-800 transition-colors bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">\s*<ImageIcon size=\{14\} \/> Imagen\s*<\/button>/,
  `<button onClick={() => setDocs([...docs, 'nueva_imagen.jpg'])} className="flex items-center gap-1.5 text-xs font-semibold hover:text-slate-800 transition-colors bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">\n                    <ImageIcon size={14} /> Imagen\n                  </button>`
);
code = code.replace(
  /<button className="flex items-center gap-1.5 text-xs font-semibold hover:text-slate-800 transition-colors bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">\s*<FileText size=\{14\} \/> Documento\s*<\/button>/,
  `<button onClick={() => setDocs([...docs, 'nuevo_documento.pdf'])} className="flex items-center gap-1.5 text-xs font-semibold hover:text-slate-800 transition-colors bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">\n                    <FileText size={14} /> Documento\n                  </button>`
);

// Schedule Button
code = code.replace(
  /<button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm">\s*<Calendar size=\{14\} \/>\s*\{language === 'EN' \? 'Schedule' : 'Programar publicaciones'\}\s*<\/button>/,
  `<button onClick={() => alert(language === 'EN' ? 'Scheduled successfully!' : '¡Programado exitosamente!')} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm">\n                        <Calendar size={14} />\n                        {language === 'EN' ? 'Schedule' : 'Programar publicaciones'}\n                      </button>`
);

fs.writeFileSync('src/App.tsx', code);
