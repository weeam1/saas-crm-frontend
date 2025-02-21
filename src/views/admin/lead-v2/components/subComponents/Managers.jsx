import SelectInput from 'components/shared/SelectInput';
import { InfoIcon } from '@chakra-ui/icons';
import { Flex, Icon, Text, Tooltip } from '@chakra-ui/react';
import { useState } from 'react';

const Managers = ({ value }) => {
	const [selected, setSelected] = useState('' || value);

	return (
		<>
			<Flex alignItems='center' justifyContent='space-between' mb='1'>
				{/* Label */}
				<Text fontWeight='medium' fontSize='8px' color='softGray.200' mr={2}>
					Manger
				</Text>

				{/* Info Icon with Tooltip */}
				<Tooltip label={selected} hasArrow>
					<Icon as={InfoIcon} boxSize='10px' color='blue.300' />
				</Tooltip>
			</Flex>

			<SelectInput
				name='assignManager'
				options={[]}
				placeholder='Select Manager'
				selectedValue={selected}
				onChange={(e) => setSelected(e.target.value)}
				type='static'
				size='xs'
			/>
		</>
	);
};

export default Managers;
