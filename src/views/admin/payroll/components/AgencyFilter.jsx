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
} from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useModalColors } from 'hooks/useModalColors';

const AgencyFilter = ({ isOpen, onClose, handleFilter, storeKey = '' }) => {
	const colors = useModalColors();
	const agencies = useSelector((state) => state.util.agencies || []);
	const [searchParams] = useSearchParams();

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
			<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
			<ModalContent
				bg={colors.bg}
				borderRadius='2xl'
				boxShadow={colors.modalShadow}
				maxW={{ base: 'full', sm: '90vw', md: '500px' }}
				overflow='hidden'
				mx={{ base: 3, md: 0 }}
				border='1px solid'
				borderColor={colors.borderColor}
			>
				{/* Header */}
				<ModalHeader p={0} borderBottom='1px solid' borderColor={colors.borderColor}>
					<Flex
						bg={colors.headerBg}
						color={colors.headerText}
						px={6}
						py={3}
						position='sticky'
						top='0'
						zIndex='10'
						boxShadow='sm'
					>
						<Text 	color={colors.headerText} fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold'>
							Agency Filter
						</Text>
						<ModalCloseButton
							position='absolute'
							right='12px'
							top='10px'
							color={colors.headerText}
							_hover={{ bg: colors.closeBtnHoverBg }}
						/>
					</Flex>
				</ModalHeader>

				{/* Body */}
				<ModalBody p={5} borderBottom='1px solid' borderColor={colors.borderColor} bg={colors.bg}>
					<FormControl>
						<FormLabel fontWeight='semibold' color={colors.labelColor}>Select Agency</FormLabel>
						<Select
							value={selectedAgency}
							onChange={(e) => setSelectedAgency(e.target.value)}
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_hover={{ borderColor: colors.accentGold }}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						>
							{agencies?.map((agency) => (
								<option
									key={agency._id}
									value={agency._id}
									style={{ background: colors.bg, color: colors.headingText }}
								>
									{agency.name}
								</option>
							))}
						</Select>
					</FormControl>
				</ModalBody>

				{/* Footer */}
				<ModalFooter
					position='sticky'
					bottom='0'
					bg={colors.footerBg}
					borderTop='1px solid'
					borderColor={colors.borderColor}
					py={3}
					px={5}
					zIndex='10'
					justifyContent='flex-end'
					gap={3}
				>
					<Button
						variant='outline'
						size='sm'
						borderRadius='md'
						onClick={onClose}
					>
						Close
					</Button>
					<Button
						variant='brand'
						size='sm'
						borderRadius='md'
						onClick={handleApplyFilters}
						isDisabled={isFilterUnchanged}
					>
						Apply
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AgencyFilter;