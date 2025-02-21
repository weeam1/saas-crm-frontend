import { InfoIcon } from '@chakra-ui/icons';
import { Flex, Icon, Text, Tooltip } from '@chakra-ui/react';
import SelectInput from 'components/shared/SelectInput';
import { useState } from 'react';

const Agents = ({ value }) => {
	const [selected, setSelected] = useState('');

	return (
		<>
			<Flex alignItems='center' justifyContent='space-between' mb='1'>
				{/* Label */}
				<Text fontWeight='medium' fontSize='10px' color='softGray.200' mr={2}>
					Agent
				</Text>

				{/* Info Icon with Tooltip */}
				<Tooltip label={value} hasArrow>
					<Icon as={InfoIcon} boxSize='10px' color='blue.300' />
				</Tooltip>
			</Flex>
			<SelectInput
				name='assignAgent'
				options={[]}
				placeholder='Select Agent'
				selectedValue={selected}
				type='static'
				size='xs'
				onChange={(e) => setSelected(e.target.value)}
			/>
		</>
	);
};

export default Agents;
