import React from 'react';
import { Calendar, Hash, Target, ChevronRight } from 'lucide-react';

export default function WizardStrategy({ data, onRestart }: { data: any, onRestart: () => void }) {
  if (!data) return <div className="p-8 text-center">No hay estrategia generada.</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-3 mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Paso 4: Estrategia y Despliegue
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Revisión final de keywords, insights de audiencia y tu plan de publicación sugerido.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Target size={18} /> Insight de Audiencia Maestro
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {data.masterStrategy?.targetInsight || 'Foco en diferenciación y retorno de inversión.'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Hash size={18} /> Keywords & Hashtags Core
          </h3>
          <div className="flex flex-wrap gap-2">
            {(data.masterStrategy?.keywords || ['#lanzamiento', '#novedad']).map((kw: string, i: number) => (
              <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-medium border border-gray-200 dark:border-slate-700">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="font-bold flex items-center gap-2 text-slate-900 dark:text-white">
          <Calendar size={18} className="text-blue-600" /> Plan de Despliegue (Rollout Calendar)
        </h3>
        
        <div className="space-y-3">
          {(data.calendar || [
            { day: 1, platform: 'Email', content: 'Teaser' },
            { day: 2, platform: 'Instagram', content: 'Lanzamiento' }
          ]).map((item: any, i: number) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
              <div className="bg-blue-600 text-white font-bold w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                D{item.day || i+1}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  {item.platform}
                </span>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8 flex justify-center">
        <button 
          onClick={onRestart}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
        >
          Finalizar y Crear Nueva Campaña
        </button>
      </div>
    </div>
  );
}
