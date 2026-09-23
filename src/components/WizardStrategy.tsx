import React from 'react';
import { Calendar, Hash, Target, BarChart3, LineChart as LineChartIcon, Activity, ArrowLeft, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function WizardStrategy({ 
  data, 
  onRestart,
  onBack
}: { 
  data: any; 
  onRestart: () => void;
  onBack?: () => void;
}) {
  if (!data) return <div className="p-8 text-center">No hay estrategia generada.</div>;

  // Mock data for visual analytics based on the generative response
  const expectedReach = data.analytics?.expectedReach || 15000;
  const engagement = data.analytics?.targetEngagementRate || 4.5;
  const leads = data.analytics?.crmExpectedLeads || 120;

  const chartData = [
    { name: 'Instagram', reach: Math.round(expectedReach * 0.4) },
    { name: 'Facebook', reach: Math.round(expectedReach * 0.25) },
    { name: 'TikTok', reach: Math.round(expectedReach * 0.2) },
    { name: 'LinkedIn', reach: Math.round(expectedReach * 0.1) },
    { name: 'YouTube', reach: Math.round(expectedReach * 0.05) },
  ];

  const trendData = [
    { day: 'Día 1', engagement: 2 },
    { day: 'Día 2', engagement: 4 },
    { day: 'Día 3', engagement: 7 },
    { day: 'Día 4', engagement: 5 },
    { day: 'Día 5', engagement: 8 },
    { day: 'Día 6', engagement: 10 },
    { day: 'Día 7', engagement: 9 },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-3 mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Paso 4: Estrategia, Analítica y Despliegue
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Proyecciones analíticas, insights de audiencia y plan de publicación estructurado.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
            <Activity size={18} /> <span className="font-bold text-sm">Alcance Proyectado</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {expectedReach.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">Impactos únicos estimados</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 mb-2">
            <BarChart3 size={18} /> <span className="font-bold text-sm">Tasa de Engagement</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {engagement}%
          </div>
          <p className="text-xs text-slate-500 mt-1">Interacción promedio objetivo</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
            <Target size={18} /> <span className="font-bold text-sm">Leads Proyectados (CRM)</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {leads}
          </div>
          <p className="text-xs text-slate-500 mt-1">Adquisición directa estimada</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-sm mb-4 text-slate-800 dark:text-slate-200">Distribución de Alcance (Predictivo)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="reach" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-sm mb-4 text-slate-800 dark:text-slate-200">Curva de Interacción (7 Días)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="engagement" stroke="#ec4899" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
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

      <div className="pt-8 flex items-center justify-between border-t border-gray-100 dark:border-slate-800">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft size={14} /> Volver a Visuales (Paso 3)
          </button>
        ) : <div />}
        <button 
          type="button"
          onClick={onRestart}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <RefreshCw size={14} /> Finalizar y Crear Nueva Campaña
        </button>
      </div>
    </div>
  );
}
