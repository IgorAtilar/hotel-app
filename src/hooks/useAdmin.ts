import { Admin, AdminInput } from '@/types/admins';
import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '@/services/apiClient';

type Response = {
  admin: Admin;
};

export const getAdmin = async (id: string): Promise<Response> => {
  if (id) {
    const { data } = await api.get<Response>(`admins/${id}`);

    return { admin: data.admin };
  }

  return { admin: {} as Admin };
};

export const updateAdmin = async (admin: AdminInput): Promise<void> => {
  const { data } = await api.patch(`admins`, admin);
  return data;
};

export const createAdmin = async (admin: AdminInput): Promise<void> => {
  const { data } = await api.post(`admins`, admin);
  return data;
};
export const deleteAdmin = async (id: string): Promise<void> => {
  if (id) {
    const { data } = await api.delete(`admins/${id}`);
    return data;
  }
};

export const useAdmin = (id: string, options?: UseQueryOptions<Response>) => {
  return useQuery<Response>(['admins', id], () => getAdmin(id), options);
};
