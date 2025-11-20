import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY is missing");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const generateBookContent = async (prompt: string, currentContext: string = "") => {
    const client = getClient();
    if (!client) return { text: "Erro: Chave de API não encontrada. Verifique as configurações do ambiente (Vercel)." };

    try {
        const model = "gemini-2.5-flash";
        const fullPrompt = `
        Você é um assistente de escrita criativa profissional e premiado.
        
        Contexto atual da história:
        ${currentContext}
        
        Instrução do usuário:
        ${prompt}
        
        Escreva a continuação da história ou o conteúdo solicitado de forma envolvente, mantendo o tom e estilo.
        Retorne apenas o texto da história, sem preâmbulos.
        `;

        const response = await client.models.generateContent({
            model: model,
            contents: fullPrompt,
        });

        return { text: response.text };
    } catch (error) {
        console.error("Error generating content:", error);
        return { text: "Desculpe, ocorreu um erro ao gerar o conteúdo. Tente novamente." };
    }
};

export const suggestBookTitles = async (synopsis: string) => {
    const client = getClient();
    if (!client) return [];

    try {
        const model = "gemini-2.5-flash";
        const prompt = `Gere 5 sugestões de títulos criativos e comerciais para um livro com a seguinte sinopse: "${synopsis}". Retorne apenas a lista de títulos em formato JSON array de strings e nada mais.`;
        
        const response = await client.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        const jsonText = response.text;
        if(jsonText) {
            return JSON.parse(jsonText) as string[];
        }
        return [];

    } catch (error) {
        console.error("Error suggesting titles:", error);
        return [];
    }
};

// --- TTS & Audio Decoding Helpers ---

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const generateBookAudio = async (text: string, audioContext: AudioContext): Promise<AudioBuffer | null> => {
    const client = getClient();
    if (!client) {
        console.error("Gemini Client not initialized (missing API Key?)");
        return null;
    }

    try {
        // Truncate text to avoid token limits for this demo if text is huge
        // Also ensure text is not empty/whitespace
        const safeText = text ? text.trim().substring(0, 2000) : "";
        
        if (!safeText) return null;

        const response = await client.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: safeText }] }],
            config: {
                // Using string 'AUDIO' instead of Enum to avoid build issues in production envs
                responseModalities: ['AUDIO' as any], 
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore is a good storytelling voice
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        
        if (!base64Audio) {
            console.error("No audio data in response");
            return null;
        }

        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            audioContext,
            24000, // Sample rate for this model
            1,
        );

        return audioBuffer;

    } catch (error) {
        console.error("Error generating audio:", error);
        return null;
    }
};