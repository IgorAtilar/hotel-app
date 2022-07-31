import { RoomType } from '@/types/room-types';
import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '@/services/apiClient';

type Response = {
  roomTypes: RoomType[];
  count: number;
};

export const getRoomTypes = async (): Promise<Response> => {
  const { data } = await api.get<Response>('room-types');

  return {
    roomTypes: data.roomTypes,
    count: data.count,
  };
};

export const useRoomTypes = (options?: UseQueryOptions<Response>) => {
  return useQuery<Response>(['roomTypes'], getRoomTypes, options);
};
