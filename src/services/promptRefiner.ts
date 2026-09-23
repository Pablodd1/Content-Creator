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

export interface PromptRefinerRequest {
  rawPrompt: string;
  templateId?: string;
  aspectRatio?: string;
  style?: string;
  referenceImage?: string;
  referenceEmailText?: string;
  customOverrides?: {
    lighting?: string;
    lensFocalLength?: string;
    materialTextures?: string;
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
  interceptionTimestamp: string;
}

/**
 * Library of Professional Architectural Photography Templates
 * Crafted by architectural photographers, creative directors, and diffusion prompt architects.
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
    composition: 'Axial one-point central perspective with disciplined geometric symmetry, balanced negative space, and safe margin framing for editorial layouts.',
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
    composition: 'Rule of thirds composition centering hero product upon architectural plinth, layered depth of field with architectural planes framing the focal point.',
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
    composition: 'Dynamic two-point perspective highlighting dramatic cantilevered overhangs, volumetric shadow patterns, and heroic structural rhythm.',
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
    composition: 'Fluid indoor-outdoor threshold composition, seamless visual connection between interior organic architecture and exterior natural environment.',
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
    composition: 'Two-point exterior perspective capturing both the illuminated building volume and its complete mirror reflection in the foreground water surface.',
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
    composition: 'Asymmetric harmonious balance, warm empty negative space, comfortable organic furniture arrangement framing the architectural opening.',
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
    composition: 'Sweeping diagonal composition guiding the viewer along structural ribbon curves, dynamic spatial tension and futuristic sense of motion.',
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
    composition: 'Intimate architectural detail vignette, diagonal junction line dividing two contrasting textural materials (e.g. rough stone meeting smooth brass).',
    atmosphere: 'Artisanal architectural monograph, tactile tangible materiality, supreme craftsmanship.',
    sampleKeywords: ['architectural detail', 'macro texture', '90mm tilt-shift', 'Shou Sugi Ban', 'split-face limestone', 'material junction']
  }
];

export class PromptRefinerService {
  /**
   * Intelligently selects the best architectural template based on keywords in user prompt
   */
  public detectBestTemplate(rawPrompt: string, style?: string): ArchitecturalTemplate {
    const text = `${rawPrompt} ${style || ''}`.toLowerCase();

    // Specific architectural matches
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

    // Default versatile commercial minimalist template
    return ARCHITECTURAL_TEMPLATES.find(t => t.id === 'minimalist_commercial')!;
  }

  /**
   * Retrieves all available architectural photography templates
   */
  public getTemplates(): ArchitecturalTemplate[] {
    return ARCHITECTURAL_TEMPLATES;
  }

  /**
   * Retrieves a template by its ID
   */
  public getTemplateById(id: string): ArchitecturalTemplate | undefined {
    return ARCHITECTURAL_TEMPLATES.find(t => t.id === id);
  }

