import { Stack } from '@chakra-ui/react';
import {
  FiAward,
  FiBriefcase,
  FiClipboard,
  FiCreditCard,
  FiFlag,
  FiUsers,
} from 'react-icons/fi';
import { NavLink } from './NavLink';
import { NavSection } from './NavSection';

export const SidebarNav = () => (
  <Stack spacing='12' align='flex-start'>
    <NavSection title='GERAL'>
      <NavLink icon={FiUsers} href='/clientes'>
        Clientes
      </NavLink>
      <NavLink icon={FiClipboard} href='/administradores'>
        Administradores
      </NavLink>
      <NavLink icon={FiBriefcase} href='/quartos'>
        Quartos
      </NavLink>
      <NavLink icon={FiCreditCard} href='/reservas'>
        Reservas
      </NavLink>
      <NavLink icon={FiFlag} href='/status'>
        Status dos quartos
      </NavLink>
      <NavLink icon={FiAward} href='/tipos-de-quartos'>
        Tipos de quartos
      </NavLink>
    </NavSection>
  </Stack>
);
