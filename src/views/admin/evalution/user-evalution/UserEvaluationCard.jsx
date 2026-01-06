import {
	Box,
	Flex,
	Avatar,
	Text,
	Badge,
	IconButton,
	Center,
	Tooltip,
	SimpleGrid,
	CircularProgress,
	Stack,
	Skeleton,
	Icon,
} from '@chakra-ui/react';
import { constant } from 'constant';
import { FiEye, FiClock, FiCheck } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NoData from 'components/Message/NoData';
import { getBadgeColors } from 'utils/colorUtils';
import useUserSession from 'hooks/useUserSession';

const CardSkeleton = () => (
	<Box
		bg='white'
		rounded='2xl'
		border='1px solid'
		borderColor='gray.200'
		p={4} // same padding as real cards
		overflow='hidden'
		boxShadow='md'
		position='relative'
		minH='240px' // ensures same height as real card
	>
		{/* Top performance bar */}
		<Skeleton height='4px' borderTopRadius='2xl' mb={4} />

		{/* Glow placeholder */}
		<Box
			position='absolute'
			top='4px'
			right={0}
			w='140px'
			h='140px'
			bg='gray.100'
			opacity={0.3}
			borderRadius='0 0 0 100%'
		/>

		{/* Header: Avatar + Name + Badges + Actions */}
		<Flex justify='space-between' align='flex-start' mb={4}>
			<Flex gap={3}>
				<Skeleton circle size='64px' /> {/* match Avatar size="lg" */}
				<Stack spacing={2}>
					<Skeleton height='18px' width='140px' /> {/* Name */}
					<Skeleton height='16px' width='90px' /> {/* Role Badge */}
					<Skeleton height='16px' width='110px' /> {/* Agency Badge */}
				</Stack>
			</Flex>

			{/* Actions */}
			<Stack spacing={3}>
				<Skeleton height='32px' width='32px' />
				<Skeleton height='32px' width='32px' />
			</Stack>
		</Flex>

		{/* Stats + Circular Progress */}
		<Flex gap={6} align='center'>
			<Stack spacing={2} flexShrink={0}>
				<Skeleton height='16px' width='90px' /> {/* Evaluators */}
				<Skeleton height='16px' width='90px' /> {/* Average */}
				<Skeleton height='20px' width='110px' /> {/* Evaluated/Not evaluated */}
			</Stack>

			{/* Circular Progress */}
			<Skeleton circle size='90px' />
		</Flex>
	</Box>
);

