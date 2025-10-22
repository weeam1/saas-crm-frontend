import React from 'react';
import LeadsModal from '../LeadsModal';
import EditLead from './EditLead';
import AddLead from './AddLead';
import AddEmailHistory from 'views/admin/emailHistory/components/AddEmail';
import Delete from '../Delete';
import LeadPhoneHistory from './subComponents/LeadPhoneHistory';
import LeadAdditionalInfoModal from './lead-note/LeadAdditionalInfoModal';
import LeadCycle from 'views/admin/leadCycle';

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
		viewPhoneHistory,
		setViewPhoneHistory,
		setLeadAddtionalInfo,
		leadAddtionalInfo,
		isLeadCycle,
		setIsLeadCycle,
	} = props;

	const handleViewClose = () => {
		setViewLead({ isOpen: false, lid: null });
	};

	return (
		<>
			{viewLead?.isOpen && (
				<LeadsModal
					leadsModal={viewLead}
					onClose={handleViewClose}
					reFreshData={refetchData}
				/>
			)}

			{leadAddtionalInfo && (
				<LeadAdditionalInfoModal
					isOpen={leadAddtionalInfo}
					onClose={() => setLeadAddtionalInfo(false)}
					leadId={lead?._id}
				/>
			)}

			{viewPhoneHistory?.modal && (
				<LeadPhoneHistory
					isOpen={viewPhoneHistory?.modal}
					onClose={() =>
						setViewPhoneHistory({
							modal: false,
							leadId: null,
						})
					}
					leadId={viewPhoneHistory?.leadId}
				/>
			)}

			{editLead && (
				<EditLead
					isOpen={editLead}
					size='xl'
					leadData={lead}
					onClose={() => setEditLead(false)}
				/>
			)}

			{addLead && (
				<AddLead isOpen={addLead} onClose={() => setAddLead(false)} size='xl' />
			)}

			{/* Delete model */}
			{deleteLead && selectedValues?.length > 1 ? (
				<Delete
					isOpen={deleteLead}
					onClose={() => setDeleteLead(false)}
					data={selectedValues}
					refetchData={refetchData}
					setSelectedValues={setSelectedValues}
					url='api/lead/deleteMany'
					method='many'
					// setSelectAllChecked={setSelectAllChecked}
				/>
			) : (
				deleteLead && (
					<Delete
						isOpen={deleteLead}
						onClose={() => setDeleteLead(false)}
						id={selectedValues[0]}
						// refetchData={refetchData}
						setSelectedValues={setSelectedValues}
						url='api/lead/delete/'
						method='one'
						// setSelectAllChecked={setSelectAllChecked}
					/>
				)
			)}

			{isLeadCycle && (
				<LeadCycle isLeadCycle={isLeadCycle} setIsLeadCycle={setIsLeadCycle} />
			)}

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
