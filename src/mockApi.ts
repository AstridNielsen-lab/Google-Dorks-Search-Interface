import { SearchResult } from './types';
import { googleDorks } from './dorks';

// Enhanced mock data with real-world examples
const mockResults: SearchResult[] = [
  {
    title: "Lista de Contatos - Empresas de Tecnologia SP 2024",
    url: "https://example.com/contacts/tech-2024.xlsx",
    snippet: "Lista completa de contatos comerciais de empresas de tecnologia em São Paulo. Inclui emails corporativos, telefones diretos e cargos dos decisores.",
    phones: ["(11) 98765-4321", "(11) 3456-7890"],
    emails: ["comercial@techsp.com.br", "vendas@techsp.com.br"],
    relevance: 95,
    fileType: "xlsx",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&h=120&fit=crop"
  },
  {
    title: "Diretório de Startups - Contatos Comerciais",
    url: "https://example.com/startups/contacts.pdf",
    snippet: "Diretório atualizado de startups brasileiras com dados de contato da equipe comercial e C-level. Atualizado mensalmente.",
    phones: ["(11) 97777-8888", "(11) 94444-5555"],
    emails: ["b2b@startupsp.com.br", "parcerias@startupsp.com.br"],
    relevance: 92,
    fileType: "pdf",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&h=120&fit=crop"
  },
  {
    title: "[INTERNO] Base de Leads TI - Q1 2024.csv",
    url: "https://docs.company.com/internal/leads_ti_2024.csv",
    snippet: "Base de dados com leads qualificados do setor de TI. Inclui informações de contato, tamanho da empresa e tecnologias utilizadas.",
    phones: ["(11) 95555-6666", "(11) 3333-4444"],
    emails: ["ti@empresa.com.br", "tecnologia@empresa.com.br"],
    relevance: 88,
    fileType: "csv",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=120&h=120&fit=crop"
  },
  {
    title: "Formulário de Contato - Departamento Comercial",
    url: "https://empresa.com.br/contato/comercial",
    snippet: "Página de contato direto com a equipe comercial. Atendimento especializado para empresas de médio e grande porte.",
    phones: ["(11) 93333-2222", "(11) 5555-6666"],
    emails: ["comercial@empresa.com.br", "vendas@empresa.com.br"],
    relevance: 85,
    fileType: "webpage",
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=120&h=120&fit=crop"
  },
  {
    title: "Backup_Contatos_Empresariais_2024.xlsx",
    url: "https://backup.company.com/2024/contacts.xlsx",
    snippet: "Backup da base de contatos empresariais do setor de tecnologia. Inclui dados de mais de 1000 empresas.",
    phones: ["(11) 92222-3333", "(11) 4444-5555"],
    emails: ["contatos@empresa.com.br", "database@empresa.com.br"],
    relevance: 82,
    fileType: "xlsx",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=120&h=120&fit=crop"
  }
];

// Enhanced industry keywords with real business terms
const industryKeywords = {
  tecnologia: ['software', 'hardware', 'tecnologia', 'ti', 'computador', 'sistema', 'app', 'aplicativo', 'digital', 'internet', 'cloud', 'nuvem', 'erp', 'crm', 'saas', 'desenvolvimento', 'programação', 'startup', 'inovação'],
  marketing: ['marketing', 'publicidade', 'propaganda', 'mídia', 'social', 'leads', 'vendas', 'tráfego', 'conversão', 'seo', 'ppc', 'analytics', 'performance', 'branding', 'digital'],
  consultoria: ['consultoria', 'assessoria', 'gestão', 'processos', 'estratégia', 'negócios', 'planejamento', 'consultores', 'mentoria', 'coaching'],
  servicos: ['serviço', 'outsourcing', 'terceirização', 'manutenção', 'suporte', 'assistência', 'b2b', 'atendimento', 'help desk']
};

