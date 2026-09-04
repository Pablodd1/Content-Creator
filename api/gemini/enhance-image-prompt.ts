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

    const { prompt, style = 'Comercial & Producto 8K', context = '' } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, error: 'Se requiere un prompt para mejorar.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `You are an elite creative director and AI prompt engineer (Midjourney v6, Google Imagen 3, FLUX.1) for high-end brands.
Take this user prompt: "${prompt}".
Style preset: "${style}".
Context/Product: "${context}".

Generate two versions of an ultra-detailed, photorealistic prompt that follows the base prompt but drastically upgrades it into a full creative marketing visual workflow. Specify exact materials, colors, high-end lighting setup (e.g. rim lighting, cinematic volumetrics), camera focal length, atmosphere, sharp focus, and set design composition.
1. A rich Spanish description (marketing visual workflow) for the creative team.
2. A master English prompt (max 120 words) perfectly optimized for image diffusion models.

Return JSON:
{
  "enhancedSpanish": "...",
  "masterEnglish": "..."
}`,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return res.status(200).json({
        success: true,
        enhancedPrompt: parsed.enhancedSpanish || prompt,
        masterEnglish: parsed.masterEnglish || prompt
      });
    } else {
       throw new Error("Respuesta vacía al mejorar prompt");
    }

  } catch (err: any) {
    console.error('Enhance prompt API error:', err);
    return res.status(500).json({ 
      success: false, 
      error: err.message || 'Error processing prompt enhancement' 
    });
  }
}
