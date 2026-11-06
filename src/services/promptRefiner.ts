/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';

export interface ArchitecturalTemplate {
  id: string;
  name: string;
  category: 'commercial' | 'interior' | 'exterior' | 'brutalist' | 'sustainable' | 'twilight' | 'minimalist' | 'luxury_retail' | 'parametric' | 'macro_detail';
  description: string;
  badge: string;
  lighting: string;
  lensFocalLength: string;
  cameraSettings: string;
  materialTextures: string;
  composition: string;
  atmosphere: string;
  sampleKeywords: string[];
}

/**
 * Ficha Técnica Oficial de Producto del Catálogo UNITEC USA Design
 */
export interface ProductCatalogSpec {
  id: string;
  sku: string;
  nameES: string;
  nameEN: string;
  categoryES: string;
  keywords: string[];
  technicalBenefits: string[];
  dimensionsSpec: string;
  certificationSpec: string;
  applicationZones: string;
  visualMaterialDNA: string;
  recommendedTemplateId: string;
}

/**
 * Reglas de Zona Segura y Distribución Gráfica (1080 x 1920 px -> Central 1080 x 1350 px)
 */
export interface SafeZoneLayoutSpec {
  canvasWidth: number;
  canvasHeight: number;
  safeZoneWidth: number;
  safeZoneHeight: number;
  topUnsafeOffsetPx: number;
  bottomUnsafeOffsetPx: number;
  safeZoneTopY: number;
  safeZoneBottomY: number;
  horizontalMarginPx: number;
  logoMaxHeightPx: number;
  logoClearanceBottomPx: number;
  titleMaxLines: number;
  titleFontSizeRangePx: [number, number];
}

export const SAFE_ZONE_1080X1920_SPEC: SafeZoneLayoutSpec = {
  canvasWidth: 1080,
  canvasHeight: 1920,
  safeZoneWidth: 1080,
  safeZoneHeight: 1350,
  topUnsafeOffsetPx: 285,     // (1920 - 1350) / 2 = 285px arriba libre de textos/logos
  bottomUnsafeOffsetPx: 285,  // (1920 - 1350) / 2 = 285px abajo libre de textos/logos
  safeZoneTopY: 285,
  safeZoneBottomY: 1635,      // 285 + 1350 = 1635px límite inferior de zona segura
  horizontalMarginPx: 68,     // 68px margen izquierdo/derecho para evitar cortes de texto
  logoMaxHeightPx: 54,        // Escala controlada de logotipo sin superposición
  logoClearanceBottomPx: 28,  // Separación mínima obligatoria entre logo y título
  titleMaxLines: 2,
  titleFontSizeRangePx: [34, 48]
};

export interface ParsedPromptProductResult {
  detectedProductNameES: string;
  detectedProductNameEN: string;
  cleanedPromptSubject: string;
  catalogMatch: ProductCatalogSpec;
  isExactCatalogMatch: boolean;
  detectedFinishOrColor: string;
  technicalBenefits: string[];
  dimensionsSpec: string;
  certificationSpec: string;
  sku: string;
  safeZoneSpec: SafeZoneLayoutSpec;
}

export interface PromptRefinerRequest {
  rawPrompt: string;
  templateId?: string;
  productCatalogId?: string;
  aspectRatio?: string;
  style?: string;
  referenceImage?: string;
  referenceEmailText?: string;
  customOverrides?: {
    lighting?: string;
    lensFocalLength?: string;
    materialTextures?: string;
    productTitle?: string;
    technicalBenefits?: string[];
  };
}

export interface ArchitecturalSpecs {
  templateId: string;
  templateName: string;
  lighting: string;
  lensFocalLength: string;
  cameraSettings: string;
  materialTextures: string;
  composition: string;
}

export interface PromptRefinerResult {
  success: boolean;
  rawPrompt: string;
  refinedEnglishPrompt: string;
  refinedSpanishPrompt: string;
  templateUsed: ArchitecturalTemplate;
  architecturalSpecs: ArchitecturalSpecs;
  parsedProduct: ParsedPromptProductResult;
  interceptionTimestamp: string;
}

/**
 * Catálogo Oficial de Fichas Técnicas por Material - UNITEC USA Design
 * Vincula cada producto con sus beneficios técnicos exactos, dimensiones y certificaciones.
 */
