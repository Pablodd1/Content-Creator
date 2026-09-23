import { GoogleGenAI } from "@google/genai";
import { promptRefiner } from "../../src/services/promptRefiner";

export default async function handler(req: any, res: any) {
  // CORS configuration for Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY no está configurada en las variables de entorno de Vercel.");
    }

    const { 
      prompt, 
      aspectRatio = '1:1', 
      style = 'Comercial & Producto 8K', 
      referenceImage,
      referenceEmailText = '',
      architecturalTemplateId,
      architecturalOverrides 
    } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, error: 'Se requiere una descripción (prompt) para generar la imagen.' });
    }

    const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const finalRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    const ai = new GoogleGenAI({ apiKey });

    // Step 1: Intercept raw visual request with Prompt Refiner service
    const refinerResult = await promptRefiner.refinePromptWithArchitecturalTemplates({
      rawPrompt: prompt.trim(),
      templateId: architecturalTemplateId,
      aspectRatio: finalRatio,
      style,
      referenceImage,
      referenceEmailText,
      customOverrides: architecturalOverrides
    }, ai);

    const englishDiffusionPrompt = refinerResult.refinedEnglishPrompt;

    // Step 2: Google Gemini Image Generation
    const contentParts: any[] = [];
    if (referenceImage && typeof referenceImage === 'string') {
      let mimeType = 'image/png';
      let base64Data = referenceImage;
      if (referenceImage.includes(';base64,')) {
        const splitData = referenceImage.split(';base64,');
        mimeType = splitData[0].replace('data:', '') || 'image/png';
        base64Data = splitData[1];
      }
      contentParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
    }
    contentParts.push({ text: englishDiffusionPrompt });

    let foundImageUrl = '';
    let usedModel = 'gemini-3.1-flash-image';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: {
          parts: contentParts
        },
        config: {
          imageConfig: {
            aspectRatio: finalRatio as any,
            imageSize: '1K'
          }
        }
      });

      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            foundImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (primaryErr: any) {
      console.warn('Fallback to gemini-3.1-flash-lite-image:', primaryErr.message);
      usedModel = 'gemini-3.1-flash-lite-image';
      const fallbackRes = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: contentParts
        },
        config: {
          imageConfig: {
            aspectRatio: finalRatio as any
          }
        }
      });
      if (fallbackRes.candidates && fallbackRes.candidates[0]?.content?.parts) {
        for (const part of fallbackRes.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            foundImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    }

    if (foundImageUrl) {
      return res.status(200).json({ 
        success: true, 
        imageUrl: foundImageUrl,
        model: usedModel,
        appliedPrompt: englishDiffusionPrompt,
        refinedPrompt: refinerResult?.refinedSpanishPrompt,
        architecturalSpecs: refinerResult?.architecturalSpecs,
        templateUsed: refinerResult?.templateUsed,
        promptRefinerActive: true,
        hasReference: !!referenceImage,
        notice: `Imagen generada con el servicio Prompt Refiner Arquitectónico (${refinerResult?.templateUsed?.name || 'Profesional'}).`
      });
    } else {
       throw new Error("No image data returned from Gemini API");
    }

  } catch (error: any) {
    console.error('Image generation route error:', error);
    res.status(500).json({ success: false, error: error.message || 'Error generating image' });
  }
}
