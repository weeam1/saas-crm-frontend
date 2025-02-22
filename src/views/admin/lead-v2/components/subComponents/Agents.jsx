import { InfoIcon } from '@chakra-ui/icons';
import { Flex, Icon, Text, Tooltip } from '@chakra-ui/react';
import SelectInput from 'components/shared/SelectInput';
import { useMemo, useState } from 'react';
import { leadIconSize, leadlabelFontSize, mergeSort } from '../constants';
import { leadSelectInputSize } from './../constants';
import { useSelector } from 'react-redux';
import { formattedDate } from 'utils/helpers';

const Agents = ({ lead, managerAssigned, agentAssigned }) => {
	const [selected, setSelected] = useState(agentAssigned || '');
	// const { list } = useSelector((state) => state?.users);

	const tree = useSelector((state) => state.user.tree);

	// Filter agents related to the assigned manager
	const agents = useMemo(() => {
		return mergeSort(tree?.agents?.[`manager-${managerAssigned}`] || []);
	}, [managerAssigned, tree]);

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
				<Tooltip
					label={`Assign Date:\n${lead?.agentAssignedDate ? formattedDate(lead?.agentAssignedDate) : 'N/A'}`}
					hasArrow
					whiteSpace='pre-line'
				>
					<Icon as={InfoIcon} boxSize={leadIconSize} color='blue.300' />
				</Tooltip>
			</Flex>
			<SelectInput
				name='agentAssigned'
				options={agents || []}
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