export const UNITEC_PRODUCT_CATALOG: ProductCatalogSpec[] = [
  {
    id: 'wpc_panel_interior',
    sku: 'UNI-WPC-INT24',
    nameES: 'Panel Acanalado WPC Interior',
    nameEN: 'Interior Fluted WPC Louver Wall Panel',
    categoryES: 'Revestimiento Arquitectónico Interior',
    keywords: [
      'panel acanalado', 'paneles acanalados', 'wpc interior', 'listones wpc', 'slat panel',
      'fluted panel', 'revestimiento acanalado', 'muro wpc', 'pared wpc', 'alistonado', 'wpc'
    ],
    technicalBenefits: [
      '100% Resistente a la Humedad y Termitas',
      'Instalación Rápida con Sistema de Clip Oculto',
      'Retardante al Fuego Certificado ASTM Clase-B',
      'Acabado Termolaminado Cero Mantenimiento'
    ],
    dimensionsSpec: '160 × 24 × 2900 mm | Espesor Pared 2.2 mm',
    certificationSpec: 'ASTM E84 Clase-B | Libre de Formaldehído E0',
    applicationZones: 'Salas de doble altura, lobbies corporativos, recámaras y muros focales interiores',
    visualMaterialDNA: 'Architectural vertical fluted WPC louver wall panels with deep precision channels, authentic matte wood-grain embossing, seamless hidden-clip joinery',
    recommendedTemplateId: 'nordic_scandinavian'
  },
  {
    id: 'wpc_cladding_exterior',
    sku: 'UNI-WPC-EXT219',
    nameES: 'Revestimiento Exterior WPC Co-Extrusión',
    nameEN: 'Co-Extruded Exterior WPC Facade Cladding',
    categoryES: 'Fachadas y Exteriores de Alto Desempeño',
    keywords: [
      'wpc exterior', 'co-extrusión', 'coextrusion', 'fachada wpc', 'revestimiento exterior',
      'cladding exterior', 'fachada ventilada', 'exterior cladding', 'sol y lluvia'
    ],
    technicalBenefits: [
      'Escudo Polimérico Co-Extruido 360° Anti-UV',
      'Alta Resistencia a Salinidad y Clima Tropical',
      'Cero Deformación, Putrefacción ni Astillado',
      'Estabilidad Térmica para Fachadas al Exterior'
    ],
    dimensionsSpec: '219 × 26 × 2900 mm | Capa Co-Extruida ASA/HDPE',
    certificationSpec: 'Protección UV 5000h ASTM G154 | Garantía 20 Años',
    applicationZones: 'Fachadas residenciales, edificios comerciales, pérgolas y exteriores costeros',
    visualMaterialDNA: 'Heavy-duty co-extruded exterior WPC architectural facade cladding profiles with deep shadow reveals, weather-shielded matte timber texture',
    recommendedTemplateId: 'minimalist_commercial'
  },
  {
    id: 'spc_click_flooring',
    sku: 'UNI-SPC-CLK65',
    nameES: 'Piso Arquitectónico SPC Click Impermeable',
    nameEN: 'Rigid Core Waterproof SPC Click Flooring',
    categoryES: 'Pisos de Ingeniería de Tráfico Pesado',
    keywords: [
      'piso spc', 'pisos spc', 'spc click', 'spc', 'piso vinilico', 'piso vinílico',
      'stone plastic composite', 'piso impermeable', 'duela spc', 'piso madera'
    ],
    technicalBenefits: [
      'Núcleo Rígido Mineral 100% Impermeable',
      'Capa de Desgaste Comercial 20 mil (0.5 mm)',
      'Base Acústica IXPE Anti-Impacto Integrada',
      'Sistema de Anclaje Click sin Adhesivos'
    ],
    dimensionsSpec: '180 × 1220 × 6.5 mm (5.0 mm SPC + 1.5 mm IXPE)',
    certificationSpec: 'Tráfico Comercial Pesado AC5 | Antideslizante R10',
    applicationZones: 'Oficinas, hoteles, residencias de lujo, cocinas y zonas húmedas',
    visualMaterialDNA: 'Wide-plank architectural rigid-core SPC flooring with synchronized embossed-in-register (EIR) natural oak grain, micro-beveled edges, matte UV coating',
    recommendedTemplateId: 'nordic_scandinavian'
  },
  {
    id: 'uv_marble_sheet',
    sku: 'UNI-UVM-1220',
    nameES: 'Lámina de Mármol UV de Alta Definición',
    nameEN: 'High-Gloss UV Cured PVC Marble Wall Board',
    categoryES: 'Superficies Monolíticas de Lujo',
    keywords: [
      'mármol uv', 'marmol uv', 'lámina uv', 'lamina uv', 'placa uv', 'pvc marmol',
      'pvc mármol', 'calacatta uv', 'efecto mármol', 'tablero uv'
    ],
    technicalBenefits: [
      'Acabado Barniz Curado UV Alto Brillo Espejo',
      '100% Impermeable, Antimoho y Antibacteriano',
      'Formato Gran Escala Ligero y Fácil Corte en Obra',
      'Alta Resistencia al Impacto, Rayado y Manchas'
    ],
    dimensionsSpec: '1220 × 2800 × 3.0 mm | Densidad 2.0 g/cm³',
    certificationSpec: 'ASTM Clase-B Ignífugo | Resistencia Superficial 3H',
    applicationZones: 'Lobbies de hoteles, baños de lujo, muros de TV y recepciones comerciales',
    visualMaterialDNA: 'Large-format bookmatched Calacatta UV-cured PVC marble wall slabs with mirror-like specular gloss finish, delicate grey and gold mineral veining',
    recommendedTemplateId: 'luxury_retail'
  },
  {
    id: 'acoustic_slat_pet',
    sku: 'UNI-ACU-PET21',
    nameES: 'Panel Acústico de Listones con Fieltro PET',
    nameEN: 'Architectural Wood Veneer Acoustic PET Slat Panel',
    categoryES: 'Acondicionamiento Acústico & Diseño',
    keywords: [
      'panel acústico', 'panel acustico', 'acústico', 'acustico', 'fieltro pet',
      'acoustic panel', 'fonoabsorbente', 'aislamiento acústico', 'listones acústicos'
    ],
    technicalBenefits: [
      'Absorción Acústica Certificada NRC 0.85',
      'Base de Fieltro PET Eco-Reciclado de 9 mm',
      'Enchapado en Madera Técnica de Porcelana/Roble',
      'Elimina Eco y Reverberación en Espacios Amplios'
    ],
    dimensionsSpec: '600 × 2400 × 21 mm (Listón 12 mm + PET 9 mm)',
    certificationSpec: 'Certificación Acústica ISO 354 (NRC 0.85)',
    applicationZones: 'Salas de juntas, estudios, restaurantes, auditorios y salas de cine en casa',
    visualMaterialDNA: 'Precision-spaced natural wood veneer slats mounted on dark charcoal sound-absorbing recycled PET acoustic felt backing',
    recommendedTemplateId: 'biophilic_timber'
  },
  {
    id: 'pvc_wallpaper_3d',
    sku: 'UNI-WP-3D53',
    nameES: 'Papel Tapiz Arquitectónico PVC Texturizado 3D',
    nameEN: 'Luxury Heavy-Duty 3D Textured PVC Architectural Wallpaper',
    categoryES: 'Recubrimiento Mural Decorativo',
    keywords: [
      'papel tapiz', 'wallpaper', 'tapiz pvc', 'vinilo mural', 'revestimiento mural',
      'papel colgadura', 'mural 3d', 'tapiz texturizado'
    ],
    technicalBenefits: [
      'Superficie Vinílica Impermeable y Lavable',
      'Relieve Táctil 3D conDetalles Metálicos en Caliente',
      'Polímero Activo Antimoho para Zonas Húmedas',
      'Alta Resistencia a la Tracción y Decoloración UV'
    ],
    dimensionsSpec: 'Rollo 0.53 × 10.0 m (5.3 m²) | Gramaje 380 g/m²',
    certificationSpec: 'ASTM E84 Clase-A Comercial | Libre de Ftalatos',
    applicationZones: 'Suites de hotel, boutiques, comedores residenciales y recepciones',
    visualMaterialDNA: 'Heavy-duty architectural 3D embossed PVC wallpaper with fine linen-weave relief and subtle warm champagne metallic foil accents',
    recommendedTemplateId: 'luxury_retail'
  },
  {
    id: 'wpc_decking_outdoor',
    sku: 'UNI-DCK-140',
    nameES: 'Decking WPC Exterior Antideslizante',
    nameEN: 'Weatherproof Anti-Slip Outdoor WPC Decking Board',
    categoryES: 'Pisos Exteriores & Terrazas',
    keywords: [
      'deck', 'decking', 'piso exterior', 'terraza wpc', 'piscina', 'muelle',
      'madera sintética exterior', 'deck wpc'
    ],
    technicalBenefits: [
      'Superficie Antideslizante Certificada R11 (Seco/Húmedo)',
      'Inmune al Cloro, Humedad, Hongos e Insectos',
      'Alta Capacidad de Carga con Perfil Alveolar Reforzado',
      'Sin Necesidad de Lijado, Sellado ni Aceites'
    ],
    dimensionsSpec: '140 × 25 × 2900 mm | Fijación con Clip de Acero Inox',
    certificationSpec: 'DIN 51130 Clase R11 | Resistencia UV Intemperie',
    applicationZones: 'Terrazas, bordes de piscina, rooftops, muelles y jardines exteriores',
    visualMaterialDNA: 'Outdoor architectural WPC decking boards with fine anti-slip grooved and wire-brushed timber grain surface bordering an infinity reflection pool',
    recommendedTemplateId: 'blue_hour_twilight'
  },
  {
    id: 'pu_stone_panel',
    sku: 'UNI-PU-STN120',
    nameES: 'Piedra Arquitectónica Ultraligera PU Stone',
    nameEN: 'Ultra-Light Architectural Polyurethane Split-Face Stone Panel',
    categoryES: 'Revestimiento Pétreo Ligero',
    keywords: [
      'piedra pu', 'pu stone', 'piedra flexible', 'piedra sintética', 'panel de piedra',
      'laja', 'piedra pizarra', 'roca arquitectónica', 'piedra volcánica'
    ],
    technicalBenefits: [
      'Textura Mineral Hiperrealista Ultraligera (4 kg/m²)',
      'Instalación Directa sin Sobrecarga Estructural',
      'Aislamiento Térmico, Acústico y 100% Impermeable',
      'Resistencia a Intemperie y Rayos UV (Interior/Exterior)'
    ],
    dimensionsSpec: '600 × 1200 × 35 mm | Poliuretano de Alta Densidad',
    certificationSpec: 'Retardante al Fuego Clase B1 | Impermeable IP68',
    applicationZones: 'Muros de doble altura, fachadas comerciales, chimeneas y jardines verticales',
    visualMaterialDNA: 'Chiseled split-face architectural PU stone panels with deep mineral relief, authentic natural slate stratification, dramatic raking shadow texture',
    recommendedTemplateId: 'brutalist_concrete'
  }
];

