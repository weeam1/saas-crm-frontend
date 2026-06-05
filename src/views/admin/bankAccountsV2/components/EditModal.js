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
	Text,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { useModalColors } from 'hooks/useModalColors';
import { FiSave } from 'react-icons/fi';

const EditAccountModal = ({ account, onUpdate, isUpdating, children }) => {
	const [isOpen, setIsOpen] = useState(false);

	const mc = useModalColors();

	const defaultAccount = {
		account_holder_name: '',
		account_number: '',
		iban: '',
		swift_code: '',
		bank_name: '',
		branch_address: '',
		_id: null,
	};

	const [formData, setFormData] = useState({
		account_holder_name: '',
		account_number: '',
		iban: '',
		swift_code: '',
		bank_name: '',
		branch_address: '',
	});

	const [errors, setErrors] = useState({
		account_holder_name: '',
		account_number: '',
		iban: '',
		swift_code: '',
		bank_name: '',
		branch_address: '',
	});

	// Sync formData with account prop whenever it changes
	useEffect(() => {
		if (account) {
			setFormData({
				account_holder_name: String(account.account_holder_name || ''),
				account_number: String(account.account_number || ''),
				iban: String(account.iban || ''),
				swift_code: String(account.swift_code || ''),
				bank_name: String(account.bank_name || ''),
				branch_address: String(account.branch_address || ''),
			});
		}
	}, [account]);

	const handleOpen = () => {
		if (!account) {
			console.warn('No account data provided to EditAccountModal');
			return;
		}
		setIsOpen(true);
	};

	const handleClose = () => {
		setIsOpen(false);
		setErrors({
			account_holder_name: '',
			account_number: '',
			iban: '',
			swift_code: '',
			bank_name: '',
			branch_address: '',
		});
	};

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

			default:
				break;
		}
		return error;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		const error = validateField(name, value);
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
		if (!account?._id) {
			console.error('No account ID provided for update');
			toast.error('No account ID provided for update');
			return;
		}
		if (validateForm()) {
			const updatedAccount = { ...formData, _id: account._id };
			const response = await onUpdate(updatedAccount, account._id);
			handleClose();
		}
	};

	const isFormValid = () => {
		return (
			Object.values(errors).every((error) => !error) &&
			Object.values(formData).every((value) => String(value || '').trim())
		);
	};

	if (!account) {
		return (
			<span onClick={handleOpen}>{children || 'Edit Account (No data)'}</span>
		);
	}

	return (
		<>
			<span onClick={handleOpen}>{children}</span>

			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				closeOnOverlayClick={false}
				isCentered
			>
				<ModalOverlay />
				<ModalContent
					m='2'
					borderRadius='2xl'
					bg={mc.bg}
					shadow='2xl'
					overflow='hidden'
					maxH='85vh'
					display='flex'
					flexDirection='column'
				>
					<Flex
						align='center'
						justify='space-between'
						bg={mc.headerBg}
						color={mc.headerText}
						px={6}
						py={3}
						borderBottom='1px solid'
						borderColor={mc.borderColor}
						position='sticky'
						top='0'
						zIndex='10'
					>
						<Text fontSize='lg' color='inherit' fontWeight='bold'>
							Edit Account
						</Text>
						<ModalCloseButton position='static' />
					</Flex>
					<ModalBody
						p={5}
						overflowY='auto'
						scrollBehavior='smooth'
						sx={{
							'&::-webkit-scrollbar': { width: '6px' },
							'&::-webkit-scrollbar-thumb': {
								background: '#c1c1c1',
								borderRadius: '10px',
							},
						}}
					>
						<FormControl mb={3} isInvalid={!!errors.account_holder_name}>
							<FormLabel>Account Holder Name</FormLabel>
							<Input
								name='account_holder_name'
								value={formData.account_holder_name}
								onChange={handleChange}
								placeholder='Enter Account Name'
								borderRadius='8px'
							/>
							<FormErrorMessage>{errors.account_holder_name}</FormErrorMessage>
						</FormControl>
						<FormControl mb={3} isInvalid={!!errors.account_number}>
							<FormLabel>Account Number</FormLabel>
							<Input
								name='account_number'
								value={formData.account_number}
								onChange={handleChange}
								placeholder='Enter account number'
								borderRadius='8px'
							/>
							<FormErrorMessage>{errors.account_number}</FormErrorMessage>
						</FormControl>
						<FormControl mb={3} isInvalid={!!errors.iban}>
							<FormLabel>IBAN</FormLabel>
							<Input
								name='iban'
								value={formData.iban}
								onChange={handleChange}
								placeholder='Enter IBAN'
								borderRadius='8px'
							/>
							<FormErrorMessage>{errors.iban}</FormErrorMessage>
						</FormControl>
						<Flex direction={{ base: 'column', md: 'row' }} gap={4} mb={3}>
							<FormControl isInvalid={!!errors.swift_code} flex='1'>
								<FormLabel>Swift Code</FormLabel>
								<Input
									name='swift_code'
									value={formData.swift_code}
									onChange={handleChange}
									placeholder='Enter Swift Code'
									borderRadius='8px'
								/>
								<FormErrorMessage>{errors.swift_code}</FormErrorMessage>
							</FormControl>
							<FormControl isInvalid={!!errors.bank_name} flex='1'>
								<FormLabel>Bank Name</FormLabel>
								<Input
									name='bank_name'
									value={formData.bank_name}
									onChange={handleChange}
									placeholder='Enter bank name'
									borderRadius='8px'
								/>
								<FormErrorMessage>{errors.bank_name}</FormErrorMessage>
							</FormControl>
						</Flex>

						<FormControl mb={3} isInvalid={!!errors.branch_address}>
							<FormLabel>Branch Address</FormLabel>
							<Input
								name='branch_address'
								value={formData.branch_address}
								onChange={handleChange}
								placeholder='Enter Bank Address'
								borderRadius='8px'
							/>
							<FormErrorMessage>{errors.branch_address}</FormErrorMessage>
						</FormControl>
					</ModalBody>

					<ModalFooter
						bg={mc.footerBg}
						borderTop='2px solid'
						borderColor={mc.headerBg}
						position='sticky'
						bottom='0'
						zIndex='10'
						py={4}
						px={6}
						gap={3}
					>
						<Button
							variant='ghost'
							onClick={handleClose}
							borderRadius='md'
							size='sm'
							color={mc.secondaryBtnText}
							_hover={{
								bg: mc.secondaryBtnHoverBg,
								color: mc.secondaryBtnHoverText,
							}}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							borderRadius='md'
							size='sm'
							isLoading={isUpdating}
							isDisabled={isUpdating || !isFormValid()}
							background={mc.primaryBtnBg}
							color={mc.primaryBtnText}
							fontWeight='bold'
							px={6}
							_hover={{
								background: mc.primaryBtnHoverBg,
								boxShadow: mc.primaryBtnShadow,
								transform: 'translateY(-1px)',
							}}
							_active={{
								background: mc.primaryBtnActiveBg,
								transform: 'translateY(0)',
							}}
							_disabled={{
								opacity: 0.5,
								cursor: 'not-allowed',
								transform: 'none',
								boxShadow: 'none',
							}}
							leftIcon={<FiSave />}
						>
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default EditAccountModal;
