import { RoomStatus } from '@/types/room-status';
import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '@/services/apiClient';

type Response = {
  roomStatus: RoomStatus[];
  count: number;
};

export const getStatuses = async (): Promise<Response> => {
  const { data } = await api.get<Response>('room-status');

  return {
    roomStatus: data.roomStatus,
    count: data.count,
  };
};

export const useStatuses = (options?: UseQueryOptions<Response>) => {
  return useQuery<Response>(['statuses'], getStatuses, options);
};