/**
 * Library of Professional Architectural Photography Templates
 */
export const ARCHITECTURAL_TEMPLATES: ArchitecturalTemplate[] = [
  {
    id: 'minimalist_commercial',
    name: 'Modern Minimalist & Commercial Pavilion',
    category: 'minimalist',
    badge: 'Comercial & Minimalista',
    description: 'Líneas puras, planos ortogonales, hormigón visto pulido y acristalamiento estructural con iluminación neutra difusa.',
    lighting: 'Soft diffused overcast skylight at 5600K color temperature, minimal hard shadow falloff, subtle linear LED cove illumination accentuating architectural reveals.',
    lensFocalLength: 'Canon TS-E 24mm f/3.5L II tilt-shift lens, strict perspective correction, perfectly vertical parallel lines with zero converging keystoning.',
    cameraSettings: 'Phase One IQ4 150MP medium format back, f/8 aperture for edge-to-edge optical resolution, ISO 64, tripod mounted.',
    materialTextures: 'Smooth cast-in-place board-formed concrete with tactile grain imprints, ultra-clear low-iron Starphire curtain wall glass, matte black anodized architectural aluminum mullions.',
    composition: 'Axial one-point central perspective with disciplined geometric symmetry, balanced negative space, and strict 1080x1350 central safe-zone framing.',
    atmosphere: 'Ultra-clean architectural monograph standard, museum-grade calm, dust-free reflections, balanced exposure dynamic range.',
    sampleKeywords: ['architectural photography', 'tilt-shift 24mm', 'board-formed concrete', 'low-iron glass', 'overcast soft light', 'Phase One 150MP']
  },
  {
    id: 'luxury_retail',
    name: 'Luxury High-End Flagship Showroom',
    category: 'luxury_retail',
    badge: 'Showroom de Lujo & Retail',
    description: 'Espacios de exhibición comercial premium, plintos iluminados, mármoles nobles y latón cepillado.',
    lighting: 'Museum-grade 98+ CRI directional track spotlights with tight 15° beam angles, backlit translucent white onyx plinths, soft warm 3000K floor wash reflections.',
    lensFocalLength: 'Schneider Kreuznach 45mm f/4 tilt-shift on technical camera, subtle product separation while maintaining crisp architectural enclosure depth.',
    cameraSettings: 'Hasselblad H6D-100c medium format, f/5.6 aperture, calibrated color science, razor-sharp focus on primary product display.',
    materialTextures: 'Bookmatched honed Calacatta marble panels with delicate grey-gold veins, satin brushed champagne brass fixtures, fluted smoked oak wall cladding, microcement seamless floor.',
    composition: 'Rule of thirds composition centering hero material within the 1080x1350 px central safe zone, layered depth of field framing the focal point.',
    atmosphere: 'High-end commercial luxury editorial, pristine specular highlights, tactile sense of craftsmanship and wealth.',
    sampleKeywords: ['luxury showroom', 'bookmatched Calacatta marble', 'brushed brass', 'track lighting 98 CRI', 'Hasselblad medium format']
  },
  {
    id: 'brutalist_concrete',
    name: 'Brutalist Raw Concrete & Monumental Massing',
    category: 'brutalist',
    badge: 'Brutalismo & Hormigón Visto',
    description: 'Masas volumétricas escultóricas, hormigón martillado rugoso y sombras geométricas profundas con sol rasante.',
    lighting: 'High-contrast directional golden hour sun at a low 18° raking angle, casting deep geometric chiseled shadows across volumetric recesses and cantilevered planes.',
    lensFocalLength: 'Canon TS-E 17mm f/4L ultra-wide tilt-shift lens, corrected perspective emphasizing monumental vertical scale and structural weight.',
    cameraSettings: 'Large format digital system, f/11 hyperfocal aperture sharpness from 1 meter to infinity, deep shadow detail retention.',
    materialTextures: 'Heavy bush-hammered rough-cast concrete with exposed aggregate pebbles, weathered corten steel accent louvers, dark charcoal tinted acoustic glass.',
    composition: 'Dynamic two-point perspective highlighting dramatic cantilevered overhangs, with key material surface positioned in the central 1080x1350 px safe area.',
    atmosphere: 'Monumental architectural monograph, dramatic chiaroscuro contrast, tactile mineral authenticity.',
    sampleKeywords: ['brutalist architecture', 'bush-hammered concrete', 'raking sunlight', 'volumetric shadows', '17mm tilt-shift']
  },
  {
    id: 'biophilic_timber',
    name: 'Biophilic & Sustainable Timber Architecture',
    category: 'sustainable',
    badge: 'Bioclimático & Madera Sostenible',
    description: 'Estructuras de madera laminada cruzada (CLT), muros vegetales vivos, luz solar tamizada y tierra compactada.',
    lighting: 'Dappled natural sunlight filtered through lush botanical leaves, warm ambient golden bounces off natural spruce wood surfaces (3500K spectrum).',
    lensFocalLength: 'Leica Summilux 35mm f/1.4 architectural prime stopped down to f/5.6, organic perspective preserving intimate human scale within nature.',
    cameraSettings: 'Full-frame medium format sensor, wide dynamic range retaining highlights on foliage and deep organic wood grain shadows.',
    materialTextures: 'Cross-laminated timber (CLT) structural beams with visible annual growth rings, living green wall with cascading ferns and moss, hand-rammed earth walls, river-stone terrazzo.',
    composition: 'Fluid indoor-outdoor threshold composition, keeping main material installation centered within the 1080x1350 px safe frame.',
    atmosphere: 'Serene bioclimatic retreat, fresh oxygenated atmosphere, warm tactile natural serenity.',
    sampleKeywords: ['biophilic design', 'CLT mass timber', 'rammed earth', 'dappled sunlight', 'indoor garden', 'sustainable architecture']
  },
  {
    id: 'blue_hour_twilight',
    name: 'Blue Hour Twilight & Architectural Illumination',
    category: 'twilight',
    badge: 'Hora Azul & Iluminación Nocturna',
    description: 'Contraste entre el cielo cobalto del crepúsculo y los cálidos interiores de 2700K reflejados en estanques de agua.',
    lighting: 'Precise blue hour twilight balance: deep cobalt indigo sky exterior harmoniously matched with warm 2700K interior glows, grazing facade uplights, and submerged pool luminaires.',
    lensFocalLength: 'Nikon PC NIKKOR 19mm f/4E ED tilt-shift lens, wide architectural perspective with completely straight vertical reveals and crisp corners.',
    cameraSettings: 'Tripod long exposure (4 seconds, ISO 64, f/8), optical image stabilization off, mirror lockup for vibration-free pin-sharp details.',
    materialTextures: 'Water reflection pond with glassy mirror surface, polished black basalt paving stones, ultra-clear low-iron glass walls revealing luminous interior rooms.',
    composition: 'Two-point exterior perspective capturing both the illuminated building volume and its reflection within the central 1080x1350 px safe zone.',
    atmosphere: 'Cinematic twilight elegance, peaceful dusk tranquility, glowing architectural lantern effect.',
    sampleKeywords: ['blue hour architecture', 'twilight lighting', 'reflection pool', 'tilt-shift 19mm', '2700K warm interior glow']
  },
  {
    id: 'nordic_scandinavian',
    name: 'Nordic Scandinavian Light & Tactile Interiors',
    category: 'interior',
    badge: 'Escandinavo & Luz Natural',
    description: 'Espacios luminosos, maderas claras de fresno y abedul, tonos crema y luz difusa del norte.',
    lighting: 'Soft, diffused indirect northern daylight flooding through floor-to-ceiling windows, subtle warm 2700K floor lamp accents creating hygge warmth.',
    lensFocalLength: 'Hasselblad XCD 28mm f/4 P lens, natural wide perspective with zero optical distortion and pristine corner sharpness.',
    cameraSettings: 'Hasselblad X2D 100C medium format with 16-bit color depth, dynamic range capturing subtle tonalities in white-on-white surfaces.',
    materialTextures: 'Light white-oiled Nordic ash flooring, pale birch acoustic slat wall panels, matte off-white lime-wash plaster walls, tactile bouclé upholstery, raw ceramic pottery.',
    composition: 'Asymmetric harmonious balance, framing the primary wall/floor cladding inside the 1080x1350 px central safe zone.',
    atmosphere: 'Airy, peaceful Nordic warmth, clean minimalist aesthetic without feeling sterile.',
    sampleKeywords: ['nordic architecture', 'scandinavian interior', 'white-oiled ash', 'lime plaster', 'diffused daylight', 'Hasselblad 100C']
  },
  {
    id: 'parametric_sculptural',
    name: 'Parametric & Sculptural Contemporary Pavilion',
    category: 'parametric',
    badge: 'Paramétrico & Futurista',
    description: 'Curvaturas orgánicas complejas, superficies fluidas de polímero reforzado y luces LED lineales empotradas.',
    lighting: 'Concealed linear LED grazing channels tracing dynamic double-curved ribs, soft indirect ceiling uplight revealing complex sculptural geometry.',
    lensFocalLength: 'Sony FE 24mm f/1.4 GM stopped to f/8, ultra-sharp resolution resolving intricate tessellated facade panels and continuous fluid lines.',
    cameraSettings: 'High-resolution full frame sensor, ISO 100, f/8, edge-to-edge optical clarity across multi-layered curved surfaces.',
    materialTextures: 'Double-curved fiber-reinforced polymer (FRP) with pearl satin finish, tessellated iridescent titanium shingles, seamless high-gloss poured resin floor.',
    composition: 'Sweeping diagonal composition guiding the viewer along structural ribbon curves inside the central 1080x1350 px safe area.',
    atmosphere: 'Avant-garde architectural exhibition, futuristic elegance, fluid spatial choreography.',
    sampleKeywords: ['parametric architecture', 'sculptural pavilion', 'double-curved surfaces', 'concealed LED channels', 'fluid geometry']
  },
  {
    id: 'macro_material_vignette',
    name: 'Architectural Macro Texture & Craft Joinery',
    category: 'macro_detail',
    badge: 'Macro Texturas & Detalles Constructivos',
    description: 'Primer plano táctil de juntas constructivas, vetas de piedra natural, madera cepillada y encuentros de materiales.',
    lighting: 'Directional raking macro light at a 15° angle across surface reliefs, highlighting micro-textures, tooth, chisel marks, and subtle surface depth.',
    lensFocalLength: 'Canon TS-E 90mm f/2.8L Macro tilt-shift lens, Scheimpflug plane adjustment aligning focus along the material junction plane.',
    cameraSettings: 'Medium format 100MP back, f/5.6 aperture, razor-thin focal transition from pin-sharp tactile micro-relief into silky architectural blur.',
    materialTextures: 'Hand-chiseled split-face limestone, porous volcanic basalt stone, wire-brushed charred Shou Sugi Ban cedar, raw blackened steel reveal joint.',
    composition: 'Intimate architectural detail vignette centered in the 1080x1350 px safe area.',
    atmosphere: 'Artisanal architectural monograph, tactile tangible materiality, supreme craftsmanship.',
    sampleKeywords: ['architectural detail', 'macro texture', '90mm tilt-shift', 'Shou Sugi Ban', 'split-face limestone', 'material junction']
  }
];

