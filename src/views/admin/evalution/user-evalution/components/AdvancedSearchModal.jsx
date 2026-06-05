import React, { useMemo, useEffect, useState } from 'react';
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
	Select,
	VStack,
	Text,
	Flex,
} from '@chakra-ui/react';
import { useRoles } from 'hooks/user/userRoles';
import useUserSession from 'hooks/useUserSession';
import { useModalColors } from 'hooks/useModalColors';

const AdvancedSearchModal = ({
	isOpen,
	onClose,
	onApplyFilters,
	initialFilters,
}) => {
	const colors = useModalColors();
	const [filters, setFilters] = useState(initialFilters);

	const { roles } = useRoles() || {};
	const { userRoleName } = useUserSession();

	const filteredRoles = useMemo(() => {
		if (!roles) return [];

		// Manager only sees Team Leader + Agent
		if (userRoleName === 'Manager') {
			return roles.filter((r) => ['Team Leader', 'Agent'].includes(r.roleName));
		}

		// Other roles see all
		return roles;
	}, [roles, userRoleName]);

	useEffect(() => {
		if (isOpen) {
			setFilters(initialFilters);
		}
	}, [isOpen, initialFilters]);

	const handleApply = () => {
		const newFilters = { ...filters };
		onApplyFilters(newFilters);
		onClose();
	};

	const handleClear = () => {
		setFilters({});
	};

	const handleRoleChange = (roleId) => {
		setFilters({ ...filters, role: roleId });
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='lg'
			isCentered
			scrollBehavior='inside'
			motionPreset='slideInBottom'
		>
			<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
			<ModalContent
				bg={colors.viewBg}
				borderRadius='2xl'
				boxShadow={colors.modalShadow}
				maxW={{ base: 'full', sm: '90vw', md: '500px' }}
				overflow='hidden'
				mx={{ base: 3, md: 0 }}
				border='1px solid'
				borderColor={colors.borderColor}
			>
				<ModalHeader p={0} borderBottom='1px solid' borderColor={colors.viewHeaderBorder}>
					<Flex
						bg={colors.viewHeaderBg}
						color={colors.viewHeaderText}
						px={6}
						py={3}
						position='sticky'
						top='0'
						zIndex='10'
						boxShadow='sm'
					>
						<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold'>
							Advanced Search
						</Text>
						<ModalCloseButton
							position='absolute'
							right='12px'
							top='10px'
							color={colors.viewHeaderText}
							_hover={{ bg: colors.closeBtnHoverBg }}
						/>
					</Flex>
				</ModalHeader>

				<ModalBody
					p={5}
					overflowY='auto'
					maxH='65vh'
					borderBottom='1px solid'
					borderColor={colors.borderColor}
					bg={colors.viewBg}
				>
					<VStack spacing={5} align='stretch'>
						<FormControl>
							<FormLabel fontWeight='semibold' color={colors.labelColor}>
								Select Role
							</FormLabel>
							<Select
								name='role'
								value={filters.role}
								onChange={(e) => handleRoleChange(e.target.value)}
								placeholder='Select Role'
								bg={colors.bgInput}
								borderColor={colors.borderColor}
								color={colors.headingText}
								fontSize='sm'
								borderRadius='md'
								_hover={{ borderColor: colors.accentGold }}
								_focus={{
									borderColor: colors.accentGold,
									boxShadow: `0 0 0 1px ${colors.accentGold}`,
									outline: 'none',
								}}
							>
								{filteredRoles?.map((role) => (
									<option
										key={role?._id}
										value={role?._id}
										style={{ background: colors.viewBg, color: colors.headingText }}
									>
										{role?.roleName}
									</option>
								))}
							</Select>
						</FormControl>
					</VStack>
				</ModalBody>

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
						borderRadius='md'
						onClick={handleApply}
						isDisabled={!filters}
					>
						Apply
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AdvancedSearchModal;