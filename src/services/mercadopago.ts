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
        sort: 'date_created:desc',
        criteria: 'desc',
        external_reference: email,
        status: 'approved'
      }
    });

    if (!response.data.results.length) {
      return false;
    }

    // Check the most recent payment
    const latestPayment = response.data.results[0];
    
    // Check if payment was made within the last 30 days
    const paymentDate = new Date(latestPayment.date_created);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return paymentDate > thirtyDaysAgo;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
}