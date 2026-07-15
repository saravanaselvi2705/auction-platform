import api from "./api";

export const getSellerDashboard = async () => {
  const response = await api.get("/dashboard/seller");
  return response.data;
};

export const getBuyerDashboard = async () => {
  const response = await api.get("/dashboard/buyer");
  return response.data;
};
