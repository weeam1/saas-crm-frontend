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

const MainStatus = ({ lead }) => {
	const [selected, setSelected] = useState('' || lead?.eLeadStatus);

	console.log({ status: lead?.eLeadStatus });
	return (
		<>
			<HStack alignItems='center' justifyContent='space-between'>
				<Text
					fontWeight='medium'
					fontSize={leadlabelFontSize}
					color='softGray.200'
					mr={2}
				>
					M Status
				</Text>
				<Tooltip label={selected} closeOnClick={false} hasArrow>
					<Icon as={InfoIcon} boxSize={leadIconSize} color='blue.300' />
				</Tooltip>
			</HStack>
			<SelectInput
				name='eLeadStatus'
				options={mainLeadStatus}
				placeholder='Select'
				selectedValue={selected}
				textColorCustom='white'
				bgColorCustom='brand.300'
				borderColorCustom='brand.600'
				size={leadSelectInputSize}
				onChange={(e) => setSelected(e.target.value)}
			/>
		</>
	);
};

export default MainStatus;
