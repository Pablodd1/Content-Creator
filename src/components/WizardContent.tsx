import React from 'react';
import { Copy, Instagram, Linkedin, Video, Mail, CheckCircle2, Facebook, Youtube, Clock, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export default function WizardContent({ 
  data, 
  onNext, 
  onBack 
}: { 
  data: any; 
  onNext: () => void; 
  onBack?: () => void; 
}) {
  const [copied, setCopied] = React.useState('');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  if (!data) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
          <Sparkles size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Aún no se ha generado la campaña
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Completa los datos en el Paso 1 (Briefing) para que Gemini genere automáticamente todos los copies y conceptos visuales.
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            <ArrowLeft size={14} /> Ir al Paso 1: Completar Briefing
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-3 mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Paso 2: Contenido Multiplataforma
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gemini ha generado todo el copy optimizado basándose en tu Briefing Maestro.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Instagram */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2 text-pink-600 dark:text-pink-400">
              <Instagram size={18} /> Instagram
            </h3>
            <button onClick={() => handleCopy(data.instagram?.caption || '', 'ig')} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
              {copied === 'ig' ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </div>
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 flex-1">
            <p className="whitespace-pre-wrap">{data.instagram?.caption || data.instagram?.hook}</p>
            <p className="text-blue-500 font-medium">{data.instagram?.hashtags}</p>
            {data.instagram?.smartPostingTime && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mt-2">
                <Clock size={14} /> Sugerido: {data.instagram.smartPostingTime}
              </div>
            )}
          </div>
        </div>

        {/* Facebook */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Facebook size={18} /> Facebook
            </h3>
            <button onClick={() => handleCopy(data.facebook?.post || '', 'fb')} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
              {copied === 'fb' ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </div>
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 flex-1">
            <p className="whitespace-pre-wrap">{data.facebook?.post}</p>
            <p className="text-blue-500 font-medium">{data.facebook?.hashtags}</p>
            {data.facebook?.smartPostingTime && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mt-2">
                <Clock size={14} /> Sugerido: {data.facebook.smartPostingTime}
              </div>
            )}
          </div>
        </div>

        {/* YouTube */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2 text-red-600 dark:text-red-500">
              <Youtube size={18} /> YouTube
            </h3>
            <button onClick={() => handleCopy(data.youtube?.description || '', 'yt')} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
              {copied === 'yt' ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </div>
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 flex-1">
            <p className="font-bold text-lg">{data.youtube?.title}</p>
            <p className="whitespace-pre-wrap">{data.youtube?.description}</p>
            <p className="text-blue-500 font-medium">{data.youtube?.tags}</p>
            {data.youtube?.smartPostingTime && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mt-2">
                <Clock size={14} /> Sugerido: {data.youtube.smartPostingTime}
              </div>
            )}
          </div>
        </div>

        {/* TikTok / Reels */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Video size={18} /> TikTok & Reels
            </h3>
            <button onClick={() => handleCopy(data.tiktok?.sceneScript || data.tiktokReels?.sceneScript || '', 'tk')} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
              {copied === 'tk' ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </div>
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 flex-1">
            <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded text-purple-800 dark:text-purple-300 font-bold text-xs">
              Gancho 0-3s: {data.tiktok?.hook0to3s || data.tiktokReels?.hook0to3s}
            </div>
            <p className="whitespace-pre-wrap font-mono text-xs p-3 bg-slate-50 dark:bg-slate-800 rounded border border-gray-100 dark:border-slate-700">
              {data.tiktok?.sceneScript || data.tiktokReels?.sceneScript}
            </p>
            {data.tiktok?.smartPostingTime && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mt-2">
                <Clock size={14} /> Sugerido: {data.tiktok.smartPostingTime}
              </div>
            )}
          </div>
        </div>

        {/* LinkedIn */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Linkedin size={18} /> LinkedIn B2B
            </h3>
            <button onClick={() => handleCopy(data.linkedin?.articlePost || '', 'li')} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
              {copied === 'li' ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </div>
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 flex-1">
            <p className="font-bold text-lg">{data.linkedin?.headline}</p>
            <p className="whitespace-pre-wrap">{data.linkedin?.articlePost}</p>
            {data.linkedin?.smartPostingTime && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mt-2">
                <Clock size={14} /> Sugerido: {data.linkedin.smartPostingTime}
              </div>
            )}
          </div>
        </div>

        {/* Newsletter / Email */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2 text-amber-600 dark:text-amber-500">
              <Mail size={18} /> Email Marketing
            </h3>
            <button onClick={() => handleCopy(data.email?.body || data.emailNewsletter?.emailBody || '', 'em')} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
              {copied === 'em' ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </div>
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 flex-1">
            <p className="font-bold">Asunto: {data.email?.subject}</p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded whitespace-pre-wrap text-xs">
              {data.email?.body || data.emailNewsletter?.emailBody}
            </div>
          </div>
        </div>

      </div>

      <div className="pt-6 flex items-center justify-between border-t border-gray-100 dark:border-slate-800">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft size={14} /> Volver a Paso 1 (Briefing)
          </button>
        ) : <div />}
        <button 
          onClick={onNext}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          Ir a Generación Visual (Imagen & Video) <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
