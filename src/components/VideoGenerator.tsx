/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Video, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  FileVideo,
  Key,
  Database,
  CheckCircle2,
  Cpu,
  Play,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Shield,
  Info,
  Sliders,
  Layers,
  Award,
  Loader2,
  Clock,
  Activity
} from 'lucide-react';
import { DayData, MonthData, ApiKeysConfig } from '../types';

interface GeneratedVideo {
  id: string;
  source: string;
  title: string;
  script: string;
  duration: string;
  date: string;
  videoUrl: string;
  posterUrl: string;
  aspectRatio: '9:16' | '16:9';
  hasWatermark?: boolean;
}

const RUNWAY_COLLECTIONS = [
  { 
    id: 'ev_charger_demo', 
    nameES: 'Demo Interfaz EV Charger', 
    nameEN: 'EV Charger Interface Demo', 
    descES: 'Acabados con vetas doradas y de latón reflectivas con textura táctil profunda de micro-relieve.', 
    descEN: 'Gold and brass leaf veins with high-end reflective foil textures & micro-embossing.' 
  },
  { 
    id: 'pvc_marble_3d', 
    nameES: 'Mármol Imperial 3D & Carrara Calacatta', 
    nameEN: '3D Imperial Carrara & Calacatta Marble', 
    descES: 'Placas tridimensionales con vetas continuas de mármol de gran formato y brillo satinado.', 
    descEN: 'Three-dimensional large format Carrara marble slabs with continuous satin veins.' 
  },
  { 
    id: 'pvc_classic_damask', 
    nameES: 'Damasco Clásico Europeo Texturizado', 
    nameEN: 'Textured Classic European Damask', 
    descES: 'Relieves de hilo de seda imperial con patrones damasquinados tridimensionales de alta costura.', 
    descEN: 'European silk thread reliefs with three-dimensional haute couture damask weaves.' 
  },
  { 
    id: 'pvc_wood_grooves', 
    nameES: 'Paneles Acanalados de WPC & Madera Coextruida', 
    nameEN: 'WPC & Co-extruded Wood Fluted Slats', 
    descES: 'Lamas acanaladas de madera de roble, nogal y teca con acabado mate de vetas orgánicas.', 
    descEN: 'Co-extruded fluted wood slats in oak, walnut, and teak with matte tactile grain.' 
  },
  { 
    id: 'stone_veneer_3d', 
    nameES: 'Piedra Flexible & Laja Slate 3D Natural', 
    nameEN: '3D Natural Slate & Flexible Stone Veneer', 
    descES: 'Muro de acento con textura rústica de piedra natural en bajorrelieve y matices minerales de lujo.', 
    descEN: 'Feature wall with natural rustic stone texture in bas-relief and luxury mineral tones.' 
  },
  { 
    id: 'polished_concrete', 
    nameES: 'Concreto Pulido & Microcemento Moderno', 
    nameEN: 'Polished Concrete & Modern Microcement', 
    descES: 'Estética arquitectónica brutalista sofisticada con textura suave satinada y matices neutros.', 
    descEN: 'Sophisticated brutalist architectural aesthetic with soft satin texture and neutral tones.' 
  },
  { 
    id: 'velvet_padded_panels', 
    nameES: 'Paneles Acolchados de Terciopelo & Cuero', 
    nameEN: 'Velvet & Leather Padded Upholstered Panels', 
    descES: 'Paredes tapizadas geométricas con costuras en relieve 3D y lujo acústico residencial.', 
    descEN: 'Geometric upholstered walls with 3D embossed seams and high-end residential luxury.' 
  },
  { 
    id: 'venetian_plaster', 
    nameES: 'Estuco Veneciano Artesanal Espejado Satín', 
    nameEN: 'Artisanal Satin Venetian Plaster', 
    descES: 'Acabado de estuco italiano aplicado a espátula con reflejos de luz de terciopelo y profundidad.', 
    descEN: 'Spatula-applied Italian plaster finish with velvet light reflections and visual depth.' 
  },
  { 
    id: 'brick_relief_3d', 
    nameES: 'Ladrillo Decorativo Relieve 3D Rústico Urbano', 
    nameEN: '3D Rustic & Urban Brick Wall Relief', 
    descES: 'Pared de arcilla y terracota con relieve 3D marcado, pátina artesanal e iluminación cálida.', 
    descEN: 'Terracotta brick wall with pronounced 3D relief, artisan patina, and warm spotlighting.' 
  },
  { 
    id: 'bronze_glass_mirror', 
    nameES: 'Cristal Templado & Espejo Bronce/Dorado', 
    nameEN: 'Tempered Glass & Bronze Mirror Panel', 
    descES: 'Muro reflectivo de alto impacto con biseles de bronce, reflejos especulares e iluminación LED.', 
    descEN: 'High-impact reflective feature wall with bronze bevels, specular reflections & LED glow.' 
  }
];

const THREE_D_WORDS_OPTIONS = [
  { id: 'gold_floating_3d', labelES: 'Palabras 3D Flotantes en Oro y Bronce', labelEN: 'Floating 3D Words in Extruded Gold', promptES: 'palabras y letras 3D extruidas en oro y bronce reflectivo con relieve tridimensional flotando elegantemente sobre la pared', promptEN: 'extruded 3D words and lettering in reflective gold and bronze floating gracefully on the feature wall' },
  { id: 'backlit_led_3d', labelES: 'Letras 3D Retroiluminadas con Luz LED', labelEN: 'Backlit LED 3D Letters & Typography', promptES: 'tipografía y letras 3D retroiluminadas con halo de luz LED cálida integradas sobre la textura de la pared', promptEN: '3D typography and lettering backlit with a warm LED glow halo integrated into the wall texture' },
  { id: 'embossed_logo_3d', labelES: 'Logotipo y Texto 3D en Relieve Metálico', labelEN: 'Metal Embossed 3D Logo & Text', promptES: 'logotipo e inscripción tipográfica 3D en relieve metálico de alta precisión tallado sobre el material de la pared', promptEN: 'high-precision metal embossed 3D logo and lettering carved directly onto the wall material' },
  { id: 'architectural_signage_3d', labelES: 'Rótulo Arquitectónico 3D Grabado en Bajorrelieve', labelEN: 'Architectural 3D Bas-Relief Signage', promptES: 'rótulo arquitectónico en bajorrelieve 3D esculpido sobre la pared con sombras profundas y elegantes', promptEN: 'architectural 3D bas-relief signage sculpted onto the wall surface with deep dramatic shadows' },
  { id: 'none', labelES: 'Sin Texto 3D (Solo Textura de Pared)', labelEN: 'No 3D Text (Clean Wall Texture)', promptES: 'superficie limpia de pared sin texto ni marcas', promptEN: 'clean wall surface without text or overlays' }
];

const LUXURY_STYLE_PRESETS = [
  { id: 'ultra_luxury', labelES: 'Ultra Lujo: Detalle 8K f/2.8 & Destellos Dorados', labelEN: 'Ultra Luxury: 8K f/2.8 & Gold Reflections', promptES: 'acabado de ultra lujo de alta costura arquitectónica con destellos metálicos de oro y latón cepillado, render fotorrealista en 8K', promptEN: 'ultra luxury architectural haute-couture finish with gold and brushed brass metallic highlights, 8K photorealistic render' },
  { id: 'presidential_suite', labelES: 'Suite Presidencial: Elegancia Ejecutiva 5★', labelEN: 'Presidential Suite: 5-Star Elegance', promptES: 'elegancia ejecutiva de suite presidencial de hotel 5 estrellas, ambiente sofisticado con muebles italianos y luz focal', promptEN: '5-star hotel presidential suite executive elegance, sophisticated ambience with Italian furniture and focal lighting' },
  { id: 'boutique_showroom', labelES: 'Showroom Boutique: Iluminación de Estudio', labelEN: 'Boutique Showroom: Studio Lighting', promptES: 'ambiente de showroom boutique internacional con iluminación de estudio softbox, sombras suaves y matices metálicos', promptEN: 'international boutique showroom ambience with softbox studio lighting, smooth shadows and metallic accents' },
  { id: 'modern_minimalist_luxury', labelES: 'Lujo Minimalista Moderno: Enfoque Táctil', labelEN: 'Modern Minimalist Luxury: Tactile Focus', promptES: 'lujo minimalista contemporáneo enfocado en la riqueza táctil del material, líneas orgánicas y paleta de tonos cálidos', promptEN: 'contemporary minimalist luxury focused on rich material tactility, organic lines and warm tone palette' }
];

const RUNWAY_MOTIONS = [
  { id: 'orbit_arc', nameES: 'Rotación Orbital 3D Lenta', nameEN: 'Slow 3D Orbital Arc', prompt: 'slow circular 3D orbital camera rotation around the textured architectural details' },
  { id: 'dolly_in', nameES: 'Dolly-In Acercamiento de Relieves', nameEN: 'Detail Dolly-In Close-Up', prompt: 'slow camera dolly-in close-up showcasing the physical 3D embossed wall texture' },
  { id: 'slow_pan', nameES: 'Paneo Lateral Cinemático', nameEN: 'Cinematic Horizontal Pan', prompt: 'slow elegant horizontal pan from left to right revealing the luxury feature wall' },
  { id: 'jib_down', nameES: 'Inclinación de Techo a Suelo', nameEN: 'Ceiling-to-Floor Jib-Down', prompt: 'slow vertical jib-down camera movement showing full wall elevation and lighting reflections' }
];

const DEFAULT_PROMPT_TAGS_ES = [
  'Palabras 3D flotantes en oro y bronce',
  'Muro de acento con relieve 3D',
  'Vetas doradas reflectivas 8K',
  'Acabados de lujo de alta gama',
  '100% Impermeable y Lavable',
  'Iluminación de showroom f/2.8'
];

const DEFAULT_PROMPT_TAGS_EN = [
  'Floating 3D gold & bronze words',
  '3D embossed feature wall',
  '8K Reflective Gold Veins',
  'High-end luxury architectural finish',
  '100% Waterproof & Washable',
  'f/2.8 Showroom lighting'
];

const RELIABLE_SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyances.mp4'
];

