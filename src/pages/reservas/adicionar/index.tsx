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
import { useRouter } from 'next/router';
import { useClients } from '@/hooks/useClients';
import { useRooms } from '@/hooks/useRooms';
import { BookingInput } from '@/types/bookings';
import { createBooking } from '@/hooks/useBooking';
import { Menu } from '@/components/Menu';

const createBookingFormSchema = yup.object().shape({
  start_date: yup.date().required('A data do check-in é obrigatória'),
  end_date: yup.date().required('A data do check-out é obrigatória'),
  room_id: yup.string().required('O quarto é obrigatório'),
  client_id: yup.string().required('O cliente é obrigatório'),
});

const CreateBooking: NextPage = () => {
  const router = useRouter();
  const toast = useToast();

  const { data: clientsData } = useClients();

  const { data: roomsData } = useRooms();
  const { clients } = clientsData || {};
  const { rooms } = roomsData || {};

  const { mutateAsync } = useMutation(
    (booking: BookingInput) => createBooking(booking),
    {
      onSuccess: () => queryClient.invalidateQueries(['bookings', 'clients']),
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: yupResolver(createBookingFormSchema),
    reValidateMode: 'onBlur',
  });

  const handleCreateRoom = async (values: BookingInput) => {
    try {
      await mutateAsync(values);
      toast({
        title: 'Reserva adicionada com sucesso!',
        description: '',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/reservas');
    } catch (error: any) {
      const message = error?.response?.data?.message;

      toast({
        title: 'Falha ao adicionar reserva 😥',
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
        <title>Adicionar Reserva</title>
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
                Adicionar reserva
              </Heading>
            </Flex>
            <VStack spacing={['6', '8']}>
              <SimpleGrid minChildWidth='240px' spacing={['6', '8']} w='100%'>
                <Input
                  type='date'
                  label='Data de Check-in'
                  error={errors.start_date}
                  {...register('start_date')}
                />
                <Input
                  type='date'
                  label='Data de Check-out'
                  error={errors.end_date}
                  {...register('end_date')}
                />
              </SimpleGrid>
              <SimpleGrid minChildWidth='240px' spacing={['6', '8']} w='100%'>
                <Select
                  placeholder='Selecione o cliente'
                  {...register('client_id')}
                >
                  {clients &&
                    clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                </Select>
                <Select
                  placeholder='Selecione o quarto'
                  {...register('room_id')}
                >
                  {rooms &&
                    rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.number}
                      </option>
                    ))}
                </Select>
              </SimpleGrid>
            </VStack>
            <Flex mt='8' justify='flex-end'>
              <HStack spacing='4'>
                <Link href='/reservas' passHref>
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

export default CreateBooking;
