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
	useColorModeValue,
	Flex,
} from '@chakra-ui/react';
import { useRoles } from 'hooks/user/userRoles';
import useUserSession from 'hooks/useUserSession';

const AdvancedSearchModal = ({
	isOpen,
	onClose,
	onApplyFilters,
	initialFilters,
}) => {
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

	const bgColor = useColorModeValue('white', 'gray.800');
	const headerBg = useColorModeValue('brand.300', 'brand.100');
	const headerText = useColorModeValue('brand.700', 'brand.900');
	const footerBg = useColorModeValue('gray.50', 'gray.700');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

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
			<ModalOverlay />
			<ModalContent
				bg={bgColor}
				borderRadius='2xl'
				shadow='2xl'
				maxW={{ base: 'full', sm: '90vw', md: '500px' }}
				overflow='hidden'
				mx={{ base: 3, md: 0 }}
			>
				<ModalHeader p={0} borderBottom='1px solid' borderColor={borderColor}>
					<Flex
						bg={headerBg}
						color={headerText}
						px={6}
						py={3}
						position='sticky'
						top='0'
						zIndex='10'
						boxShadow='md'
					>
						<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold'>
							Advanced Search
						</Text>
						<ModalCloseButton
							position='absolute'
							right='12px'
							top='10px'
							color={headerText}
							_hover={{ bg: 'whiteAlpha.200' }}
						/>
					</Flex>
				</ModalHeader>

				<ModalBody
					p={5}
					overflowY='auto'
					maxH='65vh'
					borderBottom='1px solid'
					borderColor={borderColor}
				>
					<VStack spacing={5} align='stretch'>
						<FormControl>
							<FormLabel fontWeight='semibold'>Select Role</FormLabel>
							<Select
								name='role'
								value={filters.role}
								onChange={(e) => handleRoleChange(e.target.value)}
								placeholder='Select Role'
								bg='gray.100'
								borderColor='gray.300'
								fontSize='sm'
								borderRadius='md'
								_focus={{
									borderColor: '#D99A36',
									boxShadow: '0 0 0 1px #D99A36',
									outline: 'none',
								}}
							>
								{filteredRoles?.map((role) => (
									<option key={role?._id} value={role?._id}>
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
					bg={footerBg}
					borderTop='1px solid'
					borderColor={borderColor}
					py={3}
					px={5}
					zIndex='10'
					justifyContent='flex-end'
					gap={3}
				>
					<Button
						variant='outline'
						colorScheme='gray'
						size='sm'
						onClick={handleClear}
						borderRadius='md'
						isDisabled={Object.keys(filters).length === 0}
					>
						Clear
					</Button>
					<Button
						colorScheme='brand'
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
