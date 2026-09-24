import React, { useRef, useMemo } from 'react';
import { Upload, Image as ImageIcon, X, Check, Sparkles, FileText, Mail } from 'lucide-react';
import { storage } from '../utils/storage';

interface ImageReferencePickerProps {
  referenceImage: string | null;
  onSelectReference: (dataUrl: string | null, name?: string) => void;
  availableImages?: { id: string; name?: string; url: string }[];
  label?: string;
  referenceEmailText?: string;
  onUpdateEmailText?: (text: string) => void;
}

export default function ImageReferencePicker({
  referenceImage,
  onSelectReference,
  availableImages = [],
  label = 'Imagen de Referencia Visual (Producto / Marca)',
  referenceEmailText,
  onUpdateEmailText
}: ImageReferencePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEmailInput, setShowEmailInput] = React.useState(false);

  // Combine passed available images with any uploaded in briefing state
  const mergedAvailableImages = useMemo(() => {
    const list = [...availableImages];
    try {
      const briefingFiles = storage.getBriefingAttachments();
      briefingFiles.forEach((f: any) => {
        if (f.type === 'image' && f.dataUrl && !list.some(item => item.url === f.dataUrl)) {
          list.push({
            id: f.id,
            name: `Adjunto: ${f.name}`,
            url: f.dataUrl
          });
        }
      });
    } catch {}
    return list;
  }, [availableImages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen (PNG, JPG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        onSelectReference(ev.target.result as string, file.name);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-gray-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <ImageIcon size={14} className="text-blue-500" />
          {label}
        </label>
        {referenceImage && (
          <button
            type="button"
            onClick={() => onSelectReference(null)}
            className="text-[11px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
          >
            <X size={12} /> Quitar referencia
          </button>
        )}
      </div>

      {referenceImage ? (
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-blue-200 dark:border-blue-900/50">
          <img
            src={referenceImage}
            alt="Referencia"
            className="w-14 h-14 object-cover rounded-md border border-gray-200 dark:border-slate-700 shadow-sm"
          />
          <div className="flex-1 min-w-0 text-xs">
            <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Check size={13} className="text-green-500" /> Referencia Visual Activa
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              La IA usará esta imagen como guía de producto, materialidad y colores.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-2.5 py-1.5 rounded-md font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Cambiar
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-lg p-3 text-center cursor-pointer transition-colors bg-white/50 dark:bg-slate-900/50"
          >
            <div className="flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400">
              <Upload size={18} className="text-blue-500" />
              <span className="text-xs font-semibold">Subir foto de producto / marca como referencia</span>
              <span className="text-[10px] text-slate-400">JPG, PNG o WebP hasta 10MB</span>
            </div>
          </div>

          {/* Uploaded User Images if any */}
          {mergedAvailableImages.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                O elegir de tus imágenes ({mergedAvailableImages.length} disponibles):
              </span>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {mergedAvailableImages.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => onSelectReference(img.url, img.name)}
                    className="relative group flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all focus:outline-none cursor-pointer"
                    title={img.name || 'Usar como referencia'}
                  >
                    <img src={img.url} alt="Min" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px]">
                      Usar
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Optional reference email / brief notes */}
      {onUpdateEmailText && (
        <div className="pt-2 border-t border-gray-200 dark:border-slate-700/70">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowEmailInput(!showEmailInput)}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Mail size={12} />
              {showEmailInput ? 'Ocultar correo / notas de referencia' : referenceEmailText ? '✓ Correo / Brief de Referencia Activo (Ver/Editar)' : '+ Añadir correo / notas de referencia'}
            </button>
            {referenceEmailText && !showEmailInput && (
              <span className="text-[10px] text-slate-400 max-w-[200px] truncate">
                {referenceEmailText.slice(0, 30)}...
              </span>
            )}
          </div>

          {showEmailInput && (
            <div className="mt-2 space-y-1">
              <textarea
                value={referenceEmailText || ''}
                onChange={e => onUpdateEmailText(e.target.value)}
                rows={2}
                placeholder="Pega aquí el correo del cliente, requisitos técnicos o notas de marca para enriquecer el prompt..."
                className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              />
              <p className="text-[10px] text-slate-400">
                La IA tomará los requerimientos de este texto para asegurar la fidelidad del mensaje y especificaciones.
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
