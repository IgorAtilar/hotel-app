import Head from 'next/head';
import { Button, Flex, Stack, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../components/Form/Input';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Logo } from '../components/Header/Logo';
import { SignInCredentials, useAuth } from '@/contexts/AuthContext';
import { withSSRRedirect } from '@/utils/auth/withSSRRedirect';
import Link from 'next/link';

const signInFormSchema = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup
    .string()
    .required('Senha obrigatória')
    .min(4, 'Senha deve ter no mínimo 4 caracteres'),
});

const Home: NextPage = () => {
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInCredentials>({
    resolver: yupResolver(signInFormSchema),
  });

  const handleSignIn: SubmitHandler<SignInCredentials> = async (
    values: SignInCredentials
  ) => {
    await signIn(values);
  };

  return (
    <>
      <Head>
        <title>Login - Hotel App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Flex
        as='main'
        w='100%'
        h='100vh'
        align='center'
        justify='center'
        flexDirection='column'
        bgImage='/images/home-bg.png'
        bgColor='gray.200'
        bgSize='cover'
        bgRepeat='no-repeat'
        bgPosition='center'
      >
        <Logo />
        <Flex
          as='form'
          width='100%'
          maxWidth={400}
          p='8'
          borderRadius={8}
          flexDir='column'
          onSubmit={handleSubmit(handleSignIn)}
        >
          <Text fontSize='xl' fontWeight='normal' color='cyan.900' mb='4'>
            Login
          </Text>
          <Stack spacing={4}>
            <Input
              type='text'
              label='E-mail'
              placeholder='Insira o seu e-mail'
              error={errors.email}
              {...register('email')}
            />
            <Input
              type='password'
              label='Senha'
              placeholder='Insira a sua senha'
              error={errors.password}
              {...register('password')}
            />
          </Stack>
          <Button
            type='submit'
            mt='6'
            colorScheme='teal'
            variant='solid'
            isLoading={isSubmitting}
          >
            Entrar
          </Button>
          <Text mt='6' fontSize='sm' fontWeight='normal' textAlign='center'>
            Não possui conta?{' '}
            <Link href='/registrar' passHref>
              <Button as='a' colorScheme='teal' variant='link'>
                Cadastrar
              </Button>
            </Link>
          </Text>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;

export const getServerSideProps = withSSRRedirect(async (ctx) => {
  return {
    props: {},
  };
});
