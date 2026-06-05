// import React, { useState, useEffect } from 'react';
// import {
// 	Button,
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalCloseButton,
// 	ModalBody,
// 	ModalFooter,
// 	FormControl,
// 	FormLabel,
// 	VStack,
// 	Box,
// 	Text,
// 	useDisclosure,
// 	Flex,
// 	Input,
// 	Select,
// 	FormHelperText,
// 	Icon,
// } from '@chakra-ui/react';
// import { DownloadIcon, ViewIcon } from '@chakra-ui/icons';
// import { motion } from 'framer-motion';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { toast } from 'react-toastify';
// import { AiOutlineExport } from 'react-icons/ai';
// import { generatePayrollReportApi } from 'api';
// import useUserSession from 'hooks/useUserSession';
// import { buttonStyle } from 'utils/btn';
// import DateFilter from 'views/admin/attendance/components/DateFilter';
// import { useFetchItemsQuery } from 'api/apiSlice';
// import { hasPermission } from 'utils';
// import { usePermissions } from 'hooks/usePermissions';
// import { useSearchParams } from 'react-router-dom';

// const MotionBox = motion(Box);

// // type 1: Salaried users
// // type 2: commision based users

// function resolveAgency(selectedAgency, user, allAgenciesEnabled) {
// 	if (selectedAgency && selectedAgency !== 'All') return selectedAgency;
// 	if (!allAgenciesEnabled) return user?.agency?._id;
// 	return null;
// }

// const ExportPayrollReport = ({ type = 1 }) => {
// 	const { isOpen, onOpen, onClose } = useDisclosure();

// 	const now = new Date();

// 	const defaultMonth = now.getMonth() + 1;
// 	const defaultYear = now.getFullYear();

// 	const [searchParams] = useSearchParams();

// 	const selectedMonth = Number(searchParams.get('month')) || defaultMonth;
// 	const selectedYear = Number(searchParams.get('year')) || defaultYear;

// 	const [month, setMonth] = useState(selectedMonth);
// 	const [year, setYear] = useState(selectedYear);
// 	const [selectedAgency, setSelectedAgency] = useState('');

// 	useEffect(() => {
// 		setMonth(selectedMonth);
// 		setYear(selectedYear);
// 	}, [selectedMonth, selectedYear]);

// 	return (
// 		<>
// 			<Button
// 				{...buttonStyle}
// 				leftIcon={<AiOutlineExport />}
// 				size='sm'
// 				colorScheme='brand'
// 				onClick={onOpen}
// 			>
// 				Export Payroll
// 			</Button>

// 			<ExportPayrollModal
// 				isOpen={isOpen}
// 				onClose={onClose}
// 				type={type}
// 				month={month}
// 				setMonth={setMonth}
// 				year={year}
// 				setYear={setYear}
// 				selectedAgency={selectedAgency}
// 				setSelectedAgency={setSelectedAgency}
// 			/>
// 		</>
// 	);
// };

// const ExportPayrollModal = ({
// 	isOpen,
// 	onClose,
// 	type,
// 	month,
// 	setMonth,
// 	year,
// 	setYear,
// 	selectedAgency,
// 	setSelectedAgency,
// }) => {
// 	const { user } = useUserSession();
// 	const { hasPermission } = usePermissions();

// 	const allAgenciesEnabled = hasPermission('payroll', 'all_agencies');

// 	const [progress, setProgress] = useState(0);
// 	const [isGenerating, setIsGenerating] = useState(false);

// 	// const [month, setMonth] = useState(() => new Date().getMonth() + 1);
// 	// const [year, setYear] = useState(() => new Date().getFullYear());
// 	// const [selectedAgency, setSelectedAgency] = useState('');

// 	const { data: agencies = [], isLoading: loadingAgencies } =
// 		useFetchItemsQuery({
// 			path: '/agencies',
// 			skip: !allAgenciesEnabled,
// 		});

// 	const monthFilterHandler = (value) => {
// 		const newMonth = Number(value.month);
// 		const newYear = Number(value.year);

// 		setMonth(newMonth);
// 		setYear(newYear);
// 	};

// 	const resetForm = () => {
// 		setMonth(new Date().getMonth() + 1);
// 		setYear(new Date().getFullYear());
// 		setSelectedAgency('');
// 	};

// 	const handleExport = async () => {
// 		let interval;

// 		try {
// 			setIsGenerating(true);
// 			setProgress(0);

