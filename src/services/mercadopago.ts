import axios from 'axios';

const ACCESS_TOKEN = 'APP_USR-2120017613674163-031300-fa2a42e0f08ec6db55f7bc4385024ba5-29008060';
const MP_API_URL = 'https://api.mercadopago.com';

export async function checkSubscription(email: string): Promise<boolean> {
  try {
    // Search for payments by the user's email
    const response = await axios.get(`${MP_API_URL}/v1/payments/search`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      params: {
        sort: 'date_created',
        criteria: 'desc',
        external_reference: email,
        status: 'approved',
        limit: 1
      }
    });

    if (!response.data.results || response.data.results.length === 0) {
      return false;
    }

    const latestPayment = response.data.results[0];
    const paymentDate = new Date(latestPayment.date_created);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return paymentDate > thirtyDaysAgo;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
}

export async function createPaymentPreference(email: string): Promise<string> {
  try {
    const response = await axios.post(
      `${MP_API_URL}/checkout/preferences`,
      {
        items: [{
          id: "subscription-monthly",
          title: "Google Dorks Pro - Assinatura Mensal",
          description: "Acesso premium por 30 dias",
          quantity: 1,
          currency_id: "BRL",
          unit_price: 2.99
        }],
        payer: {
          email: email
        },
        external_reference: email,
        back_urls: {
          success: `${window.location.origin}?login=true`,
          failure: `${window.location.origin}?error=payment_failed`,
          pending: `${window.location.origin}?status=pending`
        },
        auto_return: "approved",
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 1
        },
        statement_descriptor: "GOOGLE DORKS PRO"
      },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data.id) {
      throw new Error('Preference ID not received from Mercado Pago');
    }

    return response.data.id;
  } catch (error) {
    console.error('Error creating payment preference:', error);
    throw new Error('Falha ao criar preferência de pagamento');
  }
}