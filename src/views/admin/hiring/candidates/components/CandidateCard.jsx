import {
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	Icon,
	Text,
	VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { FaWhatsapp, FaPhone, FaEye } from 'react-icons/fa6';
import { useState } from 'react';
import { constant } from 'constant';
import CandidateView from './CandidateView';
import StatusBadge from 'components/shared/StatusBadge';
import { toast } from 'react-toastify';
import FlagBadge from '../../_components/FlagBadge';
import { useDispatch, useSelector } from 'react-redux';
import { addMissingFile } from './../../../../../redux/missingFilesSlice';
import { FaBriefcase, FaUser } from 'react-icons/fa';

const CandidateCard = ({ candidate, refetch, mode }) => {
	const {
		name,
		position,
		email,
		whatsApp,
		phone,
		resume,
		status,
		invited,
		interviewDate,
		interviewTime,
		gender,
		experienceYears,
		createdAt,
	} = candidate;
	const [isApplicationOpen, setApplicationOpen] = useState(false);

	const dispatch = useDispatch();
	const missingFiles = useSelector((state) => state.missingFiles.missingFiles);

	const handleViewCV = async (resume) => {
		try {
			const pdfURL = `${constant['baseUrl']}${resume}`;

			// Check if this file was already marked as missing
			if (missingFiles.includes(resume)) {
				toast.error('CV not found!');
				return; // Stop further execution
			}

			// Send a single HEAD request to check if the file exists
			const response = await fetch(pdfURL, { method: 'HEAD' });

			if (!response.ok) {
				// Store the missing file to prevent future requests
				dispatch(addMissingFile(resume));
				toast.error('CV not found!');
				return;
			}

			// Open the PDF if it exists
			window.open(pdfURL, '_blank');
		} catch (error) {
			console.error('Error viewing CV:', error);
			toast.error('Failed to retrieve the CV. Please try again later.');
		}
	};
	const handleDownloadCV = async (resume) => {
		try {
			const pdfURL = `${constant['baseUrl']}${resume}`;
			// Check if this file was already marked as missing
			if (missingFiles.includes(resume)) {
				toast.error('CV could not be downloaded');
				return;
			}

			// Check if the file exists using a HEAD request
			const response = await fetch(pdfURL, { method: 'HEAD' });

			if (!response.ok) {
				// Store the missing file to prevent future requests
				dispatch(addMissingFile(resume));
				toast.error('CV could not be downloaded');
				return;
			}

			// Create an anchor element for the download
			const link = document.createElement('a');
			link.href = pdfURL;
			link.download = pdfURL.split('/').pop(); // Extract the file name from the URL
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link); // Clean up the DOM
		} catch (error) {
			console.error('Error viewing CV:', error);
			toast.error('Failed to retrieve the CV. Please try again later.');
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
				width='full'
			>
				<Box mb='4'>
					<Flex alignItems='flex-start' gap='2' justifyContent='space-between'>
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
							disabled={missingFiles.includes(resume)}
							onClick={() => handleViewCV(resume)}
						>
							<FaEye size={18} />
							<span>CV</span>
						</Button>
					</Flex>

					<HStack justifyContent='space-between'>
						<Flex flexDirection='column' gap='1' py='10px'>
							{mode !== 'interview' && (
								<Flex gap='2' alignItems='center'>
									<StatusBadge status={status} color={statusColor} size={8} />
									<FlagBadge item={candidate} />
								</Flex>
							)}

							<HStack justifyContent='space-between'>
								<Box>
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
								</Box>

								<Flex flexDir='column'>
									<Flex
										alignItems='center'
										gap='1'
										fontSize='.8rem'
										fontWeight='semibold'
										color='gray.800'
									>
										<Icon as={FaUser} boxSize='3' />
										<Text>{gender || 'N/A'}</Text>
									</Flex>
									<Flex
										alignItems='center'
										gap='1'
										fontSize='.8rem'
										fontWeight='semibold'
										color='gray.800'
									>
										<Icon as={FaBriefcase} boxSize='3' />
										<Text>{experienceYears} years</Text>
									</Flex>
								</Flex>
							</HStack>
						</Flex>
					</HStack>

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
							<span>{position.name}</span>
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
					{invited ? (
						<Flex
							fontSize='xs'
							alignItems='center'
							justifyContent='flex-end'
							gap={1}
						>
							<Text color='gray.500' fontWeight='light'>
								interview on
							</Text>

							<Text>{format(new Date(interviewDate), 'EEE, MMM d, yyyy')}</Text>
							<span>{interviewTime}</span>
						</Flex>
					) : (
						<Flex
							fontSize='xs'
							alignItems='center'
							justifyContent='flex-end'
							gap={1}
						>
							<Text color='gray.500' fontWeight='light'>
								applied on
							</Text>
							<Text>
								{format(new Date(createdAt), 'EEE, MMM d, yyyy h:mm a')}
							</Text>
						</Flex>
					)}
				</Box>
			</Box>

			<CandidateView
				isOpen={isApplicationOpen}
				onClose={() => setApplicationOpen(false)}
				candidate={candidate}
				onViewCV={handleViewCV}
				onDownloadCV={handleDownloadCV}
				missingFiles={missingFiles}
				refetch={refetch}
			/>
		</>
	);
};

export default CandidateCard;
