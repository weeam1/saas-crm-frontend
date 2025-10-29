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

const LeadsModal = ({ leadsModal, onClose, reFreshData, isInLeadPool }) => {
	const [leadNotes, setLeadNotes] = useState(false);

  const headerBg = useColorModeValue("brand.300", "brand.100");
  const headerText = useColorModeValue("brand.700", "brand.900");

	return (
		<Modal onClose={onClose} isOpen={leadsModal.isOpen} size='6xl' isCentered>
			<ModalOverlay bg='rgba(0,0,0,0.6)' backdropFilter='blur(6px)' />
			<ModalContent
				m='3'
				bg={headerBg}
				color={headerText}
				borderRadius='2xl'
				shadow='2xl'
				overflow='hidden'
			>
				<ModalHeader px={4} py={4} bg='brand.500' color='white'>
					<Flex
						direction={{ base: 'column', sm: 'row' }}
						justify='space-between'
						align={{ base: 'flex-start', sm: 'center' }}
						gap={{ base: 3, sm: 2 }}
						w='full'
						flexWrap='wrap'
					>
						<HStack spacing={3} align='center'>
							<Icon as={FaUserCircle} boxSize={6} color='white' />
							<Text
								fontSize={{ base: 'md', md: 'lg' }}
								fontWeight='600'
								noOfLines={1}
								maxW={{ base: '200px', sm: 'none' }}
							>
								Lead Details
							</Text>
						</HStack>
  return (
    <Modal onClose={onClose} isOpen={leadsModal.isOpen} size="6xl" isCentered>
      <ModalOverlay bg="rgba(0,0,0,0.6)" backdropFilter="blur(6px)" />
      <ModalContent m="3" borderRadius="2xl" shadow="2xl" overflow="hidden">
        <ModalHeader px={4} py={4} bg={headerBg} color={headerText}>
          <Flex
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            align={{ base: "flex-start", sm: "center" }}
            gap={{ base: 3, sm: 2 }}
            w="full"
            flexWrap="wrap"
          >
            <HStack spacing={3} align="center">
              <Icon as={FaUserCircle} boxSize={6} color={headerText} />
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="600"
                noOfLines={1}
                maxW={{ base: "200px", sm: "none" }}
              >
                Lead Details
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
            <HStack spacing={2} align="center" justify="flex-end">
              <Button
                {...buttonStyle}
                bg="whiteAlpha.200"
                color={headerText}
                _hover={{ bg: "whiteAlpha.300" }}
                size="sm"
                leftIcon={<FaPen />}
                onClick={() => setLeadNotes(true)}
                aria-label="lead notes"
                whiteSpace="nowrap"
              >
                Lead Notes
              </Button>
              <ModalCloseButton
                position="relative"
                color={headerText}
                top="0"
                right="0"
                _focus={{ outline: "none" }}
              />
            </HStack>
          </Flex>
        </ModalHeader>

				<Box
					bg='white'
					color='gray.800'
					p={5}
					borderTopRadius='2xl'
					maxH='85vh'
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
						/>
					)}
				</Box>
			</ModalContent>
		</Modal>
	);
};

export default LeadsModal;
