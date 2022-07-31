export type Room = {
  id: string;
  number: string;
  room_type: string;
  status: string;
  daily_price: number;
};

export type RawRoom = {
  id: string;
  number: string;
  room_type_id?: string;
  room_status_id?: string;
};

export type RoomInput = {
  number: string;
  room_type_id: string;
  room_status_id?: string;
};
