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
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import RenderFields from 'components/shared/RenderFields';
import { useModalColors } from 'hooks/useModalColors';

export const AddHistoryModal = ({
	isOpen,
	onClose,
	onSubmit,
	month,
	year,
	employeeId,
	isLoading = false,
}) => {
	const colors = useModalColors();

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
			const payload = {
				employee: employeeId,
				month: month,
				year: year,
				amount: Number(values.amount),
				note: values.Notes || '',
			};

			await createItemMutation({
				path: '/payroll/employee-warnings',
				body: payload,
			}).unwrap();

			toast.success('Warning history added successfully.');
			await onSubmit?.(values);
			actions.resetForm();
			onClose();
		} catch (error) {
			console.error('Error adding warning history:', error);
			toast.error(error.data?.message || 'Failed to add warning history');
		}
	};

	const isSubmitting = isLoading || isApiLoading;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='xl'
			isCentered
			scrollBehavior='inside'
		>
			<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
			<ModalContent
				bg={colors.bg}
				borderRadius='2xl'
				boxShadow={colors.modalShadow}
				border='1px solid'
				borderColor={colors.borderColor}
				overflow='hidden'
			>
				<ModalHeader
					fontSize='lg'
					bg={colors.headerBg}
					color={colors.headerText}
					px={5}
					py={3}
					borderTopRadius='2xl'
					borderBottom='1px solid'
					borderColor={colors.borderColor}
				>
					<Flex align='center' gap={2}>
						Add Warning History
					</Flex>
					<ModalCloseButton
						color={colors.headerText}
						_hover={{ bg: colors.closeBtnHoverBg }}
					/>
				</ModalHeader>

				<Divider borderColor={colors.borderColor} />

				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
				>
					{() => (
						<Form>
							<ModalBody py={4} px={6} bg={colors.bg}>
								<Grid templateColumns='1fr' gap={4}>
									<RenderFields fields={fields} />
								</Grid>
							</ModalBody>

							<Divider borderColor={colors.borderColor} />

							<ModalFooter gap={3} bg={colors.footerBg} borderTop='1px solid' borderColor={colors.borderColor}>
								<Button
									variant='outline'
									onClick={onClose}
									size='sm'
								>
									Cancel
								</Button>

								<Button
									variant='brand'
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