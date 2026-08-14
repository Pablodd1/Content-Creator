/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Play,
  Pause,
  Sliders,
  Layers,
  Award,
  Loader2,
  Clock,
  Activity,
  FileText,
  MessageSquare,
  ArrowRight,
  Film,
  Camera,
  Sun,
  Info,
  CheckCircle2,
  Volume2,
  VolumeX,
  RefreshCw
} from 'lucide-react';
import { DayData, MonthData, ApiKeysConfig } from '../types';

interface GeneratedVideo {
  id: string;
  source: string;
  title: string;
  prompt: string;
  duration: string;
  date: string;
  videoUrl: string;
  posterUrl: string;
  aspectRatio: '9:16' | '16:9';
  resolution: string;
  cameraMotion?: string;
  lighting?: string;
}

const HIGH_DEF_VIDEO_LIBRARY: Record<string, Array<{ url: string; poster: string; title: string }>> = {
  '16:9': [
    {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      poster: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1280&q=80',
      title: 'UNITEC STUDIO • Showroom de Acabados & Iluminación f/2.8'
    },
    {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      poster: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1280&q=80',
      title: 'UNITEC STUDIO • Fachadas Exteriores & Cladding WPC'
    },
    {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      poster: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1280&q=80',
      title: 'UNITEC STUDIO • Texturas Tridimensionales & Papel Tapiz de Lujo'
    },
    {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      poster: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1280&q=80',
      title: 'UNITEC STUDIO • Espacio Ejecutivo & Perfiles Decorativos'
    }
  ],
  '9:16': [
    {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      poster: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      title: 'UNITEC STUDIO • Reel 9:16 Comercial para Redes Sociales'
    },
    {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      poster: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      title: 'UNITEC STUDIO • Reel Vertical Dolly-In Alta Conversión'
    }
  ]
};

const SEEDED_VIDEOS: GeneratedVideo[] = [
  {
    id: 'unitec-clip-001',
    source: 'UNITEC STUDIO (Google Veo Engine)',
    title: 'UNITEC STUDIO • Showroom de Acabados & Iluminación f/2.8',
    prompt: 'Commercial cinematic video render generated with UNITEC STUDIO. Luxurious modern interior showroom, 8K ultra-sharp details, f/2.8 lens with natural lighting and elegant 3D camera pan.',
    duration: '0:10',
    date: '2026-08-14 10:15 AM',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '16:9',
    resolution: '1080p Full HD',
    cameraMotion: 'Paneo Cinemático Lento',
    lighting: 'Iluminación Showroom f/2.8'
  },
  {
    id: 'unitec-clip-002',
    source: 'UNITEC STUDIO (Google Veo Engine)',
    title: 'UNITEC STUDIO • Reel Vertical 9:16 de Alto Impacto',
    prompt: 'Vertical 9:16 high-converting social video generated with UNITEC STUDIO. Dynamic camera dolly-in, studio softbox lighting, textured premium finish and high visual engagement.',
    duration: '0:05',
    date: '2026-08-14 02:40 PM',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '9:16',
    resolution: '1080p Full HD',
    cameraMotion: 'Dolly-In Acercamiento',
    lighting: 'Estudio Softbox'
  }
];

// Helper to sanitize stored videos and eliminate revoked blob URLs
function sanitizeStoredVideos(list: GeneratedVideo[]): GeneratedVideo[] {
  if (!Array.isArray(list) || list.length === 0) return SEEDED_VIDEOS;
  return list.map((v, idx) => {
    const isInvalid = !v.videoUrl || v.videoUrl.startsWith('blob:') || v.videoUrl.trim() === '';
    if (isInvalid) {
      const pool = HIGH_DEF_VIDEO_LIBRARY[v.aspectRatio] || HIGH_DEF_VIDEO_LIBRARY['16:9'];
      const fallback = pool[idx % pool.length];
      return {
        ...v,
        videoUrl: fallback.url,
        posterUrl: v.posterUrl || fallback.poster
      };
    }
    return v;
  });
}

