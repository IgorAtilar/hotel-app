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
import { Admin } from '@/types/admins';
import { useAdmins } from '@/hooks/useAdmins';
import { Menu } from '@/components/Menu';

const Admins: NextPage = () => {
  const { data: response, isLoading, isFetching, error } = useAdmins();

  const data = response?.admins || [];

  const columns = useMemo<Column<Admin>[]>(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'E-mail',
        accessor: 'email',
      },
      {
        Header: 'Editar',
        accessor: 'id',
        Cell: ({ cell: { value: id } }: any) => {
          return (
            <NextLink href={`/administradores/${id}`}>
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
        <title>Administradores</title>
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
              Administradores
              {!isLoading && isFetching && <Spinner size='sm' ml='4' />}
            </Heading>
            <NextLink href='/administradores/adicionar' passHref>
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
                <Text>Falha ao obter os dados dos administradores.</Text>
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

export default Admins;
