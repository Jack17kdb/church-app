import axios from 'axios';

export const getMpesaToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const mpesaEnv = process.env.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  const response = await axios.get(`${mpesaEnv}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` }
  });

  return response.data.access_token;
};

export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('254') && cleaned.length === 12) return cleaned;
  if (cleaned.startsWith('0') && cleaned.length === 10) return '254' + cleaned.slice(1);
  if (cleaned.startsWith('7') && cleaned.length === 9) return '254' + cleaned;
  if (cleaned.startsWith('1') && cleaned.length === 9) return '254' + cleaned;
  return null;
};