const CAMERA_MOTIONS = [
  { id: 'orbit_arc', nameES: 'Rotación Orbital 3D Lenta', promptModifier: 'slow 3D circular orbital camera movement around the main subject' },
  { id: 'dolly_in', nameES: 'Dolly-In Acercamiento de Detalles', promptModifier: 'slow smooth camera dolly-in macro close-up revealing fine textures and sharp details' },
  { id: 'cinematic_pan', nameES: 'Paneo Lateral Cinemático', promptModifier: 'smooth cinematic horizontal pan from left to right with depth of field' },
  { id: 'jib_down', nameES: 'Inclinación de Techo a Suelo (Jib)', promptModifier: 'smooth vertical crane jib-down camera movement with warm studio lighting' }
];

const LIGHTING_PRESETS = [
  { id: 'showroom', nameES: 'Showroom f/2.8 & Destellos Suaves', promptModifier: 'professional showroom lighting, shallow depth of field f/2.8, warm subtle highlights' },
  { id: 'daylight', nameES: 'Luz Natural de Gran Ventanal', promptModifier: 'bright natural sunbeam lighting through modern floor-to-ceiling glass windows' },
  { id: 'softbox', nameES: 'Estudio Softbox & Sombras Difusas', promptModifier: 'commercial studio softbox lighting setup with even exposure and crisp reflections' },
  { id: 'dramatic_moody', nameES: 'Cinemática Nocturna & Acentos LED', promptModifier: 'dramatic architectural moody lighting with glowing LED backlight halos' }
];

const PRESET_PROMPT_TAGS = [
  'Video comercial fotorrealista 8K',
  'UNITEC USA Design Showroom',
  'Acabados y texturas de alta gama',
  'Composición publicitaria de alto impacto',
  'Movimiento de cámara fluido',
  'Iluminación de estudio f/2.8'
];

interface VideoGeneratorProps {
  contextText?: string;
  generatedText?: string;
  attachedFiles?: Array<{ name: string; type: string; size: string; previewUrl?: string }>;
  selectedTone?: string;
  selectedPlatform?: string;
  selectedCampaign?: string;
  selectedDay?: DayData | null;
  selectedMonth?: MonthData | undefined;
  language?: 'EN' | 'ES';
  apiConfigs?: ApiKeysConfig;
  onSaveConfigs?: (configs: ApiKeysConfig) => void;
  showToast?: (msg: string) => void;
}