// 			interval = setInterval(() => {
// 				setProgress((prev) => (prev < 90 ? prev + 5 : prev));
// 			}, 250);

// 			const agency = resolveAgency(selectedAgency, user, allAgenciesEnabled);

// 			const payload = {
// 				month,
// 				year,
// 				type,
// 				...(agency && { agency }),
// 			};

// 			const { blob } = await generatePayrollReportApi(payload);

// 			clearInterval(interval);
// 			setProgress(100);

// 			const monthName = new Date(year, month - 1).toLocaleString('default', {
// 				month: 'long',
// 			});

// 			const agencyName =
// 				selectedAgency === 'All'
// 					? 'All Agencies'
// 					: agencies?.doc?.find((a) => a._id === selectedAgency)?.name ||
// 						user?.agency?.name;

// 			const fileName = `${agencyName} Payroll - ${monthName} ${year}.csv`;

// 			const url = URL.createObjectURL(blob);

// 			const link = document.createElement('a');
// 			link.href = url;
// 			link.download = fileName;

// 			document.body.appendChild(link);
// 			link.click();
// 			document.body.removeChild(link);

// 			setTimeout(() => URL.revokeObjectURL(url), 2000);

// 			toast.success('Payroll CSV downloaded');
// 			resetForm();
// 			onClose();
// 		} catch (error) {
// 			console.error(error);
// 			toast.error('Failed to export payroll');
// 		} finally {
// 			clearInterval(interval);
// 			setIsGenerating(false);
// 			setProgress(0);
// 		}
// 	};

// 	return (
// 		<Modal
// 			isOpen={isOpen}
// 			onClose={onClose}
// 			isCentered
// 			size='md'
// 			motionPreset='slideInBottom'
// 		>
// 			<ModalOverlay backdropFilter='blur(8px)' bg='blackAlpha.300' />

// 			<ModalContent borderRadius='2xl' boxShadow='2xl' overflow='hidden'>
// 				{/* Header with gradient */}
// 				<Box bg='green.50' px={6} py={4}>
// 					<ModalHeader p={0} fontSize='xl' fontWeight='600'>
// 						Export Payroll
// 					</ModalHeader>
// 					<ModalCloseButton
// 						isDisabled={isGenerating}
// 						top={4}
// 						right={4}
// 						color='gray.500'
// 						_hover={{ bg: 'whiteAlpha.400' }}
// 					/>
// 					<Text fontSize='sm' color='gray.600' mt={1}>
// 						Download payroll data as CSV file
// 					</Text>
// 				</Box>

// 				<ModalBody pt={6} pb={8}>
// 					<VStack spacing={6}>
// 						{/* Month Selection Card */}
// 						<Box
// 							w='100%'
// 							p={4}
// 							bg='gray.50'
// 							borderRadius='lg'
// 							borderWidth='1px'
// 							borderColor='gray.100'
// 						>
// 							<FormControl>
// 								<FormLabel
// 									fontSize='xs'
// 									fontWeight='600'
// 									color='gray.500'
// 									textTransform='uppercase'
// 									letterSpacing='wide'
// 								>
// 									Payroll Month
// 								</FormLabel>
// 								<DateFilter onFilterChange={monthFilterHandler} />
// 								<FormHelperText fontSize='xs' color='gray.500'>
// 									Select the month for which you want to export payroll
// 								</FormHelperText>
// 							</FormControl>
// 						</Box>

// 						{/* Agency Selection - Only if enabled */}
// 						{allAgenciesEnabled && (
// 							<Box w='100%'>
// 								<FormControl>
// 									<FormLabel
// 										fontSize='xs'
// 										fontWeight='600'
// 										color='gray.500'
// 										textTransform='uppercase'
// 										letterSpacing='wide'
// 									>
// 										Agency
// 									</FormLabel>
// 									<Select
// 										value={selectedAgency}
// 										onChange={(e) => setSelectedAgency(e.target.value)}
// 										placeholder={
// 											loadingAgencies ? 'Loading agencies...' : 'Select Agency'
// 										}
// 										bg='white'
// 										borderColor='gray.200'
// 										_hover={{ borderColor: 'green.300' }}
// 										_focus={{
// 											borderColor: 'green.500',
// 											boxShadow: '0 0 0 1px #48BB78',
// 										}}
// 										isDisabled={loadingAgencies}
// 									>
// 										<option value={'All'}>All Agencies</option>
// 										{agencies?.doc?.map((agency) => (
// 											<option key={agency._id} value={agency._id}>
// 												{agency.name}
// 											</option>
// 										))}
// 									</Select>
// 								</FormControl>
// 							</Box>
// 						)}

