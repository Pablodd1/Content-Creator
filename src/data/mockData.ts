/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MonthData, MarketPulseData } from '../types';

export const NICHES = [
  { id: 'wallpaper-trends', labelEN: 'Wallpaper & Cladding Trends', labelES: 'Tendencias de Revestimiento' },
  { id: 'construction-tech', labelEN: 'Construction Techniques', labelES: 'Técnicas de Construcción' },
  { id: 'design-inspiration', labelEN: 'Design Inspiration', labelES: 'Inspiración de Diseño' },
  { id: 'material-science', labelEN: 'Material Science', labelES: 'Ciencia de Materiales' },
  { id: 'sustainability', labelEN: 'Sustainability & Eco-Commitment', labelES: 'Sostenibilidad y Eco-Compromiso' },
  { id: 'logistics-wholesale', labelEN: 'Logistics & Wholesaling', labelES: 'Logística y Venta al por Mayor' },
  { id: 'architecture-spotlight', labelEN: 'Architecture Spotlight', labelES: 'Foco en Arquitectura' },
  { id: 'interior-trends', labelEN: 'Interior Material Trends', labelES: 'Tendencias sobre Interiores' }
];

export const MONTH_THEME_TEMPLATES = [
  {
    monthIndex: 0,
    themeEN: "New Year, New Spaces",
    themeES: "Nuevo Año, Nuevos Espacios",
    niche: "renovation-planning"
  },
  {
    monthIndex: 1,
    themeEN: "Sustainable Love",
    themeES: "Amor Sostenible",
    niche: "sustainability"
  },
  {
    monthIndex: 2,
    themeEN: "Spring Transformations",
    themeES: "Transformaciones de Primavera",
    niche: "design-inspiration"
  },
  {
    monthIndex: 3,
    themeEN: "Waterproof Wonder",
    themeES: "Maravilla Impermeable",
    niche: "material-science"
  },
  {
    monthIndex: 4,
    themeEN: "Design Freedom",
    themeES: "Libertad de Diseño",
    niche: "wallpaper-trends"
  },
  {
    monthIndex: 5,
    themeEN: "Summer Durability",
    themeES: "Durabilidad Veraniega",
    niche: "construction-tech"
  },
  {
    monthIndex: 6,
    themeEN: "Container Intelligence",
    themeES: "Inteligencia de Contenedor",
    niche: "logistics-wholesale"
  },
  {
    monthIndex: 7,
    themeEN: "Back to Structure",
    themeES: "Regreso a la Estructura",
    niche: "architecture-spotlight"
  },
  {
    monthIndex: 8,
    themeEN: "Hurricane Ready",
    themeES: "Listo para Huracanes",
    niche: "material-science"
  },
  {
    monthIndex: 9,
    themeEN: "Warm Interiors",
    themeES: "Interiores Cálidos",
    niche: "interior-trends"
  },
  {
    monthIndex: 10,
    themeEN: "Gratitude for Quality",
    themeES: "Gratitud por la Calidad",
    niche: "sustainability"
  },
  {
    monthIndex: 11,
    themeEN: "Vision 2027",
    themeES: "Visión 2027",
    niche: "design-inspiration"
  }
];

export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const MONTH_NAMES = [
  { en: "January", es: "Enero" },
  { en: "February", es: "Febrero" },
  { en: "March", es: "Marzo" },
  { en: "April", es: "Abril" },
  { en: "May", es: "Mayo" },
  { en: "June", es: "Junio" },
  { en: "July", es: "Julio" },
  { en: "August", es: "Agosto" },
  { en: "September", es: "Septiembre" },
  { en: "October", es: "Octubre" },
  { en: "November", es: "Noviembre" },
  { en: "December", es: "Diciembre" }
];

