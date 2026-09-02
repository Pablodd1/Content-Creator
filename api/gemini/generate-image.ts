import { GoogleGenAI } from "@google/genai";

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

    const { prompt, aspectRatio = '1:1', style = 'Comercial & Producto 8K' } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, error: 'Se requiere una descripción (prompt) para generar la imagen.' });
    }

    const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const finalRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    const ai = new GoogleGenAI({ apiKey });

    // Step 1: Translate and enrich prompt to English
    let englishDiffusionPrompt = prompt.trim();
    try {
      const transRes = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `Translate and optimize this image generation prompt into English for high-end photorealistic image generation (FLUX / Imagen 3). Ensure all specific objects, materials, architectural finishes, colors, textures, and lighting from the prompt are strictly preserved and described with crystal clarity. Style: ${style}. User prompt: "${prompt}". Output ONLY the optimized English prompt string, no quotes, no markdown.`
      });
      if (transRes.text && transRes.text.trim().length > 10) {
        englishDiffusionPrompt = transRes.text.trim();
      }
    } catch (transErr: any) {
      console.warn('Prompt translation fallback:', transErr?.message || transErr);
    }

    // Step 2: Google Gemini Image Generation
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image',
      contents: {
        parts: [{ text: englishDiffusionPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: finalRatio as any,
          imageSize: '1K'
        }
      }
    });

    let foundImageUrl = '';
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          foundImageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (foundImageUrl) {
      return res.status(200).json({ 
        success: true, 
        imageUrl: foundImageUrl,
        model: 'gemini-3.1-flash-image',
        appliedPrompt: englishDiffusionPrompt,
        notice: 'Imagen generada con alta fidelidad mediante Google Gemini Imagen.'
      });
    } else {
       throw new Error("No image data returned from Gemini API");
    }

  } catch (error: any) {
    console.error('Image generation route error:', error);
    res.status(500).json({ success: false, error: error.message || 'Error generating image' });
  }
}
