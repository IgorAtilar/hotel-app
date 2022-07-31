import { Booking, BookingInput, RawBooking } from '@/types/bookings';
import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '@/services/apiClient';

type Response = {
  booking: RawBooking;
};

export const getBooking = async (id: string): Promise<Response> => {
  if (id) {
    const { data } = await api.get<Response>(`bookings/${id}`);

    const booking = {
      ...data.booking,
      start_date:
        data.booking.start_date &&
        new Date(data.booking.start_date).toISOString().split('T')[0],
      end_date:
        data.booking.end_date &&
        new Date(data.booking.end_date).toISOString().split('T')[0],
    };

    return { booking };
  }

  return { booking: {} as RawBooking };
};

export const updateBooking = async (booking: BookingInput): Promise<void> => {
  const { data } = await api.patch(`bookings`, booking);
  return data;
};

export const createBooking = async (booking: BookingInput): Promise<void> => {
  const { data } = await api.post(`bookings`, booking);
  return data;
};
export const deleteBooking = async (id: string): Promise<void> => {
  if (id) {
    const { data } = await api.delete(`bookings/${id}`);
    return data;
  }
};

export const useBooking = (id: string, options?: UseQueryOptions<Response>) => {
  return useQuery<Response>(['bookings', id], () => getBooking(id), options);
};
