import { useState } from 'react';
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
	FormLabel,
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import { buttonStyle, getLocalAttendanceFilter } from '../../constants';
import { useSearchParams } from 'react-router-dom';

const FilterModal = ({ isOpen, onClose, updateFilters, setSearchClear }) => {
	const { data: agencies } = useFetchItemsQuery({ path: '/agencies' });

	const [searchParams] = useSearchParams();
	const currentAgency =
		searchParams.get('agency') || getLocalAttendanceFilter() || '';
	const [selectedAgency, setSelectedAgency] = useState(currentAgency);

	const handleApplyFilters = () => {
		updateFilters({ agency: selectedAgency });
		selectedAgency !== '' && setSearchClear(true);

		localStorage.setItem('attendanceAgencyFilter', selectedAgency);
		onClose();
	};

	return (
		<>
			<Modal
				fontFamily="'DM Sans', sans-serif"
				isOpen={isOpen}
				onClose={onClose}
				size='md'
				isCentered
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Agency Filter</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormLabel fontSize='md'>Select Agency</FormLabel>
						<Select
							value={selectedAgency}
							onChange={(e) => setSelectedAgency(e.target.value)}
						>
							<option value=''>All</option>
							{agencies?.doc?.map((agency) => (
								<option key={agency._id} value={agency.name}>
									{agency.name}
								</option>
							))}
						</Select>
					</ModalBody>
					<ModalFooter>
						<Button
							{...buttonStyle}
							variant='solid'
							bg='gray.200'
							color='gray.800'
							_active={{ bg: 'gray.300' }}
							py='5'
							px='8'
							mr='3'
							fontSize='lg'
							aria-label='close'
							onClick={onClose}
						>
							Close
						</Button>
						<Button
							{...buttonStyle}
							variant='solid'
							bg='brand.400'
							py='5'
							px='8'
							fontSize='lg'
							aria-label='update'
							onClick={handleApplyFilters}
						>
							Apply
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default FilterModal;
