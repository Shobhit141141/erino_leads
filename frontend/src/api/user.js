import api from './index';

export const loginUser = async (data) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

export const fetchUsers = async () => {
  const res = await api.get('/user');
  return res.data;
};

export const fetchUserById = async (id) => {
  const res = await api.get(`/user/${id}`);
  return res.data;
};

export const updateUser = async ({ id, ...data }) => {
  const res = await api.put(`/user/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/user/${id}`);
  return res.data;
};

export const userNameAlreadyTaken = async (username) => {
  const res = await api.post('/user/check-username', { username });
  return res.data;
};
