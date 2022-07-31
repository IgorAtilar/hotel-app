import { RawRoom, Room, RoomInput } from '@/types/rooms';
import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '@/services/apiClient';

type Response = {
  room: RawRoom;
};

export const getRoom = async (id: string): Promise<Response> => {
  if (id) {
    const { data } = await api.get<Response>(`rooms/${id}`);

    return { room: data.room };
  }

  return { room: {} as Room };
};

export const updateRoom = async (status: RoomInput): Promise<void> => {
  const { data } = await api.patch(`rooms`, status);
  return data;
};

export const createRoom = async (status: RoomInput): Promise<void> => {
  const { data } = await api.post(`rooms`, status);
  return data;
};
export const deleteRoom = async (id: string): Promise<void> => {
  if (id) {
    const { data } = await api.delete(`rooms/${id}`);
    return data;
  }
};

export const useRoom = (id: string, options?: UseQueryOptions<Response>) => {
  return useQuery<Response>(['rooms', id], () => getRoom(id), options);
};
