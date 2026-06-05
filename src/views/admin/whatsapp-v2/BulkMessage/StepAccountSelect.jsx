import {
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Radio,
	RadioGroup,
	Heading,
	Text,
	Button,
	Spinner,
	VStack,
	Stack,
	Flex,
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useState, useEffect } from 'react';
import { buttonStyle } from 'utils/btn';

const LIMIT = 10;

export function StepAccountSelect({ onNext }) {
	const [page] = useState(1);
	const [selectedAccount, setSelectedAccount] = useState(null);
	const { data, isLoading, isFetching } = useFetchItemsQuery(
		{
			path: 'whatsapp/users',
			params: { page, limit: LIMIT },
		},
		{ refetchOnMountOrArgChange: true }
	);

	const accounts = data?.doc || [];

	return (
		<VStack align='stretch' spacing={6}>
			<Box mb='2'>
				<Heading size='md'>WhatsApp Account</Heading>
				<Text fontSize='sm' color='gray.600'>
					Select the WhatsApp account you want to send messages from.
				</Text>
			</Box>

			<Box
				      maxHeight="70vh"
      minH="70vh"
				overflowY='auto'
				borderRadius='md'
				boxShadow='sm'
				bg='white'
			>
				{isLoading || isFetching ? (
					<VStack justify='center' align='center' minH='200px'>
						<Spinner size='xl' color='green.500' />
						<Text>Loading accounts...</Text>
					</VStack>
				) : accounts.length === 0 ? (
					<Text color='gray.500'>No accounts available.</Text>
				) : (
					<RadioGroup
						onChange={setSelectedAccount}
						value={selectedAccount?._id || ''}
						colorScheme='whatsapp'
						w='100%'
					>
						<Table variant='simple' overflow='scroll' size='md'>
							<Thead position='sticky' top={0} zIndex={2}>
								<Tr bg='gray.100'>
									<Th></Th>
									<Th>Account Name</Th>
									<Th>Business ID</Th>
									<Th>Phone ID</Th>
								</Tr>
							</Thead>
							<Tbody>
								{accounts.map((account) => {
									const isSelected = selectedAccount?._id === account._id;
									return (
										<Tr
											key={account._id}
											cursor='pointer'
											onClick={() => setSelectedAccount(account)}
											bg={isSelected ? 'whatsapp.50' : 'transparent'}
											_hover={{ bg: isSelected ? 'whatsapp.100' : 'gray.50' }}
											borderLeft={
												isSelected ? '4px solid green' : '4px solid transparent'
											}
											transition='all 0.2s ease'
										>
											<Td>
												<Radio value={account._id} pointerEvents='none' />
											</Td>
											<Td fontWeight={isSelected ? 'semibold' : 'normal'}>
												{account?.user?.fullName || 'N/A'}
											</Td>
											<Td>{account.businessId || '-'}</Td>
											<Td>{account.phoneNumber || '-'}</Td>
										</Tr>
									);
								})}
							</Tbody>
						</Table>
					</RadioGroup>
				)}
			</Box>

			<Button
				{...buttonStyle}
				isDisabled={!selectedAccount}
				onClick={() => onNext(selectedAccount)}
				alignSelf='flex-end'
				px='10'
				py='5'
				fontSize={{ base: 'sm', md: 'lg' }}
				colorScheme='whatsapp'
			>
				Next
			</Button>
		</VStack>
	);
}
