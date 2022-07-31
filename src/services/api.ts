import axios from 'axios';
import { signOut } from '@/contexts/AuthContext';
import { parseCookies } from 'nookies';
import { GetServerSidePropsContext } from 'next';
import { AuthTokenError } from '@/services/errors/AuthTokenError';

type Context = undefined | GetServerSidePropsContext;

export const setupApiClient = (ctx: Context = undefined) => {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'http://localhost:3030/api/v1',
  });

  api.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${cookies['@hotel-app:token']}`;

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        if (typeof window !== 'undefined') {
          signOut();
        }
        throw new AuthTokenError();
      }
      return Promise.reject(error);
    }
  );

  return api;
};
