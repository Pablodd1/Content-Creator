import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Camera, Lightbulb, Video, Layers, Check, Building2 } from 'lucide-react';
import { ARCHITECTURAL_TEMPLATES, promptRefiner } from '../services/promptRefiner';

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
    <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/70 dark:from-slate-900/90 dark:via-indigo-950/40 dark:to-slate-900/90 rounded-xl border border-blue-200/80 dark:border-indigo-900/50 p-4 transition-all">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-sm">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              ¿Cuál es la mejor estructura para pedir {type === 'image' ? 'Imágenes' : 'Videos'} de Alta Calidad?
              <span className="text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
                Guía Pro de Marketing
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Usa la fórmula de 5 capas y referencias visuales para obtener resultados 8K sin perder tiempo.
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-blue-200/60 dark:border-indigo-900/40 space-y-4 animate-in fade-in duration-200 text-xs">
          {/* 5 Layer Formula */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
            <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-lg border border-gray-200/80 dark:border-slate-700/80 space-y-1">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 text-[11px]">
                <Layers size={13} /> 1. Sujeto / Producto
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug">
                Nombra el producto con exactitud, materiales (aluminio cepillado, roble, vidrio esmerilado, mármol) y posición.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-lg border border-gray-200/80 dark:border-slate-700/80 space-y-1">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 text-[11px]">
                <Camera size={13} /> 2. Entorno
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug">
                Estudio comercial minimalista, arquitectura escandinava de lujo, showroom contemporáneo con líneas limpias.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-lg border border-gray-200/80 dark:border-slate-700/80 space-y-1">
              <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 text-[11px]">
                <Lightbulb size={13} /> 3. Iluminación
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug">
                Softbox difuso, luz lateral tenue, golden hour suave, reflejos sutiles de suelo y contraluz de borde (rim lighting).
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-lg border border-gray-200/80 dark:border-slate-700/80 space-y-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                <Camera size={13} /> 4. Cámara & Óptica
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug">
                Lente de 85mm f/1.8, profundidad de campo con bokeh sedoso, plano a nivel de producto o macro detalle 8K.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-lg border border-gray-200/80 dark:border-slate-700/80 space-y-1">
              <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 text-[11px]">
                <Video size={13} /> 5. {type === 'video' ? 'Movimiento' : 'Atmósfera'}
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug">
                {type === 'video' 
                  ? 'Travelling lento de aproximación (push-in), giro orbital 360°, paneo horizontal continuo, o rack focus.'
                  : 'Editorial de alta gama, simetría limpia, composición comercial sin ruido visual.'}
              </p>
            </div>
          </div>

          {/* Reference Image Tips */}
          <div className="bg-amber-50/80 dark:bg-amber-950/40 p-3 rounded-lg border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5">
            <span className="text-base">📌</span>
            <div className="text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong>Cómo usar la Referencia Visual (Image Reference):</strong> Sube una imagen de tu producto, logotipo o acabado real. Gemini Imagen y Veo usarán esa imagen como ancla visual para replicar fielmente los colores, proporciones y acabados de tu marca sin alterarlos.
            </div>
          </div>

          {/* Ready-to-use Template Buttons */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Plantillas de 1-Clic listas para usar (haz clic para insertar en tu prompt):
            </div>
            <div className="flex flex-wrap gap-2">
              {type === 'image' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleApply(
                      'Fotografía comercial de producto de alta gama: [Describe tu producto aquí con sus materiales exactos]. Ubicado sobre un pedestal de mármol pulido en un estudio minimalista. Iluminación softbox difusa de 5600K con sutil luz de borde (rim lighting). Lente 85mm f/2.8 con fondo desenfocado bokeh elegante. Estilo publicitario editorial 8K ultra nítido.',
                      't1'
                    )}
                    className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-slate-700 rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {applied === 't1' ? <Check size={12} className="text-green-500" /> : <Sparkles size={12} className="text-blue-500" />}
                    Plantilla: Estudio Comercial Minimalista
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApply(
                      'Fotografía arquitectónica y de interiorismo moderno: [Describe tu producto o espacio aquí]. Espacio luminoso de diseño contemporáneo, luz natural entrando por ventanales de piso a techo, plantas arquitectónicas y acabados de roble natural. Toma gran angular 24mm con líneas verticales perfectas, sensación de amplitud y sofisticación.',
                      't2'
                    )}
                    className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-slate-700 rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {applied === 't2' ? <Check size={12} className="text-green-500" /> : <Sparkles size={12} className="text-indigo-500" />}
                    Plantilla: Interiorismo & Espacio Real
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApply(
                      'Primer plano macro hiper-detallado de [Describe tu material o textura de producto]. Enfoque en los acabados superficiales, relieves y reflejos de luz rasante. Textura táctil tangible, micro-contrastes y calidad de catálogo de lujo 8K.',
                      't3'
                    )}
                    className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-slate-700 rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {applied === 't3' ? <Check size={12} className="text-green-500" /> : <Sparkles size={12} className="text-amber-500" />}
                    Plantilla: Macro Textura & Acabados
                  </button>

                  {ARCHITECTURAL_TEMPLATES.slice(0, 4).map(arch => (
                    <button
                      key={arch.id}
                      type="button"
                      onClick={() => handleApply(promptRefiner.buildDeterministicPrompt(arch, '[Inserta el producto o espacio comercial aquí]'), arch.id)}
                      className="px-2.5 py-1.5 bg-indigo-50/80 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 rounded-lg text-[11px] font-semibold text-indigo-800 dark:text-indigo-200 flex items-center gap-1.5 transition-colors"
                    >
                      {applied === arch.id ? <Check size={12} className="text-green-500" /> : <Building2 size={12} className="text-indigo-600 dark:text-indigo-400" />}
                      Arquitectura: {arch.name}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleApply(
                      'Video comercial cinemático de revelación (Reveal Shot): [Describe tu producto aquí]. La cámara inicia con un primer plano desenfocado y realiza un suave travelling de retroceso mientras enfoca (rack focus) al producto en un showroom moderno. Luz tenue con destellos dorados. Movimiento fluido a 24fps con grado de color cinematográfico.',
                      'v1'
                    )}
                    className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-gray-200 dark:border-slate-700 rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {applied === 'v1' ? <Check size={12} className="text-green-500" /> : <Video size={12} className="text-purple-500" />}
                    Plantilla: Video Reveal Cinemático
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApply(
                      'Video publicitario dinámico para TikTok/Reels: [Describe la promesa o producto]. Movimiento de cámara rápido de izquierda a derecha (whip pan) revelando la transformación del espacio antes y después. Iluminación brillante comercial, ritmo visual enérgico con llamadas de texto flotantes.',
                      'v2'
                    )}
                    className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-gray-200 dark:border-slate-700 rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {applied === 'v2' ? <Check size={12} className="text-green-500" /> : <Video size={12} className="text-pink-500" />}
                    Plantilla: Gancho Dinámico Reels/TikTok
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApply(
                      'Giro orbital continuo de 360 grados alrededor de [Describe tu producto aquí]. Cámara fija a nivel de producto manteniendo el centro de gravedad mientras el fondo gira con bokeh suave. Iluminación de estudio de lujo destacando los perfiles y reflejos metálicos.',
                      'v3'
                    )}
                    className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-gray-200 dark:border-slate-700 rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {applied === 'v3' ? <Check size={12} className="text-green-500" /> : <Video size={12} className="text-indigo-500" />}
                    Plantilla: Giro Orbital 360°
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
