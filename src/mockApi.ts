import { SearchResult } from './types';

// Mock data para simular resultados de busca
const mockResults: SearchResult[] = [
  {
    title: "Tech Solutions Ltda",
    url: "https://techsolutions.com.br",
    snippet: "Empresa especializada em soluções de software e consultoria em TI. Entre em contato para um orçamento.",
    phones: ["(11) 99999-8888", "(11) 3333-4444"],
    emails: ["contato@techsolutions.com.br"],
    relevance: 8
  },
  {
    title: "Construtora Inovação",
    url: "https://construtorainovacao.com.br",
    snippet: "Construção civil e reformas comerciais. Solicite um orçamento pelo WhatsApp.",
    phones: ["(11) 98888-7777"],
    emails: ["orcamento@construtorainovacao.com.br"],
    relevance: 7
  },
  {
    title: "Clínica Saúde Total",
    url: "https://clinicasaudetotal.com.br",
    snippet: "Atendimento médico especializado. Agende sua consulta online ou por WhatsApp.",
    phones: ["(11) 97777-6666", "(11) 2222-3333"],
    emails: ["agendamento@clinicasaudetotal.com.br"],
    relevance: 6
  }
];

// Lista de palavras-chave por setor
const industryKeywords = {
  tecnologia: ['software', 'hardware', 'tecnologia', 'ti', 'computador', 'sistema', 'app', 'aplicativo', 'digital', 'internet'],
  saude: ['saúde', 'médico', 'hospital', 'clínica', 'consultório', 'tratamento', 'exame', 'diagnóstico'],
  construcao: ['construção', 'obra', 'reforma', 'material', 'engenharia', 'arquitetura', 'projeto'],
  educacao: ['escola', 'curso', 'educação', 'ensino', 'professor', 'aula', 'treinamento', 'capacitação'],
  varejo: ['loja', 'comércio', 'venda', 'produto', 'atacado', 'varejo', 'distribuidor', 'revenda'],
  servicos: ['serviço', 'consultoria', 'assessoria', 'manutenção', 'suporte', 'assistência'],
};

function identifyIndustry(message: string): string[] {
  const tokens = message.toLowerCase().split(/\s+/);
  const industries: string[] = [];
  
  Object.entries(industryKeywords).forEach(([industry, keywords]) => {
    if (keywords.some(keyword => tokens.includes(keyword))) {
      industries.push(industry);
    }
  });
  
  return industries;
}

function extractBusinessContext(message: string): {
  type: 'produto' | 'servico' | 'ambos';
  segment: string[];
  location: string;
  priceRange: string;
} {
  const text = message.toLowerCase();
  
  // Identificar tipo de negócio
  const type = text.includes('produto') && text.includes('serviço') ? 'ambos' :
               text.includes('produto') ? 'produto' :
               text.includes('serviço') ? 'servico' : 'ambos';
               
  // Identificar segmento
  const segment = identifyIndustry(message);
  
  // Identificar localização
  const locations = text.match(/(?:em|para|na|no|região de)\s+([a-zà-ú\s]+?)(?:\s+|$)/i);
  const location = locations ? locations[1].trim() : '';
  
  // Identificar faixa de preço
  const priceMatch = text.match(/(?:R\$\s*|\s)(\d+(?:\.\d{3})*(?:,\d{2})?)/g);
  const priceRange = priceMatch ? priceMatch.join(' - ') : '';
  
  return { type, segment, location, priceRange };
}

export async function mockSearch(keywords: string[], businessContext: string): Promise<SearchResult[]> {
  // Simular delay da rede
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Filtrar resultados baseado nas palavras-chave
  const context = extractBusinessContext(businessContext);
  const filteredResults = mockResults.filter(result => {
    const resultText = `${result.title} ${result.snippet}`.toLowerCase();
    return keywords.some(keyword => resultText.includes(keyword.toLowerCase())) ||
           context.segment.some(segment => resultText.includes(segment));
  });

  return filteredResults.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
}

export async function mockChatResponse(message: string): Promise<{
  response: string;
  keywords: string[];
  businessContext: string;
}> {
  // Simular delay da rede
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const context = extractBusinessContext(message);
  let response = '';
  
  // Construir resposta baseada no contexto
  if (!context.type || context.type === 'ambos') {
    response += 'Para ajudar melhor, preciso saber: você está buscando clientes para produtos ou serviços?\n\n';
  }
  
  if (!context.location) {
    response += 'Em qual região/estado/cidade você quer focar?\n\n';
  }
  
  if (!context.priceRange) {
    response += 'Qual a faixa de preço do seu produto/serviço?\n\n';
  }
  
  if (context.segment.length === 0) {
    response += 'Pode me contar mais sobre seu setor de atuação?\n\n';
  }
  
  // Adicionar sugestões baseadas no que já foi identificado
  if (context.segment.length > 0) {
    response += `Identificei que você atua no setor de ${context.segment.join(', ')}.\n`;
    response += 'Vou usar técnicas avançadas de busca para encontrar:\n\n';
    response += '✓ Contatos diretos de WhatsApp empresarial\n';
    response += '✓ Emails corporativos de decisores\n';
    response += '✓ Páginas de orçamento/cotação\n';
    response += '✓ Perfis de potenciais compradores qualificados\n\n';
  }

  // Extrair palavras-chave relevantes
  const tokens = message.toLowerCase().split(/\s+/);
  const keywords = tokens
    .filter(word => word.length > 3)
    .filter(word => !['como', 'para', 'que', 'com', 'dos', 'das', 'por'].includes(word));

  // Adicionar palavras-chave do setor
  context.segment.forEach(industry => {
    keywords.push(...(industryKeywords[industry as keyof typeof industryKeywords] || []));
  });

  const uniqueKeywords = [...new Set(keywords)].slice(0, 5);
  
  response += `Palavras-chave identificadas: ${uniqueKeywords.join(', ')}`;

  return {
    response,
    keywords: uniqueKeywords,
    businessContext: message
  };
}