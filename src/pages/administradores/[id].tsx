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

import { useAdmin, updateAdmin, deleteAdmin } from '@/hooks/useAdmin';
import { AdminInput } from '@/types/admins';
import { FiTrash2 } from 'react-icons/fi';
import { isEqual } from 'lodash';
import { Menu } from '@/components/Menu';

const editAdminFormSchema = yup.object().shape({
  name: yup.string().required('O nome do administrador é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup
    .string()
    .matches(/^(|.{4,})$/, 'A senha deve ter no mínimo 4 caracteres'),
});

const EditUser: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const { query } = router;

  const id: string = query.id as string;

  const { data, isLoading, isFetching, error } = useAdmin(id, {
    refetchInterval: Infinity,
    refetchOnWindowFocus: false,
  });

  const { admin } = data || {};

  const { mutateAsync } = useMutation(
    (admin: AdminInput) => updateAdmin(admin),
    {
      onSuccess: () => queryClient.invalidateQueries('admins'),
    }
  );

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminInput>({
    resolver: yupResolver(editAdminFormSchema),
    reValidateMode: 'onBlur',
    defaultValues: useMemo(() => {
      return {
        ...admin,
      };
    }, [admin]),
  });

  const handleDeleteAdmin = async () => {
    try {
      await deleteAdmin(admin?.id!);
      toast({
        title: 'Administrador removido com sucesso!',
        description: '',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/administradores');
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast({
        title: 'Erro ao deletar administrador',
        description: message || 'Ocorreu um erro ao deletar o administrador',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateAdmin = async (values: AdminInput) => {
    const hasAdminChanged = isEqual(values, admin);

    if (hasAdminChanged) {
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
          title: 'Administrador atualizado com sucesso!',
          description: '',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/administradores');
      } catch (error: any) {
        const message = error?.response?.data?.message;

        toast({
          title: 'Falha ao atualizar administrador 😥',
          description:
            message || 'Ocorreu um erro ao atualizar o administrador',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    reset({ ...admin });
  }, [admin, reset]);

  return (
    <>
      <Head>
        <title>Editar Administrador</title>
      </Head>
      <Box>
        <Header />
        <Menu />
        <Flex w='100%' my='6' maxW={1480} mx='auto' p='4'>
          <Sidebar />
          <Box
            as='form'
            onSubmit={handleSubmit(handleUpdateAdmin)}
            flex='1'
            p='4'
          >
            <Flex mb='4' alignItems='center' justifyContent='space-between'>
              <Heading size='md' fontWeight='bold'>
                Editar administrador
                {!isLoading && isFetching && (
                  <Spinner size='md' color='yellow.500' ml='4' />
                )}
              </Heading>
              <IconButton
                as='a'
                display='flex'
                colorScheme='red'
                aria-label='Excluir administrador'
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
                <Text>Falha ao obter os dados do administrador.</Text>
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
                    type='email'
                    label='E-mail'
                    error={errors.email}
                    {...register('email')}
                  />
                </SimpleGrid>
                <SimpleGrid minChildWidth='240px' spacing={['6', '8']} w='100%'>
                  <Input
                    label='Nova senha'
                    error={errors.password}
                    {...register('password')}
                  />
                </SimpleGrid>
              </VStack>
            )}
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
              Excluir administrador
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
                Tem certeza que deseja excluir este administrador?
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
              onClick={handleDeleteAdmin}
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
