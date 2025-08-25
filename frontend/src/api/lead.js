import { API_URL } from "../config/constants";

export const fetchLeads = async (params = {}) => {
  const formattedParams = { ...params };

  [
    "created_at_after",
    "created_at_before",
    "last_activity_at_after",
    "last_activity_at_before",
  ].forEach((field) => {
    if (formattedParams[field] instanceof Date) {
      formattedParams[field] = formattedParams[field]
        .toISOString()
        .split("T")[0];
    }
  });

  const queryString = new URLSearchParams(formattedParams).toString();
  const resp = await fetch(`${API_URL}/lead?${queryString}`, {
    method: "GET",
    credentials: "include",
  });

  if (!resp.ok) throw new Error("Failed to fetch leads");
  return await resp.json();
};

export const fetchLeadById = async (id) => {
  const res = await fetch(`${API_URL}/lead/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch lead");
  return await res.json();
};

export const createLead = async (data) => {
  const res = await fetch(`${API_URL}/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create lead");
  return await res.json();
};

export const bulkCreateLeads = async (leads) => {
  const res = await fetch(`${API_URL}/lead/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ leads }),
  });
  if (!res.ok) throw new Error("Failed to bulk create leads");
  return await res.json();
};

export const updateLead = async ({ id, ...data }) => {
  const res = await fetch(`${API_URL}/lead/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update lead");
  return await res.json();
};

export const deleteLead = async (id) => {
  const res = await fetch(`${API_URL}/lead/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete lead");
  return await res.json();
};

export const bulkDeleteLeads = async (ids) => {
  const res = await fetch(`${API_URL}/lead`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error("Failed to bulk delete leads");
  return await res.json();
};
