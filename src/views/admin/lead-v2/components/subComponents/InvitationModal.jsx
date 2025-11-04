import { useState } from 'react';
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Box,
	VStack,
	HStack,
	Text,
} from '@chakra-ui/react';
import {
	FiDownload,
	FiMail,
	FiX,
	FiLoader,
	FiCheckCircle,
	FiGlobe,
	FiInfo,
} from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';
import { buttonStyle } from '../constants';
import axios from 'axios';
import { toast } from 'react-toastify';
import keys from 'config/keys';
import AddEmailHistory from 'views/admin/emailHistory/components/AddEmail';
// import { HasAccess } from '../../../../../redux/accessUtils';
import { usePermissions } from 'hooks/usePermissions';
import { useModalColors } from 'hooks/useModalColors';

const InvitationModal = ({ isOpen, onClose, lead }) => {
	const { _id: leadId, leadName } = lead;

	const [loading, setLoading] = useState(false);
	const [files, setFiles] = useState(null);
	const [sendEmail, setSendEmail] = useState(null);

	const { hasPermission } = usePermissions();

	const { headerBg, headerText } = useModalColors();

	// const [emailAccess] = HasAccess(['Email']);

	const handleInvite = async () => {
		try {
			setLoading(true);

			const QRCodeUrl = `${keys.clientUrl}lead?page=1&pageSize=40&invite=${leadId}`;

			const inviteData = {
				name: leadName,
				url: QRCodeUrl,
			};

			const { data } = await axios.post(
				`${keys.socketUrl}/pdf/generate_invite`,
				inviteData
			);

			if (data?.download_url) {
				setFiles(data.download_url);
			}
		} catch (err) {
			console.log(err);
			toast.error(err.message || 'Failed to generate invite.');
		} finally {
			setLoading(false);
		}
	};

	const handleDownload = (filePath, lang) => {
		try {
			const downloadURL = `${keys.socketUrl}/pdf${filePath}`;
			const fileName = `${leadName.replace(/\s+/g, '_')}-invite-${lang}.pdf`;

			const link = document.createElement('a');
			link.href = downloadURL;
			link.setAttribute('download', fileName);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error(error);
			toast.error('Failed to download the file.');
		}
	};

	const handleSendEmail = async () => {
		setSendEmail(true);
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size='md'
				isCentered
				closeOnOverlayClick={false}
			>
				<ModalOverlay backdropFilter='blur(2px)' />
				{/* <ModalContent mx='2' borderRadius='xl' boxShadow='xl'>
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
						VIP Invitation
					</ModalHeader>
					<ModalBody>
						<Box mx='auto'>
							{!files && (
								<Button
									{...buttonStyle}
									bg='brand.400'
									py='5'
									px='8'
									w='full'
									fontSize='lg'
									onClick={handleInvite}
								>
									{loading ? 'Loading...' : 'Generate Invitation'}
								</Button>
							)}

							{files && (
								<VStack alignItems='stretch' mt={4} spacing={3}>
									{files.map((file, index) => {
										const lang = file.includes('english')
											? 'English'
											: 'Arabic';
										return (
											<HStack key={index}>
												<Button
													{...buttonStyle}
													bg='green.500'
													py='5'
													px='10'
													fontSize='lg'
													w='full'
													_active={{ bg: 'green.400' }}
													_hover={{ bg: 'green.400' }}
													onClick={() => handleDownload(file, lang)}
												>
													Download {lang}
												</Button>
											</HStack>
										);
									})}
									{hasPermission('leads', 'sendEmail') && (
										<Button
											{...buttonStyle}
											py='5'
											px='10'
											w='full'
											fontSize='lg'
											bg='brand.400'
											onClick={handleSendEmail}
										>
											Send Email
										</Button>
									)}
								</VStack>
							)}
						</Box>
					</ModalBody>
					<ModalFooter>
						<Button
							{...buttonStyle}
							bg='gray.200'
							_hover={{ bg: 'gray.300' }}
							_active={{ bg: 'gray.300' }}
							color='gray.800'
							py='5'
							px='8'
							fontSize='md'
							onClick={onClose}
						>
							Close
						</Button>
					</ModalFooter>
				</ModalContent> */}

				<ModalContent
					mx='2'
					borderRadius='2xl'
					boxShadow='2xl'
					border='1px'
					borderColor='gray.100'
					maxW={{ base: '95vw', md: '450px' }}
				>
					<ModalHeader
						display='flex'
						gap='3'
						bg='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
						color='white'
						borderTopRadius='2xl'
						py={5}
						alignItems='center'
						w='100%'
						justifyContent='center'
						position='relative'
					>
						<FaCrown size={24} />
						<Text fontWeight='bold' fontSize='xl'>
							VIP Invitation
						</Text>
					</ModalHeader>

					<ModalBody py={6}>
						<Box mx='auto' textAlign='center'>
							{/* Informational Section */}
							{/* <VStack spacing={4} mb={6} textAlign='left'>
								<HStack spacing={3} align='flex-start'>
									<Box color='blue.500' mt={1}>
										<FiInfo size={18} />
									</Box>
									<VStack align='flex-start' spacing={1}>
										<Text fontWeight='semibold' color='gray.700' fontSize='sm'>
											What's Included:
										</Text>
										<Text color='gray.600' fontSize='sm'>
											• Premium designed invitation cards • Multiple language
											support • Ready-to-send email templates • High-resolution
											PDF format
										</Text>
									</VStack>
								</HStack>
							</VStack> */}

							{/* Status indicator */}
							{!files && (
								<VStack spacing={6}>
									<Box
										bg='blue.50'
										p={4}
										borderRadius='lg'
										border='1px'
										borderColor='blue.100'
										textAlign='left'
									>
										<HStack spacing={2} mb={2}>
											<FiGlobe color='#3182CE' size={16} />
											<Text color='blue.700' fontSize='sm' fontWeight='medium'>
												Available Languages
											</Text>
										</HStack>
										<Text color='gray.600' fontSize='sm'>
											Your invitation will be generated in both English and
											Arabic with professional layouts suitable for VIP guests.
										</Text>
									</Box>

									<VStack spacing={3} w='full'>
										<Button
											{...buttonStyle}
											bg='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
											color='white'
											py={6}
											px={8}
											w='full'
											fontSize='lg'
											fontWeight='semibold'
											onClick={handleInvite}
											isLoading={loading}
											loadingText={
												<HStack spacing={2}>
													<FiLoader className='spin' />
													<Text>Generating Invitations...</Text>
												</HStack>
											}
											leftIcon={<FaCrown size={20} />}
											_hover={{
												transform: 'translateY(-2px)',
												boxShadow: 'xl',
												bg: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
											}}
											_active={{
												transform: 'translateY(0)',
											}}
											transition='all 0.3s ease-in-out'
										>
											Generate VIP Invitations
										</Button>

										<Text color='gray.500' fontSize='xs' textAlign='center'>
											Process takes 10-15 seconds. Both language versions will
											be created.
										</Text>
									</VStack>
								</VStack>
							)}

							{files && (
								<VStack alignItems='stretch' spacing={5}>
									{/* Success message */}
									<Box
										bg='green.50'
										p={4}
										borderRadius='lg'
										border='1px'
										borderColor='green.200'
									>
										<HStack spacing={2} justify='center'>
											<FiCheckCircle color='#38A169' size={20} />
											<Text color='green.700' fontSize='sm' fontWeight='medium'>
												VIP Invitations Generated Successfully!
											</Text>
										</HStack>
										<Text
											color='green.600'
											fontSize='xs'
											mt={1}
											textAlign='center'
										>
											Your premium invitation cards are ready for download and
											distribution.
										</Text>
									</Box>

									{/* Download section */}
									<VStack spacing={3} align='stretch'>
										<Text
											color='gray.600'
											fontSize='sm'
											fontWeight='medium'
											textAlign='left'
										>
											Download Invitation Files:
										</Text>

										{files.map((file, index) => {
											const lang = file.includes('english')
												? 'English'
												: 'Arabic';
											const langCode = lang === 'English' ? 'EN' : 'AR';

											return (
												<Button
													key={index}
													{...buttonStyle}
													bg='white'
													color='gray.700'
													py={5}
													px={6}
													fontSize='md'
													w='full'
													border='1px'
													borderColor='gray.200'
													leftIcon={
														<Box
															bg={lang === 'English' ? 'blue.50' : 'green.50'}
															color={
																lang === 'English' ? 'blue.600' : 'green.600'
															}
															p={2}
															borderRadius='md'
															fontSize='sm'
															fontWeight='bold'
														>
															{langCode}
														</Box>
													}
													rightIcon={<FiDownload size={18} />}
													_hover={{
														bg: lang === 'English' ? 'blue.50' : 'green.50',
														borderColor:
															lang === 'English' ? 'blue.300' : 'green.300',
														transform: 'translateY(-1px)',
														boxShadow: 'md',
													}}
													_active={{
														bg: lang === 'English' ? 'blue.100' : 'green.100',
														transform: 'translateY(0)',
													}}
													onClick={() => handleDownload(file, lang)}
													transition='all 0.2s'
												>
													Download {lang} Version
													<Text as='span' fontSize='xs' color='gray.500' ml={1}>
														(PDF)
													</Text>
												</Button>
											);
										})}
									</VStack>

									{/* Email section */}
									{hasPermission('leads', 'sendEmail') && (
										<VStack spacing={3} align='stretch'>
											<Text
												color='gray.600'
												fontSize='sm'
												fontWeight='medium'
												textAlign='left'
											>
												Send Directly:
											</Text>
											<Button
												{...buttonStyle}
												py={5}
												px={6}
												w='full'
												fontSize='md'
												bg='orange.50'
												color='orange.700'
												border='1px'
												borderColor='orange.200'
												leftIcon={<FiMail size={20} />}
												_hover={{
													bg: 'orange.100',
													borderColor: 'orange.300',
													transform: 'translateY(-1px)',
													boxShadow: 'md',
												}}
												_active={{
													bg: 'orange.200',
													transform: 'translateY(0)',
												}}
												onClick={handleSendEmail}
												transition='all 0.2s'
											>
												Send Email Invitation
												<Text as='span' fontSize='xs' color='orange.600' ml={1}>
													(Both languages)
												</Text>
											</Button>
											<Text color='gray.500' fontSize='xs' textAlign='left'>
												Recipients will receive both English and Arabic versions
												attached to the email.
											</Text>
										</VStack>
									)}

									{/* Additional Info */}
									<Box
										bg='gray.50'
										p={3}
										borderRadius='md'
										border='1px'
										borderColor='gray.200'
									>
										<Text color='gray.600' fontSize='xs' textAlign='center'>
											💡 <strong>Tip:</strong> Download both versions for
											complete event coverage. Files are optimized for printing
											and digital sharing.
										</Text>
									</Box>
								</VStack>
							)}
						</Box>
					</ModalBody>

					<ModalFooter pt={4} pb={5} borderTop='1px' borderColor='gray.100'>
						<Button
							{...buttonStyle}
							bg='gray.100'
							color='gray.700'
							_hover={{
								bg: 'gray.200',
								transform: 'translateY(-1px)',
								boxShadow: 'md',
							}}
							_active={{
								bg: 'gray.300',
								transform: 'translateY(0)',
							}}
							py={4}
							px={6}
							fontSize='md'
							onClick={onClose}
							transition='all 0.2s'
							w={{ base: 'full', md: 'auto' }}
							leftIcon={<FiX size={18} />}
						>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{sendEmail && (
				<AddEmailHistory
					// fetchData={refetchData}
					isOpen={sendEmail}
					onClose={setSendEmail}
					leadDetails={lead}
					lead='true'
					id={lead?._id}
					topic='attend_show'
					files={files}
				/>
			)}
		</>
	);
};

export default InvitationModal;
