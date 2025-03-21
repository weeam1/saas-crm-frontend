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
} from '@chakra-ui/react';
import { buttonStyle } from '../constants';
import axios from 'axios';
import { toast } from 'react-toastify';
import keys from 'config/keys';

const InvitationModal = ({ isOpen, onClose, leadName, leadId }) => {
	const [loading, setLoading] = useState(false);

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

			if (data) {
				const downloadURL = `${keys.socketUrl}/pdf${data?.download_url}`;

				// Validate the URL
				if (!isValidUrl(downloadURL)) {
					throw new Error('Invalid download URL');
				}

				// axios({
				// 	url: downloadURL,
				// 	method: 'GET',
				// 	responseType: 'blob', // Ensures the file is treated as binary
				// })
				// 	.then((response) => {
				// 		const blobURL = window.URL.createObjectURL(
				// 			new Blob([response.data])
				// 		);
				// 		const link = document.createElement('a');
				// 		link.href = blobURL;
				// 		link.download = `${leadName}-invite.pdf`; // Forces filename in all browsers
				// 		document.body.appendChild(link);
				// 		link.click();
				// 		link.remove();
				// 		window.URL.revokeObjectURL(blobURL);
				// 	})
				// 	.catch((error) => console.error('Download failed:', error));
				// Trigger file download
				const link = document.createElement('a');
				link.href = downloadURL;
				link.setAttribute('download', `${leadName}-invite.pdf`);
				document.body.appendChild(link);
				link.click();
				link.parentNode.removeChild(link);
			}
		} catch (err) {
			console.log(err);
			toast.error(err.message || 'Failed to generate invite.');
		} finally {
			setLoading(false);
			onClose();
		}
	};

	// Helper function to validate URL
	const isValidUrl = (url) => {
		try {
			new URL(url); // This will throw an error if the URL is invalid
			return true;
		} catch (error) {
			return false;
		}
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
							<Button
								{...buttonStyle}
								variant='solid'
								bg='brand.400'
								py='5'
								px='8'
								w='full'
								fontSize='lg'
								aria-label='update'
								onClick={handleInvite}
							>
								{loading ? 'Loading...' : 'Generate Invitation'}
							</Button>
						</Box>
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
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default InvitationModal;
