import {
  CreateRoomTypeInput,
  RoomType,
  UpdateRoomTypeInput,
} from '@/types/room-types';
import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '@/services/apiClient';

type Response = {
  roomType: RoomType;
};

export const getRoomType = async (id: string): Promise<Response> => {
  if (id) {
    const { data } = await api.get<Response>(`room-types/${id}`);

    return { roomType: data.roomType };
  }

  return { roomType: {} as RoomType };
};

export const updateRoomType = async (
  type: UpdateRoomTypeInput
): Promise<void> => {
  const { data } = await api.patch(`room-types`, type);
  return data;
};

export const createRoomType = async (
  type: CreateRoomTypeInput
): Promise<void> => {
  const { data } = await api.post(`room-types`, type);
  return data;
};
export const deleteRoomType = async (id: string): Promise<void> => {
  if (id) {
    const { data } = await api.delete(`room-types/${id}`);
    return data;
  }
};

export const useRoomType = (
  id: string,
  options?: UseQueryOptions<Response>
) => {
  return useQuery<Response>(['roomTypes', id], () => getRoomType(id), options);
};
