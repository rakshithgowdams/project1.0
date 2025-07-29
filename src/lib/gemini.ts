// src/lib/gemini.ts
// This file handles the Magic Prompt enhancement using MDN 1.O Advance model
export const enhancePrompt = async (originalPrompt: string): Promise<string> => {
  const chatHistory = [];
  chatHistory.push({
    role: "user", 
    parts: [{ text: `[MDN 1.O Advance Model] Enhance the following image generation prompt for better results, making it more descriptive and creative, suitable for a text-to-image model. Add artistic details, lighting, composition, and quality terms. Do not include any conversational text, just the enhanced prompt itself. Example: "A cat" -> "A fluffy orange cat sitting on a windowsill, with bright green eyes, in a cozy sunlit room, highly detailed, photorealistic, professional photography, soft natural lighting, 8k resolution."\n\nOriginal prompt: "${originalPrompt}"` }]
  });

  const payload = { contents: chatHistory };
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("MDN 1.O Advance API key not configured. Please set VITE_GEMINI_API_KEY in your environment variables.");
  }
  
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      return result.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected API response structure for Magic Prompt enhancement:", result);
      throw new Error("Failed to enhance prompt with MDN 1.O Advance: Invalid API response.");
    }
  } catch (error: any) {
    console.error("Error calling MDN 1.O Advance API for Magic Prompt:", error);
    throw new Error(`Magic Prompt Error: ${error.message || "Unknown error occurred"}`);
  }
};
