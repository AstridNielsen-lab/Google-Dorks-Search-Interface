import axios from 'axios';

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyA4orZAiyXf-bMV5cNL03qz3ZzL0n2h5H8";

const SYSTEM_PROMPT = `Você é um assistente especializado em agendamentos. Mantenha um tom profissional e amigável.

Regras importantes:
1. Use linguagem natural e fluida
2. Evite caracteres especiais ou formatação
3. Mantenha respostas diretas e claras
4. Use apenas pontuação básica
5. Foque em ajudar com agendamentos

Seu objetivo é:
1. Entender a necessidade do usuário
2. Guiar pelo processo de agendamento
3. Esclarecer dúvidas
4. Dar informações relevantes`;

const KEYWORD_PROMPT = `Você é um especialista em SEO e Google Ads. Com base na descrição do negócio fornecida, gere uma lista de 50 palavras-chave relevantes para campanhas de anúncios.

Regras:
1. Retorne APENAS a lista de palavras-chave, uma por linha
2. Não inclua números ou explicações
3. Inclua variações de palavras-chave
4. Considere termos de pesquisa relevantes
5. Use linguagem natural
6. Foque em intenção de busca
7. Use linguagem do público-alvo

Descrição do negócio:`;

const SCHEDULE_PROMPT = `Você é um assistente especializado em agendamentos. Analise o tipo de atendimento solicitado e forneça recomendações específicas.

Considere:
1. Urgência do atendimento
2. Horários mais adequados
3. Documentos necessários
4. Preparação recomendada
5. Informações importantes

Use linguagem natural e evite caracteres especiais.

Tipo de atendimento:`;

export async function chatWithGemini(message: string) {
  try {
    const response = await axios.post(
      API_URL,
      {
        contents: [{
          parts: [{
            text: `${SYSTEM_PROMPT}\n\nUsuário: ${message}\n\nAssistente:`
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

export async function getSchedulingRecommendations(serviceType: string): Promise<string> {
  try {
    const response = await axios.post(
      API_URL,
      {
        contents: [{
          parts: [{
            text: `${SCHEDULE_PROMPT}\n\n${serviceType}`
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
    console.error('Error getting scheduling recommendations:', error);
    return 'Não foi possível obter recomendações no momento. Por favor, continue com o agendamento.';
  }
}