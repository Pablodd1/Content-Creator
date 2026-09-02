import React, { useState, useEffect } from 'react';
import WizardBriefing from './components/WizardBriefing';
import WizardContent from './components/WizardContent';
import WizardVisuals from './components/WizardVisuals';
import WizardStrategy from './components/WizardStrategy';
import { Loader2, Zap } from 'lucide-react';

export interface AttachedFile {
  id: string;
  name: string;
  sizeFormatted: string;
  type: 'image' | 'text' | 'document';
  mimeType: string;
  dataUrl?: string;
  textContent?: string;
}

export default function App() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [masterBundle, setMasterBundle] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('unitec_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('unitec_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleBriefingComplete = async (data: any) => {
    setIsGenerating(true);
    
    // Combine attached files into context string
    let finalContext = data.context;
    if (data.files && data.files.length > 0) {
      const texts = data.files.filter((f: any) => f.textContent).map((f: any) => `Contenido de ${f.name}:\n${f.textContent}`);
      if (texts.length > 0) {
        finalContext += `\n\nDocumentos adjuntos:\n${texts.join('\n\n')}`;
      }
    }

    try {
      const res = await fetch('/api/gemini/generate-multiplatform-bundle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: data.product,
          audience: data.audience,
          objective: data.objective,
          offer: data.offer,
          contextText: finalContext,
          tone: data.tone
        })
      });
      const result = await res.json();
      if (result.success) {
        setMasterBundle(result.variants);
        setStep(2);
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err: any) {
      alert('Error de conexión: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    if (isGenerating) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
            <Loader2 size={64} className="text-blue-600 animate-spin relative z-10" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Brainstorming con Gemini...</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Generando estrategia maestra, copies multiplataforma y prompts visuales.</p>
          </div>
        </div>
      );
    }

    switch (step) {
      case 1:
        return <WizardBriefing onComplete={handleBriefingComplete} />;
      case 2:
        return <WizardContent data={masterBundle} onNext={() => setStep(3)} />;
      case 3:
        return <WizardVisuals masterBrief={masterBundle} onNext={() => setStep(4)} />;
      case 4:
        return <WizardStrategy data={masterBundle} onRestart={() => setStep(1)} />;
      default:
        return <WizardBriefing onComplete={handleBriefingComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-1.5 rounded-lg shadow-md">
              <Zap size={20} />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight leading-tight">UNITEC Content Engine</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Flujo de Agencia 100% IA</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className={step >= 1 ? 'text-blue-600 dark:text-blue-400' : ''}>1. Brief</span>
              <span className="opacity-30">&gt;</span>
              <span className={step >= 2 ? 'text-blue-600 dark:text-blue-400' : ''}>2. Copy</span>
              <span className="opacity-30">&gt;</span>
              <span className={step >= 3 ? 'text-blue-600 dark:text-blue-400' : ''}>3. Visual</span>
              <span className="opacity-30">&gt;</span>
              <span className={step >= 4 ? 'text-blue-600 dark:text-blue-400' : ''}>4. Estrategia</span>
            </div>

            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>

      <main className="py-8">
        {renderStep()}
      </main>
    </div>
  );
}
