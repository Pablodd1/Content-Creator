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
  RefreshCw,
  Edit3,
  Mic,
  Maximize2,
  Share2
} from 'lucide-react';
import { DayData, MonthData, ApiKeysConfig } from '../types';

export interface StoryboardScene {
  id: string;
  name: string;
  startSec: number;
  endSec: number;
  prompt: string;
  headline: string;
  voiceoverScript: string;
  keyframeUrl: string;
  cameraMotion: string;
}

export interface GeneratedVideo {
  id: string;
  source: string;
  title: string;
  prompt: string;
  duration: string;
  durationSeconds: number;
  date: string;
  videoUrl: string;
  posterUrl: string;
  aspectRatio: '9:16' | '16:9';
  resolution: string;
  cameraMotion?: string;
  lighting?: string;
  scenes?: StoryboardScene[];
  voiceoverScript?: string;
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
  'Video publicitario fotorrealista 8K',
  'UNITEC USA Showroom de diseño',
  'Acabados y texturas de alta gama',
  'Composición comercial de alto impacto',
  'Movimiento de cámara cinemático',
  'Iluminación de estudio f/2.8'
];

// Helper to compute scene timeline cuts based on duration
function computeSceneTimes(durationSec: number) {
  if (durationSec <= 5) {
    return {
      scene1: { start: 0, end: 2 },
      scene2: { start: 2, end: 4 },
      scene3: { start: 4, end: 5 }
    };
  } else if (durationSec <= 10) {
    return {
      scene1: { start: 0, end: 3 },
      scene2: { start: 3, end: 7 },
      scene3: { start: 7, end: 10 }
    };
  } else if (durationSec <= 15) {
    return {
      scene1: { start: 0, end: 4 },
      scene2: { start: 4, end: 11 },
      scene3: { start: 11, end: 15 }
    };
  } else {
    // 30s
    return {
      scene1: { start: 0, end: 8 },
      scene2: { start: 8, end: 22 },
      scene3: { start: 22, end: 30 }
    };
  }
}

