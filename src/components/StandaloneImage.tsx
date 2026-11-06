import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ImageIcon,
  Loader2,
  Sparkles,
  Download,
  Layers,
  CheckCircle2,
  ShieldCheck,
  Wand2,
  Building2,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Ruler,
  Eye,
  EyeOff,
  AlignLeft,
  AlignCenter,
  Check,
  RefreshCw
} from 'lucide-react';
import PromptStructureGuide from './PromptStructureGuide';
import ImageReferencePicker from './ImageReferencePicker';
import PromptAssistantModal from './PromptAssistantModal';
import { storage, SavedImageItem } from '../utils/storage';
import {
  ARCHITECTURAL_TEMPLATES,
  UNITEC_PRODUCT_CATALOG,
  SAFE_ZONE_1080X1920_SPEC,
  promptRefiner
} from '../services/promptRefiner';

/**
 * Helper to wrap text cleanly inside a maximum pixel width without cutting words
 */
function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      if (lines.length === maxLines - 1) {
        // Put remaining words in last line and fit cleanly
        const remaining = words.slice(i).join(' ');
        let fitted = remaining;
        while (ctx.measureText(fitted).width > maxWidth && fitted.length > 3) {
          fitted = fitted.slice(0, -1).trim();
        }
        currentLine = fitted;
        break;
      }
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines.slice(0, maxLines);
}

/**
 * Draws a rounded rectangle path on Canvas
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Draws realistic procedural architectural material texture when no external photo is loaded yet
 */
function drawProceduralArchitecturalBackdrop(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  catalogId: string
) {
  // Base architectural studio gradient
  const baseGrad = ctx.createLinearGradient(0, 0, width, height);
  if (catalogId === 'uv_marble_sheet') {
    baseGrad.addColorStop(0, '#1e242b');
    baseGrad.addColorStop(0.5, '#2c3540');
    baseGrad.addColorStop(1, '#14191f');
  } else if (catalogId === 'spc_click_flooring') {
    baseGrad.addColorStop(0, '#2b2118');
    baseGrad.addColorStop(0.5, '#3d2f22');
    baseGrad.addColorStop(1, '#1c150e');
  } else if (catalogId === 'pu_stone_panel') {
    baseGrad.addColorStop(0, '#1c1f24');
    baseGrad.addColorStop(0.5, '#2b3038');
    baseGrad.addColorStop(1, '#121417');
  } else {
    // Warm architectural walnut WPC louver aesthetic
    baseGrad.addColorStop(0, '#231710');
    baseGrad.addColorStop(0.45, '#3b261a');
    baseGrad.addColorStop(1, '#160e09');
  }
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, width, height);

  // Architectural vertical louver / cladding slats inside the scene
  const slatCount = 18;
  const slatWidth = width / slatCount;
  for (let i = 0; i < slatCount; i++) {
    const x = i * slatWidth;
    // Slat highlight
    const slatGrad = ctx.createLinearGradient(x, 0, x + slatWidth, 0);
    if (catalogId === 'uv_marble_sheet') {
      slatGrad.addColorStop(0, 'rgba(255,255,255,0.03)');
      slatGrad.addColorStop(0.5, 'rgba(255,255,255,0.08)');
      slatGrad.addColorStop(1, 'rgba(0,0,0,0.25)');
    } else {
      slatGrad.addColorStop(0, 'rgba(255, 200, 150, 0.06)');
      slatGrad.addColorStop(0.65, 'rgba(180, 115, 70, 0.12)');
      slatGrad.addColorStop(0.75, 'rgba(10, 6, 4, 0.65)');
      slatGrad.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
    }
    ctx.fillStyle = slatGrad;
    ctx.fillRect(x, 0, slatWidth, height);
  }

  // Soft architectural skylight beam from top-left
  const lightBeam = ctx.createRadialGradient(width * 0.5, height * 0.42, 40, width * 0.5, height * 0.48, width * 0.85);
  lightBeam.addColorStop(0, 'rgba(255, 236, 209, 0.22)');
  lightBeam.addColorStop(0.6, 'rgba(255, 215, 170, 0.06)');
  lightBeam.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
  ctx.fillStyle = lightBeam;
  ctx.fillRect(0, 0, width, height);
}

