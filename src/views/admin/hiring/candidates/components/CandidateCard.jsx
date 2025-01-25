import { Box, Button, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { FaWhatsapp, FaPhone, FaEye } from 'react-icons/fa6';
import { useState } from 'react';
import { constant } from 'constant';
import CandidateView from './CandidateView';
import StatusBadge from 'components/shared/StatusBadge';
import { toast } from 'react-toastify';

const CandidateCard = ({ candidate, refetch }) => {
	const {
		name,
		position,
		email,
		whatsApp,
		phone,
		country,
		resume,
		status,
		createdAt,
	} = candidate;

	const pdfURL = `${constant['baseUrl']}${resume}`;

	const [isApplicationOpen, setApplicationOpen] = useState(false);

	const handleViewCV = async () => {
		try {
			// Make a request to check if the file exists
			const response = await fetch(pdfURL, { method: 'HEAD' });

			if (!response.ok) {
				throw new Error('File not found');
			}

			// Open the PDF if it exists
			window.open(pdfURL, '_blank');
		} catch (error) {
			// Handle errors (e.g., file not found or server error)
			console.error('Error viewing CV:', error);
			toast.error('The requested CV could not be found.');
		}
	};

	const handleDownloadCV = async () => {
		try {
			// Check if the file exists using a HEAD request
			const response = await fetch(pdfURL, { method: 'HEAD' });

			if (!response.ok) {
				throw new Error('File not found');
			}

			// Create an anchor element for the download
			const link = document.createElement('a');
			link.href = pdfURL;
			link.download = pdfURL.split('/').pop(); // Extract the file name from the URL
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link); // Clean up the DOM
		} catch (error) {
			console.error('Error downloading CV:', error);
			toast.error('The requested CV could not be downloaded.');
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'Pending':
				return 'yellow';
			case 'Eligible':
				return 'green';
			case 'Not Eligible':
				return 'red';
			default:
				return 'gray'; // Default color if no matching status
		}
	};

	const statusColor = getStatusColor(status);

	return (
		<>
			<Box
				border='1px solid #E2E8F0'
				bg='white'
				borderRadius='md'
				p={4}
				boxShadow='sm'
			>
				<Box mb='2rem'>
					<Flex alignItems='flex-start' justifyContent='space-between'>
						<Box>
							<Heading width='10rem' size='md' isTruncated>
								{name}
							</Heading>

							<Text
								style={{ color: '#B3B3B3' }}
								textDecoration='underline'
								fontSize='.8rem'
								mb='4'
								isTruncated
								width={{ base: '12rem', lg: '10rem' }}
							>
								{email}
							</Text>
						</Box>

						<Button
							bg='#EDC270'
							color='gray.800'
							py='6px'
							px='12px'
							fontSize='0.85rem'
							fontWeight='medium'
							shadow='sm'
							rounded='full'
							_hover={{ bg: '#E0B960' }}
							_active={{ bg: '#D4AC50' }}
							w='83px'
							h='30px'
							display='flex'
							gap='4px'
							alignItems='center'
							justifyContent='center'
							onClick={handleViewCV}
						>
							<FaEye size={18} />
							<span>CV</span>
						</Button>
					</Flex>

					<Flex flexDirection='column' gap='1' py='10px'>
						<Flex gap='2' alignItems='center'>
							<StatusBadge status={status} color={statusColor} size={8} />
							{country?.flags?.png && (
								<Flex
									alignItems='center'
									gap='1'
									fontSize='.8rem'
									fontWeight='semibold'
									color='gray.800'
								>
									{/* <FaLocationDot style={{ marginRight: '4px' }} /> */}
									<Image
										rounded='sm'
										src={country?.flags.png}
										alt={country?.flags.alt}
										h='20px'
										fit='cover'
										shadow='md'
									/>
								</Flex>
							)}
						</Flex>

						<Flex
							alignItems='center'
							gap='1'
							fontSize='.8rem'
							fontWeight='semibold'
							color='gray.800'
						>
							<FaWhatsapp style={{ marginRight: '4px' }} />
							<p>{whatsApp}</p>
						</Flex>
						<Flex
							alignItems='center'
							gap='1'
							fontSize='.8rem'
							fontWeight='semibold'
							color='gray.800'
						>
							<FaPhone />
							{phone}
						</Flex>
					</Flex>

					<Flex
						alignItems='center'
						gap='1'
						fontSize='sm'
						color='gray.800'
						mb={2}
					>
						<span
							style={{
								color: '#B3B3B3',
								marginRight: '4px',
								fontWeight: 'lighter',
							}}
						>
							Job Role
						</span>
						<Text fontWeight='semibold'>
							<span>{position}</span>
						</Text>
					</Flex>
					<Button
						bg='#EDC270'
						color='gray.800'
						py='6px'
						px='12px'
						fontSize='0.85rem'
						fontWeight='medium'
						shadow='md'
						// borderRadius='md'
						rounded='full'
						_hover={{ bg: '#E0B960' }} // Slightly darker shade for hover effect
						_active={{ bg: '#D4AC50' }} // Darker shade for active state
						w='83px'
						h='30px'
						onClick={() => setApplicationOpen(true)}
					>
						View
					</Button>
				</Box>

				<Box textAlign='right' fontSize='sm' color='gray.800'>
					<span
						style={{
							color: '#B3B3B3',
							marginRight: '4px',
							fontWeight: 'lighter',
						}}
					>
						applied on
					</span>
					{format(new Date(createdAt), 'EEE, MMM d, yyyy h:mm a')}
				</Box>
			</Box>

			<CandidateView
				isOpen={isApplicationOpen}
				onClose={() => setApplicationOpen(false)}
				candidate={candidate}
				onViewCV={handleViewCV}
				onDownloadCV={handleDownloadCV}
				refetch={refetch}
			/>

			{/* {CVOpen && (
				<PdfViewer
					isOpen={CVOpen}
					onClose={() => setCVOpen(false)}
					pdfUrl={pdfURL}
				/>
			)} */}
		</>
	);
};

export default CandidateCard;
