import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
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
      throw new Error("GEMINI_API_KEY no está configurada.");
    }
    const ai = new GoogleGenAI({ apiKey });

    const { prompt, platform = 'TikTok' } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt es requerido.' });
    }

    const systemInstruction = `You are an elite creative director and video producer. 
Your task is to take the user's prompt and generate a highly creative, full video production workflow/script for ${platform}.
Structure it as a professional shot list (e.g., [0:00-0:03 HOOK] Visual + Audio, [0:03-0:10 BUILDUP]). 
Include specific instructions for camera movement, lighting, SFX, B-roll, on-screen text, and emotional pacing. 
Do not just write a script; design the full video workflow.
Language: Output strictly in Spanish.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return res.status(200).json({
      success: true,
      script: response.text
    });

  } catch (err: any) {
    console.error('Video Script API error:', err);
    return res.status(500).json({ 
       success: false, 
       error: err.message || 'Error processing video script request' 
     });
  }
}
