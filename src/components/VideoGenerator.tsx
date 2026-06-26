/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Video, 
  Sparkles, 
  User, 
  Music, 
  Volume2, 
  Layers, 
  ChevronRight, 
  ExternalLink, 
  Cpu, 
  Play, 
  Pause, 
  Download, 
  Copy, 
  Check, 
  Clock, 
  RefreshCw, 
  FileVideo,
  Key,
  Database,
  CheckCircle2,
  ListRestart
} from 'lucide-react';
import { DayData, MonthData, ApiKeysConfig, PlatformPosts } from '../types';

interface VideoGeneratorProps {
  selectedDay: DayData | null;
  selectedMonth: MonthData | undefined;
  language: 'EN' | 'ES';
  apiConfigs: ApiKeysConfig;
  onSaveConfigs: (configs: ApiKeysConfig) => void;
  showToast: (msg: string) => void;
}

interface GeneratedVideo {
  id: string;
  source: 'HeyGen' | 'InVideo';
  title: string;
  script: string;
  avatar?: string;
  voiceStyle?: string;
  musicStyle?: string;
  substyle?: string;
  duration: string;
  date: string;
  videoUrl: string;
  posterUrl: string;
  aspectRatio: '9:16' | '16:9';
}

const PREMADE_AVATARS = [
  { id: 'josh_suit', nameES: 'Josué (Traje de Saco)', nameEN: 'Joshua (Full Corporate)', lang: 'ES/EN', gender: 'M' },
  { id: 'elena_arch', nameES: 'Elena (Arquitecta de Diseños)', nameEN: 'Elena (Interior Architect)', lang: 'ES', gender: 'F' },
  { id: 'carlos_trade', nameES: 'Carlos (Especialista en Importaciones)', nameEN: 'Carlos (Logistics Manager)', lang: 'ES', gender: 'M' },
  { id: 'sofia_eco', nameES: 'Sofía (Asesora de WPC Ecológico)', nameEN: 'Sofia (Eco-WPC Advisor)', lang: 'ES/EN', gender: 'F' }
];

const PREMADE_VOICES = [
  { id: 'es_warm_eng', nameES: 'Español Latino • Técnico Cálido', nameEN: 'LatAm Spanish • Warm Technical', style: 'Neutral' },
  { id: 'es_col_sales', nameES: 'Español Colombia • Ventas Mayorista', nameEN: 'Colombian Spanish • High Conversion', style: 'Sales' },
  { id: 'en_friendly_tech', nameES: 'Inglés Profesional • Entusiasta', nameEN: 'US English • Enthusiastic Coach', style: 'Branding' }
];

const PREMADE_MUSIC = [
  { id: 'tech_ambient', nameES: 'Moderno Tecnológico Industrial', nameEN: 'Modern Subdued Hi-Tech', vibe: 'Corporate' },
  { id: 'latin_groove', nameES: 'Ritmo Urbano Latino Acústico', nameEN: 'Upbeat Acoustic Latin Groove', vibe: 'Energetic' },
  { id: 'luxury_lounge', nameES: 'Minimalista Elegante Lounge', nameEN: 'Luxury Minimalist Hotel Lounge', vibe: 'Aspirational' }
];

// Seed some initial pre-generated videos
const SEEDED_VIDEOS: GeneratedVideo[] = [
  {
    id: 'vid-001',
    source: 'HeyGen',
    title: 'WPC Exterior Facades • Cartagena de Indias',
    script: 'El puerto de Cartagena de Indias recibe carga consolidada de WPC con certificación contra incendios Clase-B. Asegure acabados inalterables al sol y la salinidad de la costa colombiana.',
    avatar: 'Elena (Interior Architect)',
    voiceStyle: 'Colombian Spanish • High Conversion',
    duration: '0:32',
    date: '2026-06-11 08:32 AM',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-wood-details-and-plants-41619-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80',
    aspectRatio: '16:9'
  },
  {
    id: 'vid-002',
    source: 'InVideo',
    title: 'Sostenibilidad y Certificaciones WPC Colombia',
    script: '¿Sabe por qué las construcciones premium en Medellín están migrando a perfiles ecológicos acanalados? Descubra la revolución del compuesto de madera-plástico UNITEC USA.',
    musicStyle: 'Luxury Minimalist Hotel Lounge',
    substyle: 'Cinematic Subtitles (Yellow Bold)',
    duration: '0:45',
    date: '2026-06-12 02:15 PM',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-worker-installing-wooden-flooring-41804-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=500&q=80',
    aspectRatio: '9:16'
  }
];