export class PromptRefinerService {
  /**
   * 1. PARSER AUTOMÁTICO DE PRODUCTO Y FICHA TÉCNICA (Independiente de otros módulos)
   * Detecta automáticamente el nombre del material/producto desde el prompt del usuario,
   * limpia cualquier placeholder residual y vincula la Ficha Técnica exacta del catálogo.
   */
  public parseProductAndSpecsFromPrompt(
    rawPrompt: string,
    explicitProductCatalogId?: string,
    customOverrides?: PromptRefinerRequest['customOverrides']
  ): ParsedPromptProductResult {
    // Clean any bracketed template placeholders like [Describe tu producto aquí...]
    const cleanedPrompt = (rawPrompt || '')
      .replace(/\[[^\]]*describe[^\]]*\]/gi, '')
      .replace(/\[[^\]]*inserta[^\]]*\]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    const lower = cleanedPrompt.toLowerCase();

    // 1. Check explicit catalog selection first
    let matchedCatalog = explicitProductCatalogId && explicitProductCatalogId !== 'auto'
      ? UNITEC_PRODUCT_CATALOG.find(item => item.id === explicitProductCatalogId)
      : undefined;

    let isExactCatalogMatch = !!matchedCatalog;

    // 2. Automatic keyword detection from the prompt text
    if (!matchedCatalog) {
      let bestScore = 0;
      for (const item of UNITEC_PRODUCT_CATALOG) {
        let score = 0;
        for (const kw of item.keywords) {
          if (lower.includes(kw.toLowerCase())) {
            // Longer multi-word keywords get higher weight
            score += kw.includes(' ') ? 3 : 1;
          }
        }
        if (score > bestScore) {
          bestScore = score;
          matchedCatalog = item;
          isExactCatalogMatch = true;
        }
      }
    }

    // 3. Secondary heuristic match if general architectural terms are used
    if (!matchedCatalog) {
      if (lower.includes('mármol') || lower.includes('marmol') || lower.includes('calacatta') || lower.includes('ónix') || lower.includes('onix')) {
        matchedCatalog = UNITEC_PRODUCT_CATALOG.find(i => i.id === 'uv_marble_sheet')!;
        isExactCatalogMatch = true;
      } else if (lower.includes('piso') || lower.includes('suelo') || lower.includes('floor') || lower.includes('duela') || lower.includes('roble')) {
        matchedCatalog = UNITEC_PRODUCT_CATALOG.find(i => i.id === 'spc_click_flooring')!;
        isExactCatalogMatch = true;
      } else if (lower.includes('fachada') || lower.includes('exterior') || lower.includes('outdoor')) {
        matchedCatalog = UNITEC_PRODUCT_CATALOG.find(i => i.id === 'wpc_cladding_exterior')!;
        isExactCatalogMatch = true;
      } else if (lower.includes('terraza') || lower.includes('alberca') || lower.includes('piscina') || lower.includes('jardín')) {
        matchedCatalog = UNITEC_PRODUCT_CATALOG.find(i => i.id === 'wpc_decking_outdoor')!;
        isExactCatalogMatch = true;
      } else if (lower.includes('piedra') || lower.includes('roca') || lower.includes('laja') || lower.includes('hormigón') || lower.includes('concreto')) {
        matchedCatalog = UNITEC_PRODUCT_CATALOG.find(i => i.id === 'pu_stone_panel')!;
        isExactCatalogMatch = true;
      } else if (lower.includes('acústic') || lower.includes('acustic') || lower.includes('oficina') || lower.includes('estudio')) {
        matchedCatalog = UNITEC_PRODUCT_CATALOG.find(i => i.id === 'acoustic_slat_pet')!;
        isExactCatalogMatch = true;
      } else if (lower.includes('tapiz') || lower.includes('wallpaper') || lower.includes('mural')) {
        matchedCatalog = UNITEC_PRODUCT_CATALOG.find(i => i.id === 'pvc_wallpaper_3d')!;
        isExactCatalogMatch = true;
      } else {
        // Default signature UNITEC product
        matchedCatalog = UNITEC_PRODUCT_CATALOG[0]; // Panel Acanalado WPC Interior
      }
    }

    // 4. Detect specific finish, tone, or color qualifier in the user's prompt
    const finishPatterns = [
      /(?:color|tono|acabado|madera|mármol|marmol|textura)\s+([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+){0,2})/i,
      /\b(nogal(?:\s+oscuro|\s+claro)?|roble(?:\s+natural|\s+ahumado|\s+blanco)?|teca|cedro|fresno|calacatta(?:\s+oro|\s+gold)?|carrara|negro\s+marquina|gris\s+grafito|antracita|charcoal|champagne|dorado|blanco\s+mate|travertino|basalto)\b/i
    ];

    let detectedFinishOrColor = '';
    for (const regex of finishPatterns) {
      const m = cleanedPrompt.match(regex);
      if (m && m[1]) {
        const candidate = m[1].trim();
        // Avoid generic stop words
        if (!['de', 'en', 'con', 'para', 'el', 'la', 'los', 'las', 'un', 'una', 'alta', 'gama', 'lujo'].includes(candidate.toLowerCase())) {
          detectedFinishOrColor = candidate.replace(/\b\w/g, c => c.toUpperCase());
          break;
        }
      }
    }

    // 5. Extract custom product title if user wrote a very specific product not in standard keywords,
    // or enrich the catalog product name with the detected finish!
    let autoProductNameES = matchedCatalog.nameES;
    if (customOverrides?.productTitle && customOverrides.productTitle.trim()) {
      autoProductNameES = customOverrides.productTitle.trim();
    } else if (!isExactCatalogMatch && cleanedPrompt.length > 3) {
      // Extract the leading noun phrase from the prompt if it's a custom product
      const firstClause = cleanedPrompt
        .split(/[.,;:\n]|(?:\s+en\s+un|\s+sobre\s+|\s+ubicad|\s+con\s+iluminaci|\s+capturad)/i)[0]
        .replace(/^(fotografía|imagen|render|toma|primer plano|vista)\s+(comercial|arquitectónica|publicitaria|de|del|en)?\s*/i, '')
        .trim();
      if (firstClause.length >= 4 && firstClause.length <= 52) {
        autoProductNameES = firstClause.charAt(0).toUpperCase() + firstClause.slice(1);
      } else if (detectedFinishOrColor) {
        autoProductNameES = `${matchedCatalog.nameES} · ${detectedFinishOrColor}`;
      }
    } else if (detectedFinishOrColor && !autoProductNameES.toLowerCase().includes(detectedFinishOrColor.toLowerCase())) {
      autoProductNameES = `${matchedCatalog.nameES} · ${detectedFinishOrColor}`;
    }

    const effectiveBenefits = (customOverrides?.technicalBenefits && customOverrides.technicalBenefits.length > 0)
      ? customOverrides.technicalBenefits
      : matchedCatalog.technicalBenefits;

    const finalSubject = cleanedPrompt.length > 0
      ? `${autoProductNameES} (${matchedCatalog.nameEN}) — ${cleanedPrompt}`
      : `${autoProductNameES} (${matchedCatalog.nameEN}) en espacio arquitectónico de lujo`;

    return {
      detectedProductNameES: autoProductNameES,
      detectedProductNameEN: matchedCatalog.nameEN,
      cleanedPromptSubject: finalSubject,
      catalogMatch: matchedCatalog,
      isExactCatalogMatch,
      detectedFinishOrColor,
      technicalBenefits: effectiveBenefits,
      dimensionsSpec: matchedCatalog.dimensionsSpec,
      certificationSpec: matchedCatalog.certificationSpec,
      sku: matchedCatalog.sku,
      safeZoneSpec: SAFE_ZONE_1080X1920_SPEC
    };
  }

  /**
   * Intelligently selects the best architectural template based on keywords in user prompt or matched product
   */
  public detectBestTemplate(rawPrompt: string, style?: string, productCatalogId?: string): ArchitecturalTemplate {
    const parsed = this.parseProductAndSpecsFromPrompt(rawPrompt, productCatalogId);
    const text = `${rawPrompt} ${style || ''}`.toLowerCase();

    if (text.includes('brutal') || text.includes('hormigón') || text.includes('concreto visto') || text.includes('monument')) {
      return ARCHITECTURAL_TEMPLATES.find(t => t.id === 'brutalist_concrete')!;
    }
    if (text.includes('madera') || text.includes('timber') || text.includes('vegetal') || text.includes('verde') || text.includes('bioclim') || text.includes('eco') || text.includes('sostenib')) {
      return ARCHITECTURAL_TEMPLATES.find(t => t.id === 'biophilic_timber')!;
    }
    if (text.includes('noche') || text.includes('night') || text.includes('crepúsculo') || text.includes('twilight') || text.includes('azul') || text.includes('blue hour') || text.includes('estanque') || text.includes('reflejo')) {
      return ARCHITECTURAL_TEMPLATES.find(t => t.id === 'blue_hour_twilight')!;
    }
    if (text.includes('showroom') || text.includes('tienda') || text.includes('retail') || text.includes('joyer') || text.includes('perfume') || text.includes('lujo') || text.includes('luxury') || text.includes('mármol')) {
      return ARCHITECTURAL_TEMPLATES.find(t => t.id === 'luxury_retail')!;
    }
    if (text.includes('nórdic') || text.includes('escandinav') || text.includes('interior') || text.includes('casa') || text.includes('living') || text.includes('hogar') || text.includes('fresno')) {
      return ARCHITECTURAL_TEMPLATES.find(t => t.id === 'nordic_scandinavian')!;
    }
    if (text.includes('curva') || text.includes('paramétr') || text.includes('futur') || text.includes('pabellón') || text.includes('zaha') || text.includes('escultór')) {
      return ARCHITECTURAL_TEMPLATES.find(t => t.id === 'parametric_sculptural')!;
    }
    if (text.includes('textura') || text.includes('macro') || text.includes('detalle') || text.includes('junta') || text.includes('acabado') || text.includes('cercano') || text.includes('relieve')) {
      return ARCHITECTURAL_TEMPLATES.find(t => t.id === 'macro_material_vignette')!;
    }

    // Use catalog product's recommended template if matched
    if (parsed.catalogMatch?.recommendedTemplateId) {
      const rec = ARCHITECTURAL_TEMPLATES.find(t => t.id === parsed.catalogMatch.recommendedTemplateId);
      if (rec) return rec;
    }

    return ARCHITECTURAL_TEMPLATES.find(t => t.id === 'minimalist_commercial')!;
  }

  public getTemplates(): ArchitecturalTemplate[] {
    return ARCHITECTURAL_TEMPLATES;
  }

  public getCatalog(): ProductCatalogSpec[] {
    return UNITEC_PRODUCT_CATALOG;
  }

  public getTemplateById(id: string): ArchitecturalTemplate | undefined {
    return ARCHITECTURAL_TEMPLATES.find(t => t.id === id);
  }

  /**
   * Intercepts a raw visual prompt, automatically detects the product & technical datasheet,
   * enforces the 1080x1920 (central 1080x1350 safe zone) composition rules, and enriches with architectural optics.
   */
  public async refinePromptWithArchitecturalTemplates(
    request: PromptRefinerRequest,
    aiClient?: GoogleGenAI
  ): Promise<PromptRefinerResult> {
    const {
      rawPrompt,
      templateId,
      productCatalogId,
      aspectRatio = '9:16',
      style = 'Comercial & Producto 8K',
      referenceImage,
      referenceEmailText = '',
      customOverrides
    } = request;

    // 1. Automatic Product Detection & Ficha Técnica Linking
    const parsedProduct = this.parseProductAndSpecsFromPrompt(rawPrompt, productCatalogId, customOverrides);

    // 2. Resolve architectural photography template
    let template = templateId && templateId !== 'auto' ? this.getTemplateById(templateId) : undefined;
    if (!template) {
      template = this.detectBestTemplate(rawPrompt, style, productCatalogId);
    }

    // Combine catalog material DNA with template textures
    const combinedMaterialTextures = customOverrides?.materialTextures
      || `${parsedProduct.catalogMatch.visualMaterialDNA}. Surrounding architectural finishes: ${template.materialTextures}`;

    const effectiveLighting = customOverrides?.lighting || template.lighting;
    const effectiveLens = customOverrides?.lensFocalLength || template.lensFocalLength;

    const architecturalSpecs: ArchitecturalSpecs = {
      templateId: template.id,
      templateName: template.name,
      lighting: effectiveLighting,
      lensFocalLength: effectiveLens,
      cameraSettings: template.cameraSettings,
      materialTextures: combinedMaterialTextures,
      composition: `1080x1920 px vertical master frame with all primary product geometry strictly centered inside the 1080x1350 px central safe zone (top 285px and bottom 285px reserved as clean negative space). ${template.composition}`
    };

    const safeZonePromptDirective = `STRICT SAFE ZONE & LAYOUT COMPOSITION (1080x1920 px Canvas -> 1080x1350 px Central Safe Zone): Frame the primary architectural material (${parsedProduct.detectedProductNameEN}) inside the central 1080x1350 px safe area. Leave subtle, uncluttered architectural negative space in the upper 285px and lower 285px margins so brand logos, product titles, and technical specification cards never overlap or clip key product details. Do NOT render any text, watermarks, or deformed typography inside the image pixels.`;

    // 3. Try AI-powered synthesis using Gemini
    if (aiClient) {
      try {
        const parts: any[] = [];

        if (referenceImage && typeof referenceImage === 'string') {
          let mimeType = 'image/png';
          let base64Data = referenceImage;
          if (referenceImage.includes(';base64,')) {
            const splitData = referenceImage.split(';base64,');
            mimeType = splitData[0].replace('data:', '') || 'image/png';
            base64Data = splitData[1];
          }
          parts.push({
            inlineData: {
              data: base64Data,
              mimeType
            }
          });
        }

        const systemInstruction = `You are a Principal Architectural Photographer and Visual Director for UNITEC USA Design (featured in Architectural Digest, Dezeen, and Domus).
Your task is to synthesize a unified, production-ready diffusion prompt that integrates:
1. AUTOMATICALLY DETECTED PRODUCT: "${parsedProduct.detectedProductNameES}" (${parsedProduct.detectedProductNameEN} - SKU: ${parsedProduct.sku})
2. TECHNICAL DATASHEET ATTRIBUTES (FICHA TÉCNICA):
   - Benefits to visually reflect in material quality: ${parsedProduct.technicalBenefits.join(' | ')}
   - Dimensions & Normative: ${parsedProduct.dimensionsSpec} (${parsedProduct.certificationSpec})
   - Material Physical DNA: ${parsedProduct.catalogMatch.visualMaterialDNA}
3. ARCHITECTURAL PHOTOGRAPHY OPTICS:
   - Template: "${template.name}"
   - Lighting: "${effectiveLighting}"
   - Lens & Camera: "${effectiveLens}" (${template.cameraSettings})
4. SAFE ZONE COMPOSITION (1080x1920 px with 1080x1350 px Central Safe Zone):
   - ${safeZonePromptDirective}
   - Target Aspect Ratio: "${aspectRatio}"

OUTPUT JSON FORMAT ONLY:
{
  "masterEnglish": "A single pristine English diffusion prompt (110-150 words) explicitly naming the detected material (${parsedProduct.detectedProductNameEN}), its physical surface properties from the technical datasheet, exact lens/lighting specs, and the 1080x1350 central safe-zone framing with zero text in pixels.",
  "enhancedSpanish": "Resumen ejecutivo en español confirmando el producto detectado (${parsedProduct.detectedProductNameES}), los beneficios vinculados de su ficha técnica y la composición en zona segura central de 1080x1350 px."
}`;

        parts.push({
          text: `Synthesize unified architectural prompt for: "${parsedProduct.cleanedPromptSubject}".`
        });

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts },
          config: {
            systemInstruction,
            responseMimeType: 'application/json'
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (parsed.masterEnglish) {
            return {
              success: true,
              rawPrompt,
              refinedEnglishPrompt: `${parsed.masterEnglish.trim()} No text, no watermarks, no deformed letters in image.`,
              refinedSpanishPrompt: parsed.enhancedSpanish?.trim() || `Producto detectado: ${parsedProduct.detectedProductNameES} (${parsedProduct.sku}). Ficha técnica vinculada con zona segura central 1080×1350 px.`,
              templateUsed: template,
              architecturalSpecs,
              parsedProduct,
              interceptionTimestamp: new Date().toISOString()
            };
          }
        }
      } catch (err: any) {
        console.warn('PromptRefiner AI synthesis fallback:', err?.message || err);
      }
    }

    // 4. High-Quality Deterministic Unified Synthesis
    const masterEnglishFallback = `Professional architectural monograph photograph showcasing UNITEC ${parsedProduct.detectedProductNameEN} (${parsedProduct.detectedProductNameES}). Scene context: ${parsedProduct.cleanedPromptSubject}. Material DNA & Technical Datasheet Fidelity: ${parsedProduct.catalogMatch.visualMaterialDNA}, engineered for ${parsedProduct.technicalBenefits.join(', ')}. Captured with ${effectiveLens}, ${template.cameraSettings}. Lighting: ${effectiveLighting}. ${safeZonePromptDirective} 8k resolution, razor-sharp edge contrast, true architectural perspective, zero text or watermarks in pixels.`;

    const spanishExplanation = `Producto detectado automáticamente: ${parsedProduct.detectedProductNameES} (${parsedProduct.sku}). Ficha técnica vinculada: ${parsedProduct.technicalBenefits.join(' · ')}. Composición fijada en lienzo 1080×1920 px con área segura central de 1080×1350 px.`;

    return {
      success: true,
      rawPrompt,
      refinedEnglishPrompt: masterEnglishFallback,
      refinedSpanishPrompt: spanishExplanation,
      templateUsed: template,
      architecturalSpecs,
      parsedProduct,
      interceptionTimestamp: new Date().toISOString()
    };
  }

  /**
   * Builds an instant deterministic architectural prompt using template specifications and auto-detected product.
   */
  public buildDeterministicPrompt(template: ArchitecturalTemplate, rawPrompt: string, productCatalogId?: string): string {
    const parsed = this.parseProductAndSpecsFromPrompt(rawPrompt, productCatalogId);
    return `Fotografía arquitectónica comercial de ${parsed.detectedProductNameES} (${parsed.sku}) en ${parsed.catalogMatch.applicationZones.split(',')[0]}. Material: ${parsed.catalogMatch.visualMaterialDNA}. Beneficios de ficha técnica: ${parsed.technicalBenefits.slice(0, 3).join(', ')}. Óptica: ${template.lensFocalLength}. Iluminación: ${template.lighting}. Composición: Lienzo 1080x1920 px con sujeto e información dentro del área segura central de 1080x1350 px.`;
  }
}

export const promptRefiner = new PromptRefinerService();
