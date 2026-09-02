import React from 'react';
import { Copy, Instagram, Linkedin, Video, Mail, Megaphone, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

export default function WizardContent({ data, onNext }: { data: any, onNext: () => void }) {
  const [copied, setCopied] = React.useState('');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  if (!data) return <div className="p-8 text-center">No hay contenido generado.</div>;

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
        {/* Instagram/FB */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2 text-pink-600 dark:text-pink-400">
              <Instagram size={18} /> Instagram & Facebook
            </h3>
            <button onClick={() => handleCopy(data.instagram?.caption || '', 'ig')} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
              {copied === 'ig' ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </div>
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <p className="font-bold">{data.instagram?.hook}</p>
            <p className="whitespace-pre-wrap">{data.instagram?.caption}</p>
            <p className="text-blue-500 font-medium">{data.instagram?.hashtags}</p>
            <div className="bg-slate-50 dark:bg-slate-800 p-2 text-xs rounded border border-gray-100 dark:border-slate-700">
              <span className="font-bold">Sugerencia Visual:</span> {data.instagram?.visualDirection}
            </div>
          </div>
        </div>

        {/* LinkedIn */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Linkedin size={18} /> LinkedIn B2B
            </h3>
            <button onClick={() => handleCopy(data.linkedin?.articlePost || '', 'li')} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
              {copied === 'li' ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </div>
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <p className="font-bold text-lg">{data.linkedin?.headline}</p>
            <p className="whitespace-pre-wrap">{data.linkedin?.articlePost}</p>
            <ul className="list-disc pl-5">
              {data.linkedin?.takeaways?.map((t: string, i: number) => <li key={i}>{t}</li>)}
            </ul>
            <p className="font-bold mt-2">{data.linkedin?.callToAction}</p>
          </div>
        </div>

        {/* TikTok / Reels */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Video size={18} /> TikTok & Reels
            </h3>
            <button onClick={() => handleCopy(data.tiktokReels?.sceneScript || '', 'tk')} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
              {copied === 'tk' ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </div>
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded text-purple-800 dark:text-purple-300 font-bold text-xs">
              Gancho 0-3s: {data.tiktokReels?.hook0to3s}
            </div>
            <p className="whitespace-pre-wrap font-mono text-xs p-3 bg-slate-50 dark:bg-slate-800 rounded border border-gray-100 dark:border-slate-700">
              {data.tiktokReels?.sceneScript}
            </p>
            <p className="text-xs font-bold">Texto en Pantalla: <span className="font-normal">{data.tiktokReels?.onScreenText}</span></p>
          </div>
        </div>

        {/* Newsletter & CRM */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2 text-amber-600 dark:text-amber-500">
              <Mail size={18} /> Email & CRM
            </h3>
            <button onClick={() => handleCopy(data.emailNewsletter?.emailBody || '', 'em')} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
              {copied === 'em' ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </div>
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <div>
              <span className="font-bold text-xs uppercase text-slate-400 block mb-1">Asuntos A/B:</span>
              <ul className="list-disc pl-5 text-xs font-medium">
                {data.emailNewsletter?.subjectLines?.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded whitespace-pre-wrap text-xs">
              {data.emailNewsletter?.emailBody}
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-200 dark:border-amber-800 text-xs">
              <span className="font-bold">Lead Magnet Sugerido:</span> {data.crmLeadMagnet?.suggestedLeadMagnet}<br/><br/>
              <a href={data.crmLeadMagnet?.whatsappDirectUrl} target="_blank" className="text-blue-500 hover:underline flex items-center gap-1"><LinkIcon size={12}/> Link a WhatsApp</a>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <button 
          onClick={onNext}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
        >
          Ir a Generación Visual (Imagen & Video) &rarr;
        </button>
      </div>
    </div>
  );
}
