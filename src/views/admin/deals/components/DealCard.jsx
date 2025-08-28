import { Box, Text, Flex, Icon, Stack, SimpleGrid } from '@chakra-ui/react';
import { FaBuilding } from 'react-icons/fa';
import { StatusBadge } from './_shared/StatusBadge';
import { formatPostDate, formatCurrency } from 'utils/helpers';
import { TeamMember } from './_shared/TeamMember';
import MenuOptions from './_shared/MenuOptions';

export const DealCard = ({
	deal,
	user,
	isSuperAdmin,
	handleEdit,
	handleView,
	handleCancelled,
	handleDelete,
}) => {
	const {
		lead,
		commissionStatus,
		projectName,
		unitNumber,
		unitType,
		unitPrice,
		downpaymentPaid,
		bookingAmountPaid,
		// downpaymentPercent,
		// bookingPercent,
		// spaDone,
		// invoiceSent,
		// dealStatus,
		createdAt,
		manager,
		agent,
		closedBy,
		salesPerson,
		currency,
	} = deal;

	return (
		<Box
			position='relative'
			borderLeft='4px solid'
			borderLeftColor={
				commissionStatus.toLowerCase() === 'fully paid'
					? 'green.500'
					: 'brand.500'
			}
			borderRightColor='gray.600'
			borderBottomColor='gray.600'
			borderTopColor='gray.600'
			borderRadius='md'
			p={4}
			bg='white'
			shadow='md'
			_hover={{
				bg: 'gray.100',
				boxShadow: 'md',
				transform: 'translateY(-2px)',
			}}
			transition='all 0.2s ease'
		>
			{/* Status badge */}
			<Flex position='absolute' gap='2' align='center' top={3} right={3}>
				<StatusBadge status={commissionStatus} />
				<MenuOptions
					user={user}
					deal={deal}
					isSuperAdmin={isSuperAdmin}
					handleView={handleView}
					handleDelete={handleDelete}
					handleCancelled={handleCancelled}
					handleEdit={handleEdit}
				/>
			</Flex>

			<Stack justify='space-between' h='full' spacing={3}>
				{/* Lead info with priority styling */}
				<Box>
					<Flex align='center' gap={2}>
						<Box flex='1'>
							<Text fontWeight='bold' fontSize='sm' maxW='200px' isTruncated>
								{lead?.leadName}
							</Text>
						</Box>
						{/* <Box mr='14'>
							{spaDone && (
								<CustomTooltip label='SPA Signed'>
									<Icon as={CheckCircleIcon} color='green.500' boxSize={4} />
								</CustomTooltip>
							)}
						</Box> */}
					</Flex>
				</Box>

				{/* Property info with icon */}
				<Flex align='center' gap={2}>
					<Icon as={FaBuilding} color='brand.500' boxSize={4} />
					<Box>
						<Text fontSize='xs' fontWeight='semibold' color='gray.800'>
							{projectName}
						</Text>
						<Text fontSize='x-small' color='gray.600'>
							{unitType} · Unit #{unitNumber}
						</Text>
					</Box>
				</Flex>

				{/* Team information in compact format */}
				<SimpleGrid columns={2} spacing={2}>
					{/* Destructures each [key, value] into role and person */}
					{Object.entries({ manager, agent, closedBy, salesPerson }).map(
						([role, person]) =>
							person && <TeamMember key={role} role={role} person={person} />
					)}
				</SimpleGrid>

				{/* Financial highlights */}
				<SimpleGrid columns={2} spacing={3}>
					<Box bg='gray.50' p={2} borderRadius='md'>
						<Text fontSize='x-small' color='gray.500' mb={1}>
							Unit Price
						</Text>
						<Text fontSize='xs' fontWeight='bold' color='brand.600'>
							{formatCurrency(unitPrice, currency)}
						</Text>
					</Box>
					<Box bg='gray.50' p={2} borderRadius='md'>
						<Text fontSize='x-small' color='gray.500' mb={1}>
							Deal Amount
						</Text>
						<Flex align='baseline' gap={1}>
							<Text fontSize='xs' fontWeight='bold'>
								{formatCurrency(bookingAmountPaid, currency)}
							</Text>
							{/* <Text fontSize='xs' color='gray.500'>
								({bookingPercent}%)
							</Text> */}
						</Flex>
					</Box>
					<Box bg='gray.50' p={2} borderRadius='md'>
						<Text fontSize='x-small' color='gray.500' mb={1}>
							Downpayment
						</Text>
						<Flex align='baseline' gap={1}>
							<Text fontSize='xs' fontWeight='bold'>
								{formatCurrency(downpaymentPaid, currency)}
							</Text>
							{/* <Text fontSize='xs' color='gray.500'>
								({downpaymentPercent}%)
							</Text> */}
						</Flex>
					</Box>
					<Box bg='gray.50' p={2} borderRadius='md'>
						<Text fontSize='x-small' color='gray.500' mb={1}>
							Deal Closed On
						</Text>
						<Text fontSize='xs' fontWeight='bold'>
							{formatPostDate(createdAt)}
						</Text>
					</Box>
				</SimpleGrid>

				{/* Bottom row with date and action */}
				{/* <Flex justify='flex-end' gap='2' align='center'>
					<Button
						size='xs'
						variant='outline'
						colorScheme='green'
						rightIcon={<FaPen size={14} />}
						onClick={() => handleEdit(deal)}
					>
						Edit
					</Button>
					<Button
						size='xs'
						variant='outline'
						colorScheme='brand'
						rightIcon={<FiChevronRight size={14} />}
						onClick={() => handleView(deal)}
					>
						Details
					</Button>
					{dealStatus !== 'Cancelled' &&
						(isAdmin || closedBy._id === loginedUser._id) && (
							<>
								<Button
									size='xs'
									variant='outline'
									colorScheme='red'
									rightIcon={<FiX size={14} />}
									onClick={() => handleCancelled(deal._id)}
								>
									Cancelled
								</Button>
							</>
						)}
				</Flex> */}
			</Stack>
		</Box>
	);
};
