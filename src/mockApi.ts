import { SearchResult } from './types';
import axios from 'axios';
import * as cheerio from 'cheerio';

const PROXY_URL = 'https://api.scrapestack.com/scrape';
const API_KEY = 'f1b555c9ef6e8f42fe5ff1b2766efc67';

function generateDorkQueries(keywords: string[], businessContext: string): string[] {
  const dorkOperators = [
    `site:.com.br ${businessContext}`,
    `site:.com ${businessContext}`,
    'inurl:contato OR inurl:contatos OR inurl:fale-conosco',
    'intext:whatsapp OR intext:telefone OR intext:celular',
    'intext:comprar OR intext:orçamento OR intext:cotação',
    'intext:email OR intext:contato@'
  ];

  const queries = keywords.flatMap(keyword => {
    return dorkOperators.map(operator => {
      return encodeURIComponent(`"${keyword}" ${operator}`);
    });
  });

  return queries;
}

function extractContactInfo(html: string) {
  const $ = cheerio.load(html);
  const phones: string[] = [];
  const emails: string[] = [];

  // Extrair números de telefone com formato brasileiro
  const phoneRegex = /(?:(?:\+|00)?55\s?)?(?:\(?[1-9][0-9]\)?\s?)?(?:9\s?\d{4}[-\s]?\d{4}|\d{4}[-\s]?\d{4})/g;
  const textContent = $('body').text();
  let match;

  while ((match = phoneRegex.exec(textContent)) !== null) {
    const phone = match[0].replace(/[^\d]/g, '');
    if (phone.length >= 10) { // Validar se é um número de telefone válido (DDD + número)
      phones.push(match[0].trim());
    }
  }

  // Extrair emails
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  while ((match = emailRegex.exec(textContent)) !== null) {
    emails.push(match[0].toLowerCase());
  }

  return { 
    phones: [...new Set(phones)], 
    emails: [...new Set(emails)] 
  };
}

async function searchWithDork(dorkQuery: string): Promise<SearchResult[]> {
  try {
    const response = await axios.get(PROXY_URL, {
      params: {
        access_key: API_KEY,
        url: `https://www.google.com/search?q=${dorkQuery}&num=100`,
        render_js: 1
      }
    });

    const $ = cheerio.load(response.data);
    const results: SearchResult[] = [];

    // Processar resultados do Google
    $('.g').each((_, element) => {
      const titleElement = $(element).find('h3').first();
      const linkElement = $(element).find('a').first();
      const snippetElement = $(element).find('.VwiC3b').first();

      if (titleElement.length && linkElement.length && snippetElement.length) {
        const title = titleElement.text();
        const url = linkElement.attr('href') || '';
        const snippet = snippetElement.text();

        if (title && url.startsWith('http')) {
          const { phones, emails } = extractContactInfo($(element).html() || '');
          
          if (phones.length > 0 || emails.length > 0) {
            results.push({
              title,
              url,
              snippet,
              phones,
              emails,
              relevance: calculateRelevance(snippet, phones, emails)
            });
          }
        }
      }
    });

    return results;
  } catch (error) {
    console.error('Erro na busca:', error);
    return [];
  }
}

function calculateRelevance(snippet: string, phones: string[], emails: string[]): number {
  let score = 0;
  
  // Pontos por ter WhatsApp
  if (phones.some(p => p.includes('9'))) score += 3;
  
  // Pontos por ter email corporativo
  if (emails.some(e => !e.includes('@gmail.com') && !e.includes('@hotmail.com'))) score += 2;
  
  // Pontos por palavras-chave relevantes no snippet
  const relevantTerms = ['comprar', 'orçamento', 'cotação', 'venda', 'atacado', 'varejo'];
  relevantTerms.forEach(term => {
    if (snippet.toLowerCase().includes(term)) score += 1;
  });

  return score;
}

export async function mockSearch(keywords: string[], businessContext: string): Promise<SearchResult[]> {
  const dorkQueries = generateDorkQueries(keywords, businessContext);
  const allResults: SearchResult[] = [];

  // Realizar buscas em paralelo com limite de 3 requisições simultâneas
  for (let i = 0; i < dorkQueries.length; i += 3) {
    const batch = dorkQueries.slice(i, i + 3);
    const batchResults = await Promise.all(
      batch.map(query => searchWithDork(query))
    );
    
    allResults.push(...batchResults.flat());
  }

  // Remover duplicatas e ordenar por relevância
  const uniqueResults = [...new Map(allResults.map(item => [item.url, item])).values()]
    .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
    .slice(0, 20); // Aumentar para 20 resultados mais relevantes

  return uniqueResults;
}

export async function mockChatResponse(message: string): Promise<{
  response: string;
  keywords: string[];
  businessContext: string;
}> {
  // Análise do contexto do negócio
  const businessTerms = {
    produto: message.includes('produto'),
    serviço: message.includes('serviço'),
    atacado: message.includes('atacado'),
    varejo: message.includes('varejo')
  };

  let response = 'Para ajudar você a encontrar os melhores leads, preciso de algumas informações:\n\n';

  if (!message.includes('produto') && !message.includes('serviço')) {
    response += '1. Você está buscando clientes para produtos ou serviços?\n';
  }
  
  if (!message.includes('região') && !message.includes('estado') && !message.includes('cidade')) {
    response += '2. Qual região/estado/cidade você quer focar?\n';
  }
  
  if (!message.includes('preço') && !message.includes('valor') && !message.includes('investimento')) {
    response += '3. Qual a faixa de preço/investimento do seu produto/serviço?\n';
  }

  // Extrair palavras-chave relevantes
  const keywords = message.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['como', 'para', 'que', 'com', 'dos', 'das', 'por'].includes(word));

  // Construir contexto de negócio
  const businessContext = [
    businessTerms.produto ? 'comprar produto' : '',
    businessTerms.serviço ? 'contratar serviço' : '',
    businessTerms.atacado ? 'atacado' : '',
    businessTerms.varejo ? 'varejo' : ''
  ].filter(Boolean).join(' OR ');

  response += '\nVou usar técnicas avançadas de Google Dorks para encontrar:\n';
  response += '✓ Contatos diretos de WhatsApp\n';
  response += '✓ Emails corporativos\n';
  response += '✓ Páginas de contato empresariais\n';
  response += '✓ Perfis de potenciais compradores\n\n';
  response += `KEYWORDS: ${keywords.join(', ')}`;

  return {
    response,
    keywords: keywords.slice(0, 5),
    businessContext
  };
}