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
} from '@chakra-ui/react';
import { buttonStyle } from '../constants';
import axios from 'axios';
import { toast } from 'react-toastify';
import keys from 'config/keys';
import AddEmailHistory from 'views/admin/emailHistory/components/AddEmail';

// const InvitationModal = ({ isOpen, onClose, leadName, leadId }) => {
// 	const [loading, setLoading] = useState(false);

// 	const handleInvite = async () => {
// 		try {
// 			setLoading(true);

// 			const QRCodeUrl = `${keys.clientUrl}lead?page=1&pageSize=32&invite=${leadId}`;

// 			const inviteData = {
// 				name: leadName,
// 				url: QRCodeUrl,
// 			};

// 			const { data } = await axios.post(
// 				`${keys.socketUrl}/pdf/generate_invite`,
// 				inviteData
// 			);

// 			if (data) {
// 				const downloadURL = `${keys.socketUrl}/pdf${data?.download_url}`;

// 				// Validate the URL
// 				if (!isValidUrl(downloadURL)) {
// 					throw new Error('Invalid download URL');
// 				}

// 				// Trigger file download
// 				const link = document.createElement('a');
// 				link.href = downloadURL;
// 				link.setAttribute('download', `${leadName}-invite.pdf`);
// 				document.body.appendChild(link);
// 				link.click();
// 				link.parentNode.removeChild(link);
// 			}
// 		} catch (err) {
// 			console.log(err);
// 			toast.error(err.message || 'Failed to generate invite.');
// 		} finally {
// 			setLoading(false);
// 			onClose();
// 		}
// 	};

// 	// Helper function to validate URL
// 	const isValidUrl = (url) => {
// 		try {
// 			new URL(url);
// 			return true;
// 		} catch (error) {
// 			return false;
// 		}
// 	};

// 	return (
// 		<>
// 			<Modal
// 				isOpen={isOpen}
// 				onClose={onClose}
// 				size='md'
// 				isCentered
// 				closeOnOverlayClick={false}
// 			>
// 				<ModalOverlay />
// 				<ModalContent>
// 					<ModalHeader>VIP Invitation</ModalHeader>
// 					<ModalBody>
// 						<Box mx='auto'>
// 							<Button
// 								{...buttonStyle}
// 								variant='solid'
// 								bg='brand.400'
// 								py='5'
// 								px='8'
// 								w='full'
// 								fontSize='lg'
// 								aria-label='update'
// 								onClick={handleInvite}
// 							>
// 								{loading ? 'Loading...' : 'Generate Invitation'}
// 							</Button>
// 						</Box>
// 					</ModalBody>
// 					<ModalFooter>
// 						<Button
// 							{...buttonStyle}
// 							variant='solid'
// 							bg='gray.200'
// 							color='gray.800'
// 							_active={{ bg: 'gray.300' }}
// 							py='5'
// 							px='8'
// 							mr='3'
// 							fontSize='lg'
// 							aria-label='close'
// 							onClick={onClose}
// 						>
// 							Close
// 						</Button>
// 					</ModalFooter>
// 				</ModalContent>
// 			</Modal>
// 		</>
// 	);
// };

const InvitationModal = ({ isOpen, onClose, lead }) => {
	const { _id: leadId, leadName } = lead;

	const [loading, setLoading] = useState(false);
	const [files, setFiles] = useState(null);
	const [sendEmail, setSendEmail] = useState(null);

	const handleInvite = async () => {
		try {
			setLoading(true);

			const QRCodeUrl = `${keys.clientUrl}lead?page=1&pageSize=32&invite=${leadId}`;

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
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>VIP Invitation</ModalHeader>
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
												{/* <Button
												colorScheme='blue'
												onClick={() =>
													window.open(`${keys.socketUrl}/pdf${file}`, '_blank')
												}
											>
												View {lang}
											</Button> */}
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
