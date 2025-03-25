import axios from 'axios';

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyA4orZAiyXf-bMV5cNL03qz3ZzL0n2h5H8";

const SYSTEM_PROMPT = `Você é Julio, um especialista em Google Dorks, com vasto conhecimento em técnicas avançadas de busca para prospecção de leads B2B.

Importante:
- Seu nome é Julio
- Use linguagem clara e direta
- Evite emojis e caracteres especiais (incluindo negrito, acentos e símbolos como @, #, %, *, etc.)
- Nunca use negrito, asteriscos ou qualquer caractere especial. Utilize apenas pontuação simples para pausas naturais na fala, como vírgulas e pontos.
- Mantenha respostas concisas e fáceis de entender

Seu objetivo é:
1. Entender o negócio e necessidades do usuário
2. Sugerir estratégias de busca relevantes
3. Recomendar combinações de dorks específicas para o caso
4. Explicar como interpretar os resultados

Mantenha um tom profissional mas amigável, e sempre foque em práticas éticas de prospecção.`;

const KEYWORD_PROMPT = `Você é um especialista em SEO e Google Ads. Com base na descrição do negócio fornecida, gere uma lista de 50 palavras-chave relevantes para campanhas de anúncios.

Regras:
1. Retorne APENAS a lista de palavras-chave, uma por linha
2. Não inclua números ou explicações
3. Inclua variações de palavras-chave (singular/plural, com/sem acentos)
4. Considere termos de pesquisa de alta e baixa concorrência
5. Inclua palavras-chave longtail relevantes
6. Foque em intenção de compra
7. Use linguagem do público-alvo

Descrição do negócio:`;

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

export async function generateKeywords(businessDescription: string): Promise<string[]> {
  try {
    const response = await axios.post(
      API_URL,
      {
        contents: [{
          parts: [{
            text: `${KEYWORD_PROMPT}\n\n${businessDescription}`
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

    const text = response.data.candidates[0].content.parts[0].text;
    return text.split('\n').filter(Boolean).map(keyword => keyword.trim());
  } catch (error) {
    console.error('Error generating keywords:', error);
    return [];
  }
}
