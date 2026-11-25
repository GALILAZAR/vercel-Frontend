// Auth service — login, register, token storage
import { apiUrl } from "./api";

export async function apiLogin(email, password) {
  const res = await fetch(apiUrl("auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed.");
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
}

export async function apiRegister(name, email, password) {
  const res = await fetch(apiUrl("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed.");
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
}

async function authenticatedGet(path, errorMessage) {
  const token = getToken();
  if (!token) throw new Error("Please sign in to view your account.");
  const res = await fetch(apiUrl(path), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || errorMessage);
  return data;
}

export function getAccountDetails() {
  return authenticatedGet("auth/me", "Failed to fetch account details.");
}

export function getOrderHistory() {
  return authenticatedGet("orders/mine", "Failed to fetch order history.");
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
