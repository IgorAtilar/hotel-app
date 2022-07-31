import { Box, Flex, Icon, Text, useBreakpointValue } from '@chakra-ui/react';
import {
  FiAward,
  FiBriefcase,
  FiClipboard,
  FiCreditCard,
  FiFlag,
  FiUsers,
} from 'react-icons/fi';
import { ActiveLink } from '../ActiveLink';

export const Menu = () => {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  if (isWideVersion) {
    return (
      <Flex
        w='100%'
        alignItems='center'
        justifyContent='space-around'
        marginTop='4'
        p='4'
        bg='gray.50'
      >
        <ActiveLink href='/clientes'>
          <Flex
            flexDir='column'
            cursor='pointer'
            alignItems='center'
            _hover={{
              color: 'cyan.500',
            }}
          >
            <Icon as={FiUsers} />
            <Text>Clientes</Text>
          </Flex>
        </ActiveLink>
        <ActiveLink href='/administradores'>
          <Flex
            flexDir='column'
            cursor='pointer'
            alignItems='center'
            _hover={{
              color: 'cyan.500',
            }}
          >
            <Icon as={FiClipboard} />
            <Text>Administradores</Text>
          </Flex>
        </ActiveLink>
        <ActiveLink href='/quartos'>
          <Flex
            flexDir='column'
            cursor='pointer'
            alignItems='center'
            _hover={{
              color: 'cyan.500',
            }}
          >
            <Icon as={FiBriefcase} />
            <Text>Quartos</Text>
          </Flex>
        </ActiveLink>
        <ActiveLink href='/reservas'>
          <Flex
            flexDir='column'
            cursor='pointer'
            alignItems='center'
            _hover={{
              color: 'cyan.500',
            }}
          >
            <Icon as={FiCreditCard} />
            <Text>Reservas</Text>
          </Flex>
        </ActiveLink>
        <ActiveLink href='/status'>
          <Flex
            flexDir='column'
            cursor='pointer'
            alignItems='center'
            _hover={{
              color: 'cyan.500',
            }}
          >
            <Icon as={FiFlag} />
            <Text>Status dos quartos</Text>
          </Flex>
        </ActiveLink>
        <ActiveLink href='/tipos-de-quartos'>
          <Flex
            flexDir='column'
            cursor='pointer'
            alignItems='center'
            _hover={{
              color: 'cyan.500',
            }}
          >
            <Icon as={FiAward} />
            <Text>Tipos de quartos</Text>
          </Flex>
        </ActiveLink>
      </Flex>
    );
  }
  return null;
};
