import { useNavigate } from 'react-router-dom';
import { Box, SimpleGrid, Text, Icon, Flex } from '@chakra-ui/react';
import { FaUniversity } from 'react-icons/fa';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { PiBuildingsBold } from 'react-icons/pi';

const InvoiceModule = () => {
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem('user'));
	const role =
		user?.role === 'superAdmin' ? 'superAdmin' : user?.roles[0]?.roleName;

	const menuItems = [
		{
			label: 'Developers',
			icon: PiBuildingsBold,
			route: `/invoice/developers`,
		},
		{
			label: 'Bank Accounts',
			icon: FaUniversity,
			route: `/invoice/bank-accounts`,
		},
	];

	return (
		<Box p={4}>
			<Flex align='center' mb={4} p='4' bg='white' borderRadius='lg'>
				<Icon
					as={HiOutlineDocumentReport}
					boxSize={6}
					color='brand.500'
					mr={2}
				/>
				<Text fontSize='2xl' fontWeight='bold'>
					Invoice Management
				</Text>
			</Flex>

			<SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
				{menuItems.map((item) => (
					<Box
						key={item.label}
						p={6}
						bg='white'
						borderRadius='lg'
						textAlign='center'
						cursor='pointer'
						_hover={{ bg: 'brand.400', color: 'white' }}
						onClick={() => navigate(item.route)}
					>
						<Icon as={item.icon} boxSize={8} mb={2} />
						<Text fontSize='md' fontWeight='bold'>
							{item.label}
						</Text>
					</Box>
				))}
			</SimpleGrid>
		</Box>
	);
};

export default InvoiceModule;
