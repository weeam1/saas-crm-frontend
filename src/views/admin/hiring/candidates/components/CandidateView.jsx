import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Button,
	VStack,
	Grid,
	Spinner,
	HStack,
} from '@chakra-ui/react';
import ExperienceDetails from './ExperienceDetails';
import DisplayField from 'components/displays/DisplayField';
import ApplicationStatus from './ApplicationStatus';
import { useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { format } from 'date-fns';

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
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='2xl'>
			<ModalOverlay />
			<ModalContent p={4}>
				<ModalHeader>Application</ModalHeader>
				<ModalCloseButton />
				<ModalBody
					width='100%'
					maxH='550px' // Set max height for the modal body
					overflowY='auto' // Enable vertical scrolling when content exceeds max height
					sx={{
						'&::-webkit-scrollbar': {
							width: '6px', // Custom scrollbar width
						},
						'&::-webkit-scrollbar-thumb': {
							background: 'brand.500', // Custom brand color (adjust according to your theme)
							borderRadius: '8px',
						},
						'&::-webkit-scrollbar-thumb:hover': {
							background: 'brand.600', // Slightly darker on hover
						},
					}}
				>
					<Grid
						templateColumns={{
							base: '1fr',
							md: 'repeat(2, 1fr)',
							lg: candidate.invited ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
						}}
						gap={3}
					>
						<DisplayField label='Name' value={candidate?.name} />
						<DisplayField label='Date of Birth' value={candidate?.dob} />
						<DisplayField label='Email' value={candidate?.email} />
						<DisplayField label='Phone' value={candidate?.phone} />
						<DisplayField label='WhatsApp' value={candidate?.whatsApp} />
						<DisplayField label='Nationality' value={candidate?.nationality} />
						<DisplayField
							label='Experience Years'
							value={candidate?.experienceYears}
						/>
						<DisplayField label='Applying for' value={candidate?.position} />
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
	);
};

export default CandidateView;
