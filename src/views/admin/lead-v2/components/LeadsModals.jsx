import React from 'react';
import LeadsModal from '../LeadsModal';

const LeadsModals = (props) => {
	const { refetchData, setViewLead, viewLead } = props;

	console.log('refersh leads: ', typeof refreshLeads);

	return (
		<>
			{viewLead && (
				<LeadsModal
					leadsModal={viewLead}
					onClose={() => setViewLead({ isOpen: false, lid: null })}
					reFreshData={refetchData}
				/>
			)}
		</>
	);
};

export default LeadsModals;
