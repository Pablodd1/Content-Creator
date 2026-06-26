/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Globe,
  Trash2,
  HelpCircle,
  FileText,
  Bookmark,
  Share2,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Info,
  ExternalLink,
  BookOpen
} from 'lucide-react';

import { MonthData, DayData, MarketPulseData, ApiKeysConfig, PlatformPosts, ToneOfVoice, CompanyTrainingConfig, GoogleAnalyticsConfig } from './types';
import {
  MONTH_THEME_TEMPLATES,
  DAYS_IN_MONTH,
  MOCK_TRENDS,
  DEFAULT_KEY_CONFIGS,
  MONTH_NAMES,
  COLOMBIAN_HOLIDAYS_2026
} from './data/mockData';
import { generateDailyContent } from './data/generationEngine';

// Components
import HowToUseModal from './components/HowToUseModal';
import MarketPulse from './components/MarketPulse';
import ThemeControlPanel from './components/ThemeControlPanel';
import DailyContentPreview from './components/DailyContentPreview';
import VisualCalendar from './components/VisualCalendar';
import VideoGenerator from './components/VideoGenerator';
import TrainingAnalyticsHub from './components/TrainingAnalyticsHub';

const LOCAL_STORAGE_KEY = 'unitec_content_engine_db_v2';
const LOCAL_STORAGE_API_KEY = 'unitec_content_engine_api_keys';
const LOCAL_STORAGE_LANG_KEY = 'unitec_content_engine_lang';
const LOCAL_STORAGE_TRAINING_KEY = 'unitec_content_engine_training_v1';
const LOCAL_STORAGE_ANALYTICS_KEY = 'unitec_content_engine_analytics_v1';

