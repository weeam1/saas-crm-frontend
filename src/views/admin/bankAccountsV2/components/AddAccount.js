import React, { useState, useEffect } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	Flex,
	Select,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { AddIcon } from '@chakra-ui/icons';
import { useFetchItemsQuery } from 'api/apiSlice';

const AddAccountModal = ({ onAdd, isAdding, isOpen: propsIsOpen }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState({
		account_holder_name: '',
		account_number: '',
		iban: '',
		swift_code: '',
		bank_name: '',
		branch_address: '',
		developer_id: '',
	});
	const [errors, setErrors] = useState({
		account_holder_name: '',
		account_number: '',
		iban: '',
		swift_code: '',
		bank_name: '',
		branch_address: '',
		developer_id: '',
	});
	const [developers, setDevelopers] = useState([]); // Local state for developers

	const shouldFetchDevelopers = isOpen || propsIsOpen;

	const {
		data: developersData,
		isLoading: developersLoading,
		error: developersError,
		isFetching,
	} = useFetchItemsQuery(
		{ path: '/developer/getALL' },
		{ skip: !shouldFetchDevelopers }
	);

	const handleOpen = () => setIsOpen(true);

	const handleClose = () => {
		setIsOpen(false);
		setFormData({
			account_holder_name: '',
			account_number: '',
			iban: '',
			swift_code: '',
			bank_name: '',
			branch_address: '',
			developer_id: '',
		});
		setErrors({
			account_holder_name: '',
			account_number: '',
			iban: '',
			swift_code: '',
			bank_name: '',
			branch_address: '',
			developer_id: '',
		});
	};

	// Update local developers state when data is fetched
	useEffect(() => {
		if (developersData && developersData.data) {
			// Map the API response to the expected format
			const devs = developersData.data.map((dev) => ({
				id: dev._id, // Map "_id" to "id"
				name: `${dev.developer_name} (TRN: ${dev.trn})`, // Include TRN in the display name
			}));
			setDevelopers(devs);
		}
		if (developersError) {
			toast.error('Failed to load developers. Please try again.');
			console.error('Developers fetch error:', developersError);
		}
	}, [developersData, developersError]);

	const validateField = (name, value) => {
		let error = '';
		switch (name) {
			case 'account_holder_name':
				if (!value.trim()) error = 'Account holder name is required';
				else if (value.trim().length < 2)
					error = 'Account holder name must be at least 2 characters long';
				break;
			case 'account_number':
				if (!value.trim()) error = 'Account number is required';
				else if (!/^[0-9]+$/.test(value))
					error = 'Account number must contain only numbers';
				break;
			case 'iban':
				if (!value.trim()) error = 'IBAN is required';
				else {
					const countryCode = value.slice(0, 2);
					if (!/^[A-Z]{2}$/.test(countryCode)) {
						error =
							'IBAN must start with a 2-letter country code (e.g., PK, AE, EG)';
					} else {
						const ibanLengths = { PK: 24, AE: 23, EG: 29 };
						const expectedLength = ibanLengths[countryCode];
						const remaining = value.slice(2);
						if (!expectedLength) {
							if (!/^[A-Za-z0-9]+$/.test(remaining)) {
								error =
									'IBAN must contain only letters and numbers after the country code';
							}
						} else if (value.length !== expectedLength) {
							error = `IBAN for ${countryCode} must be exactly ${expectedLength} characters long`;
						} else if (!/^[A-Za-z0-9]+$/.test(remaining)) {
							error =
								'IBAN must contain only letters and numbers after the country code';
						}
					}
				}
				break;
			case 'swift_code':
				if (!value.trim()) error = 'SWIFT code is required';
				else if (!/^[A-Za-z0-9]+$/.test(value))
					error = 'SWIFT code must contain only letters and numbers';
				else if (value.length < 8)
					error = 'SWIFT code must be at least 8 characters long';
				break;
			case 'bank_name':
				if (!value.trim()) error = 'Bank name is required';
				else if (value.trim().length < 2)
					error = 'Bank name must be at least 2 characters long';
				break;
			case 'branch_address':
				if (!value.trim()) error = 'Branch address is required';
				else if (value.trim().length < 5)
					error = 'Branch address must be at least 5 characters long';
				break;
			case 'developer_id':
				if (!value.trim()) error = 'Developer selection is required';
				break;
			default:
				break;
		}
		return error;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		let filteredValue = value;

		switch (name) {
			case 'account_holder_name':
				filteredValue = value;
				break;
			case 'account_number':
				filteredValue = value.replace(/[^0-9- ]/g, '');
				break;
			case 'iban':
				const countryCode = value.slice(0, 2).toUpperCase();
				const remaining = value.slice(2).replace(/[^A-Za-z0-9]/g, '');
				const ibanLengths = { PK: 24, AE: 23, EG: 29 };
				const maxLength = ibanLengths[countryCode] || 30;
				filteredValue = (countryCode + remaining).slice(0, maxLength);
				break;
			case 'swift_code':
				filteredValue = value.replace(/[^A-Za-z0-9]/g, '').slice(0, 11);
				break;
			case 'bank_name':
			case 'branch_address':
			case 'developer_id':
				filteredValue = value;
				break;
			default:
				break;
		}

		setFormData((prev) => ({ ...prev, [name]: filteredValue }));
		const error = validateField(name, filteredValue);
		setErrors((prev) => ({ ...prev, [name]: error }));
	};

	const validateForm = () => {
		const newErrors = {};
		let isValid = true;

		Object.keys(formData).forEach((key) => {
			const error = validateField(key, formData[key]);
			newErrors[key] = error;
			if (error) isValid = false;
		});

		setErrors(newErrors);
		return isValid;
	};

	const handleSubmit = async () => {
		if (validateForm()) {
			try {
				await onAdd(formData);
				toast.success('Bank account added successfully!');
				handleClose();
			} catch (error) {
				toast.error('Something went wrong. Please try again.');
			}
		} else {
			toast.warn('Please fill all required fields.');
		}
	};

	const isFormValid = () => {
		return (
			Object.values(errors).every((error) => !error) &&
			Object.values(formData).every((value) => value.trim())
		);
	};

	return (
		<>
			<Button
				onClick={handleOpen}
				bg='#B79045'
				color='white'
				fontFamily='DM Sans'
				borderRadius='8px'
				leftIcon={<AddIcon />}
				_hover={{ bg: '#9E7A3B' }}
				fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
				px={{ base: 3, md: 4, lg: 6 }}
				py={{ base: 2, md: 3 }}
				width={{ base: '100%', md: 'auto' }}
			>
				Add Bank Account
			</Button>

			<Modal
				isOpen={isOpen || propsIsOpen}
				onClose={handleClose}
				closeOnOverlayClick={false}
				isCentered
			>
				<ModalOverlay />
				<ModalContent
					fontFamily='DM Sans'
					maxW={{ base: '90%', md: '550px' }}
					borderRadius='12px'
				>
					<ModalHeader fontFamily='DM Sans'>Add Bank Account</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl mb={3} isInvalid={!!errors.account_holder_name}>
							<FormLabel fontFamily='DM Sans'>Account Name</FormLabel>
							<Input
								name='account_holder_name'
								value={formData.account_holder_name}
								onChange={handleChange}
								placeholder='Enter Account Name'
								borderRadius='8px'
								fontFamily='DM Sans'
							/>
							<FormErrorMessage fontFamily='DM Sans'>
								{errors.account_holder_name}
							</FormErrorMessage>
						</FormControl>

						<FormControl mb={3} isInvalid={!!errors.account_number}>
							<FormLabel fontFamily='DM Sans'>Account Number</FormLabel>
							<Input
								name='account_number'
								value={formData.account_number}
								onChange={handleChange}
								placeholder='Enter account number'
								borderRadius='8px'
								fontFamily='DM Sans'
							/>
							<FormErrorMessage fontFamily='DM Sans'>
								{errors.account_number}
							</FormErrorMessage>
						</FormControl>

						<FormControl mb={3} isInvalid={!!errors.iban}>
							<FormLabel fontFamily='DM Sans'>IBAN</FormLabel>
							<Input
								name='iban'
								value={formData.iban}
								onChange={handleChange}
								placeholder='Enter IBAN (e.g., PK36SCBL0000001123456702)'
								borderRadius='8px'
								fontFamily='DM Sans'
							/>
							<FormErrorMessage fontFamily='DM Sans'>
								{errors.iban}
							</FormErrorMessage>
						</FormControl>

						<Flex direction={{ base: 'column', md: 'row' }} gap={4} mb={3}>
							<FormControl isInvalid={!!errors.swift_code} flex='1'>
								<FormLabel fontFamily='DM Sans'>Swift Code</FormLabel>
								<Input
									name='swift_code'
									value={formData.swift_code}
									onChange={handleChange}
									placeholder='Enter Swift Code (e.g., DEUTDEFF)'
									borderRadius='8px'
									fontFamily='DM Sans'
								/>
								<FormErrorMessage fontFamily='DM Sans'>
									{errors.swift_code}
								</FormErrorMessage>
							</FormControl>

							<FormControl isInvalid={!!errors.bank_name} flex='1'>
								<FormLabel fontFamily='DM Sans'>Bank Name</FormLabel>
								<Input
									name='bank_name'
									value={formData.bank_name}
									onChange={handleChange}
									placeholder='Enter bank name'
									borderRadius='8px'
									fontFamily='DM Sans'
								/>
								<FormErrorMessage fontFamily='DM Sans'>
									{errors.bank_name}
								</FormErrorMessage>
							</FormControl>
						</Flex>

						<FormControl mb={3} isInvalid={!!errors.developer_id}>
							<FormLabel fontFamily='DM Sans'>Developer</FormLabel>
							<Select
								name='developer_id'
								value={formData.developer_id}
								onChange={handleChange}
								placeholder={
									developersLoading || isFetching
										? 'Loading developers...'
										: developers.length === 0
											? 'No developers available'
											: 'Select a developer'
								}
								borderRadius='8px'
								fontFamily='DM Sans'
								isDisabled={developersLoading || isFetching}
							>
								{developers.map((developer) => (
									<option key={developer.id} value={developer.id}>
										{developer.name}
									</option>
								))}
							</Select>
							<FormErrorMessage fontFamily='DM Sans'>
								{errors.developer_id}
							</FormErrorMessage>
						</FormControl>

						<FormControl mb={3} isInvalid={!!errors.branch_address}>
							<FormLabel fontFamily='DM Sans'>Branch Address</FormLabel>
							<Input
								name='branch_address'
								value={formData.branch_address}
								onChange={handleChange}
								placeholder='Enter Bank Address'
								borderRadius='8px'
								fontFamily='DM Sans'
							/>
							<FormErrorMessage fontFamily='DM Sans'>
								{errors.branch_address}
							</FormErrorMessage>
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button
							variant='ghost'
							onClick={handleClose}
							bg='#CCCACA'
							color='black'
							borderRadius='6px'
							px={6}
							py={3}
							mr={3}
							fontFamily='DM Sans'
						>
							Cancel
						</Button>
						<Button
							bg='#B79045'
							color='white'
							onClick={handleSubmit}
							borderRadius='6px'
							px={6}
							py={3}
							isLoading={isAdding}
							isDisabled={isAdding || !isFormValid()}
							_hover={{ bg: '#9E7A3B' }}
							fontFamily='DM Sans'
						>
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default AddAccountModal;
