export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const numbers = phone.replace(/\D/g, '');
  
  // Ensure the number starts with country code
  if (!numbers.startsWith('55')) {
    return `55${numbers}`;
  }
  
  return numbers;
}

export function extractPhones(text: string): string[] {
  const phoneRegex = /(\+\d{1,3}\s?)?(\(\d{2}\)\s?)?(\d{4,5}-\d{4})/g;
  return text.match(phoneRegex) || [];
}

export function extractEmails(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return text.match(emailRegex) || [];
}

export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function extractKeywords(text: string): string[] {
  // Simple keyword extraction based on common business terms
  const keywords = text.toLowerCase().match(/\b\w{3,}\b/g) || [];
  return [...new Set(keywords)].filter(word => 
    !['que', 'com', 'para', 'por', 'mas', 'seu', 'sua'].includes(word)
  );
}