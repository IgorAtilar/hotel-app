import { Booking } from '@/types/bookings';
import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '@/services/apiClient';

type Response = {
  bookings: Booking[];
  count: number;
};

export const getBookings = async (): Promise<Response> => {
  const { data } = await api.get<Response>('bookings');

  const bookings = data.bookings.map((booking) => ({
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
  }));

  return {
    bookings,
    count: data.count,
  };
};

export const useBookings = (options?: UseQueryOptions<Response>) => {
  return useQuery<Response>(['bookings'], getBookings, options);
};
