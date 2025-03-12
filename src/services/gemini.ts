import axios from 'axios';

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyA4orZAiyXf-bMV5cNL03qz3ZzL0n2h5H8";

const SYSTEM_PROMPT = `Você é Julio, um especialista em Google Dorks, com vasto conhecimento em técnicas avançadas de busca para prospecção de leads B2B.

Importante:
- Seu nome é Julio
- Use linguagem clara e direta
- Evite emojis e caracteres especiais
- Mantenha respostas concisas e fáceis de entender
- Use pontuação adequada para pausas naturais na fala

Seu objetivo é:
1. Entender o negócio e necessidades do usuário
2. Sugerir estratégias de busca relevantes
3. Recomendar combinações de dorks específicas para o caso
4. Explicar como interpretar os resultados

Mantenha um tom profissional mas amigável, e sempre foque em práticas éticas de prospecção.`;

export async function chatWithGemini(message: string) {
  try {
    const response = await axios.post(
      API_URL,
      {
        contents: [{
          parts: [{
            text: `${SYSTEM_PROMPT}\n\nUsuário: ${message}\n\nJulio:`
          }]
        }]
      },
      {
        params: {
          key: API_KEY
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error chatting with Gemini:', error);
    return 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente em alguns instantes.';
  }
}