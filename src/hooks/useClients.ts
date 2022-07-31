import { Client } from '@/types/clients';
import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '@/services/apiClient';

type Response = {
  clients: Client[];
  count: number;
};

export const getClients = async (): Promise<Response> => {
  const { data } = await api.get<Response>('clients');

  const clients = data.clients.map((client) => ({
    ...client,
    bookings: client.bookings.map((booking) => ({
      ...booking,
      start_date: new Date(booking.start_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      end_date: new Date(booking.end_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    })),
  }));

  return {
    clients,
    count: data.count,
  };
};

export const useClients = (options?: UseQueryOptions<Response>) => {
  return useQuery<Response>(['clients'], getClients, options);
};
