import { Box, Button, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { FaWhatsapp, FaPhone, FaEye } from 'react-icons/fa';
import { useState } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { constant } from 'constant';
import CandidateView from './CandidateView';
import ReactDOM from 'react-dom';
import PdfViewer from './PdfViewer';

const CandidateCard = ({ candidate }) => {
	const { name, position, email, whatsApp, phone, country, resume, createdAt } =
		candidate;

	const pdfURL = `${constant['baseUrl']}${resume}`;

	const [isApplicationOpen, setApplicationOpen] = useState(false);
	const [CVOpen, setCVOpen] = useState(false);

	const handleViewCV = () => {
		window.open(pdfURL, '_blank');
	};

	const handleDownloadCV = () => {
		const link = document.createElement('a');

		link.href = pdfURL;
		link.download = pdfURL;
		link.click();
	};

	// const handlePdf = (url) => {
	// 	const pdfURL = `${constant['baseUrl']}${url}`;

	// 	if (pdfURL) {
	// 		window.open(pdfURL, '_blank', 'noopener,noreferrer');
	// 	} else {
	// 		console.error('PDF URL is not provided.');
	// 	}
	// };

	const handlePdfOpen = () => {
		// const setPdfUrl = `${constant['baseUrl']}${url}`;
		setCVOpen(true);
	};

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
							<Flex alignItems='center' gap='1'>
								<Heading size='md'>{name}</Heading>
							</Flex>

							<Text
								style={{ color: '#B3B3B3' }}
								textDecoration='underline'
								fontSize='.8rem'
								mb='4'
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
							onClick={handlePdfOpen}
						>
							<FaEye size={18} />
							<span>CV</span>
						</Button>
					</Flex>

					<Flex flexDirection='column' gap='1' py='10px'>
						{country?.flags?.png && (
							<Flex
								alignItems='center'
								gap='1'
								fontSize='.8rem'
								fontWeight='semibold'
								color='gray.800'
							>
								<FaLocationDot style={{ marginRight: '4px' }} />
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
			/>

			{CVOpen && (
				<PdfViewer
					isOpen={CVOpen}
					onClose={() => setCVOpen(false)}
					pdfUrl={pdfURL}
				/>
			)}
		</>
	);
};

export default CandidateCard;
