import React from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';

const Button = ({ children, variant = 'brand', ...props }) => {
  return (
    <ChakraButton variant={variant} {...props}>
      {children}
    </ChakraButton>
  );
};

export default Button;