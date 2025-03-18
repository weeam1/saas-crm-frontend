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
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';

const FilterModal = ({ isOpen, onClose, updateFilters, setSearchClear }) => {
	const { data: agencies } = useFetchItemsQuery({ path: '/agencies' });

	const [selectedAgency, setSelectedAgency] = useState('');

	const handleApplyFilters = () => {
		updateFilters({ agency: selectedAgency });
		setSearchClear(true);
		onClose();
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Filter Options</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Select
							placeholder='Select Agency'
							value={selectedAgency}
							onChange={(e) => setSelectedAgency(e.target.value)}
						>
							{agencies?.doc?.map((agency) => (
								<option key={agency._id} value={agency.name}>
									{agency.name}
								</option>
							))}
						</Select>
					</ModalBody>
					<ModalFooter>
						<Button variant='ghost' onClick={onClose}>
							Cancel
						</Button>
						<Button colorScheme='brand' onClick={handleApplyFilters}>
							Apply
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default FilterModal;
