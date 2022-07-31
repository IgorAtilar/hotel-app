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
import { createAdmin } from '@/hooks/useAdmin';
import { AdminInput } from '@/types/admins';
import { useRouter } from 'next/router';
import { Menu } from '@/components/Menu';

const createAdminFormSchema = yup.object().shape({
  name: yup.string().required('O nome do administrador é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup.string().min(4, 'A senha deve ter no mínimo 4 caracteres'),
});

const CreateAdmin: NextPage = () => {
  const router = useRouter();
  const toast = useToast();

  const { mutateAsync } = useMutation(
    (admin: AdminInput) => createAdmin(admin),
    {
      onSuccess: () => queryClient.invalidateQueries('admins'),
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminInput>({
    resolver: yupResolver(createAdminFormSchema),
    reValidateMode: 'onBlur',
  });

  const handleCreateAdmin = async (values: AdminInput) => {
    try {
      await mutateAsync(values);
      toast({
        title: 'Administrador adicionado com sucesso!',
        description: '',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/administradores');
    } catch (error: any) {
      const message = error?.response?.data?.message;

      toast({
        title: 'Falha ao criar administrador 😥',
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
        <title>Adicionar Administrador</title>
      </Head>
      <Box>
        <Header />
        <Menu />
        <Flex w='100%' my='6' maxW={1480} mx='auto' p='4'>
          <Sidebar />
          <Box
            as='form'
            onSubmit={handleSubmit(handleCreateAdmin)}
            flex='1'
            p='4'
          >
            <Flex mb='4' alignItems='center' justifyContent='space-between'>
              <Heading size='md' fontWeight='bold'>
                Adicionar administrador
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
                <Input
                  type='password'
                  label='Senha'
                  error={errors.password}
                  {...register('password')}
                />
              </SimpleGrid>
            </VStack>
            <Flex mt='8' justify='flex-end'>
              <HStack spacing='4'>
                <Link href='/administradores' passHref>
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

export default CreateAdmin;
