import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Button,
	Grid,
	Spinner,
	HStack,
	Box,
	IconButton,
	Tooltip,
	Stack,
	Text,
} from '@chakra-ui/react';
import ExperienceDetails from './ExperienceDetails';
import DisplayField from 'components/displays/DisplayField';
import ApplicationStatus from './ApplicationStatus';
import { useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { format } from 'date-fns';
import StatusBadge from 'components/shared/StatusBadge';
import EditCandidate from './EditCandidate';
import { FiEdit } from 'react-icons/fi';
import { buttonStyle } from 'utils/btn';

const CandidateView = ({
	isOpen,
	onClose,
	candidate,
	onViewCV,
	onDownloadCV,
	refetch,
	missingFiles,
}) => {
	const [newStatus, setNewStatus] = useState(candidate.status);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const [updateItemMutation, { isLoading }] = useUpdateItemMutation();

	const handleApplicationStatus = async () => {
		try {
			await updateItemMutation({
				path: `/applications/status/${candidate._id}`,
				body: { status: newStatus },
			}).unwrap();

			refetch();
			onClose();
			toast.success('Application status successfully updated');
		} catch (error) {
			toast.error(error?.data?.message || 'Applicaiton status not updated!');
		}
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} isCentered size='4xl'>
				<ModalOverlay />
				<ModalContent mx='2' p={4}>
					<ModalHeader display='flex' gap='2' alignItems='center'>
						<Stack
							flexDir={{ base: 'column', md: 'row' }}
							align={{ base: 'flex-start', md: 'center' }}
							gap='4'
						>
							<HStack>
								<Text>Application</Text>
								{candidate?.isInterviewed && (
									<StatusBadge status='Interviewed' color='green' />
								)}
							</HStack>
							{/* Edit Icon Button */}
							<Button
								{...buttonStyle}
								bg='gray.200'
								color='gray.800'
								py='2'
								px='4'
								leftIcon={<FiEdit />}
								onClick={() => setIsEditModalOpen(true)}
							>
								Edit
							</Button>
						</Stack>
					</ModalHeader>
					<ModalCloseButton mt='6' />
					<ModalBody width='100%'>
						<Box overflow='scroll' bg='white' height='60vh' p='4'>
							<Grid
								templateColumns={{
									base: '1fr',
									md: 'repeat(2, 1fr)',
									lg: candidate.invited ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
								}}
								gap={3}
							>
								<DisplayField
									label='Name'
									value={candidate?.name}
									textTransform='capitalize'
								/>
								<DisplayField label='Date of Birth' value={candidate?.dob} />
								<DisplayField label='Email' value={candidate?.email} />
								<DisplayField label='Phone' value={candidate?.phone} />
								<DisplayField label='Gender' value={candidate?.gender} />
								<DisplayField label='Visa Type' value={candidate?.visaType} />
								<DisplayField label='WhatsApp' value={candidate?.whatsApp} />
								<DisplayField
									label='Nationality'
									value={candidate?.nationality}
								/>
								<DisplayField
									label='Driving License'
									value={candidate?.drivingLice ? 'Yes' : 'No'}
								/>
								<DisplayField
									label='Experience Years'
									value={
										candidate?.experienceYears > 9
											? 'More then 9 Years'
											: `${candidate?.experienceYears} ${candidate?.experienceYears > 1 ? 'Years' : 'Year'}`
									}
								/>
								<DisplayField
									label='Applying for'
									value={candidate?.position.name}
								/>
								<DisplayField
									label='English Level'
									value={candidate?.engLangLevel || 'N/A'}
								/>
								<DisplayField
									label='Agency'
									value={candidate?.agency?.name || 'N/A'}
								/>

								{candidate.invited && (
									<>
										<DisplayField
											label='Intivite Status'
											value={candidate?.inviteAccepted ? 'Accepted' : 'Pending'}
										/>
										<DisplayField
											label='Interview Date'
											value={format(
												new Date(candidate?.interviewDate),
												'MMM d, yyyy'
											)}
										/>

										<DisplayField
											label='Interview Time'
											value={candidate?.interviewTime}
										/>
										<DisplayField
											label='Candidate Status'
											value={candidate?.status}
										/>
									</>
								)}
							</Grid>
							<ExperienceDetails experience={candidate?.experience} />
						</Box>

						<HStack spacing={2} mt={2}>
							<Button
								onClick={() => onViewCV(candidate?.resume)}
								bg='brand.500'
								color='white'
								width='100%'
								rounded='full'
								_hover={{
									bg: 'brand.600',
									color: 'white',
								}}
								_active={{
									bg: 'brand.600',
								}}
								disabled={missingFiles.includes(candidate?.resume)}
							>
								View CV
							</Button>

							<Button
								onClick={() => onDownloadCV(candidate?.resume)}
								bg='brand.500'
								color='white'
								width='100%'
								rounded='full'
								_hover={{
									bg: 'brand.600',
									color: 'white',
								}}
								_active={{
									bg: 'brand.600',
								}}
								disabled={missingFiles.includes(candidate?.resume)}
							>
								Download CV
							</Button>
						</HStack>
					</ModalBody>
					{!candidate.invited && (
						<HStack
							justifyContent='space-between'
							alignItems='end'
							spacing={2}
							pb='4'
							px='4'
							mt={2}
						>
							<ApplicationStatus
								candidate={candidate}
								newStatus={newStatus}
								setNewStatus={setNewStatus}
							/>

							<div>
								<Button
									colorScheme='gray'
									onClick={onClose}
									variant='outline'
									size='sm'
									mr={2}
								>
									Cancel
								</Button>
								<Button
									bg='brand.500'
									color='white'
									_hover={{
										bg: 'brand.600',
										color: 'white',
									}}
									_active={{
										bg: 'brand.600',
									}}
									size='sm'
									disabled={
										candidate.status === 'Eligible' && candidate.inviteAccepted
									}
									onClick={handleApplicationStatus}
								>
									{isLoading ? <Spinner /> : 'Save'}
								</Button>
							</div>
						</HStack>
					)}
				</ModalContent>
			</Modal>

			{isEditModalOpen && (
				<EditCandidate
					isOpen={isEditModalOpen}
					onClose={() => {
						setIsEditModalOpen(false);
						onClose();
					}}
					candidate={candidate}
					refetch={refetch}
				/>
			)}
		</>
	);
};

export default CandidateView;
