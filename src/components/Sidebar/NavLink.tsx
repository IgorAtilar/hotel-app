import { ElementType } from 'react';
import {
  Link as ChakraLink,
  Icon,
  Text,
  LinkProps as ChakraLinkProps,
} from '@chakra-ui/react';
import { ActiveLink } from '../ActiveLink';

type NavLinkProps = ChakraLinkProps & {
  icon: ElementType;
  children: string;
  href: string;
};

export const NavLink = ({ icon, children, href, ...rest }: NavLinkProps) => (
  <ActiveLink href={href} passHref>
    <ChakraLink display='flex' align='center' {...rest}>
      <Icon as={icon} fontSize='20' />
      <Text ml='4' textDecoration='none'>
        {children}
      </Text>
    </ChakraLink>
  </ActiveLink>
);
