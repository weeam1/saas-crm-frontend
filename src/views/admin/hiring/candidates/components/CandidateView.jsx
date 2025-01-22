import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Box,
	Button,
	VStack,
	Grid,
	Select,
} from '@chakra-ui/react';
import ExperienceDetails from './ExperienceDetails';
import DisplayField from 'components/displays/DisplayField';

const CandidateView = ({
	isOpen,
	onClose,
	candidate,
	onViewCV,
	onDownloadCV,
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
	} = candidate;

	return (
		// <Modal isOpen={isOpen} onClose={onClose} size='lg'>
		// 	<ModalOverlay />
		// 	<ModalContent>
		// 		<ModalHeader>Application</ModalHeader>
		// 		<ModalCloseButton />
		// 		<ModalBody>
		// 			<Grid
		// 				templateColumns={{
		// 					base: '1fr',
		// 					md: 'repeat(2, 1fr)',
		// 				}}
		// 				gap={2}
		// 			>
		// 				<Box>
		// 					<Box fontWeight='bold' mb={1}>
		// 						Name:
		// 					</Box>
		// 					<Input
		// 						bg='#F2F2F2'
		// 						p='2'
		// 						rounded='md'
		// 						shadown='sm'
		// 						value={name}
		// 						isReadOnly
		// 					/>
		// 				</Box>
		// 				<Box>
		// 					<Box fontWeight='bold' mb={1}>
		// 						Date of Birth:
		// 					</Box>
		// 					<Input
		// 						bg='#F2F2F2'
		// 						p='2'
		// 						rounded='md'
		// 						shadown='sm'
		// 						value={dob}
		// 						isReadOnly
		// 					/>
		// 				</Box>
		// 				<Box>
		// 					<Box fontWeight='bold' mb={1}>
		// 						Position:
		// 					</Box>
		// 					<Input
		// 						bg='#F2F2F2'
		// 						p='2'
		// 						rounded='md'
		// 						shadown='sm'
		// 						value={position}
		// 						isReadOnly
		// 					/>
		// 				</Box>
		// 				<Box>
		// 					<Box fontWeight='bold' mb={1}>
		// 						Email:
		// 					</Box>
		// 					<Input
		// 						bg='#F2F2F2'
		// 						p='2'
		// 						rounded='md'
		// 						shadown='sm'
		// 						value={email}
		// 						isReadOnly
		// 					/>
		// 				</Box>
		// 				<Box>
		// 					<Box fontWeight='bold' mb={1}>
		// 						WhatsApp:
		// 					</Box>
		// 					<Input
		// 						bg='#F2F2F2'
		// 						p='2'
		// 						rounded='md'
		// 						shadown='sm'
		// 						value={whatsApp}
		// 						isReadOnly
		// 					/>
		// 				</Box>
		// 				<Box>
		// 					<Box fontWeight='bold' mb={1}>
		// 						Phone:
		// 					</Box>
		// 					<Input
		// 						bg='#F2F2F2'
		// 						p='2'
		// 						rounded='md'
		// 						shadown='sm'
		// 						value={phone}
		// 						isReadOnly
		// 					/>
		// 				</Box>
		// 				<Box>
		// 					<Box fontWeight='bold' mb={1}>
		// 						Nationality:
		// 					</Box>
		// 					<Input
		// 						bg='#F2F2F2'
		// 						p='2'
		// 						rounded='md'
		// 						shadown='sm'
		// 						value={nationality}
		// 						isReadOnly
		// 					/>
		// 				</Box>
		// 				<Box>
		// 					<Box fontWeight='bold' mb={1}>
		// 						Applying for:
		// 					</Box>
		// 					<Input
		// 						bg='#F2F2F2'
		// 						p='2'
		// 						rounded='md'
		// 						shadown='sm'
		// 						value={position}
		// 						isReadOnly
		// 					/>
		// 				</Box>
		// 			</Grid>
		// 			<ExperienceDetails experience={experience} />
		// 			<VStack spacing={2} mt={6}>
		// 				<Button onClick={onViewCV} colorScheme='brand' width='100%'>
		// 					View CV
		// 				</Button>
		// 				<Button onClick={onDownloadCV} colorScheme='brand' width='100%'>
		// 					Download CV
		// 				</Button>
		// 			</VStack>
		// 		</ModalBody>
		// 		<ModalFooter width='full'>
		// 			<Flex width='full' justifyContent='space-between' alignItems='center'>
		// 				<Box>
		// 					<FormLabel
		// 						display='flex'
		// 						ms='4px'
		// 						fontSize='sm'
		// 						fontWeight='500'
		// 						color='#000'
		// 						mb='0'
		// 						mt={2}
		// 					>
		// 						Change Status
		// 					</FormLabel>
		// 					<Select
		// 						// value={status}
		// 						fontSize='sm'
		// 						name='status'
		// 						colorScheme='brand'
		// 						// onChange={handleChange}
		// 						fontWeight='500'
		// 						defaultValue='Pending'
		// 					>
		// 						<option value='Pending'>Pending</option>
		// 						<option value='Eligible'>Eligible</option>
		// 						<option value='Not Eligible'>Not Eligible</option>
		// 					</Select>
		// 				</Box>

		// 				<Box>
		// 					<Button colorScheme='gray' variant='outline' size='sm'>
		// 						Cancel
		// 					</Button>
		// 					<Button
		// 						colorScheme='brand'
		// 						size='sm'
		// 						mr={2}
		// 						// onClick={handleSubmit}
		// 						// disabled={isLoading}
		// 					>
		// 						{/* {isLoading ? <Spinner /> : 'Save'} */}
		// 						Save
		// 					</Button>
		// 				</Box>
		// 			</Flex>
		// 		</ModalFooter>
		// 	</ModalContent>
		// </Modal>
		<Modal isOpen={isOpen} onClose={onClose} size='xl'>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Application</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Grid
						templateColumns={{
							base: '1fr',
							md: 'repeat(2, 1fr)',
							lg: 'repeat(3, 1fr)',
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
					<Box mt='2'>
						<Box fontSize='xs' fontWeight='semibold'>
							Change Status
						</Box>
						<Select
							fontSize='xs'
							name='status'
							fontWeight='500'
							defaultValue='Pending'
							p='2'
							rounded='md'
							shadow='sm'
							borderColor='gray.300'
							_focus={{
								borderColor: 'brand.500', // Apply brand color on focus
								boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)', // Highlight with brand color
							}}
							_hover={{
								borderColor: 'brand.500', // Apply brand color on hover
							}}
						>
							<option value='Pending'>Pending</option>
							<option value='Eligible'>Eligible</option>
							<option value='Not Eligible'>Not Eligible</option>
						</Select>
					</Box>
					<VStack spacing={2} mt={2}>
						<Button
							onClick={onViewCV}
							bg='brand.400'
							color='white'
							width='100%'
							_hover={{
								bg: 'brand.500',
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
							bg='brand.400'
							color='white'
							width='100%'
							_hover={{
								bg: 'brand.500',
								color: 'white',
							}}
							_active={{
								bg: 'brand.600',
							}}
						>
							Download CV
						</Button>
					</VStack>
				</ModalBody>
				<ModalFooter width='full'>
					<Button colorScheme='gray' variant='outline' size='sm' mr={2}>
						Cancel
					</Button>
					<Button
						bg='brand.400'
						color='white'
						_hover={{
							bg: 'brand.500',
							color: 'white',
						}}
						_active={{
							bg: 'brand.600',
						}}
						size='sm'
					>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CandidateView;