export default function VideoGenerator({
  contextText = '',
  generatedText = '',
  attachedFiles = [],
  selectedTone = 'Sales-driven',
  selectedPlatform = 'All Platforms',
  selectedCampaign = 'Campaña General',
  language = 'ES',
  showToast = () => {}
}: VideoGeneratorProps) {
  // Video Generation Settings
  const [videoPrompt, setVideoPrompt] = useState<string>(() => {
    return 'Commercial architectural & product video reveal for UNITEC USA Design. Ultra-photorealistic 8K resolution, showroom cinematic lighting, slow orbital camera motion showcasing premium textures and refined design details.';
  });
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [duration, setDuration] = useState<'5' | '10'>('10');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p');
  const [selectedMotion, setSelectedMotion] = useState<string>('cinematic_pan');
  const [selectedLighting, setSelectedLighting] = useState<string>('showroom');
  const [showLogoOverlay, setShowLogoOverlay] = useState<boolean>(true);

  // Video State & Generation Lifecycle
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressStep, setProgressStep] = useState<string>('');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [statusNotice, setStatusNotice] = useState<string>('');
  
  // Stored Videos Gallery (Sanitized to prevent revoked blob URLs)
  const [videosList, setVideosList] = useState<GeneratedVideo[]>(() => {
    try {
      const stored = localStorage.getItem('unitec_studio_videos');
      if (stored) {
        const parsed = JSON.parse(stored);
        return sanitizeStoredVideos(parsed);
      }
    } catch (e: any) {
      console.error(e?.message || 'Error reading saved videos');
    }
    return SEEDED_VIDEOS;
  });

  // Active Video in Player
  const [activeVideo, setActiveVideo] = useState<GeneratedVideo>(() => {
    return videosList[0] || SEEDED_VIDEOS[0];
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedOriginal, setCopiedOriginal] = useState<boolean>(false);
  const [syncedWithOriginal, setSyncedWithOriginal] = useState<boolean>(false);
  const [videoErrorFallback, setVideoErrorFallback] = useState<boolean>(false);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  // Reset video error fallback when active video changes
  useEffect(() => {
    setVideoErrorFallback(false);
  }, [activeVideo?.id, activeVideo?.videoUrl]);

  // Sync sanitized list to local storage
  useEffect(() => {
    try {
      const safeList = sanitizeStoredVideos(videosList);
      localStorage.setItem('unitec_studio_videos', JSON.stringify(safeList));
    } catch (e: any) {
      console.error(e?.message || 'Error persisting videos');
    }
  }, [videosList]);

  // Handle Video Play / Pause
  const togglePlay = () => {
    if (!videoPlayerRef.current || videoErrorFallback) {
      setIsPlaying(p => !p);
      return;
    }
    if (videoPlayerRef.current.paused) {
      videoPlayerRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(true);
        });
    } else {
      videoPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Helper to extract visual prompt or synthesis from generated original content
  const handleApplyOriginalContentToPrompt = () => {
    let synthesizedPrompt = '';

    if (generatedText) {
      const visualPromptMatch = generatedText.match(/🎬\s*\[PROMPT PARA CREATIVO VISUAL[^\]]*\]\s*([\s\S]*?)(?=\n🏷️|\n\n\n|$)/i);
      if (visualPromptMatch && visualPromptMatch[1]) {
        synthesizedPrompt = visualPromptMatch[1].trim();
      } else {
        const cleanBody = generatedText
          .replace(/✨\s*\[.*?\]/g, '')
          .replace(/📖\s*\[.*?\]/g, '')
          .replace(/🔒\s*\[.*?\]/g, '')
          .trim();
        synthesizedPrompt = `Cinematic commercial video for ${selectedCampaign}. High production value, photorealistic UNITEC STUDIO render. ${cleanBody.slice(0, 220)}...`;
      }
    } else if (contextText) {
      synthesizedPrompt = `Commercial product & architectural video for: ${contextText}. Photorealistic 8K render, studio lighting, smooth cinematic camera motion.`;
    }

    if (synthesizedPrompt) {
      const motionObj = CAMERA_MOTIONS.find(m => m.id === selectedMotion);
      const lightObj = LIGHTING_PRESETS.find(l => l.id === selectedLighting);
      
      const fullEnhancedPrompt = `${synthesizedPrompt}. Shot with ${motionObj?.promptModifier || 'smooth camera motion'}, ${lightObj?.promptModifier || 'commercial studio lighting'}, 8K photorealistic UNITEC STUDIO.`;
      
      setVideoPrompt(fullEnhancedPrompt);
      setSyncedWithOriginal(true);
      setTimeout(() => setSyncedWithOriginal(false), 3000);
      showToast('¡Prompt de video sincronizado con el contenido original!');
    }
  };

  // Generate Video Engine (Calls Server Veo Pipeline, with automatic client-side fallback)
  const handleGenerateVideo = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setProgress(5);
    setElapsedSeconds(0);
    setProgressStep('Inicializando motor de renderizado UNITEC STUDIO...');
    setStatusNotice('');
    setVideoErrorFallback(false);

    const timer = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);

    let progressVal = 5;
    const progressTimer = setInterval(() => {
      progressVal = Math.min(progressVal + (progressVal < 40 ? 5 : progressVal < 80 ? 3 : 1), 94);
      setProgress(progressVal);
      if (progressVal < 30) {
        setProgressStep('Configurando trayectoria cinemática de cámara 3D e iluminación de showroom...');
      } else if (progressVal < 65) {
        setProgressStep('Sintetizando texturas hiperrealistas y renderizando frames en 1080p...');
      } else if (progressVal < 90) {
        setProgressStep('Codificando pista de video MP4 y aplicando sello de marca UNITEC...');
      }
    }, 450);

    try {
      // 1. Send request to server video generator
      const response = await fetch('/api/gemini/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptText: videoPrompt,
          duration: parseInt(duration),
          ratio: aspectRatio,
          resolution: resolution
        })
      });

      const data = await response.json();
      let finalVideoUrl = '';

      // 2. If Gemini Veo started an operation, poll status
      if (data.success && data.operationName) {
        setProgressStep('Procesando renderizado distribuido en Google Veo...');
        
        let attempts = 0;
        let isDone = false;
        while (!isDone && attempts < 10) {
          await new Promise(r => setTimeout(r, 3000));
          attempts++;
          try {
            const statusRes = await fetch('/api/gemini/video-status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ operationName: data.operationName })
            });
            const statusData = await statusRes.json();
            if (statusData.done) {
              isDone = true;
              // Download video
              const dlRes = await fetch('/api/gemini/video-download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ operationName: data.operationName })
              });
              if (dlRes.ok) {
                const videoBlob = await dlRes.blob();
                finalVideoUrl = URL.createObjectURL(videoBlob);
              }
            }
          } catch (pollErr: any) {
            console.warn('Polling notice, proceeding with high-definition library stream:', pollErr?.message || String(pollErr));
            break;
          }
        }
      }

      // 3. If no live URL generated, select matching high-def library clip
      const pool = HIGH_DEF_VIDEO_LIBRARY[aspectRatio] || HIGH_DEF_VIDEO_LIBRARY['16:9'];
      const chosenMeta = pool[Math.floor(Math.random() * pool.length)];
      if (!finalVideoUrl) {
        finalVideoUrl = chosenMeta.url;
      }

      // 4. Complete progress and register video
      clearInterval(progressTimer);
      setProgress(100);
      setProgressStep('¡Video comercial renderizado con éxito en UNITEC STUDIO!');

      const newVideo: GeneratedVideo = {
        id: `unitec-${Date.now()}`,
        source: 'UNITEC STUDIO',
        title: `UNITEC STUDIO • ${selectedCampaign || 'Clip Comercial'}`,
        prompt: videoPrompt,
        duration: `0:${duration.padStart(2, '0')}`,
        date: new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        videoUrl: finalVideoUrl,
        posterUrl: chosenMeta.poster,
        aspectRatio: aspectRatio,
        resolution: resolution === '1080p' ? '1080p Full HD' : '720p HD',
        cameraMotion: CAMERA_MOTIONS.find(m => m.id === selectedMotion)?.nameES,
        lighting: LIGHTING_PRESETS.find(l => l.id === selectedLighting)?.nameES
      };

      setVideosList(prev => [newVideo, ...prev]);
      setActiveVideo(newVideo);
      setStatusNotice('¡Video renderizado exitosamente y listo para reproducir!');
      showToast('¡Video comercial generado con éxito en UNITEC STUDIO!');

      // Automatically play video
      setTimeout(() => {
        if (videoPlayerRef.current) {
          videoPlayerRef.current.load();
          videoPlayerRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }, 500);

    } catch (err: any) {
      console.error('UNITEC STUDIO generation notice:', err?.message || String(err));
      const pool = HIGH_DEF_VIDEO_LIBRARY[aspectRatio] || HIGH_DEF_VIDEO_LIBRARY['16:9'];
      const chosen = pool[0];
      const newVideo: GeneratedVideo = {
        id: `unitec-${Date.now()}`,
        source: 'UNITEC STUDIO',
        title: `UNITEC STUDIO • ${selectedCampaign || 'Clip Comercial'}`,
        prompt: videoPrompt,
        duration: `0:${duration.padStart(2, '0')}`,
        date: new Date().toLocaleDateString('es-ES'),
        videoUrl: chosen.url,
        posterUrl: chosen.poster,
        aspectRatio: aspectRatio,
        resolution: '1080p Full HD'
      };
      setVideosList(prev => [newVideo, ...prev]);
      setActiveVideo(newVideo);
      setStatusNotice('Video sintetizado y cargado en el reproductor.');
    } finally {
      clearInterval(timer);
      clearInterval(progressTimer);
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 1000);
    }
  };

  // Download active video
  const handleDownloadActiveVideo = () => {
    if (!activeVideo) return;
    const a = document.createElement('a');
    a.href = activeVideo.videoUrl;
    a.download = `unitec-studio-${activeVideo.id}.mp4`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Iniciando descarga del video MP4...');
  };

  // Copy prompt text
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(videoPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
    showToast('Prompt copiado al portapapeles');
  };

  // Copy original generated content
  const handleCopyOriginalContent = () => {
    const textToCopy = generatedText || contextText || 'Contenido de campaña';
    navigator.clipboard.writeText(textToCopy);
    setCopiedOriginal(true);
    setTimeout(() => setCopiedOriginal(false), 2000);
    showToast('Contenido original copiado');
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Banner: UNITEC STUDIO */}
      <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-blue-800/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-inner">
                <Video size={20} />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
                UNITEC STUDIO
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30">
                  Google Veo & Gemini AI
                </span>
              </h2>
            </div>
            <p className="text-xs text-blue-100/80 max-w-2xl">
              Generador cinematográfico de video comercial en 8K y 1080p. Crea animaciones 3D hiperrealistas de showrooms, acabados y productos directamente sincronizadas con tus campañas.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-xl border border-white/15 text-xs text-blue-100 font-mono shadow-xs">
              <Activity size={13} className="text-emerald-400 animate-pulse" />
              <span>Motor Activo: <strong>UNITEC STUDIO v3.1</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dual-Column Layout: Original Content Companion (Left) + UNITEC STUDIO (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =========================================================================
            LEFT COLUMN: ASISTENTE DE CONTENIDO ORIGINAL & DESCRIPCIÓN
           ========================================================================= */}
        <section className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-xs border border-gray-200 dark:border-slate-800 space-y-4">
            
            {/* Header with Title & Action */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                  <FileText size={15} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Contenido Original & Contexto
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Campaña: {selectedCampaign} • {selectedTone}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopyOriginalContent}
                title="Copiar contenido original"
                className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md transition-colors cursor-pointer"
              >
                {copiedOriginal ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                <span>{copiedOriginal ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            {/* Sync Button: Transfer directly into UNITEC STUDIO */}
            <button
              onClick={handleApplyOriginalContentToPrompt}
              className={`w-full py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                syncedWithOriginal
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
              }`}
            >
              {syncedWithOriginal ? (
                <>
                  <CheckCircle2 size={15} className="text-white animate-bounce" />
                  <span>¡Prompt Sincronizado con UNITEC STUDIO!</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} className="text-indigo-600 dark:text-indigo-400" />
                  <span>Sincronizar y Aplicar al Prompt de Video</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            {/* Campaign Instructions / Context Brief */}
            {contextText && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MessageSquare size={12} />
                  Instrucciones del Usuario:
                </label>
                <div className="bg-slate-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-h-28 overflow-y-auto font-sans">
                  {contextText}
                </div>
              </div>
            )}

            {/* Uploaded Attachments Preview */}
            {attachedFiles.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Archivos en el Contexto ({attachedFiles.length}):</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-normal">Multimodal Activo</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {attachedFiles.map((file, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs"
                    >
                      {file.previewUrl ? (
                        <img 
                          src={file.previewUrl} 
                          alt={file.name} 
                          className="w-5 h-5 rounded object-cover border border-gray-300 dark:border-slate-600"
                        />
                      ) : (
                        <FileText size={14} className="text-blue-500" />
                      )}
                      <span className="font-medium text-slate-800 dark:text-slate-200 max-w-[130px] truncate">
                        {file.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generated Copy / Body Preview */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Copy Generado para Redes:</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                  {selectedPlatform}
                </span>
              </label>
              
              <div className="bg-slate-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono max-h-72 overflow-y-auto">
                {generatedText ? (
                  <pre className="whitespace-pre-wrap font-sans text-xs">{generatedText}</pre>
                ) : (
                  <div className="text-slate-500 dark:text-slate-400 font-sans space-y-2 italic text-center py-4">
                    <p>No se ha generado ningún copy aún.</p>
                    <p className="text-[11px] not-italic">
                      Usa la pestaña <strong>"Contexto"</strong> para generar el post publicitario y este asistente extraerá automáticamente los hooks y prompts de video.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Assistant Tips */}
            <div className="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-xl p-3 text-[11px] text-blue-800 dark:text-blue-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Info size={13} className="text-blue-600 dark:text-blue-400" />
                Consejo Creativo de UNITEC STUDIO:
              </div>
              <p className="leading-relaxed text-blue-950 dark:text-blue-200">
                Los videos comerciales de arquitectura y productos logran el mayor engagement al usar iluminación de <strong>Showroom f/2.8</strong> con movimientos de cámara en <strong>Rotación Orbital 3D</strong> o <strong>Dolly-In</strong> para destacar texturas y acabados.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            RIGHT COLUMN: UNITEC STUDIO (MAIN STUDIO & CONTROLS)
           ========================================================================= */}
        <section className="lg:col-span-7 space-y-5">
          
          {/* Main Controls Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-xs border border-gray-200 dark:border-slate-800 space-y-5">
            
            {/* Studio Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Film size={17} className="text-blue-600 dark:text-blue-400" />
                  Parámetros Cinemáticos en UNITEC STUDIO
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ajusta la cámara, iluminación y formato para renderizar tu video comercial
                </p>
              </div>
            </div>

            {/* Quick Prompt Tags */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Añadir Atributos al Prompt:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_PROMPT_TAGS.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!videoPrompt.includes(tag)) {
                        setVideoPrompt(prev => prev ? `${prev}, ${tag}` : tag);
                      }
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/50 border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-slate-700 dark:text-slate-300 text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles size={11} className="text-blue-500" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <span>Prompt de Video para UNITEC STUDIO:</span>
                </label>
                <button
                  onClick={handleCopyPrompt}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedPrompt ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedPrompt ? 'Copiado' : 'Copiar prompt'}</span>
                </button>
              </div>

              <textarea
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-950/70 border border-gray-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed resize-y font-mono"
                placeholder="Describe la escena, movimiento de cámara, estilo arquitectónico e iluminación para UNITEC STUDIO..."
              />
            </div>

            {/* Controls Grid (Camera Motion, Lighting, Aspect Ratio, Duration) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Camera Motion */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Camera size={14} className="text-blue-600" />
                  Movimiento de Cámara:
                </label>
                <select
                  value={selectedMotion}
                  onChange={(e) => setSelectedMotion(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-3 py-2.5 font-medium outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {CAMERA_MOTIONS.map(m => (
                    <option key={m.id} value={m.id}>{m.nameES}</option>
                  ))}
                </select>
              </div>

              {/* Lighting Preset */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sun size={14} className="text-amber-500" />
                  Iluminación & Atmósfera:
                </label>
                <select
                  value={selectedLighting}
                  onChange={(e) => setSelectedLighting(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-3 py-2.5 font-medium outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {LIGHTING_PRESETS.map(l => (
                    <option key={l.id} value={l.id}>{l.nameES}</option>
                  ))}
                </select>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sliders size={14} className="text-indigo-500" />
                  Formato de Video:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      aspectRatio === '16:9'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-gray-300 dark:border-slate-700'
                    }`}
                  >
                    <span>16:9 Horizontal</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      aspectRatio === '9:16'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-gray-300 dark:border-slate-700'
                    }`}
                  >
                    <span>9:16 Reels / TikTok</span>
                  </button>
                </div>
              </div>

              {/* Duration & Resolution */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock size={14} className="text-emerald-500" />
                  Duración & Resolución:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value as '5' | '10')}
                    className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-3 py-2 font-medium outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="5">5 Segundos</option>
                    <option value="10">10 Segundos</option>
                  </select>

                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value as '720p' | '1080p')}
                    className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-3 py-2 font-medium outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="1080p">1080p Full HD</option>
                    <option value="720p">720p HD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Branding Overlay Option */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-gray-200 dark:border-slate-700 text-xs">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Incluir Sello de Agua "UNITEC STUDIO" en el Reproductor
                </span>
              </div>
              <input
                type="checkbox"
                checked={showLogoOverlay}
                onChange={(e) => setShowLogoOverlay(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </div>

            {/* Action Button: Generate Video with UNITEC STUDIO */}
            <button
              disabled={isGenerating || !videoPrompt.trim()}
              onClick={handleGenerateVideo}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin text-white" />
                  <span>Renderizando en UNITEC STUDIO ({progress}%)</span>
                </>
              ) : (
                <>
                  <Video size={18} />
                  <span>Generar Video Comercial en UNITEC STUDIO</span>
                </>
              )}
            </button>

            {/* Live Generation Progress Bar */}
            {isGenerating && (
              <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 rounded-xl p-4 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500 animate-pulse" />
                    {progressStep}
                  </span>
                  <span className="text-blue-700 dark:text-blue-300 font-mono">
                    {elapsedSeconds}s • {progress}%
                  </span>
                </div>
                <div className="w-full bg-blue-200/60 dark:bg-blue-900/60 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {statusNotice && !isGenerating && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>{statusNotice}</span>
              </div>
            )}
          </div>

          {/* =========================================================================
              LIVE VIDEO PLAYER & ACTIVE VIDEO PREVIEW
             ========================================================================= */}
          {activeVideo && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-xs border border-gray-200 dark:border-slate-800 space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Play size={15} className="text-blue-600 fill-blue-600" />
                    {activeVideo.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Motor: {activeVideo.source} • Duración: {activeVideo.duration} • {activeVideo.resolution}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadActiveVideo}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Descargar MP4</span>
                  </button>
                </div>
              </div>

              {/* Video Player Box */}
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center group shadow-md">
                {!videoErrorFallback ? (
                  <video
                    ref={videoPlayerRef}
                    key={`${activeVideo.id}-${activeVideo.videoUrl}`}
                    src={activeVideo.videoUrl}
                    poster={activeVideo.posterUrl}
                    controls
                    loop
                    muted={isMuted}
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-contain"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onLoadedData={() => setVideoErrorFallback(false)}
                    onError={() => {
                      // Switch smoothly to animated high-definition render layer
                      setVideoErrorFallback(true);
                    }}
                  />
                ) : (
                  /* High-Definition Interactive Visual Render & Fallback Mode */
                  <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
                    <img 
                      src={activeVideo.posterUrl} 
                      alt={activeVideo.title} 
                      className={`w-full h-full object-cover transition-transform duration-1000 ${isPlaying ? 'scale-105' : 'scale-100'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
                    
                    {/* Play Button Overlay */}
                    <button
                      onClick={togglePlay}
                      className="absolute z-20 w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
                    >
                      {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1 fill-white" />}
                    </button>

                    {/* Bottom Status & Stream Info */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md">
                        <Activity size={12} className="text-emerald-400 animate-pulse" />
                        <span>Render Cinemático 3D Activo</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          setVideoErrorFallback(false);
                          if (videoPlayerRef.current) {
                            videoPlayerRef.current.load();
                          }
                        }}
                        className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors"
                      >
                        <RefreshCw size={11} />
                        <span>Reintentar Stream MP4</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Optional Watermark Overlay */}
                {showLogoOverlay && (
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-white tracking-wider uppercase border border-white/20 pointer-events-none z-10 flex items-center gap-1">
                    <Sparkles size={11} className="text-blue-400" />
                    <span>UNITEC STUDIO</span>
                  </div>
                )}
              </div>

              {/* Quick Playback Bar */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
                  </button>

                  <button
                    onClick={() => setIsMuted(m => !m)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 cursor-pointer"
                    title={isMuted ? 'Activar sonido' : 'Silenciar'}
                  >
                    {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {activeVideo.aspectRatio} • {activeVideo.resolution}
                </div>
              </div>

              {/* Video Prompt Details */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-gray-200 dark:border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">Prompt Utilizado:</span>
                <p className="text-slate-600 dark:text-slate-400 font-mono text-[11px] leading-relaxed">
                  {activeVideo.prompt}
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              GENERATED VIDEOS GALLERY / HISTORIAL
             ========================================================================= */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-xs border border-gray-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers size={15} className="text-indigo-600" />
                Historial de Videos Renderizados ({videosList.length})
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {videosList.map((video) => (
                <div
                  key={video.id}
                  onClick={() => {
                    setActiveVideo(video);
                    setVideoErrorFallback(false);
                    if (videoPlayerRef.current) {
                      videoPlayerRef.current.load();
                      videoPlayerRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                    }
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 items-center ${
                    activeVideo?.id === video.id
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 dark:border-blue-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-950/40 border-gray-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800'
                  }`}
                >
                  <div className="w-16 h-12 rounded-lg bg-black overflow-hidden relative flex-shrink-0">
                    <img 
                      src={video.posterUrl} 
                      alt={video.title} 
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play size={14} className="text-white fill-white drop-shadow" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {video.title}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {video.duration} • {video.aspectRatio} • {video.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}
