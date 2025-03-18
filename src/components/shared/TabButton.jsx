const { Button } = require('@chakra-ui/react');

const TabButton = ({ isActive, onClick, children }) => (
	<Button
		onClick={onClick}
		bg={isActive ? 'brand.400' : 'white'}
		color={isActive ? 'white' : 'gray.800'}
		_hover={{ bg: isActive ? 'brand.500' : 'gray.100' }}
		_focus={{ boxShadow: 'none' }}
		rounded='md'
		shadow='sm'
		fontSize='lg'
		fontWeight='normal'
		transition='all 0.3s ease'
	>
		{children}
	</Button>
);

export default TabButton;
