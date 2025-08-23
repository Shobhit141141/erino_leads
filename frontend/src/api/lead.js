import api from './index';

export const fetchLeads = async (params = {}) => {
  const res = await api.get('/lead', { params });
  return res.data;
};

export const fetchLeadById = async (id) => {
  const res = await api.get(`/lead/${id}`);
  return res.data;
};

export const createLead = async (data) => {
  const res = await api.post('/lead', data);
  return res.data;
};

export const bulkCreateLeads = async (leads) => {
  const res = await api.post('/lead/bulk', leads);
  return res.data;
};

export const updateLead = async ({ id, ...data }) => {
  const res = await api.put(`/lead/${id}`, data);
  return res.data;
};

export const deleteLead = async (id) => {
  const res = await api.delete(`/lead/${id}`);
  return res.data;
};

export const bulkDeleteLeads = async (ids) => {
  const res = await api.delete('/lead', { data: { ids } });
  return res.data;
};
