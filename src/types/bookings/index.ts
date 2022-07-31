export type Booking = {
  id: string;
  client_name: string;
  client_email: string;
  client_cpf: string;
  room_number: string;
  start_date: string;
  end_date: string;
};

export type RawBooking = {
  id: string;
  client_id: string;
  room_id: string;
  start_date: string | Date;
  end_date: string | Date;
};

export type BookingInput = {
  client_id: string;
  room_id: string;
  start_date: string | Date;
  end_date: string | Date;
};
