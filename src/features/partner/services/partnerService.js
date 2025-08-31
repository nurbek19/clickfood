import httpClient from '@shared/api/httpClient';

export const getPartner = async (chatId) => {
  const res = await httpClient.get('/partner', { params: { chat_id: chatId } });
  return res.data;
};

export const createPartner = async (partner) => {
  const res = await httpClient.post('/partner', partner);
  return res.data;
};

export const updatePartner = async (id, changes) => {
  const res = await httpClient.put(`/partner/${id}`, changes);
  return res.data;
};


