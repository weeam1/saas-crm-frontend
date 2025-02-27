import SelectInput from 'components/shared/SelectInput';
import { InfoIcon } from '@chakra-ui/icons';
import { Flex, Icon, Text, Tooltip } from '@chakra-ui/react';
import { useState, useEffect, useMemo } from 'react';
import {
	leadIconSize,
	leadlabelFontSize,
	leadSelectInputSize,
	leadValueFontSize,
	mergeSort,
} from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { formattedDate } from 'utils/helpers';
import { toast } from 'react-toastify';
import { putApi } from 'services/api';
import { updateLeadField } from '../../../../../redux/leadsSlice';

const Managers = ({ lead, managerAssigned, refreshLeads, role }) => {
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState('');
	const tree = useSelector((state) => state.user.tree);

	useEffect(() => {
		setSelected(managerAssigned);
	}, [managerAssigned]);

	const dispatch = useDispatch();

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
				// refreshLeads();
				dispatch(
					updateLeadField({
						id: lead?._id,
						key: 'managerAssigned',
						value: managerAssigned,
					})
				);
				toast.success('Manager updated successfully');
			}
		} catch (error) {
			console.error('Failed to update the manager:', error);
			toast.error('Failed to update the manager');
		} finally {
			setLoading(false);
		}
	};

	const { managerName } = useMemo(() => {
		if (!['Manager', 'Agent'].includes(role)) return { managerName: 'N/A' };

		// Create a lookup map for fast access
		const managerMap = new Map(
			tree?.managers?.map((m) => [m._id, m.fullName]) || []
		);
		const managerName = managerMap.get(selected) || 'N/A';

		return { managerName };
	}, [tree?.managers, role, selected, lead]);

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

			{['Manager', 'Agent'].includes(role) ? (
				<Text
					bg='softGray.400'
					py='2px'
					px='4px'
					mt='6px'
					rounded='md'
					color='softGray.300'
					fontSize={leadValueFontSize}
				>
					{managerName}
				</Text>
			) : (
				<SelectInput
					name='managerAssigned'
					placeholder='Select'
					options={mergeSort(tree?.managers || [])}
					selectedValue={selected}
					type='dynamic'
					size={leadSelectInputSize}
					loading={loading}
					onChange={handleChangeManager}
				/>
			)}

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
