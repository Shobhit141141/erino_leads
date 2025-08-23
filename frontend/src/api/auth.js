import { useQuery } from '@tanstack/react-query';
import api from '../api';

export function useAuth() {

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
