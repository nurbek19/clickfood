import httpClient from '@shared/api/httpClient';

export const getFoods = async (partnerId) => {
  const res = await httpClient.get('/foods', { params: { partner_id: partnerId } });
  return res.data;
};

export const createFood = async (partnerId, food) => {
  const res = await httpClient.post('/foods', { partner_id: partnerId, ...food });
  return res.data;
};

export const updateFood = async (foodId, changes) => {
  const res = await httpClient.put(`/foods/${foodId}`, changes);
  return res.data;
};

export const deleteFood = async (foodId) => {
  const res = await httpClient.delete(`/foods/${foodId}`);
  return res.data;
};


