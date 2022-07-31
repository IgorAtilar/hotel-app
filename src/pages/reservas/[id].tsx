import { useEffect, useMemo } from 'react';
import * as yup from 'yup';
import Link from 'next/link';
import Head from 'next/head';
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
  IconButton,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
} from '@chakra-ui/react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Input } from '@/components/Form/Input';
import { queryClient } from '@/services/queryClient';

import { FiTrash2 } from 'react-icons/fi';
import { isEqual } from 'lodash';
import { deleteBooking, updateBooking, useBooking } from '@/hooks/useBooking';
import { useClients } from '@/hooks/useClients';
import { useRooms } from '@/hooks/useRooms';
import { BookingInput } from '@/types/bookings';
import { Menu } from '@/components/Menu';

const editBookingFormSchema = yup.object().shape({
  start_date: yup.date().required('A data do check-in é obrigatória'),
  end_date: yup.date().required('A data do check-out é obrigatória'),
  room_id: yup.string().required('O quarto é obrigatório'),
  client_id: yup.string().required('O cliente é obrigatório'),
});

const EditBooking: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const { query } = router;

  const id: string = query.id as string;

  const { data, isLoading, isFetching, error } = useBooking(id, {
    refetchInterval: Infinity,
    refetchOnWindowFocus: false,
  });

  const { data: clientsData } = useClients();

  const { data: roomsData } = useRooms();

  const { booking } = data || {};
  const { clients } = clientsData || {};
  const { rooms } = roomsData || {};

  const { mutateAsync } = useMutation(
    (booking: BookingInput) => updateBooking(booking),
    {
      onSuccess: () => queryClient.invalidateQueries(['bookings', 'clients']),
    }
  );

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: yupResolver(editBookingFormSchema),
    reValidateMode: 'onBlur',
    defaultValues: useMemo(() => {
      return {
        ...booking,
      };
    }, [booking]),
  });

  const handleDeleteRoom = async () => {
    try {
      await deleteBooking(booking?.id!);
      toast({
        title: 'Reserva excluída com sucesso!',
        description: '',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/reservas');
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast({
        title: 'Erro ao deletar reserva',
        description: message || '',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateBooking = async (values: BookingInput) => {
    const hasBookingNotChanged = isEqual(values, booking);

    if (hasBookingNotChanged) {
      toast({
        title: 'Nenhuma alteração foi realizada 🧐',
        description: 'Por favor, altere alguma informação para atualizar',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    } else {
      try {
        await mutateAsync(values);
        toast({
          title: 'Reserva atualizada com sucesso!',
          description: '',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/reservas');
      } catch (error: any) {
        const message = error?.response?.data?.message;

        toast({
          title: 'Falha ao atualizar reserva 😥',
          description: message || '',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    reset({ ...booking });
  }, [booking, clients, rooms, reset]);

  return (
    <>
      <Head>
        <title>Editar Reserva</title>
      </Head>
      <Box>
        <Header />
        <Menu />
        <Flex w='100%' my='6' maxW={1480} mx='auto' p='4'>
          <Sidebar />
          <Box
            as='form'
            onSubmit={handleSubmit(handleUpdateBooking)}
            flex='1'
            p='4'
          >
            <Flex mb='4' alignItems='center' justifyContent='space-between'>
              <Heading size='md' fontWeight='bold'>
                Editar Reserva
                {!isLoading && isFetching && (
                  <Spinner size='md' color='yellow.500' ml='4' />
                )}
              </Heading>
              <IconButton
                as='a'
                display='flex'
                colorScheme='red'
                aria-label='Excluir reserva'
                icon={<Icon as={FiTrash2} />}
                fontSize='20'
                cursor='pointer'
                onClick={onOpen}
              />
            </Flex>
            {isLoading ? (
              <Flex height='100%' minH='150' justify='center' align='center'>
                <Spinner size='lg' color='yellow.500' />
              </Flex>
            ) : error ? (
              <Flex height='100%' justify='center' align='center'>
                <Text>Falha ao obter os dados da reserva.</Text>
              </Flex>
            ) : (
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
            )}
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
                  Salvar
                </Button>
              </HStack>
            </Flex>
          </Box>
        </Flex>
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size='xl'
        isCentered
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size='md' fontWeight='bold'>
              Excluir reserva
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              justify='center'
              align='center'
              flexDirection='column'
              height='100%'
            >
              <Text fontSize='xl' fontWeight='bold'>
                Tem certeza que deseja excluir esta reserva?
              </Text>
              <Text fontSize='lg' fontWeight='normal'>
                Esta ação não poderá ser desfeita.
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              variant='solid'
              colorScheme='red'
              onClick={handleDeleteRoom}
              ml='8'
            >
              Excluir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditBooking;
