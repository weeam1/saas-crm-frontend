import {
	Box,
	Button,
	Flex,
	Input,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Text,
	useDisclosure,
	useColorModeValue,
	Icon,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';

const AgentFilter = ({ agents = [], onSelect, selectedAgent }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [search, setSearch] = useState('');

	const filteredAgents = agents.filter(
		(agent) =>
			agent.fullName?.toLowerCase().includes(search.toLowerCase()) ||
			agent.username?.toLowerCase().includes(search.toLowerCase())
	);

	const handleSelect = (agent) => {
		onSelect(agent);
		onClose();
	};

	const bg = useColorModeValue('gray.100', 'gray.700');

	return (
		<>
			<Button
				onClick={onOpen}
				leftIcon={<Icon as={FiUser} />}
				bg='softGray.100'
				_hover={{ bg: 'gray.200' }}
				color='gray.700'
				shadow='sm'
				size='sm'
				fontWeight='medium'
				rounded='md'
			>
				Select Agent
			</Button>

			<Modal isOpen={isOpen} onClose={onClose} size='lg' isCentered>
				<ModalOverlay />
				<ModalContent mx='4'>
					<ModalHeader>Select an Agent</ModalHeader>
					<ModalCloseButton _focus={{ outline: 'none' }} />
					<ModalBody>
						<Input
							placeholder='Search agents...'
							mb={4}
							bg='gray.100'
							borderColor='gray.300'
							fontSize='sm'
							py={1}
							_focus={{
								borderColor: '#D99A36',
								boxShadow: '0 0 0 1px #D99A36',
								outline: 'none',
							}}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<Box maxH='300px' overflowY='auto' p='2'>
							{filteredAgents.map((agent) => (
								<Flex
									key={agent._id}
									p={3}
									bg={bg}
									rounded='md'
									cursor='pointer'
									mb={2}
									_hover={{ bg: 'brand.100' }}
									onClick={() => handleSelect(agent)}
									align='center'
									justify='space-between'
									shadow='sm'
								>
									<Box>
										<Text fontSize='md'>{agent.fullName}</Text>
										<Text fontSize='sm' color='gray.500'>
											{agent.username}
										</Text>
									</Box>
								</Flex>
							))}
							{filteredAgents.length === 0 && <NoData label='agent' />}
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default AgentFilter;
