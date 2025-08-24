import { API_URL } from '../config/constants';

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Login failed');
  return await res.json();
};

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Registration failed');
  return await res.json();
};

export const logoutUser = async () => {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Logout failed');
  return await res.json();
};

export const fetchUsers = async () => {
  const res = await fetch(`${API_URL}/user`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch users');
  return await res.json();
};

export const fetchUserById = async (id) => {
  const res = await fetch(`${API_URL}/user/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch user');
  return await res.json();
};

export const updateUser = async ({ id, ...data }) => {
  const res = await fetch(`${API_URL}/user/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return await res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`${API_URL}/user/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return await res.json();
};

export const userNameAlreadyTaken = async (username) => {
  const res = await fetch(`${API_URL}/user/check-username`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username }),
  });
  if (res.status === 409) throw { response: { status: 409 } };
  if (!res.ok) throw new Error('Failed to check username');
  return await res.json();
};
