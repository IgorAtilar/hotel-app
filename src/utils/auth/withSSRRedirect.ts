import { api } from '@/services/apiClient';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';

import { parseCookies } from 'nookies';

export const withSSRRedirect = <P>(fn: GetServerSideProps<P>) => {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    if (cookies['@hotel-app:token']) {
      return {
        redirect: {
          destination: '/clientes',
          permanent: false,
        },
      };
    }

    return await fn(ctx);
  };
};
