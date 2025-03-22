import React from 'react';
import LeadsModal from '../LeadsModal';
import EditLead from './EditLead';
import AddLead from './AddLead';
import AddEmailHistory from 'views/admin/emailHistory/components/AddEmail';
import Delete from '../Delete';
import { useSearchParams } from 'react-router-dom';

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

	const [searchParams, setSearchParams] = useSearchParams();

	const handleViewClose = () => {
		const newParams = new URLSearchParams(searchParams);

		if (newParams.has('invite')) {
			newParams.delete('invite');
			setSearchParams(newParams);
		}

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
			{deleteLead && (
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
