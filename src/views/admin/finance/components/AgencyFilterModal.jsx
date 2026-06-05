// import React, { useState, useEffect } from 'react';
// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalBody,
// 	ModalFooter,
// 	ModalCloseButton,
// 	Button,
// 	Select,
// 	FormControl,
// 	FormLabel,
// 	Flex,
// 	Text,
// 	useColorModeValue,
// } from '@chakra-ui/react';
// import { useSearchParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const AgencyFilterModal = ({
// 	isOpen,
// 	onClose,
// 	handleFilter,
// 	storeKey = '',
// }) => {
// 	const agencies = useSelector((state) => state.util.agencies || []);
// 	const [searchParams] = useSearchParams();

// 	const currentAgency = searchParams.get('agency') || '';

// 	const [selectedAgency, setSelectedAgency] = useState(currentAgency);

// 	// Update local state when modal opens
// 	useEffect(() => {
// 		if (isOpen) setSelectedAgency(currentAgency);
// 	}, [isOpen, currentAgency]);

// 	const handleApplyFilters = () => {
// 		// const agencyDetails = agencies?.find((item) => item._id === selectedAgency);
// 		handleFilter(selectedAgency);

// 		storeKey && sessionStorage.setItem(storeKey, selectedAgency);
// 		onClose();
// 	};

// 	const bgColor = useColorModeValue('white', 'gray.800');
// 	const headerBg = useColorModeValue('brand.300', 'brand.100');
// 	const headerText = useColorModeValue('brand.700', 'brand.900');
// 	const footerBg = useColorModeValue('gray.50', 'gray.700');
// 	const borderColor = useColorModeValue('gray.200', 'gray.600');

// 	const isFilterUnchanged = selectedAgency === currentAgency;

// 	return (
// 		<Modal
// 			fontFamily="'DM Sans', sans-serif"
// 			isOpen={isOpen}
// 			onClose={onClose}
// 			size='md'
// 			isCentered
// 			scrollBehavior='inside'
// 			motionPreset='slideInBottom'
// 		>
// 			<ModalOverlay />
// 			<ModalContent
// 				bg={bgColor}
// 				borderRadius='2xl'
// 				shadow='2xl'
// 				maxW={{ base: 'full', sm: '90vw', md: '500px' }}
// 				overflow='hidden'
// 				mx={{ base: 3, md: 0 }}
// 			>
// 				{/* Header */}
// 				<ModalHeader p={0} borderBottom='1px solid' borderColor={borderColor}>
// 					<Flex
// 						bg={headerBg}
// 						color={headerText}
// 						px={6}
// 						py={3}
// 						position='sticky'
// 						top='0'
// 						zIndex='10'
// 						boxShadow='md'
// 					>
// 						<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold'>
// 							Agency Filter
// 						</Text>
// 						<ModalCloseButton
// 							position='absolute'
// 							right='12px'
// 							top='10px'
// 							color={headerText}
// 							_hover={{ bg: 'whiteAlpha.200' }}
// 						/>
// 					</Flex>
// 				</ModalHeader>

// 				{/* Body */}
// 				<ModalBody p={5} borderBottom='1px solid' borderColor={borderColor}>
// 					<FormControl>
// 						<FormLabel fontWeight='semibold'>Select Agency</FormLabel>
// 						<Select
// 							value={selectedAgency}
// 							onChange={(e) => setSelectedAgency(e.target.value)}
// 							focusBorderColor='brand.500'
// 						>
// 							<option value=''>All</option>
// 							{agencies?.map((agency) => (
// 								<option key={agency._id} value={agency._id}>
// 									{agency.name}
// 								</option>
// 							))}
// 						</Select>
// 					</FormControl>
// 				</ModalBody>

// 				{/* Footer */}
// 				<ModalFooter
// 					position='sticky'
// 					bottom='0'
// 					bg={footerBg}
// 					borderTop='1px solid'
// 					borderColor={borderColor}
// 					py={3}
// 					px={5}
// 					zIndex='10'
// 					justifyContent='flex-end'
// 					gap={3}
// 				>
// 					<Button
// 						variant='outline'
// 						colorScheme='gray'
// 						size='sm'
// 						borderRadius='md'
// 						onClick={onClose}
// 					>
// 						Close
// 					</Button>
// 					<Button
// 						colorScheme='brand'
// 						size='sm'
// 						borderRadius='md'
// 						onClick={handleApplyFilters}
// 						isDisabled={isFilterUnchanged}
// 					>
// 						Apply
// 					</Button>
// 				</ModalFooter>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

