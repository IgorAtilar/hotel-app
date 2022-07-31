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

import {
  useRoomType,
  updateRoomType,
  deleteRoomType,
} from '@/hooks/useRoomType';
import { UpdateRoomTypeInput } from '@/types/room-types';
import { FiTrash2 } from 'react-icons/fi';
import { isEqual } from 'lodash';
import { Menu } from '@/components/Menu';

const editTypeFormSchema = yup.object().shape({
  name: yup.string().required('O nome do status é obrigatório'),
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

const EditUser: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const { query } = router;

  const id: string = query.id as string;

  const { data, isLoading, isFetching, error } = useRoomType(id, {
    refetchInterval: Infinity,
    refetchOnWindowFocus: false,
  });

  const { roomType } = data || {};

  const { mutateAsync } = useMutation(
    (type: UpdateRoomTypeInput) => updateRoomType(type),
    {
      onSuccess: () => queryClient.invalidateQueries('status'),
    }
  );

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateRoomTypeInput>({
    resolver: yupResolver(editTypeFormSchema),
    reValidateMode: 'onBlur',
    defaultValues: useMemo(() => {
      return {
        ...roomType,
      };
    }, [roomType]),
  });

  const handleDeleteStatus = async () => {
    try {
      await deleteRoomType(roomType?.id!);
      toast({
        title: 'Tipo de quarto removido com sucesso!',
        description: '',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/tipos-de-quartos');
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast({
        title: 'Erro ao deletar tipo de quarto',
        description: message || '',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateStatus = async (values: UpdateRoomTypeInput) => {
    const hasTypeChanged = isEqual(values, roomType);

    if (hasTypeChanged) {
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
          title: 'Tipo de quarto atualizado com sucesso!',
          description: '',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/tipos-de-quartos');
      } catch (error: any) {
        const message = error?.response?.data?.message;

        toast({
          title: 'Falha ao atualizar tipo de quarto 😥',
          description: message || '',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    reset({ ...roomType });
  }, [roomType, reset]);

  return (
    <>
      <Head>
        <title>Editar Tipo de Quarto</title>
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
                Editar tipo de quarto
                {!isLoading && isFetching && (
                  <Spinner size='md' color='yellow.500' ml='4' />
                )}
              </Heading>
              <IconButton
                as='a'
                display='flex'
                colorScheme='red'
                aria-label='Excluir tipo de quarto'
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
                <Text>Falha ao obter os dados do tipo de quarto.</Text>
              </Flex>
            ) : (
              <VStack spacing={['6', '8']}>
                <SimpleGrid minChildWidth='240px' spacing={['6', '8']} w='100%'>
                  <Input
                    label='Nome'
                    error={errors.name}
                    {...register('name')}
                  />
                  <Input
                    type='number'
                    label='Preço diário'
                    error={errors.daily_price}
                    {...register('daily_price')}
                  />
                </SimpleGrid>
              </VStack>
            )}
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
              Excluir tipo de quarto
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
                Tem certeza que deseja excluir este tipo de quarto?
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
