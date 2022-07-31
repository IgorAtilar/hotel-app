import React, { useMemo } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { NextPage } from 'next';
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { useTable, Column } from 'react-table';
import { FiEdit, FiPlusSquare } from 'react-icons/fi';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Client, ClientBooking } from '@/types/clients';
import { useClients } from '@/hooks/useClients';
import { Menu } from '@/components/Menu';

const Clients: NextPage = () => {
  const { data: response, isLoading, isFetching, error } = useClients();

  const data = response?.clients || [];

  const columns = useMemo<Column<Client>[]>(
    () => [
      {
        Header: 'CPF',
        accessor: 'cpf',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'E-mail',
        accessor: 'email',
      },

      {
        Header: 'Reservas',
        accessor: 'bookings',
        Cell: ({ cell: { value } }: any) =>
          value.map((booking: ClientBooking) => (
            <Flex
              flexDir='column'
              key={booking.id}
              w='100%'
              justifyContent='space-between'
              alignItems='center'
              mb={4}
              bg='gray.600'
              p={2}
              borderRadius={4}
              color='whitesmoke'
            >
              <Text mb={2} textAlign='center'>
                <strong>Quarto:</strong> {booking.room}
              </Text>
              <Flex
                w='100%'
                flexDirection={['column', 'row']}
                justifyContent='space-between'
                alignItems='center'
              >
                <Box>
                  <Text textAlign='center'>
                    <strong>Check-in:</strong> {booking.start_date}
                  </Text>
                </Box>
                <Box>
                  <Text textAlign='center'>
                    <strong>Check-out:</strong> {booking.end_date}
                  </Text>
                </Box>
              </Flex>
            </Flex>
          )),
      },
      {
        Header: 'Editar',
        accessor: 'id',
        Cell: ({ cell: { value: id } }: any) => {
          return (
            <NextLink href={`/clientes/${id}`}>
              <IconButton
                as='a'
                display='flex'
                aria-label='Abrir menu'
                variant='unstyled'
                bg='transparent'
                icon={<Icon as={FiEdit} />}
                fontSize='20'
                cursor='pointer'
                _hover={{ color: 'cyan.500' }}
              />
            </NextLink>
          );
        },
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <>
      <Head>
        <title>Clientes</title>
      </Head>
      <Header />
      <Menu />
      <Flex w='100%' my='6' mx='auto' p='4'>
        <Sidebar />
        <Box w='100%' mx='auto' p='2'>
          <Flex
            mb='4'
            flexDir='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Heading size='md' fontWeight='bold'>
              Clientes
              {!isLoading && isFetching && <Spinner size='sm' ml='4' />}
            </Heading>
            <NextLink href='/clientes/adicionar' passHref>
              <Button
                as='a'
                size='md'
                variant='solid'
                leftIcon={<Icon as={FiPlusSquare} fontSize='20' />}
              >
                Adicionar
              </Button>
            </NextLink>
          </Flex>
          <Box overflowX='auto' flex='1'>
            {isLoading ? (
              <Flex height='100%' justify='center' align='center'>
                <Spinner size='lg' />
              </Flex>
            ) : error ? (
              <Flex height='100%' justify='center' align='center'>
                <Text>Falha ao obter os dados dos clientes.</Text>
              </Flex>
            ) : (
              <>
                <Table variant='unstyled' size='lg' {...getTableProps()}>
                  <Thead>
                    {headerGroups.map((headerGroup, idx) => {
                      return (
                        <Tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                          {headerGroup.headers.map((column) => (
                            <Th {...column.getHeaderProps()} key={column.id}>
                              <Flex align='center' justify='space-between'>
                                <Text>{column.render('Header')}</Text>
                              </Flex>
                            </Th>
                          ))}
                        </Tr>
                      );
                    })}
                  </Thead>
                  <Tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                      prepareRow(row);
                      return (
                        <Tr key={row.original.id}>
                          {row.cells.map((cell) => {
                            return (
                              <Td {...cell.getCellProps()} key={cell.column.id}>
                                {cell.render('Cell')}
                              </Td>
                            );
                          })}
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </>
            )}
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default Clients;
