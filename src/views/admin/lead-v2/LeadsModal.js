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
import { useModalColors } from 'hooks/useModalColors';

const LeadsModal = ({
	leadsModal,
	onClose,
	reFreshData,
	isInLeadPool = false,
}) => {
	const [leadNotes, setLeadNotes] = useState(false);

	const headerBg = useColorModeValue('brand.300', 'brand.100');
	const headerText = useColorModeValue('brand.700', 'brand.900');

	const mc = useModalColors();

	const { userRoleName } = useUserSession();

	// const isNotesAllowed = isInLeadPool ? userRoleName !== 'Agent' : true;

	return (
		// <Modal onClose={onClose} isOpen={leadsModal.isOpen} size='6xl' isCentered>
		// 	<ModalOverlay bg='rgba(0,0,0,0.6)' backdropFilter='blur(6px)' />
		// 	<ModalContent m='3' borderRadius='2xl' shadow='2xl' overflow='hidden'>
		// 		<ModalHeader px={4} py={4} bg={headerBg} color={headerText}>
		// 			<Flex
		// 				direction={{ base: 'column', sm: 'row' }}
		// 				justify='space-between'
		// 				align={{ base: 'flex-start', sm: 'center' }}
		// 				gap={{ base: 3, sm: 2 }}
		// 				w='full'
		// 				flexWrap='wrap'
		// 			>
		// 				<HStack spacing={3} align='center'>
		// 					<Icon as={FaUserCircle} boxSize={6} color={headerText} />
		// 					<Text
		// 						fontSize={{ base: 'md', md: 'lg' }}
		// 						fontWeight='600'
		// 						noOfLines={1}
		// 						maxW={{ base: '200px', sm: 'none' }}
		// 					>
		// 						Lead Detail
		// 					</Text>
		// 				</HStack>

		// 				<HStack spacing={2} align='center' justify='flex-end'>
		// 					<Button
		// 						{...buttonStyle}
		// 						bg='whiteAlpha.200'
		// 						color='white'
		// 						_hover={{ bg: 'whiteAlpha.300' }}
		// 						size='sm'
		// 						leftIcon={<FaPen />}
		// 						onClick={() => setLeadNotes(true)}
		// 						aria-label='lead notes'
		// 						whiteSpace='nowrap'
		// 					>
		// 						Lead Notes
		// 					</Button>

		// 					<ModalCloseButton
		// 						position='relative'
		// 						color='white'
		// 						top='0'
		// 						right='0'
		// 						_focus={{ outline: 'none' }}
		// 					/>
		// 				</HStack>
		// 			</Flex>
		// 		</ModalHeader>

		// 		<Box
		// 			bg='white'
		// 			color='gray.800'
		// 			p={5}
		// 			borderTopRadius='2xl'
		// 			maxH={{ base: '50vh', md: '70vh' }}
		// 			overflowY='auto'
		// 			scrollBehavior='smooth'
		// 		>
		// 			<LeadDetails
		// 				leadId={leadsModal.lid}
		// 				isInLeadPool={isInLeadPool}
		// 				reFreshData={reFreshData}
		// 			/>

		// 			{leadNotes && (
		// 				<LeadNotesModal
		// 					leadId={leadsModal.lid}
		// 					isOpen={leadNotes}
		// 					onClose={() => setLeadNotes(false)}
		// 					isInLeadPool={isInLeadPool}
		// 				/>
		// 			)}
		// 		</Box>
		// 	</ModalContent>
		// </Modal>

		<Modal onClose={onClose} isOpen={leadsModal.isOpen} size='6xl' isCentered>
			<ModalOverlay backdropFilter='blur(6px)' bg='rgba(11, 28, 44, 0.8)' />
			<ModalContent
				m='3'
				borderRadius='2xl'
				boxShadow={mc.modalShadow}
				bg={mc.bg}
				border='1px solid'
				borderColor={mc.borderColor}
				overflow='hidden'
			>
				{/* Header — Gold Gradient */}
				<ModalHeader
					px={6}
					py={4}
					background={mc.headerBg}
					color={mc.headerText}
					boxShadow='0 2px 10px rgba(0,0,0,0.15)'
				>
					<Flex
						direction={{ base: 'column', sm: 'row' }}
						justify='space-between'
						align={{ base: 'flex-start', sm: 'center' }}
						gap={{ base: 3, sm: 2 }}
						w='full'
						flexWrap='wrap'
					>
						<HStack spacing={3} align='center'>
							<Icon as={FaUserCircle} boxSize={6} color={mc.headerText} />
							<Text
								fontSize={{ base: 'md', md: 'lg' }}
								fontWeight='bold'
								noOfLines={1}
								color='inherit'
								maxW={{ base: '200px', sm: 'none' }}
							>
								Lead Detail
							</Text>
						</HStack>

						<HStack spacing={2} align='center' justify='flex-end'>
							<Button
								bg={mc.bg}
								color={'text.white'}
								_hover={{ bg: mc.secondaryBtnHoverBg }}
								_active={{ bg: mc.secondaryBtnHoverBg }}
								size='sm'
								leftIcon={<FaPen />}
								onClick={() => setLeadNotes(true)}
								aria-label='lead notes'
								whiteSpace='nowrap'
								fontWeight='medium'
								borderRadius='md'
								shadow='lg'
							>
								Lead Notes
							</Button>

							<ModalCloseButton
								position='relative'
								bg={mc.closeBtnBg}
								color={mc.headerText}
								borderRadius='full'
								top='0'
								right='0'
								_hover={{ bg: mc.closeBtnHoverBg }}
								_focus={{ outline: 'none', boxShadow: 'none' }}
							/>
						</HStack>
					</Flex>
				</ModalHeader>

				{/* Body */}
				<Box
					bg={mc.bg}
					p={5}
					maxH={{ base: '50vh', md: '70vh' }}
					overflowY='auto'
					scrollBehavior='smooth'
					sx={{
						'&::-webkit-scrollbar': {
							width: '6px',
						},
						'&::-webkit-scrollbar-track': {
							background: mc.bgDeep,
							borderRadius: '3px',
						},
						'&::-webkit-scrollbar-thumb': {
							background: mc.borderColor,
							borderRadius: '3px',
							_hover: { background: mc.borderFocus },
						},
					}}
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