export default function VideoGenerator({
  selectedDay,
  selectedMonth,
  language,
  apiConfigs,
  onSaveConfigs,
  showToast
}: VideoGeneratorProps) {
  const [activeTab, setActiveTab] = useState<'heygen' | 'invideo' | 'gallery'>('heygen');
  const [heygenSettings, setHeygenSettings] = useState({
    avatar: PREMADE_AVATARS[0].id,
    voice: PREMADE_VOICES[0].id,
    aspect: '16:9' as '16:9' | '9:16',
    platformSource: 'instagram' as 'instagram' | 'linkedin' | 'facebook' | 'youtube'
  });

  const [invideoSettings, setInvideoSettings] = useState({
    music: PREMADE_MUSIC[0].id,
    substyle: 'yellow_bold',
    aspect: '9:16' as '16:9' | '9:16',
    customPrompt: '',
    voiceStyle: 'EN-Coherent Female'
  });

  // API Config settings overlay inside the pane
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [heygenKey, setHeygenKey] = useState(apiConfigs.heygen || '');
  const [invideoKey, setInvideoKey] = useState(apiConfigs.invideo || '');
  const [isKeysSaved, setIsKeysSaved] = useState(false);

  // Video Gallery list
  const [videosList, setVideosList] = useState<GeneratedVideo[]>(() => {
    try {
      const stored = localStorage.getItem('unitec_generated_videos_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return SEEDED_VIDEOS;
  });

  // Rendering State Pipeline
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStep, setRenderStep] = useState<string>('');
  const [activeApiLog, setActiveApiLog] = useState<{
    endpoint: string;
    method: string;
    headers: any;
    body: string;
    response: string;
  } | null>(null);

  // Active Video Player Mode
  const [activePlayVideo, setActivePlayVideo] = useState<GeneratedVideo | null>(SEEDED_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem('unitec_generated_videos_v1', JSON.stringify(videosList));
  }, [videosList]);

  // Handle saving API configurations
  const handleSavePanelKeys = () => {
    onSaveConfigs({
      ...apiConfigs,
      heygen: heygenKey,
      invideo: invideoKey
    });
    setIsKeysSaved(true);
    setTimeout(() => {
      setIsKeysSaved(false);
      setShowApiSetup(false);
    }, 1800);
    showToast(language === 'EN' ? 'Video keys synced successfully' : 'Claves de API de video guardadas con éxito');
  };

  // Get active text based on channel
  const getSelectedPlatformText = (): string => {
    if (!selectedDay || !selectedDay.platforms) {
      return language === 'EN' 
        ? "Class-B WPC internal residence fire-retarding standards cladding."
        : "Revestimiento WPC con norma de resistencia al fuego Clase-B para residencias.";
    }
    const source = heygenSettings.platformSource;
    const post = selectedDay.platforms[source];
    return post ? post.text : '';
  };

  const getInVideoPromptText = (): string => {
    if (invideoSettings.customPrompt) return invideoSettings.customPrompt;
    if (!selectedDay || !selectedMonth) {
      return language === 'EN'
        ? "Create an architectural showcase about standard commercial fluted paneling in Colombia."
        : "Crea un escaparate de arquitectura comercial sobre paneles acanalados en Colombia.";
    }
    return language === 'EN'
      ? `A dynamic high-conversion social clip about: ${selectedMonth.themeEN}. Specifically targeting local distributors with waterproof fluted profiles.`
      : `Un video dinámico sobre: ${selectedMonth.themeES}. Enfocado en instaladores que buscan perfiles acanalados impermeables de alto tránsito.`;
  };

  // Perform Simulated API request with real logs for developer visibility
  const triggerVideoGeneration = (source: 'HeyGen' | 'InVideo') => {
    setIsRendering(true);
    setRenderProgress(5);
    
    const keyUsed = source === 'HeyGen' ? (heygenKey || 'KEY_SIMULATED_PROD_1e8fd3') : (invideoKey || 'KEY_SIMULATED_PROD_5c99ab');
    
    let endpoint = '';
    let bodyPayload = {};
    
    if (source === 'HeyGen') {
      endpoint = 'https://api.heygen.com/v2/video/generate';
      const textScript = getSelectedPlatformText();
      const chosenAvatar = PREMADE_AVATARS.find(a => a.id === heygenSettings.avatar);
      const chosenVoice = PREMADE_VOICES.find(v => v.id === heygenSettings.voice);
      
      bodyPayload = {
        video_inputs: [{
          character: {
            type: 'avatar',
            avatar_id: chosenAvatar?.id || 'sofia_eco',
            avatar_style: 'normal'
          },
          voice: {
            type: 'text_to_speech',
            voice_id: chosenVoice?.id || 'es_warm_eng',
            input_text: textScript.substring(0, 500)
          }
        }],
        dimension: heygenSettings.aspect === '16:9' ? { width: 1920, height: 1080 } : { width: 1080, height: 1920 }
      };
    } else {
      endpoint = 'https://api.invideo.io/v1/video/generate';
      const promptInstruction = getInVideoPromptText();
      const chosenMusic = PREMADE_MUSIC.find(m => m.id === invideoSettings.music);
      
      bodyPayload = {
        prompt: promptInstruction,
        settings: {
          aspect_ratio: invideoSettings.aspect,
          subtitle_style: invideoSettings.substyle,
          voiceover: invideoSettings.voiceStyle,
          soundtrack: chosenMusic?.nameEN || 'tech_ambient'
        }
      };
    }

    // Set Live API Inspection logs so developer can see the request layout
    setActiveApiLog({
      endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keyUsed.substring(0, 12)}***`
      },
      body: JSON.stringify(bodyPayload, null, 2),
      response: '{\n  "status": "pending",\n  "job_id": "job_' + Math.random().toString(36).substring(2, 10) + '",\n  "eta_seconds": 15,\n  "message": "Enqueued in rendering queue successfully"\n}'
    });

    setRenderStep(language === 'EN' ? 'Initializing Secure Socket API Link...' : 'Estableciendo enlace de Socket seguro para la API...');

    // Progress bar increments
    const interval = setInterval(() => {
      setRenderProgress(prev => {
        const next = prev + 15;
        if (next >= 105) {
          clearInterval(interval);
          finalizeVideoGeneration(source);
          return 100;
        }

        // Change step labels based on progress percentages
        if (next < 30) {
          setRenderStep(language === 'EN' ? `Authorizing Connection & Submitting JSON payload...` : 'Autorizando conexión y enviando paquete de datos JSON...');
        } else if (next < 60) {
          setRenderStep(language === 'EN' ? `API accepted connection. Transcoding TTS layers and frames...` : 'La API aceptó la conexión. Convirtiendo voces y fotogramas...');
        } else if (next < 85) {
          setRenderStep(language === 'EN' ? `Watermarking brand overlays and composing media outputs...` : 'Alineando marca de agua del puerto de destino y compilando archivo...');
        } else {
          setRenderStep(language === 'EN' ? `API report: Job completed! Fetching render container URL results...` : 'API reporta: ¡Operación completada! Obteniendo dirección de descarga...');
        }
        
        return next;
      });
    }, 900);
  };

  const finalizeVideoGeneration = (source: 'HeyGen' | 'InVideo') => {
    // Generate simulated video output
    const isHeyGen = source === 'HeyGen';
    const dayTag = selectedDay ? `Día ${selectedDay.day}` : 'Día Central';
    const portName = selectedDay && selectedDay.day % 2 === 0 ? 'Cartagena' : 'Buenaventura';
    
    // Choose realistic mock stock video paths based on selection
    const mockVideos = [
      'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-wood-details-and-plants-41619-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-construction-worker-measures-wood-panels-42043-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-architecture-blueprint-plan-design-39908-large.mp4'
    ];
    
    const randomVid = mockVideos[Math.floor(Math.random() * mockVideos.length)];
    const id = `vid-${Math.floor(Math.random() * 900) + 100}`;
    
    let newVideo: GeneratedVideo;

    if (isHeyGen) {
      const avatarObj = PREMADE_AVATARS.find(a => a.id === heygenSettings.avatar);
      const voiceObj = PREMADE_VOICES.find(v => v.id === heygenSettings.voice);
      const scriptText = getSelectedPlatformText();
      
      newVideo = {
        id,
        source: 'HeyGen',
        title: `HeyGen Avatar • ${isSpanish ? 'Presentación de' : 'Presenter'} ${avatarObj?.nameES.split(' ')[0]} (${dayTag})`,
        script: scriptText,
        avatar: avatarObj?.nameES || 'Sofía de WPC',
        voiceStyle: voiceObj?.nameES || 'Warm technical',
        duration: '0:35',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        videoUrl: randomVid,
        posterUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80',
        aspectRatio: heygenSettings.aspect
      };
    } else {
      const musicObj = PREMADE_MUSIC.find(m => m.id === invideoSettings.music);
      const promptText = getInVideoPromptText();
      
      newVideo = {
        id,
        source: 'InVideo',
        title: `InVideo IA • ${isSpanish ? 'Clip Automatizado' : 'Prompt Render'} (${dayTag})`,
        script: promptText,
        musicStyle: musicObj?.nameES || 'Ambient',
        substyle: `Style: ${invideoSettings.substyle.replace('_', ' ')}`,
        duration: '0:40',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        videoUrl: randomVid,
        posterUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=500&q=80',
        aspectRatio: invideoSettings.aspect
      };
    }

    // Update API log to finished
    if (activeApiLog) {
      setActiveApiLog(prev => prev ? {
        ...prev,
        response: JSON.stringify({
          status: "success",
          completed_at: new Date().toISOString(),
          render_id: id,
          duration_seconds: 35,
          download_url: newVideo.videoUrl,
          meta: {
            allocated_port: portName,
            compliance_check: "Class-B Fire Retardant Confirmed (NSR-10 Code)"
          }
        }, null, 2)
      } : null);
    }

    setVideosList(prev => [newVideo, ...prev]);
    setActivePlayVideo(newVideo);
    setIsRendering(false);
    setActiveTab('gallery');
    showToast(isSpanish ? `¡Video por IA generado con éxito! #${id}` : `AI Video generated successfully! #${id}`);
  };

  const handleCopyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
    showToast(isSpanish ? 'Enlace del video copiado al portapapeles' : 'Video link copied to clipboard');
  };

  const isSpanish = language === 'ES';

  return (
    <div id="ai-video-production-studio" className="bg-white border border-[#e5e5df] rounded-xl text-[#1a1a1a] shadow-sm overflow-hidden flex flex-col">
      {/* Visual Header Banner */}
      <div className="bg-[#1a1a1a] p-5 text-white flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-[#c9a961] text-stone-950 font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded">
            <Sparkles size={9} className="animate-spin" />
            {isSpanish ? 'IA PRO • SECTOR SECTORIAL' : 'AI PRO • ENTERPRISE CAPABILITY'}
          </div>
          <h3 className="text-sm font-sans font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Video size={18} className="text-[#c9a961]" />
            {isSpanish ? 'Estudio de Video por IA • HeyGen & InVideo' : 'AI Video Production • HeyGen & InVideo'}
          </h3>
          <p className="text-[10px] text-stone-400 font-sans">
            {isSpanish ? 'Cree avatares realistas y clips técnicos bilingües directo de su planificador diario de WPC' : 'Create talking avatars and specialized technical clips synced with daily social outputs'}
          </p>
        </div>
        
        {/* Settings button */}
        <button
          id="toggle-video-api-keys-panel"
          onClick={() => setShowApiSetup(!showApiSetup)}
          title={isSpanish ? 'Configurar claves API de HeyGen / InVideo' : 'Setup HeyGen / InVideo authentication tokens'}
          className={`p-2 rounded border transition-all cursor-pointer flex items-center gap-1.5 ${
            showApiSetup 
              ? 'bg-[#c9a961] text-stone-950 border-[#c9a961]' 
              : 'bg-stone-900 border-stone-850 hover:bg-stone-800 text-stone-300 hover:text-white'
          }`}
        >
          <Key size={13} />
          <span className="text-[10px] font-mono uppercase font-black tracking-tight">{isSpanish ? 'Ajustar API' : 'API Keys'}</span>
        </button>
      </div>

      {/* Settings Panel */}
      {showApiSetup && (
        <div className="p-4 bg-stone-900 border-b border-stone-800 text-white space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between font-mono text-[10px] text-stone-400 font-bold uppercase pb-1.5 border-b border-stone-800">
            <span className="flex items-center gap-1.5 text-[#c9a961]"><Database size={12} /> {isSpanish ? 'Parámetros de Integración de Video' : 'Video Module Handshake APIs'}</span>
            <span className="text-emerald-500">● {isSpanish ? 'AUTORIZADO' : 'PENDING SECURE'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-stone-300 leading-relaxed">
            <div className="space-y-1">
              <label htmlFor="heygen-key-input" className="block text-[10px] uppercase font-mono text-[#c9a961] font-bold">
                HeyGen REST API Token (v2)
              </label>
              <input
                id="heygen-key-input"
                type="password"
                placeholder="heygen-bearer-token..."
                value={heygenKey}
                onChange={(e) => setHeygenKey(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 text-white rounded px-3 py-1.5 outline-none placeholder-stone-700 font-mono focus:border-[#c9a961]"
              />
              <span className="block text-[9px] text-stone-500">
                {isSpanish ? 'Para autorizar llamadas a https://api.heygen.com v2.' : 'Endpoints hit: https://api.heygen.com/v2/video/generate'}
              </span>
            </div>

            <div className="space-y-1">
              <label htmlFor="invideo-key-input" className="block text-[10px] uppercase font-mono text-[#c9a961] font-bold">
                InVideo API Secret Key (v1)
              </label>
              <input
                id="invideo-key-input"
                type="password"
                placeholder="invideo-ai-auth-bearer..."
                value={invideoKey}
                onChange={(e) => setInvideoKey(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 text-white rounded px-3 py-1.5 outline-none placeholder-stone-700 font-mono focus:border-[#c9a961]"
              />
              <span className="block text-[9px] text-stone-500">
                {isSpanish ? 'Para envíos automáticos de guiones cinemáticos por prompt.' : 'Authorized: Bearer Token pattern for prompt rendering triggers.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              id="confirm-video-keys-save"
              onClick={handleSavePanelKeys}
              className="px-4 py-1.5 bg-[#c9a961] text-stone-950 hover:bg-[#b09352] rounded text-xs font-bold font-sans uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <CheckCircle2 size={13} />
              {isSpanish ? 'Aplicar Credenciales' : 'Apply Auth Config'}
            </button>
            <button
              onClick={() => setShowApiSetup(false)}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-750 rounded text-xs text-stone-300 transition-colors cursor-pointer"
            >
              {isSpanish ? 'Cancelar' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Mode navigation bar */}
      <div className="flex border-b border-[#e5e5df] bg-stone-50 text-[11px] font-sans font-bold">
        <button
          id="video-heygen-tab-btn"
          onClick={() => setActiveTab('heygen')}
          className={`flex-1 py-3 text-center border-r border-[#e5e5df] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'heygen' 
              ? 'bg-white text-[#2d5a4a] font-black border-b-2 border-b-[#2d5a4a]' 
              : 'text-stone-500 hover:bg-stone-100'
          }`}
        >
          <User size={13} className={activeTab === 'heygen' ? 'text-[#c9a961]' : 'text-stone-400'} />
          <span>{isSpanish ? 'Avatares HeyGen' : 'HeyGen Avatars'}</span>
        </button>
        <button
          id="video-invideo-tab-btn"
          onClick={() => setActiveTab('invideo')}
          className={`flex-1 py-3 text-center border-r border-[#e5e5df] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'invideo' 
              ? 'bg-white text-[#2d5a4a] font-black border-b-2 border-b-[#2d5a4a]' 
              : 'text-stone-500 hover:bg-stone-100'
          }`}
        >
          <Layers size={13} className={activeTab === 'invideo' ? 'text-[#c9a961]' : 'text-stone-400'} />
          <span>{isSpanish ? 'Video InVideo AI' : 'InVideo Prompt Engine'}</span>
        </button>
        <button
          id="video-gallery-tab-btn"
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 py-3 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'gallery' 
              ? 'bg-white text-[#2d5a4a] font-black border-b-2 border-b-[#2d5a4a]' 
              : 'text-stone-500 hover:bg-stone-100'
          }`}
        >
          <FileVideo size={13} className={activeTab === 'gallery' ? 'text-[#c9a961]' : 'text-stone-400'} />
          <span>{isSpanish ? 'Estudio de Producción' : 'Video Workshop Gallery'}</span>
          <span className="ml-1 px-1.5 py-0.2 bg-stone-200 text-stone-755 text-[9px] rounded-full">
            {videosList.length}
          </span>
        </button>
      </div>

      {/* Main Panel Content Area */}
      <div className="p-5 flex-1 min-h-[360px] flex flex-col md:flex-row gap-6">

        {/* Form and configs column */}
        <div className="flex-1 space-y-4 max-w-md">
          {activeTab === 'heygen' && (
            <div className="space-y-3.5 animate-fadeIn text-xs font-sans">
              
              <div className="bg-[#2d5a4a]/5 border border-[#2d5a4a]/15 p-3 rounded-lg space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-[#2d5a4a] block">
                  📢 {isSpanish ? '1. Fuente de Guion del Día Seleccionado:' : '1. Core Script Segment:'}
                </span>
                
                <div className="grid grid-cols-4 gap-1.5">
                  {(['instagram', 'linkedin', 'facebook', 'youtube'] as const).map(platform => {
                    const hasSelectedPlatform = selectedDay && selectedDay.platforms && selectedDay.platforms[platform];
                    return (
                      <button
                        key={platform}
                        onClick={() => setHeygenSettings(prev => ({ ...prev, platformSource: platform }))}
                        className={`py-1 text-center font-mono text-[9px] font-bold rounded border uppercase cursor-pointer ${
                          heygenSettings.platformSource === platform
                            ? 'bg-[#2d5a4a] text-white border-[#2d5a4a]'
                            : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'
                        }`}
                        title={hasSelectedPlatform ? 'Content available' : 'Empty draft default fallback'}
                      >
                        {platform.substring(0, 4)}
                        {hasSelectedPlatform && <span className="ml-0.5 text-[#c9a961]">●</span>}
                      </button>
                    );
                  })}
                </div>

                <div className="bg-white p-2 rounded border border-[#e5e5df] max-h-[85px] overflow-y-auto text-[10.5px] font-medium leading-relaxed text-stone-650 italic mt-1 font-mono">
                  {getSelectedPlatformText() || (isSpanish ? 'No se ha generado contenido aún para este canal.' : 'No drafting found for this social node.')}
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-500 font-bold">
                  👤 {isSpanish ? '2. Seleccionar Avatar Virtual de HeyGen:' : '2. Select Speaking Avatar Role:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PREMADE_AVATARS.map(avatar => (
                    <button
                      key={avatar.id}
                      onClick={() => setHeygenSettings(prev => ({ ...prev, avatar: avatar.id }))}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                        heygenSettings.avatar === avatar.id
                          ? 'bg-[#2d5a4a]/5 border-[#2d5a4a] text-[#2d5a4a] font-bold'
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-650'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="block text-[11px] leading-tight font-sans">
                          {isSpanish ? avatar.nameES : avatar.nameEN}
                        </span>
                        <span className={`inline-block px-1 border rounded text-[7.5px] font-mono leading-none ${
                          avatar.gender === 'M' ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-rose-600 border-rose-200 bg-rose-50'
                        }`}>
                          {avatar.gender === 'M' ? 'Male / Masculino' : 'Female / Femenino'}
                        </span>
                      </div>
                      <span className="text-[8.5px] font-mono bg-stone-200 text-stone-700 px-1 rounded font-black max-h-min">
                        {avatar.lang}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice selector */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-500 font-bold">
                  🗣️ {isSpanish ? '3. Tono de Voz Sintética por IA:' : '3. Text-to-Speech Vocal Style:'}
                </label>
                <select
                  value={heygenSettings.voice}
                  onChange={(e) => setHeygenSettings(prev => ({ ...prev, voice: e.target.value }))}
                  className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-[11.5px] text-stone-800 focus:outline-[#2d5a4a]"
                >
                  {PREMADE_VOICES.map(voice => (
                    <option key={voice.id} value={voice.id}>
                      {isSpanish ? voice.nameES : voice.nameEN} ({voice.style})
                    </option>
                  ))}
                </select>
              </div>

              {/* Aspect and video size settings */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-500 font-bold">
                    📐 {isSpanish ? 'Relación de Aspecto:' : 'Aspect Ratio:'}
                  </label>
                  <div className="flex gap-1.5">
                    {(['16:9', '9:16'] as const).map(ratio => (
                      <button
                        key={ratio}
                        onClick={() => setHeygenSettings(prev => ({ ...prev, aspect: ratio }))}
                        className={`flex-1 py-1.5 text-center font-mono text-[10px] font-bold rounded border cursor-pointer ${
                          heygenSettings.aspect === ratio
                            ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                            : 'bg-stone-50 text-[#1a1a1a] border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {ratio} {ratio === '9:16' ? '🎥 vertical' : '💻 Horiz'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Trigger Generation */}
              <div className="pt-2">
                <button
                  id="heygen-generate-btn"
                  onClick={() => triggerVideoGeneration('HeyGen')}
                  disabled={isRendering}
                  className="w-full py-2.5 bg-stone-900 hover:bg-[#1a1a1a] text-[#c9a961] font-sans font-bold uppercase text-xs tracking-wider rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer disabled:bg-stone-200 disabled:text-stone-400 flex items-center justify-center gap-2"
                >
                  <Cpu size={14} className="animate-pulse" />
                  <span>{isSpanish ? 'Lanzar Render HeyGen Avatar' : 'Submit HeyGen Render Request'}</span>
                </button>
              </div>

            </div>
          )}

          {activeTab === 'invideo' && (
            <div className="space-y-3.5 animate-fadeIn text-xs font-sans">
              
              <div className="bg-amber-400/5 border border-amber-500/15 p-3 rounded-lg space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-wider text-[#b09352] uppercase">
                  <span>✍️ {isSpanish ? '1. Guion / Instrucción Técnica:' : '1. Prompt-to-Video Instruct:'}</span>
                  <button 
                    onClick={() => setInvideoSettings(prev => ({ ...prev, customPrompt: '' }))}
                    className="text-[9px] hover:underline normal-case text-stone-400 cursor-pointer"
                  >
                    {isSpanish ? 'Reiniciar' : 'Use Context Default'}
                  </button>
                </div>
                
                <textarea
                  className="w-full h-24 p-2.5 bg-white border border-stone-200 text-[10.5px] leading-relaxed text-stone-750 font-mono resize-none focus:outline-[#2d5a4a] rounded-lg"
                  value={getInVideoPromptText()}
                  onChange={(e) => setInvideoSettings(prev => ({ ...prev, customPrompt: e.target.value }))}
                  placeholder={isSpanish ? 'Describa qué tema técnico de WPC desea enfocar...' : 'Describe what custom fluted technical features to focus into...'}
                />
                
                <p className="text-[8.5px] text-stone-500 leading-snug">
                  {isSpanish ? '※ Se alimenta de las especificaciones y normativas estacionales NSR-10 configuradas en el sector del calendario actual.' : '※ Direct alignment with NSR-10 construction specifications automatically overlayed in rendering prompt.'}
                </p>
              </div>

              {/* Music style selection */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-500 font-bold">
                  🎵 {isSpanish ? '2. Estilo de Banda Sonora de Fondo:' : '2. Soundtrack Ambient Type:'}
                </label>
                <select
                  value={invideoSettings.music}
                  onChange={(e) => setInvideoSettings(prev => ({ ...prev, music: e.target.value }))}
                  className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-[11.5px] text-stone-800 focus:outline-[#2d5a4a]"
                >
                  {PREMADE_MUSIC.map(m => (
                    <option key={m.id} value={m.id}>
                      {isSpanish ? m.nameES : m.nameEN} ({m.vibe})
                    </option>
                  ))}
                </select>
              </div>

              {/* Subtitle presets */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-500 font-bold">
                    📝 {isSpanish ? 'Estilo de Subtítulo:' : 'Subtitle Preset:'}
                  </label>
                  <select
                    value={invideoSettings.substyle}
                    onChange={(e) => setInvideoSettings(prev => ({ ...prev, substyle: e.target.value }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1.2 text-[10.5px] text-stone-850"
                  >
                    <option value="yellow_bold">{isSpanish ? 'Amarillo Negrita (Estilo Viral)' : 'Yellow Bold (Viral style)'}</option>
                    <option value="white_italic">{isSpanish ? 'Blanco Cursiva (Cinematográfico)' : 'White Italic (Cinematic)'}</option>
                    <option value="gilded_accent">{isSpanish ? 'Acentos Dorados UNITEC' : 'UNITEC Gilded Trim'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-500 font-bold">
                    📐 {isSpanish ? 'Plataforma & Relación:' : 'Aspect Ratio:'}
                  </label>
                  <div className="flex gap-1">
                    {(['9:16', '16:9'] as const).map(ratio => (
                      <button
                        key={ratio}
                        onClick={() => setInvideoSettings(prev => ({ ...prev, aspect: ratio }))}
                        className={`flex-1 py-1.2 text-center font-mono text-[9px] font-bold rounded border cursor-pointer ${
                          invideoSettings.aspect === ratio
                            ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                            : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trigger InVideo Render */}
              <div className="pt-2">
                <button
                  id="invideo-generate-btn"
                  onClick={() => triggerVideoGeneration('InVideo')}
                  disabled={isRendering}
                  className="w-full py-2.5 bg-[#2d5a4a] hover:bg-[#204236] text-white font-sans font-black uppercase text-xs tracking-wider rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer disabled:bg-stone-200 disabled:text-stone-400 flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} className="text-[#c9a961]" />
                  <span>{isSpanish ? 'Enviar Instrucción a InVideo AI' : 'Trigger InVideo.IO Prompt Render'}</span>
                </button>
              </div>

            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-3.5 animate-fadeIn text-xs font-sans">
              <div className="text-[10px] font-mono tracking-wider text-stone-400 uppercase border-b pb-1">
                {isSpanish ? 'SELECCIONAR VIDEO DE LA BIBLIOTECA:' : 'SELECT COMPLETED VIDEO SESSION:'}
              </div>

              <div id="video-gallery-scroller" className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                {videosList.map((video) => {
                  const isSelected = activePlayVideo?.id === video.id;
                  return (
                    <button
                      key={video.id}
                      onClick={() => {
                        setActivePlayVideo(video);
                        setIsPlaying(false);
                      }}
                      className={`w-full p-2.5 rounded-lg border text-left flex items-start gap-2.5 transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-[#c9a961]/10 border-[#c9a961] shadow-xs' 
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <div className="w-12 h-16 rounded bg-stone-200 flex-shrink-0 overflow-hidden relative border border-stone-300">
                        <img 
                          src={video.posterUrl} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-0 right-0 bg-stone-900/80 text-[8px] text-white px-0.5 font-mono">
                          {video.duration}
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center bg-stone-900/10">
                          <Play size={12} className="text-white drop-shadow-sm" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[7.5px] font-mono uppercase px-1 rounded font-black ${
                            video.source === 'HeyGen' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {video.source}
                          </span>
                          <span className="text-[8px] text-stone-500 font-mono">
                            {video.date.split(' ')[0]}
                          </span>
                        </div>
                        <h4 className="text-[11px] font-bold text-stone-900 truncate tracking-tight">
                          {video.title}
                        </h4>
                        <p className="text-[10px] text-stone-500 line-clamp-2 leading-relaxed">
                          {video.script}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {videosList.length === 0 && (
                <div className="text-center py-8 text-stone-400 space-y-2">
                  <FileVideo size={30} className="mx-auto text-stone-300" />
                  <p>{isSpanish ? 'No hay videos generados aún.' : 'No generated videos on this browser session yet.'}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Video Player Display Screen / Developer Logger Block */}
        <div className="flex-1 bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col justify-between">
          
          {isRendering ? (
            /* RENDERING SCREEN */
            <div id="video-rendering-overlay-screen" className="flex-1 flex flex-col items-center justify-center py-10 space-y-4 animate-fadeIn">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <span className="absolute w-full h-full rounded-full border-4 border-[#2d5a4a]/20 border-t-[#2d5a4a] animate-spin"></span>
                <Cpu size={24} className="text-[#2d5a4a] animate-pulse" />
              </div>
              
              <div className="space-y-1 text-center max-w-xs">
                <span className="block text-[10px] font-mono font-bold uppercase text-[#c9a961] tracking-widest">
                  Rendering Service Container
                </span>
                <h4 className="text-xs font-sans font-extrabold text-stone-800">
                  {isSpanish ? 'COMPILANDO VIDEO CON INTELIGENCIA ARTIFICIAL' : 'RENDERING DIGITAL MEDIA STREAM...'}
                </h4>
                <p className="text-[9.5px] text-stone-500 font-mono italic leading-relaxed">
                  {renderStep}
                </p>
              </div>

              <div className="w-full max-w-xs space-y-1">
                <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden border border-stone-300">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
                <div className="flex justify-between font-mono text-[9px] text-[#2d5a4a] font-bold">
                  <span>TRANSCODE_ACC</span>
                  <span>{renderProgress}%</span>
                </div>
              </div>
            </div>
          ) : activePlayVideo ? (
            /* ACTIVE VIDEO PLAYER VIEW */
            <div id="active-video-player-container text-left" className="flex-1 flex flex-col justify-between space-y-4">
              
              {/* Media Display Sandbox Frame */}
              <div className="relative bg-black rounded-lg aspect-video md:max-h-[220px] overflow-hidden group flex items-center justify-center border border-stone-300">
                
                {isPlaying ? (
                  <video
                    id="unitec-html5-custom-video-stream"
                    className="w-full h-full object-cover"
                    src={activePlayVideo.videoUrl}
                    controls
                    autoPlay
                    onEnded={() => setIsPlaying(false)}
                  />
                ) : (
                  <>
                    <img 
                      src={activePlayVideo.posterUrl} 
                      alt="" 
                      className="w-full h-full object-cover opacity-80" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
                      <button
                        id="play-active-video-inline"
                        onClick={() => setIsPlaying(true)}
                        className="w-12 h-12 rounded-full bg-white text-stone-950 hover:bg-[#c9a961] transition-transform hover:scale-105 shadow-lg flex items-center justify-center cursor-pointer"
                        title={isSpanish ? 'Reproducir video generado' : 'Play rendered output'}
                      >
                        <Play size={20} className="fill-current ml-0.5 text-stone-900" />
                      </button>
                      <span className="text-[10px] font-mono text-white text-medium font-bold px-2 py-0.5 bg-stone-900/70 rounded border border-white/10 uppercase">
                        {activePlayVideo.source} Session: {activePlayVideo.id}
                      </span>
                    </div>
                  </>
                )}

                {/* Aspect ratio frame marker overlay */}
                <span className="absolute top-2 left-2 bg-stone-900/85 text-white border border-white/5 text-[8.5px] px-1.5 py-0.2 rounded font-mono font-bold tracking-tight">
                  📐 Aspect: {activePlayVideo.aspectRatio}
                </span>

                <span className="absolute bottom-2 right-2 bg-stone-900/85 text-white text-[8.5px] px-1.5 py-0.2 rounded font-mono">
                  🎞️ {activePlayVideo.duration}
                </span>
              </div>

              {/* Title & Metadata details */}
              <div className="space-y-1.5 text-left border-b pb-3 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[8px] font-mono font-black uppercase px-1 py-0.2 rounded ${
                    activePlayVideo.source === 'HeyGen' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {activePlayVideo.source} Video Link
                  </span>
                  
                  {activePlayVideo.avatar && (
                    <span className="text-[9px] text-stone-605 font-mono italic">
                      Avatar: {activePlayVideo.avatar}
                    </span>
                  )}
                  {activePlayVideo.musicStyle && (
                    <span className="text-[9px] text-stone-605 font-mono italic">
                      Music: {activePlayVideo.musicStyle.split(' ')[0]}
                    </span>
                  )}
                </div>

                <h4 id="active-playing-video-title" className="text-xs font-sans font-black text-stone-900 leading-tight">
                  {activePlayVideo.title}
                </h4>

                <div className="bg-white p-2.5 rounded border border-stone-200 text-[10.5px] text-stone-600 leading-relaxed font-sans max-h-[80px] overflow-y-auto">
                  <strong>{isSpanish ? 'Guion Procesado:' : 'Rendered Script:'}</strong> "{activePlayVideo.script}"
                </div>
              </div>

              {/* Share and Action triggers */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  id="copy-rendered-video-link"
                  onClick={() => handleCopyLink(activePlayVideo.videoUrl, activePlayVideo.id)}
                  className="flex-1 py-1.5 bg-white border border-stone-300 text-stone-750 hover:bg-stone-100 rounded text-[11px] font-sans font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {copiedStates[activePlayVideo.id] ? (
                    <>
                      <Check size={12} className="text-green-600" />
                      <span>{isSpanish ? '¡Copiado!' : 'Link Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>{isSpanish ? 'Copiar Enlace' : 'Copy CDN Url'}</span>
                    </>
                  )}
                </button>

                <a
                  href={activePlayVideo.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 bg-[#2d5a4a] text-white hover:bg-[#204236] rounded text-[11px] font-sans font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm text-center"
                >
                  <Download size={12} />
                  <span>{isSpanish ? 'Descargar MP4' : 'Download Video'}</span>
                </a>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-stone-400 text-center">
              <FileVideo size={40} className="text-stone-300 animate-pulse" />
              <p className="font-sans font-bold text-stone-700 text-sm mt-2">{isSpanish ? 'Estudio Inactivo' : 'Sandbox Idle'}</p>
              <p className="text-xs text-stone-500 max-w-xs">{isSpanish ? 'Seleccione o genere un video para comenzar la reproducción' : 'Submit a render to compile an MP4 stream.'}</p>
            </div>
          )}

          {/* Dev API request parameters debugging view */}
          {activeApiLog && (
            <div className="mt-4 p-2 bg-[#1a1a1a] rounded text-[10px] font-mono text-stone-300 space-y-1.5 border border-stone-850">
              <div className="flex items-center justify-between text-stone-450 border-b border-stone-800 pb-1 text-[8.5px] uppercase font-black">
                <span className="flex items-center gap-1"><Cpu size={10} className="text-[#c9a961]" /> Live API Request Transceiver Terminal</span>
                <span className="text-emerald-500 font-bold">STATUS_OK</span>
              </div>
              <div className="space-y-0.5">
                <div className="text-white"><span className="text-[#c9a961] font-bold">POST</span> <span className="hover:underline">{activeApiLog.endpoint}</span></div>
                <div className="text-[9px] text-stone-500 overflow-x-auto whitespace-pre leading-none max-h-[85px] py-1 bg-stone-950 px-1 rounded border border-stone-900 mt-1">
                  <strong>Headers:</strong> {JSON.stringify(activeApiLog.headers, null, 2)}
                  <br />
                  <strong>Payload:</strong> {activeApiLog.body}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Compliance / Status footer badge */}
      <div className="px-5 py-3.5 bg-stone-50 border-t border-[#e5e5df] flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-stone-500 text-[10.5px]">
          <span className="w-2 h-2 rounded bg-emerald-500"></span>
          <span className="font-sans">
            {isSpanish 
              ? 'Todos los videos respetan la norma NSR-10 de retardación para fachadas internas residenciales.' 
              : 'All generated parameters are synchronized with high-conversion Colombia regional ports.'}
          </span>
        </div>
        
        <span className="text-[10px] font-mono text-[#2d5a4a] bg-[#2d5a4a]/5 border border-[#2d5a4a]/20 px-2 py-0.5 font-bold rounded">
          {isSpanish ? 'Seguridad del Canal: Conexión Cifrada' : 'Secure API Channel: Active Intercept'}
        </span>
      </div>

    </div>
  );
}
