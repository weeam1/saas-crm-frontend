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
} from '@chakra-ui/react';
import { FormInput } from 'components/fields/FormFields';
import { FormSelect } from 'components/fields/FormFields';
import { useEffect, useMemo } from 'react';
import { commissionStatuses } from '../dealUtils';
import { useForm } from 'react-hook-form';

const DealFilterModal = ({
	isOpen,
	onClose,
	onFilterApply,
	initialFilters,
	tree,
}) => {
	const { register, handleSubmit, reset, watch, setValue } = useForm();

	const emptyFilters = {
		manager: '',
		agent: '',
		spaDone: '',
		dealStatus: '',
		closedBy: '',
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

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='5xl'
			scrollBehavior='inside'
			isCentered
		>
			<ModalOverlay backdropFilter='blur(2px)' />
			<ModalContent
				as='form'
				onSubmit={handleSubmit(onSubmit)}
				borderRadius='xl'
				mx='4'
				boxShadow='xl'
			>
				<ModalHeader
					bg='brand.50'
					borderTopRadius='xl'
					py={3}
					fontSize='lg'
					fontWeight='bold'
					color='brand.700'
					borderBottomWidth='1px'
				>
					Advanced Search
				</ModalHeader>
				<ModalCloseButton size='lg' />

				<ModalBody p={{ base: 4, md: 6 }}>
					<VStack spacing={4}>
						<SimpleGrid columns={2} spacing={4} w='full'>
							{/* Manager Dropdown */}
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

							{/* Agent Dropdown */}
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

							{/* Developer Dropdown */}
							<FormInput
								label='Developer'
								name='developer'
								register={register}
								placeholder='Enter developer name'
							/>

							{/* Sales Person Dropdown */}
							<FormInput
								label='Sales Person'
								name='salesPerson'
								register={register}
								placeholder='Enter sales person'
							/>

							{/* Project Name Input */}
							<FormInput
								label='Project Name'
								name='projectName'
								register={register}
								placeholder='Enter project name'
							/>

							{/* Unit Number Input */}
							<FormInput
								label='Unit Number'
								name='unitNumber'
								register={register}
								placeholder='Enter unit number'
							/>

							{/* Unit Number Input */}
							<FormInput
								label='Unit Price'
								name='unitPrice'
								register={register}
								placeholder='Enter unit price'
							/>

							{/* Unit Type Input */}
							<FormInput
								label='Unit Type'
								name='unitType'
								register={register}
								placeholder='Enter unit type'
							/>

							{/* Commission Status Dropdown */}
							<FormSelect
								label='Commission Status'
								name='commissionStatus'
								register={register}
								options={commissionStatuses}
								placeholder='Select status'
							/>

							{/* Unit Price Range */}
							{/* <HStack spacing={2}>
								<FormInput
									label='Min Price'
									name='unitPriceMin'
									type='number'
									register={register}
									placeholder='Min'
								/>
								<FormInput
									label='Max Price'
									name='unitPriceMax'
									type='number'
									register={register}
									placeholder='Max'
								/>
							</HStack> */}

							{/* SPA Done Checkbox */}
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
							{/* <Checkbox {...register('spaDone')}>SPA Done</Checkbox> */}

							{/* Invoice Sent Checkbox */}
							{/* <Checkbox {...register('invoiceSent')}>Invoice Sent</Checkbox> */}

							{/* Closed By Dropdown */}
							{/* <FormSelect
								label='Closed By'
								name='closedBy'
								register={register}
								options={[
									{ value: 'agent', label: 'Agent' },
									{ value: 'manager', label: 'Manager' },
									{ value: 'admin', label: 'Admin' },
								]}
								placeholder='Select closed by'
							/> */}
						</SimpleGrid>
					</VStack>
				</ModalBody>

				<ModalFooter bg='gray.50' borderBottomRadius='xl' px={6} py={3}>
					<HStack spacing={4}>
						<Button variant='outline' size='sm' onClick={handleReset}>
							Reset
						</Button>
						<Button colorScheme='brand' size='sm' type='submit'>
							Search
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default DealFilterModal;