  /**
   * Intercepts a raw visual prompt and enriches it with architectural photography parameters.
   * If Gemini API client is provided, uses Gemini to synthesize a custom master diffusion prompt.
   * Otherwise falls back to deterministic architectural synthesis.
   */
  public async refinePromptWithArchitecturalTemplates(
    request: PromptRefinerRequest,
    aiClient?: GoogleGenAI
  ): Promise<PromptRefinerResult> {
    const {
      rawPrompt,
      templateId,
      aspectRatio = '1:1',
      style = 'Comercial & Producto 8K',
      referenceImage,
      referenceEmailText = '',
      customOverrides
    } = request;

    // 1. Resolve template
    let template = templateId ? this.getTemplateById(templateId) : undefined;
    if (!template) {
      template = this.detectBestTemplate(rawPrompt, style);
    }

    // Apply any custom overrides
    const effectiveLighting = customOverrides?.lighting || template.lighting;
    const effectiveLens = customOverrides?.lensFocalLength || template.lensFocalLength;
    const effectiveTextures = customOverrides?.materialTextures || template.materialTextures;

    const architecturalSpecs: ArchitecturalSpecs = {
      templateId: template.id,
      templateName: template.name,
      lighting: effectiveLighting,
      lensFocalLength: effectiveLens,
      cameraSettings: template.cameraSettings,
      materialTextures: effectiveTextures,
      composition: template.composition
    };

    // Aspect ratio framing rule
    let ratioInstruction = 'Balanced square 1:1 commercial composition with axial symmetry';
    if (aspectRatio === '9:16') {
      ratioInstruction = 'Vertical 9:16 mobile format with subject centered in middle 65% safe zone, dramatic vertical architectural elevation, avoiding top and bottom UI zones';
    } else if (aspectRatio === '16:9') {
      ratioInstruction = 'Cinematic widescreen 16:9 composition, wide horizontal architectural horizon, rule of thirds, panoramic spatial depth';
    } else if (aspectRatio === '3:4' || aspectRatio === '4:3') {
      ratioInstruction = `Standard architectural editorial monograph ${aspectRatio} aspect ratio, generous margins and crisp structural lines`;
    }

    // 2. Try AI-powered synthesis using Gemini
    if (aiClient) {
      try {
        const parts: any[] = [];

        // If reference image provided, attach for multimodal architectural inspection
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

        const systemInstruction = `You are a world-renowned Architectural Photographer and Principal Visual Director (featured in Architectural Digest, Dezeen, El Croquis, and Domus).
Your job is to intercept the user's raw visual request and refine it using professional architectural photography specifications.

ARCHITECTURAL BLUEPRINT PARAMETERS:
- Architectural Template: "${template.name}"
- Specific Lighting: "${effectiveLighting}"
- Camera & Lens Optics: "${effectiveLens}"
- Camera Settings & Sensor: "${template.cameraSettings}"
- Material Textures & Finishes: "${effectiveTextures}"
- Composition & Framing: "${template.composition}" (${ratioInstruction})
- Atmosphere: "${template.atmosphere}"
- User Raw Concept: "${rawPrompt}"
- Target Aspect Ratio: "${aspectRatio}"
- Additional Business/Client Notes: "${referenceEmailText || 'None'}"

TASK:
Produce an enhanced architectural photography prompt package.
1. "masterEnglish": A single, pristine diffusion prompt (100 to 140 words) in English. Must integrate the user's subject into the architectural setting with the exact lens focal length, lighting scheme, material textures, and composition specified in the blueprint. No filler buzzwords.
2. "enhancedSpanish": A concise, elegant art direction summary in Spanish for the client/marketing team explaining the architectural framing, lens choice, and lighting.

OUTPUT JSON FORMAT ONLY:
{
  "masterEnglish": "...",
  "enhancedSpanish": "..."
}`;

        parts.push({
          text: `Refine this raw concept into a master architectural photograph: "${rawPrompt}".`
        });

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts },
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.4
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (parsed.masterEnglish) {
            return {
              success: true,
              rawPrompt,
              refinedEnglishPrompt: parsed.masterEnglish.trim(),
              refinedSpanishPrompt: parsed.enhancedSpanish?.trim() || `${rawPrompt}. Fotografía arquitectónica profesional estilo ${template.name}.`,
              templateUsed: template,
              architecturalSpecs,
              interceptionTimestamp: new Date().toISOString()
            };
          }
        }
      } catch (err: any) {
        console.warn('PromptRefiner AI synthesis fallback:', err?.message || err);
      }
    }

    // 3. High-Quality Deterministic Architectural Synthesis (Fallback or offline)
    const masterEnglishFallback = `Professional architectural monograph photograph of ${rawPrompt}. Captured with ${effectiveLens}, ${template.cameraSettings}. Lighting: ${effectiveLighting}. Materials and tactile textures: ${effectiveTextures}. Composition: ${template.composition}, ${ratioInstruction}. Atmosphere: ${template.atmosphere}. 8k resolution, razor-sharp edge contrast, true architectural perspective, zero distortion, master color grading.`;
    
    const spanishExplanation = `Fotografía arquitectónica profesional (${template.name}). Tomas con ${effectiveLens}, iluminación ${effectiveLighting.substring(0, 80)}..., texturas de ${effectiveTextures.substring(0, 80)}... Composición ${ratioInstruction}.`;

    return {
      success: true,
      rawPrompt,
      refinedEnglishPrompt: masterEnglishFallback,
      refinedSpanishPrompt: spanishExplanation,
      templateUsed: template,
      architecturalSpecs,
      interceptionTimestamp: new Date().toISOString()
    };
  }

  /**
   * Builds an instant deterministic architectural prompt using template specifications.
   */
  public buildDeterministicPrompt(template: ArchitecturalTemplate, rawPrompt: string): string {
    return `Professional architectural photograph of ${rawPrompt}. Captured on ${template.lensFocalLength}, ${template.cameraSettings}. Lighting: ${template.lighting}. Authentic tactile materials: ${template.materialTextures}. Composition: ${template.composition}. Atmosphere: ${template.atmosphere}. High-fidelity architectural realism, crisp edges, zero distortion, master color grading.`;
  }
}

export const promptRefiner = new PromptRefinerService();
