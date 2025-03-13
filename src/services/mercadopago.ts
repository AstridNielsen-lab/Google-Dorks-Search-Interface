import axios from 'axios';

const ACCESS_TOKEN = 'APP_USR-2120017613674163-031300-fa2a42e0f08ec6db55f7bc4385024ba5-29008060';

export async function checkSubscription(email: string): Promise<boolean> {
  try {
    // Search for payments by the user's email
    const response = await axios.get('https://api.mercadopago.com/v1/payments/search', {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      params: {
        sort: 'date_created',
        criteria: 'desc',
        external_reference: email,
        status: 'approved',
        limit: 1,
        offset: 0
      }
    });

    // Check if we have any results
    const results = response.data.results || [];
    
    if (results.length === 0) {
      return false;
    }

    // Get the latest payment
    const latestPayment = results[0];
    const paymentDate = new Date(latestPayment.date_created || '');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return paymentDate > thirtyDaysAgo;
  } catch (error) {
    console.error('Error checking subscription:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}