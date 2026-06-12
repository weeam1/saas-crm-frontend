/**
 * LeadsReportsPage (Reports V3 → Leads)
 * -------------------------------------
 * The main leads analytics dashboard:
 *   - Filters bar (date range, date field, status, source)
 *   - KPI tiles (summary + conversion)
 *   - Charts: trend (area), breakdown (donut), conversion comparison (bar), funnel
 *   - Owner performance table (server-paginated, sortable)
 *
 * Data is fetched via the project's existing RTK Query `useFetchItemsQuery`
 * (wrapped by the `useLeadsReports` hooks). All sections share one filter
 * params object so RTK Query dedupes and caches efficiently.
 *
 * Route: /reports-v3/leads
 */

import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Flex, Select, SimpleGrid, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
	FiArrowLeft,
	FiAward,
	FiCheckCircle,
	FiClock,
	FiPercent,
	FiUserPlus,
	FiUsers,
} from 'react-icons/fi';

import { useModalColors } from 'hooks/useModalColors';
import { usePermissions } from 'hooks/usePermissions';

import { useLeadsReportFilters } from '../hooks/useLeadsReportFilters';
import {
	useLeadsByOwner,
	useLeadsBySource,
	useLeadsByStatus,
	useLeadsConversion,
	useLeadsFunnel,
	useLeadsSummary,
	useLeadsTrend,
} from '../api/useLeadsReports';

import FiltersBar from '../components/FiltersBar';
import KPICard from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import ReportTable from '../components/ReportTable';

import LeadsTrendChart from '../charts/LeadsTrendChart';
import BreakdownChart from '../charts/BreakdownChart';
import ConversionBySourceChart from '../charts/ConversionBySourceChart';
import FunnelChart from '../charts/FunnelChart';

import { formatCurrency, formatFull, formatPercent } from '../helpers';

const selectStyles = (colors) => ({
	bg: colors.bgInput,
	color: colors.headingText,
	borderColor: colors.borderColor,
	size: 'sm',
	maxW: '150px',
	_hover: { borderColor: colors.accentGold },
	_focus: { borderColor: colors.borderFocus },
});

