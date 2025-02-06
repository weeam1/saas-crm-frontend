import React from 'react';
import { Button, Spinner } from '@chakra-ui/react';

const CustomButton = ({ isLoading, isDisabled, children, ...rest }) => (
	<Button
		bg='brand.500'
		color='white'
		_hover={{
			bg: 'brand.600',
			color: 'white',
		}}
		_active={{
			bg: 'brand.600',
		}}
		size='sm'
		rounded='md'
		type='submit'
		mt={4}
		isDisabled={isDisabled}
		{...rest}
	>
		{isLoading ? <Spinner /> : children}
	</Button>
);

export default CustomButton;
