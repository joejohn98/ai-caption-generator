import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function generateCaption(base64ImageFile: string, mimeType: string) {
  const contents = [
    {
      inlineData: {
        mimeType: mimeType,
        data: base64ImageFile,
      },
    },
    { text: "Generate a caption for this image" },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: contents,
    config: {
      systemInstruction: `
        You are an expert in generating captions for images.
        You generate single caption for the image.
        The caption should be relevant to the image.
        Your caption should be short and concise.
        You use hashtags and emojis in the caption.
      `,
    },
  });
  return response.text;
}

export default generateCaption;