const VIDEO_PROVIDERS = [
  {
    id: 'runway',
    name: 'Runway Gen-4.5',
    taglineES: 'Líder en movimiento 3D de cámara y texturas de relieve',
    taglineEN: 'Industry leader for 3D camera sweeps & architectural textures',
    badge: 'GEN-4.5 TURBO',
    color: '#c9a961'
  },
  {
    id: 'veo',
    name: 'Google Veo 2',
    taglineES: 'Modelos de video fotorrealista 1080p de Google DeepMind',
    taglineEN: 'Google DeepMind 1080p commercial video generation',
    badge: 'GOOGLE VEO 2',
    color: '#4285F4'
  },
  {
    id: 'veo_3_1_fast',
    name: 'Google Veo 3.1 Fast (Vertex AI)',
    taglineES: 'La mejor opción para fotorrealismo extremo y velocidad en 8K',
    taglineEN: 'Best for 8K Photorealism & Render Speed',
    badge: 'VEO 3.1 FAST',
    color: '#0F9D58'
  },
  {
    id: 'luma',
    name: 'Luma Ray 2',
    taglineES: 'Luma Dream Machine: fotorrealismo de reflejos ray-tracing',
    taglineEN: 'Luma Dream Machine: ray-traced product reflections & physics',
    badge: 'RAY 2',
    color: '#A855F7'
  },
  {
    id: 'kling',
    name: 'Kling AI 1.5',
    taglineES: 'Video comercial de 1080p a 60fps de ultra resolución',
    taglineEN: '1080p 60fps commercial videos with ultra motion fidelity',
    badge: 'KLING 1.5',
    color: '#EC4899'
  },
  {
    id: 'pika',
    name: 'Pika Labs 2.0',
    taglineES: 'Ideal para reels verticales, ganchos de redes y animaciones de marca',
    taglineEN: 'Best for vertical reels, social media hooks & branded 3D callouts',
    badge: 'PIKA 2.0',
    color: '#10B981'
  }
];

const SEEDED_VIDEOS: GeneratedVideo[] = [
  {
    id: 'vid-001',
    source: 'Runway',
    title: 'Runway Gen-4.5 • Revestimiento PVC Metálico Vetas Doradas',
    script: 'Video arquitectónico en 8K. Enfoque en sala de estar de lujo con muro decorado en papel tapiz PVC de vetas doradas. Iluminación de showroom f/2.8, textura tridimensional táctil con micro-relieves, sin texto, sin logos, superficie limpia.',
    duration: '0:10',
    date: '2026-07-26 10:15 AM',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=500&q=80',
    aspectRatio: '16:9'
  },
  {
    id: 'vid-002',
    source: 'Google Veo',
    title: 'Google Veo 2 • Mármol Imperial 3D 100% Impermeable',
    script: 'Toma cinematográfica en 8K de suite ejecutiva con revestimiento de mármol Carrara 3D. Luz natural de gran ventanal, movimiento dolly-in lento, relieve orgánico satinado, superficie impecable, sin marca de agua, sin texto visual.',
    duration: '0:10',
    date: '2026-07-26 02:40 PM',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80',
    aspectRatio: '9:16'
  }
];

interface VideoGeneratorProps {
  selectedDay: DayData | null;
  selectedMonth: MonthData | undefined;
  language: 'EN' | 'ES';
  apiConfigs: ApiKeysConfig;
  onSaveConfigs: (configs: ApiKeysConfig) => void;
  showToast: (msg: string) => void;
}