export default function App() {
  const [months, setMonths] = useState<MonthData[]>([]);
  const [activeMonthIndex, setActiveMonthIndex] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [language, setLanguage] = useState<'EN' | 'ES'>('ES'); // Default to Spanish (ES) as requested
  const [isHowToUseOpen, setIsHowToUseOpen] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [apiConfigs, setApiConfigs] = useState<ApiKeysConfig>(DEFAULT_KEY_CONFIGS);
  const [toneOfVoice, setToneOfVoice] = useState<ToneOfVoice>('Sales-driven');
  
  // Default training and analytics configs
  const DEFAULT_TRAINING_CONFIG: CompanyTrainingConfig = {
    companyName: "UNITEC USA Design",
    valueProposition: "Revestimientos de WPC de coextrusión bicapa libres de mantenimiento con certificación ASTM Clase-B",
    toneGuide: "Autoritario, técnico, altamente profesional, libre de exageraciones de marketing ruidoso",
    targetAudience: "Arquitectos, constructoras, mayoristas de madera y contratistas en Colombia y Florida",
    customGuidelines: "Mencionar siempre envíos directos de contenedores FOB y centros de consolidación en Miami"
  };

  const DEFAULT_ANALYTICS_CONFIG: GoogleAnalyticsConfig = {
    measurementId: "G-WPCCOLOMBIA26",
    isConnected: true,
    simulatedViews: 14820,
    simulatedCTR: 4.2,
    simulatedConversions: 2.8
  };

  const [trainingConfig, setTrainingConfig] = useState<CompanyTrainingConfig>(DEFAULT_TRAINING_CONFIG);
  const [analyticsConfig, setAnalyticsConfig] = useState<GoogleAnalyticsConfig>(DEFAULT_ANALYTICS_CONFIG);
  
  // Interactive Panel States for Colombia & Admin Formatting Specifications
  const [colombiaPriorityCities, setColombiaPriorityCities] = useState<string[]>(['Bogotá', 'Medellín', 'Cali', 'Barranquilla']);
  const [colombiaPort, setColombiaPort] = useState<'Cartagena' | 'Buenaventura'>('Cartagena');
  const [complianceActiveTab, setComplianceActiveTab] = useState<'admin' | 'specs' | 'colombia'>('admin');
  const [integrateColombiaHolidays, setIntegrateColombiaHolidays] = useState<boolean>(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Periodic Autosave every 5 minutes
  useEffect(() => {
    const saveState = () => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(months));
        localStorage.setItem(LOCAL_STORAGE_API_KEY, JSON.stringify(apiConfigs));
        localStorage.setItem(LOCAL_STORAGE_TRAINING_KEY, JSON.stringify(trainingConfig));
        localStorage.setItem(LOCAL_STORAGE_ANALYTICS_KEY, JSON.stringify(analyticsConfig));
        localStorage.setItem(LOCAL_STORAGE_LANG_KEY, language);
        setLastSaved(new Date());
      } catch (err) {
        console.error('Failed to auto-save application state', err);
      }
    };

    const intervalId = setInterval(saveState, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [months, apiConfigs, trainingConfig, analyticsConfig, language]);

  // Audit log of exports
  const [exportLogs, setExportLogs] = useState<{ timestamp: string; fileType: 'JSON' | 'CSV'; monthName: string }[]>(() => {
    try {
      const storedLogs = localStorage.getItem('unitec_export_audit_logs_v1');
      if (storedLogs) return JSON.parse(storedLogs);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Helper to record exports
  const recordExportLog = (fileType: 'JSON' | 'CSV', mIdx: number) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: true }) + ' ' + new Date().toLocaleDateString('en-US');
    const monthName = MONTH_NAMES[mIdx] ? (language === 'ES' ? MONTH_NAMES[mIdx].es : MONTH_NAMES[mIdx].en) : `Month ${mIdx + 1}`;
    setExportLogs(prev => {
      const updated = [{ timestamp, fileType, monthName }, ...prev].slice(0, 5);
      try {
        localStorage.setItem('unitec_export_audit_logs_v1', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };
  
  // States for printing, deep-linking, and sharing
  const [printMode, setPrintMode] = useState<'brief' | 'calendar'>('brief');
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [shareableText, setShareableText] = useState<string>('');
  const [shareableLink, setShareableLink] = useState<string>('');
  
  // Toast notifications state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Helper date-format string generator
  const formatDateStr = (mIdx: number, day: number) => {
    const m = String(mIdx + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `2026-${m}-${d}`;
  };

  // Initialize data structures
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const storedKeys = localStorage.getItem(LOCAL_STORAGE_API_KEY);
    const storedLang = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
    const storedTraining = localStorage.getItem(LOCAL_STORAGE_TRAINING_KEY);
    const storedAnalytics = localStorage.getItem(LOCAL_STORAGE_ANALYTICS_KEY);

    if (storedLang === 'EN' || storedLang === 'ES') {
      setLanguage(storedLang);
    } else {
      setLanguage('ES'); // Explicit Spanish default for new users
    }

    if (storedKeys) {
      try {
        setApiConfigs(JSON.parse(storedKeys));
      } catch (e) {
        console.error('Error loading API configuration keys', e);
      }
    }

    if (storedTraining) {
      try {
        setTrainingConfig(JSON.parse(storedTraining));
      } catch (e) {
        console.error('Error loading training config', e);
      }
    }

    if (storedAnalytics) {
      try {
        setAnalyticsConfig(JSON.parse(storedAnalytics));
      } catch (e) {
        console.error('Error loading analytics config', e);
      }
    }

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as MonthData[];
        setMonths(parsed);
        // Default select first day with content if any, or Day 1 of January
        const firstMonth = parsed[0];
        if (firstMonth && firstMonth.days.length > 0) {
          setSelectedDay(firstMonth.days[4] || firstMonth.days[0]); // Default to Monday Jan 5 prefilled content if available
        }
      } catch (e) {
        console.error('Error parsing stored calendar state', e);
        initializeFreshState();
      }
    } else {
      initializeFreshState();
    }
  }, []);

  // Deep link parser to enable shared/deep-linked viewing
  useEffect(() => {
    if (months.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const mParam = params.get('month');
    if (mParam !== null) {
      const idx = parseInt(mParam, 10);
      if (idx >= 0 && idx < months.length) {
        setActiveMonthIndex(idx);
        const dayParam = params.get('day');
        if (dayParam !== null) {
          const dNum = parseInt(dayParam, 10);
          const foundDay = months[idx].days.find(d => d.day === dNum);
          if (foundDay) {
            setSelectedDay(foundDay);
          } else {
            setSelectedDay(months[idx].days[0]);
          }
        } else {
          setSelectedDay(months[idx].days[0]);
        }
      }
    }
  }, [months]);

  // Global keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key === 'ArrowRight') {
        setActiveMonthIndex(prev => Math.min(prev + 1, months.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveMonthIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'ArrowUp') {
        if (selectedDay && months[activeMonthIndex]) {
          const currentMonth = months[activeMonthIndex];
          const currentIndex = currentMonth.days.findIndex(d => d.day === selectedDay.day);
          if (currentIndex > 0) {
            setSelectedDay(currentMonth.days[currentIndex - 1]);
          } else if (activeMonthIndex > 0) {
            // go to prev month, last day
            setActiveMonthIndex(activeMonthIndex - 1);
            const prevMonth = months[activeMonthIndex - 1];
            setSelectedDay(prevMonth.days[prevMonth.days.length - 1]);
          }
        }
      } else if (e.key === 'ArrowDown') {
        if (selectedDay && months[activeMonthIndex]) {
          const currentMonth = months[activeMonthIndex];
          const currentIndex = currentMonth.days.findIndex(d => d.day === selectedDay.day);
          if (currentIndex < currentMonth.days.length - 1) {
            setSelectedDay(currentMonth.days[currentIndex + 1]);
          } else if (activeMonthIndex < months.length - 1) {
            setActiveMonthIndex(activeMonthIndex + 1);
            const nextMonth = months[activeMonthIndex + 1];
            setSelectedDay(nextMonth.days[0]);
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [months, activeMonthIndex, selectedDay]);

  // Hydrates a fresh application state with January pre-populated content
  const initializeFreshState = () => {
    const storedTrainingStr = localStorage.getItem(LOCAL_STORAGE_TRAINING_KEY);
    let activeTraining: CompanyTrainingConfig | undefined = undefined;
    if (storedTrainingStr) {
      try {
        activeTraining = JSON.parse(storedTrainingStr);
      } catch (e) {
        console.error(e);
      }
    }

    const freshMonths: MonthData[] = MONTH_THEME_TEMPLATES.map((tpl, mIdx) => {
      const daysCount = DAYS_IN_MONTH[mIdx];
      const daysOfThisMonth: DayData[] = [];

      for (let d = 1; d <= daysCount; d++) {
        daysOfThisMonth.push({
          day: d,
          date: formatDateStr(mIdx, d),
          status: 'empty',
          accuracyWarnings: [],
          publishingTimes: {
            instagram: "09:00 AM",
            linkedin: "08:30 AM",
            facebook: "12:00 PM",
            youtube: "04:00 PM"
          }
        });
      }

      return {
        monthIndex: mIdx,
        themeEN: tpl.themeEN,
        themeES: tpl.themeES,
        niche: tpl.niche,
        isAutoGenerated: true,
        isComplete: false,
        days: daysOfThisMonth
      };
    });

    // Populate with realistic mock data for January 2026 (Days 1 to 10)
    const janIndex = 0;
    const janName = "January";
    const janThemeEN = freshMonths[janIndex].themeEN;
    const janThemeES = freshMonths[janIndex].themeES;
    const janNiche = freshMonths[janIndex].niche;

    // Day 1: New Years Day (Thursday) - Warn status (regulatory warning example)
    const rawDay1 = generateDailyContent({
      monthIndex: janIndex,
      monthNameDetail: janName,
      day: 1,
      dateStr: formatDateStr(janIndex, 1),
      themeEN: janThemeEN,
      themeES: janThemeES,
      niche: janNiche,
      trendingTopic: "New Q1 Commercial specifications",
      training: activeTraining
    });
    // Let's artificially inject/trigger a custom ASTM warning for presentation:
    rawDay1.status = 'warning';
    rawDay1.accuracyWarnings.push("Compliance Check: Claims for 'Waterproof' must list specific ASTM rating to be permitted under US wholesale guidelines.");
    freshMonths[janIndex].days[0] = rawDay1;

    // Day 2: Friday (Social Proof / successes) - Approved status
    const rawDay2 = generateDailyContent({
      monthIndex: janIndex,
      monthNameDetail: janName,
      day: 2,
      dateStr: formatDateStr(janIndex, 2),
      themeEN: janThemeEN,
      themeES: janThemeES,
      niche: janNiche,
      trendingTopic: "WPC exterior cladding solutions",
      training: activeTraining
    });
    rawDay2.status = 'reviewed'; // Approved
    rawDay2.accuracyWarnings = [];
    freshMonths[janIndex].days[1] = rawDay2;

    // Day 3: Saturday (Luxury / Aspire) - Approved
    const rawDay3 = generateDailyContent({
      monthIndex: janIndex,
      monthNameDetail: janName,
      day: 3,
      dateStr: formatDateStr(janIndex, 3),
      themeEN: janThemeEN,
      themeES: janThemeES,
      niche: janNiche,
      trendingTopic: "Biophilic Design Expansion",
      training: activeTraining
    });
    rawDay3.status = 'reviewed';
    rawDay3.accuracyWarnings = [];
    freshMonths[janIndex].days[2] = rawDay3;

    // Day 4: Sunday (Planning / Checklist) - Generated status (unreviewed)
    const rawDay4 = generateDailyContent({
      monthIndex: janIndex,
      monthNameDetail: janName,
      day: 4,
      dateStr: formatDateStr(janIndex, 4),
      themeEN: janThemeEN,
      themeES: janThemeES,
      niche: janNiche,
      trendingTopic: "Direct-to-port logistics consolidation",
      training: activeTraining
    });
    rawDay4.status = 'generated';
    rawDay4.accuracyWarnings = [];
    freshMonths[janIndex].days[3] = rawDay4;

    // Day 5: Monday, Jan 5, 2026 (Motivation/Education) - Prefilled matching sample format
    const rawDay5 = generateDailyContent({
      monthIndex: janIndex,
      monthNameDetail: janName,
      day: 5,
      dateStr: formatDateStr(janIndex, 5),
      themeEN: janThemeEN,
      themeES: janThemeES,
      niche: janNiche,
      trendingTopic: "Acoustic fluted composite insulation",
      training: activeTraining
    });
    rawDay5.status = 'generated';
    rawDay5.accuracyWarnings = [];
    freshMonths[janIndex].days[4] = rawDay5;

    // Day 6 to 10: Auto-generate as 'generated' unreviewed
    for (let d = 6; d <= 10; d++) {
      const gD = generateDailyContent({
        monthIndex: janIndex,
        monthNameDetail: janName,
        day: d,
        dateStr: formatDateStr(janIndex, d),
        themeEN: janThemeEN,
        themeES: janThemeES,
        niche: janNiche,
        trendingTopic: "Drywall replacement materials",
        training: activeTraining
      });
      gD.status = 'generated';
      freshMonths[janIndex].days[d - 1] = gD;
    }

    setMonths(freshMonths);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(freshMonths));
    setSelectedDay(freshMonths[janIndex].days[4]); // Select Day 5 (Monday sample) as active
    setActiveMonthIndex(0);
    showToast("January 2026 Content Hydrated • Calendario Hidratado");
  };

  // Saves active state to local storage
  const saveState = (updatedMonths: MonthData[]) => {
    setMonths(updatedMonths);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedMonths));
  };

  // Toggle Language Handler
  const handleToggleLang = () => {
    const nextLang = language === 'EN' ? 'ES' : 'EN';
    setLanguage(nextLang);
    localStorage.setItem(LOCAL_STORAGE_LANG_KEY, nextLang);
    showToast(`Language switched to: ${nextLang === 'EN' ? 'English (EE.UU.)' : 'Español (América)'}`);
  };

  // Save API Config Key
  const handleSaveApiConfigs = (configs: ApiKeysConfig) => {
    setApiConfigs(configs);
    localStorage.setItem(LOCAL_STORAGE_API_KEY, JSON.stringify(configs));
  };

  // Monthly Theme Update Manual override (Respects user manual edits)
  const handleThemeUpdate = (index: number, field: 'themeEN' | 'themeES' | 'niche', value: string) => {
    const updated = [...months];
    updated[index] = {
      ...updated[index],
      [field]: value,
      isAutoGenerated: false // Marked as manually customized
    };

    saveState(updated);
  };

  // Auto-Generate ALL 12 MONTH themes (Seasonal construction/design algorithms)
  const handleAutoGenerateThemes = () => {
    const updated = months.map((m, idx) => {
      const template = MONTH_THEME_TEMPLATES[idx];
      return {
        ...m,
        themeEN: template.themeEN,
        themeES: template.themeES,
        niche: template.niche,
        isAutoGenerated: true
      };
    });

    saveState(updated);
    showToast(language === 'EN' ? "Re-generated 12 Months Seasonal Themes • Temas Re-generados" : "Temas estacionales de 12 meses re-generados con éxito");
  };

  // Generate Today's content specifically
  const handleGenerateDay = () => {
    if (!selectedDay) return;
    const currentMonth = months[activeMonthIndex];
    const trend = getActiveTrend();

    const output = generateDailyContent({
      monthIndex: activeMonthIndex,
      monthNameDetail: MONTH_NAMES[activeMonthIndex].en,
      day: selectedDay.day,
      dateStr: selectedDay.date,
      themeEN: currentMonth.themeEN,
      themeES: currentMonth.themeES,
      niche: currentMonth.niche,
      trendingTopic: trend.trendingTopic,
      publishingTimes: selectedDay.publishingTimes,
      toneOfVoice: toneOfVoice,
      training: trainingConfig
    });

    const updatedDays = [...currentMonth.days];
    updatedDays[selectedDay.day - 1] = output;

    const updatedMonths = [...months];
    updatedMonths[activeMonthIndex] = {
      ...currentMonth,
      days: updatedDays
    };

    // Keep active selected day structure linked
    setSelectedDay(output);
    saveState(updatedMonths);
    showToast(language === 'EN' ? `Day ${selectedDay.day} content generated successfully • Ready` : `Contenido del día ${selectedDay.day} generado con éxito`);
  };

  // Bulk Generate Month (Executes daily content generation loop across the month)
  const handleBulkGenerateMonth = (mIdx: number) => {
    const targetMonth = months[mIdx];
    const trend = getActiveTrend();
    
    showToast(language === 'EN' ? `Assembling Q1 specs for ${MONTH_NAMES[mIdx].en}...` : `Estructurando especificaciones del mes de ${MONTH_NAMES[mIdx].es}...`);

    const updatedDays = targetMonth.days.map((d) => {
      return generateDailyContent({
        monthIndex: mIdx,
        monthNameDetail: MONTH_NAMES[mIdx].en,
        day: d.day,
        dateStr: d.date,
        themeEN: targetMonth.themeEN,
        themeES: targetMonth.themeES,
        niche: targetMonth.niche,
        trendingTopic: trend.trendingTopic,
        publishingTimes: d.publishingTimes,
        toneOfVoice: toneOfVoice,
        training: trainingConfig
      });
    });

    const updatedMonths = [...months];
    updatedMonths[mIdx] = {
      ...targetMonth,
      days: updatedDays,
      isComplete: true
    };

    // Update active selected day if it's within this month
    if (activeMonthIndex === mIdx && selectedDay) {
      setSelectedDay(updatedDays[selectedDay.day - 1]);
    }

    saveState(updatedMonths);
    showToast(language === 'EN' ? `Completed bulk generation for ${MONTH_NAMES[mIdx].en}! • Listo` : `¡Generación completa del mes de ${MONTH_NAMES[mIdx].es} finalizada!`);
  };

  // Save AI Brand Training Config
  const handleSaveTrainingConfig = (config: CompanyTrainingConfig) => {
    setTrainingConfig(config);
    localStorage.setItem(LOCAL_STORAGE_TRAINING_KEY, JSON.stringify(config));
    showToast(language === 'EN' ? "Brand Training parameters saved!" : "¡Parámetros de entrenamiento de marca guardados!");
  };

  // Save Google Analytics Config
  const handleSaveAnalyticsConfig = (config: GoogleAnalyticsConfig) => {
    setAnalyticsConfig(config);
    localStorage.setItem(LOCAL_STORAGE_ANALYTICS_KEY, JSON.stringify(config));
    showToast(language === 'EN' ? "Google Analytics connection updated!" : "¡Conexión de Google Analytics actualizada!");
  };

  // Rebuild all generated contents instantly using updated AI Training guidelines
  const handleTriggerRebuild = () => {
    const trend = getActiveTrend();
    const updatedMonths = months.map((month, mIdx) => {
      const updatedDays = month.days.map((d) => {
        if (d.status !== 'empty') {
          return generateDailyContent({
            monthIndex: mIdx,
            monthNameDetail: MONTH_NAMES[mIdx].en,
            day: d.day,
            dateStr: d.date,
            themeEN: month.themeEN,
            themeES: month.themeES,
            niche: month.niche,
            trendingTopic: trend.trendingTopic,
            publishingTimes: d.publishingTimes,
            toneOfVoice: d.toneOfVoice || toneOfVoice,
            training: trainingConfig
          });
        }
        return d;
      });
      return {
        ...month,
        days: updatedDays
      };
    });

    saveState(updatedMonths);
    if (selectedDay) {
      setSelectedDay(updatedMonths[activeMonthIndex].days[selectedDay.day - 1]);
    }
    showToast(language === 'EN' ? "All calendars re-processed with new Brand AI Training specs!" : "¡Calendarios re-procesados con las especificaciones de entrenamiento de IA de la marca!");
  };

  // Export current month as a JSON backup payload file
  const handleExportJSON = (mIdx: number) => {
    const targetMonth = months[mIdx];
    const dataStr = JSON.stringify(targetMonth, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `unitec-backup-month-${MONTH_NAMES[mIdx].en.toLowerCase()}-2026.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    recordExportLog('JSON', mIdx);
    showToast(language === 'EN' ? `Backup file downloaded: (.json)` : `Copia de seguridad descargada: (.json)`);
  };

  // Export current month's generation assets as a UTF-8 BOM compatible CSV spreadsheet
  const handleExportCSV = (mIdx: number) => {
    const targetMonth = months[mIdx];
    
    // Columns list matching brand assets, status, timings, and custom styling profiles
    const headers = [
      "Day",
      "Date",
      "Status",
      "Niche",
      "Theme (EN)",
      "Theme (ES)",
      "Instagram Content",
      "Instagram Time",
      "LinkedIn Content",
      "LinkedIn Time",
      "Facebook Content",
      "Facebook Time",
      "YouTube Content",
      "YouTube Time",
      "AI Visual Prompt",
      "Tone of Voice"
    ];

    const escapeCSV = (val: string) => {
      if (!val) return '""';
      const clean = val.replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = [headers.join(',')];

    targetMonth.days.forEach(day => {
      const igPost = day.platforms?.instagram?.text || '';
      const liPost = day.platforms?.linkedin?.text || '';
      const fbPost = day.platforms?.facebook?.text || '';
      const ytPost = day.platforms?.youtube?.text || '';
      const igTime = day.publishingTimes?.instagram || '09:00 AM';
      const liTime = day.publishingTimes?.linkedin || '08:30 AM';
      const fbTime = day.publishingTimes?.facebook || '12:00 PM';
      const ytTime = day.publishingTimes?.youtube || '04:00 PM';

      const line = [
        day.day,
        day.date,
        day.status,
        targetMonth.niche,
        escapeCSV(targetMonth.themeEN),
        escapeCSV(targetMonth.themeES),
        escapeCSV(igPost),
        escapeCSV(igTime),
        escapeCSV(liPost),
        escapeCSV(liTime),
        escapeCSV(fbPost),
        escapeCSV(fbTime),
        escapeCSV(ytPost),
        escapeCSV(ytTime),
        escapeCSV(day.imagePrompt || ''),
        escapeCSV(day.toneOfVoice || 'Sales-driven')
      ].join(',');
      
      rows.push(line);
    });

    const csvContent = "\uFEFF" + rows.join('\r\n'); // Prefix with UTF-8 BOM byte sequence
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `unitec-export-month-${MONTH_NAMES[mIdx].en.toLowerCase()}-2026.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    recordExportLog('CSV', mIdx);
    showToast(language === 'EN' ? `Backup spreadsheet downloaded: (.csv)` : `Hoja de cálculo de respaldo descargada: (.csv)`);
  };

  // Update status on review workflow (Gold Dot -> empty/unreviewed, Green Check -> reviewed, Red Flag -> warning)
  const handleUpdateStatus = (newStatus: 'empty' | 'generated' | 'reviewed' | 'warning') => {
    if (!selectedDay) return;
    
    const currentMonth = months[activeMonthIndex];
    const updatedDays = [...currentMonth.days];
    
    const mutatedDay = {
      ...selectedDay,
      status: newStatus
    };

    // If manual approve, we allow clearing warnings or highlighting them
    if (newStatus === 'reviewed') {
      mutatedDay.accuracyWarnings = []; // Clear resolved compliance remarks
    }

    updatedDays[selectedDay.day - 1] = mutatedDay;

    const updatedMonths = [...months];
    updatedMonths[activeMonthIndex] = {
      ...currentMonth,
      days: updatedDays
    };

    setSelectedDay(mutatedDay);
    saveState(updatedMonths);
    showToast(language === 'EN' ? `Day ${selectedDay.day} status set to: ${newStatus.toUpperCase()}` : `Estado del día ${selectedDay.day} actualizado a: ${newStatus.toUpperCase()}`);
  };

  // Update Day Date selection (Scheduled Date)
  const handleUpdateDate = (newDate: string) => {
    if (!selectedDay) return;
    const currentMonth = months[activeMonthIndex];
    const updatedDays = [...currentMonth.days];
    
    const mutatedDay = {
      ...selectedDay,
      date: newDate
    };

    updatedDays[selectedDay.day - 1] = mutatedDay;

    const updatedMonths = [...months];
    updatedMonths[activeMonthIndex] = {
      ...currentMonth,
      days: updatedDays
    };

    setSelectedDay(mutatedDay);
    saveState(updatedMonths);
    showToast(language === 'EN' ? `Publish date scheduled: ${newDate}` : `Fecha de publicación programada para el ${newDate}`);
  };

  // Update specific platform posting time
  const handleUpdateTime = (platform: 'instagram' | 'linkedin' | 'facebook' | 'youtube', newTime: string) => {
    if (!selectedDay) return;
    
    const currentMonth = months[activeMonthIndex];
    const updatedDays = [...currentMonth.days];

    const currentTimes = selectedDay.publishingTimes || {
      instagram: "09:00 AM",
      linkedin: "08:30 AM",
      facebook: "12:00 PM",
      youtube: "04:00 PM"
    };

    const updatedTimes = {
      ...currentTimes,
      [platform]: newTime
    };

    // Update the generated text directly if platforms are loaded
    let updatedPlatforms: PlatformPosts | undefined = undefined;
    if (selectedDay.platforms) {
      updatedPlatforms = { ...selectedDay.platforms };
      const currentPost = updatedPlatforms[platform];
      if (currentPost) {
        // Replace or append "Suggested Posting Time: ..." in the text
        const regex = /Suggested Posting Time: [^\n]+/g;
        let newText = currentPost.text;
        if (regex.test(newText)) {
          newText = newText.replace(regex, `Suggested Posting Time: ${newTime}`);
        } else {
          newText = newText + `\n\nSuggested Posting Time: ${newTime}`;
        }
        updatedPlatforms[platform] = {
          ...currentPost,
          text: newText,
          charCount: newText.length
        };
      }
    }

    const mutatedDay = {
      ...selectedDay,
      publishingTimes: updatedTimes,
      platforms: updatedPlatforms
    };

    updatedDays[selectedDay.day - 1] = mutatedDay;

    const updatedMonths = [...months];
    updatedMonths[activeMonthIndex] = {
      ...currentMonth,
      days: updatedDays
    };

    setSelectedDay(mutatedDay);
    saveState(updatedMonths);
  };

  // Trigger manual reset
  const handleResetAll = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_API_KEY);
    initializeFreshState();
    setShowResetConfirm(false);
  };

  // Retrieve current seasonal trend
  const getActiveTrend = (): MarketPulseData => {
    const pool = MOCK_TRENDS[activeMonthIndex] || MOCK_TRENDS[0];
    // Rotate topics depending on system week day
    const day = selectedDay ? selectedDay.day : 1;
    const topicIndex = day % pool.length;
    return pool[topicIndex];
  };

  const currentTrend = getActiveTrend();

  // Handle printing active daily content brief
  const handlePrintBrief = () => {
    setPrintMode('brief');
    // Allow brief state synchronization before opening print dialog
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Handle printing active full-month calendar report
  const handlePrintCalendar = () => {
    setPrintMode('calendar');
    // Allow brief state synchronization before opening print dialog
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Handle generating and preparing the month-level share drawer contents & deep links
  const handleShareMonth = () => {
    const targetMonth = months[activeMonthIndex];
    if (!targetMonth) return;

    const mName = MONTH_NAMES[activeMonthIndex];
    const generatedCount = targetMonth.days.filter(d => d.status !== 'empty').length;
    const reviewedCount = targetMonth.days.filter(d => d.status === 'reviewed').length;
    const totalCount = targetMonth.days.length;

    // Build the query-param deep link
    const deepLink = `${window.location.protocol}//${window.location.host}${window.location.pathname}?month=${activeMonthIndex}`;
    setShareableLink(deepLink);

    // Build summary blocks
    const textES = `🇨🇴 UNITEC USA Design - Plan Social para Colombia 🇨🇴
🗓️ Mes: ${mName.es.toUpperCase()} 2026
🎯 Nicho Objetivo: ${targetMonth.niche.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
📐 Tema del Mes: "${targetMonth.themeES}"
🚀 Estado de Planificación: ${generatedCount} de ${totalCount} días diseñados (${reviewedCount} aprobados por administración).
🔗 Acceda al calendario de planificación interactivo en vivo aquí:
👉 ${deepLink}`;

    const textEN = `🇺🇸 UNITEC USA Design - Social Schedule Plan 🇺🇸
🗓️ Month: ${mName.en.toUpperCase()} 2026
🎯 Target Niche: ${targetMonth.niche.replace('-', ' ')}
📐 Theme: "${targetMonth.themeEN}"
🚀 Progress: ${generatedCount}/${totalCount} days generated (${reviewedCount} approved).
🔗 Open the interactive scheduler here:
👉 ${deepLink}`;

    // Combine bilingual summaries with Spanish first
    const formattedSnippet = `${textES}\n\n======================\n\n${textEN}`;
    setShareableText(formattedSnippet);
    setIsShareOpen(true);

    // Write to clipboard
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(formattedSnippet);
        showToast(language === 'EN' ? "Copied shareable link & summary!" : "¡Vínculo y resumen de mes copiados al portapapeles!");
      } else {
        showToast(language === 'EN' ? "Generated summary. Copy below!" : "Resumen del mes generado. ¡Copie abajo!");
      }
    } catch (err) {
      showToast(language === 'EN' ? "Generated summary. Copy below!" : "Resumen del mes generado. ¡Copie abajo!");
    }
  };

  // Calculate high-level stats
  const totalPostsGenerated = months.reduce((acc, m) => {
    return acc + m.days.filter(d => d.status !== 'empty').length;
  }, 0);

  const totalPostsApproved = months.reduce((acc, m) => {
    return acc + m.days.filter(d => d.status === 'reviewed').length;
  }, 0);

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col justify-between selection:bg-[#c9a961]/30 selection:text-[#1a1a1a]">
      {/* Printable Area - Rendered offscreen, visible strictly in @media print */}
      {printMode === 'brief' && selectedDay && selectedDay.platforms ? (
        <div id="printable-brief" className="hidden print:block p-8 space-y-6 bg-white text-black font-sans">
          <div className="flex justify-between items-start border-b-2 border-black pb-4">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-tight">UNITEC USA Design</h1>
              <p className="text-xs uppercase font-mono tracking-wider text-gray-500">
                Architectural Wholesaling Social Hub • Miami Port District
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-semibold text-gray-800">{selectedDay.date}</h2>
              <p className="text-xs font-mono text-gray-500 uppercase">{new Date(selectedDay.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' })} / {new Date(selectedDay.date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long' })}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs border-b border-gray-200 pb-4">
            <div>
              <p className="font-semibold text-gray-500">Monthly Theme:</p>
              <p className="text-sm font-medium">{months[activeMonthIndex]?.themeEN} / {months[activeMonthIndex]?.themeES}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500">Niche Orientation & Psychology:</p>
              <p className="text-sm font-medium capitalize">{months[activeMonthIndex]?.niche.replace('-', ' ')} • Season Plan</p>
            </div>
          </div>

          {/* Social posts detailed printing layout */}
          <div className="space-y-6">
            {/* Instagram */}
            <div className="space-y-2 border-b border-gray-100 pb-4">
              <h3 className="font-bold text-sm uppercase text-gray-700 flex items-center gap-1.5">📸 INSTAGRAM POST</h3>
              <p className="text-xs whitespace-pre-wrap leading-relaxed text-gray-900 border-l border-gray-300 pl-3 italic">
                {selectedDay.platforms.instagram.text}
              </p>
              <p className="text-[10px] font-mono text-gray-500 mt-2">
                {selectedDay.platforms.instagram.hashtags}
              </p>
            </div>

            {/* LinkedIn */}
            <div className="space-y-2 border-b border-gray-100 pb-4">
              <h3 className="font-bold text-sm uppercase text-gray-700 flex items-center gap-1.5">💼 LINKEDIN INSIGHT</h3>
              <p className="text-xs whitespace-pre-wrap leading-relaxed text-gray-900 border-l border-gray-300 pl-3 italic">
                {selectedDay.platforms.linkedin.text}
              </p>
              <p className="text-[10px] font-mono text-gray-500 mt-2">
                {selectedDay.platforms.linkedin.hashtags}
              </p>
            </div>

            {/* Facebook */}
            <div className="space-y-2 border-b border-gray-100 pb-4">
              <h3 className="font-bold text-sm uppercase text-gray-700 flex items-center gap-1.5">📘 FACEBOOK COMMUNITY</h3>
              <p className="text-xs whitespace-pre-wrap leading-relaxed text-gray-900 border-l border-gray-300 pl-3 italic">
                {selectedDay.platforms.facebook.text}
              </p>
              <p className="text-[10px] font-mono text-gray-500 mt-2">
                {selectedDay.platforms.facebook.hashtags}
              </p>
            </div>

            {/* YouTube */}
            <div className="space-y-2 border-b border-gray-100 pb-4">
              <h3 className="font-bold text-sm uppercase text-gray-700 flex items-center gap-1.5">▶️ YOUTUBE SEO BRIEF</h3>
              <pre className="text-xs whitespace-pre-wrap font-sans text-gray-950 border-l border-gray-300 pl-3 italic">
                {selectedDay.platforms.youtube.text}
              </pre>
            </div>

            {/* Visual description rendering prompt */}
            <div className="bg-gray-50 p-4 rounded border border-gray-200 font-sans">
              <h3 className="font-bold text-xs uppercase text-gray-700 mb-1">🎨 AI CAMERA/MIDJOURNEY IMAGE GENERATION PROMPT</h3>
              <p className="text-xs italic text-gray-600">
                "{selectedDay.imagePrompt}"
              </p>
            </div>
          </div>

          <div className="text-center text-[10px] text-gray-400 font-mono pt-6 border-t border-gray-200">
            UNITEC USA Design System Compliance Report • Generated via Client Engine • Miami, FL
          </div>
        </div>
      ) : printMode === 'calendar' && months[activeMonthIndex] ? (
        <div id="printable-brief" className="hidden print:block p-8 space-y-6 bg-white text-black font-sans">
          <div className="flex justify-between items-start border-b-2 border-black pb-4">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-tight">UNITEC USA Design</h1>
              <p className="text-xs uppercase font-mono tracking-wider text-gray-500">
                DISTRIBUIDOR MAYORISTA DE REVESTIMIENTOS Y PANELES WPC • SEDE LOGÍSTICA MIAMI
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold text-gray-800 uppercase">
                {MONTH_NAMES[activeMonthIndex]?.es.toUpperCase()} / {MONTH_NAMES[activeMonthIndex]?.en.toUpperCase()} 2026
              </h2>
              <p className="text-[9px] font-mono text-gray-500 uppercase">REPORTE DE PLANIFICACIÓN MENSUAL</p>
            </div>
          </div>

          {/* Month High-Level details */}
          <div className="grid grid-cols-3 gap-6 text-xs bg-gray-50 p-4 border border-gray-200 rounded">
            <div>
              <p className="font-semibold text-gray-500 uppercase tracking-wider text-[9px]">Tema del Mes (Español):</p>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">"{months[activeMonthIndex]?.themeES}"</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500 uppercase tracking-wider text-[9px]">Theme (English):</p>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">"{months[activeMonthIndex]?.themeEN}"</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500 uppercase tracking-wider text-[9px]">Enfoque de Mercado / Nicho:</p>
              <p className="text-xs font-semibold text-gray-900 mt-0.5 capitalize">{months[activeMonthIndex]?.niche.replace('-', ' ')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase text-gray-700 tracking-wider text-center">CRONOGRAMA DE PUBLICACIONES DIARIAS</h3>
            
            <table className="w-full text-[10.5px] border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300 text-left text-gray-650 font-bold uppercase tracking-wider text-[9px]">
                  <th className="py-2 px-2 border-r border-gray-300 text-center w-12">Día</th>
                  <th className="py-2 px-2 border-r border-gray-300 w-24">Fecha</th>
                  <th className="py-2 px-2 border-r border-gray-300 w-32">Estado</th>
                  <th className="py-2 px-2 border-r border-gray-300 w-64">Horarios Programados (IG • LI • FB • YT)</th>
                  <th className="py-2 px-2">Ángulo de Comunicación Principal / Tema</th>
                </tr>
              </thead>
              <tbody>
                {months[activeMonthIndex]?.days.map((d, index) => {
                  const dow = new Date(d.date + 'T12:00:00').getDay();
                  const weekdaysLabelES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
                  const statusLabels = {
                    empty: 'Borrador / Vacío',
                    generated: 'Generado con IA',
                    reviewed: 'Aprobado Admin',
                    warning: 'Alerta de Norma'
                  };
                  
                  return (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-center bg-gray-50/50">{d.day}</td>
                      <td className="py-1.5 px-2 border-r border-gray-200 text-gray-600 font-mono text-[10px]">
                        {d.date} <span className="text-[9px] text-gray-400">({weekdaysLabelES[dow]})</span>
                      </td>
                      <td className="py-1.5 px-2 border-r border-gray-200 text-xs">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full mr-1.5 align-middle ${
                          d.status === 'reviewed' ? 'bg-emerald-500' :
                          d.status === 'warning' ? 'bg-amber-500' :
                          d.status === 'generated' ? 'bg-[#c9a961]' : 'bg-stone-300'
                        }`} />
                        <span className="align-middle text-[10px] font-semibold">{statusLabels[d.status]}</span>
                      </td>
                      <td className="py-1.5 px-2 border-r border-gray-200 font-mono text-[9px] text-gray-500 leading-tight">
                        IG: {d.publishingTimes?.instagram || "09:00 AM"} | LI: {d.publishingTimes?.linkedin || "08:30 AM"} | FB: {d.publishingTimes?.facebook || "12:00 PM"} | YT: {d.publishingTimes?.youtube || "04:00 PM"}
                      </td>
                      <td className="py-1.5 px-2 text-gray-800 text-[10px] font-medium truncate max-w-[200px]">
                        {d.status === 'empty' ? (
                          <span className="text-gray-400 italic text-[9px]">Sin generación</span>
                        ) : (
                          <span>{d.imagePrompt || "Campañas listas"}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-center text-[9px] text-gray-400 font-mono pt-6 border-t border-gray-200 mt-8">
            UNITEC USA Design System Compliance Report • Generated via Client Engine • Miami, FL
          </div>
        </div>
      ) : null}

      {/* Main UI App Screen */}
      <div className="no-print flex-1 flex flex-col">
        {/* Navigation / Header bar */}
        <header className="sticky top-0 z-40 bg-[#1a1a1a] shadow-lg border-b border-stone-800 px-4 py-4">
          <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Logo Group */}
            <div className="flex flex-col justify-center">
              <h1 className="font-mono font-black text-lg tracking-tight text-[#c9a961] uppercase">
                Content Mission Control Unitecusa.jas
              </h1>
              <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] mt-0.5">
                {language === 'EN' ? 'Bilingual Social Planner • 2026' : 'Planificador Social Bilingüe • 2026'}
              </p>
            </div>

            {/* Action deck */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Telemetry Counter & Auto-save */}
              <div className="hidden sm:flex items-center gap-3 bg-[#262626] border border-stone-800 rounded px-3 py-1.5 text-xs font-mono">
                <div>
                  <span className="text-stone-400 font-bold">{language === 'EN' ? 'GEN:' : 'GEN:'}</span> <strong className="text-[#c9a961]">{totalPostsGenerated}</strong>
                </div>
                <div className="w-px h-3 bg-stone-700" />
                <div>
                  <span className="text-stone-400 font-bold">{language === 'EN' ? 'APPROVED:' : 'APROBADO:'}</span> <strong className="text-emerald-400">{totalPostsApproved}</strong>
                </div>
                {lastSaved && (
                  <>
                    <div className="w-px h-3 bg-stone-700" />
                    <div>
                      <span className="text-stone-400 font-bold">{language === 'EN' ? 'LAST SAVED:' : 'GUARDADO:'}</span> <span className="text-stone-300 ml-1">{lastSaved.toLocaleTimeString(language === 'EN' ? 'en-US' : 'es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </>
                )}
              </div>

              {/* EN/ES Language Toggle */}
              <button
                id="toggle-language-btn"
                onClick={handleToggleLang}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#262626] hover:bg-[#333333] border border-stone-850 hover:border-stone-750 text-stone-200 font-sans text-xs font-bold rounded transition-all cursor-pointer"
                title={language === 'ES' ? "Selector de Idioma Bilingüe" : "Bilingual Language Switcher"}
              >
                <Globe size={13} className="text-[#c9a961]" />
                <span>
                  {language === 'ES' ? '🇪🇸 [ES] / en' : '🇺🇸 en / [EN]'}
                </span>
              </button>

              {/* Instructions Modal Button */}
              <button
                id="open-manual-btn"
                onClick={() => setIsHowToUseOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#262626] hover:bg-[#333333] border border-stone-850 hover:border-stone-750 text-stone-200 font-sans text-xs font-bold rounded transition-all cursor-pointer"
              >
                <BookOpen size={13} className="text-[#c9a961]" />
                <span>{language === 'EN' ? 'Workflow Guide' : 'Manual de Tránsito'}</span>
              </button>

              {/* Hard Reset Button */}
              <button
                id="trigger-factory-reset-btn"
                onClick={() => setShowResetConfirm(true)}
                className="p-2 bg-[#262626] hover:bg-stone-800 text-[#c9a961] hover:text-red-405 border border-stone-850 hover:border-stone-750 rounded transition-all cursor-pointer"
                title={language === 'EN' ? "Reset Calendar Data" : "Reiniciar Calendario"}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Frame Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Hand: Market Pulse Side Rails (1 col) */}
            <div className="lg:col-span-1 space-y-6">
              <MarketPulse
                currentTrend={currentTrend}
                apiConfigs={apiConfigs}
                onSaveConfigs={handleSaveApiConfigs}
                language={language}
                activeMonth={months[activeMonthIndex]}
                selectedDay={selectedDay}
              />

              {/* Central Admin Control & Smart Social Specs Panel */}
              <div id="smart-admin-compliance-card" className="bg-white border border-[#e5e5df] rounded-xl text-[#1a1a1a] shadow-sm overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-[#1a1a1a] p-4 text-white">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#c9a961] font-mono">
                    {language === 'EN' ? '🤖 Admin Hub & Smart Formatter' : '🤖 Panel Centro de Control & Admin'}
                  </h4>
                  <p className="text-[10px] text-stone-400 font-sans mt-0.5">
                    {language === 'EN' ? 'Compliance specs, admin FAQs, & Colombia regional settings' : 'Directrices de formato, control de admin y mercado Colombia'}
                  </p>
                </div>

                {/* Tab selectors */}
                <div className="flex border-b border-[#e5e5df] bg-stone-50 text-[10.5px] font-bold font-sans">
                  <button
                    id="admin-tab-btn"
                    onClick={() => setComplianceActiveTab('admin')}
                    className={`flex-1 py-2 text-center border-r border-[#e5e5df] transition-all cursor-pointer ${
                      complianceActiveTab === 'admin' ? 'bg-white text-[#2d5a4a] font-black border-b-2 border-b-[#2d5a4a]' : 'text-stone-500 hover:bg-stone-100'
                    }`}
                  >
                    {language === 'EN' ? 'Admin Central' : 'Control Admin'}
                  </button>
                  <button
                    id="specs-tab-btn"
                    onClick={() => setComplianceActiveTab('specs')}
                    className={`flex-1 py-2 text-center border-r border-[#e5e5df] transition-all cursor-pointer ${
                      complianceActiveTab === 'specs' ? 'bg-white text-[#2d5a4a] font-black border-b-2 border-b-[#2d5a4a]' : 'text-stone-500 hover:bg-stone-100'
                    }`}
                  >
                    {language === 'EN' ? 'Smart Format' : 'Normas Formato'}
                  </button>
                  <button
                    id="colombia-tab-btn"
                    onClick={() => setComplianceActiveTab('colombia')}
                    className={`flex-1 py-2 text-center transition-all cursor-pointer ${
                      complianceActiveTab === 'colombia' ? 'bg-white text-[#2d5a4a] font-black border-b-2 border-b-[#2d5a4a]' : 'text-stone-500 hover:bg-stone-100'
                    }`}
                  >
                    {language === 'EN' ? 'Colombia Spec' : 'Destino Colombia'}
                  </button>
                </div>

                {/* Tab content bodies */}
                <div className="p-4 space-y-3 min-h-[220px]">
                  {complianceActiveTab === 'admin' && (
                    <div className="space-y-2.5 animate-fadeIn">
                      <div className="text-[11px] font-sans font-bold text-[#2d5a4a] leading-tight flex items-center gap-1.5 uppercase">
                        <span className="w-2 h-2 rounded bg-[#2d5a4a] block"></span>
                        ¿Hay un panel de administración separado?
                      </div>
                      <p className="text-[11.5px] text-stone-600 leading-relaxed font-sans">
                        <strong>No se requiere panel externo.</strong> La propia interfaz del panel interactivo actúa como su consola de administración unificada.
                      </p>
                      
                      {/* Audit log component for exporting actions */}
                      <div className="p-2.5 bg-[#f5f5f0] border border-[#e5e5df] rounded space-y-2">
                        <div className="flex items-center justify-between font-mono text-[9px] uppercase font-bold text-stone-500">
                          <span>📋 {language === 'EN' ? 'Recent Exports Log' : 'Registro de Exportaciones'}</span>
                          <span className="bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded text-[8px] font-sans font-bold">
                            {language === 'EN' ? 'Audit' : 'Auditoría'}
                          </span>
                        </div>
                        {exportLogs.length === 0 ? (
                          <p className="text-[9.5px] text-stone-450 italic font-mono">
                            {language === 'EN' ? 'No export history found.' : 'Sin historial de exportaciones.'}
                          </p>
                        ) : (
                          <div className="space-y-1 max-h-[110px] overflow-y-auto pr-0.5">
                            {exportLogs.map((log, idx) => (
                              <div key={idx} className="flex items-center justify-between p-1 bg-white border border-stone-200 rounded text-[9.5px] font-mono">
                                <span className="flex items-center gap-1 font-bold text-stone-750">
                                  <span className={`px-1 py-0.1 rounded text-[7.5px] text-white font-sans ${log.fileType === 'CSV' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                                    {log.fileType}
                                  </span>
                                  <span className="truncate max-w-[70px]" title={log.monthName}>{log.monthName}</span>
                                </span>
                                <span className="text-stone-450 text-[8.5px]">{log.timestamp}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="p-2 bg-stone-50 border border-stone-200 rounded text-[10px] text-stone-500 font-sans space-y-1">
                        <p className="font-semibold text-stone-850">{language === 'EN' ? 'Quick Manual Rules' : 'Manual de Regulación Rápido'}</p>
                        <p className="text-[9.5px] text-stone-450">
                          {language === 'EN'
                            ? 'Modify templates downward, customize timings, and save in-browser automatically.'
                            : 'Modifique temas en la rejilla inferior, cambie horas y guarde progresos al instante.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {complianceActiveTab === 'specs' && (
                    <div className="space-y-2.5 animate-fadeIn">
                      <span className="text-[11px] font-sans font-bold text-[#c9a961] block uppercase tracking-wider font-mono">
                        ✓ Verificación de Formato Automático 2026:
                      </span>
                      <ul className="space-y-2 text-[11px] text-stone-650 font-mono">
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#2d5a4a] font-bold">✓</span>
                          <span>
                            <strong>Regulaciones Meta (IG/FB):</strong> Límite estricto de 2,200 caracteres verificado. Densidad de 15-20 directrices de hashtags.
                          </span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#2d5a4a] font-bold">✓</span>
                          <span>
                            <strong>LinkedIn API Specs:</strong> 0% emojis para mantener la máxima formalidad corporativa de ingeniería.
                          </span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#2d5a4a] font-bold">✓</span>
                          <span>
                            <strong>YouTube Studio:</strong> Títulos enfocados en buscadores SEO y desglose de marcas de tiempo secuenciales.
                          </span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#2d5a4a] font-bold">✓</span>
                          <span>
                            <strong>Bilingüe Automatizado:</strong> Texto primario configurado en español colombiano con traducción inglés secundaria.
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {complianceActiveTab === 'colombia' && (
                    <div className="space-y-3 animate-fadeIn text-xs">
                      {/* Interactive Annual Progress Bar */}
                      <div className="space-y-1.5 p-2 bg-[#2d5a4a]/5 border border-[#2d5a4a]/20 rounded">
                        <div className="flex items-center justify-between font-mono text-[9px] uppercase font-bold text-stone-600">
                          <span>📊 {language === 'EN' ? '12-Month Schedule Progress' : 'Completitud de Rejilla (12 Meses)'}</span>
                          <span className="text-[#2d5a4a] text-xs font-bold leading-none">
                            {(() => {
                              const totalD = months.reduce((acc, m) => acc + m.days.length, 0);
                              const schedD = months.reduce((acc, m) => acc + m.days.filter(d => d.status !== 'empty').length, 0);
                              return totalD > 0 ? Math.round((schedD / totalD) * 100) : 0;
                            })()}%
                          </span>
                        </div>
                        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden flex border border-stone-300">
                          <div 
                            className="bg-[#2d5a4a] h-full rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${(() => {
                                const totalD = months.reduce((acc, m) => acc + m.days.length, 0);
                                const schedD = months.reduce((acc, m) => acc + m.days.filter(d => d.status !== 'empty').length, 0);
                                return totalD > 0 ? Math.round((schedD / totalD) * 100) : 0;
                              })()}%` 
                            }}
                          />
                        </div>
                        <p className="text-[8px] text-stone-500 font-mono text-right font-bold tracking-tight">
                          {months.reduce((acc, m) => acc + m.days.filter(d => d.status !== 'empty').length, 0)} / {months.reduce((acc, m) => acc + m.days.length, 0)} {language === 'EN' ? 'Days Generated' : 'Días Sincronizados'}
                        </p>
                      </div>

                      {/* Holiday toggle component */}
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <label htmlFor="colombia-holiday-toggle" className="block text-[10.5px] font-sans font-bold text-amber-950 cursor-pointer">
                            🇨🇴 {language === 'EN' ? 'Integrate Holidays' : 'Integrar Festivos'}
                          </label>
                          <span className="block text-[8.5px] leading-snug text-amber-700 font-mono">
                            {language === 'EN' ? 'Overlays bank closure alerts on active calendar.' : 'Muestra alertas de cierre bancario en el calendario.'}
                          </span>
                        </div>
                        <button
                          id="colombia-holiday-toggle"
                          type="button"
                          onClick={() => {
                            setIntegrateColombiaHolidays(!integrateColombiaHolidays);
                            showToast(language === 'EN' 
                              ? `Colombian Holidays overlay ${!integrateColombiaHolidays ? 'Enabled' : 'Disabled'}` 
                              : `Superposición de Festivo Colombiano ${!integrateColombiaHolidays ? 'Activada' : 'Desactivada'}`);
                          }}
                          className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex-shrink-0 ${
                            integrateColombiaHolidays ? 'bg-amber-500 justify-end' : 'bg-stone-300 justify-start'
                          }`}
                        >
                          <span className="w-4 h-4 bg-white rounded-full shadow" />
                        </button>
                      </div>

                      {/* Priority city multi selector */}
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase tracking-wider text-stone-505 font-mono font-bold">
                          📍 Ciudades de Destino de Contenedores:
                        </label>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga'].map(c => {
                            const isSelected = colombiaPriorityCities.includes(c);
                            return (
                              <button
                                key={c}
                                onClick={() => {
                                  if (isSelected) {
                                    setColombiaPriorityCities(colombiaPriorityCities.filter(x => x !== c));
                                  } else {
                                    setColombiaPriorityCities([...colombiaPriorityCities, c]);
                                  }
                                  showToast(language === 'EN' ? `Updated regional targeting: ${c}` : `Sincronización regional: Target ${c} activado`);
                                }}
                                className={`px-2 py-0.5 text-[10px] font-sans font-bold rounded cursor-pointer transition-all ${
                                  isSelected ? 'bg-[#2d5a4a] text-white' : 'bg-[#f5f5f0] text-stone-600 border border-[#e5e5df]'
                                }`}
                              >
                                {c}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Ports selector */}
                      <div className="space-y-1 pt-1">
                        <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-mono font-bold">
                          🚢 Puerto de Despacho Principal:
                        </label>
                        <div className="flex gap-1.5 pt-0.5">
                          {['Cartagena', 'Buenaventura'].map(p => {
                            const isSelected = colombiaPort === p;
                            return (
                              <button
                                key={p}
                                onClick={() => {
                                    setColombiaPort(p as 'Cartagena' | 'Buenaventura');
                                    showToast(`Puerto establecido en ${p}`);
                                }}
                                className={`flex-1 py-1 text-center font-sans font-extrabold text-[10.5px] rounded border transition-colors cursor-pointer ${
                                  isSelected ? 'bg-stone-900 text-[#c9a961] border-stone-900' : 'bg-transparent text-stone-500 border-stone-300 hover:bg-stone-100'
                                }`}
                              >
                                {p === 'Cartagena' ? 'Cartagena (Atlántico)' : 'Buenaventura (Pacífico)'}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Regulatory brief */}
                      <div className="p-2 border border-[#2d5a4a]/20 bg-[#2d5a4a]/5 rounded text-[10.5px] text-stone-750 font-mono leading-relaxed">
                        ⚡ <strong>Normas NSR-10 Colombia:</strong> Clasificación de combustión recomendada Clase-B WPC en muros internos residenciales.
                      </div>
                    </div>
                  )}
                </div>

                {/* Visual Legend Section */}
                <div className="px-4 py-3 bg-stone-50 border-t border-b border-[#e5e5df]">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-bold mb-1.5">
                    {language === 'EN' ? '📊 Calendar Status Legend' : '📊 Leyenda del Calendario'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10.5px] font-sans">
                    <div className="flex items-center gap-1.5 text-stone-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-stone-300 border border-stone-400/20 shadow-sm" />
                      <span>{language === 'EN' ? 'Empty Draft' : 'Vacío / Borrador'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-750">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#c9a961] shadow-[#c9a961]/20 shadow-sm" />
                      <span>{language === 'EN' ? 'IA Generated' : 'Generado por IA'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-750">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-emerald-500/20 shadow-sm" />
                      <span>{language === 'EN' ? 'Admin Approved' : 'Aprobado Admin'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-750">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-amber-500/20 shadow-sm" />
                      <span>{language === 'EN' ? 'ASTM Warning' : 'Alerta de Norma'}</span>
                    </div>
                  </div>
                </div>

                {/* Print Calendar & Share Month Utilities Row */}
                <div className="p-4 bg-stone-50 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      id="admin-print-calendar-btn"
                      onClick={handlePrintCalendar}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-100 text-stone-850 font-sans font-bold text-xs rounded border border-[#e5e5df] transition-all cursor-pointer shadow-sm text-center"
                      title={language === 'EN' ? 'Print full monthly calendar view' : 'Imprimir vista completa del calendario mensual'}
                    >
                      <FileText size={13} className="text-[#2d5a4a]" />
                      <span>{language === 'EN' ? 'Print Month PDF' : 'Imprimir Mes PDF'}</span>
                    </button>

                    <button
                      id="admin-share-month-btn"
                      onClick={handleShareMonth}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#2d5a4a] hover:bg-[#204236] text-white font-sans font-bold text-xs rounded transition-all cursor-pointer shadow-sm text-center"
                      title={language === 'EN' ? 'Generate deep link and summary' : 'Generar enlace y resumen de mes'}
                    >
                      <Share2 size={13} className="text-[#c9a961]" />
                      <span>{language === 'EN' ? 'Share Month' : 'Compartir Mes'}</span>
                    </button>
                  </div>

                  {/* Dynamic Slide-down drawer for copyable deep link & copy snippet */}
                  {isShareOpen && (
                    <div className="mt-2.5 p-3 bg-white border border-[#e5e5df] rounded-lg space-y-2 animate-fadeIn text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#2d5a4a]">
                          {language === 'EN' ? '🔗 Deep link:' : '🔗 Enlace de Compartido:'}
                        </span>
                        <button
                          onClick={() => {
                            setIsShareOpen(false);
                          }}
                          className="text-[10px] font-sans font-bold text-stone-400 hover:text-stone-700 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-1.5 bg-[#f5f5f0] p-1.5 rounded border border-[#e5e5df]">
                        <input
                          type="text"
                          readOnly
                          value={shareableLink}
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                          className="flex-1 bg-transparent text-[10px] font-mono text-stone-600 outline-none select-all w-full"
                        />
                        <button
                          onClick={() => {
                            try {
                              navigator.clipboard.writeText(shareableLink);
                              showToast(language === 'EN' ? "Link copied!" : "¡Vínculo copiado!");
                            } catch (e) {
                              showToast(language === 'EN' ? "Select link to copy" : "Seleccione el enlace para copiar");
                            }
                          }}
                          className="px-2 py-0.5 text-[9px] font-mono bg-stone-900 text-white rounded font-bold cursor-pointer hover:bg-stone-800"
                        >
                          {language === 'EN' ? 'Copy' : 'Copiar'}
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-stone-400 block">
                          📝 {language === 'EN' ? 'Bilingual Social Summary:' : '📝 Resumen Bilingüe:'}
                        </span>
                        <textarea
                          readOnly
                          value={shareableText}
                          className="w-full h-24 p-2 bg-stone-50 border border-stone-200 rounded text-[9.5px] font-sans text-stone-650 resize-none font-medium leading-relaxed outline-none font-mono"
                          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                        />
                        <button
                          onClick={() => {
                            try {
                              navigator.clipboard.writeText(shareableText);
                              showToast(language === 'EN' ? "Bilingual summary copied!" : "¡Resumen copiado!");
                            } catch (e) {
                              showToast(language === 'EN' ? "Select text box to copy" : "Seleccione el cuadro para copiar");
                            }
                          }}
                          className="w-full py-1 text-center font-sans font-bold text-[10px] bg-stone-100 hover:bg-stone-150 text-stone-805 rounded border border-stone-300 cursor-pointer text-stone-700"
                        >
                          📋 {language === 'EN' ? 'Copy All Text' : 'Copiar Texto Completo'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Hand: Active Control Decks (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Visual Calendar & Months Deck */}
              {months.length > 0 && (
                <VisualCalendar
                  months={months}
                  activeMonthIndex={activeMonthIndex}
                  selectedDay={selectedDay}
                  onMonthSelect={(index) => {
                    setActiveMonthIndex(index);
                    // Automatically click the first day of that month as active focus
                    setSelectedDay(months[index].days[0]);
                  }}
                  onDaySelect={(day) => setSelectedDay(day)}
                  onBulkGenerateMonth={handleBulkGenerateMonth}
                  onExportJSON={handleExportJSON}
                  onExportCSV={handleExportCSV}
                  language={language}
                  integrateColombiaHolidays={integrateColombiaHolidays}
                />
              )}

              {/* Dynamic Daily Content preview / tabs board */}
              <div id="active-daily-dashboard-brick">
                <DailyContentPreview
                  selectedDay={selectedDay}
                  selectedMonth={months[activeMonthIndex]}
                  onGenerateDay={handleGenerateDay}
                  onUpdateDayStatus={handleUpdateStatus}
                  onPrintBrief={handlePrintBrief}
                  language={language}
                  onUpdateDate={handleUpdateDate}
                  onUpdateTime={handleUpdateTime}
                  toneOfVoice={toneOfVoice}
                  onToneOfVoiceChange={(tone) => setToneOfVoice(tone)}
                  integrateColombiaHolidays={integrateColombiaHolidays}
                  onUpdateDay={(updatedDay) => {
                    if (!selectedDay) return;
                    const currentMonth = months[activeMonthIndex];
                    const updatedDays = [...currentMonth.days];
                    updatedDays[updatedDay.day - 1] = updatedDay;

                    const updatedMonths = [...months];
                    updatedMonths[activeMonthIndex] = {
                      ...currentMonth,
                      days: updatedDays
                    };

                    setSelectedDay(updatedDay);
                    saveState(updatedMonths);
                  }}
                />
              </div>

              {/* AI Video Production Hub (HeyGen & InVideo) */}
              <div id="ai-video-studio-brick" className="animate-fadeIn">
                <VideoGenerator
                  selectedDay={selectedDay}
                  selectedMonth={months[activeMonthIndex]}
                  language={language}
                  apiConfigs={apiConfigs}
                  onSaveConfigs={handleSaveApiConfigs}
                  showToast={(msg) => showToast(msg)}
                />
              </div>

              {/* AI Brand Training, Google Analytics, and Step-by-Step Manual Hub */}
              <div id="brand-training-analytics-hub-brick" className="animate-fadeIn">
                <TrainingAnalyticsHub
                  trainingConfig={trainingConfig}
                  analyticsConfig={analyticsConfig}
                  onSaveTraining={handleSaveTrainingConfig}
                  onSaveAnalytics={handleSaveAnalyticsConfig}
                  onTriggerRebuild={handleTriggerRebuild}
                  language={language}
                />
              </div>

              {/* Editable Theme Sequencing Grid Matrix */}
              {months.length > 0 && (
                <div id="editable-theme-sequencer-brick">
                  <ThemeControlPanel
                    months={months}
                    activeMonthIndex={activeMonthIndex}
                    onMonthSelect={(index) => {
                      setActiveMonthIndex(index);
                      setSelectedDay(months[index].days[0]);
                    }}
                    onThemeUpdate={handleThemeUpdate}
                    onAutoGenerateAll={handleAutoGenerateThemes}
                    language={language}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Footer footer-credit */}
      <footer className="no-print border-t border-[#e5e5df] bg-[#e5e5df] py-4 px-4 text-center text-xs text-stone-600 font-mono">
        UNITEC USA Design System • Content Engine Command Center v2.10.8 • Shipped from Miami, FL
      </footer>

      {/* Manual Walkthrough Modal popups */}
      <HowToUseModal isOpen={isHowToUseOpen} onClose={() => setIsHowToUseOpen(false)} />

      {/* Custom Reset Confirm Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white border border-red-200 rounded-xl p-6 space-y-4 shadow-xl text-[#1a1a1a]">
            <h4 className="text-base font-bold text-red-600 uppercase tracking-tight flex items-center gap-2">
              ⚠️ {language === 'EN' ? 'Confirm System Reset?' : '¿Confirmar Reinicio del Sistema?'}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'EN'
                ? 'This action will permanently wipe your LocalStorage cache databases. You will lose all custom month edits, manual post revisions, and spec approvals.'
                : 'Esta acción borrará permanentemente la caché de su base de datos local. Se perderán todos los cambios de temas, revisiones de publicaciones y aprobaciones.'}
            </p>
            <div className="flex gap-2 justify-end pt-2 border-t border-[#e5e5df]">
              <button
                id="execute-system-wipe-btn"
                onClick={handleResetAll}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer"
              >
                {language === 'EN' ? 'Wipe Data and Rebuild' : 'Borrar Datos y Reconstruir'}
              </button>
              <button
                id="cancel-system-wipe-btn"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded text-xs text-stone-800 transition-colors cursor-pointer"
              >
                {language === 'EN' ? 'Abort' : 'Abortar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#c9a961] text-stone-950 border border-[#bfa058] font-sans font-semibold text-xs px-4 py-3 rounded shadow-2xl flex items-center gap-2 animate-slideUp">
          <CheckCircle size={14} className="text-stone-950 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
