// import React from 'react';
// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalBody,
// 	ModalFooter,
// 	ModalCloseButton,
// 	Checkbox,
// 	Grid,
// 	Box,
// 	Text,
// 	Button,
// 	useColorModeValue,
// 	Flex,
// } from '@chakra-ui/react';
// import { useModalColors } from 'hooks/useModalColors';
// import { useLeadStatuses } from 'hooks/leads/useLeadStatuses';

// const QuickFilterModal = ({
// 	isOpen,
// 	onClose,
// 	selectedStatus,
// 	selectedMstatus,
// 	onStatusChange,
// 	onMstatusChange,
// 	setQueryParams,
// 	setRefetchLoading,
// 	setSelectedStatus,
// 	setSelectedMstatus,
// }) => {
// 	// Handle light/dark mode
// 	// const headerBg = useColorModeValue('brand.500', 'brand.400');
// 	const textColor = useColorModeValue('white', 'gray.100');
// 	const { leadStatuses } = useLeadStatuses();

// 	// const allStatusSelected = selectedStatus.length === statusOptions.length;

// 	const allMstatusSelected = selectedMstatus.length === leadStatuses.length;

// 	const { headerBg, headerText, footerBg } = useModalColors();

// 	const buildFilters = (statusesArr, mStatusesArr) => {
// 		const filters = {};
// 		if (statusesArr.length > 0) filters.statuses = statusesArr;
// 		if (mStatusesArr.length > 0) filters.mainStatuses = mStatusesArr;
// 		return filters;
// 	};

// 	// const handleStatusSelectAll = (isChecked) => {
// 	// 	if (isChecked) {
// 	// 		const allStatusValues = statusOptions.map((option) => option.value);
// 	// 		setSelectedStatus(allStatusValues);

// 	// 		setQueryParams({
// 	// 			page: 1,
// 	// 			statusFilters: buildFilters(allStatusValues, selectedMstatus),
// 	// 		});
// 	// 	} else {
// 	// 		setSelectedStatus([]);

// 	// 		setQueryParams({
// 	// 			page: 1,
// 	// 			statusFilters: buildFilters([], selectedMstatus),
// 	// 		});
// 	// 	}
// 	// 	setRefetchLoading(true);
// 	// };

// 	const handleMstatusSelectAll = (isChecked) => {
// 		if (isChecked) {
// 			// const allMstatusValues = mstatusOptions.map((option) => option.value);
// 			const allMstatusValues = leadStatuses?.map((option) => option.value);
// 			setSelectedMstatus(allMstatusValues);

// 			setQueryParams({
// 				page: 1,
// 				statusFilters: buildFilters(selectedStatus, allMstatusValues),
// 			});
// 		} else {
// 			setSelectedMstatus([]);

// 			setQueryParams({
// 				page: 1,
// 				statusFilters: buildFilters(selectedStatus, []),
// 			});
// 		}
// 		setRefetchLoading(true);
// 	};

// 	const handleClearAllStatus = () => {
// 		setSelectedStatus([]);
// 		setQueryParams({
// 			page: 1,
// 			statusFilters: buildFilters([], selectedMstatus),
// 		});
// 		setRefetchLoading(true);
// 	};

// 	const handleClearAllMstatus = () => {
// 		setSelectedMstatus([]);
// 		setQueryParams({
// 			page: 1,
// 			statusFilters: buildFilters(selectedStatus, []),
// 		});
// 		setRefetchLoading(true);
// 	};

// 	return (
// 		<Modal isOpen={isOpen} onClose={onClose} size='6xl' isCentered>
// 			<ModalOverlay backdropFilter='blur(2px)' />
// 			<ModalContent mx='2' borderRadius='xl' boxShadow='xl'>
// 				{/* Header*/}
// 				<ModalHeader
// 					pb={2}
// 					bg={headerBg}
// 					color={headerText}
// 					borderTopRadius='xl'
// 					py={4}
// 					alignItems='center'
// 				>
// 					Quick Filter
// 				</ModalHeader>
// 				<ModalCloseButton color={textColor} />
// 				<ModalBody pb={6} maxH='70vh' overflowY='auto' flex='1'>
// 					{/* MStatus Section */}
// 					<Box my={3}>
// 						<Flex justifyContent='space-between' alignItems='center' mb={3}>
// 							<Text fontWeight='semibold'>MStatus</Text>
// 							<Flex gap={2} alignItems='center'>
// 								<Checkbox
// 									isChecked={allMstatusSelected}
// 									isIndeterminate={
// 										selectedMstatus.length > 0 && !allMstatusSelected
// 									}
// 									onChange={(e) => handleMstatusSelectAll(e.target.checked)}
// 									colorScheme='brand'
// 									size='lg'
// 								>
// 									<Text fontSize='sm'>Select All</Text>
// 								</Checkbox>
// 							</Flex>
// 						</Flex>

