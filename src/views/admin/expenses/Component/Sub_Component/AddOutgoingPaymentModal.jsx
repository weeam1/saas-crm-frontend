import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	FormLabel,
	Input,
	Button,
	Grid,
	IconButton,
	Select,
	Flex,
	Tooltip,
} from '@chakra-ui/react';
import { CloseIcon, AddIcon } from '@chakra-ui/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFetchItemsQuery, useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
	type: Yup.string().required('Type is required'),
	description: Yup.string().required('Description is required'),
	amount: Yup.number()
		.typeError('Amount must be a number')
		.required('Amount is required')
		.positive('Amount must be positive')
		.min(0, 'Amount must be greater than 0'),
	vat: Yup.number()
		.typeError('Amount must be a number')
		.required('Amount is required')
		.positive('Amount must be positive')
		.min(0, 'Amount must be greater than 0')
		.max(100, 'vat must be less than 100'),
});

const AddOutgoingPaymentModal = ({ isOpen, onClose, onSubmit }) => {
	const [isAddTypeOpen, setAddTypeOpen] = useState(false);
	const [newType, setNewType] = useState('');
	const user = JSON.parse(localStorage.getItem('user')) || {};

	const { data: types, refetch } = useFetchItemsQuery(
		{ path: `/expense_types` },
		{ refetchOnMountOrArgChange: true, skip: !user._id }
	);
	const [createItemMuation] = useCreateItemMutation();
	const formik = useFormik({
		initialValues: {
			type: '',
			description: '',
			amount: '',
			vat: '',
		},
		validationSchema,
		onSubmit: (values) => {
			onSubmit(values);
			formik.resetForm();
			onClose();
		},
	});

	const handleAddType = async () => {
		if (newType.trim()) {
			try {
				await createItemMuation({
					path: '/expense_types',
					body: { name: newType },
				}).unwrap();
				setNewType('');
				setAddTypeOpen(false);
				toast.success('Expense Type added successfully.');
				refetch();
			} catch (error) {
				console.error(error);
				toast.error(error.data.message || 'Expense Type not added');
			}
		}
	};

	useEffect(() => {
		if (isOpen) {
			formik.resetForm();
		}
	}, [isOpen]);
	return (
		<>
			<Modal
				isOpen={isOpen && !isAddTypeOpen}
				onClose={onClose}
				size='lg'
				isCentered
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader display='flex' justifyContent='space-between'>
						Add Office Expense
						<IconButton icon={<CloseIcon />} onClick={onClose} size='sm' />
					</ModalHeader>
					<form onSubmit={formik.handleSubmit}>
						<ModalBody>
							<Grid gap={4}>
								<div>
									<Flex justify='space-between' align='center'>
										<FormLabel>Type</FormLabel>
										<Tooltip label='Add a new expense type' hasArrow>
											<IconButton
												icon={<AddIcon />}
												size='xs'
												borderRadius='full'
												aria-label='Add new type'
												onClick={() => setAddTypeOpen(true)}
											/>
										</Tooltip>
									</Flex>
									<Select
										name='type'
										value={formik.values.type}
										onChange={formik.handleChange}
										placeholder='Select type'
										focusBorderColor='brand.500'
									>
										{types && types.doc.length > 0 ? (
											types.doc.map((type) => (
												<option key={type._id} value={type._id}>
													{type.name}
												</option>
											))
										) : (
											<option value=''>No types available</option>
										)}
									</Select>
									{formik.touched.type && formik.errors.type && (
										<p style={{ color: 'red' }}>{formik.errors.type}</p>
									)}
								</div>

								<div>
									<FormLabel>Description</FormLabel>
									<Input
										name='description'
										value={formik.values.description}
										onChange={formik.handleChange}
										placeholder='e.g., Office rent or utilities'
										focusBorderColor='brand.500'
									/>
									{formik.touched.description && formik.errors.description && (
										<p style={{ color: 'red' }}>{formik.errors.description}</p>
									)}
								</div>

								<div>
									<FormLabel>Amount</FormLabel>
									<Input
										name='amount'
										type='number'
										value={formik.values.amount}
										onChange={formik.handleChange}
										placeholder='e.g., 5050'
										focusBorderColor='brand.500'
									/>
									{formik.touched.amount && formik.errors.amount && (
										<p style={{ color: 'red' }}>{formik.errors.amount}</p>
									)}
								</div>
								<div>
									<FormLabel>VAT %</FormLabel>
									<Input
										name='vat'
										type='number'
										value={formik.values.vat}
										onChange={formik.handleChange}
										placeholder='e.g., 200.0'
										focusBorderColor='brand.500'
									/>
									{formik.touched.vat && formik.errors.vat && (
										<p style={{ color: 'red' }}>{formik.errors.vat}</p>
									)}
								</div>
							</Grid>
						</ModalBody>
						<ModalFooter>
							<Button type='submit' variant='brand' colorScheme='#b79045'>
								Add Expense
							</Button>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>

			{/* Add Type Modal */}
			<Modal
				isOpen={isAddTypeOpen}
				onClose={() => setAddTypeOpen(false)}
				isCentered
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader display='flex' justifyContent='space-between'>
						Add New Type
						<IconButton
							icon={<CloseIcon />}
							onClick={() => setAddTypeOpen(false)}
							size='sm'
						/>
					</ModalHeader>
					<ModalBody>
						<FormLabel>Type Name</FormLabel>
						<Input
							value={newType}
							onChange={(e) => setNewType(e.target.value)}
							placeholder='Enter new type'
							focusBorderColor='brand.500'
						/>
					</ModalBody>
					<ModalFooter>
						<Button
							onClick={() => setAddTypeOpen(false)}
							variant='ghost'
							mr={3}
						>
							Close
						</Button>
						<Button
							onClick={handleAddType}
							variant='brand'
							colorScheme='#b79045'
						>
							Add Type
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default AddOutgoingPaymentModal;
