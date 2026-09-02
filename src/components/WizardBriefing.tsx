import React, { useState } from 'react';
import { FileText, Sparkles, Target, Zap, LayoutList, Upload } from 'lucide-react';
import { AttachedFile } from '../App';

interface BriefingProps {
  onComplete: (data: {
    product: string;
    audience: string;
    objective: string;
    offer: string;
    tone: string;
    context: string;
    files: AttachedFile[];
  }) => void;
}

export default function WizardBriefing({ onComplete }: BriefingProps) {
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [objective, setObjective] = useState('');
  const [offer, setOffer] = useState('');
  const [tone, setTone] = useState('Profesional y Persuasivo');
  const [context, setContext] = useState('');
  const [files, setFiles] = useState<AttachedFile[]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;
    
    Array.from(selected).forEach(file => {
      const isText = file.type.startsWith('text/') || file.name.endsWith('.txt');
      const isImg = file.type.startsWith('image/');
      
      if (isImg) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setFiles(prev => [...prev, {
            id: `file-${Date.now()}`,
            name: file.name,
            sizeFormatted: `${(file.size / 1024).toFixed(1)} KB`,
            type: 'image',
            mimeType: file.type || 'image/png',
            dataUrl: ev.target?.result as string
          }]);
        };
        reader.readAsDataURL(file);
      } else if (isText) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setFiles(prev => [...prev, {
            id: `file-${Date.now()}`,
            name: file.name,
            sizeFormatted: `${(file.size / 1024).toFixed(1)} KB`,
            type: 'text',
            mimeType: file.type || 'text/plain',
            textContent: ev.target?.result as string
          }]);
        };
        reader.readAsText(file);
      }
    });
  };

  const handleNext = () => {
    onComplete({ product, audience, objective, offer, tone, context, files });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-3 mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Sparkles className="text-blue-600" /> Paso 1: Brainstorm & Master Brief
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Responde estas preguntas clave. Gemini estructurará un contexto maestro que alineará todas las redes sociales, CRM, imágenes y videos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <LayoutList size={14} /> ¿Qué estamos promocionando?
          </label>
          <input 
            type="text" 
            placeholder="Ej: Revestimientos 3D de PVC, Nueva colección de verano..."
            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500"
            value={product}
            onChange={e => setProduct(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Target size={14} /> ¿A quién le hablamos?
          </label>
          <input 
            type="text" 
            placeholder="Ej: Arquitectos, madres de familia, dueños de negocios..."
            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500"
            value={audience}
            onChange={e => setAudience(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Zap size={14} /> ¿Cuál es el objetivo principal?
          </label>
          <input 
            type="text" 
            placeholder="Ej: Generar leads en WhatsApp, reconocimiento de marca..."
            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500"
            value={objective}
            onChange={e => setObjective(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles size={14} /> Oferta Especial o Gancho (Opcional)
          </label>
          <input 
            type="text" 
            placeholder="Ej: 20% descuento por lanzamiento, envío gratis..."
            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500"
            value={offer}
            onChange={e => setOffer(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <FileText size={14} /> Contexto Adicional / Notas Libres
        </label>
        <textarea 
          placeholder="Agrega cualquier otro detalle que Gemini deba saber para estructurar la campaña (ideas de estilo, restricciones, competidores)..."
          className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 min-h-[100px] resize-none"
          value={context}
          onChange={e => setContext(e.target.value)}
        />
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Archivos y Referencias Visuales (Opcional)</label>
          <label className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            <Upload size={14} /> Subir Archivo
            <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*,text/*,.pdf,.doc,.docx" />
          </label>
        </div>
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {files.map(f => (
              <div key={f.id} className="bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2 text-xs font-medium flex items-center gap-2">
                <span className="truncate max-w-[150px]">{f.name}</span>
                <button onClick={() => setFiles(files.filter(x => x.id !== f.id))} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded p-0.5">X</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-6 flex justify-end">
        <button 
          onClick={handleNext}
          disabled={!product || !audience}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
        >
          Generar Campaña &rarr;
        </button>
      </div>
    </div>
  );
}
