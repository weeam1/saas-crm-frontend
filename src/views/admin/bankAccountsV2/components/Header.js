import React from 'react';
import { Flex, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import AddAccountModal from './AddAccount';
import AccountCount from './Count';

const Header = ({
	accountCount,
	onAdd,
	isAdding,
	searchComponent,
	onClear,
	searchQuery,
}) => {
	const navigate = useNavigate();

	const handleBack = () => {
		navigate('/admin-setting');
	};

	return (
		<Flex
			justify='space-between'
			align={{ base: 'flex-start', md: 'center' }}
			mb={6}
			bg='white'
			p={4}
			borderRadius='md'
			boxShadow='sm'
			direction={{ base: 'column', md: 'row' }}
			w='100%'
		>
			<Flex
				align='center'
				gap={{ base: 2 }}
				justify={{ base: 'flex-start', sm: 'space-between', md: 'flex-start' }}
				w={{ base: '100%', md: 'auto' }}
				flexWrap={{ base: 'wrap', md: 'nowrap' }}
			>
				<AccountCount count={accountCount} />
				{searchComponent}
				{searchQuery && (
					<Button
						size='sm'
						variant='outline'
						onClick={onClear}
						ml={{ base: 0, md: 2 }}
						mt={{ base: 2, md: 0 }}
					>
						Clear
					</Button>
				)}
			</Flex>

			<Flex
				gap={{ base: 2, md: 4 }}
				align='center'
				direction={{ base: 'row', md: 'row' }}
				justify={{ base: 'space-between', md: 'flex-end' }}
				w={{ base: '100%', md: 'auto' }}
				mt={{ base: 4, md: 0 }}
			>
				<AddAccountModal onAdd={onAdd} isAdding={isAdding} />
				{/* <Button
          bg="#B79045"
          color="white"
          fontFamily="DM Sans"
          px={6}
          borderRadius="8px"
          w={{ base: "auto", md: "auto" }}
          onClick={handleBack}
          _hover={{ bg: "#9E7A3B" }}
        >
          Back
        </Button> */}
			</Flex>
		</Flex>
	);
};

export default Header;
