import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	Grid,
	Flex,
	Divider,
	useColorModeValue,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useCreateItemMutation } from 'api/apiSlice'; // Add this import
import { toast } from 'react-toastify'; // Add this import
import RenderFields from 'components/shared/RenderFields';

export const AddHistoryModal = ({
	isOpen,
	onClose,
	onSubmit,
	month,
	year,
	employeeId, // Add this prop to receive employee ID
	isLoading = false,
}) => {
	const bgColor = useColorModeValue('white', 'gray.800');
	const headerColor = useColorModeValue('brand.300', 'brand.100');
	const textColor = useColorModeValue('brand.700', 'brand.900');
	const closeBtnColor = useColorModeValue('brand.700', 'brand.900');
	// Add mutation hook for API call
	const [createItemMutation, { isLoading: isApiLoading }] =
		useCreateItemMutation();

	// Initial values
	const initialValues = {
		amount: '',
		Notes: '',
	};

	// Validation schema
	const validationSchema = Yup.object({
		amount: Yup.number()
			.typeError('Amount must be a number')
			.required('Amount is required')
			.min(1, 'Amount cannot be less than 1'),

		Notes: Yup.string().nullable(),
	});

	// Form fields
	const fields = [
		{
			name: 'amount',
			label: 'Amount',
			type: 'Number',
		},
		{
			name: 'Notes',
			label: 'Notes',
			type: 'textarea',
			rows: 4,
		},
	];
	// Handle form submission with API call
	const handleSubmit = async (values, actions) => {
		try {
			// Prepare payload according to your API requirements
			const payload = {
				employee: employeeId, // Use the employeeId prop
				month: month, // Use the month prop
				year: year, // Use the year prop
				amount: Number(values.amount), // Convert amount to number
				note: values.Notes || '', // Map Notes to note
			};

			// Call the API
			await createItemMutation({
				path: '/payroll/employee-warnings', // Adjust path according to your API endpoint
				body: payload,
			}).unwrap();

			// Show success message
			toast.success('Warning history added successfully.');

			// Call the parent onSubmit if provided
			await onSubmit?.(values);

			// Reset form and close modal
			actions.resetForm();
			onClose();
		} catch (error) {
			console.error('Error adding warning history:', error);
			toast.error(error.data?.message || 'Failed to add warning history');
		}
	};

	// Combine loading states
	const isSubmitting = isLoading || isApiLoading;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='xl'
			isCentered
			scrollBehavior='inside'
		>
			<ModalOverlay />
			<ModalContent bg={bgColor} borderRadius='2xl'>
				<ModalHeader
					fontSize='lg'
					bg={headerColor}
					color={textColor}
					px={5}
					py={3}
					borderTopRadius='2xl'
				>
					<Flex align='center' gap={2}>
						Add Warning History
					</Flex>
					<ModalCloseButton color={closeBtnColor} />
				</ModalHeader>

				<Divider />

				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
				>
					{() => (
						<Form>
							<ModalBody py={4} px={6}>
								<Grid templateColumns='1fr' gap={4}>
									<RenderFields fields={fields} />
								</Grid>
							</ModalBody>

							<Divider />

							<ModalFooter gap={3}>
								<Button
									variant='outline'
									colorScheme='gray'
									onClick={onClose}
									size='sm'
								>
									Cancel
								</Button>

								<Button
									colorScheme='brand'
									type='submit'
									size='sm'
									isLoading={isSubmitting}
									loadingText='Saving...'
								>
									{isSubmitting ? 'Saving...' : 'Add'}
								</Button>
							</ModalFooter>
						</Form>
					)}
				</Formik>
			</ModalContent>
		</Modal>
	);
};
