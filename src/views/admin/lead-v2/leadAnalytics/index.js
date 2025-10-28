import { Box, VStack, useColorModeValue } from '@chakra-ui/react';
import { useLeadAnalytics } from './useLeadAnalytics';
import LeadAnalyticsTable from './_components/LeadAnaylticsTable';
import AnalyticsHeader from './_components/AnalyticsHeader';
import { SummaryCards } from './_components/SummaryCards';

const LeadAnalytics = () => {
	const {
		categories,
		selectedCategory,
		onSearchChange,
		handleCategoryChange,
		searchTerm,
		sortConfig,
		handleSort,
		data,
		summary,
		totals,
		isLoading,
		handleDateFilter,
		isFetching,
		isError,
		error,
	} = useLeadAnalytics();

	const bgColor = useColorModeValue('gray.100', 'gray.900');

	const selectedCategoryLabel = categories.find(
		(cat) => cat.value === selectedCategory
	)?.label;

	console.log({ selectedCategoryLabel });

	return (
		<Box minH='100vh' bg={bgColor} p='4' rounded='lg' shadow='md'>
			<VStack spacing={0} align='stretch' gap='2'>
				<AnalyticsHeader
					totals={totals}
					selectedCategoryLabel={selectedCategoryLabel}
					categories={categories}
					selectedCategory={selectedCategory}
					onCategoryChange={handleCategoryChange}
					searchTerm={searchTerm}
					onSearchChange={onSearchChange}
					isLoading={isLoading || isFetching}
					handleDateFilter={handleDateFilter}
				/>

				{/* Summary Cards - AT THE TOP */}
				<SummaryCards summary={summary} isLoading={isLoading || isFetching} />

				<LeadAnalyticsTable
					selectedCategoryLabel={selectedCategoryLabel}
					data={data}
					sortConfig={sortConfig}
					onSort={handleSort}
					isLoading={isLoading || isFetching}
					isError={isError}
					error={error}
				/>
			</VStack>
		</Box>
	);
};

export default LeadAnalytics;
