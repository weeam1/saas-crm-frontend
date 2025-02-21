import { Text } from '@chakra-ui/react';
import SelectInput from 'components/shared/SelectInput';
import { useState } from 'react';

import { mainLeadStatus } from 'utils/options';

const MainStatus = ({ value }) => {
	const [selected, setSelected] = useState('' || value);

	return (
		<>
			<Text fontWeight='medium' fontSize='8px' color='softGray.200' mr={2}>
				M Status
			</Text>

			<SelectInput
				name='eLeadStatus'
				options={mainLeadStatus}
				placeholder='Select MStatus'
				selectedValue={selected}
				type='static'
				size='xs'
				onChange={(e) => setSelected(e.target.value)}
			/>
		</>
	);
};

export default MainStatus;
