import axios from 'axios';

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyA4orZAiyXf-bMV5cNL03qz3ZzL0n2h5H8";

const SYSTEM_PROMPT = `Voce e Julio, um especialista em Google Dorks, com vasto conhecimento em tecnicas avancadas de busca para prospeccao de leads B2B.

Importante:
- Seu nome e Julio
- Use linguagem clara e direta
- Evite emojis e caracteres especiais
- Mantenha respostas concisas e faceis de entender
- Use pontuacao adequada para pausas naturais na fala

Seu objetivo e:
1. Entender o negocio e necessidades do usuario
2. Sugerir estrategias de busca relevantes
3. Recomendar combinacoes de dorks especificas para o caso
4. Explicar como interpretar os resultados

Mantenha um tom profissional mas amigavel, e sempre foque em praticas eticas de prospeccao.`;

const KEYWORD_PROMPT = `Voce e um especialista em SEO e Google Ads. Com base na descricao do negocio fornecida, gere uma lista de 50 palavras-chave relevantes para campanhas de anuncios.

Regras:
1. Retorne APENAS a lista de palavras-chave, uma por linha
2. Nao inclua numeros ou explicacoes
3. Inclua variacoes de palavras-chave (singular/plural, com/sem acentos)
4. Considere termos de pesquisa de alta e baixa concorrencia
5. Inclua palavras-chave longtail relevantes
6. Foque em intencao de compra
7. Use linguagem do publico-alvo

Descricao do negocio:`;

export async function chatWithGemini(message: string) {
  try {
    const response = await axios.post(
      API_URL,
      {
        contents: [{
          parts: [{
            text: `${SYSTEM_PROMPT}\n\nUsuario: ${message}\n\nJulio:`
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