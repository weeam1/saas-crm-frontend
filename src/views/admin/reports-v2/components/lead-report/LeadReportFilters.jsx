// import { Box, FormControl, Select, Stack, Text } from '@chakra-ui/react';
// import { useLeadReportFilters } from 'hooks/reports/useLeadReportFilters';

// // const LeadReportFilters = () => {
// // 	const { filters, setFilters } = useLeadReportFilters();

// // 	const { data: managers = [] } = useGetManagersQuery();
// // 	const { data: agents = [] } = useGetAgentsQuery();

// // 	return (
// // 		<Box>
// // 			<Text fontWeight='bold' mb={2}>
// // 				Filters
// // 			</Text>
// // 			<Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
// // 				<FormControl>
// // 					<Select
// // 						placeholder='Select Manager'
// // 						value={filters.managerId}
// // 						onChange={(e) =>
// // 							setFilters((prev) => ({
// // 								...prev,
// // 								managerId: e.target.value || null,
// // 							}))
// // 						}
// // 					>
// // 						{managers.map((mgr) => (
// // 							<option key={mgr._id} value={mgr._id}>
// // 								{mgr.name}
// // 							</option>
// // 						))}
// // 					</Select>
// // 				</FormControl>

// // 				<FormControl>
// // 					<Select
// // 						placeholder='Select Agent'
// // 						value={filters.agentId}
// // 						onChange={(e) =>
// // 							setFilters((prev) => ({
// // 								...prev,
// // 								agentId: e.target.value || null,
// // 							}))
// // 						}
// // 					>
// // 						{agents.map((agent) => (
// // 							<option key={agent._id} value={agent._id}>
// // 								{agent.name}
// // 							</option>
// // 						))}
// // 					</Select>
// // 				</FormControl>

// // 				<FormControl>
// // 					<Select
// // 						placeholder='Select Report Type'
// // 						value={filters.type}
// // 						onChange={(e) =>
// // 							setFilters((prev) => ({
// // 								...prev,
// // 								type: e.target.value,
// // 							}))
// // 						}
// // 					>
// // 						<option value='mainStatus'>Main Status</option>
// // 						<option value='leadStatus'>Lead Status</option>
// // 					</Select>
// // 				</FormControl>
// // 			</Stack>
// // 		</Box>
// // 	);
// // };

// export default LeadReportFilters;
