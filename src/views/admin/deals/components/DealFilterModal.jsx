import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	VStack,
	HStack,
	SimpleGrid,
	GridItem,
	FormLabel,
	useColorModeValue,
	Text,
} from '@chakra-ui/react';
import { FormInput, FormSelect } from 'components/fields/FormFields';
import { useEffect, useMemo } from 'react';
import { commissionStatuses, dealStatuses } from '../dealUtils';
import { useForm } from 'react-hook-form';
import SearchUsers from 'views/admin/whatsapp/WhatsappSettings/SearchUsers';
import { useFetchItemsQuery } from 'api/apiSlice';

const DealFilterModal = ({
	isOpen,
	onClose,
	onFilterApply,
	initialFilters,
	tree,
}) => {
	const { data: usersData } = useFetchItemsQuery({
		path: '/v2/user/search_users',
	});

	const { register, handleSubmit, reset, watch, setValue } = useForm();

	const emptyFilters = {
		manager: '',
		closedBy: '',
		agent: '',
		spaDone: '',
		dealStatus: '',
		commissionStatus: '',
		clientName: '',
		clientNumber: '',
		developer: '',
		salesPerson: '',
		projectName: '',
		unitNumber: '',
		unitType: '',
		unitPrice: '',
		downpaymentPaid: '',
		bookingAmountPaid: '',
		invoiceSent: '',
		dealStatus: '',
	};

	useEffect(() => {
		if (isOpen) {
			reset(initialFilters || {});
		}
	}, [isOpen]);

	// Watch manager field changes
	const selectedManager = watch('manager');

	const allAgents = useMemo(() => {
		return Object.values(tree?.agents || {}).flat();
	}, [tree]);

	// Handle manager change to filter agents
	const filteredAgents = useMemo(() => {
		if (selectedManager) {
			const key = `manager-${selectedManager}`;
			return tree?.agents?.[key] || [];
		}
		return allAgents;
	}, [selectedManager, tree, allAgents]);

	// Initialize filtered agents
	useEffect(() => {
		setValue('agent', '');
	}, [selectedManager, setValue]);

	const onSubmit = (data) => {
		onClose();
		onFilterApply(data);
	};

	const handleReset = () => {
		reset(emptyFilters);
	};

	const handleSelectUser = (user) => {
		setValue('closedBy', user || null);
	};

	const selectedClosedBy = watch('closedBy');

	const headerBg = useColorModeValue('brand.300', 'brand.100');
	const headerText = useColorModeValue('brand.700', 'brand.900');
	const bodyBg = useColorModeValue('white', 'gray.800');
	const footerBg = useColorModeValue('gray.50', 'gray.900');

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='5xl'
			scrollBehavior='inside'
			isCentered
		>
			<ModalOverlay backdropFilter='blur(3px)' />
			<ModalContent
				as='form'
				onSubmit={handleSubmit(onSubmit)}
				borderRadius='2xl'
				mx='4'
				boxShadow='xl'
				bg={bodyBg}
			>
				{/* Header */}
				<ModalHeader
					bg={headerBg}
					color={headerText}
					fontWeight='bold'
					fontSize='lg'
					borderTopRadius='2xl'
					borderBottomWidth='1px'
					py={3}
					px={6}
					position='sticky'
					top='0'
					zIndex='10'
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
				</ModalHeader>

				{/* Body */}
				<ModalBody p={{ base: 4, md: 6 }}>
					<VStack spacing={5} align='stretch'>
						<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5}>
							{/* Closed By */}
							<GridItem colSpan={{ base: 1, lg: 2 }}>
								<FormLabel fontSize='sm' fontWeight='semibold' color='gray.600'>
									Closed By
								</FormLabel>
								<SearchUsers
									selectedUserId={selectedClosedBy?._id || null}
									users={usersData?.doc || []}
									onSelectUser={handleSelectUser}
								/>
							</GridItem>

							<FormSelect
								label='Manager'
								name='manager'
								register={register}
								options={[
									{ value: '-1', label: 'No Manager' },
									...(tree?.managers || []).map((manager) => ({
										value: manager._id,
										label: manager.fullName,
									})),
								]}
								placeholder='Select manager'
							/>

							<FormSelect
								label='Agent'
								name='agent'
								register={register}
								options={[
									{ value: '-1', label: 'No Agent' },
									...(filteredAgents || []).map((agent) => ({
										value: agent._id,
										label: agent.fullName,
									})),
								]}
								placeholder='Select agent'
							/>

							<FormInput
								label='Client Name'
								name='clientName'
								register={register}
								placeholder='Enter client name'
							/>
							<FormInput
								label='Client Contact'
								name='clientNumber'
								register={register}
								placeholder='Enter contact'
							/>
							<FormInput
								label='Developer'
								name='developer'
								register={register}
								placeholder='Enter developer name'
							/>
							<FormInput
								label='Sales Person'
								name='salesPerson'
								register={register}
								placeholder='Enter sales person'
							/>
							<FormInput
								label='Project Name'
								name='projectName'
								register={register}
								placeholder='Enter project name'
							/>
							<FormInput
								label='Unit Number'
								name='unitNumber'
								register={register}
								placeholder='Enter unit number'
							/>
							<FormInput
								label='Unit Type'
								name='unitType'
								register={register}
								placeholder='Enter unit type'
							/>
							<FormInput
								label='Unit Price'
								name='unitPrice'
								register={register}
								placeholder='Enter unit price'
							/>

							<FormSelect
								label='Commission Status'
								name='commissionStatus'
								register={register}
								options={commissionStatuses}
								placeholder='Select commission status'
							/>
							<FormSelect
								label='Deal Status'
								name='dealStatus'
								register={register}
								options={dealStatuses}
								placeholder='Select deal status'
							/>
							<FormSelect
								label='Invoice Sent'
								name='invoiceSent'
								register={register}
								options={[
									{ label: 'Yes', value: true },
									{ label: 'No', value: false },
								]}
								placeholder='Select invoice status'
							/>
							<FormSelect
								label='SPA'
								name='spaDone'
								register={register}
								options={[
									{ label: 'SPA Signed', value: true },
									{ label: 'Pending', value: false },
								]}
								placeholder='Select SPA status'
							/>
						</SimpleGrid>
					</VStack>
				</ModalBody>

				{/* Footer */}
				<ModalFooter
					bg={footerBg}
					borderTopWidth='1px'
					borderBottomRadius='2xl'
					px={6}
					py={3}
				>
					<HStack spacing={4}>
						<Button
							variant='outline'
							size='sm'
							onClick={handleReset}
							borderColor='gray.300'
							_hover={{ bg: 'gray.100' }}
							borderRadius={'md'}
						>
							Reset
						</Button>
						<Button
							colorScheme='brand'
							size='sm'
							type='submit'
							px={6}
							fontWeight='semibold'
							borderRadius={'md'}
						>
							Search
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default DealFilterModal;
