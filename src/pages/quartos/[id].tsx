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

import { deleteRoom, updateRoom, useRoom } from '@/hooks/useRoom';
import { RoomInput } from '@/types/rooms';
import { FiTrash2 } from 'react-icons/fi';
import { isEqual } from 'lodash';
import { useRoomTypes } from '@/hooks/useRoomTypes';
import { useStatuses } from '@/hooks/useStatuses';
import { Menu } from '@/components/Menu';

const editRoomFormSchema = yup.object().shape({
  number: yup.string().required('O número é obrigatório'),
  room_type_id: yup.string().required('O tipo do quarto é obrigatório'),
  room_status_id: yup.string(),
});

const EditRoom: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const { query } = router;

  const id: string = query.id as string;

  const { data, isLoading, isFetching, error } = useRoom(id, {
    refetchInterval: Infinity,
    refetchOnWindowFocus: false,
  });

  const { data: roomTypesData } = useRoomTypes();

  const { data: roomStatusesData } = useStatuses();

  const { room } = data || {};
  const { roomTypes } = roomTypesData || {};
  const { roomStatus } = roomStatusesData || {};

  const { mutateAsync } = useMutation((room: RoomInput) => updateRoom(room), {
    onSuccess: () => queryClient.invalidateQueries('rooms'),
  });

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RoomInput>({
    resolver: yupResolver(editRoomFormSchema),
    reValidateMode: 'onBlur',
    defaultValues: useMemo(() => {
      return {
        ...room,
      };
    }, [room]),
  });

  const handleDeleteRoom = async () => {
    try {
      await deleteRoom(room?.id!);
      toast({
        title: 'Quarto removido com sucesso!',
        description: '',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/quartos');
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast({
        title: 'Erro ao deletar quarto',
        description: message || '',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateRoom = async (values: RoomInput) => {
    const hasRoomNotChanged = isEqual(values, room);

    if (hasRoomNotChanged) {
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
          title: 'Quarto atualizado com sucesso!',
          description: '',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/quartos');
      } catch (error: any) {
        const message = error?.response?.data?.message;

        toast({
          title: 'Falha ao atualizar quarto 😥',
          description: message || '',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    reset({ ...room });
  }, [room, roomTypes, roomStatus, reset]);

  return (
    <>
      <Head>
        <title>Editar Quarto</title>
      </Head>
      <Box>
        <Header />
        <Menu />
        <Flex w='100%' my='6' maxW={1480} mx='auto' p='4'>
          <Sidebar />
          <Box
            as='form'
            onSubmit={handleSubmit(handleUpdateRoom)}
            flex='1'
            p='4'
          >
            <Flex mb='4' alignItems='center' justifyContent='space-between'>
              <Heading size='md' fontWeight='bold'>
                Editar quarto
                {!isLoading && isFetching && (
                  <Spinner size='md' color='yellow.500' ml='4' />
                )}
              </Heading>
              <IconButton
                as='a'
                display='flex'
                colorScheme='red'
                aria-label='Excluir quarto'
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
                <Text>Falha ao obter os dados do quarto.</Text>
              </Flex>
            ) : (
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
            )}
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
              Excluir quarto
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
                Tem certeza que deseja excluir este quarto?
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

export default EditRoom;
