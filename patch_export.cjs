const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// I will insert a handleExport function
const handleExportCode = `
  const handleExport = () => {
    if (!generatedText) {
      alert(language === 'EN' ? 'Nothing to export!' : '¡Nada para exportar!');
      return;
    }
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign_copy.txt';
    a.click();
    URL.revokeObjectURL(url);
  };
`;

code = code.replace(
  "const handleGenerateImage = () => {",
  handleExportCode + "\n\n  const handleGenerateImage = () => {"
);

// Bind the export tab to handleExport
code = code.replace(
  /onClick=\{\(\) => setActiveTab\(item\.id\)\}/g,
  `onClick={() => {
                    if (item.id === 'export') {
                      handleExport();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}`
);

fs.writeFileSync('src/App.tsx', code);
