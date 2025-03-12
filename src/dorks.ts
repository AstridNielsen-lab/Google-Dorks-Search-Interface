import { GoogleDork } from './types';

export const googleDorks: GoogleDork[] = [
  {
    id: 'email',
    operator: 'intext:"@"',
    description: 'Emails corporativos',
    category: 'contact'
  },
  {
    id: 'phone',
    operator: 'intext:"(11)" OR intext:"(21)" OR intext:"(31)"',
    description: 'Telefones comerciais',
    category: 'contact'
  },
  {
    id: 'whatsapp',
    operator: 'intext:"whatsapp" OR intext:"WhatsApp"',
    description: 'Contatos WhatsApp',
    category: 'contact'
  },
  {
    id: 'contact-page',
    operator: 'intitle:"contato" OR intitle:"fale conosco"',
    description: 'Páginas de contato',
    category: 'contact'
  },
  {
    id: 'pdf',
    operator: 'filetype:pdf',
    description: 'Documentos PDF',
    category: 'document'
  },
  {
    id: 'excel',
    operator: 'filetype:xlsx OR filetype:xls',
    description: 'Planilhas Excel',
    category: 'document'
  },
  {
    id: 'csv',
    operator: 'filetype:csv',
    description: 'Arquivos CSV',
    category: 'document'
  },
  {
    id: 'price-list',
    operator: 'intitle:"tabela de preços" OR intitle:"lista de preços"',
    description: 'Tabelas de preços',
    category: 'document'
  },
  {
    id: 'linkedin',
    operator: 'site:linkedin.com/in/',
    description: 'Perfis do LinkedIn',
    category: 'social'
  },
  {
    id: 'facebook',
    operator: 'site:facebook.com',
    description: 'Páginas do Facebook',
    category: 'social'
  },
  {
    id: 'instagram',
    operator: 'site:instagram.com',
    description: 'Perfis do Instagram',
    category: 'social'
  },
  {
    id: 'directory',
    operator: 'intitle:"index of" "contacts.csv" OR "leads.xlsx"',
    description: 'Diretórios abertos',
    category: 'technical'
  }
];

export const dorkCategories = {
  contact: 'Contatos',
  document: 'Documentos',
  social: 'Redes Sociais',
  technical: 'Técnico'
};