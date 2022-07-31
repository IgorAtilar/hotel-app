import { Admin } from '@/types/admins';
import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '@/services/apiClient';

type Response = {
  admins: Admin[];
  count: number;
};

export const getAdmins = async (): Promise<Response> => {
  const { data } = await api.get<Response>('admins');

  return {
    admins: data.admins,
    count: data.count,
  };
};

export const useAdmins = (options?: UseQueryOptions<Response>) => {
  return useQuery<Response>(['admins'], getAdmins, options);
};
