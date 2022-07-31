export type ClientBooking = {
  id: string;
  room: string;
  start_date: string;
  end_date: string;
};

export type Client = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  address: string;
  birthdate?: string | Date;
  wifi_password?: string;
  bookings: ClientBooking[];
};

export type CreateClientInput = {
  name: string;
  cpf: string;
  email: string;
  address?: string;
  birthdate?: string | Date;
  wifi_password?: string;
};

export type UpdateClientInput = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  address?: string;
  birthdate?: string | Date;
  wifi_password?: string;
};
