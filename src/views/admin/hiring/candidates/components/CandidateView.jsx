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

const CandidateView = ({
	isOpen,
	onClose,
	candidate,
	onViewCV,
	onDownloadCV,
	refetch,
}) => {
	const {
		name,
		dob,
		position,
		email,
		whatsApp,
		phone,
		nationality,
		experience,
		experienceYears,
		status,
	} = candidate;

	const [newStatus, setNewStatus] = useState(status);

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
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='xl'>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Application</ModalHeader>
				<ModalCloseButton />
				<ModalBody
					width='100%'
					maxH='500px' // Set max height for the modal body
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
							lg: 'repeat(2, 1fr)',
						}}
						gap={2}
					>
						<DisplayField label='Name' value={name} />
						<DisplayField label='Date of Birth' value={dob} />
						<DisplayField label='Email' value={email} />
						<DisplayField label='Phone' value={phone} />
						<DisplayField label='WhatsApp' value={whatsApp} />
						<DisplayField label='Nationality' value={nationality} />
						<DisplayField label='Experience Years' value={experienceYears} />
						<DisplayField label='Applying for' value={position} />
					</Grid>
					<ExperienceDetails experience={experience} />

					<HStack spacing={2} mt={2}>
						<Button
							onClick={onViewCV}
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
						>
							View CV
						</Button>

						<Button
							onClick={onDownloadCV}
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
						>
							Download CV
						</Button>
					</HStack>
				</ModalBody>
				<HStack
					justifyContent='space-between'
					alignItems='end'
					spacing={2}
					pb='4'
					px='4'
					mt={2}
				>
					<ApplicationStatus
						applicationStatus={status}
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
							onClick={handleApplicationStatus}
						>
							{isLoading ? <Spinner /> : 'Save'}
						</Button>
					</div>
				</HStack>
			</ModalContent>
		</Modal>
	);
};

export default CandidateView;