// export default AgencyFilterModal;

import React, { useState, useEffect } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Button,
	Select,
	FormControl,
	FormLabel,
	Flex,
	Text,
	Icon,
} from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiFilter, FiCheck } from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';

const AgencyFilterModal = ({
	isOpen,
	onClose,
	handleFilter,
	storeKey = '',
}) => {
	const agencies = useSelector((state) => state.util.agencies || []);
	const [searchParams] = useSearchParams();
	const mc = useModalColors();

	const currentAgency = searchParams.get('agency') || '';
	const [selectedAgency, setSelectedAgency] = useState(currentAgency);

	// Update local state when modal opens
	useEffect(() => {
		if (isOpen) setSelectedAgency(currentAgency);
	}, [isOpen, currentAgency]);

	const handleApplyFilters = () => {
		handleFilter(selectedAgency);
		storeKey && sessionStorage.setItem(storeKey, selectedAgency);
		onClose();
	};

	const isFilterUnchanged = selectedAgency === currentAgency;

	return (
		<Modal
			fontFamily="'DM Sans', sans-serif"
			isOpen={isOpen}
			onClose={onClose}
			size='md'
			isCentered
			scrollBehavior='inside'
			motionPreset='slideInBottom'
		>
			<ModalOverlay backdropFilter='blur(3px)' bg={mc.overlayBg} />
			<ModalContent
				bg={mc.bg}
				borderRadius='2xl'
				boxShadow={mc.modalShadow}
				border='1px solid'
				borderColor={mc.borderColor}
				maxW={{ base: 'full', sm: '90vw', md: '500px' }}
				overflow='hidden'
				mx={{ base: 3, md: 0 }}
			>
				{/* Header — Gold Gradient */}
				<ModalHeader p={0}>
					<Flex
						background={mc.headerBg}
						color={mc.headerText}
						px={6}
						py={4}
						boxShadow='0 2px 10px rgba(0,0,0,0.15)'
						align='center'
					>
						<Icon as={FiFilter} boxSize={5} mr={3} />
						<Text
							fontSize={{ base: 'md', md: 'lg' }}
							color='inherit'
							fontWeight='bold'
						>
							Agency Filter
						</Text>
						<ModalCloseButton
							position='absolute'
							right='14px'
							top='14px'
							bg={mc.closeBtnBg}
							color={mc.closeBtnColor}
							borderRadius='full'
							_hover={{ bg: mc.closeBtnHoverBg }}
							_focus={{ boxShadow: 'none' }}
						/>
					</Flex>
				</ModalHeader>

				{/* Body */}
				<ModalBody p={6}>
					<FormControl>
						<FormLabel fontWeight='semibold' color={mc.labelColor}>
							Select Agency
						</FormLabel>
						<Select
							value={selectedAgency}
							onChange={(e) => setSelectedAgency(e.target.value)}
							bg={mc.bgInput}
							borderColor={mc.borderColor}
							color={selectedAgency ? mc.headingText : mc.mutedText}
							_hover={{ borderColor: mc.borderFocus }}
							_focus={{
								borderColor: mc.borderFocus,
								boxShadow: `0 0 0 1px ${mc.borderFocus}`,
							}}
							borderRadius='md'
							iconColor={mc.labelColor}
						>
							<option value=''>All</option>
							{agencies?.map((agency) => (
								<option key={agency._id} value={agency._id}>
									{agency.name}
								</option>
							))}
						</Select>
					</FormControl>
				</ModalBody>

				{/* Footer — Navy with gold accent */}
				<ModalFooter
					position='sticky'
					bottom='0'
					bg={mc.footerBg}
					borderTop='2px solid'
					borderColor={mc.headerBg}
					py={4}
					px={6}
					zIndex='10'
					gap={3}
				>
					<Button
						variant='ghost'
						size='sm'
						borderRadius='md'
						onClick={onClose}
						color={mc.secondaryBtnText}
						_hover={{
							bg: mc.secondaryBtnHoverBg,
							color: mc.secondaryBtnHoverText,
						}}
					>
						Close
					</Button>
					<Button
						size='sm'
						borderRadius='md'
						onClick={handleApplyFilters}
						isDisabled={isFilterUnchanged}
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
						leftIcon={<FiCheck />}
					>
						Apply
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AgencyFilterModal;
