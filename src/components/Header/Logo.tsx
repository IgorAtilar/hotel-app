import { Box, Text, TextProps } from '@chakra-ui/react';

type LogoProps = TextProps;

export const Logo = ({ ...rest }: LogoProps) => (
  <Text fontSize={'2xl'} fontWeight='normal' color='gray.900' {...rest}>
    Hotel
    <Text as='span' color='cyan.900' ml='2' fontWeight='bold'>
      App
    </Text>
  </Text>
);
