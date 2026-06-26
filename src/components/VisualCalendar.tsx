/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CalendarHeart, Flame, Check, Sparkles, AlertTriangle, ChevronDown, ChevronRight, Play, Download, FileSpreadsheet } from 'lucide-react';
import { MonthData, DayData } from '../types';
import { MONTH_NAMES, NICHES, getColombianHolidays } from '../data/mockData';

interface VisualCalendarProps {
  months: MonthData[];
  activeMonthIndex: number;
  selectedDay: DayData | null;
  onMonthSelect: (index: number) => void;
  onDaySelect: (day: DayData) => void;
  onBulkGenerateMonth: (index: number) => void;
  onExportJSON: (index: number) => void;
  onExportCSV: (index: number) => void;
  language: 'EN' | 'ES';
  integrateColombiaHolidays?: boolean;
}

export default function VisualCalendar({
  months,
  activeMonthIndex,
  onMonthSelect,
  selectedDay,
  onDaySelect,
  onBulkGenerateMonth,
  onExportJSON,
  onExportCSV,
  language,
  integrateColombiaHolidays = true
}: VisualCalendarProps) {
  const activeMonth = months[activeMonthIndex];
  const generatedDaysCount = activeMonth.days.filter(d => d.status !== 'empty').length;
  const isMonthFullyGenerated = generatedDaysCount === activeMonth.days.length;

  const getStatusColorClass = (status: 'empty' | 'generated' | 'reviewed' | 'warning') => {
    switch (status) {
      case 'reviewed': return 'bg-emerald-500 shadow-emerald-500/20';
      case 'warning': return 'bg-amber-500 shadow-amber-500/20';
      case 'generated': return 'bg-[#c9a961] shadow-[#c9a961]/20';
      default: return 'bg-stone-300 border border-stone-400/20';
    }
  };

  // Suggest "Next Niche" helper
  const getNextNicheSuggestion = () => {
    const currentNicheIndex = NICHES.findIndex(n => n.id === activeMonth.niche);
    const nextNiche = NICHES[(currentNicheIndex + 1) % NICHES.length];
    return language === 'EN'
      ? `Next: "${nextNiche.labelEN}"`
      : `Sig: "${nextNiche.labelES}"`;
  };

  return (
    <div className="space-y-6">
      {/* 12-Month Cards Deck */}
      <div>
        <h3 className="font-sans font-bold text-[#1a1a1a] text-xs uppercase tracking-[0.15em] mb-4">
          {language === 'EN' ? 'Yearly Overview' : 'Vista General del Año'} • {language === 'EN' ? '12-Month Timeline' : 'Cronograma de 12 Meses'}
        </h3>
        <div id="twelve-months-list-grid" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {months.map((m, idx) => {
            const mName = MONTH_NAMES[idx];
            const active = idx === activeMonthIndex;
            const generated = m.days.filter(d => d.status !== 'empty').length;
            const total = m.days.length;
            const pct = Math.round((generated / total) * 100);

            return (
              <button
                id={`month-selector-card-${idx}`}
                key={idx}
                onClick={() => onMonthSelect(idx)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-28 w-full relative ${active ? 'bg-[#c9a961]/10 border-2 border-[#c9a961] shadow-md shadow-[#c9a961]/5' : 'bg-white border-[#e5e5df] hover:border-stone-400 shadow-sm'}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`font-sans font-bold text-xs ${active ? 'text-[#c9a961]' : 'text-[#1a1a1a]'}`}>
                      {language === 'EN' ? mName.en : mName.es}
                    </span>
                    {pct === 100 && (
                      <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center border border-emerald-500/30">
                        <Check size={8} className="stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[10.5px] text-stone-500 mt-1 line-clamp-1 font-medium leading-snug">
                    {language === 'EN' ? m.themeEN : m.themeES}
                  </p>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-[#f5f5f0] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${pct === 100 ? 'bg-emerald-500' : 'bg-[#c9a961]'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono font-medium text-stone-400 mt-1">
                    <span>{generated}/{total} {language === 'EN' ? 'days' : 'días'}</span>
                    <span>{pct}%</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Monthly View Panel */}
      <div id="expanded-month-grid-panel" className="bg-white border border-[#e5e5df] rounded-xl p-5 text-[#1a1a1a] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e5e5df] pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="expanded-month-title-label" className="text-lg font-sans font-bold text-[#1a1a1a] tracking-tight">
                {language === 'EN' ? MONTH_NAMES[activeMonthIndex].en : MONTH_NAMES[activeMonthIndex].es} 2026
              </h2>
              <span className="text-xs bg-[#2d5a4a]/10 text-[#2d5a4a] px-2.5 py-0.5 rounded border border-[#2d5a4a]/15 font-bold">
                {language === 'EN' ? 'Niche Focus' : 'Enfoque de Nicho'}: {activeMonth.niche.replace('-', ' ')}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1 max-w-xl font-medium">
              {language === 'EN' ? 'Monthly Theme' : 'Tema del Mes'}: <strong className="text-stone-800 font-sans italic">"{language === 'EN' ? activeMonth.themeEN : activeMonth.themeES}"</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isMonthFullyGenerated && (
              <span className="text-[11px] text-[#2d5a4a] font-mono font-bold select-none bg-[#2d5a4a]/5 px-3 py-1.5 rounded border border-[#2d5a4a]/15 flex items-center gap-1.5">
                <Flame size={12} className="text-emerald-500 fill-emerald-500" />
                {getNextNicheSuggestion()}
              </span>
            )}
            <button
              id="export-json-btn"
              onClick={() => onExportJSON(activeMonthIndex)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#f5f5f0] hover:bg-stone-200 text-stone-750 font-sans font-bold text-xs rounded border border-[#e5e5df] transition-all cursor-pointer shadow-sm"
              title={language === 'EN' ? 'Backup Month as JSON File' : 'Respaldar Mes como Archivo JSON'}
            >
              <Download size={13} className="text-[#c9a961]" />
              <span>{language === 'EN' ? 'Export JSON' : 'Exportar JSON'}</span>
            </button>
            <button
              id="export-csv-btn"
              onClick={() => onExportCSV(activeMonthIndex)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#f5f5f0] hover:bg-stone-200 text-stone-750 font-sans font-bold text-xs rounded border border-[#e5e5df] transition-all cursor-pointer shadow-sm"
              title={language === 'EN' ? 'Backup Month as CSV Spreadsheet' : 'Respaldar Mes como Hoja de Cálculo CSV'}
            >
              <FileSpreadsheet size={13} className="text-[#c9a961]" />
              <span>{language === 'EN' ? 'Export CSV' : 'Exportar CSV'}</span>
            </button>
            <button
              id="bulk-generate-month-btn"
              onClick={() => onBulkGenerateMonth(activeMonthIndex)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#2e2e2e] text-white font-sans font-bold text-xs rounded transition-all uppercase tracking-wider shadow cursor-pointer text-center"
            >
              <Sparkles size={13} className="text-[#c9a961] animate-pulse" />
              {language === 'EN' ? 'Bulk Generate Month' : 'Generar Todo el Mes'}
            </button>
          </div>
        </div>

        {/* Day Blocks Calendar Grid */}
        <div id="month-days-block-grid" className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-2.5">
          {activeMonth.days.map((d, dIdx) => {
            const isSelected = selectedDay?.day === d.day;
            const hasContent = d.status !== 'empty';

            // Identify Day of Week psychology icon
            const dowAndIndex = new Date(d.date + 'T12:00:00').getDay();
            const weekdaysLabelEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const weekdaysLabelES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
            
            const holidays2026 = getColombianHolidays(2026);
            const holidayInfo = integrateColombiaHolidays ? holidays2026[d.date] : null;

            return (
              <button
                id={`calendar-day-card-${d.day}`}
                key={dIdx}
                onClick={() => onDaySelect(d)}
                className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-20 w-full relative ${
                  isSelected 
                    ? 'bg-[#c9a961]/10 border-2 border-[#c9a961] shadow-sm shadow-[#c9a961]/5' 
                    : holidayInfo 
                      ? 'bg-amber-50/40 border-amber-400 hover:bg-amber-100/50 shadow-sm' 
                      : hasContent 
                        ? 'bg-[#f5f5f0]/80 border-[#e5e5df] hover:border-stone-400 hover:bg-[#f5f5f0]' 
                        : 'bg-transparent border-[#e5e5df] border-dashed hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-stone-400 font-bold text-[9px] uppercase flex items-center gap-1">
                    {language === 'EN' ? weekdaysLabelEN[dowAndIndex] : weekdaysLabelES[dowAndIndex]}
                    {holidayInfo && (
                      <span className="text-[10px] cursor-help animate-pulse" title={language === 'EN' ? holidayInfo.en : holidayInfo.es}>🇨🇴</span>
                    )}
                  </span>

                  <span className={`w-2 h-2 rounded-full ${getStatusColorClass(d.status)} shadow-sm`} />
                </div>

                <div className="flex items-end justify-between w-full mt-1.5">
                  <div className="flex flex-col">
                    <span className={`font-sans font-bold text-sm leading-none ${isSelected ? 'text-[#c9a961]' : holidayInfo ? 'text-amber-700' : hasContent ? 'text-[#1a1a1a]' : 'text-stone-400'}`}>
                      {d.day}
                    </span>
                    {holidayInfo && (
                      <span className="text-[7.5px] text-amber-600 font-sans font-bold leading-none mt-0.5 truncate max-w-[55px]" title={language === 'EN' ? holidayInfo.en : holidayInfo.es}>
                        {language === 'EN' ? 'HOLIDAY' : 'FESTIVO'}
                      </span>
                    )}
                  </div>

                  {/* Platforms mini indicator bar */}
                  {hasContent && (
                    <div className="flex flex-col items-end gap-1 scale-[0.85] origin-bottom-right">
                      <div className="flex gap-0.5 text-[8px] font-mono font-bold text-[#c9a961]">
                        <span>I</span>
                        <span>L</span>
                        <span>F</span>
                        <span>Y</span>
                      </div>
                      {d.sentimentAnalysis && (
                        <span 
                          title={`${d.sentimentAnalysis.label} (Score: ${d.sentimentAnalysis.score}%)`}
                          className={`text-[7px] font-sans font-extrabold px-1 py-0.5 rounded-full uppercase tracking-wider leading-none select-none ${
                            d.sentimentAnalysis.intensity === 'High' 
                              ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                              : d.sentimentAnalysis.intensity === 'Medium' 
                                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {d.sentimentAnalysis.intensity}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