// 						{/* Clear button positioned below the mstatus header */}
// 						{selectedMstatus.length > 0 && (
// 							<Flex justifyContent='flex-end' mb={3}>
// 								<Button
// 									size='xs'
// 									variant='ghost'
// 									colorScheme='red'
// 									onClick={handleClearAllMstatus}
// 									fontWeight='normal'
// 								>
// 									Clear All
// 								</Button>
// 							</Flex>
// 						)}

// 						<Grid
// 							templateColumns='repeat(auto-fit, minmax(300px, 1fr))'
// 							gap={3}
// 						>
// 							{/* {mstatusOptions.map((option) => (
// 								<Checkbox
// 									key={option.value}
// 									isChecked={selectedMstatus.includes(option.value)}
// 									onChange={(e) =>
// 										onMstatusChange(option.value, e.target.checked)
// 									}
// 									colorScheme='brand'
// 									size='lg'
// 									p={2}
// 								>
// 									<Text
// 										fontWeight={
// 											selectedMstatus.includes(option.value)
// 												? 'medium'
// 												: 'normal'
// 										}
// 									>
// 										{option.label}
// 									</Text>
// 								</Checkbox>
// 							))} */}
// 							{leadStatuses?.map((option) => (
// 								<Checkbox
// 									key={option.value}
// 									isChecked={selectedMstatus.includes(option.value)}
// 									onChange={(e) =>
// 										onMstatusChange(option.value, e.target.checked)
// 									}
// 									colorScheme='brand'
// 									size='lg'
// 									p={2}
// 								>
// 									<Text
// 										fontWeight={
// 											selectedMstatus.includes(option.value)
// 												? 'medium'
// 												: 'normal'
// 										}
// 									>
// 										{option.label}
// 									</Text>
// 								</Checkbox>
// 							))}
// 						</Grid>
// 					</Box>

// 					{/* Status Section */}
// 					{/* <Box mb={6}>
// 						<Flex justifyContent='space-between' alignItems='center' mb={3}>
// 							<Text fontWeight='semibold'>Status</Text>
// 							<Flex gap={2} alignItems='center'>
// 								<Checkbox
// 									isChecked={allStatusSelected}
// 									isIndeterminate={
// 										selectedStatus.length > 0 && !allStatusSelected
// 									}
// 									onChange={(e) => handleStatusSelectAll(e.target.checked)}
// 									colorScheme='blue'
// 									size='lg'
// 								>
// 									<Text fontSize='sm'>Select All</Text>
// 								</Checkbox>
// 							</Flex>
// 						</Flex>

// 						{selectedStatus.length > 0 && (
// 							<Flex justifyContent='flex-end' mb={3}>
// 								<Button
// 									size='xs'
// 									variant='ghost'
// 									colorScheme='red'
// 									onClick={handleClearAllStatus}
// 									fontWeight='normal'
// 								>
// 									Clear All
// 								</Button>
// 							</Flex>
// 						)}

// 						<Grid
// 							templateColumns='repeat(auto-fit, minmax(200px, 1fr))'
// 							gap={3}
// 						>
// 							{statusOptions.map((option) => (
// 								<Checkbox
// 									key={option.value}
// 									isChecked={selectedStatus.includes(option.value)}
// 									onChange={(e) =>
// 										onStatusChange(option.value, e.target.checked)
// 									}
// 									colorScheme='blue'
// 									size='lg'
// 									p={2}
// 								>
// 									<Text
// 										fontWeight={
// 											selectedStatus.includes(option.value)
// 												? 'medium'
// 												: 'normal'
// 										}
// 									>
// 										{option.label}
// 									</Text>
// 								</Checkbox>
// 							))}
// 						</Grid>
// 					</Box> */}
// 				</ModalBody>

// 				{/* Footer */}
// 				<ModalFooter bg={footerBg} borderBottomRadius='md'>
// 					<Button colorScheme='gray' mr={3} onClick={onClose}>
// 						Close
// 					</Button>
// 				</ModalFooter>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

// export default QuickFilterModal;

import React from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Checkbox,
	Grid,
	Box,
	Text,
	Button,
	Flex,
} from '@chakra-ui/react';
import { useLeadStatuses } from 'hooks/leads/useLeadStatuses';