export const DAY_WEEK_PSYCHOLOGY = [
  {
    dayNum: 0, // Sunday
    labelEN: "Planning & Tips",
    labelES: "Planificación y Consejos",
    themeEN: "Prep for the week, structural checklists, project timelines",
    themeES: "Previa de la semana, listas estructurales, cronogramas de proyectos"
  },
  {
    dayNum: 1, // Monday
    labelEN: "Motivational Education",
    labelES: "Educativo Motivacional",
    themeEN: "Start your project right, design philosophy, leadership tips",
    themeES: "Comience bien su proyecto, filosofía de diseño, consejos de liderazgo"
  },
  {
    dayNum: 2, // Tuesday
    labelEN: "Product Spotlight",
    labelES: "Presentación de Producto",
    themeEN: "Material of the week, unique benefits, high specifications",
    themeES: "Material de la semana, beneficios únicos, especificaciones técnicas"
  },
  {
    dayNum: 3, // Wednesday
    labelEN: "Design Inspiration",
    labelES: "Inspiración del Diseñador",
    themeEN: "Designer spotlight, styling accents, luxury mood board",
    themeES: "Foco en diseñadores, acentos de estilo, tablero de inspiración de lujo"
  },
  {
    dayNum: 4, // Thursday
    labelEN: "Thought Leadership",
    labelES: "Liderazgo de Pensamiento",
    themeEN: "Sustainability, compliance, architecture certifications",
    themeES: "Sostenibilidad, normativas, certificaciones arquitectónicas"
  },
  {
    dayNum: 5, // Friday
    labelEN: "Social Proof & Success Stories",
    labelES: "Prueba Social y Casos de Éxito",
    themeEN: "Container load logistics, architects success story, global exports",
    themeES: "Logística de carga total, historias de éxito de arquitectos, exportación global"
  },
  {
    dayNum: 6, // Saturday
    labelEN: "Aspirational Luxury Lifestyle",
    labelES: "Estilo de Vida y Aspiracional",
    themeEN: "Penthouse tours, dream spaces, tropical resort designs",
    themeES: "Tours por áticos, espacios de ensueño, diseños de resorts tropicales"
  }
];

export const MOCK_TRENDS: Record<number, MarketPulseData[]> = {
  0: [ // Jan
    {
      trendingTopic: "Biophilic Coexistence",
      architectsSearch: "composite walnut acoustic paneling",
      miamiInsight: "Miami luxury condos shifting to zero-maintenance eco-claddings before Spring rush."
    },
    {
      trendingTopic: "Prefab Office Expansion",
      architectsSearch: "fast-locking SPC click tiles",
      miamiInsight: "Downtown office renovations prioritize quick-install acoustic PVC walls."
    }
  ],
  1: [ // Feb
    {
      trendingTopic: "LEED Platinum Accents",
      architectsSearch: "100% recyclable composite fluted panels",
      miamiInsight: "Green building initiatives in Brickell specify carbon-neutral exterior wall surfaces."
    }
  ],
  2: [ // Mar
    {
      trendingTopic: "Al Fresco Transition",
      architectsSearch: "UV-stable WPC outdoor decking",
      miamiInsight: "Biscayne Bay restaurant patios installing salt-resistant composite lumber to avoid wood rot."
    }
  ],
  3: [ // Apr
    {
      trendingTopic: "Subtropical Wet-Shielding",
      architectsSearch: "waterproof PVC bathroom wainscoting",
      miamiInsight: "Coconut Grove residential architects replacing mold-prone sheetrock with PVC panel profiles."
    }
  ],
  4: [ // May
    {
      trendingTopic: "Textured Feature Panels",
      architectsSearch: "gilded edge charcoal panels",
      miamiInsight: "South Beach hotel lobby visualizers choosing high-definition marble replicas in SPC."
    }
  ],
  5: [ // Jun
    {
      trendingTopic: "Thermal Resistance Profiles",
      architectsSearch: "co-extrusion exterior WPC cladding",
      miamiInsight: "Coral Gables high-end builds require materials that withstand continuous 95°F UV radiation."
    }
  ],
  6: [ // Jul
    {
      trendingTopic: "Direct-to-Port Consolidation",
      architectsSearch: "FOB Miami container architectural materials",
      miamiInsight: "Architectural buyers bypass intermediate jobbers to lock container-level pricing."
    }
  ],
  7: [ // Aug
    {
      trendingTopic: "High-Traffic Commercial Grounding",
      architectsSearch: "heavy commercial grade SPC flooring",
      miamiInsight: "Miami-Dade public utility buildings updating corridors with high-impact fire-resistant SPC."
    }
  ],
  8: [ // Sep
    {
      trendingTopic: "Wind-Shear Structural Backing",
      architectsSearch: "impact-rated interlocking exterior cladding",
      miamiInsight: "Oceanfront developers auditing external facades for ASTM wind-loading certification."
    }
  ],
  9: [ // Oct
    {
      trendingTopic: "Cozy Subtropical Textures",
      architectsSearch: "brushed ash fluted polymer walls",
      miamiInsight: "Design District boutiques adopting warm wood tones to create comforting autumnal palettes."
    }
  ],
  10: [ // Nov
    {
      trendingTopic: "Craftsmen Specifications",
      architectsSearch: "vibration-reduction SPC underlayment",
      miamiInsight: "High-end apartment developers demanding acoustic-grade floor options to mitigate noise propagation."
    }
  ],
  11: [ // Dec
    {
      trendingTopic: "2027 Architectural Preview",
      architectsSearch: "integrated LED wall slot panels",
      miamiInsight: "Wynwood design boards signaling dark charcoal and geometric textures as next year's focal trends."
    }
  ]
};

