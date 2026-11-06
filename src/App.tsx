import React, { useState, useEffect } from 'react';
import WizardBriefing from './components/WizardBriefing';
import WizardContent from './components/WizardContent';
import WizardVisuals from './components/WizardVisuals';
import WizardStrategy from './components/WizardStrategy';
import StandaloneImage from './components/StandaloneImage';
import StandaloneVideo from './components/StandaloneVideo';
import { Loader2, Zap, ImageIcon, Video, LayoutTemplate } from 'lucide-react';
import { storage } from './utils/storage';

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
  const [mode, setModeState] = useState<'wizard' | 'standalone-image' | 'standalone-video'>(() => storage.getMode());
  const [step, setStepState] = useState<number>(() => storage.getStep());
  const [isGenerating, setIsGenerating] = useState(false);
  const [masterBundle, setMasterBundleState] = useState<any>(() => storage.getMasterBundle());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('unitec_theme') as 'light' | 'dark') || 'light';
  });

  const setMode = (newMode: 'wizard' | 'standalone-image' | 'standalone-video') => {
    setModeState(newMode);
    storage.saveMode(newMode);
  };

  const setStep = (newStep: number) => {
    setStepState(newStep);
    storage.saveStep(newStep);
  };

  const setMasterBundle = (bundle: any) => {
    setMasterBundleState(bundle);
    storage.saveMasterBundle(bundle);
  };

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
        console.error('Error:', result.error);
      }
    } catch (err: any) {
      console.error('Error de conexión:', err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderContent = () => {
    if (mode === 'standalone-image') return <StandaloneImage />;
    if (mode === 'standalone-video') return <StandaloneVideo />;

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

    const savedBrief = storage.getBriefingState();
    const attachedFiles = savedBrief?.files || savedBrief?.attachedFiles || [];

    switch (step) {
      case 1:
        return <WizardBriefing onComplete={handleBriefingComplete} />;
      case 2:
        return (
          <WizardContent 
            data={masterBundle} 
            onNext={() => setStep(3)} 
            onBack={() => setStep(1)} 
          />
        );
      case 3:
        return (
          <WizardVisuals 
            masterBrief={masterBundle} 
            onNext={() => setStep(4)} 
            onBack={() => setStep(2)}
            attachedFiles={attachedFiles}
          />
        );
      case 4:
        return (
          <WizardStrategy 
            data={masterBundle} 
            onRestart={() => setStep(1)} 
            onBack={() => setStep(3)}
          />
        );
      default:
        return <WizardBriefing onComplete={handleBriefingComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Title */}
          <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
            UNITEC Content Engine
          </span>
          
          {/* Zone 2: Navigation Mode Controls */}
          <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button 
              type="button"
              onClick={() => setMode('standalone-image')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${mode === 'standalone-image' ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              <ImageIcon size={14} /> <span>Solo Imagen (Unificado)</span>
            </button>
            <button 
              type="button"
              onClick={() => setMode('wizard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${mode === 'wizard' ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              <LayoutTemplate size={14} /> <span>Campaña Completa</span>
            </button>
            <button 
              type="button"
              onClick={() => setMode('standalone-video')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${mode === 'standalone-video' ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              <Video size={14} /> <span>Solo Video</span>
            </button>
          </nav>
          
          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
            </button>
          </div>
        </div>
      </header>

      <main className="py-8">
        {renderContent()}
      </main>
    </div>
  );
}