const UserEvaluationCards = ({
	data = [],
	isLoading,
	setView,
	month,
	year,
}) => {
	const navigate = useNavigate();
	const { user: loggedInUser } = useUserSession();
	const [delayedLoading, setDelayedLoading] = useState(isLoading);

	useEffect(() => {
		let timer;
		if (isLoading) setDelayedLoading(true);
		else timer = setTimeout(() => setDelayedLoading(false), 400);
		return () => clearTimeout(timer);
	}, [isLoading]);

	return (
		<Box my={4}>
			{delayedLoading ? (
				<SimpleGrid
					columns={{ base: 1, md: 2, lg: 2, xl: 3, '2xl': 4 }}
					spacing={4}
				>
					{Array.from({ length: 10 }).map((_, i) => (
						<CardSkeleton key={i} />
					))}
				</SimpleGrid>
			) : data.length === 0 ? (
				<Center py={10}>
					<NoData label='user evaluation' />
				</Center>
			) : (
				<SimpleGrid
					columns={{ base: 1, md: 2, lg: 2, xl: 3, '2xl': 4 }}
					spacing={4}
				>
					{data.map((user) => {
						const evaluation = user?.evaluation?.[0] || {};
						const roleName = user?.roles?.[0]?.roleName || 'Unknown';
						const agencyName = user?.agency?.name || 'No Agency';

						const { bg: roleBg, text: roleText } = getBadgeColors(roleName);
						const { bg: agencyBg, text: AgencyText } =
							getBadgeColors(agencyName);

						const canAddEvaluation = !evaluation?.evaluations?.find(
							(e) => e?.evaluator === loggedInUser?._id
						);

						const getPerfColor = (percentage = 0) => {
							if (percentage >= 70) return 'green';
							if (percentage >= 50) return 'yellow';
							return 'red';
						};

						const perfColor = getPerfColor(evaluation?.finalPercentage);
						const imgSrc = user?.profileImage
							? `${constant.baseUrl}${user.profileImage}`
							: undefined;
						return (
							<Box
								key={user?._id}
								bg='white'
								rounded='2xl'
								border='1px solid'
								borderColor='gray.200'
								p={3}
								overflow='hidden'
								boxShadow='md'
								transition='transform .2s, box-shadow .2s'
								_hover={{ transform: 'translateY(-3px)', boxShadow: 'lg' }}
								position='relative'
							>
								{/* Top bar */}
								<Box
									position='absolute'
									left={0}
									top={0}
									w='100%'
									h='4px'
									bgGradient={`linear(to-r, ${perfColor}.400, ${perfColor}.600, ${perfColor}.400)`}
									borderTopRadius='2xl'
								/>

								{/* 🔥 Glow box (restored) */}
								<Box
									position='absolute'
									top='4px'
									right={0}
									w='140px'
									h='140px'
									bgGradient={`linear(45deg, transparent 30%, ${perfColor}.50 100%)`}
									opacity={0.6}
									borderRadius='0 0 0 100%'
									transition='all 0.3s ease'
								/>
								<Flex justify='space-between' align='flex-start' mb={4}>
									<Flex gap={3}>
										<Avatar size='lg' name={user?.fullName} src={imgSrc} />
										<Stack spacing={1}>
											<Text isTruncated maxW='145px' fontWeight='bold'>
												{user?.fullName}
											</Text>

											<Badge
												bg={roleBg}
												color={roleText}
												rounded='full'
												px={2}
												py={0.5}
												fontSize='xs'
												width='fit-content'
											>
												{roleName}
											</Badge>

											<Badge
												bg={agencyBg}
												color={AgencyText}
												rounded='full'
												px={2}
												py={0.5}
												fontSize='xs'
												width='fit-content'
											>
												{agencyName}
											</Badge>
										</Stack>
									</Flex>

									{/* Actions */}
									<Flex gap={1}>
										{user?.hasEvaluated && (
											<Tooltip label='View'>
												<IconButton
													size='sm'
													icon={<FiEye />}
													variant='ghost'
													onClick={() => setView({ modal: true, data: user })}
												/>
											</Tooltip>
										)}

										{canAddEvaluation && (
											<Tooltip label='Add Evaluation'>
												<IconButton
													size='sm'
													icon={<FaPlus />}
													variant='ghost'
													colorScheme='green'
													onClick={() =>
														navigate(
															`/evaluation/user-evaluation/role/${user?.roles?.[0]?._id}/user/${user?._id}?month=${month}&year=${year}`
														)
													}
												/>
											</Tooltip>
										)}
									</Flex>
								</Flex>

								{/* Stats + Circular Progress */}
								<Flex
									gap={user?.hasEvaluated ? '24' : '24'}
									align='center'
									mb={4}
									flexWrap='nowrap'
								>
									<Stack spacing={1} flexShrink={0}>
										<Text fontSize={{ base: 'xs', lg: 'sm' }} color='gray.600'>
											Evaluators: {evaluation?.totalEvaluators ?? 0}
										</Text>
										<Text fontSize={{ base: 'xs', lg: 'sm' }} color='gray.600'>
											Average: {evaluation?.finalAvg ?? 0}
										</Text>
										<Badge
											position='absolute'
											left={3}
											bottom={{ base: 7, lg: 7 }}
											px={{ base: 2, md: 2.5, lg: 3 }}
											py={{ base: 0.5, md: 0.75, lg: 1 }}
											fontSize={{ base: '10px', md: 'sm', lg: 'sm' }}
											rounded='full'
											colorScheme={user?.hasEvaluated ? 'green' : 'yellow'}
											display='inline-flex'
											alignItems='center'
											gap={{ base: 0.5, lg: 1 }}
										>
											{!user?.hasEvaluated ? (
												<>
													<Icon as={FiClock} boxSize={{ base: 3, lg: 4 }} />
													Not Evaluated
												</>
											) : (
												<>
													<Icon as={FiCheck} boxSize={{ base: 3, lg: 4 }} />
													Evaluated
												</>
											)}
										</Badge>
									</Stack>
									<Flex direction='column' align='center' gap={2}>
										<Center>
											<Box position='relative'>
												<CircularProgress
													value={evaluation?.finalPercentage ?? 0}
													color={
														evaluation?.finalPercentage > 70
															? 'green.500'
															: evaluation?.finalPercentage >= 50
																? 'yellow.500'
																: 'red.500'
													}
													size={{ base: '70px', lg: '90px' }}
													thickness='7px'
												/>

												<Center position='absolute' inset={0}>
													<Text fontWeight='bold'>
														{Math.round(evaluation?.finalPercentage ?? 0)}%
													</Text>
												</Center>
											</Box>
										</Center>
										<Flex align='center' gap={2}>
											<Text fontWeight='bold' fontSize='11px' color='gray.600'>
												Performance
											</Text>
										</Flex>
									</Flex>
								</Flex>
							</Box>
						);
					})}
				</SimpleGrid>
			)}
		</Box>
	);
};

export default UserEvaluationCards;
