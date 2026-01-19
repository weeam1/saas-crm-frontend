import {
	Box,
	Modal,
	ModalContent,
	ModalOverlay,
	ModalCloseButton,
	ModalHeader,
	Flex,
	Button,
	Text,
	HStack,
	Icon,
	useColorModeValue,
} from '@chakra-ui/react';
import { FaPen, FaUserCircle } from 'react-icons/fa';
import LeadDetails from './LeadDetails';
import LeadNotesModal from './components/lead-note/LeadNotesModal';
import { useState } from 'react';
import { buttonStyle } from 'utils/btn';
import useUserSession from 'hooks/useUserSession';

const LeadsModal = ({
	leadsModal,
	onClose,
	reFreshData,
	isInLeadPool = false,
}) => {
	const [leadNotes, setLeadNotes] = useState(false);

	const headerBg = useColorModeValue('brand.300', 'brand.100');
	const headerText = useColorModeValue('brand.700', 'brand.900');

	const { userRoleName } = useUserSession();

	// const isNotesAllowed = isInLeadPool ? userRoleName !== 'Agent' : true;

	return (
		<Modal onClose={onClose} isOpen={leadsModal.isOpen} size='6xl' isCentered>
			<ModalOverlay bg='rgba(0,0,0,0.6)' backdropFilter='blur(6px)' />
			<ModalContent m='3' borderRadius='2xl' shadow='2xl' overflow='hidden'>
				<ModalHeader px={4} py={4} bg={headerBg} color={headerText}>
					<Flex
						direction={{ base: 'column', sm: 'row' }}
						justify='space-between'
						align={{ base: 'flex-start', sm: 'center' }}
						gap={{ base: 3, sm: 2 }}
						w='full'
						flexWrap='wrap'
					>
						<HStack spacing={3} align='center'>
							<Icon as={FaUserCircle} boxSize={6} color={headerText} />
							<Text
								fontSize={{ base: 'md', md: 'lg' }}
								fontWeight='600'
								noOfLines={1}
								maxW={{ base: '200px', sm: 'none' }}
							>
								Lead Detail
							</Text>
						</HStack>

						<HStack spacing={2} align='center' justify='flex-end'>
							<Button
								{...buttonStyle}
								bg='whiteAlpha.200'
								color='white'
								_hover={{ bg: 'whiteAlpha.300' }}
								size='sm'
								leftIcon={<FaPen />}
								onClick={() => setLeadNotes(true)}
								aria-label='lead notes'
								whiteSpace='nowrap'
							>
								Lead Notes
							</Button>

							<ModalCloseButton
								position='relative'
								color='white'
								top='0'
								right='0'
								_focus={{ outline: 'none' }}
							/>
						</HStack>
					</Flex>
				</ModalHeader>

				<Box
					bg='white'
					color='gray.800'
					p={5}
					borderTopRadius='2xl'
					maxH={{ base: '50vh', md: '70vh' }}
					overflowY='auto'
					scrollBehavior='smooth'
				>
					<LeadDetails
						leadId={leadsModal.lid}
						isInLeadPool={isInLeadPool}
						reFreshData={reFreshData}
					/>

					{leadNotes && (
						<LeadNotesModal
							leadId={leadsModal.lid}
							isOpen={leadNotes}
							onClose={() => setLeadNotes(false)}
							isInLeadPool={isInLeadPool}
						/>
					)}
				</Box>
			</ModalContent>
		</Modal>
	);
};

export default LeadsModal;
