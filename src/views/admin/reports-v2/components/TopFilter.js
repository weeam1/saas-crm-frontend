import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';

const TopFilter = ({ view, setView, options }) => {
	return (
		<Menu>
			<MenuButton
				as={Button}
				rightIcon={<FiChevronDown />}
				variant='outline'
				colorScheme='gray'
				rounded='md'
				size='sm'
				bg='gray.100'
			>
				{options.find((item) => item.value === view)?.label || 'Select View'}
			</MenuButton>
			<MenuList>
				{options.map((item) => (
					<MenuItem key={item.value} onClick={() => setView(item.value)}>
						{item.label}
					</MenuItem>
				))}
			</MenuList>
		</Menu>
	);
};

export default TopFilter;
