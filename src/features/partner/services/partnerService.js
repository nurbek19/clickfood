import { api } from '@shared/api/api';

export const getPartner = async (chatId) => {
  const res = await api.get('/partner', { params: { chat_id: chatId } });
  return res.data;
};

export const createPartner = async (partner) => {
  const res = await api.post('/partner', partner);
  return res.data;
};

export const updatePartner = async (id, changes) => {
  const res = await api.put(`/partner/${id}`, changes);
  return res.data;
};

export const upsertPartner = async (partner) => {
  if (partner && partner._id) {
    return updatePartner(partner._id, partner);
  }
  return createPartner(partner);
};


