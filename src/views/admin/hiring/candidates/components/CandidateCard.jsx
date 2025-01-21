import { Box, Button, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { FaWhatsapp, FaPhone, FaEye } from 'react-icons/fa';
import PdfViewer from './PdfViewer';
import { useState } from 'react';
import { FaLocationDot, FaLocationPin } from 'react-icons/fa6';

const CandidateCard = ({ candidate }) => {
	const { name, position, email, whatsApp, phone, country, resume, createdAt } =
		candidate;

	const [pdfUrl, setPdfUrl] = useState(null);
	const [error, setError] = useState('');

	const handlePdf = (resume) => {
		if (!resume) {
			setError('No resume file available.');
			return;
		}
		setError('');
		setPdfUrl(resume);
	};

	return (
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
						onClick={() => handlePdf(resume)}
					>
						<FaEye size={18} />
						<span>CV</span>
					</Button>
				</Flex>

				<Flex flexDirection='column' gap='1' py='10px'>
					<Flex
						alignItems='center'
						gap='1'
						fontSize='.8rem'
						fontWeight='semibold'
						color='gray.800'
					>
						<FaLocationDot style={{ marginRight: '4px' }} />
						{country?.flags?.png && (
							<Image
								rounded='sm'
								src={country?.flags.png}
								alt={country?.flags.alt}
								h='20px'
								fit='cover'
								shadow='md'
							/>
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

				<Flex alignItems='center' gap='1' fontSize='sm' color='gray.800' mb={2}>
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

			{pdfUrl && <PdfViewer pdfUrl={pdfUrl} />}
		</Box>
	);
};

export default CandidateCard;
