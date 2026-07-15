export const getImageUrl = (url, fallback = "https://images.unsplash.com/photo-1546213290-e1b7610339e5?q=80&w=600&auto=format&fit=crop") => {
  if (!url) return fallback;
  if (url.startsWith("http")) return url;
  const backendUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");
  return `${backendUrl}${url}`;
};
