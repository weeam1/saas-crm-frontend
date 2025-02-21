import { InfoIcon } from '@chakra-ui/icons';
import { Flex, Icon, Text, Tooltip } from '@chakra-ui/react';
import SelectInput from 'components/shared/SelectInput';
import { useState } from 'react';
import { leadIconSize, leadlabelFontSize } from '../constants';
import { leadSelectInputSize } from './../constants';
import { useSelector } from 'react-redux';

const Agents = ({ value }) => {
	const [selected, setSelected] = useState('');
	const { list } = useSelector((state) => state?.users);

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
					Agent
				</Text>

				{/* Info Icon with Tooltip */}
				<Tooltip label={value} hasArrow>
					<Icon as={InfoIcon} boxSize={leadIconSize} color='blue.300' />
				</Tooltip>
			</Flex>
			<SelectInput
				name='agentAssigned'
				options={list?.agents || []}
				placeholder='Select'
				selectedValue={selected}
				type='dynamic'
				size={leadSelectInputSize}
				onChange={(e) => setSelected(e.target.value)}
			/>
		</>
	);
};

export default Agents;
