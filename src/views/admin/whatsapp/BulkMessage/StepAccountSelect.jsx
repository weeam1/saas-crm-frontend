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
import { useModalColors } from 'hooks/useModalColors';

const LIMIT = 10;

export function StepAccountSelect({ onNext }) {
	const colors = useModalColors();
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
				<Heading size='md' color={colors.headingText}>WhatsApp Account</Heading>
				<Text fontSize='sm' color={colors.mutedText}>
					Select the WhatsApp account you want to send messages from.
				</Text>
			</Box>

			<Box
			      maxHeight="50vh"
      minH="50vh"
				overflowY='auto'
				borderRadius='md'
				boxShadow={colors.cardShadow}
				bg={colors.bg}
				border='1px solid'
				borderColor={colors.borderColor}
			>
				{isLoading || isFetching ? (
					<VStack justify='center' align='center' minH='200px'>
						<Spinner size='xl' color={colors.accentGold} />
						<Text color={colors.bodyText}>Loading accounts...</Text>
					</VStack>
				) : accounts.length === 0 ? (
					<Text color={colors.mutedText} p={4}>No accounts available.</Text>
				) : (
					<RadioGroup
						onChange={setSelectedAccount}
						value={selectedAccount?._id || ''}
						colorScheme='yellow'
						w='100%'
					>
						<Table variant='simple' overflow='scroll' size='md'>
							<Thead position='sticky' top={0} zIndex={2}>
								<Tr bg={colors.bgDeep}>
									<Th borderColor={colors.borderColor} color={colors.headingText}></Th>
									<Th borderColor={colors.borderColor} color={colors.headingText}>Account Name</Th>
									<Th borderColor={colors.borderColor} color={colors.headingText}>Business ID</Th>
									<Th borderColor={colors.borderColor} color={colors.headingText}>Phone ID</Th>
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
											bg={isSelected ? colors.bgDeep : 'transparent'}
											_hover={{ bg: isSelected ? colors.bgDeep : colors.bgInput }}
											borderLeft={
												isSelected ? `4px solid ${colors.accentGold}` : '4px solid transparent'
											}
											transition='all 0.2s ease'
										>
											<Td borderColor={colors.borderColor}>
												<Radio value={account._id} pointerEvents='none' />
											</Td>
											<Td
												fontWeight={isSelected ? 'semibold' : 'normal'}
												color={colors.headingText}
												borderColor={colors.borderColor}
											>
												{account?.user?.fullName || 'N/A'}
											</Td>
											<Td color={colors.bodyText} borderColor={colors.borderColor}>
												{account.businessId || '-'}
											</Td>
											<Td color={colors.bodyText} borderColor={colors.borderColor}>
												{account.phoneNumber || '-'}
											</Td>
										</Tr>
									);
								})}
							</Tbody>
						</Table>
					</RadioGroup>
				)}
			</Box>

			<Button
				isDisabled={!selectedAccount}
				onClick={() => onNext(selectedAccount)}
				alignSelf='flex-end'
				px='10'
				py='5'
				fontSize={{ base: 'sm', md: 'lg' }}
				variant='brand'
			>
				Next
			</Button>
		</VStack>
	);
}