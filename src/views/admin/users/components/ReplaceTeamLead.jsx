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
	Heading,
	ModalCloseButton,
} from '@chakra-ui/react';
import { AiOutlineInfoCircle, AiOutlineWarning } from 'react-icons/ai';
import { buttonStyle } from 'utils/btn';

// const ReplaceTeamLead = ({
// 	teamLeaders,
// 	isOpen,
// 	onClose,
// 	setReplacementTeamLead,
// 	replacementTeamLead,
// 	handleProceed,
// }) => {
// 	return (
// 		<Modal isOpen={isOpen} isCentered size='2xl'>
// 			<ModalOverlay />
// 			<ModalContent>
// 				<ModalHeader>Select Replacement Team Lead</ModalHeader>
// 				<ModalBody>
// 					<Box
// 						bg='yellow.50'
// 						border='1px solid'
// 						borderColor='yellow.200'
// 						p={4}
// 						mb='4'
// 						borderRadius='md'
// 					>
// 						<Flex align='start' gap={2}>
// 							<Icon
// 								as={AiOutlineInfoCircle}
// 								color='yellow.600'
// 								boxSize={5}
// 								mt={1}
// 							/>
// 							<Box>
// 								<Text fontSize='md' color='yellow.800' fontWeight='medium'>
// 									You’ve updated the user’s role. Please review the required
// 									actions:
// 								</Text>

// 								<Box as='ul' pl={4} mt={2} color='yellow.800' fontSize='md'>
// 									<li>
// 										A <strong>replacement team leader</strong> must be selected
// 										to proceed.
// 									</li>
// 									<li>
// 										All <strong>agents</strong> assigned to this team leader
// 										will be moved to the new one.
// 									</li>
// 									<li>
// 										All <strong>leads</strong> linked to this team leader will
// 										also be transferred.
// 									</li>
// 								</Box>
// 							</Box>
// 						</Flex>
// 					</Box>

// 					<Select
// 						placeholder='Select a Team Leader'
// 						value={replacementTeamLead}
// 						onChange={(e) => setReplacementTeamLead(e.target.value)}
// 					>
// 						{teamLeaders?.length ? (
// 							teamLeaders?.map((tl) => (
// 								<option key={tl._id} value={tl._id}>
// 									{tl.fullName}
// 								</option>
// 							))
// 						) : (
// 							<option value=''>None</option>
// 						)}
// 					</Select>
// 				</ModalBody>
// 				<ModalFooter>
// 					<Button
// 						{...buttonStyle}
// 						variant='solid'
// 						bg='gray.200'
// 						color='gray.800'
// 						_active={{ bg: 'gray.300' }}
// 						mr='3'
// 						fontSize='md'
// 						aria-label='close'
// 						onClick={onClose}
// 					>
// 						Close
// 					</Button>
// 					<Button
// 						{...buttonStyle}
// 						variant='solid'
// 						bg='brand.400'
// 						fontSize='md'
// 						aria-label='update'
// 						onClick={handleProceed}
// 						isDisabled={!replacementTeamLead}
// 					>
// 						Proceed
// 					</Button>
// 				</ModalFooter>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

const ReplaceTeamLead = ({
	teamLeaders,
	isOpen,
	onClose,
	setReplacementTeamLead,
	replacementTeamLead,
	handleProceed,
}) => {
	const hasTeamLeaders = teamLeaders?.length > 0;

	return (
		<Modal isOpen={isOpen} isCentered size='3xl' onClose={onClose}>
			<ModalOverlay />
			<ModalContent m={2}>
				<ModalHeader>
					{hasTeamLeaders ? 'Select Replacement Team Lead' : 'Action Required'}
				</ModalHeader>

				<ModalCloseButton />

				<ModalBody>
					{hasTeamLeaders ? (
						<>
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
											You've updated the user's role. Please review the required
											actions:
										</Text>
										<Box as='ul' pl={4} mt={2} color='yellow.800' fontSize='md'>
											<li>
												A <strong>replacement team leader</strong> must be
												selected to proceed.
											</li>
											<li>
												All <strong>agents</strong> assigned to this team leader
												will be moved to the new one.
											</li>
											<li>
												All <strong>leads</strong> linked to this team leader
												will also be transferred.
											</li>
										</Box>
									</Box>
								</Flex>
							</Box>

							<Select
								placeholder='Select a Team Leader'
								value={replacementTeamLead}
								onChange={(e) => setReplacementTeamLead(e.target.value)}
								size='md'
								focusBorderColor='brand.400'
							>
								{teamLeaders.map((tl) => (
									<option key={tl._id} value={tl._id}>
										{tl.fullName}
									</option>
								))}
							</Select>
						</>
					) : (
						<Box
							bg='orange.50'
							border='1px solid'
							borderColor='orange.200'
							p={6}
							borderRadius='lg'
							textAlign='center'
						>
							<Icon
								as={AiOutlineWarning}
								color='orange.500'
								boxSize={12}
								mb={4}
							/>
							<Heading size='md' color='orange.800' mb={3}>
								No Team Leaders Available
							</Heading>
							<Text fontSize='sm' color='orange.700' mb={4}>
								This action cannot be completed because no team leaders are
								available under the current manager. To change this user’s role
								or disable the user, you must first create and assign at least
								one team leader.
							</Text>
							<Box
								bg='orange.100'
								p={4}
								borderRadius='md'
								borderLeft='4px solid'
								borderColor='orange.400'
							>
								<Text color='orange.700' fontSize='sm' mt={1}>
									You must have at least one other team leader under this
									manager to proceed further.
								</Text>
							</Box>
						</Box>
					)}
				</ModalBody>

				<ModalFooter>
					{hasTeamLeaders ? (
						<>
							<Button
								variant='ghost'
								color='gray.700'
								mr={3}
								onClick={onClose}
								size='md'
								px={6}
							>
								Cancel
							</Button>
							<Button
								bg='brand.400'
								color='white'
								_hover={{ bg: 'brand.500' }}
								_active={{ bg: 'brand.600' }}
								onClick={handleProceed}
								isDisabled={!replacementTeamLead}
								size='md'
								px={6}
							>
								Proceed
							</Button>
						</>
					) : (
						<Button
							variant='solid'
							bg='orange.500'
							color='white'
							_hover={{ bg: 'orange.600' }}
							_active={{ bg: 'orange.700' }}
							onClick={onClose}
							size='md'
							px={8}
							mx='auto'
							display='block'
						>
							Close & Cancel Request
						</Button>
					)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ReplaceTeamLead;
