const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add states
code = code.replace(
  "const [activeTab, setActiveTab] = useState('context');",
  "const [activeTab, setActiveTab] = useState('context');\n  const [contextText, setContextText] = useState('');\n  const [generatedText, setGeneratedText] = useState('');\n  const [isGenerating, setIsGenerating] = useState(false);\n  const [isGeneratingImg, setIsGeneratingImg] = useState(false);\n  const [generatedImg, setGeneratedImg] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=200');"
);

// Add generate content function
const generateFn = `
  const handleGenerateContent = async () => {
    if (!contextText.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-universal-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          want: contextText,
          language,
          title: "Electric charger monitor locator and website for Colombia",
          target: "EV owners and operators in Colombia",
          objective: "Promote the fast response and efficiency of the locator app",
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedText(data.text);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error generating content');
    }
    setIsGenerating(false);
  };
  
  const handleGenerateImage = () => {
    setIsGeneratingImg(true);
    setTimeout(() => {
        setGeneratedImg('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=500&q=80');
        setIsGeneratingImg(false);
    }, 2000);
  };
`;
code = code.replace("const navItems = [", generateFn + "\n  const navItems = [");

// Update Textarea
code = code.replace(
  /<textarea\s+className="w-full bg-slate-50 border border-gray-200 rounded-xl p-4 pb-12 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"\s+rows=\{3\}\s+placeholder=\{language === 'EN' \? "Write instructions or add information..." : "Escribe instrucciones o agrega información..."\}\s+><\/textarea>/g,
  `<textarea 
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-4 pb-12 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  rows={3}
                  value={contextText}
                  onChange={(e) => setContextText(e.target.value)}
                  placeholder={language === 'EN' ? "Write instructions or add information..." : "Escribe instrucciones o agrega información..."}
                ></textarea>`
);

// Update button
code = code.replace(
  /<button className="absolute bottom-3 right-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm">/g,
  `<button disabled={isGenerating || !contextText.trim()} onClick={handleGenerateContent} className="absolute bottom-3 right-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm disabled:opacity-50">`
);

// Update generated text display (Instagram)
code = code.replace(
  `Dale a tus espacios el cambio que merecen con Panel WPC.<br/>
                     Diseño moderno, resistencia y fácil instalación para transformar cualquier ambiente en un lugar que inspira. ✨<br/><br/>
                     Belleza que se ve. Calidad que se siente.<br/>
                     #PanelWPC #DiseñoInterior #ParedesModernas`,
  `{generatedText ? <pre className="whitespace-pre-wrap font-sans text-sm">{generatedText}</pre> : (
    <>
      Dale a tus espacios el cambio que merecen con Panel WPC.<br/>
      Diseño moderno, resistencia y fácil instalación para transformar cualquier ambiente en un lugar que inspira. ✨<br/><br/>
      Belleza que se ve. Calidad que se siente.<br/>
      #PanelWPC #DiseñoInterior #ParedesModernas
    </>
  )}`
);

// Fix the image generation button
code = code.replace(
  /<button className="w-full mt-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm">/g,
  `<button onClick={handleGenerateImage} disabled={isGeneratingImg} className="w-full mt-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm disabled:opacity-50">`
);

// Fix the image src
code = code.replace(
  `src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=200"`,
  `src={generatedImg}`
);

fs.writeFileSync('src/App.tsx', code);
