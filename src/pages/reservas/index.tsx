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
import { Booking } from '@/types/bookings';
import { useBookings } from '@/hooks/useBookings';
import { Menu } from '@/components/Menu';

const Bookings: NextPage = () => {
  const { data: response, isLoading, isFetching, error } = useBookings();

  const data = response?.bookings || [];

  const columns = useMemo<Column<Booking>[]>(
    () => [
      {
        Header: 'Quarto',
        accessor: 'room_number',
      },
      {
        Header: 'Cliente',
        accessor: 'client_name',
      },
      {
        Header: 'E-mail',
        accessor: 'client_email',
      },

      {
        Header: 'Check-in',
        accessor: 'start_date',
      },

      {
        Header: 'Check-out',
        accessor: 'end_date',
      },

      {
        Header: 'Editar',
        accessor: 'id',
        Cell: ({ cell: { value: id } }: any) => {
          return (
            <NextLink href={`/reservas/${id}`}>
              <IconButton
                as='a'
                display='flex'
                aria-label='Editar'
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
        <title>Reservas</title>
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
              Reservas
              {!isLoading && isFetching && <Spinner size='sm' ml='4' />}
            </Heading>
            <NextLink href='/reservas/adicionar' passHref>
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
                <Text>Falha ao obter os dados das reservas.</Text>
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

export default Bookings;
