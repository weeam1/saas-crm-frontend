import SelectInput from 'components/shared/SelectInput';
import { InfoIcon } from '@chakra-ui/icons';
import {
	Flex,
	FormControl,
	Icon,
	Select,
	Text,
	Tooltip,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
	leadIconSize,
	leadlabelFontSize,
	leadSelectInputSize,
} from '../constants';
import { useSelector } from 'react-redux';

const Managers = ({ lead, value }) => {
	const { list } = useSelector((state) => state?.users);
	const [selected, setSelected] = useState('' || lead?.managerAssigned);

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
				name='managerAssigned'
				options={list?.managers || []}
				placeholder='Select'
				selectedValue={selected}
				type='dynamic'
				size={leadSelectInputSize}
				onChange={(e) => setSelected(e.target.value)}
			/>
			{/* <FormControl>
				<Select
					placeholder={'Select'}
					size={leadSelectInputSize}
					fontSize={leadSelectInputFontSize}
					borderColor={borderColor}
					focusBorderColor={focusBorderColor}
					color={textColor}
					bg={bgColor}
					_hover={{ borderColor: focusBorderColor }}
					_focus={{ boxShadow: `0 0 0 1px ${focusBorderColor}` }}
					borderRadius='md'
					sx={{
						option: {
							bg: dropdownBg,
							color: 'gray.800',
							_hover: { bg: dropdownHoverBg },
						},
					}}
				>
					{list?.managers.map((opt) => (
						<option key={opt._id} value={opt._id}>
							{opt.name}
						</option>
					))}
				</Select>
			</FormControl> */}
		</>
	);
};

export default Managers;