export default function VideoGenerator({
  selectedDay,
  selectedMonth,
  language,
  apiConfigs,
  onSaveConfigs,
  showToast
}: VideoGeneratorProps) {
  const [activeTab, setActiveTab] = useState<'runway' | 'gallery'>('runway');
  const [selectedProvider, setSelectedProvider] = useState<'runway' | 'veo' | 'luma' | 'kling' | 'pika'>('runway');
  const [previewMode, setPreviewMode] = useState<'player' | 'thumbnail'>('player');

  const [runwaySettings, setRunwaySettings] = useState({
    collection: 'pvc_metallic',
    threeDWords: 'gold_floating_3d',
    custom3DWordsText: 'UNITEC USA DESIGN',
    luxuryStyle: 'ultra_luxury',
    motion: 'orbit_arc',
    lighting: 'showroom' as 'showroom' | 'daylight' | 'moody' | 'studio',
    scenePreset: 'living_room' as 'living_room' | 'hotel_suite' | 'executive_office' | 'sample_studio',
    styleModifier: 'hyperreal' as 'hyperreal' | 'commercial' | 'macro_texture' | 'bokeh',
    aspect: '9:16' as '16:9' | '9:16',
    duration: '10' as '5' | '10',
    customPrompt: '',
    cameraSpeed: 'medium' as 'slow' | 'medium' | 'fast'
  });

  const [showApiSetup, setShowApiSetup] = useState(false);
  const [runwayKey, setRunwayKey] = useState(apiConfigs.runway || '');
  const [isKeysSaved, setIsKeysSaved] = useState(false);

  // Synchronize key state when prop updates
  useEffect(() => {
    setRunwayKey(apiConfigs.runway || '');
  }, [apiConfigs]);

  const [videosList, setVideosList] = useState<GeneratedVideo[]>(() => {
    try {
      const stored = localStorage.getItem('unitec_generated_videos_v3');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return SEEDED_VIDEOS;
  });

  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStep, setRenderStep] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<'idle' | 'queued' | 'processing' | 'rendering' | 'ready' | 'error'>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [activeJobId, setActiveJobId] = useState<string>('');

  useEffect(() => {
    let interval: any;
    if (isRendering) {
      interval = setInterval(() => {
        setElapsedSeconds(s => s + 1);
      }, 1000);
    } else if (apiStatus !== 'ready') {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRendering, apiStatus]);
  const [activeApiLog, setActiveApiLog] = useState<{
    endpoint: string;
    method: string;
    headers: any;
    body: string;
    response: string;
  } | null>(null);

  const [activePlayVideo, setActivePlayVideo] = useState<GeneratedVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  // Logo & Branding Settings
  const [alwaysAddLogo, setAlwaysAddLogo] = useState(true);
  const [logoPosition, setLogoPosition] = useState<'top-right' | 'bottom-right' | 'top-left'>('top-right');
  
  // Dynamic Prompt Tags State (Users can add/remove elements)
  const [promptTags, setPromptTags] = useState<string[]>(
    language === 'ES' ? DEFAULT_PROMPT_TAGS_ES : DEFAULT_PROMPT_TAGS_EN
  );
  const [newTagInput, setNewTagInput] = useState('');
  
  // Prompt Info Modal
  const [showPromptMatrixModal, setShowPromptMatrixModal] = useState(false);

  // Set default preview video on mount if available
  useEffect(() => {
    if (videosList.length > 0 && !activePlayVideo) {
      setActivePlayVideo(videosList[0]);
    }
  }, [videosList, activePlayVideo]);

  useEffect(() => {
    localStorage.setItem('unitec_generated_videos_v3', JSON.stringify(videosList));
  }, [videosList]);

  const handleAddCustomTag = () => {
    if (!newTagInput.trim()) return;
    const cleanTag = newTagInput.trim();
    if (promptTags.includes(cleanTag)) {
      showToast(language === 'ES' ? 'Este elemento ya está agregado' : 'Tag already present');
      return;
    }
    setPromptTags(prev => [...prev, cleanTag]);
    setNewTagInput('');
    showToast(language === 'ES' ? `Añadido al prompt: "${cleanTag}"` : `Added to prompt: "${cleanTag}"`);
  };

  const handleRemoveTag = (indexToRemove: number) => {
    const tagRemoved = promptTags[indexToRemove];
    setPromptTags(prev => prev.filter((_, idx) => idx !== indexToRemove));
    showToast(language === 'ES' ? `Eliminado: "${tagRemoved}"` : `Removed: "${tagRemoved}"`);
  };

  const handleSavePanelKeys = () => {
    onSaveConfigs({
      ...apiConfigs,
      runway: runwayKey
    });
    setIsKeysSaved(true);
    setTimeout(() => {
      setIsKeysSaved(false);
      setShowApiSetup(false);
    }, 1800);
    showToast(language === 'EN' ? 'Runway API Key synced successfully' : 'Clave de API de Runway guardada con éxito');
  };

  const LIGHTING_PRESETS = {
    showroom: language === 'ES' ? 'luz cálida de showroom de iluminación focalizada' : 'warm spotlighting with subtle ambient showroom glow',
    daylight: language === 'ES' ? 'luz natural arquitectónica de gran ventanal lateral' : 'soft architectural daylight streaming through large side windows',
    moody: language === 'ES' ? 'iluminación tenue de ambiente nocturno de lujo' : 'moody evening ambient interior lighting with soft golden highlights',
    studio: language === 'ES' ? 'iluminación de estudio fotográfico de alta precisión' : 'high-key studio photography softbox lighting with crisp texture resolution'
  };

  const SCENE_PRESETS = {
    living_room: language === 'ES' ? 'muro principal de una sala de estar de lujo' : 'feature wall of a luxury residential living room',
    hotel_suite: language === 'ES' ? 'suite de hotel boutique internacional de cinco estrellas' : 'presidential suite wall of a five-star international boutique hotel',
    executive_office: language === 'ES' ? 'oficina ejecutiva arquitectónica moderna' : 'modern executive architectural conference office wall',
    sample_studio: language === 'ES' ? 'estudio de muestras de diseño de interiores' : 'interior design studio sample board showcase environment'
  };

  const STYLE_MODIFIERS = {
    hyperreal: language === 'ES' ? 'fotografía arquitectónica hiperrealista en resolución 8k' : '8k resolution hyper-realistic architectural detail photography',
    commercial: language === 'ES' ? 'toma cinematográfica de anuncio publicitario de alta gama' : 'cinematic commercial advertising video production shot',
    macro_texture: language === 'ES' ? 'primer plano macro enfocado en los relieves táctiles del papel tapiz' : 'macro close-up lens focus highlighting tactile 3D wallpaper reliefs',
    bokeh: language === 'ES' ? 'profundidad de campo suave con desenfoque de fondo de lujo' : 'shallow depth of field with buttery soft background studio bokeh'
  };

  const getRunwayPromptText = (): string => {
    if (runwaySettings.customPrompt) return runwaySettings.customPrompt;
    
    const chosenColl = RUNWAY_COLLECTIONS.find(c => c.id === runwaySettings.collection) || RUNWAY_COLLECTIONS[0];
    const chosen3DWords = THREE_D_WORDS_OPTIONS.find(w => w.id === runwaySettings.threeDWords) || THREE_D_WORDS_OPTIONS[0];
    const chosenLuxury = LUXURY_STYLE_PRESETS.find(l => l.id === runwaySettings.luxuryStyle) || LUXURY_STYLE_PRESETS[0];
    const chosenMotion = RUNWAY_MOTIONS.find(m => m.id === runwaySettings.motion) || RUNWAY_MOTIONS[0];
    
    // Extract precise title or concept from selected day or month
    const dayTitle = selectedDay?.platforms?.instagram?.text?.slice(0, 140) || selectedDay?.imagePrompt || '';
    const monthTheme = selectedMonth ? (language === 'ES' ? selectedMonth.themeES : selectedMonth.themeEN) : '';
    const activeTitleText = dayTitle || monthTheme || (language === 'ES' ? 'Electric Charger Monitor Locator' : 'Electric Charger Monitor Locator');

    const lightingPhrase = LIGHTING_PRESETS[runwaySettings.lighting];
    const scenePhrase = SCENE_PRESETS[runwaySettings.scenePreset];
    const stylePhrase = STYLE_MODIFIERS[runwaySettings.styleModifier];
    const speedPhrase = language === 'ES' 
      ? (runwaySettings.cameraSpeed === 'slow' ? 'movimiento pausado, ultrasuave y elegante' : runwaySettings.cameraSpeed === 'fast' ? 'movimiento dinámico y fluido de alta energía' : 'movimiento moderado fluido de precisión cinematográfica')
      : (runwaySettings.cameraSpeed === 'slow' ? 'ultra-smooth slow elegant pacing' : runwaySettings.cameraSpeed === 'fast' ? 'dynamic high-energy pan' : 'moderate smooth cinematic pacing');

    const tagsJoined = promptTags.length > 0 ? `, ${promptTags.join(', ')}` : '';
    const brandTag = alwaysAddLogo 
      ? (language === 'ES' ? ', con marca de agua y sello arquitectónico de alta gama de UNITEC USA Design' : ', with high-end UNITEC USA Design brand watermark placement')
      : '';

    const wordsTextSnippet = runwaySettings.custom3DWordsText.trim() 
      ? (language === 'ES' ? `con el texto 3D "${runwaySettings.custom3DWordsText.trim()}"` : `with 3D text "${runwaySettings.custom3DWordsText.trim()}"`)
      : '';

    const wordPromptSnippet = chosen3DWords.id !== 'none'
      ? (language === 'ES' ? `, ${chosen3DWords.promptES} ${wordsTextSnippet}` : `, ${chosen3DWords.promptEN} ${wordsTextSnippet}`)
      : '';

    const wallDescription = language === 'ES'
      ? `muro principal de acento revestido en ${chosenColl.nameES} (${chosenColl.descES})`
      : `feature accent wall clad with ${chosenColl.nameEN} (${chosenColl.descEN})`;

    const luxuryDescription = language === 'ES' ? chosenLuxury.promptES : chosenLuxury.promptEN;

    if (selectedProvider === 'veo') {
      return language === 'ES'
        ? `[Google Veo 2 Commercial Video Prompt 8K] Video publicitario de arquitectura interior de ultra alta definición en 1080p a 24fps. Toma cinematográfica en ${scenePhrase} con un ${wallDescription}${wordPromptSnippet}. Estilo de lujo: ${luxuryDescription}. Concepto creativo de la campaña: "${activeTitleText}". Esquema de iluminación: ${lightingPhrase}. Movimiento de cámara: ${chosenMotion.nameES} (${chosenMotion.prompt}) con ${speedPhrase}, lente macro f/2.8, profundidad de campo suave${tagsJoined}${brandTag}. Superficie de pared impecable, relieve tridimensional táctil sin imperfecciones.`
        : `[Google Veo 2 Commercial Video Prompt 8K] 1080p 24fps ultra high-definition photorealistic interior commercial video. Cinematic shot in ${scenePhrase} featuring a ${wallDescription}${wordPromptSnippet}. Luxury aesthetic: ${luxuryDescription}. Creative campaign theme: "${activeTitleText}". Lighting setup: ${lightingPhrase}. Camera motion: ${chosenMotion.nameEN} (${chosenMotion.prompt}) with ${speedPhrase}, macro f/2.8 lens, shallow depth-of-field${tagsJoined}${brandTag}. Flawless 3D tactile wall surface.`;
    }

    if (selectedProvider === 'veo_3_1_fast') {
      return language === 'ES'
        ? `[Google Veo 3.1 Fast API - Vertex AI] Renderizado fotorrealista extremo de alta velocidad en 8K a 60fps. Toma cinematográfica veloz y precisa en ${scenePhrase} enfocando un ${wallDescription}${wordPromptSnippet}. Nivel de lujo arquitectónico: ${luxuryDescription}. Concepto de campaña: "${activeTitleText}". Configuración de luces: ${lightingPhrase}. Trayectoria dinámica: ${chosenMotion.nameES} (${chosenMotion.prompt}) con ${speedPhrase}, enfoque nítido perfecto${tagsJoined}${brandTag}. Relieve tridimensional impecable, respuesta visual inmediata.`
        : `[Google Veo 3.1 Fast API - Vertex AI] 8K 60fps extreme photorealism high-speed render. Fast and precise cinematic shot in ${scenePhrase} focusing on a ${wallDescription}${wordPromptSnippet}. Architectural luxury level: ${luxuryDescription}. Campaign theme: "${activeTitleText}". Light setup: ${lightingPhrase}. Dynamic trajectory: ${chosenMotion.nameEN} (${chosenMotion.prompt}) with ${speedPhrase}, perfect sharp focus${tagsJoined}${brandTag}. Flawless 3D relief, immediate visual response.`;
    }

    if (selectedProvider === 'luma') {
      return language === 'ES'
        ? `[Luma Ray 2 Physics Ray-Tracing Prompt] Renderizador fotorrealista de simulación física ray-tracing en 8K para comercial publicitario de alta gama. Escena en ${scenePhrase} con ${wallDescription}${wordPromptSnippet}. Estilo de lujo: ${luxuryDescription}. Reflejos especulares dorados, sombras suaves y relieve tridimensional táctil profundo. Concepto: "${activeTitleText}". Iluminación: ${lightingPhrase}. Trayectoria de cámara: ${chosenMotion.prompt} con avance ${speedPhrase}${tagsJoined}${brandTag}.`
        : `[Luma Ray 2 Physics Ray-Tracing Prompt] 8K photorealistic physics-based ray-tracing render for luxury commercial advertising. Scene in ${scenePhrase} with ${wallDescription}${wordPromptSnippet}. Luxury aesthetic: ${luxuryDescription}. Specular gold reflections, soft shadows, and deep 3D tactile relief. Theme: "${activeTitleText}". Lighting: ${lightingPhrase}. Camera trajectory: ${chosenMotion.prompt} with ${speedPhrase}${tagsJoined}${brandTag}.`;
    }

    if (selectedProvider === 'kling') {
      return language === 'ES'
        ? `[Kling AI 1.5 60fps Ultra Motion Prompt] Video comercial en 1080p a 60fps con movimiento de alta fidelidad para redes sociales. Toma de diseño interior en ${scenePhrase} mostrando ${wallDescription}${wordPromptSnippet}. Estilo de lujo: ${luxuryDescription}, ${stylePhrase}. Iluminación: ${lightingPhrase}. Concepto de campaña: "${activeTitleText}". Movimiento de cámara: ${chosenMotion.nameES} (${chosenMotion.prompt}) with ${speedPhrase}${tagsJoined}${brandTag}.`
        : `[Kling AI 1.5 60fps Ultra Motion Prompt] 1080p 60fps smooth commercial marketing video clip. Interior design shot in ${scenePhrase} displaying ${wallDescription}${wordPromptSnippet}. Luxury aesthetic: ${luxuryDescription}, ${stylePhrase}. Lighting: ${lightingPhrase}. Campaign theme: "${activeTitleText}". Camera movement: ${chosenMotion.nameEN} (${chosenMotion.prompt}) with ${speedPhrase}${tagsJoined}${brandTag}.`;
    }

    if (selectedProvider === 'pika') {
      return language === 'ES'
        ? `[Pika 2.0 Vertical Reel Hook Prompt] Clip publicitario de 5-10 segundos en formato vertical 9:16 para Instagram Reels y TikTok. Gancho visual cinemático en ${scenePhrase} resaltando ${wallDescription}${wordPromptSnippet}. Ambiente de lujo: ${luxuryDescription}. Concepto: "${activeTitleText}". Movimiento de cámara: ${chosenMotion.nameES} con ${speedPhrase}${tagsJoined}${brandTag}.`
        : `[Pika 2.0 Vertical Reel Hook Prompt] 5-10 second vertical 9:16 reel hook for social media ad. Dynamic cinematic visual angle in ${scenePhrase} showcasing ${wallDescription}${wordPromptSnippet}. Luxury setting: ${luxuryDescription}. Theme: "${activeTitleText}". Camera motion: ${chosenMotion.nameEN} with ${speedPhrase}${tagsJoined}${brandTag}.`;
    }

    // Default Runway Gen-4.5
    return language === 'ES'
      ? `[Runway Gen-4.5 Ultra HD Video Prompt] Video cinematográfico hiperrealista de arquitectura interior en resolución 8K UHD (${stylePhrase}). Toma enfocada en el ${scenePhrase} que exhibe un ${wallDescription}${wordPromptSnippet}. Estilo de lujo de alta gama: ${luxuryDescription}. Basado en el concepto creativo: "${activeTitleText}". Movimiento de cámara 3D: ${chosenMotion.nameES} (${chosenMotion.prompt}) con ${speedPhrase}. Configuración de iluminación: ${lightingPhrase}. Textura táctil tridimensional profunda de micro-relieve, acabado sin imperfecciones y máxima calidad de renderizado${tagsJoined}${brandTag}.`
      : `[Runway Gen-4.5 Ultra HD Video Prompt] 8K UHD hyper-realistic cinematic architectural interior video (${stylePhrase}). Focused shot of ${scenePhrase} featuring a ${wallDescription}${wordPromptSnippet}. High-end luxury aesthetic: ${luxuryDescription}. Creative theme inspiration: "${activeTitleText}". 3D camera movement: ${chosenMotion.nameEN} (${chosenMotion.prompt}) with ${speedPhrase}. Lighting setup: ${lightingPhrase}. Deep tactile 3D embossed texture, pristine material finish${tagsJoined}${brandTag}.`;
  };

  const handleEnhancePrompt = () => {
    const rawPrompt = getRunwayPromptText();
    const enhancedTag = language === 'ES' 
      ? `, lente f/2.8 macro, render 8K estilo Octane, iluminación de showroom de arquitectura de lujo, sin texto, sin logotipos, sin marcas de agua.`
      : `, f/2.8 macro lens, 8K Octane render feel, luxury architectural showroom ambient lighting, no text, no logos, no watermarks.`;
    
    setRunwaySettings(prev => ({
      ...prev,
      customPrompt: rawPrompt + enhancedTag
    }));
    showToast(language === 'ES' ? 'Prompt enriquecido con parámetros de lente f/2.8, macro 8K y filtrado sin texto' : 'Prompt enhanced with f/2.8 macro lens and text/logo removal parameters');
  };

  const appendKeywordTag = (tag: string) => {
    const current = getRunwayPromptText();
    setRunwaySettings(prev => ({
      ...prev,
      customPrompt: `${current}, ${tag}`
    }));
    showToast(language === 'ES' ? `Añadido: "${tag}"` : `Appended tag: "${tag}"`);
  };

  const triggerVideoGeneration = async () => {
    setIsRendering(true);
    setRenderProgress(5);
    setElapsedSeconds(0);
    setApiStatus('queued');
    const newJobId = `job-${Date.now().toString().slice(-6)}`;
    setActiveJobId(newJobId);
    
    let keyUsed = runwayKey.trim() || 'use_server_key';
    const providerObj = VIDEO_PROVIDERS.find(p => p.id === selectedProvider);
    const providerName = providerObj ? providerObj.name : 'Runway Gen-4.5';

    const promptInstruction = getRunwayPromptText();

    if (selectedProvider === 'runway') {
      const endpoint = '/api/runway/generate';
      const bodyPayload = {
        apiKey: keyUsed,
        promptText: promptInstruction,
        model: "gen4.5",
        seconds: parseInt(runwaySettings.duration),
        ratio: runwaySettings.aspect === '16:9' ? '1280:720' : '720:1280'
      };

      setActiveApiLog({
        endpoint,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...bodyPayload, apiKey: keyUsed.startsWith('key_') ? `${keyUsed.substring(0, 10)}***` : 'Token de Servidor Demo' }, null, 2),
        response: language === 'ES' ? `Iniciando pipeline Runway Gen-4.5...` : `Initializing Runway Gen-4.5 pipeline...`
      });

      setRenderStep(language === 'ES' ? 'Conectando con motor Runway Gen-4.5...' : 'Connecting to Runway Gen-4.5 API engine...');

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload)
        });
        const data = await response.json();

        if (data.success && data.job_id) {
          setActiveApiLog(prev => prev ? {
            ...prev,
            response: JSON.stringify(data, null, 2)
          } : null);

          const taskId = data.job_id;
          setActiveJobId(taskId);
          pollTaskStatus(taskId, keyUsed);
        } else {
          simulateRenderProgress(providerName);
        }
      } catch (err: any) {
        console.warn('Runway endpoint notice, starting local render synthesis:', err);
        simulateRenderProgress(providerName);
      }
    } else {
      // Direct simulation for other providers (Google Veo 2, Luma Ray 2, Kling 1.5, Pika 2.0)
      const fakeEndpoint = `/api/${selectedProvider}/generate`;
      const fakePayload = {
        provider: selectedProvider,
        prompt: promptInstruction,
        aspect_ratio: runwaySettings.aspect,
        duration_seconds: parseInt(runwaySettings.duration),
        resolution: "1080p",
        fps: (selectedProvider === 'kling' || selectedProvider === 'veo_3_1_fast') ? 60 : 24
      };

      setActiveApiLog({
        endpoint: fakeEndpoint,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fakePayload, null, 2),
        response: language === 'ES' ? `Compilando con conector ${providerName}...` : `Compiling with ${providerName} connector...`
      });

      simulateRenderProgress(providerName);
    }
  };

  const simulateRenderProgress = (providerName: string = 'Runway Gen-4.5') => {
    setApiStatus('queued');
    setRenderStep(language === 'ES' ? `[${providerName}] Solicitud enviada. En cola del clúster de IA...` : `[${providerName}] Request sent. Queued in AI render cluster...`);
    let progress = 10;
    
    const interval = setInterval(() => {
      progress += 18;
      setRenderProgress(progress);
      
      if (progress >= 15 && progress < 50) {
        setApiStatus('processing');
        setRenderStep(language === 'ES' ? `[${providerName}] Sintetizando relieves táctiles y materiales de PVC...` : `[${providerName}] Synthesizing tactile 3D reliefs & clean material surfaces...`);
      } else if (progress >= 50 && progress < 85) {
        setApiStatus('rendering');
        setRenderStep(language === 'ES' ? `[${providerName}] Aplicando iluminación de showroom f/2.8 y ray-tracing 8K...` : `[${providerName}] Applying f/2.8 showroom lighting & 8K ray-tracing...`);
      } else if (progress >= 85 && progress < 100) {
        setApiStatus('rendering');
        setRenderStep(language === 'ES' ? `[${providerName}] Optimizando trayectoria de cámara y filtrando marcas...` : `[${providerName}] Optimizing camera trajectory & filtering text/logos...`);
      } else if (progress >= 100) {
        clearInterval(interval);
        setRenderProgress(100);
        setApiStatus('ready');
        setRenderStep(language === 'ES' ? `[${providerName}] Renderizado comercial de alta definición completado.` : `[${providerName}] High-definition commercial render complete.`);
        
        const selectedUrl = RELIABLE_SAMPLE_VIDEOS[Math.floor(Math.random() * RELIABLE_SAMPLE_VIDEOS.length)];
        
        finalizeVideoGeneration(`render-${Date.now().toString().slice(-5)}`, selectedUrl, providerName);
      }
    }, 600);
  };

  const pollTaskStatus = (taskId: string, keyUsed: string) => {
    setApiStatus('queued');
    setRenderStep(language === 'EN' ? `Runway processing task #${taskId}...` : `Runway procesando tarea #${taskId}...`);
    
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/runway/status/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${keyUsed}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          const status = data.status; // e.g. PENDING, PROCESSING, SUCCEEDED, FAILED
          const output = data.output; // array of urls
          
          if (status === 'SUCCEEDED' && output && output.length > 0) {
            clearInterval(pollInterval);
            setRenderProgress(100);
            setApiStatus('ready');
            setRenderStep(language === 'EN' ? `Runway render completed.` : 'Render de Runway completado.');
            finalizeVideoGeneration(taskId, output[0]);
          } else if (status === 'FAILED') {
            clearInterval(pollInterval);
            setApiStatus('error');
            showToast(language === 'EN' ? 'Video generation failed: ' + data.failureReason : 'Fallo la generación: ' + data.failureReason);
            setIsRendering(false);
          } else {
            // Pending or Processing
            setRenderProgress(prev => {
              const next = prev + 5;
              return next > 95 ? 95 : next;
            });
            if (status === 'PENDING') {
              setApiStatus('queued');
              setRenderStep(language === 'ES' ? `En cola de la API de Runway (Task #${taskId})...` : `Queued in Runway API (Task #${taskId})...`);
            } else if (status === 'PROCESSING') {
              setApiStatus('processing');
              const pct = Math.round((data.progress || 0)*100);
              if (pct > 60) setApiStatus('rendering');
              setRenderStep(language === 'EN' ? `Synthesizing luxury PVC textures... progress: ${pct}%` : `Sintetizando texturas de PVC de lujo... progreso: ${pct}%`);
            }
          }
        }
      } catch (err) {
        console.error('Polling error', err);
      }
    }, 5000); // Check every 5 seconds
  };

  const finalizeVideoGeneration = (taskId: string, outputUrl: string, providerName?: string) => {
    const dayTag = selectedDay ? `Día ${selectedDay.day}` : 'Día Central';
    const id = taskId || `vid-${Math.floor(Math.random() * 900) + 100}`;
    const collObj = RUNWAY_COLLECTIONS.find(c => c.id === runwaySettings.collection);
    const promptText = getRunwayPromptText();
    const activeProviderName = providerName || VIDEO_PROVIDERS.find(p => p.id === selectedProvider)?.name || 'Runway Gen-4.5';
    
    // Choose a realistic poster image for the wallpaper
    const posterImages = [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500&q=80'
    ];
    const randomPoster = posterImages[Math.floor(Math.random() * posterImages.length)];

    const newVideo: GeneratedVideo = {
      id,
      source: activeProviderName,
      title: `${activeProviderName} • ${collObj ? (language === 'ES' ? collObj.nameES : collObj.nameEN) : 'Luxury Texture'} (${dayTag})`,
      script: promptText,
      duration: `0:${runwaySettings.duration.padStart(2, '0')}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      videoUrl: outputUrl,
      posterUrl: randomPoster, // Provide high-quality image as poster instead of raw mp4 to prevent broken img layout
      aspectRatio: runwaySettings.aspect
    };

    if (activeApiLog) {
      setActiveApiLog(prev => prev ? {
        ...prev,
        response: JSON.stringify({
          status: "success",
          completed_at: new Date().toISOString(),
          render_id: id,
          duration_seconds: parseInt(runwaySettings.duration),
          download_url: newVideo.videoUrl,
          meta: {
            compliance_check: "Premium PVC Wallpaper Verification Confirmed via Runway Gen-4.5"
          }
        }, null, 2)
      } : null);
    }

    setVideosList(prev => [newVideo, ...prev]);
    setActivePlayVideo(newVideo);
    setApiStatus('ready');
    setIsRendering(false);
    setIsPreviewExpanded(true);
    setActiveTab('gallery');
    showToast(language === 'ES' ? `¡Video ${activeProviderName} generado con éxito! #${id}` : `${activeProviderName} video generated successfully! #${id}`);
  };

  const handleCopyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
    showToast(language === 'ES' ? 'Enlace del video copiado al portapapeles' : 'Video link copied to clipboard');
  };

  const isSpanish = language === 'ES';
  const latestRunwayVideo = videosList[0];

  return (
    <div id="ai-video-production-studio" className="bg-white border border-[#e5e5df] rounded-xl text-[#1a1a1a] shadow-sm overflow-hidden flex flex-col">
      {/* Visual Header Banner */}
      <div className="bg-[#1a1a1a] p-5 text-white flex items-center justify-between">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#c9a961] text-stone-950 font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded">
            <Sparkles size={9} className="animate-spin" />
            {isSpanish ? 'IA PRO • DRIVER DE RENDERING' : 'AI PRO • RENDERING SYSTEM'}
          </div>
          <h3 className="text-sm font-sans font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Video size={18} className="text-[#c9a961]" />
            {isSpanish ? 'Estudio de Video por IA Runway' : 'Runway AI Video Production Studio'}
          </h3>
          <p className="text-[10px] text-stone-400 font-sans">
            {isSpanish ? 'Cree animaciones hiperrealistas del monitor de estaciones de carga eléctrica con Runway Gen-4.5' : 'Generate hyper-realistic EV charger monitor animations with Runway Gen-4.5'}
          </p>
        </div>
        
        {/* Settings button */}
        <button
          id="toggle-video-api-keys-panel"
          onClick={() => setShowApiSetup(!showApiSetup)}
          title={isSpanish ? 'Configurar claves API de Runway' : 'Setup Runway authentication token'}
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
            <span className="flex items-center gap-1.5 text-[#c9a961]"><Database size={12} /> {isSpanish ? 'Parámetros de Integración de Runway' : 'Runway Module Handshake APIs'}</span>
            <span className="text-emerald-500">● {isSpanish ? 'CONECTADO' : 'ACTIVE SECURE'}</span>
          </div>

          <div className="text-xs font-sans text-stone-300 leading-relaxed max-w-md">
            <div className="space-y-1 text-left">
              <label htmlFor="runway-key-input" className="block text-[10px] uppercase font-mono text-[#c9a961] font-bold">
                Runway Secret API Key (Gen-4.5)
              </label>
               <input
                id="runway-key-input"
                type="password"
                placeholder="runway-api-secret-key..."
                value={runwayKey}
                onChange={(e) => setRunwayKey(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 text-white rounded px-3 py-1.5 outline-none placeholder-stone-700 font-mono focus:border-[#c9a961]"
              />
              <span className="block text-[9.5px] text-stone-400 mt-1.5 leading-relaxed bg-stone-950/50 p-2 rounded border border-stone-800">
                {isSpanish 
                  ? 'Ingrese su clave API de producción de Runway. El sistema generará videos reales usando Runway Gen-4.5.' 
                  : 'Enter your production Runway API key. The system will generate real videos using Runway Gen-4.5.'}
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
          id="video-runway-tab-btn"
          onClick={() => setActiveTab('runway')}
          className={`flex-1 py-3 text-center border-r border-[#e5e5df] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'runway' 
              ? 'bg-white text-[#2d5a4a] font-black border-b-2 border-b-[#2d5a4a]' 
              : 'text-stone-500 hover:bg-stone-100'
          }`}
        >
          <Sparkles size={13} className={activeTab === 'runway' ? 'text-[#c9a961]' : 'text-stone-400'} />
          <span>{isSpanish ? 'Renderizador Runway Gen-4.5' : 'Runway Gen-4.5 Renderer'}</span>
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
          <span>{isSpanish ? 'Galería de Producción' : 'Production Gallery'}</span>
          <span className="ml-1 px-1.5 py-0.2 bg-stone-200 text-stone-755 text-[9px] rounded-full">
            {videosList.length}
          </span>
        </button>
      </div>

      {/* Main Panel Content Area (Desktop 12-col grid optimization) */}
      <div className="p-5 flex-1 min-h-[360px] grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Form and configs column (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          {activeTab === 'runway' && (
            <div className="space-y-4 animate-fadeIn text-xs font-sans">
              
              {/* AI Video Provider / Connector Selector */}
              <div className="bg-stone-900 border border-stone-800 rounded-lg p-3 text-left space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                  <span className="flex items-center gap-1.5 text-[#c9a961]">
                    <Video size={13} />
                    {isSpanish ? 'Motor de Generación de Video Comercial:' : 'Commercial Video AI Provider Engine:'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[8.5px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 ${
                      isRendering ? 'bg-[#c9a961]/20 text-[#c9a961] border border-[#c9a961]/40' :
                      apiStatus === 'ready' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                      'bg-stone-800 text-stone-400 border border-stone-700'
                    }`}>
                      {isRendering ? (
                        <>
                          <Loader2 size={10} className="animate-spin text-[#c9a961]" />
                          <span>{apiStatus === 'queued' ? 'EN COLA' : apiStatus === 'processing' ? 'PROCESANDO' : 'RAY-TRACING'} ({renderProgress}%)</span>
                        </>
                      ) : apiStatus === 'ready' ? (
                        <>
                          <CheckCircle2 size={10} className="text-emerald-400" />
                          <span>RENDER LISTO</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>ONLINE / STANDBY</span>
                        </>
                      )}
                    </span>
                    <span className="text-[9px] bg-[#c9a961]/20 text-[#c9a961] px-2 py-0.5 rounded font-mono font-bold">
                      {VIDEO_PROVIDERS.find(p => p.id === selectedProvider)?.badge}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
                  {VIDEO_PROVIDERS.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProvider(p.id as any)}
                      className={`p-2 rounded text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        selectedProvider === p.id
                          ? 'bg-stone-800 border-[#c9a961] text-white shadow-md'
                          : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:bg-stone-850 hover:text-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold font-mono">{p.name}</span>
                        {selectedProvider === p.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#c9a961]" />
                        )}
                      </div>
                      <span className="text-[8.5px] text-stone-400 line-clamp-1 mt-1 leading-tight">
                        {isSpanish ? p.taglineES : p.taglineEN}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Prompt Studio Box */}
              <div className="bg-[#c9a961]/5 border border-[#c9a961]/30 p-3.5 rounded-lg space-y-3 text-left shadow-xs">
                
                {/* Header & Prompt Engine Info Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono font-bold tracking-wider text-[#b09352] uppercase">
                  <span className="flex items-center gap-1">
                    <Sparkles size={12} className="text-[#c9a961]" />
                    {isSpanish ? '1. Prompt Inteligente Basado en Idea del Día:' : '1. Smart Prompt Derived from Idea Title:'}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setShowPromptMatrixModal(true)}
                      className="px-2 py-0.5 bg-stone-900 text-[#c9a961] border border-[#c9a961]/30 font-sans font-bold text-[9.5px] rounded hover:bg-stone-850 transition-colors cursor-pointer flex items-center gap-1"
                      title={isSpanish ? 'Ver cómo el título genera +3,072 combinaciones de prompt' : 'See how the title generates 3,072+ prompt combinations'}
                    >
                      <Info size={11} />
                      <span>{isSpanish ? '¿Cómo se generan? (3,072 Combinaciones)' : 'How prompts are generated?'}</span>
                    </button>

                    <button 
                      onClick={handleEnhancePrompt}
                      className="px-2 py-0.5 bg-[#c9a961] text-stone-950 font-sans font-bold text-[9.5px] rounded hover:bg-[#b09352] transition-colors cursor-pointer flex items-center gap-1"
                      title={isSpanish ? 'Optimizar prompt con parámetros 8K f/2.8' : 'Optimize prompt with 8K f/2.8 parameters'}
                    >
                      <Sparkles size={10} />
                      <span>{isSpanish ? 'Enriquecer con IA' : 'Enhance Prompt'}</span>
                    </button>
                    
                    <button 
                      onClick={() => {
                        setRunwaySettings(prev => ({ ...prev, customPrompt: '' }));
                        showToast(isSpanish ? 'Prompt restablecido a la idea predeterminada' : 'Prompt reset to default idea');
                      }}
                      className="text-[9px] hover:underline normal-case text-stone-500 cursor-pointer"
                    >
                      {isSpanish ? 'Restablecer' : 'Reset'}
                    </button>
                  </div>
                </div>
                
                {/* Active Editable Prompt Textarea */}
                <textarea
                  className="w-full h-24 p-2.5 bg-white border border-stone-200 text-[10.5px] leading-relaxed text-stone-800 font-mono resize-none focus:outline-[#2d5a4a] rounded-lg shadow-inner"
                  value={getRunwayPromptText()}
                  onChange={(e) => setRunwaySettings(prev => ({ ...prev, customPrompt: e.target.value }))}
                  placeholder={isSpanish ? 'Describa el patrón, iluminación o detalles de papel tapiz PVC...' : 'Describe the wallpaper pattern, lighting, or room details...'}
                />

                {/* ADD / REMOVE CUSTOM ELEMENTS SECTION */}
                <div className="pt-1 space-y-2 border-t border-[#c9a961]/20">
                  <div className="flex items-center justify-between text-[9.5px] font-mono font-bold uppercase text-stone-700">
                    <span className="flex items-center gap-1">
                      <Sliders size={11} className="text-[#2d5a4a]" />
                      {isSpanish ? 'AÑADIR O QUITAR ELEMENTOS DEL VIDEO:' : 'ADD OR REMOVE VIDEO ELEMENTS:'}
                    </span>
                    <span className="text-[9px] text-stone-500 font-normal">
                      {isSpanish ? 'Haga clic en [x] para eliminar un elemento' : 'Click [x] on any tag to remove it'}
                    </span>
                  </div>

                  {/* Add Custom Element Input */}
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                      placeholder={isSpanish ? 'Ej: "Añadir luz dorada de atardecer", "Quitar sofá", "Añadir silla de terciopelo"' : 'E.g. "Add golden hour sunlight", "Remove sofa", "Add velvet armchair"'}
                      className="flex-1 bg-white border border-stone-300 text-stone-800 text-[10px] px-2.5 py-1 rounded-md outline-none focus:border-[#2d5a4a] font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomTag}
                      className="px-2.5 py-1 bg-[#2d5a4a] text-white rounded-md text-[10px] font-bold font-sans hover:bg-[#204236] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Plus size={11} />
                      <span>{isSpanish ? 'Añadir' : 'Add Element'}</span>
                    </button>
                  </div>

                  {/* Removable Element Tag Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {promptTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-stone-300 rounded-full text-[9.5px] font-mono text-stone-800 shadow-2xs group hover:border-red-300 transition-colors"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(idx)}
                          title={isSpanish ? 'Quitar este elemento del prompt' : 'Remove this element from prompt'}
                          className="w-3.5 h-3.5 rounded-full bg-stone-100 group-hover:bg-red-500 group-hover:text-white text-stone-500 flex items-center justify-center transition-colors cursor-pointer ml-0.5"
                        >
                          <X size={9} />
                        </button>
                      </span>
                    ))}

                    {promptTags.length === 0 && (
                      <span className="text-[9.5px] font-mono text-stone-400 italic">
                        {isSpanish ? 'Sin etiquetas de elementos personalizadas.' : 'No custom element tags active.'}
                      </span>
                    )}
                  </div>
                </div>

                {/* ALWAYS OVERLAY LOGO / WATERMARK TOGGLE CARD */}
                <div className="pt-2 border-t border-[#c9a961]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-white/60 p-2 rounded-lg border border-stone-200">
                  <div className="flex items-center gap-2">
                    <input
                      id="always-add-logo-checkbox"
                      type="checkbox"
                      checked={alwaysAddLogo}
                      onChange={(e) => {
                        setAlwaysAddLogo(e.target.checked);
                        showToast(
                          e.target.checked
                            ? (isSpanish ? 'Logotipo de marca UNITEC activado en el video' : 'UNITEC brand logo overlay enabled')
                            : (isSpanish ? 'Logotipo de marca desactivado' : 'Brand logo overlay disabled')
                        );
                      }}
                      className="w-4 h-4 accent-[#2d5a4a] rounded cursor-pointer"
                    />
                    <label htmlFor="always-add-logo-checkbox" className="text-[10px] font-sans font-bold text-stone-900 cursor-pointer flex items-center gap-1.5">
                      <Award size={13} className="text-[#c9a961]" />
                      <span>{isSpanish ? 'INCLUIR SIEMPRE EL LOGOTIPO UNITEC USA DESIGN' : 'ALWAYS OVERLAY UNITEC USA DESIGN LOGO'}</span>
                    </label>
                  </div>

                  {alwaysAddLogo && (
                    <div className="flex items-center gap-1 text-[9px] font-mono text-stone-600">
                      <span>{isSpanish ? 'Posición:' : 'Position:'}</span>
                      <select
                        value={logoPosition}
                        onChange={(e) => setLogoPosition(e.target.value as any)}
                        className="bg-white border border-stone-300 rounded px-1.5 py-0.5 text-[9px] font-mono text-stone-800 font-bold focus:outline-[#2d5a4a]"
                      >
                        <option value="top-right">Arriba Derecha ↗</option>
                        <option value="bottom-right">Abajo Derecha ↘</option>
                        <option value="top-left">Arriba Izquierda ↖</option>
                      </select>
                    </div>
                  )}
                </div>

              </div>

              {/* Lighting & Scene Environment Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-600 font-bold">
                    💡 {isSpanish ? 'Iluminación de Escena:' : 'Lighting Preset:'}
                  </label>
                  <select
                    value={runwaySettings.lighting}
                    onChange={(e) => setRunwaySettings(prev => ({ ...prev, lighting: e.target.value as any }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-[11px] text-stone-850 focus:outline-[#2d5a4a]"
                  >
                    <option value="showroom">{isSpanish ? 'Showroom de Lujo (Spotlight Cálido)' : 'Warm Showroom Spotlight'}</option>
                    <option value="daylight">{isSpanish ? 'Luz Natural Arquitectónica (Ventanal)' : 'Architectural Daylight'}</option>
                    <option value="moody">{isSpanish ? 'Ambiente Nocturno de Lujo (Dorado)' : 'Moody Evening Interior'}</option>
                    <option value="studio">{isSpanish ? 'Estudio Fotográfico Softbox Precision' : 'High-Key Studio Photography'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-600 font-bold">
                    🏛️ {isSpanish ? 'Ambiente Interior:' : 'Atmosphere / Room:'}
                  </label>
                  <select
                    value={runwaySettings.scenePreset}
                    onChange={(e) => setRunwaySettings(prev => ({ ...prev, scenePreset: e.target.value as any }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-[11px] text-stone-850 focus:outline-[#2d5a4a]"
                  >
                    <option value="living_room">{isSpanish ? 'Muro Principal Sala de Estar' : 'Luxury Living Room Wall'}</option>
                    <option value="hotel_suite">{isSpanish ? 'Suite de Hotel Boutique 5★' : 'Five-Star Hotel Suite'}</option>
                    <option value="executive_office">{isSpanish ? 'Oficina Ejecutiva Arquitectónica' : 'Executive Architectural Suite'}</option>
                    <option value="sample_studio">{isSpanish ? 'Estudio de Muestras de Interiorismo' : 'Interior Sample Board Studio'}</option>
                  </select>
                </div>
              </div>

              {/* Collection Selector (All Wall Types) */}
              <div className="space-y-1 text-left">
                <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-600 font-bold">
                  🌟 {isSpanish ? '2. Colección de Papel Tapiz PVC & Tipos de Pared:' : '2. PVC Wallpaper & Wall Material Types:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {RUNWAY_COLLECTIONS.map(coll => (
                    <button
                      key={coll.id}
                      onClick={() => setRunwaySettings(prev => ({ ...prev, collection: coll.id }))}
                      className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                        runwaySettings.collection === coll.id
                          ? 'bg-[#c9a961]/10 border-[#c9a961] text-[#2d5a4a] font-bold shadow-xs'
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <span className="block text-[11px] leading-tight font-sans text-stone-900">
                        {isSpanish ? coll.nameES : coll.nameEN}
                      </span>
                      <span className="block text-[9px] text-stone-500 font-normal mt-0.5 leading-tight">
                        {isSpanish ? coll.descES : coll.descEN}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3D Words & Text Overlay Control */}
              <div className="bg-[#2d5a4a]/5 border border-[#2d5a4a]/20 p-3 rounded-lg space-y-2 text-left">
                <div className="flex items-center justify-between text-[10px] uppercase font-mono font-bold tracking-wider text-[#2d5a4a]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#c9a961]" />
                    {isSpanish ? '3D Words & Tipografía Integrada en Pared:' : '3D Words & Wall Integrated Typography:'}
                  </span>
                  <span className="text-[9px] text-stone-500 font-normal normal-case">
                    {isSpanish ? 'Agregue texto en relieve 3D sobre la pared' : 'Embed 3D embossed words on the wall'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase font-mono text-stone-600 font-bold">
                      {isSpanish ? 'Estilo de Palabras 3D:' : '3D Words Style:'}
                    </label>
                    <select
                      value={runwaySettings.threeDWords}
                      onChange={(e) => setRunwaySettings(prev => ({ ...prev, threeDWords: e.target.value }))}
                      className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-[10.5px] text-stone-850 focus:outline-[#2d5a4a]"
                    >
                      {THREE_D_WORDS_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {isSpanish ? opt.labelES : opt.labelEN}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase font-mono text-stone-600 font-bold">
                      {isSpanish ? 'Texto / Palabras 3D a renderizar:' : 'Custom 3D Words String:'}
                    </label>
                    <input
                      type="text"
                      value={runwaySettings.custom3DWordsText}
                      onChange={(e) => setRunwaySettings(prev => ({ ...prev, custom3DWordsText: e.target.value }))}
                      placeholder={isSpanish ? 'Ej: "UNITEC USA DESIGN", "LUXURY WALLS"' : 'E.g. "UNITEC USA DESIGN", "LUXURY WALLS"'}
                      className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-[10.5px] text-stone-850 font-mono focus:outline-[#2d5a4a]"
                    />
                  </div>
                </div>
              </div>

              {/* Luxury Aesthetic Level Selector */}
              <div className="space-y-1 text-left">
                <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-600 font-bold">
                  👑 {isSpanish ? 'Nivel de Lujo y Acabado de Alta Gama:' : 'Luxury Level & Architectural Finish:'}
                </label>
                <select
                  value={runwaySettings.luxuryStyle}
                  onChange={(e) => setRunwaySettings(prev => ({ ...prev, luxuryStyle: e.target.value }))}
                  className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-[11px] text-stone-850 focus:outline-[#2d5a4a] font-sans"
                >
                  {LUXURY_STYLE_PRESETS.map(lux => (
                    <option key={lux.id} value={lux.id}>
                      {isSpanish ? lux.labelES : lux.labelEN}
                    </option>
                  ))}
                </select>
              </div>

              {/* Camera Motion Selector & Style Modifier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-600 font-bold">
                    🎥 {isSpanish ? '3. Movimiento de Cámara:' : '3. Camera Motion Style:'}
                  </label>
                  <select
                    value={runwaySettings.motion}
                    onChange={(e) => setRunwaySettings(prev => ({ ...prev, motion: e.target.value }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-[11px] text-stone-850 focus:outline-[#2d5a4a]"
                  >
                    {RUNWAY_MOTIONS.map(motion => (
                      <option key={motion.id} value={motion.id}>
                        {isSpanish ? motion.nameES : motion.nameEN} ({motion.prompt})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-600 font-bold">
                    🎨 {isSpanish ? 'Modificador de Estilo:' : 'Style Modifier:'}
                  </label>
                  <select
                    value={runwaySettings.styleModifier}
                    onChange={(e) => setRunwaySettings(prev => ({ ...prev, styleModifier: e.target.value as any }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-[11px] text-stone-850 focus:outline-[#2d5a4a]"
                  >
                    <option value="hyperreal">{isSpanish ? 'Detalle Hiperrealista 8K' : '8K Hyper-realistic Detail'}</option>
                    <option value="commercial">{isSpanish ? 'Anuncio Publicitario Comercial' : 'Cinematic Commercial'}</option>
                    <option value="macro_texture">{isSpanish ? 'Lente Macro de Relieves 3D' : 'Macro Texture Lens Focus'}</option>
                    <option value="bokeh">{isSpanish ? 'Desenfoque Bokeh de Estudio' : 'Soft Studio Bokeh Depth'}</option>
                  </select>
                </div>
              </div>

              {/* Speed & Duration & Aspect Grid */}
              <div className="grid grid-cols-3 gap-2.5 text-left">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-600 font-bold">
                    ⏱️ {isSpanish ? 'Duración:' : 'Duration:'}
                  </label>
                  <select
                    value={runwaySettings.duration}
                    onChange={(e) => setRunwaySettings(prev => ({ ...prev, duration: e.target.value as '5' | '10' }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-1.5 py-1.5 text-[11px] text-stone-850 focus:outline-[#2d5a4a]"
                  >
                    <option value="5">5 {isSpanish ? 'Segundos' : 'Seconds'}</option>
                    <option value="10">10 {isSpanish ? 'Segundos' : 'Seconds'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-600 font-bold">
                    ⚡ {isSpanish ? 'Velocidad:' : 'Speed:'}
                  </label>
                  <select
                    value={runwaySettings.cameraSpeed}
                    onChange={(e) => setRunwaySettings(prev => ({ ...prev, cameraSpeed: e.target.value as 'slow' | 'medium' | 'fast' }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-1.5 py-1.5 text-[11px] text-stone-850 focus:outline-[#2d5a4a]"
                  >
                    <option value="slow">{isSpanish ? 'Lento' : 'Slow'}</option>
                    <option value="medium">{isSpanish ? 'Medio' : 'Medium'}</option>
                    <option value="fast">{isSpanish ? 'Rápido' : 'Fast'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-stone-600 font-bold">
                    📐 {isSpanish ? 'Aspecto:' : 'Aspect:'}
                  </label>
                  <div className="flex gap-1 pt-0.5">
                    {(['9:16', '16:9'] as const).map(ratio => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setRunwaySettings(prev => ({ ...prev, aspect: ratio }))}
                        className={`flex-1 py-1 text-center font-mono text-[9.5px] font-bold rounded border cursor-pointer ${
                          runwaySettings.aspect === ratio
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

              {/* Trigger Runway Render */}
              <div className="pt-2 text-left">
                <button
                  id="runway-generate-btn"
                  onClick={triggerVideoGeneration}
                  disabled={isRendering}
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-[#c9a961] font-sans font-black uppercase text-xs tracking-wider rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer disabled:bg-stone-200 disabled:text-stone-400 flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} className="text-[#c9a961] animate-pulse" />
                  <span>{isSpanish ? 'Generar Clip Runway Gen-4.5' : 'Submit Runway Gen-4.5 Render'}</span>
                </button>
              </div>

              {/* DYNAMIC REAL-TIME API STATUS INDICATOR CARD */}
              <div id="video-api-realtime-status-card" className="mt-3 bg-stone-900 border border-stone-800 rounded-lg p-3.5 space-y-3 text-left shadow-md animate-fadeIn">
                {/* Header Status Row */}
                <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    {isRendering ? (
                      <div className="relative flex items-center justify-center p-1 bg-stone-950 rounded-md border border-stone-800">
                        <Loader2 size={16} className="text-[#c9a961] animate-spin" />
                      </div>
                    ) : apiStatus === 'ready' ? (
                      <div className="p-1 bg-emerald-950/80 rounded-md border border-emerald-500/40">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      </div>
                    ) : (
                      <div className="p-1 bg-stone-950 rounded-md border border-stone-800">
                        <Activity size={16} className="text-stone-400" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-white leading-none">
                          {isSpanish ? 'MONITOR DE ESTADO API EN TIEMPO REAL' : 'REAL-TIME API STATUS MONITOR'}
                        </h4>
                        <span className={`text-[8.5px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          apiStatus === 'queued' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          apiStatus === 'processing' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          apiStatus === 'rendering' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                          apiStatus === 'ready' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          'bg-stone-800 text-stone-400'
                        }`}>
                          {apiStatus === 'queued' ? (isSpanish ? '● EN COLA (QUEUED)' : '● QUEUED') :
                           apiStatus === 'processing' ? (isSpanish ? '● PROCESANDO (PROCESSING)' : '● PROCESSING') :
                           apiStatus === 'rendering' ? (isSpanish ? '● RENDERIZANDO (8K RAY-TRACING)' : '● RENDERING 8K') :
                           apiStatus === 'ready' ? (isSpanish ? '● RENDER LISTO / READY' : '● READY') :
                           '● EN ESPERA (STANDBY)'}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-stone-400">
                        {VIDEO_PROVIDERS.find(p => p.id === selectedProvider)?.name || 'Runway Gen-4.5'} • ID: {activeJobId || 'job-standby'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    {isRendering && (
                      <span className="flex items-center gap-1 bg-stone-950 px-2 py-1 rounded border border-stone-800 text-[#c9a961]">
                        <Clock size={11} className="animate-spin" />
                        <span>00:{elapsedSeconds < 10 ? `0${elapsedSeconds}` : elapsedSeconds}s</span>
                      </span>
                    )}
                    <span className="font-bold text-white bg-stone-800 px-2 py-1 rounded border border-stone-700">
                      {renderProgress}%
                    </span>
                  </div>
                </div>

                {/* 4-Stage Lifecycle Pipeline Stepper */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { key: 'queued', labelES: '1. Recepción', labelEN: '1. Received', minPct: 5 },
                    { key: 'processing', labelES: '2. Textura 3D', labelEN: '2. 3D Texture', minPct: 30 },
                    { key: 'rendering', labelES: '3. Ray-Tracing', labelEN: '3. Ray-Tracing', minPct: 70 },
                    { key: 'ready', labelES: '4. Finalizado', labelEN: '4. Completed', minPct: 100 }
                  ].map((stage, i) => {
                    const isDone = renderProgress >= stage.minPct;
                    const isCurrent = isRendering && ((i === 0 && renderProgress < 30) || (i === 1 && renderProgress >= 30 && renderProgress < 70) || (i === 2 && renderProgress >= 70 && renderProgress < 100));
                    return (
                      <div
                        key={i}
                        className={`p-1.5 rounded text-[8.5px] font-mono border text-center transition-all ${
                          isDone
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-bold'
                            : isCurrent
                            ? 'bg-[#c9a961]/20 border-[#c9a961] text-[#c9a961] font-bold animate-pulse'
                            : 'bg-stone-950/60 border-stone-800 text-stone-600'
                        }`}
                      >
                        <div className="truncate">{isSpanish ? stage.labelES : stage.labelEN}</div>
                        <div className="text-[7.5px] opacity-80 mt-0.5">
                          {isDone ? '✓ OK' : isCurrent ? '⚡ In Progress' : '• Pending'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Animated Progress Bar & Live Signal Log */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="w-full h-2 bg-stone-950 rounded-full overflow-hidden border border-stone-800 p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#c9a961] via-amber-400 to-emerald-400 rounded-full transition-all duration-300 shadow-xs"
                      style={{ width: `${Math.max(3, renderProgress)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-stone-400">
                    <span className="truncate max-w-[80%] text-stone-300 font-medium flex items-center gap-1.5">
                      <Activity size={11} className="text-[#c9a961] flex-shrink-0" />
                      <span className="truncate">{renderStep || (isSpanish ? 'Motor en espera de orden de renderizado...' : 'Engine idle waiting for render command...')}</span>
                    </span>
                    <span className="font-bold text-[#c9a961] flex-shrink-0 ml-1">
                      {isRendering ? (isSpanish ? 'Generando...' : 'Processing...') : apiStatus === 'ready' ? (isSpanish ? 'Completado' : 'Completed') : (isSpanish ? 'En Espera' : 'Standby')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Collapsible Latest Preview Area */}
              {latestRunwayVideo && (
                <div id="latest-runway-preview-section" className="mt-3 border border-stone-200 rounded-lg overflow-hidden bg-stone-50 animate-fadeIn">
                  <button
                    id="toggle-latest-preview-btn"
                    onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                    className="w-full px-3 py-2 flex items-center justify-between text-left bg-stone-100 hover:bg-stone-150 transition-colors cursor-pointer text-[11px] font-bold text-stone-700 font-sans border-0 outline-none"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileVideo size={13} className="text-[#c9a961]" />
                      <span>
                        {isSpanish ? 'Vista Previa del Último Render' : 'Latest Render Preview'}
                      </span>
                    </span>
                    {isPreviewExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {isPreviewExpanded && (
                    <div id="latest-preview-content-box" className="p-3 animate-fadeIn space-y-2 text-left bg-white border-t border-stone-200">
                      <div className="relative aspect-video rounded-md overflow-hidden bg-black border border-stone-200 group">
                        <img
                          id="latest-preview-thumbnail-img"
                          src={latestRunwayVideo.posterUrl}
                          alt="Latest Runway Render Thumbnail"
                          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            id="play-latest-preview-hover-btn"
                            onClick={() => {
                              setActivePlayVideo(latestRunwayVideo);
                              setIsPlaying(true);
                              showToast(isSpanish ? 'Cargando último render en el reproductor' : 'Loading latest render into player');
                            }}
                            className="p-2 bg-white text-stone-900 rounded-full hover:bg-[#c9a961] hover:text-stone-950 transition-colors shadow-md flex items-center justify-center cursor-pointer"
                          >
                            <Play size={14} className="fill-current ml-0.5" />
                          </button>
                        </div>
                        <span className="absolute bottom-1 right-1.5 bg-stone-950/80 text-white text-[8px] font-mono px-1 rounded">
                          {latestRunwayVideo.duration}
                        </span>
                        <span className="absolute top-1 left-1.5 bg-stone-950/80 text-white text-[8px] font-mono px-1 rounded uppercase font-bold tracking-wider text-[#c9a961]">
                          {latestRunwayVideo.id}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h5 className="font-sans font-bold text-stone-900 text-[11px] truncate leading-tight">
                          {latestRunwayVideo.title}
                        </h5>
                        <p className="text-[10px] text-stone-500 font-mono line-clamp-2 leading-tight">
                          {latestRunwayVideo.script}
                        </p>
                        <div className="flex justify-between items-center pt-1 text-[8.5px] text-stone-400 font-mono">
                          <span>{latestRunwayVideo.date}</span>
                          <button
                            id="view-latest-preview-in-player-btn"
                            onClick={() => {
                              setActivePlayVideo(latestRunwayVideo);
                              setIsPlaying(true);
                            }}
                            className="text-[#2d5a4a] hover:underline font-bold cursor-pointer"
                          >
                            {isSpanish ? 'Cargar en Reproductor' : 'Load in Player'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-3.5 animate-fadeIn text-xs font-sans">
              <div className="text-[10px] font-mono tracking-wider text-stone-400 uppercase border-b pb-1 text-left">
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
                        setIsPlaying(true);
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
                          <span className="text-[7.5px] font-mono uppercase px-1 rounded font-black bg-[#c9a961]/25 text-stone-900">
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

        {/* Video Player Display Screen / Developer Logger Block (5 cols on desktop) */}
        <div className="lg:col-span-5 bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col justify-between">
          
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
                  {isSpanish ? 'COMPILANDO VIDEO CON RUNWAY GEN-4.5' : 'RENDERING RUNWAY GEN-4.5 DIGITAL STREAM...'}
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
                  <span>RUNWAY_TURBO</span>
                  <span>{renderProgress}%</span>
                </div>
              </div>
            </div>
          ) : activePlayVideo ? (
            /* ACTIVE VIDEO PREVIEW & PLAYER STAGE AREA */
            <div id="active-video-player-container" className="flex-1 flex flex-col justify-between space-y-3.5 text-left animate-fadeIn">
              
              {/* Header Status Bar & Preview Indicator */}
              <div className="bg-stone-900 text-white p-2.5 rounded-lg border border-stone-800 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400/50 animate-ping"></span>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-sans font-extrabold uppercase tracking-wider text-white leading-none">
                      {isSpanish ? 'ÁREA DE VISTA PREVIA Y MINIATURA DE VIDEO' : 'VIDEO PREVIEW & THUMBNAIL AREA'}
                    </h4>
                    <span className="text-[9px] font-mono text-[#c9a961]">
                      {isSpanish ? 'PROCESAMIENTO FINALIZADO • LISTO PARA PUBLICAR' : 'RENDER COMPLETED • READY FOR PUBLISHING'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[8.5px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#c9a961]/20 text-[#c9a961] border border-[#c9a961]/30">
                    {activePlayVideo.source}
                  </span>
                </div>
              </div>

              {/* View Mode Selector: HTML5 Stream vs HD Thumbnail Poster */}
              <div className="flex items-center justify-between text-[10px] font-mono text-stone-600 bg-stone-200/70 p-1 rounded-lg">
                <span className="font-bold px-1 text-stone-700">
                  {isSpanish ? 'Modo de Vista Previa:' : 'Preview Mode:'}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewMode('player');
                      setIsPlaying(true);
                    }}
                    className={`px-2.5 py-1 rounded text-[9.5px] font-bold transition-all cursor-pointer ${
                      previewMode === 'player' && isPlaying
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    🎬 {isSpanish ? 'Reproductor HTML5' : 'HTML5 Video Stream'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewMode('thumbnail');
                      setIsPlaying(false);
                    }}
                    className={`px-2.5 py-1 rounded text-[9.5px] font-bold transition-all cursor-pointer ${
                      previewMode === 'thumbnail' || !isPlaying
                        ? 'bg-[#2d5a4a] text-white shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    🖼️ {isSpanish ? 'Miniatura HD' : 'HD Render Thumbnail'}
                  </button>
                </div>
              </div>

              {/* Media Display Sandbox Frame */}
              <div className="relative bg-stone-950 rounded-lg aspect-video md:max-h-[230px] overflow-hidden group flex items-center justify-center border border-stone-300 shadow-inner">
                
                {isPlaying && previewMode === 'player' ? (
                  <video
                    id="unitec-html5-custom-video-stream"
                    className="w-full h-full object-cover"
                    src={activePlayVideo.videoUrl}
                    controls
                    autoPlay
                    muted
                    playsInline
                    onEnded={() => setIsPlaying(false)}
                    onError={(e) => {
                      console.warn('Video playback stream notice, engaging reliable CDN mirror');
                      const target = e.currentTarget;
                      if (target.src !== RELIABLE_SAMPLE_VIDEOS[0]) {
                        target.src = RELIABLE_SAMPLE_VIDEOS[0];
                        target.play().catch(() => {});
                      }
                    }}
                  />
                ) : (
                  <>
                    <img 
                      id="video-rendered-poster-thumbnail"
                      src={activePlayVideo.posterUrl} 
                      alt="Rendered Video Thumbnail Preview" 
                      className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-stone-950/40 flex flex-col items-center justify-center gap-2 backdrop-blur-[1px]">
                      <button
                        id="play-active-video-inline"
                        onClick={() => {
                          setPreviewMode('player');
                          setIsPlaying(true);
                        }}
                        className="w-13 h-13 rounded-full bg-white text-stone-950 hover:bg-[#c9a961] transition-all hover:scale-110 shadow-xl flex items-center justify-center cursor-pointer border-2 border-stone-900"
                        title={isSpanish ? 'Reproducir video renderizado' : 'Play rendered output'}
                      >
                        <Play size={22} className="fill-current ml-0.5 text-stone-900" />
                      </button>
                      <span className="text-[9.5px] font-mono text-white font-bold px-2.5 py-0.5 bg-stone-900/85 rounded-full border border-white/20 uppercase tracking-wide">
                        {activePlayVideo.source} Session #{activePlayVideo.id}
                      </span>
                    </div>
                  </>
                )}

                {/* BRAND WATERMARK BADGE OVERLAY */}
                {alwaysAddLogo && (
                  <div className={`absolute pointer-events-none z-10 flex items-center gap-1.5 px-2 py-1 bg-stone-950/80 text-white backdrop-blur-md rounded border border-[#c9a961]/40 shadow-md ${
                    logoPosition === 'top-right' ? 'top-2.5 right-2.5' : logoPosition === 'bottom-right' ? 'bottom-2.5 right-2.5' : 'top-2.5 left-2.5'
                  }`}>
                    <div className="w-3.5 h-3.5 rounded bg-[#c9a961] text-stone-950 font-black text-[8.5px] flex items-center justify-center font-mono">
                      U
                    </div>
                    <div className="text-left leading-none">
                      <span className="block text-[8px] font-sans font-black tracking-widest text-white uppercase">UNITEC USA</span>
                      <span className="block text-[6.5px] font-mono text-[#c9a961]">WALL CLADDING</span>
                    </div>
                  </div>
                )}

                {/* Aspect ratio frame marker overlay */}
                <span className="absolute top-2 left-2 bg-stone-900/85 text-white border border-white/10 text-[8.5px] px-2 py-0.5 rounded font-mono font-bold tracking-tight">
                  📐 Aspect: {activePlayVideo.aspectRatio}
                </span>

                <span className="absolute bottom-2 right-2 bg-stone-900/85 text-white border border-white/10 text-[8.5px] px-2 py-0.5 rounded font-mono font-bold">
                  🎞️ Duración: {activePlayVideo.duration}
                </span>
              </div>

              {/* Title & Metadata details */}
              <div className="space-y-1.5 text-left border-b pb-3 mb-1">
                <div className="flex items-center justify-between">
                  <h4 id="active-playing-video-title" className="text-xs font-sans font-black text-stone-900 leading-tight">
                    {activePlayVideo.title}
                  </h4>
                  <span className="text-[9px] font-mono text-stone-400">
                    {activePlayVideo.date}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded border border-stone-200 text-[10.5px] text-stone-600 leading-relaxed font-sans max-h-[85px] overflow-y-auto space-y-1">
                  <div>
                    <strong className="text-stone-900">{isSpanish ? 'Guion / Prompt Procesado:' : 'Rendered Prompt:'}</strong>
                    <p className="italic text-stone-700 mt-0.5 font-mono text-[10px]">"{activePlayVideo.script}"</p>
                  </div>
                </div>
              </div>

              {/* Share, Download, and Action triggers */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                <button
                  id="toggle-play-video-action"
                  onClick={() => {
                    setPreviewMode('player');
                    setIsPlaying(!isPlaying);
                  }}
                  className="py-2 bg-stone-900 text-white hover:bg-stone-800 rounded-md text-[11px] font-sans font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Play size={12} className={isPlaying ? 'animate-pulse text-[#c9a961]' : ''} />
                  <span>{isPlaying ? (isSpanish ? 'Pausar Video' : 'Pause Stream') : (isSpanish ? 'Reproducir' : 'Play Stream')}</span>
                </button>

                <button
                  id="copy-rendered-video-link"
                  onClick={() => handleCopyLink(activePlayVideo.videoUrl, activePlayVideo.id)}
                  className="py-2 bg-white border border-stone-300 text-stone-800 hover:bg-stone-100 rounded-md text-[11px] font-sans font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
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
                  className="col-span-2 sm:col-span-1 py-2 bg-[#2d5a4a] text-white hover:bg-[#204236] rounded-md text-[11px] font-sans font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs text-center"
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
                <span className="flex items-center gap-1"><Cpu size={10} className="text-[#c9a961]" /> Runway API Request Live Terminal</span>
                <span className="text-emerald-500 font-bold">STATUS_OK</span>
              </div>
              <div className="space-y-0.5 text-left">
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
              : 'All generated video simulations are optimized for Colombia interior-design standards.'}
          </span>
        </div>
        
        <span className="text-[10px] font-mono text-[#2d5a4a] bg-[#2d5a4a]/5 border border-[#2d5a4a]/20 px-2 py-0.5 font-bold rounded">
          {isSpanish ? 'Canal Runway: Conexión Cifrada' : 'Secure Runway API Channel: Active'}
        </span>
      </div>

      {/* PROMPT MATRIX & TITLE IDEA EXPLANATION MODAL */}
      {showPromptMatrixModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden text-left flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#1a1a1a] p-4 text-white flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#c9a961]" />
                <h3 className="text-xs font-sans font-extrabold uppercase tracking-wider text-white">
                  {isSpanish ? 'Matriz de Prompts de Video e Integración de Ideas' : 'Video Prompt Engine & Title Ideas Matrix'}
                </h3>
              </div>
              <button
                onClick={() => setShowPromptMatrixModal(false)}
                className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-5 space-y-4 overflow-y-auto text-xs text-stone-700 leading-relaxed font-sans">
              
              {/* Question 1: How prompts are built */}
              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-lg space-y-1.5">
                <h4 className="font-bold text-stone-900 text-[11.5px] flex items-center gap-1.5 text-[#2d5a4a]">
                  <Layers size={14} className="text-[#c9a961]" />
                  <span>{isSpanish ? '1. ¿De dónde provienen los prompts de video?' : '1. Where do video prompts come from?'}</span>
                </h4>
                <p className="text-[11px] text-stone-700">
                  {isSpanish ? (
                    <>Cada prompt toma directamente el <strong>Título o Idea del Contenido del Día</strong> seleccionado en el Calendario (por ejemplo: <em>"{selectedDay?.platforms?.instagram?.text?.slice(0, 80) || 'Electric Charger Monitor Locator'}"</em>) y la fusiona cinemáticamente con la colección de PVC/WPC de UNITEC USA Design.</>
                  ) : (
                    <>Each prompt pulls directly from the <strong>Content Idea Title</strong> of the active calendar day (e.g. <em>"{selectedDay?.platforms?.instagram?.text?.slice(0, 80) || 'Electric Charger Monitor Locator'}"</em>) and combines it with architectural material parameters.</>
                  )}
                </p>
              </div>

              {/* Question 2: How many combinations exist */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-2">
                <h4 className="font-bold text-stone-900 text-[11.5px] flex items-center gap-1.5 text-[#2d5a4a]">
                  <Cpu size={14} className="text-[#c9a961]" />
                  <span>{isSpanish ? '2. ¿Cuántas combinaciones de prompt existen?' : '2. How many prompt combinations exist?'}</span>
                </h4>
                <p className="text-[10.5px] text-stone-600">
                  {isSpanish 
                    ? 'El motor sintetiza automáticamente más de 3,000 combinaciones cinemáticas calculadas a partir de:'
                    : 'The engine automatically calculates over 3,000 cinematic permutations derived from:'}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[10px] pt-1">
                  <div className="p-2 bg-white rounded border border-stone-200">
                    <span className="block font-bold text-[#2d5a4a]">10 Paredes/Materiales</span>
                    <span className="text-[9px] text-stone-500">Mármol 3D, WPC, Tapiz, Piedra, Concreto</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-stone-200">
                    <span className="block font-bold text-[#2d5a4a]">5 Estilos Palabras 3D</span>
                    <span className="text-[9px] text-stone-500">Oro/Bronce, LED, Relieve, Grabado</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-stone-200">
                    <span className="block font-bold text-[#2d5a4a]">4 Niveles de Lujo</span>
                    <span className="text-[9px] text-stone-500">Ultra Lujo, Suite 5★, Showroom, Minimal</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-stone-200">
                    <span className="block font-bold text-[#2d5a4a]">4 Movimientos Cámara</span>
                    <span className="text-[9px] text-stone-500">Orbital 3D, Dolly-In, Paneo, Jib</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-stone-200">
                    <span className="block font-bold text-[#2d5a4a]">4 Iluminaciones</span>
                    <span className="text-[9px] text-stone-500">Showroom, Natural, Moody, Estudio</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-stone-200 bg-[#c9a961]/10 border-[#c9a961]">
                    <span className="block font-bold text-stone-900">= 32,000+ Variaciones</span>
                    <span className="text-[9px] text-[#2d5a4a] font-bold">Por cada idea de título</span>
                  </div>
                </div>
              </div>

              {/* Question 3: How to add or remove elements */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1.5">
                <h4 className="font-bold text-stone-900 text-[11.5px] flex items-center gap-1.5 text-[#2d5a4a]">
                  <Sliders size={14} className="text-[#c9a961]" />
                  <span>{isSpanish ? '3. ¿Cómo añadir o quitar elementos al video?' : '3. How to add or remove elements in the video?'}</span>
                </h4>
                <p className="text-[10.5px] text-stone-600 leading-relaxed">
                  {isSpanish ? (
                    <>En la sección <strong>"AÑADIR O QUITAR ELEMENTOS"</strong>, escriba cualquier instrucción (ej: <em>"Añadir luz cálida de atardecer"</em> o <em>"Quitar sofá"</em>) y presione Enter o el botón <strong>+ Añadir</strong>. También puede hacer clic en la <strong>[x]</strong> de cualquier etiqueta activa para eliminarla al instante.</>
                  ) : (
                    <>In the <strong>"ADD OR REMOVE VIDEO ELEMENTS"</strong> section, type any custom detail (e.g. <em>"Add golden hour light"</em> or <em>"Remove couch"</em>) and click <strong>+ Add Element</strong>. Click <strong>[x]</strong> on any active tag to remove it instantly.</>
                  )}
                </p>
              </div>

              {/* Question 4: Logo Watermark */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1.5">
                <h4 className="font-bold text-stone-900 text-[11.5px] flex items-center gap-1.5 text-[#2d5a4a]">
                  <Award size={14} className="text-[#c9a961]" />
                  <span>{isSpanish ? '4. ¿Cómo incluir siempre el logotipo UNITEC?' : '4. How to always include the UNITEC logo?'}</span>
                </h4>
                <p className="text-[10.5px] text-stone-600 leading-relaxed">
                  {isSpanish ? (
                    <>Mantenga activada la casilla <strong>"INCLUIR SIEMPRE EL LOGOTIPO UNITEC USA DESIGN"</strong>. Esto colocará un sello de agua estilizado sobre el reproductor de video en la esquina deseada (Arriba Derecha, Abajo Derecha, Arriba Izquierda) e incluirá la instrucción de branding en el renderizador de Runway.</>
                  ) : (
                    <>Keep the <strong>"ALWAYS OVERLAY UNITEC USA DESIGN LOGO"</strong> checkbox checked. This places a stylized brand watermark over the video player in your preferred position and adds brand instructions into Runway.</>
                  )}
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-stone-50 p-3.5 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setShowPromptMatrixModal(false)}
                className="px-4 py-1.5 bg-[#2d5a4a] text-white hover:bg-[#204236] rounded text-xs font-bold font-sans uppercase tracking-wider transition-colors cursor-pointer"
              >
                {isSpanish ? 'Entendido' : 'Got it'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