// Real Google Dorks patterns
const dorkPatterns = {
  email: [
    'intext:"@gmail.com"',
    'intext:"@outlook.com"',
    'intext:"@hotmail.com"',
    'intext:"@empresa.com.br"',
    'filetype:csv "email"',
    'filetype:xlsx "email"',
    'filetype:xls "contatos"',
    'intitle:"contatos" "email"'
  ],
  phone: [
    'intext:"(11)"',
    'intext:"(21)"',
    'intext:"(31)"',
    'intext:"whatsapp"',
    'intext:"telefone comercial"',
    'intext:"telefone:"',
    'intext:"celular:"'
  ],
  document: [
    'filetype:pdf "contatos"',
    'filetype:doc "lista de contatos"',
    'filetype:xlsx "base de clientes"',
    'filetype:csv "leads"',
    'filetype:txt "email" "telefone"'
  ],
  contact: [
    'inurl:contato',
    'inurl:fale-conosco',
    'inurl:contact',
    'intitle:"fale conosco"',
    'intitle:"contato comercial"'
  ],
  directory: [
    'intitle:"index of" "contacts.csv"',
    'intitle:"index of" "leads.xlsx"',
    'intitle:"index of" "clientes"',
    'intitle:"index of" "backup"'
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
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const dorkOperators = selectedDorks
    .map(id => {
      const dork = googleDorks.find(d => d.id === id);
      if (!dork) return null;
      
      const patterns = dorkPatterns[dork.category as keyof typeof dorkPatterns] || [];
      return [dork.operator, ...patterns];
    })
    .filter(Boolean)
    .flat();
  
  const filteredResults = mockResults.map(result => {
    let score = 0;
    
    // Keyword matching with enhanced scoring
    keywords.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      if (result.title.toLowerCase().includes(lowerKeyword)) score += 5;
      if (result.snippet.toLowerCase().includes(lowerKeyword)) score += 3;
      if (result.emails.some(email => email.toLowerCase().includes(lowerKeyword))) score += 4;
      if (result.fileType && lowerKeyword.includes(result.fileType)) score += 3;
    });

    // Dork pattern matching with real-world relevance
    dorkOperators.forEach(operator => {
      if (!operator) return;
      const lowerOperator = operator.toLowerCase();
      
      if (result.title.toLowerCase().includes(lowerOperator)) score += 4;
      if (result.snippet.toLowerCase().includes(lowerOperator)) score += 3;
      if (result.fileType && operator.includes(result.fileType)) score += 5;
      if (operator.includes('email') && result.emails.length > 0) score += 4;
      if (operator.includes('telefone') && result.phones.length > 0) score += 4;
      if (operator.includes('contato') && (result.emails.length > 0 || result.phones.length > 0)) score += 3;
    });

    // Business context matching with industry relevance
    const context = extractBusinessContext(businessContext);
    if (context.segment.some(seg => 
      result.title.toLowerCase().includes(seg) || 
      result.snippet.toLowerCase().includes(seg)
    )) {
      score += 5;
    }

    // Location relevance
    if (context.location && 
        (result.title.toLowerCase().includes(context.location.toLowerCase()) || 
         result.snippet.toLowerCase().includes(context.location.toLowerCase()))) {
      score += 4;
    }

    return {
      ...result,
      relevance: Math.min(100, Math.max(50, (result.relevance || 75) + score))
    };
  });

  return filteredResults
    .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
    .slice(0, 5);
}

export async function mockChatResponse(message: string): Promise<{
  response: string;
  keywords: string[];
  businessContext: string;
}> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const context = extractBusinessContext(message);
  let response = '';
  
  if (context.segment.length > 0) {
    response += `📊 Análise do seu negócio:\n\n`;
    response += `Setor identificado: ${context.segment.join(', ')}\n`;
    if (context.location) {
      response += `Região: ${context.location}\n`;
    }
    if (context.type !== 'ambos') {
      response += `Tipo: ${context.type === 'produto' ? 'Produtos' : 'Serviços'}\n`;
    }
    
    response += '\n🎯 Vou buscar:\n\n';
    response += '✓ Emails corporativos de decisores\n';
    response += '✓ Contatos diretos (telefone/WhatsApp)\n';
    response += '✓ Documentos com leads qualificados\n';
    response += '✓ Páginas de contato comercial\n';
    response += '✓ Listas e diretórios empresariais\n\n';
  }

  if (!context.location) {
    response += '💡 Dica: Especifique a região/estado para resultados mais precisos.\n\n';
  }

  const tokens = message.toLowerCase().split(/\s+/);
  const keywords = tokens
    .filter(word => word.length > 3)
    .filter(word => !['como', 'para', 'que', 'com', 'dos', 'das', 'por', 'mais', 'onde'].includes(word));

  context.segment.forEach(industry => {
    keywords.push(...(industryKeywords[industry as keyof typeof industryKeywords] || []));
  });

  const uniqueKeywords = [...new Set(keywords)]
    .filter(keyword => keyword.length > 3)
    .slice(0, 5);
  
  response += `🔍 Palavras-chave principais: ${uniqueKeywords.join(', ')}`;

  return {
    response,
    keywords: uniqueKeywords,
    businessContext: message
  };
}