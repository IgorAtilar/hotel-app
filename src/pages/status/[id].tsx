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

import { deleteStatus, updateStatus, useStatus } from '@/hooks/useStatus';
import { RoomStatus, RoomStatusInput } from '@/types/room-status';
import { FiTrash2 } from 'react-icons/fi';
import { isEqual } from 'lodash';
import { Menu } from '@/components/Menu';

const editStatusFormSchema = yup.object().shape({
  name: yup.string().required('O nome do status é obrigatório'),
});

const EditUser: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const { query } = router;

  const id: string = query.id as string;

  const { data, isLoading, isFetching, error } = useStatus(id, {
    refetchInterval: Infinity,
    refetchOnWindowFocus: false,
  });

  const { roomStatus } = data || {};

  const { mutateAsync } = useMutation(
    (status: RoomStatusInput) => updateStatus(status),
    {
      onSuccess: () => queryClient.invalidateQueries('status'),
    }
  );

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RoomStatusInput>({
    resolver: yupResolver(editStatusFormSchema),
    reValidateMode: 'onBlur',
    defaultValues: useMemo(() => {
      return {
        ...roomStatus,
      };
    }, [roomStatus]),
  });

  const handleDeleteStatus = async () => {
    try {
      await deleteStatus(roomStatus?.id!);
      toast({
        title: 'Status removido com sucesso!',
        description: '',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/status');
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast({
        title: 'Erro ao deletar status',
        description: message || '',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateStatus = async (values: RoomStatusInput) => {
    const hasStatusChanged = isEqual(values, roomStatus);

    if (hasStatusChanged) {
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
          title: 'Status atualizado com sucesso!',
          description: '',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/status');
      } catch (error: any) {
        const message = error?.response?.data?.message;

        toast({
          title: 'Falha ao atualizar status 😥',
          description: message || '',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    reset({ ...(roomStatus as RoomStatus) });
  }, [roomStatus, reset]);

  return (
    <>
      <Head>
        <title>Editar Status</title>
      </Head>
      <Box>
        <Header />
        <Menu />
        <Flex w='100%' my='6' maxW={1480} mx='auto' p='4'>
          <Sidebar />
          <Box
            as='form'
            onSubmit={handleSubmit(handleUpdateStatus)}
            flex='1'
            p='4'
          >
            <Flex mb='4' alignItems='center' justifyContent='space-between'>
              <Heading size='md' fontWeight='bold'>
                Editar status
                {!isLoading && isFetching && (
                  <Spinner size='md' color='yellow.500' ml='4' />
                )}
              </Heading>
              <IconButton
                as='a'
                display='flex'
                colorScheme='red'
                aria-label='Excluir status'
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
                <Text>Falha ao obter os dados do status.</Text>
              </Flex>
            ) : (
              <VStack spacing={['6', '8']}>
                <SimpleGrid minChildWidth='240px' spacing={['6', '8']} w='100%'>
                  <Input
                    label='Nome'
                    error={errors.name}
                    {...register('name')}
                  />
                </SimpleGrid>
              </VStack>
            )}
            <Flex mt='8' justify='flex-end'>
              <HStack spacing='4'>
                <Link href='/status' passHref>
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
              Excluir status
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
                Tem certeza que deseja excluir este status?
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
              onClick={handleDeleteStatus}
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

export default EditUser;
