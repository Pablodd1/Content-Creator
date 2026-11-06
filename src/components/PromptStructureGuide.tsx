import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Camera, Lightbulb, Video, Layers, Check, Building2, FileSpreadsheet } from 'lucide-react';
import { ARCHITECTURAL_TEMPLATES, UNITEC_PRODUCT_CATALOG, promptRefiner } from '../services/promptRefiner';

interface PromptGuideProps {
  onApplyTemplate: (templateText: string) => void;
  type?: 'image' | 'video';
}

export default function PromptStructureGuide({ onApplyTemplate, type = 'image' }: PromptGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [applied, setApplied] = useState('');

  const handleApply = (text: string, id: string) => {
    onApplyTemplate(text);
    setApplied(id);
    setTimeout(() => setApplied(''), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 transition-all">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Guía de Estructura y Plantillas del Catálogo UNITEC ({type === 'image' ? '1080×1920 px · Zona Segura 1080×1350 px' : 'Video Comercial'})
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              El parser detecta automáticamente el nombre del material en tu prompt y vincula su ficha técnica oficial sin depender de otros módulos.
            </p>
          </div>
        </div>
        <button type="button" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4 text-xs">
          {/* 5 Layer Formula */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 text-[11px]">
                <Layers size={13} /> 1. Detección Automática
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug">
                Menciona el material (ej. Panel Acanalado WPC, Piso SPC, Mármol UV) y el parser insertará su nombre y SKU automáticamente.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 text-[11px]">
                <FileSpreadsheet size={13} /> 2. Ficha Técnica
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug">
                Los beneficios técnicos se vinculan automáticamente según el material solicitado en el catálogo.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 text-[11px]">
                <Lightbulb size={13} /> 3. Zona Segura 1080×1350
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug">
                Sobre lienzo 1080×1920 px, toda la información crítica se centra en los 1080×1350 px centrales (márgenes de 285 px).
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                <Camera size={13} /> 4. Logos y Títulos
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug">
                Escala automática, márgenes laterales de 68 px y separación vertical garantizada sin cortes ni superposición.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 text-[11px]">
                <Video size={13} /> 5. Flujo Unificado
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug">
                Detección de producto, ficha técnica y composición gráfica integrados en un solo paso en Solo Imagen.
              </p>
            </div>
          </div>

          {/* Ready-to-use Catalog Prompts */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Ejemplos de Catálogo con Detección Automática de Producto y Ficha Técnica (1-Clic):
            </div>
            <div className="flex flex-wrap gap-2">
              {type === 'image' ? (
                <>
                  {UNITEC_PRODUCT_CATALOG.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleApply(
                        `${item.nameES} instalado en ${item.applicationZones.split(',')[0].toLowerCase()}, acabado arquitectónico de lujo con iluminación natural suave y líneas limpias.`,
                        item.id
                      )}
                      className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {applied === item.id ? <Check size={12} className="text-green-600" /> : <Building2 size={12} className="text-blue-600 dark:text-blue-400" />}
                      <span>{item.nameES}</span>
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleApply(
                      'Video comercial cinemático de revelación (Reveal Shot): Panel Acanalado WPC Interior color nogal oscuro en un lobby corporativo de doble altura. Movimiento fluido a 24fps con grado de color cinematográfico.',
                      'v1'
                    )}
                    className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {applied === 'v1' ? <Check size={12} className="text-green-500" /> : <Video size={12} className="text-purple-500" />}
                    Plantilla: Video Reveal Panel WPC
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApply(
                      'Video publicitario dinámico para TikTok/Reels: Piso Arquitectónico SPC Click Impermeable roble natural. Movimiento de cámara whip pan revelando la transformación del espacio antes y después.',
                      'v2'
                    )}
                    className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {applied === 'v2' ? <Check size={12} className="text-green-500" /> : <Video size={12} className="text-pink-500" />}
                    Plantilla: Reels Piso SPC Click
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
