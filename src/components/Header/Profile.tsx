import { useAuth } from '@/contexts/AuthContext';
import {
  Flex,
  Box,
  Text,
  Avatar,
  FlexProps,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  MenuDivider,
  Icon,
} from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';

type ProfileProps = FlexProps & {
  showProfileData?: boolean;
  name: string;
  email: string;
};

export const Profile = ({
  showProfileData = true,
  name,
  email,
  ...rest
}: ProfileProps) => {
  const { signOut } = useAuth();
  return (
    <Menu>
      <Flex align='center' {...rest}>
        {showProfileData && (
          <Box mr='4' textAlign='right'>
            <Text color='gray.900'>{name}</Text>
            <Text color='gray.600' fontSize='small'>
              {email}
            </Text>
          </Box>
        )}
        <MenuButton>
          <Avatar size='md' name={name} />
        </MenuButton>
      </Flex>

      <MenuList>
        <MenuGroup title='Opções'>
          <MenuItem onClick={signOut}>
            Sair <Icon ml='4' as={FiLogOut} />
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};
