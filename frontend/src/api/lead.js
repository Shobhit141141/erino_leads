
import { API_URL } from '../config/constants';

export const fetchLeads = async (params = {}) => {
  const url = new URL(`${API_URL}/lead`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.append(key, value);
  });
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch leads');
  return await res.json();
};

export const fetchLeadById = async (id) => {
  const res = await fetch(`${API_URL}/lead/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch lead');
  return await res.json();
};

export const createLead = async (data) => {
  const res = await fetch(`${API_URL}/lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create lead');
  return await res.json();
};

export const bulkCreateLeads = async (leads) => {
  const res = await fetch(`${API_URL}/lead/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ leads }),
  });
  if (!res.ok) throw new Error('Failed to bulk create leads');
  return await res.json();
};

export const updateLead = async ({ id, ...data }) => {
  const res = await fetch(`${API_URL}/lead/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update lead');
  return await res.json();
};

export const deleteLead = async (id) => {
  const res = await fetch(`${API_URL}/lead/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete lead');
  return await res.json();
};

export const bulkDeleteLeads = async (ids) => {
  const res = await fetch(`${API_URL}/lead`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error('Failed to bulk delete leads');
  return await res.json();
};