// 						{/* Progress Indicator - Enhanced */}
// 						{isGenerating && (
// 							<MotionBox
// 								w='100%'
// 								initial={{ opacity: 0, y: 10 }}
// 								animate={{ opacity: 1, y: 0 }}
// 								transition={{ duration: 0.3 }}
// 							>
// 								<Flex justify='space-between' mb={1}>
// 									<Text fontSize='sm' fontWeight='500' color='gray.600'>
// 										Generating Payroll
// 									</Text>
// 									<Text fontSize='sm' fontWeight='600' color='green.600'>
// 										{progress}%
// 									</Text>
// 								</Flex>

// 								<Box
// 									h='10px'
// 									bg='gray.100'
// 									borderRadius='full'
// 									overflow='hidden'
// 									position='relative'
// 								>
// 									<MotionBox
// 										h='100%'
// 										bg='green.400'
// 										initial={{ width: 0 }}
// 										animate={{ width: `${progress}%` }}
// 										transition={{ duration: 0.3 }}
// 										borderRadius='full'
// 										position='relative'
// 									>
// 										{/* Shimmer effect */}
// 										<Box
// 											position='absolute'
// 											top={0}
// 											left={0}
// 											right={0}
// 											bottom={0}
// 											bg='whiteAlpha.300'
// 											sx={{
// 												animation: 'shimmer 2s infinite',
// 											}}
// 										/>
// 									</MotionBox>
// 								</Box>

// 								<Text fontSize='xs' color='gray.500' mt={2} textAlign='center'>
// 									Please don't close this modal while generating...
// 								</Text>
// 							</MotionBox>
// 						)}
// 					</VStack>
// 				</ModalBody>

// 				<ModalFooter pt={0} pb={6} px={6}>
// 					<Flex w='100%' direction='column' gap={3}>
// 						{/* CSV Import Hint - New addition */}
// 						<Box
// 							p={3}
// 							bg='gray.50'
// 							borderRadius='lg'
// 							borderWidth='1px'
// 							borderColor='gray.200'
// 							borderStyle='dashed'
// 						>
// 							<Flex align='center'>
// 								<Icon as={ViewIcon} color='gray.500' boxSize={4} mr={2} />
// 								<Text fontSize='xs' color='gray.600'>
// 									<strong>Pro tip:</strong> The exported CSV can be imported
// 									into Excel, Google Sheets, or any spreadsheet software. Make
// 									sure to save it with UTF-8 encoding for special characters.
// 								</Text>
// 							</Flex>
// 						</Box>

// 						{/* Action Buttons */}
// 						<Flex gap={3}>
// 							<Button
// 								flex={1}
// 								variant='outline'
// 								onClick={onClose}
// 								isDisabled={isGenerating}
// 								borderColor='gray.200'
// 								_hover={{ bg: 'gray.50' }}
// 							>
// 								Cancel
// 							</Button>
// 							<Button
// 								flex={1}
// 								colorScheme='green'
// 								leftIcon={<DownloadIcon />}
// 								onClick={handleExport}
// 								isLoading={isGenerating}
// 								loadingText='Exporting'
// 								boxShadow='md'
// 								_hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
// 								transition='all 0.2s'
// 								isDisabled={!selectedAgency && allAgenciesEnabled} // Add month validation
// 							>
// 								Download CSV
// 							</Button>
// 						</Flex>
// 					</Flex>
// 				</ModalFooter>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

// export default ExportPayrollReport;

// {
// 	/* Add this to your global styles or component */
// }
// <style jsx>{`
// 	@keyframes shimmer {
// 		0% {
// 			transform: translateX(-100%);
// 		}
// 		100% {
// 			transform: translateX(100%);
// 		}
// 	}
// `}</style>;


