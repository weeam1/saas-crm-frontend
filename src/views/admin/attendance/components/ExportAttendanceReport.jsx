import React, { useState, useRef, useEffect } from 'react';
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	FormControl,
	FormLabel,
	Select,
	Box,
	Text,
	useDisclosure,
	Flex,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useFetchItemsQuery, useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { generateReportApi } from 'api';
import { buttonStyle } from 'utils/btn';
import { AiOutlineExport } from 'react-icons/ai';

const MotionProgress = motion(Box);

const ExportAttendanceModal = ({ isOpen, onClose, month, year }) => {
	const [selectedAgency, setSelectedAgency] = useState('');
	const [selectedFormat, setSelectedFormat] = useState(null);
	const [progress, setProgress] = useState(0);
	const [isGenerating, setIsGenerating] = useState(false);
	const downloadLinkRef = useRef(null);

	const user = JSON.parse(localStorage.getItem('user'));

	const isAdmin = user?.role === 'superAdmin';

	// Fetch agencies
	const { data: agencies = [], isLoading: isLoadingAgencies } =
		useFetchItemsQuery({
			path: '/agencies',
			skip: !isAdmin,
		});

	useEffect(() => {
		setSelectedAgency(user?.agency?._id || '');
	}, []);

	const handleGenerateReport = async (format) => {
		if (!selectedAgency) {
			toast.error('Please select an agency first.');
			return;
		}

		setIsGenerating(true);
		setProgress(0);
		setSelectedFormat(format);

		let interval;

		try {
			// Start smooth progress animation
			interval = setInterval(() => {
				setProgress((prev) => (prev < 90 ? prev + 5 : prev));
			}, 300);

			// Call your API wrapper
			const { blob, contentType } = await generateReportApi({
				agency: selectedAgency,
				month,
				year,
				format,
			});

			clearInterval(interval);
			setProgress(100);

			// Build filename from agency name
			const agencyName =
				agencies?.doc?.find((a) => a._id === selectedAgency)?.name || 'report';

			const monthName = new Date(`${year}-${month}-01`).toLocaleString(
				'default',
				{
					month: 'long',
					year: 'numeric',
				}
			);

			console.log({ monthName });

			const fileName = `attendance-${monthName}-${agencyName}.${format}`;

			// Create and trigger download
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.success(`${format.toUpperCase()} download started!`);

			// Cleanup blob URL
			setTimeout(() => {
				URL.revokeObjectURL(url);
			}, 2000);
		} catch (error) {
			clearInterval(interval);
			console.error('Report generation error:', error);

			toast.error(
				error.message || `Failed to generate ${format.toUpperCase()} report.`
			);
		} finally {
			setIsGenerating(false);
			setSelectedFormat(null);
			setProgress(0);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='lg'
			closeOnOverlayClick={!isGenerating}
			isCentered
		>
			<ModalOverlay />
			<ModalContent
				as={motion.div}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				mx='4'
			>
				<ModalHeader>Export Attendance Report</ModalHeader>
				<ModalCloseButton isDisabled={isGenerating} />
				<ModalBody>
					{isAdmin && (
						<FormControl mb={2}>
							<FormLabel>Agency</FormLabel>
							<Select
								placeholder={
									isLoadingAgencies ? 'Loading agencies...' : 'Select agency'
								}
								value={selectedAgency}
								onChange={(e) => setSelectedAgency(e.target.value)}
								isDisabled={isLoadingAgencies || isGenerating}
							>
								{agencies?.doc?.map((agency) => (
									<option key={agency._id} value={agency._id}>
										{agency.name}
									</option>
								))}
							</Select>
						</FormControl>
					)}

					<AnimatePresence>
						{isGenerating && (
							<MotionProgress
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								mb={2}
								overflow='hidden'
							>
								<Text mb={2} textAlign='center'>
									{progress === 100
										? 'Finalizing download...'
										: `Generating report (${progress}%)`}
								</Text>
								<Box
									h='8px'
									bg='gray.100'
									borderRadius='full'
									overflow='hidden'
								>
									<MotionProgress
										h='100%'
										bg='blue.400'
										borderRadius='full'
										initial={{ width: 0 }}
										animate={{ width: `${progress}%` }}
										transition={{ type: 'spring', damping: 20 }}
									/>
								</Box>
							</MotionProgress>
						)}
					</AnimatePresence>
				</ModalBody>
				<ModalFooter>
					{!isGenerating && (
						<Flex
							justifyContent='space-between'
							alignItems='center'
							gap={2}
							w='100%'
							mb='4'
						>
							<Button
								{...buttonStyle}
								colorScheme='red'
								_active={{ bg: 'red.400' }}
								_hover={{ bg: 'red.400' }}
								mr={3}
								onClick={() => handleGenerateReport('pdf')}
								isLoading={isGenerating}
								py='4'
								px='8'
								w='full'
								size='md'
								loadingText='Generating PDF'
								leftIcon={<DownloadIcon />}
								isDisabled={!selectedAgency}
							>
								PDF
							</Button>
							<Button
								{...buttonStyle}
								colorScheme='green'
								_active={{ bg: 'green.400' }}
								_hover={{ bg: 'green.400' }}
								onClick={() => handleGenerateReport('csv')}
								isLoading={isGenerating}
								loadingText='Generating CSV'
								py='4'
								w='full'
								px='8'
								size='md'
								leftIcon={<DownloadIcon />}
								isDisabled={!selectedAgency}
							>
								CSV
							</Button>
						</Flex>
					)}
				</ModalFooter>
			</ModalContent>

			{/* Hidden download link */}
			{/* <a ref={downloadLinkRef} style={{ display: 'none' }} /> */}
		</Modal>
	);
};

const ExportAttendanceReport = ({ month, year }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<Button
				{...buttonStyle}
				onClick={onOpen}
				colorScheme='brand'
				leftIcon={<AiOutlineExport />}
				size='sm'
			>
				Export
			</Button>

			{isOpen && (
				<ExportAttendanceModal
					isOpen={isOpen}
					onClose={onClose}
					month={month}
					year={year}
				/>
			)}
		</>
	);
};

export default ExportAttendanceReport;
