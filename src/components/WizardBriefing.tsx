import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, Target, Zap, LayoutList, Upload, Check, Trash2, ShieldCheck } from 'lucide-react';
import { AttachedFile } from '../App';
import { storage } from '../utils/storage';

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
  // Initialize state from storage if available
  const savedState = storage.getBriefingState() || {};

  const [product, setProduct] = useState(savedState.product || '');
  const [audience, setAudience] = useState(savedState.audience || '');
  const [objective, setObjective] = useState(savedState.objective || '');
  const [offer, setOffer] = useState(savedState.offer || '');
  const [tone, setTone] = useState(savedState.tone || 'Profesional y Persuasivo');
  const [context, setContext] = useState(savedState.context || '');
  const [files, setFiles] = useState<AttachedFile[]>(savedState.files || []);
  const [lastSaved, setLastSaved] = useState<string>('Guardado');

  // Auto-save whenever any input changes
  useEffect(() => {
    storage.saveBriefingState({
      product,
      audience,
      objective,
      offer,
      tone,
      context,
      files
    });
    setLastSaved('Guardado automáticamente');
  }, [product, audience, objective, offer, tone, context, files]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;
    
    Array.from(selected).forEach((file: File) => {
      const isText = file.type.startsWith('text/') || file.name.endsWith('.txt');
      const isImg = file.type.startsWith('image/');
      
      if (isImg) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setFiles(prev => [...prev, {
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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

  const handleClear = () => {
    if (window.confirm('¿Deseas reiniciar los datos del briefing y empezar de cero?')) {
      setProduct('');
      setAudience('');
      setObjective('');
      setOffer('');
      setContext('');
      setFiles([]);
      storage.clearBriefingState();
    }
  };

  const handleNext = () => {
    storage.saveBriefingState({ product, audience, objective, offer, tone, context, files });
    onComplete({ product, audience, objective, offer, tone, context, files });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Header and Auto-save indicator */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-gray-100 dark:border-slate-800">
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="text-blue-600" /> Paso 1: Brainstorm & Master Brief
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Responde estas preguntas clave. Gemini estructurará tu campaña para redes, CRM, imágenes y videos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-900/60 rounded-full text-xs font-semibold">
            <ShieldCheck size={14} className="text-green-600" />
            <span>{lastSaved}</span>
          </div>
          {(product || audience || context || files.length > 0) && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 p-1"
              title="Limpiar formulario"
            >
              <Trash2 size={13} /> Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <LayoutList size={14} /> ¿Qué estamos promocionando? *
          </label>
          <input 
            type="text" 
            placeholder="Ej: Revestimientos 3D de PVC, Nueva colección de verano, Consultoría..."
            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 shadow-sm"
            value={product}
            onChange={e => setProduct(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Target size={14} /> ¿A quién le hablamos? (Audiencia) *
          </label>
          <input 
            type="text" 
            placeholder="Ej: Arquitectos, diseñadores de interiores, madres de familia..."
            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 shadow-sm"
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
            placeholder="Ej: Generar leads calificados en WhatsApp, reconocimiento de marca..."
            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 shadow-sm"
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
            placeholder="Ej: 20% descuento por lanzamiento, asesoría inicial gratuita..."
            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 shadow-sm"
            value={offer}
            onChange={e => setOffer(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <FileText size={14} /> Contexto Adicional / Notas y Materiales del Producto
        </label>
        <textarea 
          placeholder="Agrega cualquier otro detalle: acabados, materiales exactos (ej. PVC impermeable, aluminio, madera), beneficios técnicos, estilo de marca o restricciones..."
          className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 min-h-[100px] resize-none shadow-sm"
          value={context}
          onChange={e => setContext(e.target.value)}
        />
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Archivos y Referencias Visuales del Producto (Opcional)</label>
            <p className="text-[11px] text-slate-400">Estas imágenes podrán usarse en el generador visual como referencia de producto.</p>
          </div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            <Upload size={14} /> Subir Imagen o Archivo
            <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*,text/*,.pdf,.doc,.docx" />
          </label>
        </div>
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2.5">
            {files.map(f => (
              <div key={f.id} className="bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2 text-xs font-medium flex items-center gap-2 shadow-xs">
                {f.type === 'image' && f.dataUrl ? (
                  <img src={f.dataUrl} alt={f.name} className="w-6 h-6 rounded object-cover" />
                ) : null}
                <span className="truncate max-w-[150px]">{f.name}</span>
                <span className="text-[10px] text-slate-400">{f.sizeFormatted}</span>
                <button 
                  type="button"
                  onClick={() => setFiles(files.filter(x => x.id !== f.id))} 
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded p-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-6 flex items-center justify-between border-t border-gray-100 dark:border-slate-800">
        <span className="text-xs text-slate-400">
          * Campos requeridos para alinear la inteligencia creativa.
        </span>
        <button 
          onClick={handleNext}
          disabled={!product.trim() || !audience.trim()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
        >
          Generar Campaña &rarr;
        </button>
      </div>
    </div>
  );
}

