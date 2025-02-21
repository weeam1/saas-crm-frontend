import { Flex } from '@chakra-ui/react';
import React from 'react';
import LeadCard from './LeadCard';

const Leads = ({ leads }) => {
	return (
		<Flex wrap='wrap' width='fit-content' gap='1'>
			{leads?.doc?.map((lead) => (
				<LeadCard lead={lead} />
			))}
		</Flex>
	);
};

export default Leads;
