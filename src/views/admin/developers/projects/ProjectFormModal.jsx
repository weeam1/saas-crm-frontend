import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	FormControl,
	FormLabel,
	Input,
	Select,
	FormErrorMessage,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { buttonStyle } from 'utils/btn';
import { toast } from 'react-toastify';
import Loader from 'components/loading/Loader';

const ProjectFormModal = ({
	isOpen,
	onClose,
	onSubmit,
	developers = [],
	isSubmitting,
	isLoading,
	initialData = null,
	title = 'Create Project',
}) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { isDirty, errors },
	} = useForm({
		defaultValues: {
			name: '',
			developerId: '',
		},
	});

	// Load initialData for edit mode
	useEffect(() => {
		if (initialData) {
			reset({
				name: initialData.name || '',
				developerId: initialData?.developer?._id || '',
			});
		} else {
			reset({
				name: '',
				developerId: '',
			});
		}
	}, [initialData, reset]);

	const submitForm = async (data) => {
		try {
			await onSubmit(data);
			onClose();
		} catch (err) {
			toast.error(err?.message || 'Failed to submit project');
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='lg'>
			<ModalOverlay />

			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalCloseButton />

				{isLoading ? (
					<Loader />
				) : (
					<>
						<ModalBody pb={6}>
							<form id='project-form' onSubmit={handleSubmit(submitForm)}>
								<FormControl mb={4} isRequired isInvalid={!!errors.name}>
									<FormLabel>Project Name</FormLabel>
									<Input
										_focus={{ borderColor: 'brand.400' }}
										{...register('name', {
											required: 'Project name is required',
											minLength: {
												value: 2,
												message: 'Minimum 2 characters',
											},
										})}
										placeholder='Enter project name'
									/>
									<FormErrorMessage>{errors.name?.message}</FormErrorMessage>
								</FormControl>

								<FormControl mb={4} isRequired isInvalid={!!errors.developerId}>
									<FormLabel>Select Developer</FormLabel>
									<Select
										{...register('developerId', {
											required: 'Developer is required',
										})}
										placeholder='Select developer'
										_focus={{ borderColor: 'brand.400' }}
									>
										{developers.map((dev) => (
											<option key={dev._id} value={dev._id}>
												{dev.developer_name}
											</option>
										))}
									</Select>
									<FormErrorMessage>
										{errors.developerId?.message}
									</FormErrorMessage>
								</FormControl>
							</form>
						</ModalBody>

						<ModalFooter>
							<Button
								{...buttonStyle}
								variant='solid'
								bg='gray.200'
								color='gray.800'
								_active={{ bg: 'gray.300' }}
								py='5'
								px='8'
								mr='3'
								fontSize='lg'
								aria-label='close'
								onClick={onClose}
							>
								Close
							</Button>
							<Button
								{...buttonStyle}
								form='project-form'
								variant='solid'
								bg='brand.400'
								py='5'
								px='8'
								fontSize='lg'
								aria-label='create'
								onClick={handleSubmit(submitForm)}
								isDisabled={isSubmitting}
							>
								{initialData ? 'Update' : 'Create'}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default ProjectFormModal;
