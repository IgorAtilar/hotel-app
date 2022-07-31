import { RoomStatus, RoomStatusInput } from '@/types/room-status';
import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '@/services/apiClient';

type Response = {
  roomStatus: RoomStatus;
};

export const getStatus = async (id: string): Promise<Response> => {
  if (id) {
    const { data } = await api.get<Response>(`room-status/${id}`);

    return { roomStatus: data.roomStatus };
  }

  return { roomStatus: {} as RoomStatus };
};

export const updateStatus = async (status: RoomStatusInput): Promise<void> => {
  const { data } = await api.patch(`room-status`, status);
  return data;
};

export const createStatus = async (status: RoomStatusInput): Promise<void> => {
  const { data } = await api.post(`room-status`, status);
  return data;
};
export const deleteStatus = async (id: string): Promise<void> => {
  if (id) {
    const { data } = await api.delete(`room-status/${id}`);
    return data;
  }
};

export const useStatus = (id: string, options?: UseQueryOptions<Response>) => {
  return useQuery<Response>(['statuses', id], () => getStatus(id), options);
};
