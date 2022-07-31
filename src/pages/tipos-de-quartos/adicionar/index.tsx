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
import { createRoomType } from '@/hooks/useRoomType';
import { CreateRoomTypeInput } from '@/types/room-types';
import { useRouter } from 'next/router';
import { Menu } from '@/components/Menu';

const createTypeFormSchema = yup.object().shape({
  name: yup.string().required('O nome do tipo de quarto é obrigatório'),
  daily_price: yup
    .number()
    .default(0)
    .test(
      'is-positive',
      'O preço diário deve ser maior que zero',
      (value) => value > 0
    )
    .test(
      'is-number',
      'O preço diário deve ser um número',
      (value) => !isNaN(value)
    )
    .typeError('O preço diário é obrigatório'),
});

const CreateType: NextPage = () => {
  const router = useRouter();
  const toast = useToast();

  const { mutateAsync } = useMutation(
    (type: CreateRoomTypeInput) => createRoomType(type),
    {
      onSuccess: () => queryClient.invalidateQueries('roomTypes'),
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoomTypeInput>({
    resolver: yupResolver(createTypeFormSchema),
    reValidateMode: 'onBlur',
  });

  const handleCreateRoomType = async (values: CreateRoomTypeInput) => {
    try {
      await mutateAsync(values);
      toast({
        title: 'Tipo de quarto adicionado com sucesso!',
        description: '',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/tipos-de-quartos');
    } catch (error: any) {
      const message = error?.response?.data?.message;

      toast({
        title: 'Falha ao criar tipo de quarto 😥',
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
        <title>Adicionar Tipo de quarto</title>
      </Head>
      <Box>
        <Header />
        <Menu />
        <Flex w='100%' my='6' maxW={1480} mx='auto' p='4'>
          <Sidebar />
          <Box
            as='form'
            onSubmit={handleSubmit(handleCreateRoomType)}
            flex='1'
            p='4'
          >
            <Flex mb='4' alignItems='center' justifyContent='space-between'>
              <Heading size='md' fontWeight='bold'>
                Adicionar tipo de quarto
              </Heading>
            </Flex>
            <VStack spacing={['6', '8']}>
              <SimpleGrid minChildWidth='240px' spacing={['6', '8']} w='100%'>
                <Input label='Nome' error={errors.name} {...register('name')} />
                <Input
                  type='number'
                  label='Preço diário'
                  error={errors.daily_price}
                  {...register('daily_price')}
                />
              </SimpleGrid>
            </VStack>
            <Flex mt='8' justify='flex-end'>
              <HStack spacing='4'>
                <Link href='/tipos-de-quartos' passHref>
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

export default CreateType;
