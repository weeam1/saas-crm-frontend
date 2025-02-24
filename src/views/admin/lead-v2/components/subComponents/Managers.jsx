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
	mergeSort,
} from '../constants';
import { useSelector } from 'react-redux';
import { formattedDate } from 'utils/helpers';
import { toast } from 'react-toastify';
import { putApi } from 'services/api';

const Managers = ({ lead, managerAssigned, refreshLeads }) => {
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState('' || managerAssigned);
	const tree = useSelector((state) => state.user.tree);

	const handleChangeManager = async (e) => {
		const managerAssigned = e.target.value;

		const dataObj = {
			managerAssigned: managerAssigned || '',
			agentAssigned: managerAssigned ? '' : undefined,
		};

		try {
			setLoading(true);
			const res = await putApi(`api/lead/edit/${lead._id}`, dataObj);

			if (res.status === 200) {
				setSelected(managerAssigned);
				refreshLeads();
				toast.success('Manager updated successfully');
			}
		} catch (error) {
			console.error('Failed to update the manager:', error);
			toast.error('Failed to update the manager');
		} finally {
			setLoading(false);
		}
	};

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
				<Tooltip
					label={`Assign Date:\n${lead?.managerAssignedDate ? formattedDate(lead?.managerAssignedDate) : 'N/A'}`}
					hasArrow
					whiteSpace='pre-line'
				>
					<Icon as={InfoIcon} boxSize={leadIconSize} color='blue.300' />
				</Tooltip>
			</Flex>
			<SelectInput
				name='managerAssigned'
				options={mergeSort(tree?.managers || [])}
				placeholder='Select'
				selectedValue={selected}
				type='dynamic'
				size={leadSelectInputSize}
				loading={loading}
				onChange={handleChangeManager}
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