const LeadsReportsPage = () => {
	const colors = useModalColors();
	const navigate = useNavigate();
	const { hasPermission } = usePermissions();

	useEffect(() => {
		if (!hasPermission('reports')) navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// ---- Shared filters ----
	const { filters, setFilter, reset, params } = useLeadsReportFilters();

	// ---- Section-local controls ----
	const [trendMetric, setTrendMetric] = useState('intake');
	const [trendInterval, setTrendInterval] = useState('day');
	const [breakdownDim, setBreakdownDim] = useState('source'); // source | status
	const [ownerRole, setOwnerRole] = useState('agent');
	const [ownerPage, setOwnerPage] = useState(1);
	const [ownerSortBy, setOwnerSortBy] = useState('total');
	const OWNER_LIMIT = 10;

	// Reset owner pagination whenever filters/role/sort change.
	useEffect(() => {
		setOwnerPage(1);
	}, [params, ownerRole, ownerSortBy]);

	// ---- Queries (all share `params`) ----
	const summary = useLeadsSummary(params);
	const byStatus = useLeadsByStatus(params);
	const bySource = useLeadsBySource(params);
	const conversion = useLeadsConversion({ ...params, groupBy: 'source' });
	const funnel = useLeadsFunnel(params);
	const trend = useLeadsTrend({ ...params, metric: trendMetric, interval: trendInterval });
	const owners = useLeadsByOwner({
		...params,
		role: ownerRole,
		sortBy: ownerSortBy,
		page: ownerPage,
		limit: OWNER_LIMIT,
	});

	// ---- Derived filter dropdown options (data-driven) ----
	const statusOptions = useMemo(
		() =>
			(byStatus.doc || [])
				.filter((s) => s.key && s.key !== 'others')
				.map((s) => ({ value: s.key, label: s.label || s.key, count: s.count })),
		[byStatus.doc],
	);
	const sourceOptions = useMemo(
		() =>
			(bySource.doc || [])
				.filter((s) => s.name && s.name !== 'others')
				.map((s) => ({ value: s.name, label: s.name, count: s.count })),
		[bySource.doc],
	);

	const breakdownRows = breakdownDim === 'source' ? bySource.doc : byStatus.doc;
	const breakdownQuery = breakdownDim === 'source' ? bySource : byStatus;

	// ---- Owner table column config ----
	const ownerColumns = [
		{ accessor: 'name', header: 'Owner', sortable: false, render: (r) => (
			<Text color={colors.headingText} fontWeight='medium'>{r.name}</Text>
		) },
		{ accessor: 'total', header: 'Leads', isNumeric: true, sortable: true, render: (r) => formatFull(r.total) },
		{ accessor: 'converted', header: 'Converted', isNumeric: true, sortable: true, render: (r) => formatFull(r.converted) },
		{ accessor: 'conversionRate', header: 'Conv. %', isNumeric: true, sortable: true, render: (r) => formatPercent(r.conversionRate) },
		{ accessor: 'revenue', header: 'Revenue', isNumeric: true, sortable: true, render: (r) => formatCurrency(r.revenue) },
		{ accessor: 'avgLeadScore', header: 'Avg score', isNumeric: true, sortable: false, render: (r) => formatFull(r.avgLeadScore) },
		{ accessor: 'notes', header: 'Notes', isNumeric: true, sortable: false, render: (r) => formatFull(r.notes) },
	];

	const handleOwnerSort = (accessor) => {
		setOwnerSortBy(accessor);
	};

	return (
		<Box bg={colors.bgDeep} minH='100vh' p={{ base: 3, md: 5 }}>
			{/* Header */}
			<Flex
				justify='space-between'
				align={{ base: 'flex-start', md: 'center' }}
				direction={{ base: 'column', md: 'row' }}
				gap={3}
				mb={5}
			>
				<Box>
					<Button
						variant='link'
						size='sm'
						leftIcon={<FiArrowLeft />}
						onClick={() => navigate('/reports-v3')}
						color={colors.mutedText}
						_hover={{ color: colors.accentGold }}
						mb={1}
					>
						Back to Reports
					</Button>
					<Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight='bold' color={colors.headingText}>
						Leads Reports
					</Text>
					<Text fontSize={{ base: 'sm', md: 'md' }} color={colors.bodyText}>
						Pipeline, conversion and performance analytics for your leads.
					</Text>
				</Box>
			</Flex>

			{/* Filters */}
			<Box mb={6}>
				<FiltersBar
					filters={filters}
					onChange={setFilter}
					onReset={reset}
					statusOptions={statusOptions}
					sourceOptions={sourceOptions}
					isLoading={byStatus.isLoading || bySource.isLoading}
				/>
			</Box>

			{/* KPI tiles */}
			<SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 6 }} spacing={4} mb={6}>
				<KPICard
					title='Total leads'
					value={summary.doc?.totalLeads ?? 0}
					icon={FiUsers}
					isLoading={summary.isLoading}
					tooltip='All leads matching the current filters'
				/>
				<KPICard
					title='New leads'
					value={summary.doc?.newLeads ?? 0}
					icon={FiUserPlus}
					isLoading={summary.isLoading}
					helpText="Status 'new'"
				/>
				<KPICard
					title='Converted'
					value={summary.doc?.convertedLeads ?? 0}
					icon={FiCheckCircle}
					isLoading={summary.isLoading}
					tooltip='Leads with at least one closed deal'
				/>
				<KPICard
					title='Conversion rate'
					value={summary.doc?.conversionRate ?? 0}
					format='percent'
					icon={FiPercent}
					isLoading={summary.isLoading}
				/>
				<KPICard
					title='Revenue'
					value={conversion.doc?.totalRevenue ?? 0}
					format='currency'
					icon={FiAward}
					isLoading={conversion.isLoading}
					helpText='From closed deals'
				/>
				<KPICard
					title='Avg lead score'
					value={summary.doc?.avgLeadScore ?? 0}
					icon={FiClock}
					isLoading={summary.isLoading}
				/>
			</SimpleGrid>

			{/* Trend + Breakdown */}
			<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5} mb={5}>
				<ChartCard
					title='Leads over time'
					subtitle={`${trendMetric === 'conversion' ? 'Conversions' : 'New leads'} per ${trendInterval}`}
					isLoading={trend.isLoading}
					isError={trend.isError}
					isEmpty={!trend.isLoading && !(trend.doc?.series?.length)}
					onRetry={trend.refetch}
					actions={
						<Flex gap={2}>
							<Select
								aria-label='Trend metric'
								value={trendMetric}
								onChange={(e) => setTrendMetric(e.target.value)}
								{...selectStyles(colors)}
							>
								<option value='intake' style={{ color: '#000' }}>Intake</option>
								<option value='conversion' style={{ color: '#000' }}>Conversion</option>
							</Select>
							<Select
								aria-label='Trend interval'
								value={trendInterval}
								onChange={(e) => setTrendInterval(e.target.value)}
								{...selectStyles(colors)}
							>
								<option value='day' style={{ color: '#000' }}>Daily</option>
								<option value='week' style={{ color: '#000' }}>Weekly</option>
								<option value='month' style={{ color: '#000' }}>Monthly</option>
							</Select>
						</Flex>
					}
				>
					<LeadsTrendChart
						series={trend.doc?.series || []}
						color={trendMetric === 'conversion' ? colors.badgeSuccessText : colors.accentGold}
					/>
				</ChartCard>

				<ChartCard
					title='Leads breakdown'
					subtitle={`Distribution by ${breakdownDim}`}
					isLoading={breakdownQuery.isLoading}
					isError={breakdownQuery.isError}
					isEmpty={!breakdownQuery.isLoading && !(breakdownRows?.length)}
					onRetry={breakdownQuery.refetch}
					actions={
						<Select
							aria-label='Breakdown dimension'
							value={breakdownDim}
							onChange={(e) => setBreakdownDim(e.target.value)}
							{...selectStyles(colors)}
						>
							<option value='source' style={{ color: '#000' }}>By source</option>
							<option value='status' style={{ color: '#000' }}>By status</option>
						</Select>
					}
				>
					<BreakdownChart rows={breakdownRows || []} />
				</ChartCard>
			</SimpleGrid>

			{/* Conversion comparison + Funnel */}
			<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5} mb={5}>
				<ChartCard
					title='Leads vs converted by source'
					subtitle='Volume compared with conversions'
					isLoading={conversion.isLoading}
					isError={conversion.isError}
					isEmpty={!conversion.isLoading && !(conversion.doc?.breakdown?.length)}
					onRetry={conversion.refetch}
				>
					<ConversionBySourceChart rows={conversion.doc?.breakdown || []} />
				</ChartCard>

				<ChartCard
					title='Conversion funnel'
					subtitle='Leads progressing through stages'
					isLoading={funnel.isLoading}
					isError={funnel.isError}
					isEmpty={!funnel.isLoading && !(funnel.doc?.stages?.length)}
					onRetry={funnel.refetch}
				>
					<FunnelChart stages={funnel.doc?.stages || []} />
				</ChartCard>
			</SimpleGrid>

			{/* Owner performance table */}
			<ChartCard
				title='Owner performance'
				subtitle='Leads, conversions and revenue by assignee'
				isLoading={false}
				minH='auto'
				actions={
					<Select
						aria-label='Owner role'
						value={ownerRole}
						onChange={(e) => setOwnerRole(e.target.value)}
						{...selectStyles(colors)}
					>
						<option value='agent' style={{ color: '#000' }}>Agents</option>
						<option value='teamLead' style={{ color: '#000' }}>Team leaders</option>
						<option value='manager' style={{ color: '#000' }}>Managers</option>
					</Select>
				}
			>
				<ReportTable
					columns={ownerColumns}
					rows={owners.doc || []}
					isLoading={owners.isLoading}
					isError={owners.isError}
					onRetry={owners.refetch}
					sortBy={ownerSortBy}
					onSort={handleOwnerSort}
					pagination={owners.pagination}
					onPageChange={setOwnerPage}
					rowKey='ownerId'
				/>
			</ChartCard>
		</Box>
	);
};

export default LeadsReportsPage;
