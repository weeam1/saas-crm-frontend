import SelectInput from 'components/shared/SelectInput';
import { InfoIcon } from '@chakra-ui/icons';
import { Flex, Icon, Text, Tooltip } from '@chakra-ui/react';
import { useState } from 'react';
import {
	leadIconSize,
	leadlabelFontSize,
	leadSelectInputSize,
} from '../constants';

const Managers = ({ value }) => {
	const [selected, setSelected] = useState('' || value);

	return (
		<>
			<Flex alignItems='center' justifyContent='space-between' mb='1'>
				{/* Label */}
				<Text
					fontWeight='medium'
					fontSize={leadlabelFontSize}
					color='softGray.200'
					mr={2}
				>
					Manger
				</Text>

				{/* Info Icon with Tooltip */}
				<Tooltip label={selected} hasArrow>
					<Icon as={InfoIcon} boxSize={leadIconSize} color='blue.300' />
				</Tooltip>
			</Flex>

			<SelectInput
				name='assignManager'
				options={[]}
				placeholder='Select Manager'
				selectedValue={selected}
				onChange={(e) => setSelected(e.target.value)}
				type='static'
				size={leadSelectInputSize}
			/>
		</>
	);
};

export default Managers;
