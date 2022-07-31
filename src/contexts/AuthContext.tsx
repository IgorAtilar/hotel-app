import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from 'react';

import Router from 'next/router';
import { useToast } from '@chakra-ui/react';

import { api } from '@/services/apiClient';
import { destroyCookie, parseCookies, setCookie } from 'nookies';

type Credentials = {
  email: string;
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  name: string;
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  signUp(credentials: SignUpCredentials): Promise<void>;
  signOut(): void;
  isAuthenticated: boolean;
  credentials: Credentials;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export const useAuth = (): AuthContextData => useContext(AuthContext);

export const signOut = (): void => {
  destroyCookie(undefined, '@hotel-app:token');
  Router.push('/');
};

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const toast = useToast();
  const [credentials, setCredentials] = useState<Credentials>(
    {} as Credentials
  );
  const isAuthenticated = !!credentials.email;

  useEffect(() => {
    const { '@hotel-app:token': token } = parseCookies(undefined);

    if (token) {
      api
        .get('/me')
        .then((response) => {
          const { me } = response.data;
          setCredentials({ email: me.email });
        })
        .catch((e) => {
          signOut();
        });
    }
  }, []);

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const response = await api.post('login', {
        email,
        password,
      });

      const { token } = response.data;

      setCookie(undefined, '@hotel-app:token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setCredentials({
        email,
      });

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      Router.push('/clientes');

      toast({
        title: 'Login realizado com sucesso!',
        description: 'Você será redirecionado para o dashboard',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      const message = error?.response?.data?.message;

      toast({
        title: 'Erro na autenticação',
        description:
          message || 'Ocorreu um erro ao fazer login, verifique seus dados',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const signUp = async ({ email, password, name }: SignUpCredentials) => {
    try {
      const response = await api.post('register', {
        email,
        password,
        name,
      });

      const { token } = response.data;

      setCookie(undefined, '@hotel-app:token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setCredentials({
        email,
      });

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      Router.push('/clientes');

      toast({
        title: 'Cadastro realizado com sucesso!',
        description: 'Você será redirecionado para o dashboard',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      const message = error?.response?.data?.message;

      toast({
        title: 'Erro no cadastro',
        description: message || 'Ocorreu um erro ao fazer cadastro',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isAuthenticated,
        credentials,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
