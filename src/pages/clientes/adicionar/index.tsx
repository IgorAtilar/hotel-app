import { useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Text,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Input } from '@/components/Form/Input';
import { queryClient } from '@/services/queryClient';
import { useMutation } from 'react-query';
import * as yup from 'yup';
import Link from 'next/link';
import Head from 'next/head';
import { createClient } from '@/hooks/useClient';
import { Client, CreateClientInput } from '@/types/clients';
import { useRouter } from 'next/router';
import { Menu } from '@/components/Menu';

const createUserFormSchema = yup.object().shape({
  name: yup.string().required('O nome do cliente é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  cpf: yup.string().required('CPF obrigatório'),
});

const CreateUser: NextPage = () => {
  const router = useRouter();
  const toast = useToast();

  const { mutateAsync } = useMutation(
    (client: CreateClientInput) => createClient(client),
    {
      onSuccess: () => queryClient.invalidateQueries('clients'),
    }
  );

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Client>({
    resolver: yupResolver(createUserFormSchema),
    reValidateMode: 'onBlur',
  });

  const handleCreateClient = async (values: CreateClientInput) => {
    try {
      await mutateAsync(values);
      toast({
        title: 'Cliente adicionado com sucesso!',
        description: '',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/clientes');
    } catch (error: any) {
      const message = error?.response?.data?.message;

      toast({
        title: 'Falha ao atualizar cliente 😥',
        description: message || '',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Adicionar Cliente</title>
      </Head>
      <Box>
        <Header />
        <Menu />
        <Flex w='100%' my='6' maxW={1480} mx='auto' p='4'>
          <Sidebar />
          <Box
            as='form'
            onSubmit={handleSubmit(handleCreateClient)}
            flex='1'
            p='4'
          >
            <Flex mb='4' alignItems='center' justifyContent='space-between'>
              <Heading size='md' fontWeight='bold'>
                Adicionar cliente
              </Heading>
            </Flex>
            <VStack spacing={['6', '8']}>
              <SimpleGrid minChildWidth='240px' spacing={['6', '8']} w='100%'>
                <Input label='Nome' error={errors.name} {...register('name')} />
                <Input
                  type='email'
                  label='E-mail'
                  error={errors.email}
                  {...register('email')}
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth='240px' spacing={['6', '8']} w='100%'>
                <Input label='CPF' error={errors.cpf} {...register('cpf')} />
                <Input
                  type='date'
                  label='Data de nascimento'
                  error={errors.birthdate}
                  {...register('birthdate')}
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth='240px' spacing={['6', '8']} w='100%'>
                <Input
                  label='Senha do Wi-fi'
                  error={errors.wifi_password}
                  {...register('wifi_password')}
                />
                <Input
                  label='Endereço'
                  error={errors.address}
                  {...register('address')}
                />
              </SimpleGrid>
            </VStack>
            <Flex mt='8' justify='flex-end'>
              <HStack spacing='4'>
                <Link href='/clientes' passHref>
                  <Button as='a' color='gray.900'>
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type='submit'
                  variant='solid'
                  borderColor='cyan.500'
                  bg='cyan.500'
                  color='white'
                  _hover={{
                    bg: 'cyan.600',
                  }}
                  isLoading={isSubmitting}
                >
                  Criar
                </Button>
              </HStack>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default CreateUser;
