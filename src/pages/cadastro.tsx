import Head from 'next/head';
import { Button, Flex, Stack, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../components/Form/Input';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Logo } from '../components/Header/Logo';
import { SignUpCredentials, useAuth } from '@/contexts/AuthContext';
import { withSSRRedirect } from '@/utils/auth/withSSRRedirect';

const signUpFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup
    .string()
    .required('Senha obrigatória')
    .min(4, 'Senha deve ter no mínimo 4 caracteres'),
});

const SignUp: NextPage = () => {
  const { signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignUpCredentials>({
    resolver: yupResolver(signUpFormSchema),
  });

  const handleSignUp: SubmitHandler<SignUpCredentials> = async (
    values: SignUpCredentials
  ) => {
    await signUp(values);
  };

  return (
    <>
      <Head>
        <title>Cadastro - Hotel App</title>
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
          onSubmit={handleSubmit(handleSignUp)}
        >
          <Text fontSize='xl' fontWeight='normal' color='cyan.900' mb='4'>
            Cadastro
          </Text>
          <Stack spacing={4}>
            <Input
              type='text'
              label='Nome'
              placeholder='Insira o seu nome'
              error={errors.name}
              {...register('name')}
            />
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
            Cadastrar
          </Button>
          <Text mt='6' fontSize='sm' fontWeight='normal' textAlign='center'>
            Já possui conta?{' '}
            <Link href='/' passHref>
              <Button as='a' colorScheme='teal' variant='link'>
                Login
              </Button>
            </Link>
          </Text>
        </Flex>
      </Flex>
    </>
  );
};

export default SignUp;

export const getServerSideProps = withSSRRedirect(async (ctx) => {
  return {
    props: {},
  };
});
