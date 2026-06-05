// import { useState } from 'react';
// import {
// 	Box,
// 	Table,
// 	Thead,
// 	Tbody,
// 	Tr,
// 	Th,
// 	Td,
// 	Text,
// 	Button,
// 	HStack,
// 	Badge,
// 	useDisclosure,
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalBody,
// 	ModalFooter,
// 	ModalCloseButton,
// 	Input,
// 	Alert,
// 	AlertIcon,
// } from '@chakra-ui/react';
// import { DeleteIcon, ViewIcon } from '@chakra-ui/icons';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { useDeleteItemMutation } from 'api/apiSlice';
// import TableLoading from 'components/loading/TableLoading';
// import NoData from 'components/Message/NoData';
// import { useUserActivityLog } from 'hooks/useUserActivityLog';
// import { usePermissions } from 'hooks/usePermissions';
// import useUserSession from 'hooks/useUserSession';
// import CustomTooltip from '../../../../components/shared/CustomTooltip';
// import CheckIcon from 'assets/icons/check.png';
// import { Image } from '@chakra-ui/react';

// const SurveyTable = ({ data, isLoading, isFetching, viewLoading, refetch }) => {
// 	const columns = [
// 		'SR.No',
// 		'Survey',
// 		'Status',
// 		'Questions',
// 		'Survey Taken',
// 		'Closing Date',
// 		'Created Date',
// 		'Actions',
// 	];

// 	const navigate = useNavigate();
// 	const { user } = useUserSession();

// 	const currentUserId = user?._id;

// 	const { hasPermission } = usePermissions();
// 	const { createUserLog } = useUserActivityLog();

// 	// Delete modal state
// 	const { isOpen, onOpen, onClose } = useDisclosure();
// 	const [securityPassword, setSecurityPassword] = useState('');
// 	const [surveyIdToDelete, setSurveyIdToDelete] = useState(null);
// 	const [isDeleting, setIsDeleting] = useState(false);
// 	const [deleteItemMutation] = useDeleteItemMutation();

// 	const handleDeleteClick = (id) => {
// 		setSurveyIdToDelete(id);
// 		setSecurityPassword('');
// 		onOpen();
// 	};

// 	const handleDeleteSurvey = async () => {
// 		if (!securityPassword.trim()) {
// 			toast.warning('Please enter your security password to proceed.');
// 			return;
// 		}

// 		setIsDeleting(true);
// 		try {
// 			await deleteItemMutation({
// 				path: `/surveys/${surveyIdToDelete}`,
// 				body: { securityPassword: securityPassword.trim() },
// 			}).unwrap();
// 			createUserLog({
// 				userId: user?._id,
// 				action: 'DELETE',
// 				entity: 'Survey',
// 				entityType: 'Survey',
// 				entityId: surveyIdToDelete,
// 				status: 'success',
// 				message: `"${user?.fullName}" deleted survey.`,
// 			});
// 			toast.success('The survey has been permanently deleted.');
// 			onClose();
// 			refetch();
// 		} catch (error) {
// 			const errorMsg =
// 				error?.data?.message ||
// 				'Failed to delete the survey. Please try again.';
// 			console.log('error', error);
// 			toast.error(error?.data?.message);
// 			createUserLog({
// 				userId: user?._id,
// 				action: 'DELETE',
// 				entity: 'Survey',
// 				entityType: 'Survey',
// 				entityId: surveyIdToDelete,
// 				status: error?.status === '500' ? 'error' : 'fail',
// 				message: errorMsg,
// 			});
// 		} finally {
// 			setIsDeleting(false);
// 		}
// 	};

// 	const checkSurveyCompletion = (survey) => {
// 		if (!Array.isArray(survey.invitedUsers) || !currentUserId) return false;

