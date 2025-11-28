import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Select,
	Flex,
	Icon,
	Text,
	Box,
} from '@chakra-ui/react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { buttonStyle } from 'utils/btn';

const ReplaceTeamLead = ({
	teamLeaders,
	isOpen,
	onClose,
	setReplacementTeamLead,
	replacementTeamLead,
	handleProceed,
}) => {
	console.log({ replacementTeamLead });
	return (
		<Modal isOpen={isOpen} isCentered size='2xl'>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Select Replacement Team Lead</ModalHeader>
				<ModalBody>
					<Box
						bg='yellow.50'
						border='1px solid'
						borderColor='yellow.200'
						p={4}
						mb='4'
						borderRadius='md'
					>
						<Flex align='start' gap={2}>
							<Icon
								as={AiOutlineInfoCircle}
								color='yellow.600'
								boxSize={5}
								mt={1}
							/>
							<Box>
								<Text fontSize='md' color='yellow.800' fontWeight='medium'>
									You’ve updated the user’s role. Please review the required
									actions:
								</Text>

								<Box as='ul' pl={4} mt={2} color='yellow.800' fontSize='md'>
									<li>
										A <strong>replacement team leader</strong> must be selected
										to proceed.
									</li>
									<li>
										All <strong>agents</strong> assigned to this team leader
										will be moved to the new one.
									</li>
									{/* <li>
										All <strong>leads</strong> linked to this team leader will
										also be transferred.
									</li> */}
								</Box>
							</Box>
						</Flex>
					</Box>

					<Select
						placeholder='Select a Team Leader'
						value={replacementTeamLead}
						onChange={(e) => setReplacementTeamLead(e.target.value)}
					>
						{teamLeaders?.length ? (
							teamLeaders?.map((tl) => (
								<option key={tl._id} value={tl._id}>
									{tl.fullName}
								</option>
							))
						) : (
							<option value=''>None</option>
						)}
					</Select>
				</ModalBody>
				<ModalFooter>
					<Button
						{...buttonStyle}
						variant='solid'
						bg='gray.200'
						color='gray.800'
						_active={{ bg: 'gray.300' }}
						mr='3'
						fontSize='md'
						aria-label='close'
						onClick={onClose}
					>
						Close
					</Button>
					<Button
						{...buttonStyle}
						variant='solid'
						bg='brand.400'
						fontSize='md'
						aria-label='update'
						onClick={handleProceed}
						isDisabled={!replacementTeamLead}
					>
						Proceed
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ReplaceTeamLead;
