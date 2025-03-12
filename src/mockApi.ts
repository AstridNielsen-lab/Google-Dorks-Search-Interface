import { SearchResult } from './types';
import { googleDorks } from './dorks';

// Enhanced mock data for search results with more realistic data
const mockResults: SearchResult[] = [
  {
    title: "Lista de Contatos - Empresas de Tecnologia 2024",
    url: "https://example.com/contacts/tech-2024.xlsx",
    snippet: "Planilha com dados de contato de empresas de tecnologia, incluindo emails corporativos e telefones de decisores.",
    phones: ["(11) 98765-4321", "(11) 3456-7890", "(11) 97777-8888"],
    emails: ["contato@techcorp.com", "vendas@techcorp.com", "comercial@techcorp.com"],
    relevance: 95,
    fileType: "xlsx",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&h=120&fit=crop"
  },
  {
    title: "Painel Administrativo - Cadastro de Clientes",
    url: "https://example.com/admin/clients",
    snippet: "Sistema interno com cadastro de clientes e leads qualificados do setor de marketing digital.",
    phones: ["(21) 98888-7777", "(21) 2222-3333"],
    emails: ["admin@marketing.com", "leads@marketing.com"],
    relevance: 92,
    fileType: "webpage",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&h=120&fit=crop"
  },
  {
    title: "Backup_Contatos_2024.csv",
    url: "https://example.com/data/backup/contacts.csv",
    snippet: "Arquivo CSV contendo lista completa de contatos empresariais, incluindo nome, cargo, email e telefone.",
    phones: ["(31) 97777-8888", "(31) 2222-3333"],
    emails: ["diretor@empresa.com", "gerente@empresa.com"],
    relevance: 88,
    fileType: "csv",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=120&h=120&fit=crop"
  },
  {
    title: "Formulário de Contato - Empresa XYZ",
    url: "https://example.com/xyz/contact",
    snippet: "Página de contato com informações completas da equipe comercial e suporte.",
    phones: ["(11) 95555-4444", "(11) 3333-2222"],
    emails: ["comercial@xyz.com", "suporte@xyz.com"],
    relevance: 85,
    fileType: "webpage",
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=120&h=120&fit=crop"
  },
  {
    title: "Lista_Leads_Qualificados.pdf",
    url: "https://example.com/marketing/leads.pdf",
    snippet: "Documento PDF com leads qualificados do setor de tecnologia e marketing digital.",
    phones: ["(11) 94444-3333", "(11) 5555-6666"],
    emails: ["marketing@leads.com", "vendas@leads.com"],
    relevance: 82,
    fileType: "pdf",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=120&h=120&fit=crop"
  }
];

// Enhanced industry keywords
const industryKeywords = {
  tecnologia: ['software', 'hardware', 'tecnologia', 'ti', 'computador', 'sistema', 'app', 'aplicativo', 'digital', 'internet', 'cloud', 'nuvem', 'erp', 'crm', 'saas', 'desenvolvimento'],
  marketing: ['marketing', 'publicidade', 'propaganda', 'mídia', 'social', 'leads', 'vendas', 'tráfego', 'conversão', 'seo', 'ppc', 'analytics'],
  consultoria: ['consultoria', 'assessoria', 'gestão', 'processos', 'estratégia', 'negócios', 'planejamento', 'consultores'],
  treinamento: ['treinamento', 'curso', 'capacitação', 'desenvolvimento', 'coaching', 'mentoria', 'workshop', 'educação'],
  servicos: ['serviço', 'outsourcing', 'terceirização', 'manutenção', 'suporte', 'assistência', 'b2b']
};

// Enhanced dork patterns for better search results
const dorkPatterns = {
  email: [
    'intext:"@"',
    'intext:"email"',
    'intext:"contato"',
    'filetype:csv "email"',
    'filetype:xlsx "email"'
  ],
  phone: [
    'intext:"telefone"',
    'intext:"whatsapp"',
    'intext:"celular"',
    'intext:"(11)"',
    'intext:"(21)"',
    'intext:"(31)"'
  ],
  document: [
    'filetype:pdf',
    'filetype:doc',
    'filetype:docx',
    'filetype:xlsx',
    'filetype:csv'
  ],
  contact: [
    'inurl:contato',
    'inurl:contact',
    'intitle:"fale conosco"',
    'inurl:form'
  ]
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

export async function mockSearch(keywords: string[], businessContext: string, selectedDorks: string[] = []): Promise<SearchResult[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get dork operators and patterns
  const dorkOperators = selectedDorks
    .map(id => {
      const dork = googleDorks.find(d => d.id === id);
      if (!dork) return null;
      
      // Get additional patterns based on dork category
      const patterns = dorkPatterns[dork.category as keyof typeof dorkPatterns] || [];
      return [dork.operator, ...patterns];
    })
    .filter(Boolean)
    .flat();
  
  // Filter and sort results based on keywords, dorks, and business context
  const filteredResults = mockResults.map(result => {
    let score = 0;
    
    // Keyword matching
    keywords.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      if (result.title.toLowerCase().includes(lowerKeyword)) score += 3;
      if (result.snippet.toLowerCase().includes(lowerKeyword)) score += 2;
      if (result.emails.some(email => email.toLowerCase().includes(lowerKeyword))) score += 2;
    });

    // Dork operator matching
    dorkOperators.forEach(operator => {
      if (!operator) return;
      const lowerOperator = operator.toLowerCase();
      
      if (result.title.toLowerCase().includes(lowerOperator)) score += 3;
      if (result.snippet.toLowerCase().includes(lowerOperator)) score += 2;
      if (result.fileType && operator.includes(result.fileType)) score += 4;
      if (operator.includes('email') && result.emails.length > 0) score += 3;
      if (operator.includes('telefone') && result.phones.length > 0) score += 3;
    });

    // Business context matching
    const context = extractBusinessContext(businessContext);
    if (context.segment.some(seg => 
      result.title.toLowerCase().includes(seg) || 
      result.snippet.toLowerCase().includes(seg)
    )) {
      score += 4;
    }

    return {
      ...result,
      relevance: Math.min(100, (result.relevance || 80) + score)
    };
  });

  return filteredResults
    .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
    .slice(0, 10); // Limit to top 10 most relevant results
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
    response += '✓ Documentos com leads qualificados\n';
    response += '✓ Perfis de potenciais compradores\n\n';
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