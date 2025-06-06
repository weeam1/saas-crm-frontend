import { useState } from 'react';
import TopHeader from './Component/TopHeader';
import FilterSearch from './Component/FilterSearch';
import { Box, Divider, Flex, Grid } from '@chakra-ui/react';
import NavigationLinks from './Component/NavigationLinks';
import SurveyCard from './Component/SurveyCard';
import SurveyCardLoading from './Loader/SurveyCardLoading';
import { useFetchItemsQuery } from 'api/apiSlice';
const Survey = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(12);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [closesAt, setClosesAt] = useState(false);
	const [search, setSearch] = useState('');

	const buildQueryParams = () => {
		const user = JSON.parse(localStorage.getItem('user'));
		const role =
			user?.role === 'superAdmin'
				? 'superAdmin'
				: (user?.roles?.[0]?.roleName ?? 'unknown');

		const params = {
			page: currentPage,
			limit: pageSize,
		};

		if (role !== 'superAdmin') params.closesAt = closesAt;
		if (search) params.search = search;
		if (startDate) params.after = startDate;
		if (endDate) params.before = endDate;
		return params;
	};

	const {
		data: surveys,
		isLoading,
		isFetching,
		refetch,
	} = useFetchItemsQuery(
		{ path: '/surveys', params: buildQueryParams() },
		{ refetchOnMountOrArgChange: true }
	);
	return (
		<>
			<TopHeader />
			<FilterSearch
				currentPage={currentPage}
				totalPages={surveys?.totalPages || 1}
				onPageChange={setCurrentPage}
				totalItems={surveys?.totalDocs || 0}
				pageSize={pageSize}
				setPageSize={setPageSize}
				handlePageSizeChange={(size) => {
					setPageSize(size);
					setCurrentPage(1);
				}}
				isLoading={isLoading || isFetching}
				startDate={startDate}
				endDate={endDate}
				setStartDate={setStartDate}
				setEndDate={setEndDate}
			/>

			<Box width='100%' my={4}>
				<Divider borderColor='gray.200' borderWidth='1px' opacity={1} />
			</Box>
			<NavigationLinks />

			<Grid
				// display='grid'
				sx={{
					// >= 0px
					'@media (min-width: 0px)': {
						gridTemplateColumns: '1fr',
					},
					// // >= 812px
					// '@media (min-width: 812px)': {
					// 	gridTemplateColumns: '1fr',
					// },
					// >= 992px
					'@media (min-width: 600px)': {
						gridTemplateColumns: 'repeat(2, 1fr)',
					},
					// >= 1280px
					'@media (min-width: 1040px)': {
						gridTemplateColumns: 'repeat(3, 1fr)',
					},
					// >= 1664px
					'@media (min-width: 1564px)': {
						gridTemplateColumns: 'repeat(4, 1fr)',
					},
					// >= 1920px (e.g., Full HD+)
					'@media (min-width: 2120px)': {
						gridTemplateColumns: 'repeat(5, 1fr)',
					},
					// >= 2560px (2.5K / QHD)
					'@media (min-width: 2560px)': {
						gridTemplateColumns: 'repeat(6, 1fr)',
					},
					// >= 3840px (4K)
					'@media (min-width: 3840px)': {
						gridTemplateColumns: 'repeat(7, 1fr)',
					},
					// >= 7680px (8K)
					'@media (min-width: 7680px)': {
						gridTemplateColumns: 'repeat(8, 1fr)',
					},
				}}
				// gridTemplateColumns={{
				// 	base: 'repeat(1, minmax(240px, 1fr))',
				// 	sm: 'repeat(2, minmax(240px, 1fr))',
				// 	md: 'repeat(3, minmax(240px, 1fr))',
				// 	lg: 'repeat(4, minmax(240px, 1fr))',
				// }}
				gap={2}
				marginTop={{ base: 4, md: 6 }}
				// mx='2'
				p='4'
				width='100%'
				// maxWidth="1400px"
				justifyItems='center'
			>
				{isLoading || isFetching
					? Array.from({ length: 6 }).map((_, idx) => (
							<Box key={idx} minWidth='240px' width='100%' mb={4}>
								<SurveyCardLoading />
							</Box>
						))
					: surveys?.doc?.surveys.length > 0 &&
						surveys?.doc?.surveys.map((survey) => (
							<Box key={survey._id} minWidth='240px' width='100%' mb={4}>
								<SurveyCard
									isActive={survey.status === 'active'}
									data={{
										id: survey._id,
										name: survey.title,
										taken: `${survey.submittedUsers || 0}/${survey.invitedUsersCount || 0}`,
										totalQuestions: survey.questionsCount,
										closingDate: new Date(survey.closesAt).toLocaleDateString(),
										surveyDate: new Date(survey.createdAt).toLocaleDateString(),
										invitedUsers: survey.invitedUsers,
										data: survey,
									}}
									refetch={refetch}
								/>
							</Box>
						))}
			</Grid>
		</>
	);
};

export default Survey;
