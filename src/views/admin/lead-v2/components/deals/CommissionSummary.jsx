// import {
// 	Box,
// 	Heading,
// 	Text,
// 	Badge,
// 	Stack,
// 	Divider,
// 	Flex,
// } from '@chakra-ui/react';
// import { formatAmount, formatCurrency } from 'utils/helpers';

// export default function CommissionSummary({ sharedUsers, info = true }) {
// 	if (!sharedUsers || sharedUsers.length === 0) return null;

// 	return (
// 		<Box p='2' borderWidth='1px' borderRadius='lg' shadow='sm'>
// 			<Box>
// 				<Text fontSize='md' fontWeight='bold' color='gray.600' mb={3}>
// 					Commission Breakdown
// 				</Text>

// 				<Stack spacing={4}>
// 					{sharedUsers.map((u) => {
// 						const isDeal = u.commissionType === 'DEAL_COMMISSION';

// 						return (
// 							<Box
// 								key={u.user}
// 								p={2}
// 								borderWidth='1px'
// 								borderRadius='md'
// 								bg='gray.50'
// 							>
// 								<Flex justify='space-between' align='center'>
// 									<Box>
// 										<Text fontWeight='bold' fontSize='sm'>
// 											{u.name}{' '}
// 										</Text>

// 										<Text mt={1} fontSize='sm' color='gray.600'>
// 											Commission: {u.commission}%{' '}
// 											<Badge
// 												ml={2}
// 												size='sm'
// 												colorScheme={isDeal ? 'green' : 'brand'}
// 											>
// 												{u.commissionType?.split('_').join(' ') ||
// 													'DEAL COMMISSION'}
// 											</Badge>
// 										</Text>
// 									</Box>

// 									<Text
// 										fontWeight='bold'
// 										fontSize='md'
// 										color={isDeal ? 'green.600' : 'brand.600'}
// 									>
// 										{formatCurrency(u.commissionAmount, 'AED')}
// 									</Text>
// 								</Flex>
// 							</Box>
// 						);
// 					})}
// 				</Stack>

// 				{info && (
// 					<>
// 						<Divider mt={6} />

// 						<Text mt={3} fontSize='sm' color='gray.500'>
// 							All amounts refresh automatically when you modify unit price or
// 							commission values.
// 						</Text>
// 					</>
// 				)}
// 			</Box>
// 		</Box>
// 	);
// }

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
		<Box
			p={4}
			borderWidth='1px'
			borderRadius='xl'
			borderColor='border.default'
			bg='bg.surface'
			boxShadow='card'
		>
			<Box>
				<Text fontSize='md' fontWeight='bold' color='accent.gold' mb={4}>
					Commission Breakdown
				</Text>

				<Stack spacing={3}>
					{sharedUsers.map((u) => {
						const isDeal = u.commissionType === 'DEAL_COMMISSION';

						return (
							<Box
								key={u.user}
								p={3}
								borderWidth='1px'
								borderRadius='lg'
								borderColor='border.default'
								bg='bg.app'
								transition='all 0.2s'
								_hover={{
									borderColor: isDeal ? 'green.400' : 'accent.goldDark',
									bg: 'bg.elevated',
								}}
							>
								<Flex justify='space-between' align='center' gap={3}>
									<Box flex={1}>
										<Text
											fontWeight='semibold'
											fontSize='sm'
											color='text.heading'
										>
											{u.name}
										</Text>

										<Flex mt={1} align='center' gap={2} wrap='wrap'>
											<Text fontSize='sm' color='text.body'>
												Commission: {u.commission}%
											</Text>
											<Badge
												size='sm'
												colorScheme={
													u.commissionType === 'DEAL_COMMISSION'
														? 'green'
														: 'gold'
												}
												variant='subtle'
											>
												{u.commissionType?.split('_').join(' ') ||
													'DEAL COMMISSION'}
											</Badge>
										</Flex>
									</Box>

									<Text
										fontWeight='bold'
										fontSize='md'
										className={isDeal ? '' : 'gold-text'}
										color={isDeal ? 'green.400' : undefined}
										flexShrink={0}
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
						<Divider mt={6} borderColor='border.default' />

						<Text mt={3} fontSize='sm' color='text.muted'>
							All amounts refresh automatically when you modify unit price or
							commission values.
						</Text>
					</>
				)}
			</Box>
		</Box>
	);
}
