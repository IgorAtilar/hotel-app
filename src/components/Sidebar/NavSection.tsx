import { ReactNode } from 'react';
import { Box, Stack, Text } from '@chakra-ui/react';

type NavSectionProps = {
  title: string;
  children: ReactNode;
};

export const NavSection = ({ title, children }: NavSectionProps) => (
  <Box>
    <Text fontWeight='bold' color='gray.500' fontSize='small'>
      {title}
    </Text>
    <Stack spacing='4' mt='8' align='stretch'>
      {children}
    </Stack>
  </Box>
);
