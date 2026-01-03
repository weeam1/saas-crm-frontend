import { useState } from 'react';
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Box,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { generateEmployeeAttendanceReport } from 'api';
import { buttonStyle } from 'utils/btn';
import { AiOutlineExport } from 'react-icons/ai';
import DateFilter from '../DateFilter';
import { useModalColors } from 'hooks/useModalColors';

const MotionProgress = motion(Box);

const ExportAttendanceModal = ({ isOpen, onClose, employee }) => {
	const [progress, setProgress] = useState(0);
	const [isGenerating, setIsGenerating] = useState(false);

	const { headerBg, headerText } = useModalColors();

	const [month, setMonth] = useState(() => new Date().getMonth() + 1);
	const [year, setYear] = useState(() => new Date().getFullYear());

	const monthFilterHandler = (value) => {
		const newMonth = Number(value.month);
		const newYear = Number(value.year);

		setMonth(newMonth);
		setYear(newYear);
	};

	const handleGenerateReport = async (format) => {
		setIsGenerating(true);
		setProgress(0);

		let interval;

		try {
			// Start smooth progress animation
			interval = setInterval(() => {
				setProgress((prev) => (prev < 90 ? prev + 5 : prev));
			}, 300);

			const payload = { employeeId: employee?._id, format, month, year };

			const { blob, contentType } =
				await generateEmployeeAttendanceReport(payload);

			clearInterval(interval);
			setProgress(100);

			const fileLabel = new Date(`${year}-${month}-01`).toLocaleString(
				'default',
				{
					month: 'long',
					year: 'numeric',
				}
			);

			const fileName = `${employee?.fullName}-attendance-${fileLabel}-report.${format}`;

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
			setProgress(0);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='md'
			closeOnOverlayClick={!isGenerating}
			isCentered
		>
			<ModalOverlay backdropFilter='blur(2px)' />
			<ModalContent
				as={motion.div}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				mx='4'
				borderRadius='xl'
				boxShadow='xl'
			>
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
					Export Employee Report
				</ModalHeader>
				<ModalCloseButton isDisabled={isGenerating} />
				<ModalBody>
					<VStack mb='2'>
						<Text color='gray.600'>Select Month</Text>
						<DateFilter onFilterChange={monthFilterHandler} />
					</VStack>

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
						<VStack
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
							>
								CSV
							</Button>
						</VStack>
					)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

const ExportEmployeeAttendanceReport = ({ employee, month, year }) => {
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
					employee={employee}
				/>
			)}
		</>
	);
};

export default ExportEmployeeAttendanceReport;
