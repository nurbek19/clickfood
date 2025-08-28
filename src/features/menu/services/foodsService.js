import { api } from '@shared/api/api';

export const getFoods = async (partnerId) => {
  const res = await api.get('/foods', { params: { partner_id: partnerId } });
  return res.data;
};

export const createFood = async (partnerId, food) => {
  const res = await api.post('/foods', { partner_id: partnerId, ...food });
  return res.data;
};

export const updateFood = async (foodId, changes) => {
  const res = await api.put(`/foods/${foodId}`, changes);
  return res.data;
};

export const deleteFood = async (foodId) => {
  const res = await api.delete(`/foods/${foodId}`);
  return res.data;
};


