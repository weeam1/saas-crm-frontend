import React from 'react';
import LeadsModal from '../LeadsModal';
import EditLead from './EditLead';
import AddLead from './AddLead';
import AddEmailHistory from 'views/admin/emailHistory/components/AddEmail';
import Delete from '../Delete';

const LeadsModals = (props) => {
	const {
		refetchData,
		setViewLead,
		viewLead,
		editLead,
		setEditLead,
		lead,
		addLead,
		setAddLead,
		sendEmail,
		setSendEmail,
		selectedValues,
		setSelectedValues,
		deleteLead,
		setDeleteLead,
	} = props;

	return (
		<>
			{viewLead && (
				<LeadsModal
					leadsModal={viewLead}
					onClose={() => setViewLead({ isOpen: false, lid: null })}
					reFreshData={refetchData}
				/>
			)}

			{editLead && (
				<EditLead
					isOpen={editLead}
					size='xl'
					refreshData={refetchData}
					leadData={lead}
					onClose={() => setEditLead(false)}
				/>
			)}

			{addLead && (
				<AddLead
					isOpen={addLead}
					onClose={() => setAddLead(false)}
					size='xl'
					refreshData={refetchData}
				/>
			)}

			{/* Delete model */}
			<Delete
				isOpen={deleteLead}
				onClose={setDeleteLead}
				data={selectedValues}
				refreshData={refetchData}
				setSelectedValues={setSelectedValues}
				url='api/lead/deleteMany'
				method='many'
				// setSelectAllChecked={setSelectAllChecked}
			/>

			{/* 
			<AddPhoneCall
				fetchData={refetchData}
				isOpen={addPhoneCall}
				onClose={setAddPhoneCall}
				data={data?.contact}
				id={callSelectedId}
				lead='true'
			/> */}

			{sendEmail && (
				<AddEmailHistory
					fetchData={refetchData}
					isOpen={sendEmail}
					onClose={setSendEmail}
					// data={data?.contact}
					leadDetails={lead}
					lead='true'
					id={lead?._id}
				/>
			)}
		</>
	);
};

export default LeadsModals;
