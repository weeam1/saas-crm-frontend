import React, { useEffect, useMemo } from 'react';

import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Checkbox,
	Spinner,
	Box,
	Text,
	Flex,
} from '@chakra-ui/react';
import LeadUnassignedMessage from '../../components/subComponents/LeadUnassignedMessage';
import NoData from 'components/Message/NoData';
import CardLoader from '../../components/CardLoader';
import useFilteredQueryParams from '../../useFilteredQueryParams';
import { shallowEqual, useSelector } from 'react-redux';
import TableLoading from 'components/loading/TableLoading';

import { usePermissions } from 'hooks/usePermissions';
import { safeValue } from 'utils';
import useUserSession from 'hooks/useUserSession';
import LeadMenu from '../../components/subComponents/card/LeadMenu';
import Agents from '../../components/subComponents/Agents';
import Managers from '../../components/subComponents/Managers';
import Status from '../../components/subComponents/Status';
import MainStatus from '../../components/subComponents/MainStatus';
import { format } from 'date-fns';
import { extractLocationData } from 'utils/helpers';
import LeadTypeBadge from '../../components/subComponents/LeadTypeBadge';

const LeadTableView = (props) => {
	const {
		isLoaded,
		leadsLoading,
		refreshLeads,
		setLeadDetails,
		setViewLead,
		setEditLead,
		setAddLead,
		setSendEmail,
		selectedValues,
		setSelectedValues,
		setDeleteLead,
		setSelectAllChecked,
		selectAllChecked,
		leadsRefetching,
		setViewPhoneHistory,
		setLeadAddtionalInfo,
		setIsLeadCycle,
	} = props;

	const { hasPermission } = usePermissions();
	const { user, userRoleName } = useUserSession();
	const countries = useSelector((state) => state.countries.countryNames);

	const leads = useSelector((state) => state.leads, shallowEqual);

	const { pageSize, queryParams, refetchLoading, setRefetchLoading } =
		useFilteredQueryParams();

	useEffect(() => {
		if (leadsRefetching) {
			setRefetchLoading(true);
		} else {
			const timer = setTimeout(() => setRefetchLoading(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [leadsRefetching, refetchLoading, setRefetchLoading]);

	// Dynamically filter columns by permission
	const tableColumns = useMemo(() => {
		const baseCols = [
			{ Header: '#', accessor: 'intID', width: 10 },
			{ Header: 'Name', accessor: 'leadName', width: 20 },
			{ Header: 'Manager', accessor: 'managerAssigned' },
			{ Header: 'Agent', accessor: 'agentAssigned' },
			{ Header: 'Status', accessor: 'leadStatus' },
			{ Header: 'M Status', accessor: 'eLeadStatus' },
			{ Header: 'Timetocall', accessor: 'timetocall' },
			{ Header: 'Budget', accessor: 'budget' },
			{ Header: 'Created', accessor: 'createdDate' },
			{ Header: 'Nationality', accessor: 'nationality' },
			{ Header: 'Language', accessor: 'leadLang' },
			{ Header: 'Last Note', width: 100, accessor: 'lastNote' },
			{ Header: 'City', accessor: 'ip' },
			{ Header: 'Country', accessor: 'ip' },
			{ Header: 'Source Content', accessor: 'leadSourceDetails' },
			{ Header: 'Campaign', accessor: 'leadCampaign' },
			{ Header: 'Campaign URL', accessor: 'pageUrl' },
			{ Header: 'Address', accessor: 'leadAddress' },
			{ Header: 'Medium', accessor: 'leadSourceMedium' },
			{ Header: 'In UAE?', accessor: 'r_u_in_uae' },
		];

		if (hasPermission('leads', 'contactDetails')) {
			baseCols.splice(7, 0, { Header: 'Phone', accessor: 'leadPhoneNumber' });
			baseCols.splice(8, 0, {
				Header: 'Whatsapp',
				accessor: 'leadWhatsappNumber',
			});
			baseCols.splice(9, 0, { Header: 'Email', accessor: 'leadEmail' });
		}

		// Action column always last
		baseCols.push({
			Header: 'Actions',
			accessor: 'actions',
			isSortable: false,
		});
		return baseCols;
	}, []);

	return (
		<Box
			maxHeight='80vh'
			overflowY='auto'
			scrollBehavior='smooth'
			borderRadius='md'
			boxShadow='sm'
			bg='white'
		>
			<Table variant='striped' size='sm'>
				<Thead
					position='sticky'
					top={0}
					bg='brand.200'
					color='gray.900'
					zIndex={1}
				>
					<Tr>
						<Th>
							<Checkbox
								isChecked={selectAllChecked}
								onChange={(e) => setSelectAllChecked(e.target.checked)}
							/>
						</Th>
						{tableColumns.map((col) => (
							<Th key={col.accessor}>{col.Header}</Th>
						))}
					</Tr>
				</Thead>

				<Tbody>
					{!isLoaded || leadsLoading || refetchLoading ? (
						<TableLoading columns={tableColumns} length={10} py='4' />
					) : leads && leads?.totalLeads ? (
						leads?.doc?.map((lead) => {
							const { city, country } = extractLocationData(
								lead?.ip,
								countries
							);
							return (
								<Tr key={lead._id} _hover={{ bg: 'gray.50' }}>
									{/* Row checkbox */}
									<Td>
										<Checkbox
											isChecked={selectedValues.includes(lead._id)}
											onChange={(e) => {
												if (e.target.checked) {
													setSelectedValues([...selectedValues, lead._id]);
												} else {
													setSelectedValues(
														selectedValues.filter((id) => id !== lead._id)
													);
												}
											}}
										/>
									</Td>

									{/* Dynamic columns */}
									{tableColumns.map((col) => {
										if (col.accessor === 'intID') {
											return (
												<Td
													key={col.accessor}
													cursor='pointer'
													onClick={() => {
														setLeadDetails(lead);
														setViewLead({
															isOpen: true,
															lid: lead?._id,
														});
													}}
													color='gray.400'
													fontWeight='medium'
													_hover={{ textDecoration: 'underline' }}
												>
													{lead.intID || '—'}
												</Td>
											);
										}

										if (col.Header === 'Name') {
											const leadType =
												lead.leadType ??
												(lead.leadStatus === 'new' ? 'new' : undefined);

											return (
												<Td key={col.accessor}>
													<Flex
														alignItems='center'
														maxWidth='200px'
														textAlign='left'
													>
														<Text
															me='10px'
															color={'brand.600'}
															fontSize='sm'
															fontWeight='600'
															maxW='160px'
															isTruncated
														>
															{lead?.leadName || ''}
														</Text>
														<LeadTypeBadge
															leadType={leadType}
															roleName={userRoleName}
														/>
													</Flex>
												</Td>
											);
										}

										if (col.accessor === 'actions') {
											return (
												<Td key={col.accessor} textAlign='center'>
													<LeadMenu
														user={user}
														lead={lead}
														setEditLead={setEditLead}
														setAddLead={setAddLead}
														setSendEmail={setSendEmail}
														setSelectedValues={setSelectedValues}
														setDeleteLead={setDeleteLead}
														setLeadDetails={setLeadDetails}
														refreshData={refreshLeads}
														setViewPhoneHistory={setViewPhoneHistory}
														setLeadAddtionalInfo={setLeadAddtionalInfo}
														setIsLeadCycle={setIsLeadCycle}
													/>
												</Td>
											);
										}

										if (col.Header === 'Manager') {
											return (
												<Td key={col.accessor} minW='200px' textAlign='center'>
													<Managers
														managerAssigned={lead?.managerAssigned}
														lead={lead}
														refreshLeads={refreshLeads}
														role={userRoleName}
														queryParams={queryParams}
													/>
												</Td>
											);
										}
										if (col.Header === 'Agent') {
											return (
												<Td key={col.accessor} minW='200px' textAlign='center'>
													<Agents
														agentAssigned={lead?.agentAssigned}
														managerAssigned={lead?.managerAssigned}
														lead={lead}
														refreshLeads={refreshLeads}
													/>
												</Td>
											);
										}
										if (col.Header === 'M Status') {
											return (
												<Td key={col.accessor} minW='200px' textAlign='center'>
													<MainStatus
														lead={lead}
														refreshLeads={refreshLeads}
														role={userRoleName}
													/>
												</Td>
											);
										}
										if (col.Header === 'Status') {
											return (
												<Td key={col.accessor} minW='200px' textAlign='center'>
													<Status lead={lead} refreshLeads={refreshLeads} />
												</Td>
											);
										}
										if (col.Header === 'Created') {
											return (
												<Td key={col.accessor} minW='200px' textAlign='center'>
													{format(
														new Date(lead?.createdDate),
														'MMM d, yyyy h:mm a'
													)}
												</Td>
											);
										}
										if (col.Header === 'City') {
											return (
												<Td key={col.accessor} minW='80px' textAlign='center'>
													{city || 'N/A'}
												</Td>
											);
										}

										if (col.Header === 'Country') {
											return (
												<Td key={col.accessor} minW='80px' textAlign='center'>
													{country || 'N/A'}
												</Td>
											);
										}

										return (
											<Td
												py='4'
												key={col.accessor}
												textAlign='center'
												maxWidth='150px'
											>
												<Text noOfLines={2}>
													{safeValue(lead[col.accessor]) || 'N/A'}
												</Text>
											</Td>
										);
									})}
								</Tr>
							);
						})
					) : queryParams?.lead ? (
						<LeadUnassignedMessage />
					) : (
						<NoData label='leads' />
					)}
				</Tbody>
			</Table>
		</Box>
	);
};

export default LeadTableView;
