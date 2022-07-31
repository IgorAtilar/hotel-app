import { Client, CreateClientInput, UpdateClientInput } from '@/types/clients';
import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '@/services/apiClient';

type Response = {
  client: Client;
};

export const getClient = async (id: string): Promise<Response> => {
  if (id) {
    const { data } = await api.get<Response>(`clients/${id}`);
    const client = {
      ...data.client,
      birthdate:
        data.client.birthdate &&
        new Date(data.client.birthdate || '').toISOString().split('T')[0],
    };
    return { client };
  }

  return { client: {} as Client };
};

export const updateClient = async (
  client: UpdateClientInput
): Promise<void> => {
  const { data } = await api.patch(`clients`, client);
  return data;
};

export const createClient = async (
  client: CreateClientInput
): Promise<void> => {
  const { data } = await api.post(`clients`, client);
  return data;
};

export const useClient = (id: string, options?: UseQueryOptions<Response>) => {
  return useQuery<Response>(['clients', id], () => getClient(id), options);
};

export const deleteClient = async (id: string): Promise<void> => {
  if (id) {
    const { data } = await api.delete(`clients/${id}`);
    return data;
  }
};
