import {
	Box,
	Heading,
	Text,
	Badge,
	Stack,
	Divider,
	Flex,
} from '@chakra-ui/react';
import { formatAmount, formatCurrency } from 'utils/helpers';

export default function CommissionSummary({ sharedUsers, info = true }) {
	if (!sharedUsers || sharedUsers.length === 0) return null;

	return (
		<Box p='2' borderWidth='1px' borderRadius='lg' shadow='sm'>
			<Box>
				<Text fontSize='md' fontWeight='bold' color='gray.600' mb={3}>
					Commission Breakdown
				</Text>

				<Stack spacing={4}>
					{sharedUsers.map((u) => {
						const isDeal = u.commissionType === 'DEAL_COMMISSION';

						return (
							<Box
								key={u.user}
								p={2}
								borderWidth='1px'
								borderRadius='md'
								bg='gray.50'
							>
								<Flex justify='space-between' align='center'>
									<Box>
										<Text fontWeight='bold' fontSize='sm'>
											{u.name}{' '}
											{/* <Badge
												ml={2}
												colorScheme={
													u.role === 'agent'
														? 'blue'
														: u.role === 'manager'
															? 'purple'
															: 'gray'
												}
											>
												{u.role}
											</Badge> */}
										</Text>

										<Text mt={1} fontSize='sm' color='gray.600'>
											Commission: {u.commission}%{' '}
											<Badge
												ml={2}
												size='sm'
												colorScheme={isDeal ? 'green' : 'brand'}
											>
												{u.commissionType?.split('_').join(' ') ||
													'DEAL COMMISSION'}
											</Badge>
										</Text>
									</Box>

									<Text
										fontWeight='bold'
										fontSize='md'
										color={isDeal ? 'green.600' : 'brand.600'}
									>
										{formatCurrency(u.commissionAmount, 'AED')}
									</Text>
								</Flex>
							</Box>
						);
					})}
				</Stack>

				{info && (
					<>
						<Divider mt={6} />

						<Text mt={3} fontSize='sm' color='gray.500'>
							All amounts refresh automatically when you modify unit price or
							commission values.
						</Text>
					</>
				)}
			</Box>
		</Box>
	);
}
