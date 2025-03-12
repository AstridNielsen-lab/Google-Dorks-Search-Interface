import { GoogleDork } from './types';

export const googleDorks: GoogleDork[] = [
  {
    id: 'email',
    operator: 'intext:"@"',
    description: 'Encontrar endereços de email',
    category: 'contact'
  },
  {
    id: 'phone',
    operator: 'intext:"(11)" OR intext:"(21)" OR intext:"(31)"',
    description: 'Encontrar números de telefone',
    category: 'contact'
  },
  {
    id: 'whatsapp',
    operator: 'intext:"whatsapp" OR intext:"WhatsApp"',
    description: 'Encontrar contatos de WhatsApp',
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
  }
];

export const dorkCategories = {
  contact: 'Contatos',
  document: 'Documentos',
  security: 'Segurança',
  social: 'Redes Sociais',
  technical: 'Técnico'
};