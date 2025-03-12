import { useEffect, useMemo, useState } from 'react';
import { Box, Heading, Input, Icon, Flex, Button } from '@chakra-ui/react';
import { CiSearch } from 'react-icons/ci';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import EmployeesList from './EmployeesList';
import ErrorMessage from 'components/Message/ErrorMessage';
import TabButton from 'components/shared/TabButton';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CountUpComponent from 'components/countUpComponent/countUpComponent';

const tabData = [
	{ title: 'Admins', key: 'admins' },
	{ title: 'Managers', key: 'managers' },
	{ title: 'Agents', key: 'agents' },
	{ title: 'HR', key: 'hr' },
];

const Employees = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchTerm, setSearchTerm] = useState('');
	const currentTabKey = searchParams.get('tab') || 'admins';
	const initialTabIndex = tabData.findIndex((tab) => tab.key === currentTabKey);
	const [activeTab, setActiveTab] = useState(
		initialTabIndex !== -1 ? initialTabIndex : 0
	);
	const [activeAgency, setActiveAgency] = useState(0);
	const [queryParams, setQueryParams] = useState(null);

	const navigate = useNavigate();
	const { data: agencies, isLoading: agenciesLoading } = useFetchItemsQuery({
		path: '/agencies',
	});

	useEffect(() => {
		if (agencies?.doc?.length && !activeAgency) {
			const firstAgency = agencies.doc[0];
			setActiveAgency(firstAgency.name);
			setQueryParams({ agency: firstAgency.name });

			setSearchParams((prev) => {
				const newParams = new URLSearchParams(prev);
				newParams.set('agency', firstAgency.name);
				return newParams;
			});

			console.log('render ');
		}
	}, [agencies]);

	const { data, isLoading } = useFetchItemsQuery(
		{
			path: `/v2/user/employees`,
			params: queryParams,
		},
		{
			skip: !queryParams,
			refetchOnMountOrArgChange: true,
		}
	);

	const employees = useMemo(
		() => data?.doc?.[tabData[activeTab]?.key] || [],
		[data, activeTab]
	);
	const allUsers = useMemo(() => data?.doc?.all || [], [data]);

	const filteredEmployees = useMemo(() => {
		if (!searchTerm) return employees;

		return allUsers.filter(
			(user) =>
				user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [searchTerm, employees, allUsers]);

	// Handle tab change and update URL
	const handleAgencyChange = (agency) => {
		if (!agency) return;
		setActiveAgency(agency.name);
		setQueryParams({ agency: agency.name });
		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.set('agency', agency.name);
			return newParams;
		});
	};

	// Handle tab change and update URL
	const handleTabChange = (index) => {
		setActiveTab(index);
		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.set('tab', tabData[index].key);
			return newParams;
		});
	};

	return (
		<>
			<Button
				colorScheme='gray'
				borderRadius='5px'
				size={{ base: 'sm', md: 'md' }}
				px={{ base: 4, md: 6 }}
				py={{ base: 2, md: 3 }}
				fontSize={{ base: 'sm', md: 'md' }}
				leftIcon={<Icon as={IoArrowBack} boxSize={4} />}
				onClick={() => navigate('/attendance')}
				mb={4}
			>
				Back
			</Button>
			<Box minH='100vh' fontFamily="'DM Sans', sans-serif">
				{/* Agencies  */}
				<Flex gap='2' px='4' mb='4' width='fit-content'>
					{agencies?.doc?.map((agency) => (
						<TabButton
							key={agency._id}
							isActive={activeAgency === agency.name}
							onClick={() => handleAgencyChange(agency)}
						>
							{agency.name}
						</TabButton>
					))}
				</Flex>

				{/* Header */}
				<Box
					px={{ base: 4, md: 6, lg: 12 }}
					py={4}
					display='flex'
					bg='white'
					borderRadius='md'
					justifyContent='space-between'
					alignItems='center'
					mb={4}
				>
					<Heading fontSize='24px' fontWeight='600'>
						Employees
						{data && (
							<span style={{ marginLeft: '6px' }}>
								({<CountUpComponent targetNumber={data?.totalUsers || 0} />})
							</span>
						)}
					</Heading>

					{/* Search Bar */}
					<Box display='flex' alignItems='center'>
						<Box h='30px' w='1px' bg='#E3E3E3' mr={3} />
						<Box
							display='flex'
							alignItems='center'
							bg='#F6F6F6'
							w={{ base: '100%', sm: '287px' }}
							h='36px'
							px={3}
							borderRadius='md'
							border='1px solid #E2E8F0'
						>
							<Icon as={CiSearch} color='gray.500' mr={2} />
							<Input
								variant='unstyled'
								placeholder='Quick Search...'
								w='100%'
								fontSize='14px'
								fontWeight='400'
								color='gray.700'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</Box>
					</Box>
				</Box>

				{/* Tab Navigation */}
				<Flex gap='2' px='4' width='fit-content'>
					{tabData.map((tab, index) => (
						<TabButton
							key={index}
							isActive={activeTab === index}
							onClick={() => handleTabChange(index)}
						>
							{tab.title}
						</TabButton>
					))}
				</Flex>

				{/* Employees List */}
				<Box
					mt='4'
					p='4'
					bg='white'
					shadow='sm'
					rounded='md'
					minH='100px'
					transition='opacity 0.3s ease, transform 0.3s ease'
					opacity={1}
					transform='translateY(0px)'
					key={activeTab}
				>
					{isLoading || agenciesLoading ? (
						<Box h='80vh'>
							<Loader />
						</Box>
					) : data && data?.doc ? (
						<EmployeesList
							employees={filteredEmployees || []}
							tab={tabData[activeTab].key}
						/>
					) : (
						<ErrorMessage message='Something went wrong on the server side.' />
					)}
				</Box>
			</Box>
		</>
	);
};

export default Employees;
