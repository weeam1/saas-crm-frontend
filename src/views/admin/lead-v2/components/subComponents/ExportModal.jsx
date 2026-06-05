import { useEffect, useRef, useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Progress,
	Text,
	VStack,
	Box,
	Icon,
	HStack,
	Badge,
	CircularProgress,
	Flex,
	Tooltip,
} from '@chakra-ui/react';
import {
	FiDownload,
	FiFileText,
	FiFile,
	FiCheckCircle,
	FiInfo,
	FiX,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { constant } from 'constant';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const ExportModal = ({ isOpen, onClose, totalRecords = 0, params }) => {
	const [progress, setProgress] = useState(0);
	const [loading, setLoading] = useState(false);
	const [exportStatus, setExportStatus] = useState('ready');
	const [currentStep, setCurrentStep] = useState('Preparing data...');
	const progressRef = useRef(null);
	const blobRef = useRef(null);

	const startFakeProgress = () => {
		stopProgress();

		progressRef.current = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(progressRef.current);
					setExportStatus('success');
					setCurrentStep('Export completed successfully!');
					return 100;
				}

				const inc = 3 + Math.random() * 3;
				const next = Math.min(prev + inc, 100);

				if (next < 30) setCurrentStep('Preparing data...');
				else if (next < 60) setCurrentStep('Formatting records...');
				else if (next < 90) setCurrentStep('Generating file...');
				else setCurrentStep('Finalizing export...');

				return next;
			});
		}, 300);
	};

	const stopProgress = () => {
		if (progressRef.current) {
			clearInterval(progressRef.current);
			progressRef.current = null;
		}
	};

	const handleDownload = () => {
		if (blobRef.current) {
			try {
				const url = window.URL.createObjectURL(blobRef.current);
				const a = document.createElement('a');
				a.href = url;
				a.download = getFileName();
				a.style.display = 'none';
				document.body.appendChild(a);
				a.click();

				setTimeout(() => {
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);
				}, 100);
			} catch (error) {
				console.error('Download error:', error);
			}
		}
	};

	const handleExport = async () => {
		setLoading(true);
		setExportStatus('processing');
		setProgress(0);
		blobRef.current = null;

		startFakeProgress();

		try {
			const token =
				localStorage.getItem('token') || sessionStorage.getItem('token');

			let query = '';
			if (params && Object.keys(params).length > 0) {
				query = '?' + new URLSearchParams(params).toString();
			}

			const response = await fetch(
				`${constant['baseUrl']}api/lead/export/csv${query}`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: 'text/csv',
					},
				},
			);

			if (!response.ok) {
				const text = await response.text();
				throw new Error(`Failed to fetch CSV: ${text}`);
			}

			const blob = await response.blob();
			blobRef.current = blob;
		} catch (err) {
			console.error('Export error:', err);
			stopProgress();
			setExportStatus('failed');
			setCurrentStep('Export failed');
		} finally {
			setLoading(false);
		}
	};

	const resetModal = () => {
		stopProgress();
		setProgress(0);
		setLoading(false);
		setExportStatus('ready');
		setCurrentStep('Preparing data...');
		blobRef.current = null;
	};

	useEffect(() => {
		if (!isOpen) {
			resetModal();
		}
	}, [isOpen]);

	const getStatusIcon = () => {
		switch (exportStatus) {
			case 'processing':
				return FiFile;
			case 'success':
				return FiCheckCircle;
			default:
				return FiDownload;
		}
	};

	const getFileExtension = () => 'csv';

	const getFileName = () => {
		const now = new Date();
		const pad = (num) => String(num).padStart(2, '0');
		const year = now.getFullYear();
		const month = pad(now.getMonth() + 1);
		const day = pad(now.getDate());
		let hours = now.getHours();
		const minutes = pad(now.getMinutes());
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12 || 12;
		const hourStr = pad(hours);

		return `leads_${year}-${month}-${day}_${hourStr}-${minutes}${ampm}.${getFileExtension()}`;
	};

	const getFileTypeName = () => 'CSV';

	const renderProgressScreen = () => (
		<MotionVStack spacing={5} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			{exportStatus !== 'success' && (
				<Box w='full' overflow='hidden'>
					<Box p={5}>
						<VStack spacing={4} align='stretch'>
							<Flex justify='space-between'>
								<HStack spacing={3}>
									<Box p={2.5} bg='bg.elevated' borderRadius='lg' color='text.accent'>
										<Icon as={FiFileText} boxSize={4} />
									</Box>
									<VStack align='start' spacing={0.5}>
										<HStack fontWeight='bold'>
											<Text fontSize={{ base: 'md', md: 'lg' }} color='text.heading'>
												{totalRecords?.toLocaleString() || 0}
											</Text>
											<Text fontSize={{ base: 'md', md: 'lg' }} color='text.body'>
												Leads
											</Text>
										</HStack>
									</VStack>
								</HStack>
							{exportStatus !== 'ready' && exportStatus !== 'failed' && (
	<Badge
		colorScheme={exportStatus === 'processing' ? 'blue' : 'green'}
		borderRadius='lg'
		px={2}
		py={1}
		fontSize='xs'
		lineHeight='1'
		display='inline-flex'
		alignItems='center'
		height='22px'
	>
		{exportStatus}
	</Badge>
)}
							</Flex>

							<Button
								onClick={handleExport}
								isLoading={loading}
								loadingText='Exporting...'
								variant='brand'
								size='md'
								py={6}
								px={8}
								w='full'
								fontSize='lg'
								fontWeight='semibold'
								borderRadius='lg'
								leftIcon={<FiDownload size={20} />}
								isDisabled={
									exportStatus === 'processing' || exportStatus === 'success'
								}
							>
								{exportStatus === 'processing' ? 'Exporting...' : 'Export CSV'}
							</Button>
							<Text color='text.muted' fontSize='xs' mt={2} textAlign='center'>
								Lead export typically completes within 5–20 seconds.
							</Text>
						</VStack>
					</Box>
				</Box>
			)}

			<AnimatePresence mode='wait'>
				{exportStatus === 'success' && (
					<MotionBox
						width='full'
						key='success'
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 16 }}
						transition={{ duration: 0.3 }}
					>
						<Box
							p={5}
							bg='bg.surface'
							borderRadius='xl'
							border='1px solid'
							borderColor='border.default'
							textAlign='center'
						>
							<MotionBox
								animate={{ scale: [1, 1.15, 1] }}
								transition={{ duration: 0.5 }}
							>
								<Icon
									as={FiCheckCircle}
									boxSize={10}
									color='green.500'
									mb={2}
								/>
							</MotionBox>
							<Text fontSize='md' fontWeight='bold' color='text.heading' mb={1.5}>
								Export Completed!
							</Text>
							<Text fontSize='xs' color='text.muted' mb={3}>
								{totalRecords?.toLocaleString() || 0} records exported to{' '}
								{getFileTypeName()} successfully.
							</Text>
							<Button
								onClick={handleDownload}
								variant='brand'
								size='sm'
								leftIcon={<FiDownload />}
							>
								Download File
							</Button>
						</Box>
					</MotionBox>
				)}
			</AnimatePresence>

			{exportStatus === 'success' && (
				<MotionBox
					key='instructions'
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 16 }}
					width='full'
					transition={{ duration: 0.3 }}
				>
					<Box
						p={5}
						bg='bg.surface'
						borderRadius='xl'
						border='1px solid'
						borderColor='border.default'
						textAlign='left'
					>
						<VStack spacing={2} align='start' pl={3}>
							<Text fontWeight='semibold' color='text.heading'>
								How to open CSV in Excel:
							</Text>
							<VStack
								as='ul'
								align='start'
								spacing={1.5}
								pl={4}
								color='text.body'
								fontSize='sm'
							>
								<Flex as='li' align='flex-start'>
									<Box as='span' mr={2}>•</Box>
									<Text>Open Excel</Text>
								</Flex>
								<Flex as='li' align='flex-start'>
									<Box as='span' mr={2}>•</Box>
									<Text>Go to Data tab</Text>
								</Flex>
								<Flex as='li' align='flex-start'>
									<Box as='span' mr={2}>•</Box>
									<Text>Click Get Data</Text>
								</Flex>
								<Flex as='li' align='flex-start'>
									<Box as='span' mr={2}>•</Box>
									<Text>Select "From Text/CSV"</Text>
								</Flex>
								<Flex as='li' align='flex-start'>
									<Box as='span' mr={2}>•</Box>
									<Text>Select CSV file</Text>
								</Flex>
								<Flex as='li' align='flex-start'>
									<Box as='span' mr={2}>•</Box>
									<Text>Click "Load" to import your data into Excel</Text>
								</Flex>
								<Flex as='li' align='flex-start'>
									<Box as='span' mr={2}>•</Box>
									<Text>You can now view, sort, or filter your records</Text>
								</Flex>
							</VStack>
						</VStack>
					</Box>
				</MotionBox>
			)}

			{exportStatus === 'failed' && (
				<Box
					p={5}
					width='full'
					bg='bg.surface'
					borderRadius='xl'
					border='1px solid'
					borderColor='red.500'
					textAlign='center'
				>
					<Icon as={FiX} boxSize={10} color='red.500' mb={2} />
					<Text fontWeight='bold' color='text.heading'>
						Export Failed
					</Text>
					<Text fontSize='xs' color='text.muted'>
						Something went wrong while exporting CSV.
					</Text>
				</Box>
			)}

			{/* Progress Section */}
			<Box w='full'>
				<VStack spacing={4} align='stretch'>
					{exportStatus === 'processing' && (
						<>
							<Flex justify='space-between' align='center'>
								<Text fontSize='sm' fontWeight='semibold' color='text.body'>
									Export Progress
								</Text>
								<HStack spacing={2}>
									<Text fontSize='xs' fontWeight='medium' color='text.muted'>
										{Math.round(progress)}%
									</Text>
									{exportStatus === 'processing' && (
										<CircularProgress
											size='16px'
											thickness='3px'
											color='accent.gold'
											isIndeterminate
										/>
									)}
								</HStack>
							</Flex>

							<Box position='relative' w='full'>
								<Progress
									value={progress}
									height='8px'
									width='full'
									borderRadius='full'
									colorScheme='yellow'
									hasStripe={exportStatus === 'processing'}
									isAnimated={exportStatus === 'processing'}
								/>
							</Box>
						</>
					)}

					{exportStatus === 'processing' && (
						<MotionBox
							initial={{ opacity: 0, y: -8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<Box
								p={3}
								bg='bg.elevated'
								borderRadius='lg'
								border='1px solid'
								borderColor='border.default'
							>
								<HStack spacing={2}>
									<CircularProgress
										size='16px'
										thickness='4px'
										color='accent.gold'
										isIndeterminate
									/>
									<VStack align='start' spacing={0} flex={1}>
										<Text fontSize='xs' fontWeight='medium' color='text.body'>
											{currentStep}
										</Text>
										<Text fontSize='2xs' color='text.muted'>
											This may take a moment...
										</Text>
									</VStack>
									<Tooltip label='Export process details' placement='top'>
										<Icon
											as={FiInfo}
											color='text.accent'
											cursor='help'
											boxSize={3.5}
										/>
									</Tooltip>
								</HStack>
							</Box>
						</MotionBox>
					)}
				</VStack>
			</Box>
		</MotionVStack>
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			closeOnOverlayClick={!loading}
			size='md'
			motionPreset='scale'
		>
			<ModalOverlay bg='bg.overlay' backdropFilter='blur(10px)' />
			<ModalContent
				bg='bg.surface'
				borderRadius='2xl'
				maxW='520px'
				mx={4}
				overflow='hidden'
				boxShadow='deep'
			>
				<ModalHeader
					bg='accent.gold'
					color='text.inverse'
					py={3}
					position='relative'
					borderBottom='1px solid'
					borderColor='border.default'
				>
					<Flex justify='space-between' align='center'>
						<HStack spacing={3}>
							<MotionBox
								animate={{
									scale: exportStatus === 'processing' ? [1, 1.1, 1] : 1,
								}}
								transition={{
									duration: 2,
									repeat: exportStatus === 'processing' ? Infinity : 0,
								}}
							>
								<Icon as={getStatusIcon()} boxSize={6} />
							</MotionBox>
							<Box>
								<Text fontSize='xl' color='text.inverse' fontWeight='bold'>
									Export
								</Text>
							</Box>
						</HStack>
						{exportStatus !== 'processing' && (
							<MotionBox
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								cursor='pointer'
								onClick={onClose}
							>
								<Icon as={FiX} boxSize={5} />
							</MotionBox>
						)}
					</Flex>
				</ModalHeader>

				<ModalBody py={6} px={6} bg='bg.app'>
					{renderProgressScreen()}
				</ModalBody>

				<ModalFooter
					borderTop='1px solid'
					borderColor='border.default'
					pt={5}
					pb={6}
					px={6}
					bg='bg.surface'
				>
					<HStack spacing={3} w='full'>
						{exportStatus !== 'success' ? (
							<Button
								onClick={onClose}
								variant='outline'
								flex={1}
								isDisabled={loading}
							>
								Cancel
							</Button>
						) : (
							<Button
								onClick={onClose}
								variant='brand'
								flex={1}
							>
								Done
							</Button>
						)}
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ExportModal;