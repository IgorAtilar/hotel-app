import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';
import { SidebarNav } from './SidebarNav';
import { useSidebarDrawer } from '../../contexts/SidebarDrawerContext';

export const Sidebar = () => {
  const { isOpen, onClose } = useSidebarDrawer();

  return (
    <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent p='4' bg='gray.50'>
          <DrawerCloseButton mt='6' color='gray.900' />
          <DrawerHeader color='gray.500'>Menu</DrawerHeader>
          <DrawerBody>
            <SidebarNav />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