// 		const invitedUserObj = survey.invitedUsers.find(
// 			(u) =>
// 				u.user &&
// 				u.user._id &&
// 				u.user._id.toString() === currentUserId.toString() &&
// 				u.status === 'completed'
// 		);
// 		return !!invitedUserObj;
// 	};

// 	return (
// 		<>
// 			<Box
// 				borderRadius='lg'
// 				boxShadow='sm'
// 				bg='white'
// 				overflowY='auto'
// 				maxH={'85vh'}
// 			>
// 				<Table variant='striped' size='lg'>
// 					<Thead position='sticky' top={0} bg='white' zIndex={2}>
// 						<Tr>
// 							{columns.map((header, index) => (
// 								<Th key={index} bg='brand.200' whiteSpace='nowrap' py={4}>
// 									<Box
// 										display='flex'
// 										alignItems='center'
// 										justifyContent='center'
// 									>
// 										<Text
// 											fontSize={{ base: '12px', md: '14px' }}
// 											fontWeight='600'
// 											color='gray.700'
// 											textTransform='capitalize'
// 											textAlign='center'
// 										>
// 											{header}
// 										</Text>
// 									</Box>
// 								</Th>
// 							))}
// 						</Tr>
// 					</Thead>

// 					<Tbody>
// 						{isFetching || isLoading || viewLoading ? (
// 							<TableLoading columns={columns} length={11} py='4' />
// 						) : data && data?.doc?.surveys?.length > 0 ? (
// 							data?.doc?.surveys.map((survey, index) => {
// 								const isActive = survey.status === 'active';
// 								const isSurveyCompleted = checkSurveyCompletion(survey);
// 								const submittedCount = survey.submittedUsers || 0;
// 								const invitedCount = survey.invitedUsersCount || 0;
// 								const isOwner = survey.owner?._id === user?._id;

// 								return (
// 									<Tr
// 										key={survey._id}
// 										_hover={{ bg: 'gray.50' }}
// 										border='gray.200'
// 									>
// 										<Td
// 											py={4}
// 											fontSize={{ base: '12px', md: '15px' }}
// 											fontWeight='500'
// 											minWidth='100px'
// 											textAlign={'center'}
// 										>
// 											{index + 1}
// 										</Td>
// 										{/* Survey Name */}
// 										<Td
// 											py={4}
// 											fontSize={{ base: '12px', md: '15px' }}
// 											fontWeight='500'
// 											minWidth='200px'
// 											textAlign={'center'}
// 										>
// 											<Text
// 												fontWeight='700'
// 												noOfLines={1}
// 												wordBreak='break-word'
// 											>
// 												{survey.title?.charAt(0).toUpperCase() +
// 													survey.title?.slice(1).toLowerCase()}
// 											</Text>
// 										</Td>

// 										{/* Status */}
// 										<Td py={4} textAlign='center'>
// 											<Badge
// 												colorScheme={isActive ? 'green' : 'red'}
// 												px={2}
// 												py={1}
// 												borderRadius='md'
// 											>
// 												{isActive ? 'Active' : 'Completed'}
// 											</Badge>
// 										</Td>

// 										{/* Questions */}
// 										<Td
// 											py={4}
// 											fontSize={{ base: '12px', md: '14px' }}
// 											fontWeight='400'
// 											textAlign='center'
// 										>
// 											{survey.questionsCount}
// 										</Td>

// 										{/* Participants */}
// 										<Td
// 											py={4}
// 											fontSize={{ base: '12px', md: '14px' }}
// 											fontWeight='400'
// 											textAlign='center'
// 										>
// 											{`${submittedCount}/${invitedCount}`}
// 										</Td>

// 										{/* Closing Date */}
// 										<Td
// 											py={4}
// 											fontSize={{ base: '12px', md: '14px' }}
// 											fontWeight='400'
// 											textAlign='center'
// 										>
// 											{new Date(survey.closesAt).toLocaleDateString()}
// 										</Td>

