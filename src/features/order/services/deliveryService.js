import httpClient from '@shared/api/httpClient';

export const getDeliveryPrice = async (fromAddress, toAddress) => {
  try {
    const response = await httpClient.post('/delivery/check-price', {
      from: fromAddress,
      to: toAddress,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching delivery price:', error);
    throw error;
  }
};


