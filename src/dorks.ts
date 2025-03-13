import { GoogleDork } from './types';

export const googleDorks: GoogleDork[] = [
  // Filtros de Localização
  {
    id: 'brazil',
    operator: 'site:.br',
    description: 'Apenas sites do Brasil',
    category: 'location'
  },
  {
    id: 'state-sp',
    operator: '(São Paulo OR SP) "CEP" OR "Estado: SP"',
    description: 'Localização: São Paulo',
    category: 'location'
  },
  {
    id: 'state-rj',
    operator: '(Rio de Janeiro OR RJ) "CEP" OR "Estado: RJ"',
    description: 'Localização: Rio de Janeiro',
    category: 'location'
  },
  {
    id: 'state-mg',
    operator: '(Minas Gerais OR MG) "CEP" OR "Estado: MG"',
    description: 'Localização: Minas Gerais',
    category: 'location'
  },

  // Filtros de Contato
  {
    id: 'email-corporate',
    operator: 'intext:"@" -gmail -hotmail -yahoo -outlook',
    description: 'Emails corporativos',
    category: 'contact'
  },
  {
    id: 'phone-landline',
    operator: 'intext:"(11)" OR intext:"(21)" OR intext:"(31)" "telefone fixo"',
    description: 'Telefones fixos comerciais',
    category: 'contact'
  },
  {
    id: 'phone-mobile',
    operator: 'intext:"whatsapp" OR intext:"celular comercial"',
    description: 'Celulares comerciais',
    category: 'contact'
  },
  {
    id: 'contact-page',
    operator: 'intitle:"contato" OR intitle:"fale conosco" OR inurl:contato',
    description: 'Páginas de contato',
    category: 'contact'
  },

  // Filtros de Documentos
  {
    id: 'spreadsheet',
    operator: 'filetype:xlsx OR filetype:xls intitle:"contatos" OR intitle:"leads"',
    description: 'Planilhas Excel',
    category: 'document'
  },
  {
    id: 'pdf-contacts',
    operator: 'filetype:pdf "lista de contatos" OR "catálogo" OR "diretório"',
    description: 'Documentos PDF',
    category: 'document'
  },
  {
    id: 'csv-database',
    operator: 'filetype:csv "email,nome,telefone" OR "contatos"',
    description: 'Bases em CSV',
    category: 'document'
  },
  {
    id: 'price-list',
    operator: 'filetype:pdf OR filetype:xlsx "tabela de preços" OR "lista de preços"',
    description: 'Tabelas de preços',
    category: 'document'
  },

  // Filtros de Domínio
  {
    id: 'domain-gov',
    operator: 'site:.gov.br',
    description: 'Sites governamentais',
    category: 'domain'
  },
  {
    id: 'domain-edu',
    operator: 'site:.edu.br',
    description: 'Instituições educacionais',
    category: 'domain'
  },
  {
    id: 'domain-org',
    operator: 'site:.org.br',
    description: 'Organizações',
    category: 'domain'
  },
  {
    id: 'domain-com',
    operator: 'site:.com.br',
    description: 'Sites comerciais',
    category: 'domain'
  },

  // Filtros de Redes Sociais
  {
    id: 'linkedin',
    operator: 'site:linkedin.com/in/ "Brasil"',
    description: 'Perfis do LinkedIn',
    category: 'social'
  },
  {
    id: 'facebook-business',
    operator: 'site:facebook.com/pages/ "empresa"',
    description: 'Páginas empresariais',
    category: 'social'
  },
  {
    id: 'instagram-business',
    operator: 'site:instagram.com "empresa" OR "business"',
    description: 'Perfis empresariais',
    category: 'social'
  },

  // Filtros Técnicos
  {
    id: 'directory',
    operator: 'intitle:"index of" "contacts.csv" OR "leads.xlsx"',
    description: 'Diretórios abertos',
    category: 'technical'
  },
  {
    id: 'exposed-data',
    operator: 'inurl:admin OR inurl:backup "contacts" OR "users" OR "clientes"',
    description: 'Dados expostos',
    category: 'technical'
  }
];

export const databaseDorks = [
  {
    id: 'edu-database',
    operator: 'site:.edu filetype:xls "root" database',
    description: 'Educational Database Files',
    author: 'defaltredmode',
    date: '2024-07-04'
  },
  {
    id: 'test-database-logs',
    operator: '"START test_database" ext:log',
    description: 'Database Test Logs',
    author: 'Nadir Boulacheb (RubX)',
    date: '2024-05-13'
  },
  {
    id: 'database-properties',
    operator: 'intitle:"index of" database.properties',
    description: 'Database Properties Files',
    author: 'Odela Rohith',
    date: '2024-01-23'
  },
  {
    id: 'database-json',
    operator: 'inurl:"/database.json"',
    description: 'Database JSON Files',
    author: 'Raouf',
    date: '2023-11-07'
  },
  {
    id: 'databases-directory',
    operator: 'intitle:"Index of /databases"',
    description: 'Database Directories',
    author: 'Sayed Recover',
    date: '2023-11-01'
  },
  {
    id: 'joomla-database',
    operator: 'inurl: /libraries/joomla/database/',
    description: 'Joomla Database Files',
    author: 'Mark Ivan David',
    date: '2023-05-08'
  },
  {
    id: 'database-sql',
    operator: 'intitle:"index of" "database.sql"',
    description: 'SQL Database Files',
    author: 'Prathamesh Pawar',
    date: '2023-03-14'
  },
  {
    id: 'database-migrations',
    operator: 'intitle:"index of /database/migrations"',
    description: 'Database Migration Files',
    author: 'Shuvrosayar Das',
    date: '2023-01-31'
  },
  {
    id: 'database-backup-sql',
    operator: 'intitle:"database" "backup" filetype:sql',
    description: 'Database Backup Files',
    author: 'Onkar Deshmukh',
    date: '2021-11-08'
  },
  {
    id: 'database-sql-files',
    operator: 'Intitle:database ext:sql',
    description: 'SQL Database Files',
    author: 'Veeresh Appasaheb Patil',
    date: '2021-11-05'
  },
  {
    id: 'database-py',
    operator: 'intitle:"index of" "database.py"',
    description: 'Python Database Files',
    author: 'J. Igor Melo',
    date: '2021-09-22'
  },
  {
    id: 'phpmyadmin-databases',
    operator: 'site:*/phpmyadmin/server_databases.php',
    description: 'phpMyAdmin Database Pages',
    author: 'Reza Abasi',
    date: '2021-06-11'
  }
];

export const dorkCategories = {
  location: 'Localização',
  contact: 'Contatos',
  document: 'Documentos',
  domain: 'Domínios',
  social: 'Redes Sociais',
  technical: 'Técnico'
};

export const smartSearches = [
  {
    id: 'b2b-contacts',
    name: 'Contatos B2B',
    description: 'Encontra listas de contatos empresariais',
    dorks: ['email-corporate', 'phone-landline', 'spreadsheet', 'domain-com'],
  },
  {
    id: 'decision-makers',
    name: 'Decisores',
    description: 'Localiza contatos de diretores e gestores',
    dorks: ['linkedin', 'email-corporate', 'domain-com'],
  },
  {
    id: 'tech-companies',
    name: 'Empresas de Tecnologia',
    description: 'Busca empresas do setor de tecnologia',
    dorks: ['state-sp', 'email-corporate', 'linkedin', 'domain-com'],
  },
  {
    id: 'government-suppliers',
    name: 'Fornecedores Governo',
    description: 'Encontra fornecedores do setor público',
    dorks: ['domain-gov', 'pdf-contacts', 'contact-page'],
  }
];