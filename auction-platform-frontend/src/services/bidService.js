import api from "./api";

export const placeBid = async (productId, amount) => {
  const response = await api.post(`/bids/${productId}`, { amount });
  return response.data;
};

export const getBidHistory = async (productId) => {
  const response = await api.get(`/bids/${productId}`);
  return response.data;
};
