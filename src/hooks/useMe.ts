import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '@/services/apiClient';

type Me = {
  id: string;
  name: string;
  email: string;
};

export const getMe = async (): Promise<Me> => {
  try {
    const { data } = await api.get('me');
    const { me } = data;

    return me;
  } catch (e) {
    throw e;
  }
};

export const useMe = (options?: UseQueryOptions<Me>) => {
  return useQuery<Me>(['me'], getMe, options);
};
