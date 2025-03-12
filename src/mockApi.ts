import { SearchResult } from './types';

// Mock data for search results since we can't use the actual Google API
const mockResults: SearchResult[] = [
  {
    title: "Empresa de Software ABC",
    url: "https://example.com/abc",
    snippet: "Desenvolvemos soluções personalizadas para empresas. Entre em contato conosco para uma demonstração gratuita.",
    phones: ["(11) 98765-4321", "(11) 3456-7890"],
    emails: ["contato@abc.com", "vendas@abc.com"],
    relevance: 95,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&h=120&fit=crop"
  },
  {
    title: "XYZ Tecnologia",
    url: "https://example.com/xyz",
    snippet: "Especialistas em desenvolvimento de software e consultoria em TI. Atendemos em todo o Brasil.",
    phones: ["(21) 98888-7777"],
    emails: ["contato@xyz.com"],
    relevance: 88,
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=120&h=120&fit=crop"
  },
  {
    title: "Tech Solutions Brasil",
    url: "https://example.com/tech",
    snippet: "Soluções em tecnologia para pequenas e médias empresas. Suporte 24/7.",
    phones: ["(11) 97777-8888", "(11) 2222-3333"],
    emails: ["suporte@tech.com.br", "comercial@tech.com.br"],
    relevance: 85,
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&h=120&fit=crop"
  }
];

// Lista de palavras-chave por setor
const industryKeywords = {
  tecnologia: ['software', 'hardware', 'tecnologia', 'ti', 'computador', 'sistema', 'app', 'aplicativo', 'digital', 'internet', 'cloud', 'nuvem', 'erp', 'crm'],
  marketing: ['marketing', 'publicidade', 'propaganda', 'mídia', 'social', 'leads', 'vendas', 'tráfego', 'conversão', 'seo'],
  consultoria: ['consultoria', 'assessoria', 'gestão', 'processos', 'estratégia', 'negócios', 'planejamento'],
  treinamento: ['treinamento', 'curso', 'capacitação', 'desenvolvimento', 'coaching', 'mentoria', 'workshop'],
  servicos: ['serviço', 'outsourcing', 'terceirização', 'manutenção', 'suporte', 'assistência'],
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
  
  const type = text.includes('produto') && text.includes('serviço') ? 'ambos' :
               text.includes('produto') ? 'produto' :
               text.includes('serviço') ? 'servico' : 'ambos';
               
  const segment = identifyIndustry(message);
  
  const locations = text.match(/(?:em|para|na|no|região de)\s+([a-zà-ú\s]+?)(?:\s+|$)/i);
  const location = locations ? locations[1].trim() : '';
  
  const priceMatch = text.match(/(?:R\$\s*|\s)(\d+(?:\.\d{3})*(?:,\d{2})?)/g);
  const priceRange = priceMatch ? priceMatch.join(' - ') : '';
  
  return { type, segment, location, priceRange };
}

export async function mockSearch(keywords: string[], businessContext: string): Promise<SearchResult[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Filter and sort results based on keywords
  const filteredResults = mockResults.map(result => {
    const matchScore = keywords.reduce((score, keyword) => {
      const lowerKeyword = keyword.toLowerCase();
      const matchInTitle = result.title.toLowerCase().includes(lowerKeyword) ? 2 : 0;
      const matchInSnippet = result.snippet.toLowerCase().includes(lowerKeyword) ? 1 : 0;
      return score + matchInTitle + matchInSnippet;
    }, 0);

    return {
      ...result,
      relevance: Math.min(100, (result.relevance || 80) + matchScore * 5)
    };
  });

  return filteredResults.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
}

export async function mockChatResponse(message: string): Promise<{
  response: string;
  keywords: string[];
  businessContext: string;
}> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const context = extractBusinessContext(message);
  let response = '';
  
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
  
  if (context.segment.length > 0) {
    response += `Identificei que você atua no setor de ${context.segment.join(', ')}.\n`;
    response += 'Vou usar técnicas avançadas de busca para encontrar:\n\n';
    response += '✓ Contatos diretos de WhatsApp empresarial\n';
    response += '✓ Emails corporativos de decisores\n';
    response += '✓ Páginas de orçamento/cotação\n';
    response += '✓ Perfis de potenciais compradores qualificados\n\n';
  }

  const tokens = message.toLowerCase().split(/\s+/);
  const keywords = tokens
    .filter(word => word.length > 3)
    .filter(word => !['como', 'para', 'que', 'com', 'dos', 'das', 'por'].includes(word));

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