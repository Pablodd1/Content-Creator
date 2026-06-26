/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles, Edit3, Check, RefreshCw } from 'lucide-react';
import { MonthData } from '../types';
import { NICHES, MONTH_NAMES } from '../data/mockData';

interface ThemeControlPanelProps {
  months: MonthData[];
  activeMonthIndex: number;
  onMonthSelect: (index: number) => void;
  onThemeUpdate: (index: number, field: 'themeEN' | 'themeES' | 'niche', value: string) => void;
  onAutoGenerateAll: () => void;
  language: 'EN' | 'ES';
}

export default function ThemeControlPanel({
  months,
  activeMonthIndex,
  onMonthSelect,
  onThemeUpdate,
  onAutoGenerateAll,
  language
}: ThemeControlPanelProps) {
  return (
    <div className="bg-white border border-[#e5e5df] rounded-xl p-5 text-[#1a1a1a] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e5df] pb-4 mb-4">
        <div>
          <h3 className="font-sans font-bold text-[#1a1a1a] text-base tracking-tight flex items-center gap-2">
            {language === 'EN' ? '12-Month Theme Sequence' : 'Secuencia de Temas Anuales'} • Secuencia de Temas
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {language === 'EN' 
              ? 'Configure the architectural theme cycles. Gaps are filled or generated seasonally.' 
              : 'Configure los ciclos de temas arquitectónicos del año. Las brechas se completan estacionalmente.'}
          </p>
        </div>
        <button
          id="auto-generate-themes-btn"
          onClick={onAutoGenerateAll}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#2e2e2e] text-white font-sans font-bold text-xs rounded transition-all uppercase tracking-wider shadow cursor-pointer text-center"
        >
          <Sparkles size={14} className="text-[#c9a961] animate-pulse" />
          {language === 'EN' ? 'Auto-Generate 12 Months' : 'Generar Automáticamente 12 Meses'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs min-w-[700px]">
          <thead>
            <tr className="border-b border-[#e5e5df] text-stone-500 font-mono text-[10px] uppercase tracking-wider bg-[#f5f5f0]">
              <th className="py-3 px-3 w-32">{language === 'EN' ? 'Month' : 'Mes'}</th>
              <th className="py-3 px-3">{language === 'EN' ? 'Theme Title (English)' : 'Título de Tema (Inglés)'}</th>
              <th className="py-3 px-3">{language === 'EN' ? 'Theme Title (Spanish)' : 'Título de Tema (Español)'}</th>
              <th className="py-3 px-3 w-48">{language === 'EN' ? 'Niche Association' : 'Asociación de Nicho'}</th>
              <th className="py-3 px-3 w-28 text-center">{language === 'EN' ? 'Status' : 'Estado'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5df]">
            {months.map((m, idx) => {
              const monthLabel = MONTH_NAMES[idx];
              const isActive = activeMonthIndex === idx;

              // Calculate generated day percentage
              const generatedDays = m.days.filter(d => d.status !== 'empty').length;
              const totalDays = m.days.length;
              const percentage = Math.round((generatedDays / totalDays) * 100);

              return (
                <tr
                  key={idx}
                  className={`hover:bg-[#f5f5f0]/50 transition-colors ${isActive ? 'bg-[#c9a961]/10 border-l-2 border-l-[#c9a961]' : ''}`}
                >
                  {/* Month Label */}
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() => onMonthSelect(idx)}
                      className="text-left font-sans font-bold text-[#1a1a1a] hover:text-[#c9a961] cursor-pointer block focus:outline-none"
                    >
                      <span className="block text-xs">{language === 'EN' ? monthLabel.en : monthLabel.es}</span>
                      <span className="block text-[10px] text-stone-500 font-medium">{language === 'EN' ? monthLabel.es : monthLabel.en}</span>
                    </button>
                  </td>

                  {/* Theme EN */}
                  <td className="py-2.5 px-3">
                    <input
                      id={`theme-en-input-${idx}`}
                      type="text"
                      value={m.themeEN}
                      onChange={(e) => onThemeUpdate(idx, 'themeEN', e.target.value)}
                      className="w-full bg-[#f5f5f0] border border-[#e5e5df] focus:border-[#c9a961] focus:bg-white rounded px-2 py-1 text-xs text-[#1a1a1a] outline-none font-medium"
                      placeholder="Enter English theme name..."
                    />
                  </td>

                  {/* Theme ES */}
                  <td className="py-2.5 px-3">
                    <input
                      id={`theme-es-input-${idx}`}
                      type="text"
                      value={m.themeES}
                      onChange={(e) => onThemeUpdate(idx, 'themeES', e.target.value)}
                      className="w-full bg-[#f5f5f0] border border-[#e5e5df] focus:border-[#c9a961] focus:bg-white rounded px-2 py-1 text-xs text-[#1a1a1a] outline-none font-medium"
                      placeholder="Título en español..."
                    />
                  </td>

                  {/* Niche Selection */}
                  <td className="py-2.5 px-3">
                    <select
                      id={`niche-select-${idx}`}
                      value={m.niche}
                      onChange={(e) => onThemeUpdate(idx, 'niche', e.target.value)}
                      className="w-full bg-[#f5f5f0] border border-[#e5e5df] focus:border-[#c9a961] focus:bg-white rounded px-1.5 py-1 text-xs text-[#1a1a1a] outline-none font-medium select"
                    >
                      {NICHES.map(n => (
                        <option key={n.id} value={n.id}>
                          {language === 'EN' ? n.labelEN : n.labelES}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Status Indicator */}
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      {m.isComplete ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                          <Check size={10} />
                          {language === 'EN' ? 'Ready' : 'Listo'}
                        </span>
                      ) : percentage > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-[#c9a961]/15 border border-[#c9a961]/35 text-[#c9a961] px-2 py-0.5 rounded-full font-mono font-bold">
                          {percentage}%
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-[#f5f5f0] border border-[#e5e5df] text-stone-400 px-2 py-0.5 rounded-full font-mono uppercase">
                          {language === 'EN' ? 'Empty' : 'Vacío'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
