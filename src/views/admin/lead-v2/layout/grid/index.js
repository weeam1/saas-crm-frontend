import React, { memo, useEffect } from 'react';
import LeadUnassignedMessage from '../../components/subComponents/LeadUnassignedMessage';
import NoData from 'components/Message/NoData';
import { Grid } from '@chakra-ui/react';
import CardLoader from '../../components/CardLoader';
import useFilteredQueryParams from '../../useFilteredQueryParams';
import { shallowEqual, useSelector } from 'react-redux';
import LeadCard from '../../components/LeadCard';

const LeadGridView = memo((props) => {
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
		setSelectedLeads,
		setDeleteLead,
		setSelectAllChecked,
		selectAllChecked,
		setViewPhoneHistory,
		setLeadAddtionalInfo,
		setIsLeadCycle,
		leadAddtionalInfo,
		leadsRefetching,
	} = props;
	const leads = useSelector((state) => state.leads, shallowEqual);

	const { queryParams, refetchLoading, setRefetchLoading } =
		useFilteredQueryParams();

	useEffect(() => {
		if (leadsRefetching) {
			setRefetchLoading(true);
		} else {
			const timer = setTimeout(() => setRefetchLoading(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [leadsRefetching, refetchLoading, setRefetchLoading]);

	return (
		<div>
			{!isLoaded || leadsRefetching || leadsLoading || refetchLoading ? (
				<CardLoader count={32} />
			) : leads && leads?.totalLeads ? (
				<Grid
					sx={{
						// >= 0px
						'@media (min-width: 0px)': {
							gridTemplateColumns: '1fr',
						},
						// >= 992px
						'@media (min-width: 700px)': {
							gridTemplateColumns: 'repeat(2, 1fr)',
						},
						// >= 1280px
						'@media (min-width: 1180px)': {
							gridTemplateColumns: 'repeat(3, 1fr)',
						},
						// >= 1664px
						'@media (min-width: 1664px)': {
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
					gap='2'
				>
					{leads?.doc?.map((lead) => (
						<LeadCard
							key={lead._id}
							lead={lead}
							refreshLeads={refreshLeads}
							setLeadDetails={setLeadDetails}
							setViewLead={setViewLead}
							queryParams={queryParams}
							setEditLead={setEditLead}
							setAddLead={setAddLead}
							setSendEmail={setSendEmail}
							selectedValues={selectedValues}
							setSelectedValues={setSelectedValues}
							setSelectedLeads={setSelectedLeads}
							setDeleteLead={setDeleteLead}
							setSelectAllChecked={setSelectAllChecked}
							selectAllChecked={selectAllChecked}
							setViewPhoneHistory={setViewPhoneHistory}
							setLeadAddtionalInfo={setLeadAddtionalInfo}
							setIsLeadCycle={setIsLeadCycle}
							leadAddtionalInfo={leadAddtionalInfo}
						/>
					))}
				</Grid>
			) : queryParams?.lead ? (
				<LeadUnassignedMessage />
			) : (
				<NoData label='leads' />
			)}
		</div>
	);
});

LeadGridView.displayName = 'LeadGridView';

export default LeadGridView;
