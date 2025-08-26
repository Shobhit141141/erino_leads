import { API_URL } from "../config/constants";

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let errMsg = "Login failed";
    const err = await res.json();
    errMsg = err.message || errMsg;
    throw new Error(errMsg);
  }
  return await res.json();
};

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Registration failed");
  }
  return await res.json();
};

export const logoutUser = async () => {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Logout failed");
  }
  return await res.json();
};

export const fetchUserById = async (id) => {
  const res = await fetch(`${API_URL}/user/${id}`, { credentials: "include" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch user");
  }
  return await res.json();
};

export const userNameAlreadyTaken = async (username) => {
  const res = await fetch(`${API_URL}/user/check-username`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username }),
  });
  if (res.status === 409) throw { response: { status: 409 } };
  if (!res.ok) throw new Error("Failed to check username");
  return await res.json();
};
