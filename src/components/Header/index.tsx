import {
  Flex,
  FlexProps,
  Icon,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Profile } from './Profile';
import { useSidebarDrawer } from '../../contexts/SidebarDrawerContext';
import { FiMenu } from 'react-icons/fi';
import { useMe } from '@/hooks/useMe';
import { Logo } from './Logo';

type HeaderProps = FlexProps;

export const Header = ({ ...rest }: HeaderProps) => {
  const { data: me } = useMe();

  const { onOpen } = useSidebarDrawer();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Flex
      as='header'
      w='100%'
      h='20'
      marginTop={2}
      px='8'
      alignItems='center'
      justifyContent='space-between'
      align='center'
      {...rest}
    >
      {!isWideVersion && (
        <IconButton
          display='flex'
          aria-label='Abrir menu'
          icon={<Icon as={FiMenu} />}
          fontSize='24'
          color='gray.500'
          variant='unstyled'
          onClick={onOpen}
          mr='2'
        />
      )}
      <Logo />
      <Profile
        showProfileData={isWideVersion}
        name={me?.name || ''}
        email={me?.email || ''}
      />
    </Flex>
  );
};
