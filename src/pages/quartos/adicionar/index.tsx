import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
  useToast,
  Select,
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
import { createRoom } from '@/hooks/useRoom';
import { RoomInput } from '@/types/rooms';
import { useRouter } from 'next/router';
import { useRoomTypes } from '@/hooks/useRoomTypes';
import { useStatuses } from '@/hooks/useStatuses';
import { Menu } from '@/components/Menu';

const createUserFormSchema = yup.object().shape({
  number: yup.string().required('O número do quarto é obrigatório'),
});

const CreateRoom: NextPage = () => {
  const router = useRouter();
  const toast = useToast();

  const { data: roomTypesData } = useRoomTypes();

  const { data: roomStatusesData } = useStatuses();

  const { roomTypes } = roomTypesData || {};
  const { roomStatus } = roomStatusesData || {};

  const { mutateAsync } = useMutation((room: RoomInput) => createRoom(room), {
    onSuccess: () => queryClient.invalidateQueries('rooms'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RoomInput>({
    resolver: yupResolver(createUserFormSchema),
    reValidateMode: 'onBlur',
  });

  const handleCreateRoom = async (values: RoomInput) => {
    try {
      await mutateAsync(values);
      toast({
        title: 'Quarto adicionado com sucesso!',
        description: '',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/quartos');
    } catch (error: any) {
      const message = error?.response?.data?.message;

      toast({
        title: 'Falha ao adicionar quarto 😥',
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
        <title>Adicionar QUarto</title>
      </Head>
      <Box>
        <Header />
        <Menu />
        <Flex w='100%' my='6' maxW={1480} mx='auto' p='4'>
          <Sidebar />
          <Box
            as='form'
            onSubmit={handleSubmit(handleCreateRoom)}
            flex='1'
            p='4'
          >
            <Flex mb='4' alignItems='center' justifyContent='space-between'>
              <Heading size='md' fontWeight='bold'>
                Adicionar quarto
              </Heading>
            </Flex>
            <VStack spacing={['6', '8']}>
              <SimpleGrid minChildWidth='240px' spacing={['6', '8']} w='100%'>
                <Input
                  label='Número'
                  error={errors.number}
                  {...register('number')}
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth='240px' spacing={['6', '8']} w='100%'>
                <Select
                  placeholder='Selecione o tipo de quarto'
                  {...register('room_type_id')}
                >
                  {roomTypes &&
                    roomTypes.map((roomType) => (
                      <option key={roomType.id} value={roomType.id}>
                        {roomType.name}
                      </option>
                    ))}
                </Select>
                <Select
                  placeholder='Selecione o status do quarto'
                  {...register('room_status_id')}
                >
                  {roomStatus &&
                    roomStatus.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                </Select>
              </SimpleGrid>
            </VStack>
            <Flex mt='8' justify='flex-end'>
              <HStack spacing='4'>
                <Link href='/quartos' passHref>
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

export default CreateRoom;
