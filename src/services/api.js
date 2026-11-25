import products from "../data/products.json";
export const previewMode =
  import.meta.env.VITE_USE_API === "false" ||
  (import.meta.env.DEV && import.meta.env.VITE_USE_API !== "true");
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "" : "https://mens-wear-qpt6.vercel.app")
).replace(/\/+$/, "");

export function apiUrl(path) {
  return `${API_BASE_URL}/api/${path}`;
}

// Step 4. React requests JSON from Express. Vite forwards /api during development.
export async function request(path, options) {
  // Use the bundled catalog while developing without the Express server.
  if (previewMode) {
    if (path === "products") return products;
    throw new Error("Connect the Express API to place an order.");
  }
  const token = localStorage.getItem("token");
  const headers = {
    ...(options?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(apiUrl(path), { ...options, headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}
export const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
