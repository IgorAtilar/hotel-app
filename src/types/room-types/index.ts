export type RoomType = {
  id: string;
  name: string;
  daily_price: number;
};

export type CreateRoomTypeInput = {
  name: string;
  daily_price: number;
};

export type UpdateRoomTypeInput = {
  id: string;
  name?: string;
  daily_price?: number;
};
