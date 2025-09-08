'use client';
import { useState, useEffect } from 'react';
import {
	Box,
	Flex,
	Text,
	VStack,
	HStack,
	Divider,
	Spacer,
	IconButton,
	Button,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Select,
} from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import moment from 'moment';

import IncomingTable from './Component/IncomingTable';
import OutgoingTable from './Component/OutgoingTable';
import TabNavigationDisplay from 'components/TabNavigationDisplay/TabNavigationDisplay';
import { useFetchItemsQuery } from 'api/apiSlice';
import { usePermissions } from 'hooks/usePermissions';

const DEFAULT_TAB = 'incoming-cash';

const Expenses = () => {
	const user = JSON.parse(localStorage.getItem('user')) || {};

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [searchParams, setSearchParams] = useSearchParams();

	const tabFromParams = searchParams.get('tab') || DEFAULT_TAB;
	const monthFromParams = searchParams.get('month') || moment().format('M');
	const yearFromParams = searchParams.get('year') || moment().format('YYYY');

	const [tempMonth, setTempMonth] = useState(monthFromParams);
	const [tempYear, setTempYear] = useState(yearFromParams);
	const [tabKey, setTabKey] = useState(0);

	const navigate = useNavigate();
	const { hasPermission } = usePermissions();

	useEffect(() => {
		if (!hasPermission('expense')) return navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	const { data: SummaryData, refetch } = useFetchItemsQuery(
		{
			path: `/expenses/summary`,
			params: { month: monthFromParams, year: yearFromParams },
		},
		{ refetchOnMountOrArgChange: true, skip: !user._id }
	);

	const tabsData = [
		{
			label: 'Incoming Cash',
			param: 'incoming-cash',
			component: (
				<IncomingTable
					key={tabKey}
					month={monthFromParams}
					year={yearFromParams}
					refetchSummary={refetch}
				/>
			),
		},
		{
			label: 'Outgoing Cash',
			param: 'outgoing-cash',
			component: (
				<OutgoingTable
					key={tabKey}
					month={monthFromParams}
					year={yearFromParams}
					refetchSummary={refetch}
				/>
			),
		},
	];

	const activeTabIndex = Math.max(
		0,
		tabsData.findIndex((tab) => tab.param === tabFromParams.toLowerCase())
	);

	useEffect(() => {
		const params = {
			tab: tabFromParams,
			month: monthFromParams,
			year: yearFromParams,
		};

		if (
			!searchParams.get('tab') ||
			!searchParams.get('month') ||
			!searchParams.get('year')
		) {
			setSearchParams(params);
		}
	}, [
		searchParams,
		setSearchParams,
		tabFromParams,
		monthFromParams,
		yearFromParams,
	]);

	const handleTabChange = (index) => {
		const tabParam = tabsData[index].param;
		const params = {
			tab: tabParam,
			month: monthFromParams,
			year: yearFromParams,
		};
		setSearchParams(params);

		if (index === activeTabIndex) {
			setTabKey((prev) => prev + 1);
		}
	};

	const getMonthName = (monthNumber) => {
		return moment()
			.month(monthNumber - 1)
			.format('MMMM');
	};

	const handleDateFilter = () => {
		const params = {
			tab: tabFromParams,
			month: tempMonth,
			year: tempYear,
		};
		setSearchParams(params);
		onClose();
		refetch();
	};

	const handleOpenModal = () => {
		setTempMonth(monthFromParams);
		setTempYear(yearFromParams);
		onOpen();
	};

	return (
		<Box>
			<Flex justifyContent='flex-end' mr={4}>
				<Box
					display='flex'
					alignItems='center'
					gap={1}
					px={2}
					py={1}
					borderRadius='10px'
					border='1px solid #D5D9DD'
					cursor='pointer'
					onClick={handleOpenModal}
				>
					<IconButton
						icon={<CalendarIcon />}
						aria-label='Open date filter'
						color='lightgray'
						bg='transparent'
						_hover={{ bg: 'transparent' }}
						_focus={{ bg: 'transparent' }}
						size='sm'
					/>
					<Text color='lightgray'>
						{getMonthName(monthFromParams)} {yearFromParams}
					</Text>
				</Box>
			</Flex>

			<Box mt={-4}>
				<TabNavigationDisplay
					tabsData={tabsData.map((tab) => ({
						...tab,
						component:
							tab.param === tabFromParams.toLowerCase() ? tab.component : null,
					}))}
					activeTab={activeTabIndex}
					onTabChange={handleTabChange}
				/>
			</Box>

			<Flex justifyContent='end' mx={4}>
				<Box p={1} borderRadius='md' w='600px' maxWidth='650px' bg='white'>
					<VStack align='center' p={2} fontSize='23px'>
						<HStack w='100%'>
							<Text color='green.500' fontWeight='bold'>
								Incoming Cash
							</Text>
							<Spacer />
							<Text color='green.500'>
								{SummaryData?.data?.totalIncomingAmount || 0}
							</Text>
						</HStack>
						<Divider />
						<HStack w='100%'>
							<Text color='red.500' fontWeight='bold'>
								Outgoing Cash
							</Text>
							<Spacer />
							<Text color='red.500'>
								{SummaryData?.data?.totalOutgoingAmount || 0}
							</Text>
						</HStack>
						<Divider />
						<HStack w='100%'>
							<Text fontWeight='bold'>Total Profit</Text>
							<Spacer />
							<Text fontWeight='bold'>
								{SummaryData?.data?.totalProfit || 0}
							</Text>
						</HStack>
					</VStack>
				</Box>
			</Flex>

			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Select Month and Year</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<VStack spacing={4}>
							<Select
								placeholder='Select Month'
								value={tempMonth}
								onChange={(e) => setTempMonth(e.target.value)}
								focusBorderColor='goldenrod'
							>
								{Array.from({ length: 12 }, (_, i) => (
									<option key={i + 1} value={i + 1}>
										{moment().month(i).format('MMMM')}
									</option>
								))}
							</Select>

							<Select
								placeholder='Select Year'
								value={tempYear}
								onChange={(e) => setTempYear(e.target.value)}
								focusBorderColor='goldenrod'
							>
								{Array.from({ length: 10 }, (_, i) => {
									const year = moment().year() - i;
									return (
										<option key={year} value={year}>
											{year}
										</option>
									);
								})}
							</Select>

							<Button
								bg='goldenrod'
								color='white'
								w='100%'
								_hover={{ bg: 'goldenrod', opacity: 0.9 }}
								onClick={handleDateFilter}
							>
								Apply
							</Button>
						</VStack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default Expenses;
