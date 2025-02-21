import { HStack, Icon, Text, Tooltip } from '@chakra-ui/react';
import SelectInput from 'components/shared/SelectInput';
import { useState } from 'react';

import { mainLeadStatus } from 'utils/options';
import {
	leadIconSize,
	leadlabelFontSize,
	leadSelectInputSize,
} from '../constants';
import { InfoIcon } from '@chakra-ui/icons';

const MainStatus = ({ value }) => {
	const [selected, setSelected] = useState('' || value);

	return (
		<>
			<HStack alignItems='center' justifyContent='space-between'>
				<Text
					fontWeight='medium'
					fontSize={leadlabelFontSize}
					color='softGray.200'
					mr={2}
				>
					Status
				</Text>
				<Tooltip label={selected} closeOnClick={false} hasArrow>
					<Icon as={InfoIcon} boxSize={leadIconSize} color='blue.300' />
				</Tooltip>
			</HStack>
			<SelectInput
				name='eLeadStatus'
				options={mainLeadStatus}
				placeholder='Select MStatus'
				selectedValue={selected}
				type='static'
				size={leadSelectInputSize}
				onChange={(e) => setSelected(e.target.value)}
			/>
		</>
	);
};

export default MainStatus;