export default function StandaloneImage() {
  const [savedHistory, setSavedHistory] = useState<SavedImageItem[]>(() => storage.getGeneratedImages());
  const [imagePrompt, setImagePrompt] = useState(
    'Panel Acanalado WPC Interior color nogal oscuro instalado en sala de doble altura con iluminación arquitectónica cálida y mobiliario minimalista'
  );
  const [imageStyle, setImageStyle] = useState('Comercial & Producto 8K');
  const [imageRatio, setImageRatio] = useState<'9:16' | '1:1' | '16:9' | '4:3'>('9:16');
  const [imageResolution, setImageResolution] = useState<'2K' | '1K'>('2K');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceEmailText, setReferenceEmailText] = useState<string>(() => storage.getBriefingContext() || '');
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(() => {
    const list = storage.getGeneratedImages();
    return list.length > 0 ? list[0].url : null;
  });
  const [appliedPrompt, setAppliedPrompt] = useState('');
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Unified Flow State (Client Requirements 1, 2, 3, 4, 5)
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>('auto');
  const [customTitleOverride, setCustomTitleOverride] = useState<string>('');
  const [selectedArchTemplate, setSelectedArchTemplate] = useState<string>('auto');
  const [appliedArchSpecs, setAppliedArchSpecs] = useState<any>(null);
  const [showArchDetails, setShowArchDetails] = useState(false);

  // Graphic Composition & Safe Zone Controls (1080x1920 -> Central 1080x1350)
  const [enableGraphicOverlay, setEnableGraphicOverlay] = useState<boolean>(true);
  const [showSafeZoneGuides, setShowSafeZoneGuides] = useState<boolean>(true);
  const [headerAlignment, setHeaderAlignment] = useState<'left' | 'center'>('left');
  const [logoScaleMode, setLogoScaleMode] = useState<'compact' | 'standard' | 'prominent'>('standard');
  const [brandSubtitle, setBrandSubtitle] = useState<string>('ARCHITECTURAL MATERIALS · MIAMI & COLOMBIA');
  const [composedPreviewUrl, setComposedPreviewUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. REAL-TIME AUTOMATIC PRODUCT PARSER & FICHA TÉCNICA LINKER (Independent of other modules)
  const parsedProduct = useMemo(() => {
    return promptRefiner.parseProductAndSpecsFromPrompt(
      imagePrompt,
      selectedCatalogId === 'auto' ? undefined : selectedCatalogId,
      {
        productTitle: customTitleOverride.trim() || undefined
      }
    );
  }, [imagePrompt, selectedCatalogId, customTitleOverride]);

  // Available reference images from storage
  const availableReferences = savedHistory.map((item, idx) => ({
    id: item.id,
    name: `Render Guardado #${idx + 1}`,
    url: item.url
  }));

  /**
   * 2, 3 & 4. COMPOSITOR GRÁFICO DE ALTA PRECISIÓN (1080 × 1920 px con Zona Segura Central 1080 × 1350 px)
   * Garantiza:
   * - Toda la información principal (Logo, Título Automático, Subtítulo, Ficha Técnica y Especificaciones)
   *   queda estrictamente contenida dentro del área segura central de 1080 × 1350 px (Y: 285px a 1635px).
   * - Reglas estrictas de escala, márgenes (68px laterales) y alineación sin superposición ni corte de texto.
   */
  const renderUnifiedGraphicComposition = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = SAFE_ZONE_1080X1920_SPEC.canvasWidth;   // 1080
    const H = SAFE_ZONE_1080X1920_SPEC.canvasHeight;  // 1920
    const SAFE_TOP = SAFE_ZONE_1080X1920_SPEC.safeZoneTopY;       // 285
    const SAFE_BOTTOM = SAFE_ZONE_1080X1920_SPEC.safeZoneBottomY; // 1635
    const SAFE_H = SAFE_ZONE_1080X1920_SPEC.safeZoneHeight;       // 1350
    const PAD_X = SAFE_ZONE_1080X1920_SPEC.horizontalMarginPx;    // 68
    const INNER_W = W - PAD_X * 2;                                // 944

    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    // 1. Draw Background Image or Procedural Material Texture
    let bgLoaded = false;
    if (generatedImg) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = generatedImg;
        });

        // Cover-fit calculation into 1080x1920
        const imgRatio = img.width / img.height;
        const canvasRatio = W / H;
        let drawW = W;
        let drawH = H;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > canvasRatio) {
          drawH = H;
          drawW = H * imgRatio;
          offsetX = (W - drawW) / 2;
        } else {
          drawW = W;
          drawH = W / imgRatio;
          offsetY = (H - drawH) / 2;
        }
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        bgLoaded = true;
      } catch {
        bgLoaded = false;
      }
    }

    if (!bgLoaded) {
      drawProceduralArchitecturalBackdrop(ctx, W, H, parsedProduct.catalogMatch.id);
    }

    // 2. If Graphic Overlay is enabled, draw Logo, Auto Product Title & Linked Ficha Técnica strictly inside 1080x1350 Safe Zone
    if (enableGraphicOverlay) {
      // Measured contrast scrims at top and bottom of the 1080x1350 safe zone for WCAG AA legibility
      const topScrim = ctx.createLinearGradient(0, SAFE_TOP - 40, 0, SAFE_TOP + 420);
      topScrim.addColorStop(0, 'rgba(10, 15, 26, 0.82)');
      topScrim.addColorStop(0.65, 'rgba(10, 15, 26, 0.52)');
      topScrim.addColorStop(1, 'rgba(10, 15, 26, 0)');
      ctx.fillStyle = topScrim;
      ctx.fillRect(0, SAFE_TOP, W, 420);

      const bottomScrim = ctx.createLinearGradient(0, SAFE_BOTTOM - 520, 0, SAFE_BOTTOM + 40);
      bottomScrim.addColorStop(0, 'rgba(10, 15, 26, 0)');
      bottomScrim.addColorStop(0.35, 'rgba(10, 15, 26, 0.68)');
      bottomScrim.addColorStop(1, 'rgba(10, 15, 26, 0.90)');
      ctx.fillStyle = bottomScrim;
      ctx.fillRect(0, SAFE_BOTTOM - 520, W, 520);

      // --- ZONE A: BRAND LOGO & SKU HEADER (Strictly inside Safe Zone Top: Y = 285 + 36 = 321px) ---
      const logoHeight = logoScaleMode === 'compact' ? 44 : logoScaleMode === 'prominent' ? 60 : 52;
      const logoY = SAFE_TOP + 36; // 321px (well inside 285px boundary)

      ctx.save();
      if (headerAlignment === 'left') {
        // Brand Emblem Box
        drawRoundedRect(ctx, PAD_X, logoY, logoHeight, logoHeight, 12);
        ctx.fillStyle = '#2563eb';
        ctx.fill();

        // Emblem Monogram "U"
        ctx.fillStyle = '#ffffff';
        ctx.font = `900 ${Math.round(logoHeight * 0.56)}px "Plus Jakarta Sans", system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('U', PAD_X + logoHeight / 2, logoY + logoHeight / 2 + 2);

        // Brand Wordmark (Next to emblem with 16px margin)
        const wordmarkX = PAD_X + logoHeight + 16;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#ffffff';
        ctx.font = `800 ${Math.round(logoHeight * 0.46)}px "Plus Jakarta Sans", system-ui, sans-serif`;
        ctx.fillText('UNITEC USA DESIGN', wordmarkX, logoY + 3);

        ctx.fillStyle = '#93c5fd';
        ctx.font = `600 ${Math.round(logoHeight * 0.25)}px "Plus Jakarta Sans", system-ui, sans-serif`;
        ctx.fillText(brandSubtitle, wordmarkX, logoY + Math.round(logoHeight * 0.58));

        // Right-aligned SKU & Catalog Tag on same top row (preventing collision)
        const skuLabel = `CATÁLOGO · ${parsedProduct.sku}`;
        ctx.font = '700 18px "JetBrains Mono", monospace';
        const skuWidth = ctx.measureText(skuLabel).width + 32;
        const skuX = W - PAD_X - skuWidth;
        drawRoundedRect(ctx, skuX, logoY + (logoHeight - 38) / 2, skuWidth, 38, 8);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(skuLabel, skuX + skuWidth / 2, logoY + logoHeight / 2);
      } else {
        // Centered Alignment Mode
        const totalBrandW = 360;
        const startX = (W - totalBrandW) / 2;
        drawRoundedRect(ctx, startX, logoY, logoHeight, logoHeight, 12);
        ctx.fillStyle = '#2563eb';
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = `900 ${Math.round(logoHeight * 0.56)}px "Plus Jakarta Sans", system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('U', startX + logoHeight / 2, logoY + logoHeight / 2 + 2);

        const wordmarkX = startX + logoHeight + 16;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#ffffff';
        ctx.font = `800 ${Math.round(logoHeight * 0.46)}px "Plus Jakarta Sans", system-ui, sans-serif`;
        ctx.fillText('UNITEC USA DESIGN', wordmarkX, logoY + 3);

        ctx.fillStyle = '#93c5fd';
        ctx.font = `600 ${Math.round(logoHeight * 0.24)}px "Plus Jakarta Sans", system-ui, sans-serif`;
        ctx.fillText(`${parsedProduct.sku} · MIAMI WHOLESALE`, wordmarkX, logoY + Math.round(logoHeight * 0.58));
      }
      ctx.restore();

      // --- ZONE B: AUTOMATIC PRODUCT TITLE & CATEGORY KICKER (With strict anti-overlap clearance) ---
      const titleBlockStartY = logoY + logoHeight + SAFE_ZONE_1080X1920_SPEC.logoClearanceBottomPx; // e.g., 321 + 52 + 28 = 401px

      ctx.save();
      const alignX = headerAlignment === 'center' ? W / 2 : PAD_X;
      ctx.textAlign = headerAlignment;
      ctx.textBaseline = 'top';

      // Category Kicker
      const kickerText = parsedProduct.catalogMatch.categoryES.toUpperCase();
      ctx.font = '700 20px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillStyle = '#60a5fa';
      ctx.fillText(kickerText, alignX, titleBlockStartY);

      // Dynamic Font-Size Scaling for Automatic Product Name (Prevents clipping or overflow)
      const productTitle = parsedProduct.detectedProductNameES;
      let titleFontSize = 46;
      if (productTitle.length > 42) {
        titleFontSize = 35;
      } else if (productTitle.length > 32) {
        titleFontSize = 40;
      }

      ctx.font = `800 ${titleFontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
      const wrappedTitleLines = wrapCanvasText(ctx, productTitle, INNER_W, 2);

      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
      ctx.shadowBlur = 12;
      const lineHeight = Math.round(titleFontSize * 1.18);
      wrappedTitleLines.forEach((line, idx) => {
        ctx.fillText(line, alignX, titleBlockStartY + 30 + idx * lineHeight);
      });
      ctx.restore();

      // --- ZONE C: FICHA TÉCNICA POR MATERIAL (Strictly above SAFE_BOTTOM = 1635px) ---
      // Card Dimensions: X = 68, W = 944, Height = 326, Bottom = 1635 - 32 = 1603px (Y = 1277px to 1603px)
      const specCardH = 326;
      const specCardBottomY = SAFE_BOTTOM - 32; // 1603px (32px safety cushion inside 1635px boundary)
      const specCardTopY = specCardBottomY - specCardH; // 1277px

      ctx.save();
      drawRoundedRect(ctx, PAD_X, specCardTopY, INNER_W, specCardH, 20);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.45)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Spec Card Header Bar
      const cardInnerPad = 28;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#93c5fd';
      ctx.font = '700 18px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText(
        `FICHA TÉCNICA CERTIFICADA · ${parsedProduct.detectedProductNameES.toUpperCase()}`,
        PAD_X + cardInnerPad,
        specCardTopY + 22
      );

      // Hairline Divider inside Spec Card
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PAD_X + cardInnerPad, specCardTopY + 54);
      ctx.lineTo(PAD_X + INNER_W - cardInnerPad, specCardTopY + 54);
      ctx.stroke();

      // 4 Technical Benefits (2x2 Grid inside Spec Card, matched to material datasheet)
      const benefits = parsedProduct.technicalBenefits.slice(0, 4);
      const colW = (INNER_W - cardInnerPad * 2 - 28) / 2;
      const rowH = 88;
      const gridStartY = specCardTopY + 70;

      benefits.forEach((benefit, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const cellX = PAD_X + cardInnerPad + col * (colW + 28);
        const cellY = gridStartY + row * rowH;

        // Benefit Sub-box
        drawRoundedRect(ctx, cellX, cellY, colW, 74, 12);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.75)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Checkmark icon badge
        drawRoundedRect(ctx, cellX + 14, cellY + 19, 34, 34, 8);
        ctx.fillStyle = 'rgba(37, 99, 235, 0.28)';
        ctx.fill();

        ctx.fillStyle = '#60a5fa';
        ctx.font = '800 18px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✓', cellX + 31, cellY + 37);

        // Benefit Text (auto-wrapped to 2 lines max inside cell)
        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 19px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        const benefitLines = wrapCanvasText(ctx, benefit, colW - 64, 2);
        const textStartY = benefitLines.length === 1 ? cellY + 26 : cellY + 15;
        benefitLines.forEach((bLine, bIdx) => {
          ctx.fillText(bLine, cellX + 58, textStartY + bIdx * 23);
        });
      });

      // Spec Card Footer: Dimensions & Normative Certification
      const footerY = specCardBottomY - 46;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.beginPath();
      ctx.moveTo(PAD_X + cardInnerPad, footerY - 10);
      ctx.lineTo(PAD_X + INNER_W - cardInnerPad, footerY - 10);
      ctx.stroke();

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '600 17px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`FORMATO: ${parsedProduct.dimensionsSpec}`, PAD_X + cardInnerPad, footerY + 12);

      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'right';
      ctx.fillText(parsedProduct.certificationSpec, PAD_X + INNER_W - cardInnerPad, footerY + 12);
      ctx.restore();
    }

    // 3. If Safe Zone Visual Guides are toggled on, draw them on a preview layer or export clean when downloading
    try {
      setComposedPreviewUrl(canvas.toDataURL('image/png'));
    } catch (e) {
      console.warn('Canvas preview warning:', e);
    }
  }, [
    generatedImg,
    parsedProduct,
    enableGraphicOverlay,
    headerAlignment,
    logoScaleMode,
    brandSubtitle
  ]);

  useEffect(() => {
    renderUnifiedGraphicComposition();
  }, [renderUnifiedGraphicComposition]);

  /**
   * 5. FLUJO UNIFICADO EN UN SOLO PASO ("Solo Imagen")
   * Ejecuta simultáneamente:
   * 1. Detección automática del nombre del producto desde el prompt
   * 2. Vinculación de la ficha técnica del material (beneficios, formato, norma)
   * 3. Refinamiento óptico arquitectónico y restricción de zona segura 1080×1350 px
   * 4. Generación de imagen con Gemini y composición gráfica 1080×1920 px
   */
  const handleUnifiedGenerateAndCompose = async () => {
    if (!imagePrompt.trim()) {
      setError('Por favor ingresa una descripción del material o espacio para iniciar el flujo unificado.');
      return;
    }
    setIsGeneratingImg(true);
    setError('');
    setStatusMessage(
      `Detectado: ${parsedProduct.detectedProductNameES} (${parsedProduct.sku}) · Vinculando Ficha Técnica y renderizando en 1080×1920 px...`
    );

    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio: imageRatio,
          style: imageStyle,
          resolution: imageResolution,
          referenceImage: referenceImage || undefined,
          referenceEmailText: referenceEmailText || undefined,
          architecturalTemplateId: selectedArchTemplate === 'auto' ? undefined : selectedArchTemplate,
          productCatalogId: selectedCatalogId === 'auto' ? undefined : selectedCatalogId,
          architecturalOverrides: {
            productTitle: parsedProduct.detectedProductNameES,
            technicalBenefits: parsedProduct.technicalBenefits
          }
        })
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        setGeneratedImg(data.imageUrl);
        setAppliedPrompt(data.appliedPrompt || imagePrompt);
        if (data.architecturalSpecs) {
          setAppliedArchSpecs(data.architecturalSpecs);
        }
        setStatusMessage(
          `Flujo unificado completado: ${parsedProduct.detectedProductNameES} con ficha técnica e información dentro del área segura central 1080×1350 px.`
        );

        storage.saveGeneratedImage({
          url: data.imageUrl,
          prompt: imagePrompt,
          appliedPrompt: data.appliedPrompt,
          style: imageStyle,
          aspectRatio: imageRatio,
          hasReference: !!referenceImage
        });
        setSavedHistory(storage.getGeneratedImages());
      } else {
        setError(data.error || 'Error al generar la imagen con Gemini');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión al ejecutar el flujo unificado');
    } finally {
      setIsGeneratingImg(false);
    }
  };

  /**
   * Refina únicamente el texto del prompt si el usuario desea inspeccionarlo antes de renderizar
   */
  const handleQuickUnifiedRefine = async () => {
    if (!imagePrompt.trim()) return;
    setError('');
    try {
      const res = await fetch('/api/prompt-refiner/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          templateId: selectedArchTemplate === 'auto' ? undefined : selectedArchTemplate,
          productCatalogId: selectedCatalogId === 'auto' ? undefined : selectedCatalogId,
          aspectRatio: imageRatio,
          style: imageStyle,
          referenceImage: referenceImage || undefined,
          referenceEmailText: referenceEmailText || undefined,
          customOverrides: {
            productTitle: parsedProduct.detectedProductNameES,
            technicalBenefits: parsedProduct.technicalBenefits
          }
        })
      });
      const data = await res.json();
      if (data.success && data.refinedSpanishPrompt) {
        setAppliedPrompt(data.refinedEnglishPrompt);
        setAppliedArchSpecs(data.architecturalSpecs);
        setStatusMessage(
          `Parser verificó producto "${parsedProduct.detectedProductNameES}" y vinculó 4 beneficios de su ficha técnica.`
        );
      }
    } catch (err: any) {
      setError(err.message || 'Error al validar con el parser.');
    }
  };

  const handleDownloadComposed1080x1920 = () => {
    if (!composedPreviewUrl) return;
    const a = document.createElement('a');
    const safeSlug = parsedProduct.detectedProductNameES
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    a.href = composedPreviewUrl;
    a.download = `unitec-${safeSlug}-1080x1920-safezone.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadRawBaseImage = async () => {
    const target = generatedImg || composedPreviewUrl;
    if (!target) return;
    try {
      const response = await fetch(target);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `unitec-base-render-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading base image:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Hidden 1080x1920 Master Compositor Canvas */}
      <canvas ref={canvasRef} width={1080} height={1920} className="hidden" />

      {/* Header & Unified Specification Summary Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <ImageIcon className="text-blue-600 shrink-0" size={22} />
              <span>Módulo Unificado: Solo Imagen (Detección + Ficha Técnica + Zona Segura 1080×1920)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detección automática de producto desde el prompt, vinculación con la ficha técnica por material y plantilla de composición 1080×1920 px con área segura central de 1080×1350 px en un solo paso.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowSafeZoneGuides(!showSafeZoneGuides)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                showSafeZoneGuides
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {showSafeZoneGuides ? <Eye size={14} /> : <EyeOff size={14} />}
              <span>Guías 1080×1350 px: {showSafeZoneGuides ? 'Visibles' : 'Ocultas'}</span>
            </button>
          </div>
        </div>

        {/* 5 Active Client Requirements Verification Strip (Unboxed clean metadata style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Check size={13} className="text-emerald-600 shrink-0" />
              <span>1. Producto Automático</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate" title={parsedProduct.detectedProductNameES}>
              Detectado: <strong className="text-slate-700 dark:text-slate-200">{parsedProduct.detectedProductNameES}</strong>
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Check size={13} className="text-emerald-600 shrink-0" />
              <span>2. Logos y Títulos</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Margen 68px · Gap 28px · Anti-corte activo
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Check size={13} className="text-emerald-600 shrink-0" />
              <span>3. Ficha Técnica</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono tabular-nums">
              {parsedProduct.sku} · 4 beneficios vinculados
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Check size={13} className="text-emerald-600 shrink-0" />
              <span>4. Zona Segura Central</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono tabular-nums">
              1080×1920 px → 1080×1350 px
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Check size={13} className="text-emerald-600 shrink-0" />
              <span>5. Flujo Unificado</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Detección + Atributos + Composición 1-Paso
            </p>
          </div>
        </div>
      </div>

      {/* Structure Guide with 1-Click Catalog Material Prompts */}
      <PromptStructureGuide
        type="image"
        onApplyTemplate={(tpl) => {
          setImagePrompt(tpl);
          setCustomTitleOverride('');
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Unified Input, Automatic Product Parser, Ficha Técnica & Layout Controls */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-5">
            {/* STEP A: Prompt Input with Live Automatic Product Parser */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  1. Prompt de Escena o Material (El Parser detecta el producto automáticamente):
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAssistantOpen(true)}
                    className="text-xs flex items-center gap-1.5 text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Sparkles size={13} className="text-blue-600" />
                    <span>Asistente IA Avanzado</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickUnifiedRefine}
                    disabled={!imagePrompt.trim()}
                    className="text-xs flex items-center gap-1.5 text-blue-700 dark:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Wand2 size={13} />
                    <span>Validar Parser</span>
                  </button>
                </div>
              </div>

              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Escribe tu escena (ej. 'Panel acanalado WPC color nogal oscuro en lobby de doble altura', 'Piso SPC click roble natural en sala moderna', 'Lámina de mármol UV Calacatta en recepción')..."
                className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg p-3.5 text-xs leading-relaxed outline-none focus:border-blue-600 text-slate-800 dark:text-slate-100"
                rows={4}
              />

              {/* Quick Catalog Selector Pills */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Catálogo Oficial UNITEC (Selección automática por prompt o manual):</span>
                  <span className="font-mono tabular-nums text-[10px]">
                    {selectedCatalogId === 'auto' ? 'Modo: Auto-Detección NLP Activa' : 'Modo: Ficha Fijada Manualmente'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCatalogId('auto');
                      setCustomTitleOverride('');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      selectedCatalogId === 'auto'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Auto-Detectar del Prompt
                  </button>
                  {UNITEC_PRODUCT_CATALOG.map((cat) => {
                    const isSelected = selectedCatalogId === cat.id || (selectedCatalogId === 'auto' && parsedProduct.catalogMatch.id === cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCatalogId(cat.id);
                          setCustomTitleOverride('');
                          if (!imagePrompt.toLowerCase().includes(cat.nameES.split(' ')[0].toLowerCase())) {
                            setImagePrompt(`${cat.nameES} instalado en ${cat.applicationZones.split(',')[0].toLowerCase()}, iluminación arquitectónica natural y líneas limpias.`);
                          }
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-600 text-blue-700 dark:text-blue-300 font-bold'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {cat.nameES}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STEP B: Detected Product & Linked Ficha Técnica Panel (Requirements 1 & 3) */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <FileCheck2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    2. Producto Detectado y Ficha Técnica Vinculada (Tiempo Real)
                  </h4>
                </div>
                <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  SKU: {parsedProduct.sku} · {parsedProduct.certificationSpec}
                </span>
              </div>

              {/* Editable Auto-Detected Product Title */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">
                    Nombre del Producto Insertado Automáticamente (Editable si deseas personalizar):
                  </label>
                  <input
                    type="text"
                    value={customTitleOverride !== '' ? customTitleOverride : parsedProduct.detectedProductNameES}
                    onChange={(e) => setCustomTitleOverride(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-600"
                  />
                </div>
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">
                    Formato Oficial Ficha Técnica:
                  </label>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-[11px] font-mono tabular-nums text-slate-700 dark:text-slate-300 truncate">
                    {parsedProduct.dimensionsSpec}
                  </div>
                </div>
              </div>

              {/* 4 Exact Material Benefits from Technical Datasheet */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Beneficios Técnicos Vinculados del Material ({parsedProduct.catalogMatch.nameES}):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {parsedProduct.technicalBenefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200/80 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                    >
                      <CheckCircle2 size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="truncate" title={benefit}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP C: Logo, Title & Safe-Zone Composition Rules (Requirements 2 & 4) */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Ruler size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    3. Plantilla de Composición y Zona Segura (1080×1920 px → Central 1080×1350 px)
                  </h4>
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableGraphicOverlay}
                    onChange={(e) => setEnableGraphicOverlay(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Incluir Composición Gráfica (Logo + Título + Ficha)</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Alignment Control */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">
                    Alineación de Logo y Título:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setHeaderAlignment('left')}
                      className={`py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        headerAlignment === 'left'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <AlignLeft size={13} /> Izquierda
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeaderAlignment('center')}
                      className={`py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        headerAlignment === 'center'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <AlignCenter size={13} /> Centrado
                    </button>
                  </div>
                </div>

                {/* Logo Scale Control */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">
                    Escala de Logotipo (Sin Solape):
                  </label>
                  <select
                    value={logoScaleMode}
                    onChange={(e) => setLogoScaleMode(e.target.value as any)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600"
                  >
                    <option value="compact">Compacto (44 px · Margen 68 px)</option>
                    <option value="standard">Estándar (52 px · Margen 68 px)</option>
                    <option value="prominent">Destacado (60 px · Margen 68 px)</option>
                  </select>
                </div>

                {/* Safe Zone Summary */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">
                    Distribución Vertical Fijada:
                  </label>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-[11px] font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    Y: 285px → 1635px (1080×1350)
                  </div>
                </div>
              </div>

              {/* Architectural Photography & Reference Settings */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">
                    Plantilla Óptica Arquitectónica:
                  </label>
                  <select
                    value={selectedArchTemplate}
                    onChange={(e) => setSelectedArchTemplate(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600"
                  >
                    <option value="auto">Detección Óptica Automática ({promptRefiner.detectBestTemplate(imagePrompt, imageStyle, selectedCatalogId).name})</option>
                    {ARCHITECTURAL_TEMPLATES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">
                    Estilo Fotográfico & Resolución:
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={imageStyle}
                      onChange={(e) => setImageStyle(e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600"
                    >
                      <option value="Comercial & Producto 8K">Comercial & Producto 8K</option>
                      <option value="Arquitectura & Espacios Modernos">Arquitectura & Espacios Modernos</option>
                      <option value="Minimalista Editorial de Lujo">Minimalista Editorial de Lujo</option>
                      <option value="Macro Detalle de Texturas">Macro Detalle de Texturas</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setImageResolution(imageResolution === '2K' ? '1K' : '2K')}
                      className="px-3 py-2 rounded-lg border border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold font-mono tabular-nums cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {imageResolution}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Visual Reference Picker */}
            <ImageReferencePicker
              referenceImage={referenceImage}
              onSelectReference={(url) => setReferenceImage(url)}
              availableImages={availableReferences}
              label="Imagen de Referencia Opcional (Muestra Física / Textura del Material)"
              referenceEmailText={referenceEmailText}
              onUpdateEmailText={setReferenceEmailText}
            />

            {/* Primary 1-Step Unified Execution Button (Requirement 5) */}
            <button
              type="button"
              onClick={handleUnifiedGenerateAndCompose}
              disabled={isGeneratingImg || !imagePrompt.trim()}
              className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isGeneratingImg ? (
                <>
                  <Loader2 size={18} className="animate-spin shrink-0" />
                  <span>Ejecutando Flujo Unificado (Producto + Ficha Técnica + Render 1080×1920)...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} className="shrink-0" />
                  <span>Generar Pieza Unificada 1080×1920 px (Zona Segura 1080×1350 px)</span>
                </>
              )}
            </button>

            {statusMessage && !error && (
              <div className="text-xs text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-lg border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {error && (
              <div className="text-xs text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-200 dark:border-red-900/50">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live 1080x1920 Safe-Zone Preview (Central 1080x1350 px) & Export */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-blue-600" />
                  <span>Previsualización en Vivo (1080 × 1920 px)</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Área Segura Central activa: <strong className="font-mono tabular-nums">1080 × 1350 px</strong> (Y: 285 px a 1635 px)
                </p>
              </div>
              <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                9:16 Vertical
              </span>
            </div>

            {/* 9:16 Viewport Container with Interactive 1080x1350 Safe Zone Overlay Guides */}
            <div className="relative mx-auto w-full max-w-[360px] aspect-[9/16] rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-950 shadow-sm">
              {composedPreviewUrl ? (
                <img
                  src={composedPreviewUrl}
                  alt={`Composición ${parsedProduct.detectedProductNameES}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                  Preparando lienzo 1080×1920...
                </div>
              )}

              {/* Visual Safe-Zone Calibration Overlay (285px Top / 1350px Central Safe Area / 285px Bottom) */}
              {showSafeZoneGuides && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
                  {/* Top Unsafe Exclusion Zone: 285 / 1920 = 14.84375% */}
                  <div
                    style={{ height: '14.84375%' }}
                    className="w-full bg-rose-950/45 border-b-2 border-dashed border-amber-400/90 flex items-center justify-center px-3"
                  >
                    <span className="text-[10px] font-mono tabular-nums font-bold text-amber-200 bg-slate-950/80 px-2 py-0.5 rounded">
                      ZONA EXCLUIDA SUPERIOR · 285 px (UI Redes)
                    </span>
                  </div>

                  {/* Central Safe Area: 1350 / 1920 = 70.3125% */}
                  <div
                    style={{ height: '70.3125%' }}
                    className="w-full relative border-x-2 border-dashed border-emerald-400/60"
                  >
                    <div className="absolute top-1.5 right-2 bg-emerald-950/85 border border-emerald-400/60 text-emerald-200 text-[9px] font-mono tabular-nums font-bold px-1.5 py-0.5 rounded">
                      ÁREA SEGURA CENTRAL · 1080 × 1350 px
                    </div>
                  </div>

                  {/* Bottom Unsafe Exclusion Zone: 285 / 1920 = 14.84375% */}
                  <div
                    style={{ height: '14.84375%' }}
                    className="w-full bg-rose-950/45 border-t-2 border-dashed border-amber-400/90 flex items-center justify-center px-3"
                  >
                    <span className="text-[10px] font-mono tabular-nums font-bold text-amber-200 bg-slate-950/80 px-2 py-0.5 rounded">
                      ZONA EXCLUIDA INFERIOR · 285 px (UI Redes)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Download Buttons (Composed 1080x1920 Piece + Base Render) */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadComposed1080x1920}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download size={15} />
                <span>Descargar Pieza Compuesta (1080 × 1920 px · Zona Segura 1080×1350)</span>
              </button>

              {generatedImg && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadRawBaseImage}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Descargar Fotografía Limpia</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setReferenceImage(generatedImg)}
                    className="py-2 px-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Layers size={13} />
                    <span>Usar como Referencia</span>
                  </button>
                </div>
              )}
            </div>

            {/* Applied Prompt & Technical Inspection Drawer */}
            {appliedPrompt && (
              <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center justify-between font-sans">
                  <strong className="text-slate-800 dark:text-slate-200">Prompt Unificado Aplicado:</strong>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Parser + Ficha Activos
                  </span>
                </div>
                <p className="line-clamp-3 hover:line-clamp-none text-[10px] leading-relaxed">{appliedPrompt}</p>
              </div>
            )}
          </div>

          {/* Saved History Gallery */}
          {savedHistory.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Historial de Renders ({savedHistory.length})
                </h4>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Clic para recomponer en 1080×1920
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto p-1">
                {savedHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setGeneratedImg(item.url);
                      if (item.prompt) setImagePrompt(item.prompt);
                      if (item.appliedPrompt) setAppliedPrompt(item.appliedPrompt);
                    }}
                    className={`group relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all aspect-square ${
                      generatedImg === item.url
                        ? 'border-blue-600'
                        : 'border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt="Render guardado"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deep Prompt Fidelity Assistant Modal */}
      <PromptAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        type="image"
        currentPrompt={imagePrompt}
        referenceImage={referenceImage}
        referenceEmailText={referenceEmailText}
        aspectRatio={imageRatio}
        style={imageStyle}
        platform="Instagram Stories & Reels (1080x1920 · Safe Zone 1080x1350)"
        onApplyPrompt={(masterEnglish) => {
          setImagePrompt(masterEnglish);
        }}
      />
    </div>
  );
}
