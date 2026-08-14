import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Cpu, CheckCircle2, Image, FileText, Zap } from 'lucide-react';

interface GlobalProgressBarProps {
  isGeneratingText: boolean;
  isGeneratingImage: boolean;
  onCancel?: () => void;
}

export const GlobalProgressBar: React.FC<GlobalProgressBarProps> = ({
  isGeneratingText,
  isGeneratingImage,
}) => {
  const isWorking = isGeneratingText || isGeneratingImage;
  const [progress, setProgress] = useState(12);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentStepText, setCurrentStepText] = useState('');

  useEffect(() => {
    if (!isWorking) {
      setProgress(100);
      const timer = setTimeout(() => {
        setProgress(0);
        setElapsedSeconds(0);
      }, 500);
      return () => clearTimeout(timer);
    }

    // Reset when process begins
    setProgress(15);
    setElapsedSeconds(0);

    // Elapsed timer
    const intervalTimer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    // Progressive simulated step increment
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 35) return prev + Math.floor(Math.random() * 8) + 4;
        if (prev < 65) return prev + Math.floor(Math.random() * 5) + 3;
        if (prev < 85) return prev + Math.floor(Math.random() * 3) + 1;
        if (prev < 94) return prev + 1;
        return prev;
      });
    }, 450);

    return () => {
      clearInterval(intervalTimer);
      clearInterval(progressInterval);
    };
  }, [isWorking]);

  // Dynamic step message according to operation and progress
  useEffect(() => {
    if (isGeneratingText && isGeneratingImage) {
      if (progress < 30) setCurrentStepText('Analizando contexto multimodal y preparando motor gráfico...');
      else if (progress < 60) setCurrentStepText('Sintetizando copy persuasivo y procesando texturas 8K con Gemini...');
      else if (progress < 85) setCurrentStepText('Estructurando hooks de conversión y renderizando imagen publicitaria...');
      else setCurrentStepText('Finalizando entrega multimodal de alta fidelidad...');
    } else if (isGeneratingText) {
      if (progress < 25) setCurrentStepText('Extrayendo datos de archivos adjuntos y documentos...');
      else if (progress < 50) setCurrentStepText('Conectando con Google Gemini multimodal...');
      else if (progress < 75) setCurrentStepText('Estructurando copy, hashtags SEO y titulares...');
      else if (progress < 90) setCurrentStepText('Refinando tono de voz y sintetizando prompt visual...');
      else setCurrentStepText('Completando formateo de publicaciones...');
    } else if (isGeneratingImage) {
      if (progress < 25) setCurrentStepText('Iniciando pipeline de Google Gemini Imagen 3...');
      else if (progress < 55) setCurrentStepText('Calculando composición, iluminación de estudio y proporciones...');
      else if (progress < 80) setCurrentStepText('Renderizando texturas hiperrealistas y detalles de color...');
      else setCurrentStepText('Descargando creativo publicitario en alta resolución...');
    }
  }, [progress, isGeneratingText, isGeneratingImage]);

  if (!isWorking && progress === 0) return null;

  const operationTitle = isGeneratingText && isGeneratingImage
    ? 'Generación Multimodal Completa (Texto + Imagen)'
    : isGeneratingText
    ? 'Generando Estrategia & Copy con Google Gemini'
    : 'Renderizando Creativo Publicitario con Google Imagen';

  const engineBadge = isGeneratingImage && !isGeneratingText
    ? 'Google Imagen 3'
    : isGeneratingText && !isGeneratingImage
    ? 'Google Gemini 2.5 / 3.7'
    : 'Gemini Multimodal Suite';

  return (
    <aside 
      id="global-ai-progress-bar"
      aria-label="Progreso de generación de la Inteligencia Artificial"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-blue-300/80 dark:border-blue-900/80 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] transition-all duration-300"
    >
      {/* Top Animated Color Bar */}
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 transition-all duration-300 relative"
          style={{ width: `${Math.min(progress, 100)}%` }}
        >
          {/* Shimmer sweep effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6">
        
        {/* Left Side: Status & Progress details */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-200 dark:border-blue-800">
            <Loader2 size={18} className="animate-spin text-blue-600 dark:text-blue-400" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-500 animate-pulse" />
                {operationTitle}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {engineBadge}
              </span>
            </div>

            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
              {currentStepText}
            </p>
          </div>
        </div>

        {/* Right Side: Percentage, Elapsed Timer & Progress meter */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 flex-shrink-0">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-mono">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Tiempo:</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">
              {String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:
              {String(elapsedSeconds % 60).padStart(2, '0')}s
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-24 sm:w-32 bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden border border-gray-200 dark:border-slate-700">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono w-10 text-right">
              {Math.min(progress, 100)}%
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
