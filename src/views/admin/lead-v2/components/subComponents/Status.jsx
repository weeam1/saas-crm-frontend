import SelectInput from 'components/shared/SelectInput';
import { leadStatus } from 'utils/options';
import { Box, HStack, Icon, Text, Tooltip } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import {
	leadIconSize,
	leadlabelFontSize,
	leadSelectInputSize,
} from '../constants';

const Status = ({ value }) => {
	const [selected, setSelected] = useState('' || value);
	const [bgColor, setBgColor] = useState('');
	const [textColor, setTextColor] = useState('');

	useEffect(() => {
		const selectedOption = leadStatus.find((item) => item.value === selected);
		if (selectedOption) {
			setBgColor(selectedOption.bgColor || 'white');
			setTextColor(selectedOption.textColor || 'black');
		} else {
			setBgColor('white');
			setTextColor('black');
		}
	}, [selected]);

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
				name='leadStatus'
				options={leadStatus}
				placeholder='Select Status'
				selectedValue={selected}
				onChange={(e) => setSelected(e.target.value)}
				type='static'
				bgColorCustom={bgColor}
				textColorCustom={textColor}
				size={leadSelectInputSize}
			/>
		</>
	);
};

export default Status;