export const DEFAULT_KEY_CONFIGS = {
  openai: "",
  perplexity: "",
  googleTrends: "",
  heygen: "",
  invideo: "",
  runway: "55ae85c88ab9bcdbdc651530befc5c8e15bfd9c201f938803333ee1d7520aef539b935c1f1479942a23a4c3986f8bf95bfe6ac3f7413c751620b7ba2b1bcec3c"
};

export const COLOMBIAN_HOLIDAYS_2026: Record<string, { es: string; en: string }> = {
  "2026-01-01": { es: "Año Nuevo", en: "New Year's Day" },
  "2026-01-12": { es: "Día de los Reyes Magos", en: "Epiphany's Day" },
  "2026-03-23": { es: "Día de San José", en: "Saint Joseph's Day" },
  "2026-04-02": { es: "Jueves Santo", en: "Holy Thursday" },
  "2026-04-03": { es: "Viernes Santo", en: "Good Friday" },
  "2026-05-01": { es: "Día del Trabajo", en: "Labor Day" },
  "2026-05-18": { es: "Ascensión del Señor", en: "Ascension Day" },
  "2026-06-08": { es: "Corpus Christi", en: "Corpus Christi" },
  "2026-06-15": { es: "Sagrado Corazón", en: "Sacred Heart" },
  "2026-06-29": { es: "San Pedro y San Pablo", en: "Saint Peter & Saint Paul" },
  "2026-07-20": { es: "Día de la Independencia", en: "Independence Day" },
  "2026-08-07": { es: "Batalla de Boyacá", en: "Battle of Boyacá" },
  "2026-08-17": { es: "Asunción de la Virgen", en: "Assumption of Mary" },
  "2026-10-12": { es: "Día de la Raza", en: "Columbus Day" },
  "2026-11-02": { es: "Día de Todos los Santos", en: "All Saints' Day" },
  "2026-11-16": { es: "Independencia de Cartagena", en: "Independence of Cartagena" },
  "2026-12-08": { es: "Inmaculada Concepción", en: "Immaculate Conception" },
  "2026-12-25": { es: "Navidad", en: "Christmas Day" }
};

export const getColombianHolidays = (year: number): Record<string, { es: string; en: string }> => {
  if (year === 2026) {
    return COLOMBIAN_HOLIDAYS_2026;
  }
  return {};
};
