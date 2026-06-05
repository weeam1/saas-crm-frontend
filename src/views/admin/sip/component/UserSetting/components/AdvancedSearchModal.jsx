import React, { useState, useEffect } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	FormControl,
	FormLabel,
	Input,
	Button,
	VStack,
	useBreakpointValue,
	Flex,
	Text,
} from '@chakra-ui/react';
import SearchUsers from 'views/admin/whatsapp/WhatsappSettings/SearchUsers';
import { useModalColors } from 'hooks/useModalColors';

const AdvancedSearchModal = ({
	isOpen,
	onClose,
	onApplyFilters,
	initialFilters,
	usersData,
}) => {
	const colors = useModalColors();
	const [filters, setFilters] = useState(initialFilters);
	const colSpan = useBreakpointValue({ base: 1, sm: 1, md: 2 });

	useEffect(() => {
		if (isOpen) setFilters(initialFilters);
	}, [isOpen, initialFilters]);

	const handleApply = () => {
		const cleanedFilters = Object.fromEntries(
			Object.entries(filters).filter(
				([_, value]) => value !== '' && value !== undefined && value !== null
			)
		);
		onApplyFilters(cleanedFilters);
		onClose();
	};

	const handleClear = () => setFilters({});

	const isFilterUnchanged =
		JSON.stringify(filters) === JSON.stringify(initialFilters);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='xl'
			isCentered
			scrollBehavior='inside'
			motionPreset='slideInBottom'
		>
			<ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
			<ModalContent
				bg={colors.viewBg}
				borderRadius='2xl'
				boxShadow={colors.modalShadow}
				overflow='hidden'
				mx={{ base: 3, md: 0 }}
			>
				{/* Header */}
				<ModalHeader
					p={0}
					borderBottom='1px solid'
					borderColor={colors.viewHeaderBorder}
					fontWeight='semibold'
					fontSize='lg'
				>
					<Flex
						align='center'
						justify='space-between'
						bg={colors.viewHeaderBg}
						color={colors.viewHeaderText}
						px={6}
						py={3}
						position='sticky'
						top='0'
						zIndex='10'
						boxShadow='sm'
					>
						<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='semibold' color={colors.viewHeaderText}>
							Advanced Search
						</Text>
						<ModalCloseButton
							color={colors.viewHeaderText}
							position='relative'
							top='0'
							size='sm'
							_hover={{ bg: colors.closeBtnHoverBg }}
						/>
					</Flex>
				</ModalHeader>

				{/* Body */}
				<ModalBody
					p={5}
					overflowY='auto'
					maxH='65vh'
					bg={colors.viewBg}
					borderBottom='1px solid'
					borderColor={colors.borderColor}
				>
					<VStack spacing={5} align='stretch'>
						<FormControl>
							<FormLabel fontWeight='medium' color={colors.labelColor}>Select User</FormLabel>
							<SearchUsers
								selectedUserId={filters.user || null}
								users={usersData?.doc || []}
								onSelectUser={(user) =>
									setFilters({ ...filters, user: user?._id || '' })
								}
							/>
						</FormControl>
					</VStack>
				</ModalBody>

				{/* Footer */}
				<ModalFooter
					position='sticky'
					bottom='0'
					bg={colors.viewFooterBg}
					borderTop='1px solid'
					borderColor={colors.viewFooterBorder}
					py={3}
					px={5}
					zIndex='10'
					justifyContent='flex-end'
					gap={3}
				>
					<Button
						variant='outline'
						size='sm'
						onClick={handleClear}
						borderRadius='md'
						isDisabled={Object.keys(filters).length === 0}
					>
						Clear
					</Button>
					<Button
						variant='brand'
						size='sm'
						onClick={handleApply}
						isDisabled={isFilterUnchanged}
						borderRadius='md'
					>
						Apply Filters
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AdvancedSearchModal;