// 										{/* Created Date */}
// 										<Td
// 											py={4}
// 											fontSize={{ base: '12px', md: '14px' }}
// 											fontWeight='400'
// 											textAlign='center'
// 										>
// 											{new Date(survey.createdAt).toLocaleDateString()}
// 										</Td>

// 										{/* Actions */}
// 										<Td width='fit-content'>
// 											<HStack alignItems='center'>
// 												{hasPermission('survey', 'delete') && (
// 													<CustomTooltip label='Delete Survey'>
// 														<Button
// 															bg='red.500'
// 															color='white'
// 															h='6'
// 															py='2'
// 															px='4'
// 															fontSize='xs'
// 															fontWeight='normal'
// 															shadow='sm'
// 															rounded='md'
// 															flex={1}
// 															_hover={{ bg: 'red.300' }}
// 															_active={{ bg: 'red.400' }}
// 															onClick={() => handleDeleteClick(survey._id)}
// 														>
// 															Delete
// 														</Button>
// 													</CustomTooltip>
// 												)}
// 												{hasPermission('survey', 'read') && (
// 													<CustomTooltip label='View Survey'>
// 														<Button
// 															bg='#EDC270'
// 															color='gray.800'
// 															h='6'
// 															w={'100%'}
// 															py='2'
// 															px='4'
// 															fontSize='xs'
// 															fontWeight='normal'
// 															shadow='sm'
// 															rounded='md'
// 															_hover={{ bg: '#E0B960' }}
// 															_active={{ bg: '#D4AC50' }}
// 															onClick={() =>
// 																navigate(`/survey/view-survey/${survey._id}`)
// 															}
// 														>
// 															View survey
// 														</Button>
// 													</CustomTooltip>
// 												)}

// 												{!isOwner &&
// 													(!isSurveyCompleted ? (
// 														<CustomTooltip label={'Take Survey'}>
// 															<Button
// 																bg={'#EDC270'}
// 																color='gray.800'
// 																h='6'
// 																py='2'
// 																px='4'
// 																fontSize='xs'
// 																fontWeight='normal'
// 																shadow='sm'
// 																rounded='md'
// 																_hover={{ bg: '#E0B960' }}
// 																_active={{
// 																	bg: '#D4AC50',
// 																}}
// 																onClick={() => {
// 																	if (!isSurveyCompleted) {
// 																		navigate(
// 																			`/survey/take-survey/${survey._id}`
// 																		);
// 																	}
// 																}}
// 															>
// 																Take Survey
// 															</Button>
// 														</CustomTooltip>
// 													) : (
// 														<CustomTooltip label='Survey Completed'>
// 															<Image
// 																src={CheckIcon}
// 																alt='Completed'
// 																boxSize='24px'
// 															/>
// 														</CustomTooltip>
// 													))}
// 											</HStack>
// 										</Td>
// 									</Tr>
// 								);
// 							})
// 						) : (
// 							<Tr borderColor='gray.200' textAlign='center'>
// 								<Td
// 									py={4}
// 									colSpan={columns.length}
// 									fontSize={{ base: '12px', md: '15px' }}
// 									fontWeight='500'
// 									color='gray.500'
// 									textAlign='center'
// 								>
// 									<NoData label='surveys' />
// 								</Td>
// 							</Tr>
// 						)}
// 					</Tbody>
// 				</Table>
// 			</Box>

