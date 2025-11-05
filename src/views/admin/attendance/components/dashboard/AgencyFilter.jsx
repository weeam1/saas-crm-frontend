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
import { buttonStyle } from '../../constants';
import { useModalColors } from 'hooks/useModalColors';

const AgencyFilter = ({
	isOpen,
	onClose,
	handleApplyFilter,
	selectedAgency,
	setSelectedAgency,
}) => {
	const { data: agencies } = useFetchItemsQuery({ path: '/agencies' });

	const { headerBg, headerText } = useModalColors();

	const handleChange = (e) => {
		const selectedId = e.target.value;
		setSelectedAgency(
			agencies?.doc?.find((agency) => agency._id === selectedId) || null
		);
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} size='md' isCentered>
				<ModalOverlay backdropFilter='blur(2px)' />
				<ModalContent mx='2' borderRadius='xl' boxShadow='xl'>
					<ModalHeader
						display='flex'
						gap='2'
						bg={headerBg}
						color={headerText}
						borderTopRadius='xl'
						py={4}
						alignItems='center'
						w='100%'
					>
						Agency Filter
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormLabel fontSize='md'>Select Agency</FormLabel>
						<Select value={selectedAgency?._id ?? ''} onChange={handleChange}>
							<option value=''>All</option>
							{agencies?.doc?.map((agency) => (
								<option key={agency._id} value={agency._id}>
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
							onClick={() => handleApplyFilter(selectedAgency?._id)}
						>
							Apply
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default AgencyFilter;
