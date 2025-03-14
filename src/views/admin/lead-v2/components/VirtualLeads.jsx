import React, { useEffect, useRef, useState } from 'react';
import LeadCard from './LeadCard';
import { Box, Spinner } from '@chakra-ui/react';
import { AutoSizer, Grid } from 'react-virtualized';

// const VirtualLeads = ({
// 	leads,
// 	leadCardWidth = 300,
// 	leadCardHeight = 500,
// 	refreshLeads,
// 	emailAccess,
// 	permission,
// 	setLeadDetails,
// 	callAccess,
// 	setViewLead,
// 	queryParams,
// 	setEditLead,
// 	setAddLead,
// 	setSendEmail,
// 	selectedValues,
// 	setSelectedValues,
// 	setDeleteLead,
// 	setSelectAllChecked,
// 	selectAllChecked,
// }) => {
// 	// Fallback if leads.doc is empty
// 	const docs = leads?.doc || [];
// 	if (!docs.length) return <NoData />;

// 	// Compute column count based on container width using our breakpoints
// 	const computeColumnCount = (width) => {
// 		if (width >= 3840) return 7; // >= 4K
// 		if (width >= 2560) return 6; // >= QHD
// 		if (width >= 2120) return 5; // >= Full HD+
// 		if (width >= 1664) return 4;
// 		if (width >= 1180) return 3;
// 		if (width >= 700) return 2;
// 		return 1;
// 	};

// 	return (
// 		<AutoSizer>
// 			{({ height, width }) => {
// 				const columnCount = computeColumnCount(width);
// 				const rowCount = Math.ceil(docs.length / columnCount);
// 				return (
// 					<Grid
// 						columnCount={columnCount}
// 						columnWidth={leadCardWidth}
// 						height={height} // use container height
// 						rowCount={rowCount}
// 						rowHeight={leadCardHeight}
// 						width={width}
// 					>
// 						{({ columnIndex, rowIndex, style }) => {
// 							const index = rowIndex * columnCount + columnIndex;
// 							if (index >= docs.length) return null;
// 							const lead = docs[index];
// 							return (
// 								<div style={style}>
// 									<LeadCard
// 										key={lead._id}
// 										lead={lead}
// 										refreshLeads={refreshLeads}
// 										emailAccess={emailAccess}
// 										permission={permission}
// 										setLeadDetails={setLeadDetails}
// 										callAccess={callAccess}
// 										setViewLead={setViewLead}
// 										queryParams={queryParams}
// 										setEditLead={setEditLead}
// 										setAddLead={setAddLead}
// 										setSendEmail={setSendEmail}
// 										selectedValues={selectedValues}
// 										setSelectedValues={setSelectedValues}
// 										setDeleteLead={setDeleteLead}
// 										setSelectAllChecked={setSelectAllChecked}
// 										selectAllChecked={selectAllChecked}
// 									/>
// 								</div>
// 							);
// 						}}
// 					</Grid>
// 				);
// 			}}
// 		</AutoSizer>
// 	);
// };

const VirtualLeads = ({
	leads,
	refreshLeads,
	emailAccess,
	permission,
	setLeadDetails,
	callAccess,
	setViewLead,
	queryParams,
	setEditLead,
	setAddLead,
	setSendEmail,
	selectedValues,
	setSelectedValues,
	setDeleteLead,
	setSelectAllChecked,
	selectAllChecked,
}) => {
	const [columnCount, setColumnCount] = useState(1);
	const [rowHeight, setRowHeight] = useState(300);
	const listRef = useRef(null);

	// 📏 Dynamically adjust column count based on screen size
	useEffect(() => {
		const updateLayout = () => {
			const width = window.innerWidth;
			const newRowHeight = width < 768 ? 450 : 300;
			setRowHeight(newRowHeight);

			if (width >= 3840) setColumnCount(7);
			else if (width >= 2560) setColumnCount(6);
			else if (width >= 2120) setColumnCount(5);
			else if (width >= 1664) setColumnCount(4);
			else if (width >= 1180) setColumnCount(3);
			else if (width >= 700) setColumnCount(2);
			else setColumnCount(1);
		};

		updateLayout();
		window.addEventListener('resize', updateLayout);
		return () => window.removeEventListener('resize', updateLayout);
	}, []);

	const docs = leads?.doc || [];
	const rowCount = Math.ceil(docs.length / columnCount);

	// 🔥 Render Each Cell with Simple Loader
	const Cell = ({ columnIndex, rowIndex, style }) => {
		const index = rowIndex * columnCount + columnIndex;
		const lead = docs[index];

		if (!lead) {
			// 🔄 Show Loader Instead of White Screen
			return (
				<Box
					style={{
						...style,
						height: rowHeight,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Spinner size='lg' color='blue.500' />
				</Box>
			);
		}

		return (
			<Box style={{ ...style, padding: 8, height: rowHeight }}>
				<LeadCard
					key={lead._id}
					lead={lead}
					refreshLeads={refreshLeads}
					emailAccess={emailAccess}
					permission={permission}
					setLeadDetails={setLeadDetails}
					callAccess={callAccess}
					setViewLead={setViewLead}
					queryParams={queryParams}
					setEditLead={setEditLead}
					setAddLead={setAddLead}
					setSendEmail={setSendEmail}
					selectedValues={selectedValues}
					setSelectedValues={setSelectedValues}
					setDeleteLead={setDeleteLead}
					setSelectAllChecked={setSelectAllChecked}
					selectAllChecked={selectAllChecked}
				/>
			</Box>
		);
	};

	// 🔥 Virtualized Grid for Performance
	return (
		<Box height='100vh' width='100%'>
			<AutoSizer>
				{({ height, width }) => (
					<Grid
						ref={listRef}
						height={height}
						width={width}
						columnCount={columnCount}
						rowCount={rowCount}
						columnWidth={width / columnCount}
						rowHeight={rowHeight}
						cellRenderer={Cell}
					/>
				)}
			</AutoSizer>
		</Box>
	);
};

export default VirtualLeads;
