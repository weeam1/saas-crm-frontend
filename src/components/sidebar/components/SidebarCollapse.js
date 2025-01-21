import React, { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

const SidebarCollapse = ({ name, icon, children }) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleToggle = () => {
		setIsOpen((prev) => !prev);
	};

	return (
		<Box>
			<Flex
				onClick={handleToggle}
				alignItems='center'
				cursor='pointer'
				p={2}
				_hover={{ bg: 'gray.200' }} // Optional: hover effect
			>
				{icon}
				<Text ml={2}>{name}</Text>
			</Flex>
			{isOpen && (
				<Box pl={4} bg='gray.50'>
					{children} {/* Render child routes */}
				</Box>
			)}
		</Box>
	);
};

export default SidebarCollapse;