const QuickFilterModal = ({
	isOpen,
	onClose,
	selectedStatus,
	selectedMstatus,
	onStatusChange,
	onMstatusChange,
	setQueryParams,
	setRefetchLoading,
	setSelectedStatus,
	setSelectedMstatus,
}) => {
	const { leadStatuses } = useLeadStatuses();

	const allMstatusSelected = selectedMstatus.length === leadStatuses.length;

	const buildFilters = (statusesArr, mStatusesArr) => {
		const filters = {};
		if (statusesArr.length > 0) filters.statuses = statusesArr;
		if (mStatusesArr.length > 0) filters.mainStatuses = mStatusesArr;
		return filters;
	};

	const handleMstatusSelectAll = (isChecked) => {
		if (isChecked) {
			const allMstatusValues = leadStatuses?.map((option) => option.value);
			setSelectedMstatus(allMstatusValues);

			setQueryParams({
				page: 1,
				statusFilters: buildFilters(selectedStatus, allMstatusValues),
			});
		} else {
			setSelectedMstatus([]);

			setQueryParams({
				page: 1,
				statusFilters: buildFilters(selectedStatus, []),
			});
		}
		setRefetchLoading(true);
	};

	const handleClearAllMstatus = () => {
		setSelectedMstatus([]);
		setQueryParams({
			page: 1,
			statusFilters: buildFilters(selectedStatus, []),
		});
		setRefetchLoading(true);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='6xl' isCentered>
			<ModalOverlay bg='bg.overlay' backdropFilter='blur(2px)' />
			<ModalContent
				bg='bg.surface'
				borderRadius='xl'
				boxShadow='deep'
				mx='2'
				overflow='hidden'
			>
				{/* Header */}
				<ModalHeader
					bg='accent.gold'
					color='text.inverse'
					borderTopRadius='xl'
					py={4}
					px={6}
					borderBottom='1px solid'
					borderColor='border.default'
				>
					Quick Filter
				</ModalHeader>

				<ModalCloseButton
					color='text.inverse'
					_focus={{ outline: 'none' }}
					_hover={{ bg: 'rgba(0,0,0,0.1)' }}
				/>

				<ModalBody pb={6} maxH='70vh' overflowY='auto' flex='1' bg='bg.app'>
					{/* MStatus Section */}
					<Box my={3}>
						<Flex justifyContent='space-between' alignItems='center' mb={3}>
							<Text fontWeight='semibold' color='text.heading'>MStatus</Text>
							<Flex gap={2} alignItems='center'>
								<Checkbox
									isChecked={allMstatusSelected}
									isIndeterminate={
										selectedMstatus.length > 0 && !allMstatusSelected
									}
									onChange={(e) => handleMstatusSelectAll(e.target.checked)}
									colorScheme='yellow'
									size='lg'
									sx={{
										'.chakra-checkbox__control': {
											_focus: { boxShadow: 'none' },
										},
									}}
								>
									<Text fontSize='sm' color='text.body'>Select All</Text>
								</Checkbox>
							</Flex>
						</Flex>

						{/* Clear button positioned below the mstatus header */}
						{selectedMstatus.length > 0 && (
							<Flex justifyContent='flex-end' mb={3}>
								<Button
									size='xs'
									variant='ghost'
									colorScheme='red'
									onClick={handleClearAllMstatus}
									fontWeight='normal'
								>
									Clear All
								</Button>
							</Flex>
						)}

						<Grid
							templateColumns='repeat(auto-fit, minmax(300px, 1fr))'
							gap={3}
						>
							{leadStatuses?.map((option) => (
								<Checkbox
									key={option.value}
									isChecked={selectedMstatus.includes(option.value)}
									onChange={(e) =>
										onMstatusChange(option.value, e.target.checked)
									}
									colorScheme='yellow'
									size='lg'
									p={2}
									sx={{
										'.chakra-checkbox__control': {
											_focus: { boxShadow: 'none' },
										},
										'.chakra-checkbox__label': {
											color: selectedMstatus.includes(option.value) ? 'text.accent' : 'text.body',
										},
									}}
								>
									<Text
										fontWeight={
											selectedMstatus.includes(option.value)
												? 'medium'
												: 'normal'
										}
										color={selectedMstatus.includes(option.value) ? 'text.accent' : 'text.body'}
									>
										{option.label}
									</Text>
								</Checkbox>
							))}
						</Grid>
					</Box>
				</ModalBody>

				{/* Footer */}
				<ModalFooter
					bg='bg.surface'
					borderBottomRadius='md'
					borderTop='1px solid'
					borderColor='border.default'
				>
					<Button variant='outline' onClick={onClose}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default QuickFilterModal;