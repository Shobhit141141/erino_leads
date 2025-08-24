import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../config/constants";


export function useAuth() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
      if (!res.ok) throw new Error('Not authenticated');
      return await res.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