// 			{/* Delete Confirmation Modal */}
// 			<Modal isOpen={isOpen} onClose={onClose} isCentered>
// 				<ModalOverlay />
// 				<ModalContent
// 					mx={{ base: 2, sm: 4, md: 8 }}
// 					w={{ base: '95vw', sm: '90vw', md: '500px' }}
// 					maxW='100vw'
// 				>
// 					<ModalHeader>Delete Survey</ModalHeader>
// 					<ModalCloseButton />
// 					<ModalBody>
// 						<Alert status='warning' mb={4}>
// 							<AlertIcon />
// 							<Text fontWeight='bold'>
// 								This action is irreversible. Deleting this survey will
// 								permanently remove all associated data. Please confirm your
// 								security password to proceed.
// 							</Text>
// 						</Alert>
// 						<Input
// 							type='password'
// 							placeholder='Enter security password'
// 							value={securityPassword}
// 							onChange={(e) => setSecurityPassword(e.target.value)}
// 							mb={2}
// 						/>
// 					</ModalBody>
// 					<ModalFooter>
// 						<Button variant='ghost' mr={3} onClick={onClose} borderRadius='4px'>
// 							Cancel
// 						</Button>
// 						<Button
// 							colorScheme='red'
// 							bg='red.500'
// 							color='white'
// 							onClick={handleDeleteSurvey}
// 							isLoading={isDeleting}
// 							borderRadius='4px'
// 						>
// 							Delete
// 						</Button>
// 					</ModalFooter>
// 				</ModalContent>
// 			</Modal>
// 		</>
// 	);
// };

// export default SurveyTable;


import { useState } from 'react';
import {
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Text,
	Button,
	HStack,
	Badge,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Input,
	Alert,
	AlertIcon,
	Icon,
} from '@chakra-ui/react';
import { DeleteIcon, ViewIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDeleteItemMutation } from 'api/apiSlice';
import TableLoading from 'components/loading/TableLoading';
import NoData from 'components/Message/NoData';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import { usePermissions } from 'hooks/usePermissions';
import useUserSession from 'hooks/useUserSession';
import CustomTooltip from '../../../../components/shared/CustomTooltip';