import React, { useState, useEffect } from 'react';
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
	VStack,
	Box,
	Text,
	useDisclosure,
	Flex,
	Input,
	Select,
	FormHelperText,
	Icon,
} from '@chakra-ui/react';
import { DownloadIcon, ViewIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { AiOutlineExport } from 'react-icons/ai';
import { generatePayrollReportApi } from 'api';
import useUserSession from 'hooks/useUserSession';
import DateFilter from 'views/admin/attendance/components/DateFilter';
import { useFetchItemsQuery } from 'api/apiSlice';
import { usePermissions } from 'hooks/usePermissions';
import { useSearchParams } from 'react-router-dom';
import { useModalColors } from 'hooks/useModalColors';

const MotionBox = motion(Box);

function resolveAgency(selectedAgency, user, allAgenciesEnabled) {
	if (selectedAgency && selectedAgency !== 'All') return selectedAgency;
	if (!allAgenciesEnabled) return user?.agency?._id;
	return null;
}

const ExportPayrollReport = ({ type = 1 }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const colors = useModalColors();

	const now = new Date();
	const defaultMonth = now.getMonth() + 1;
	const defaultYear = now.getFullYear();

	const [searchParams] = useSearchParams();
	const selectedMonth = Number(searchParams.get('month')) || defaultMonth;
	const selectedYear = Number(searchParams.get('year')) || defaultYear;

	const [month, setMonth] = useState(selectedMonth);
	const [year, setYear] = useState(selectedYear);
	const [selectedAgency, setSelectedAgency] = useState('');

	useEffect(() => {
		setMonth(selectedMonth);
		setYear(selectedYear);
	}, [selectedMonth, selectedYear]);

	return (
		<>
			<Button
				leftIcon={<AiOutlineExport />}
				size='sm'
				variant='brand'
				onClick={onOpen}
			>
				Export Payroll
			</Button>

			<ExportPayrollModal
				isOpen={isOpen}
				onClose={onClose}
				type={type}
				month={month}
				setMonth={setMonth}
				year={year}
				setYear={setYear}
				selectedAgency={selectedAgency}
				setSelectedAgency={setSelectedAgency}
			/>
		</>
	);
};

const ExportPayrollModal = ({
	isOpen,
	onClose,
	type,
	month,
	setMonth,
	year,
	setYear,
	selectedAgency,
	setSelectedAgency,
}) => {
	const colors = useModalColors();
	const { user } = useUserSession();
	const { hasPermission } = usePermissions();

	const allAgenciesEnabled = hasPermission('payroll', 'all_agencies');

	const [progress, setProgress] = useState(0);
	const [isGenerating, setIsGenerating] = useState(false);

	const { data: agencies = [], isLoading: loadingAgencies } =
		useFetchItemsQuery({
			path: '/agencies',
			skip: !allAgenciesEnabled,
		});

	const monthFilterHandler = (value) => {
		const newMonth = Number(value.month);
		const newYear = Number(value.year);
		setMonth(newMonth);
		setYear(newYear);
	};

	const resetForm = () => {
		setMonth(new Date().getMonth() + 1);
		setYear(new Date().getFullYear());
		setSelectedAgency('');
	};

	const handleExport = async () => {
		let interval;

		try {
			setIsGenerating(true);
			setProgress(0);

			interval = setInterval(() => {
				setProgress((prev) => (prev < 90 ? prev + 5 : prev));
			}, 250);

			const agency = resolveAgency(selectedAgency, user, allAgenciesEnabled);

			const payload = {
				month,
				year,
				type,
				...(agency && { agency }),
			};

			const { blob } = await generatePayrollReportApi(payload);

			clearInterval(interval);
			setProgress(100);

			const monthName = new Date(year, month - 1).toLocaleString('default', {
				month: 'long',
			});

			const agencyName =
				selectedAgency === 'All'
					? 'All Agencies'
					: agencies?.doc?.find((a) => a._id === selectedAgency)?.name ||
						user?.agency?.name;

			const fileName = `${agencyName} Payroll - ${monthName} ${year}.csv`;

			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			setTimeout(() => URL.revokeObjectURL(url), 2000);

			toast.success('Payroll CSV downloaded');
			resetForm();
			onClose();
		} catch (error) {
			console.error(error);
			toast.error('Failed to export payroll');
		} finally {
			clearInterval(interval);
			setIsGenerating(false);
			setProgress(0);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			size='md'
			motionPreset='slideInBottom'
		>
			<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />

			<ModalContent
				borderRadius='2xl'
				boxShadow={colors.modalShadow}
				overflow='hidden'
				bg={colors.bg}
				border='1px solid'
				borderColor={colors.borderColor}
			>
				{/* Header */}
				<Box bg={colors.headerBg} px={6} py={4}>
					<ModalHeader bg={colors.headerBg} p={0} fontSize='xl' fontWeight='600' color={colors.headerText}>
						Export Payroll
					</ModalHeader>
					<ModalCloseButton
						isDisabled={isGenerating}
						top={4}
						right={4}
						color={colors.headerText}
						_hover={{ bg: colors.closeBtnHoverBg }}
					/>
					<Text fontSize='sm' color={colors.headerText} mt={1}>
						Download payroll data as CSV file
					</Text>
				</Box>

				<ModalBody pt={6} pb={8}>
					<VStack spacing={6}>
						{/* Month Selection Card */}
						<Box
							w='100%'
							p={4}
							bg={colors.bgInput}
							borderRadius='lg'
							borderWidth='1px'
							borderColor={colors.borderColor}
						>
							<FormControl>
								<FormLabel
									fontSize='xs'
									fontWeight='600'
									color={colors.labelColor}
									textTransform='uppercase'
									letterSpacing='wide'
								>
									Payroll Month
								</FormLabel>
								<DateFilter onFilterChange={monthFilterHandler} />
								<FormHelperText fontSize='xs' color={colors.mutedText}>
									Select the month for which you want to export payroll
								</FormHelperText>
							</FormControl>
						</Box>

						{/* Agency Selection - Only if enabled */}
						{allAgenciesEnabled && (
							<Box w='100%'>
								<FormControl>
									<FormLabel
										fontSize='xs'
										fontWeight='600'
										color={colors.labelColor}
										textTransform='uppercase'
										letterSpacing='wide'
									>
										Agency
									</FormLabel>
									<Select
										value={selectedAgency}
										onChange={(e) => setSelectedAgency(e.target.value)}
										placeholder={loadingAgencies ? 'Loading agencies...' : 'Select Agency'}
										bg={colors.bgInput}
										borderColor={colors.borderColor}
										color={colors.headingText}
										_hover={{ borderColor: colors.accentGold }}
										_focus={{
											borderColor: colors.accentGold,
											boxShadow: `0 0 0 1px ${colors.accentGold}`,
										}}
										isDisabled={loadingAgencies}
									>
										<option value={'All'} style={{ background: colors.bg, color: colors.headingText }}>
											All Agencies
										</option>
										{agencies?.doc?.map((agency) => (
											<option key={agency._id} value={agency._id} style={{ background: colors.bg, color: colors.headingText }}>
												{agency.name}
											</option>
										))}
									</Select>
								</FormControl>
							</Box>
						)}

						{/* Progress Indicator */}
						{isGenerating && (
							<MotionBox
								w='100%'
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
							>
								<Flex justify='space-between' mb={1}>
									<Text fontSize='sm' fontWeight='500' color={colors.bodyText}>
										Generating Payroll
									</Text>
									<Text fontSize='sm' fontWeight='600' color={colors.accentGold}>
										{progress}%
									</Text>
								</Flex>

								<Box
									h='10px'
									bg={colors.borderColor}
									borderRadius='full'
									overflow='hidden'
									position='relative'
								>
									<MotionBox
										h='100%'
										bg={colors.accentGold}
										initial={{ width: 0 }}
										animate={{ width: `${progress}%` }}
										transition={{ duration: 0.3 }}
										borderRadius='full'
										position='relative'
									/>
								</Box>

								<Text fontSize='xs' color={colors.mutedText} mt={2} textAlign='center'>
									Please don't close this modal while generating...
								</Text>
							</MotionBox>
						)}
					</VStack>
				</ModalBody>

				<ModalFooter pt={0} pb={6}  px={6}>
					<Flex mt={3} w='100%' direction='column' gap={3}>
						{/* CSV Import Hint */}
						<Box
							p={3}
							bg={colors.bgInput}
							borderRadius='lg'
							borderWidth='1px'
							borderColor={colors.borderColor}
							borderStyle='dashed'
						>
							<Flex align='center'>
								<Icon as={ViewIcon} color={colors.mutedText} boxSize={4} mr={2} />
								<Text fontSize='xs' color={colors.bodyText}>
									<strong>Pro tip:</strong> The exported CSV can be imported
									into Excel, Google Sheets, or any spreadsheet software.
								</Text>
							</Flex>
						</Box>

						{/* Action Buttons */}
						<Flex gap={3}>
							<Button
								flex={1}
								variant='outline'
								onClick={onClose}
								isDisabled={isGenerating}
							>
								Cancel
							</Button>
							<Button
								flex={1}
								variant='brand'
								leftIcon={<DownloadIcon />}
								onClick={handleExport}
								isLoading={isGenerating}
								loadingText='Exporting'
								isDisabled={!selectedAgency && allAgenciesEnabled}
							>
								Download CSV
							</Button>
						</Flex>
					</Flex>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ExportPayrollReport;