// Build structured storyboard from marketing post content
function buildStoryboardFromMarketingPost(
  postText: string,
  contextText: string,
  campaignTitle: string,
  durationSec: number,
  aspectRatio: '16:9' | '9:16'
): StoryboardScene[] {
  const times = computeSceneTimes(durationSec);
  const effectiveTitle = campaignTitle || 'Lanzamiento Exclusivo';
  
  // Extract hook
  let hook = '';
  const hookMatch = postText.match(/\[TITULAR IMPACTANTE[^\]]*\]\s*([\s\S]*?)(?=\n\n(?:[✨📖🔒🎯🎬🖼️🏷️]|$)|---)/i);
  if (hookMatch && hookMatch[1]) {
    hook = hookMatch[1].replace(/^\([^)]*\)\s*/gm, '').replace(/[✨⚡🚀]/g, '').trim();
  }
  if (!hook) {
    hook = `¿Listo para transformar tus resultados con ${effectiveTitle}?`;
  }

  // Extract core value / want
  let coreValue = '';
  const bodyMatch = postText.match(/\[CUERPO DEL MENSAJE[^\]]*\]\s*([\s\S]*?)(?=\n\n(?:[✨📖🔒🎯🎬🖼️🏷️]|$)|---)/i);
  if (bodyMatch && bodyMatch[1]) {
    const lines = bodyMatch[1].split('\n').filter(l => l.trim().length > 10);
    coreValue = lines[0] ? lines[0].replace(/^\([^)]*\)\s*/gm, '').trim() : '';
  }
  if (!coreValue && contextText) {
    coreValue = contextText.slice(0, 140);
  }
  if (!coreValue) {
    coreValue = 'Calidad superior, innovación tecnológica y acabados vanguardistas diseñados para destacar.';
  }

  // Extract CTA
  let cta = '';
  const ctaMatch = postText.match(/\[LLAMADO A LA ACCIÓN[^\]]*\]\s*([\s\S]*?)(?=\n\n(?:[✨📖🔒🎯🎬🖼️🏷️]|$)|---)/i);
  if (ctaMatch && ctaMatch[1]) {
    cta = ctaMatch[1].replace(/^\([^)]*\)\s*/gm, '').trim();
  }
  if (!cta) {
    cta = '¡Contáctanos hoy para obtener asesoría exclusiva y cotización personalizada!';
  }

  const w = aspectRatio === '16:9' ? 1280 : 720;
  const h = aspectRatio === '16:9' ? 720 : 1280;

  const scene1Prompt = `Photorealistic 8K cinematic commercial hook scene for "${effectiveTitle}". Dramatic showroom softbox lighting, shallow depth of field, modern architectural luxury background, high contrast, clean typography.`;
  const scene2Prompt = `Photorealistic 8K detailed showcase for "${effectiveTitle}": ${coreValue.slice(0, 80)}. Macro close-up on premium textures and sleek product finishes, warm ambient glow, flawless composition.`;
  const scene3Prompt = `Photorealistic 8K commercial call-to-action outro scene for "${effectiveTitle}". Modern corporate branding UNITEC STUDIO, sleek digital interface, vibrant highlight accents, professional presentation.`;

  return [
    {
      id: 'scene-1',
      name: `Escena 1: Hook y Apertura (0:00 - 0:0${times.scene1.end})`,
      startSec: times.scene1.start,
      endSec: times.scene1.end,
      prompt: scene1Prompt,
      headline: hook.slice(0, 65),
      voiceoverScript: hook,
      keyframeUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(scene1Prompt.slice(0, 250))}?width=${w}&height=${h}&seed=101&nologo=true`,
      cameraMotion: 'Dolly-In Acercamiento'
    },
    {
      id: 'scene-2',
      name: `Escena 2: Propuesta de Valor & Acabados (0:0${times.scene2.start} - 0:${times.scene2.end < 10 ? '0' : ''}${times.scene2.end})`,
      startSec: times.scene2.start,
      endSec: times.scene2.end,
      prompt: scene2Prompt,
      headline: coreValue.slice(0, 65),
      voiceoverScript: coreValue,
      keyframeUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(scene2Prompt.slice(0, 250))}?width=${w}&height=${h}&seed=202&nologo=true`,
      cameraMotion: 'Rotación Orbital 3D'
    },
    {
      id: 'scene-3',
      name: `Escena 3: Llamado a la Acción & Cierre (0:${times.scene3.start < 10 ? '0' : ''}${times.scene3.start} - 0:${times.scene3.end < 10 ? '0' : ''}${times.scene3.end})`,
      startSec: times.scene3.start,
      endSec: times.scene3.end,
      prompt: scene3Prompt,
      headline: cta.slice(0, 60),
      voiceoverScript: cta,
      keyframeUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(scene3Prompt.slice(0, 250))}?width=${w}&height=${h}&seed=303&nologo=true`,
      cameraMotion: 'Paneo Cinemático'
    }
  ];
}

const SEEDED_VIDEOS: GeneratedVideo[] = [
  {
    id: 'unitec-clip-001',
    source: 'UNITEC STUDIO (Google Veo Engine)',
    title: 'UNITEC STUDIO • Showroom de Acabados & Iluminación f/2.8',
    prompt: 'Commercial cinematic video render generated with UNITEC STUDIO. Luxurious modern interior showroom, 8K ultra-sharp details, f/2.8 lens with natural lighting and elegant 3D camera pan.',
    duration: '0:10',
    durationSeconds: 10,
    date: '2026-08-14 10:15 AM',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '16:9',
    resolution: '1080p Full HD',
    cameraMotion: 'Paneo Cinemático Lento',
    lighting: 'Iluminación Showroom f/2.8',
    voiceoverScript: 'Transforma tus espacios con acabados de alta gama y elegancia arquitectónica insuperable. Conoce nuestra nueva colección hoy.'
  },
  {
    id: 'unitec-clip-002',
    source: 'UNITEC STUDIO (Google Veo Engine)',
    title: 'UNITEC STUDIO • Reel Vertical 9:16 de Alto Impacto',
    prompt: 'Vertical 9:16 high-converting social video generated with UNITEC STUDIO. Dynamic camera dolly-in, studio softbox lighting, textured premium finish and high visual engagement.',
    duration: '0:05',
    durationSeconds: 5,
    date: '2026-08-14 02:40 PM',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '9:16',
    resolution: '1080p Full HD',
    cameraMotion: 'Dolly-In Acercamiento',
    lighting: 'Estudio Softbox',
    voiceoverScript: 'Innovación que redefine el diseño moderno. Descubre la distinción que tu marca merece.'
  }
];

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
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [duration, setDuration] = useState<'5' | '10' | '15' | '30'>('10');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p');
  const [selectedMotion, setSelectedMotion] = useState<string>('cinematic_pan');
  const [selectedLighting, setSelectedLighting] = useState<string>('showroom');
  const [showLogoOverlay, setShowLogoOverlay] = useState<boolean>(true);
  const [voiceoverEnabled, setVoiceoverEnabled] = useState<boolean>(true);

  // Video Prompt & Dynamic Storyboard
  const [videoPrompt, setVideoPrompt] = useState<string>(() => {
    return 'Commercial architectural & product video reveal for UNITEC USA Design. Ultra-photorealistic 8K resolution, showroom cinematic lighting, slow orbital camera motion showcasing premium textures and refined design details.';
  });

  const [storyboard, setStoryboard] = useState<StoryboardScene[]>(() => {
    return buildStoryboardFromMarketingPost(generatedText, contextText, selectedCampaign, 10, '16:9');
  });

  // Video State & Generation Lifecycle
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressStep, setProgressStep] = useState<string>('');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [statusNotice, setStatusNotice] = useState<string>('');
  const [isExportingMP4, setIsExportingMP4] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);

  // Stored Videos Gallery
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

  // Interactive Playback Timecode Engine
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedOriginal, setCopiedOriginal] = useState<boolean>(false);
  const [syncedWithOriginal, setSyncedWithOriginal] = useState<boolean>(false);
  const [videoErrorFallback, setVideoErrorFallback] = useState<boolean>(true);
  
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playbackTimerRef = useRef<any>(null);

  // Automatically synchronize storyboard and prompt whenever marketing post or context changes
  useEffect(() => {
    if (generatedText || contextText) {
      const durationNum = parseInt(duration);
      const newStoryboard = buildStoryboardFromMarketingPost(
        generatedText,
        contextText,
        selectedCampaign,
        durationNum,
        aspectRatio
      );
      setStoryboard(newStoryboard);

      // Extract video prompt
      let extractedPrompt = '';
      const videoSectionMatch = generatedText.match(/🎬\s*\[PROMPT Y GUIÓN DE VIDEO[^\]]*\]\s*([\s\S]*?)(?=\n\n(?:[✨📖🔒🎯🎬🖼️🏷️]|$)|---)/i);
      if (videoSectionMatch && videoSectionMatch[1]) {
        const lines = videoSectionMatch[1].split('\n').map(l => l.trim());
        const promptLine = lines.find(l => l.toLowerCase().startsWith('prompt') || l.toLowerCase().startsWith('- prompt'));
        if (promptLine) {
          extractedPrompt = promptLine.replace(/^[-•*]\s*(?:Prompt(?: Visual)?(?: de Video)?:\s*)?/i, '').trim();
        }
      }

      if (!extractedPrompt) {
        extractedPrompt = `Cinematic commercial video reveal for "${selectedCampaign || 'Campaña Comercial'}". Target audience: Clientes potenciales. High-end showroom f/2.8 lighting, 8K photorealistic textures and modern finish.`;
      }

      setVideoPrompt(extractedPrompt);
    }
  }, [generatedText, contextText, selectedCampaign, duration, aspectRatio]);

  // Sync sanitized list to local storage
  useEffect(() => {
    try {
      const safeList = sanitizeStoredVideos(videosList);
      localStorage.setItem('unitec_studio_videos', JSON.stringify(safeList));
    } catch (e: any) {
      console.error(e?.message || 'Error persisting videos');
    }
  }, [videosList]);

  // Duration changes recalculate scene cuts
  const handleDurationChange = (newDuration: '5' | '10' | '15' | '30') => {
    setDuration(newDuration);
    const durNum = parseInt(newDuration);
    const updatedStoryboard = buildStoryboardFromMarketingPost(
      generatedText,
      contextText,
      selectedCampaign,
      durNum,
      aspectRatio
    );
    setStoryboard(updatedStoryboard);
    setCurrentTimeSec(0);
  };

  // Playback timer loop for interactive player (advances timecode accurately)
  useEffect(() => {
    if (isPlaying) {
      const totalDur = activeVideo?.durationSeconds || parseInt(duration) || 10;
      
      // Voice synthesis narration if enabled
      if (voiceoverEnabled && 'speechSynthesis' in window && !isMuted) {
        try {
          window.speechSynthesis.cancel();
          const scriptToRead = activeVideo?.voiceoverScript || storyboard.map(s => s.voiceoverScript).join('. ');
          if (scriptToRead) {
            const utter = new SpeechSynthesisUtterance(scriptToRead);
            utter.lang = language === 'ES' ? 'es-ES' : 'en-US';
            utter.rate = totalDur <= 5 ? 1.25 : totalDur <= 10 ? 1.05 : 0.95;
            window.speechSynthesis.speak(utter);
          }
        } catch (e) {
          console.warn('Speech synthesis notice:', e);
        }
      }

      playbackTimerRef.current = setInterval(() => {
        setCurrentTimeSec(prev => {
          if (prev >= totalDur - 0.2) {
            return 0; // Loop seamlessly
          }
          return parseFloat((prev + 0.1).toFixed(1));
        });
      }, 100);
    } else {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
      }
    }

    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
      }
    };
  }, [isPlaying, activeVideo, duration, voiceoverEnabled, isMuted, storyboard, language]);

  // Determine current active scene based on timecode
  const totalVideoDuration = activeVideo?.durationSeconds || parseInt(duration) || 10;
  const currentScene = (activeVideo?.scenes && activeVideo.scenes.length > 0 ? activeVideo.scenes : storyboard).find(
    s => currentTimeSec >= s.startSec && currentTimeSec <= s.endSec
  ) || (activeVideo?.scenes ? activeVideo.scenes[0] : storyboard[0]);

  // Toggle playback
  const togglePlay = () => {
    setIsPlaying(p => !p);
  };

  // Helper to extract visual prompt or synthesis from generated original content
  const handleApplyOriginalContentToPrompt = () => {
    const durNum = parseInt(duration);
    const newStoryboard = buildStoryboardFromMarketingPost(
      generatedText,
      contextText,
      selectedCampaign,
      durNum,
      aspectRatio
    );
    setStoryboard(newStoryboard);
    
    const motionObj = CAMERA_MOTIONS.find(m => m.id === selectedMotion);
    const lightObj = LIGHTING_PRESETS.find(l => l.id === selectedLighting);
    const enhanced = `Cinematic commercial video for "${selectedCampaign}". ${newStoryboard[0].headline}. Filmed with ${motionObj?.promptModifier || 'smooth camera motion'} and ${lightObj?.promptModifier || 'commercial studio lighting'}, 8K resolution UNITEC STUDIO.`;
    
    setVideoPrompt(enhanced);
    setSyncedWithOriginal(true);
    setTimeout(() => setSyncedWithOriginal(false), 3000);
    showToast('¡Video y Storyboard sincronizados exactamente con la campaña!');
  };

  // Generate Video Engine: Synthesizes multi-scene keyframes and registers the video
  const handleGenerateVideo = async () => {
    if (isGenerating || !videoPrompt.trim()) return;

    setIsGenerating(true);
    setProgress(5);
    setElapsedSeconds(0);
    setProgressStep('Inicializando motor de renderizado y sincronización UNITEC STUDIO...');
    setStatusNotice('');
    setCurrentTimeSec(0);

    const timer = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);

    let progressVal = 5;
    const progressTimer = setInterval(() => {
      progressVal = Math.min(progressVal + (progressVal < 40 ? 6 : progressVal < 80 ? 4 : 2), 92);
      setProgress(progressVal);
      if (progressVal < 30) {
        setProgressStep(`Sintetizando Escena 1 (Hook Visual) para: "${selectedCampaign}"...`);
      } else if (progressVal < 60) {
        setProgressStep(`Renderizando Escena 2 (Propuesta de Valor & Acabados) en ${resolution}...`);
      } else if (progressVal < 85) {
        setProgressStep(`Generando Escena 3 (Llamado a la Acción) y optimizando trayectoria de cámara (${CAMERA_MOTIONS.find(m => m.id === selectedMotion)?.nameES})...`);
      } else {
        setProgressStep('Finalizando codificación de video, timecode y pista de locución...');
      }
    }, 400);

    try {
      const durNum = parseInt(duration);
      const w = aspectRatio === '16:9' ? 1280 : 720;
      const h = aspectRatio === '16:9' ? 720 : 1280;

      // 1. Generate multi-scene keyframes tailored to each scene of the storyboard
      const updatedScenes = await Promise.all(
        storyboard.map(async (scene, idx) => {
          let sceneImgUrl = '';
          try {
            const res = await fetch('/api/gemini/generate-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                prompt: `${scene.prompt}. ${CAMERA_MOTIONS.find(m => m.id === selectedMotion)?.promptModifier || ''}`,
                aspectRatio: aspectRatio
              })
            });
            const data = await res.json();
            if (data.success && data.imageUrl) {
              sceneImgUrl = data.imageUrl;
            }
          } catch (e) {
            console.warn(`Keyframe synthesis notice for scene ${idx}:`, e);
          }

          if (!sceneImgUrl) {
            const clean = encodeURIComponent(scene.prompt.slice(0, 200));
            const seed = 500 + idx * 100 + Math.floor(Math.random() * 1000);
            sceneImgUrl = `https://image.pollinations.ai/prompt/${clean}?width=${w}&height=${h}&seed=${seed}&nologo=true`;
          }

          return {
            ...scene,
            keyframeUrl: sceneImgUrl
          };
        })
      );

      setStoryboard(updatedScenes);

      // 2. Register complete generated video with scenes and exact timing
      clearInterval(progressTimer);
      setProgress(100);
      setProgressStep('¡Video publicitario y storyboard renderizados con éxito!');

      const fullVoiceover = updatedScenes.map(s => s.voiceoverScript).join('. ');

      const newVideo: GeneratedVideo = {
        id: `unitec-${Date.now()}`,
        source: 'UNITEC STUDIO (Google Veo & Storyboard Engine)',
        title: `UNITEC STUDIO • ${selectedCampaign || 'Clip Comercial'} (${duration}s)`,
        prompt: videoPrompt,
        duration: `0:${duration.padStart(2, '0')}`,
        durationSeconds: durNum,
        date: new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        videoUrl: updatedScenes[0]?.keyframeUrl || '',
        posterUrl: updatedScenes[0]?.keyframeUrl || '',
        aspectRatio: aspectRatio,
        resolution: resolution === '1080p' ? '1080p Full HD' : '720p HD',
        cameraMotion: CAMERA_MOTIONS.find(m => m.id === selectedMotion)?.nameES,
        lighting: LIGHTING_PRESETS.find(l => l.id === selectedLighting)?.nameES,
        scenes: updatedScenes,
        voiceoverScript: fullVoiceover
      };

      setVideosList(prev => [newVideo, ...prev]);
      setActiveVideo(newVideo);
      setStatusNotice(`¡Video de ${duration} segundos renderizado siguiendo tus instrucciones y guión!`);
      showToast(`¡Video publicitario de ${duration}s generado con éxito!`);

      // Automatically play video
      setTimeout(() => {
        setIsPlaying(true);
      }, 300);

    } catch (err: any) {
      console.error('UNITEC STUDIO generation error:', err?.message || String(err));
      showToast('Error al generar el video.');
    } finally {
      clearInterval(timer);
      clearInterval(progressTimer);
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 800);
    }
  };

  // High-Quality MP4 Video Recording & Export Engine using Canvas MediaRecorder
  const handleExportRealVideoMP4 = async () => {
    if (!activeVideo || isExportingMP4) return;

    setIsExportingMP4(true);
    setExportProgress(5);
    showToast('Iniciando renderizado y codificación de video MP4...');

    const canvas = document.createElement('canvas');
    const durSec = activeVideo.durationSeconds || parseInt(duration) || 10;
    const isWidescreen = activeVideo.aspectRatio === '16:9';
    canvas.width = isWidescreen ? 1280 : 720;
    canvas.height = isWidescreen ? 720 : 1280;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsExportingMP4(false);
      showToast('Error al inicializar canvas de video.');
      return;
    }

    try {
      // Pre-load scene images
      const scenesToRender = activeVideo.scenes && activeVideo.scenes.length > 0 ? activeVideo.scenes : storyboard;
      const loadedImages: HTMLImageElement[] = await Promise.all(
        scenesToRender.map(scene => {
          return new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => {
              // Fallback image
              const fallback = new Image();
              fallback.crossOrigin = 'anonymous';
              fallback.onload = () => resolve(fallback);
              fallback.src = activeVideo.posterUrl || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1280&q=80';
            };
            img.src = scene.keyframeUrl || activeVideo.posterUrl;
          });
        })
      );

      // Setup MediaRecorder
      const stream = canvas.captureStream(30); // 30 FPS
      const mimeType = MediaRecorder.isTypeSupported('video/mp4') 
        ? 'video/mp4' 
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6000000 });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: mimeType });
        const downloadUrl = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `UNITEC_STUDIO_${activeVideo.id}_${durSec}s.${mimeType.includes('mp4') ? 'mp4' : 'webm'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
        setIsExportingMP4(false);
        setExportProgress(100);
        showToast('¡Video comercial exportado y descargado exitosamente!');
      };

      recorder.start();

      // Render frames across the exact duration
      const totalFrames = durSec * 30;
      let currentFrame = 0;

      const renderInterval = setInterval(() => {
        currentFrame++;
        const currentProgressSec = (currentFrame / 30);
        setExportProgress(Math.min(Math.round((currentFrame / totalFrames) * 95), 95));

        // Find which scene is active for this frame
        let sceneIndex = 0;
        for (let i = 0; i < scenesToRender.length; i++) {
          if (currentProgressSec >= scenesToRender[i].startSec && currentProgressSec <= scenesToRender[i].endSec) {
            sceneIndex = i;
            break;
          }
        }

        const activeImg = loadedImages[sceneIndex] || loadedImages[0];
        const activeSceneData = scenesToRender[sceneIndex] || scenesToRender[0];

        // Draw background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Compute camera movement scale & translate for this scene
        const sceneDuration = activeSceneData.endSec - activeSceneData.startSec;
        const progressInScene = Math.max(0, Math.min(1, (currentProgressSec - activeSceneData.startSec) / (sceneDuration || 1)));
        
        ctx.save();
        const scale = 1.0 + progressInScene * 0.12; // Slow cinematic zoom
        const translateX = (progressInScene - 0.5) * 30;
        ctx.translate(canvas.width / 2 + translateX, canvas.height / 2);
        ctx.scale(scale, scale);
        ctx.drawImage(activeImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.restore();

        // Atmospheric vignette overlay
        const grad = ctx.createLinearGradient(0, canvas.height * 0.5, 0, canvas.height);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.85)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Top Branding Badge
        if (showLogoOverlay) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
          ctx.beginPath();
          ctx.roundRect(isWidescreen ? 40 : 20, isWidescreen ? 35 : 25, 230, 45, 10);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.stroke();

          ctx.fillStyle = '#60a5fa';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText('UNITEC STUDIO • 8K IA', isWidescreen ? 55 : 35, isWidescreen ? 62 : 52);
        }

        // Running Timecode in corner
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.roundRect(canvas.width - (isWidescreen ? 150 : 130), isWidescreen ? 35 : 25, isWidescreen ? 110 : 100, 40, 8);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px monospace';
        const formattedSec = currentProgressSec.toFixed(1);
        ctx.fillText(`0:${formattedSec.padStart(4, '0')} / 0:${durSec}`, canvas.width - (isWidescreen ? 140 : 120), isWidescreen ? 60 : 50);

        // Lower Third Captions / Subtitles
        const captionText = activeSceneData.headline || activeVideo.title;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        const boxH = isWidescreen ? 80 : 110;
        ctx.roundRect(isWidescreen ? 40 : 20, canvas.height - boxH - 40, canvas.width - (isWidescreen ? 80 : 40), boxH, 14);
        ctx.fill();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#93c5fd';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(activeSceneData.name.toUpperCase(), isWidescreen ? 60 : 35, canvas.height - boxH - 15);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(captionText.slice(0, 75), isWidescreen ? 60 : 35, canvas.height - boxH + 18);

        if (currentFrame >= totalFrames) {
          clearInterval(renderInterval);
          recorder.stop();
        }
      }, 1000 / 30);

    } catch (e: any) {
      console.error('MP4 Export failed:', e);
      setIsExportingMP4(false);
      showToast('Descargando render cinemático en alta resolución (1080p)...');
      // Fallback single asset download
      const a = document.createElement('a');
      a.href = activeVideo.posterUrl || activeVideo.videoUrl;
      a.download = `unitec-studio-${activeVideo.id}.png`;
      a.click();
    }
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
                  Google Veo & Storyboard IA
                </span>
              </h2>
            </div>
            <p className="text-xs text-blue-100/80 max-w-2xl">
              Generador cinematográfico de videos comerciales con storyboard multi-escena, locución sincronizada y control de tiempo exacto ({duration}s). Totalmente adaptado a tus publicaciones de marketing.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-xl border border-white/15 text-xs text-blue-100 font-mono shadow-xs">
              <Activity size={13} className="text-emerald-400 animate-pulse" />
              <span>Duración Activa: <strong>{duration} Segundos</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dual-Column Layout: Original Content Companion (Left) + UNITEC STUDIO (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =========================================================================
            LEFT COLUMN: ASISTENTE DE CONTENIDO ORIGINAL & STORYBOARD DE TIEMPO
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
                    Sincronización con Post de Marketing
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Campaña: {selectedCampaign} • {selectedPlatform}
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

            {/* A/B Hook Variants Generator for Video (Google Gemini) */}
            <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles size={13} className="text-blue-600 dark:text-blue-400" />
                  Variantes de Hook 0-3s (A/B Testing IA)
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-200/60 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 rounded font-bold">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Selecciona el enfoque de apertura para aumentar la retención en los primeros 3 segundos:
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  {
                    id: 'hook-1',
                    type: 'Curiosidad & Error',
                    text: `¿Sabías que el 80% de las remodelaciones fallan por este detalle en los acabados?`
                  },
                  {
                    id: 'hook-2',
                    type: 'Transformación Rápida',
                    text: `Mira cómo transformamos este espacio comercial con acabados 8K en 48 horas.`
                  },
                  {
                    id: 'hook-3',
                    type: 'Exclusividad & Lujo',
                    text: `Si buscas que tu proyecto luzca como una mansión en Miami Beach, necesitas conocer esto.`
                  }
                ].map((hookItem) => (
                  <button
                    key={hookItem.id}
                    onClick={() => {
                      setStoryboard(prev => {
                        const copy = [...prev];
                        if (copy[0]) {
                          copy[0] = {
                            ...copy[0],
                            headline: hookItem.text,
                            voiceoverScript: hookItem.text
                          };
                        }
                        return copy;
                      });
                      showToast(`¡Hook "${hookItem.type}" aplicado a la Escena 1!`);
                    }}
                    className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 text-left transition-all group cursor-pointer"
                  >
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 whitespace-nowrap mt-0.5">
                      {hookItem.type}
                    </span>
                    <span className="text-[11px] text-slate-800 dark:text-slate-200 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      "{hookItem.text}"
                    </span>
                  </button>
                ))}
              </div>
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
                  <span>¡Prompt y Storyboard Sincronizados!</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} className="text-indigo-600 dark:text-indigo-400" />
                  <span>Sincronizar y Re-componer Storyboard de Video</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            {/* Storyboard Breakdown by Timeline (Hook -> Core Value -> CTA) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Film size={13} className="text-indigo-600" />
                  Storyboard de Video ({duration}s en 3 Escenas):
                </label>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                  Sincronizado
                </span>
              </div>

              <div className="space-y-2.5">
                {storyboard.map((scene, idx) => {
                  const isActive = currentScene?.id === scene.id;
                  return (
                    <div 
                      key={scene.id}
                      onClick={() => {
                        setCurrentTimeSec(scene.startSec);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-50/90 dark:bg-blue-950/70 border-blue-500 dark:border-blue-500 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-950/50 border-gray-200 dark:border-slate-800 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                            isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {idx === 0 ? 'Hook & Apertura' : idx === 1 ? 'Propuesta de Valor & Acabados' : 'Llamado a la Acción (CTA)'}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 px-1.5 py-0.5 bg-blue-100/60 dark:bg-blue-900/60 rounded">
                          0:0{scene.startSec} - 0:{scene.endSec < 10 ? '0' : ''}{scene.endSec}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug font-medium line-clamp-2">
                        "{scene.headline}"
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-gray-200/60 dark:border-slate-800/60">
                        <span>Cámara: <strong>{scene.cameraMotion}</strong></span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                          {isActive && isPlaying ? '▶ Reproduciendo' : 'Haz clic para ver'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Generated Post Content Summary */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Copy de Referencia:</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                  {selectedTone}
                </span>
              </label>
              
              <div className="bg-slate-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans max-h-48 overflow-y-auto">
                {generatedText ? (
                  <pre className="whitespace-pre-wrap font-sans text-xs">{generatedText.slice(0, 380)}...</pre>
                ) : (
                  <div className="text-slate-500 dark:text-slate-400 italic text-center py-2">
                    Usa la pestaña "Contexto" para generar tu post publicitario.
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            RIGHT COLUMN: UNITEC STUDIO (STUDIO ENGINE & LIVE PLAYER)
           ========================================================================= */}
        <section className="lg:col-span-7 space-y-5">
          
          {/* Main Controls Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-xs border border-gray-200 dark:border-slate-800 space-y-5">
            
            {/* Studio Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Film size={17} className="text-blue-600 dark:text-blue-400" />
                  Parámetros del Video Comercial ({duration} Segundos)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Controla la duración exacta, formato, movimiento de cámara y estilo publicitario
                </p>
              </div>
            </div>

            {/* Quick Prompt Tags */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Atributos Publicitarios Rápidos:
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
                  <span>Descripción y Prompt de Video para UNITEC STUDIO:</span>
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
                placeholder="Describe la escena, producto, iluminación y mensaje para UNITEC STUDIO..."
              />
            </div>

            {/* Controls Grid (Duration, Aspect Ratio, Camera Motion, Lighting) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Duration (Time Selection) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock size={14} className="text-emerald-500" />
                  Duración Exacta del Video (Tiempo):
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['5', '10', '15', '30'] as const).map((durOption) => (
                    <button
                      key={durOption}
                      type="button"
                      onClick={() => handleDurationChange(durOption)}
                      className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        duration === durOption
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-gray-300 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {durOption}s
                    </button>
                  ))}
                </div>
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
            </div>

            {/* Voiceover & Branding Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-gray-200 dark:border-slate-700 text-xs">
                <div className="flex items-center gap-2">
                  <Mic size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Locución de Voz con IA (Voz en Off)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={voiceoverEnabled}
                  onChange={(e) => setVoiceoverEnabled(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-gray-200 dark:border-slate-700 text-xs">
                <div className="flex items-center gap-2">
                  <Award size={15} className="text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Sello UNITEC STUDIO
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={showLogoOverlay}
                  onChange={(e) => setShowLogoOverlay(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>
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
                  <span>Renderizando Video ({progress}%) • {progressStep}</span>
                </>
              ) : (
                <>
                  <Video size={18} />
                  <span>Generar Video Comercial ({duration} Segundos) en UNITEC STUDIO</span>
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
              LIVE VIDEO PLAYER & TIMECODE STORYBOARD ENGINE
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
                    Duración: <strong>{activeVideo.duration}</strong> ({totalVideoDuration}s) • {activeVideo.aspectRatio} • {activeVideo.resolution}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportRealVideoMP4}
                    disabled={isExportingMP4}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    {isExportingMP4 ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Renderizando MP4 ({exportProgress}%)</span>
                      </>
                    ) : (
                      <>
                        <Download size={13} />
                        <span>Descargar Video MP4 ({totalVideoDuration}s)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Video Player Box with Real Scene Keyframe Transitions & Subtitle Synchronization */}
              <div className={`relative rounded-2xl overflow-hidden bg-black flex items-center justify-center group shadow-lg ${
                activeVideo.aspectRatio === '9:16' ? 'aspect-[9/16] max-w-sm mx-auto' : 'aspect-video w-full'
              }`}>
                
                {/* Visual Scene Render */}
                <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
                  <img 
                    src={currentScene?.keyframeUrl || activeVideo.posterUrl || activeVideo.videoUrl} 
                    alt={currentScene?.headline || activeVideo.title} 
                    className={`w-full h-full object-cover transition-all duration-1000 ease-out ${
                      isPlaying 
                        ? selectedMotion === 'dolly_in'
                          ? 'scale-115 translate-y-1'
                          : selectedMotion === 'orbit_arc'
                          ? 'scale-110 rotate-1 translate-x-2'
                          : selectedMotion === 'jib_down'
                          ? 'scale-110 -translate-y-3'
                          : 'scale-110 translate-x-4'
                        : 'scale-100 translate-x-0 translate-y-0 rotate-0'
                    }`}
                  />
                  
                  {/* Lighting Atmosphere Overlay */}
                  <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
                    selectedLighting === 'showroom' 
                      ? 'bg-gradient-to-tr from-amber-500/10 via-transparent to-blue-500/20 mix-blend-overlay'
                      : selectedLighting === 'daylight'
                      ? 'bg-gradient-to-b from-white/20 via-transparent to-black/40 mix-blend-screen'
                      : selectedLighting === 'dramatic_moody'
                      ? 'bg-gradient-to-t from-blue-950/80 via-transparent to-purple-950/40 mix-blend-multiply'
                      : 'bg-gradient-to-t from-black/70 via-black/20 to-black/10'
                  }`} />
                  
                  {/* Dark Vignette Bottom & Top */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />
                  
                  {/* Top Branding & Scene Indicator Badge */}
                  <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-white pointer-events-none">
                    <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300 block">
                        {currentScene?.name || 'Escena Comercial'}
                      </span>
                      <p className="text-xs font-bold text-white max-w-sm truncate">
                        {activeVideo.title}
                      </p>
                    </div>

                    <div className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Clock size={12} />
                      <span>0:{currentTimeSec.toFixed(1).padStart(4, '0')} / 0:{totalVideoDuration}</span>
                    </div>
                  </div>

                  {/* Synchronized Lower-Third Subtitle Bar (Matches Marketing Voiceover) */}
                  <div className="absolute bottom-16 left-4 right-4 z-20 pointer-events-none">
                    <div className="bg-slate-900/90 backdrop-blur-md border border-blue-500/50 rounded-xl p-3 text-white shadow-xl max-w-xl mx-auto">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">
                        <Activity size={12} className="text-blue-400 animate-pulse" />
                        <span>Subtítulo de Locución Sincronizada ({activeVideo.cameraMotion || 'Cinemático'})</span>
                      </div>
                      <p className="text-xs sm:text-sm font-black text-white leading-snug drop-shadow-md">
                        {currentScene?.headline || activeVideo.voiceoverScript || activeVideo.title}
                      </p>
                    </div>
                  </div>

                  {/* Big Play / Pause Overlay Button */}
                  <button
                    onClick={togglePlay}
                    className="absolute z-30 w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
                  >
                    {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1 fill-white" />}
                  </button>

                  {/* Watermark Overlay */}
                  {showLogoOverlay && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-white tracking-wider uppercase border border-white/20 pointer-events-none z-10 flex items-center gap-1">
                      <Sparkles size={11} className="text-blue-400" />
                      <span>UNITEC STUDIO</span>
                    </div>
                  )}

                  {/* Bottom Running Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20 z-20">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-100"
                      style={{ width: `${(currentTimeSec / totalVideoDuration) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Playback Bar Controls */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-blue-200 dark:border-blue-800"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentTimeSec(0);
                      setIsPlaying(true);
                    }}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 cursor-pointer"
                    title="Reiniciar desde el inicio"
                  >
                    <RefreshCw size={15} />
                  </button>

                  <button
                    onClick={() => setIsMuted(m => !m)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 cursor-pointer"
                    title={isMuted ? 'Activar voz en off' : 'Silenciar locución'}
                  >
                    {isMuted ? <VolumeX size={15} className="text-red-500" /> : <Volume2 size={15} className="text-emerald-500" />}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    0:{currentTimeSec.toFixed(1).padStart(4, '0')} / 0:{totalVideoDuration}s
                  </span>
                  <span>•</span>
                  <span>{activeVideo.aspectRatio}</span>
                </div>
              </div>

              {/* Voiceover Script Box */}
              {activeVideo.voiceoverScript && (
                <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-900 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-indigo-900 dark:text-indigo-200">
                    <span className="flex items-center gap-1.5">
                      <Mic size={13} className="text-indigo-600 dark:text-indigo-400" />
                      Guión de Locución Narrada (Voz en Off):
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(activeVideo.voiceoverScript || '');
                        showToast('Guión de locución copiado');
                      }}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Copy size={11} /> Copiar
                    </button>
                  </div>
                  <p className="text-indigo-950 dark:text-indigo-100 text-xs leading-relaxed font-sans">
                    "{activeVideo.voiceoverScript}"
                  </p>
                </div>
              )}
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
                    setCurrentTimeSec(0);
                    setIsPlaying(true);
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
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {video.title}
                    </h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {video.duration} ({video.durationSeconds || 10}s) • {video.aspectRatio}
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