const SurveyTable = ({ data, isLoading, isFetching, viewLoading, refetch }) => {
	const columns = [
		'SR.No',
		'Survey',
		'Status',
		'Questions',
		'Survey Taken',
		'Closing Date',
		'Created Date',
		'Actions',
	];

	const navigate = useNavigate();
	const { user } = useUserSession();

	const currentUserId = user?._id;

	const { hasPermission } = usePermissions();
	const { createUserLog } = useUserActivityLog();

	// Delete modal state
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [securityPassword, setSecurityPassword] = useState('');
	const [surveyIdToDelete, setSurveyIdToDelete] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteItemMutation] = useDeleteItemMutation();

	const handleDeleteClick = (id) => {
		setSurveyIdToDelete(id);
		setSecurityPassword('');
		onOpen();
	};

	const handleDeleteSurvey = async () => {
		if (!securityPassword.trim()) {
			toast.warning('Please enter your security password to proceed.');
			return;
		}

		setIsDeleting(true);
		try {
			await deleteItemMutation({
				path: `/surveys/${surveyIdToDelete}`,
				body: { securityPassword: securityPassword.trim() },
			}).unwrap();
			createUserLog({
				userId: user?._id,
				action: 'DELETE',
				entity: 'Survey',
				entityType: 'Survey',
				entityId: surveyIdToDelete,
				status: 'success',
				message: `"${user?.fullName}" deleted survey.`,
			});
			toast.success('The survey has been permanently deleted.');
			onClose();
			refetch();
		} catch (error) {
			const errorMsg =
				error?.data?.message ||
				'Failed to delete the survey. Please try again.';
			toast.error(error?.data?.message);
			createUserLog({
				userId: user?._id,
				action: 'DELETE',
				entity: 'Survey',
				entityType: 'Survey',
				entityId: surveyIdToDelete,
				status: error?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		} finally {
			setIsDeleting(false);
		}
	};

	const checkSurveyCompletion = (survey) => {
		if (!Array.isArray(survey.invitedUsers) || !currentUserId) return false;

		const invitedUserObj = survey.invitedUsers.find(
			(u) =>
				u.user &&
				u.user._id &&
				u.user._id.toString() === currentUserId.toString() &&
				u.status === 'completed'
		);
		return !!invitedUserObj;
	};

	return (
		<>
			<Box
				borderRadius='xl'
				boxShadow='card'
				bg='bg.surface'
				overflowY='auto'
				maxH='85vh'
				minH='60vh'
				border='1px solid'
				borderColor='border.default'
			>
				<Table variant='simple' size='md'>
					<Thead position='sticky' top={0} bg='bg.elevated' zIndex={2}>
						<Tr>
							{columns.map((header, index) => (
								<Th
									key={index}
									py={4}
									px={3}
									whiteSpace='nowrap'
									color='gold.primary'
									fontSize='11px'
									fontWeight='700'
									letterSpacing='0.08em'
									textTransform='uppercase'
									textAlign='center'
								>
									{header}
								</Th>
							))}
						</Tr>
					</Thead>

					<Tbody>
						{isFetching || isLoading || viewLoading ? (
							<TableLoading columns={columns} length={11} py='4' />
						) : data && data?.doc?.surveys?.length > 0 ? (
							data?.doc?.surveys.map((survey, index) => {
								const isActive = survey.status === 'active';
								const isSurveyCompleted = checkSurveyCompletion(survey);
								const submittedCount = survey.submittedUsers || 0;
								const invitedCount = survey.invitedUsersCount || 0;
								const isOwner = survey.owner?._id === user?._id;

								return (
									<Tr
										key={survey._id}
										_hover={{ bg: 'bg.elevated' }}
										transition='background 0.15s'
									>
										<Td
											py={4}
											px={3}
											fontSize='14px'
											fontWeight='500'
											minWidth='70px'
											textAlign='center'
											color='text.muted'
										>
											{index + 1}
										</Td>

										{/* Survey Name */}
										<Td
											py={4}
											px={3}
											fontSize='14px'
											fontWeight='600'
											minWidth='200px'
											textAlign='center'
											color='text.heading'
										>
											<Text noOfLines={1}>
												{survey.title?.charAt(0).toUpperCase() +
													survey.title?.slice(1).toLowerCase()}
											</Text>
										</Td>

										{/* Status */}
										<Td py={4} px={3} textAlign='center'>
											<Badge
												variant={isActive ? 'gold' : 'subtle'}
												borderRadius='full'
												px={3}
												py={1}
												fontSize='11px'
												fontWeight='500'
											>
												{isActive ? 'Active' : 'Completed'}
											</Badge>
										</Td>

										{/* Questions */}
										<Td
											py={4}
											px={3}
											fontSize='14px'
											fontWeight='500'
											textAlign='center'
											color='text.body'
										>
											{survey.questionsCount}
										</Td>

										{/* Participants */}
										<Td
											py={4}
											px={3}
											fontSize='14px'
											fontWeight='500'
											textAlign='center'
											color='text.body'
										>
											{`${submittedCount}/${invitedCount}`}
										</Td>

										{/* Closing Date */}
										<Td
											py={4}
											px={3}
											fontSize='14px'
											fontWeight='500'
											textAlign='center'
											color='text.body'
										>
											{new Date(survey.closesAt).toLocaleDateString()}
										</Td>

										{/* Created Date */}
										<Td
											py={4}
											px={3}
											fontSize='14px'
											fontWeight='500'
											textAlign='center'
											color='text.body'
										>
											{new Date(survey.createdAt).toLocaleDateString()}
										</Td>

										{/* Actions */}
										<Td px={3} py={4}>
											<HStack spacing={2} justify='center'>
												{hasPermission('survey', 'delete') && (
													<CustomTooltip label='Delete Survey' placement='top' hasArrow>
														<Button
															size='sm'
															variant='ghost'
															color='red.400'
															leftIcon={<DeleteIcon />}
															onClick={() => handleDeleteClick(survey._id)}
															_hover={{
																bg: 'rgba(245, 101, 101, 0.1)',
																color: 'red.300',
																transform: 'scale(1.05)',
															}}
															transition='all 0.15s'
														>
															Delete
														</Button>
													</CustomTooltip>
												)}

												{hasPermission('survey', 'read') && (
													<CustomTooltip label='View Survey' placement='top' hasArrow>
														<Button
															size='sm'
															variant='outline'
															leftIcon={<ViewIcon />}
															onClick={() =>
																navigate(`/survey/all-surveys/view-survey/${survey._id}`)
															}
															borderColor='border.default'
															color='text.body'
															_hover={{
																bg: 'bg.elevated',
																borderColor: 'gold.primary',
																color: 'gold.primary',
															}}
														>
															View
														</Button>
													</CustomTooltip>
												)}

												{!isOwner && (
													!isSurveyCompleted ? (
														<CustomTooltip label='Take Survey' placement='top' hasArrow>
															<Button
																size='sm'
																variant='brand'
																onClick={() =>
																	navigate(`/survey/take-survey/${survey._id}`)
																}
															>
																Take Survey
															</Button>
														</CustomTooltip>
													) : (
														<CustomTooltip label='Survey Completed' placement='top' hasArrow>
															<Icon
																as={CheckCircleIcon}
																boxSize={5}
																color='green.400'
															/>
														</CustomTooltip>
													)
												)}
											</HStack>
										</Td>
									</Tr>
								);
							})
						) : (
							<Tr>
								<Td
									py={12}
									colSpan={columns.length}
									textAlign='center'
								>
									<NoData label='surveys' />
								</Td>
							</Tr>
						)}
					</Tbody>
				</Table>
			</Box>

			{/* Delete Confirmation Modal */}
			<Modal isOpen={isOpen} onClose={onClose} isCentered size='md'>
				<ModalOverlay backdropFilter='blur(4px)' />
				<ModalContent
					bg='bg.surface'
					borderRadius='xl'
					border='1px solid'
					borderColor='border.default'
					boxShadow='card'
				>
					<ModalHeader
						borderBottom='1px solid'
						borderBottomColor='border.default'
						color='text.heading'
					>
						Delete Survey
					</ModalHeader>
					<ModalCloseButton color='text.muted' _hover={{ color: 'gold.primary' }} />

					<ModalBody py={4}>
						<Alert
							status='error'
							variant='subtle'
							mb={4}
							borderRadius='lg'
							bg='rgba(229, 62, 62, 0.1)'
							borderLeft='3px solid'
							borderLeftColor='red.400'
						>
							<AlertIcon color='red.400' />
							<Text fontSize='sm' color='text.body'>
								This action is irreversible. Deleting this survey will permanently
								remove all associated data.
							</Text>
						</Alert>
						<Text fontSize='sm' color='text.muted' mb={3}>
							Please confirm your security password to proceed.
						</Text>
						<Input
							type='password'
							placeholder='Enter security password'
							value={securityPassword}
							onChange={(e) => setSecurityPassword(e.target.value)}
							bg='bg.input'
							borderColor='border.default'
							color='text.body'
							borderRadius='lg'
							_focus={{
								borderColor: 'gold.primary',
								boxShadow: '0 0 0 1px #D4AF37',
							}}
							_hover={{ borderColor: 'gold.dark' }}
						/>
					</ModalBody>

					<ModalFooter
						borderTop='1px solid'
						borderTopColor='border.default'
						gap={3}
					>
						<Button
							variant='outline'
							size='sm'
							borderRadius='lg'
							onClick={onClose}
							borderColor='border.default'
							color='text.body'
							_hover={{ bg: 'bg.elevated', borderColor: 'gold.primary', color: 'gold.primary' }}
						>
							Cancel
						</Button>
						<Button
							variant='solid'
							colorScheme='red'
							size='sm'
							borderRadius='lg'
							isLoading={isDeleting}
							onClick={handleDeleteSurvey}
						>
							Delete
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default SurveyTable;