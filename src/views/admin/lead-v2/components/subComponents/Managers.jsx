import SelectInput from 'components/shared/SelectInput';
import { InfoIcon } from '@chakra-ui/icons';
import { Flex, Icon, Text } from '@chakra-ui/react';
import { useState, useEffect, useMemo } from 'react';
import {
	leadIconSize,
	leadlabelFontSize,
	leadSelectInputSize,
	leadValueFontSize,
	mergeSort,
} from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { putApi } from 'services/api';
import { updateLeadFields } from '../../../../../redux/leadsSlice';
import { format } from 'date-fns';
import CustomTooltip from './CustomTooltip';
import { sendLeadNotification } from 'api';

const Managers = ({ lead, managerAssigned, refreshLeads, role }) => {
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState('');
	const tree = useSelector((state) => state.user.tree);

	const user = JSON.parse(localStorage.getItem('user'));

	useEffect(() => {
		setSelected(managerAssigned);
	}, [managerAssigned]);

	const dispatch = useDispatch();

	const handleChangeManager = async (e) => {
		const managerAssignedValue = e.target.value;

		const dataObj = {
			managerAssigned: managerAssignedValue || '',
			agentAssigned: managerAssigned ? '' : undefined,
		};

		try {
			setLoading(true);
			const res = await putApi(`api/lead/edit/${lead._id}`, dataObj);

			if (res.status === 200) {
				setSelected(managerAssigned);

				dispatch(
					updateLeadFields({
						id: lead?._id,
						updates: [
							{ key: 'managerAssigned', value: managerAssignedValue },
							{
								key: 'managerAssignedDate',
								value:
									managerAssignedValue !== '' ? new Date().toISOString() : null,
							},
							{ key: 'agentAssigned', value: '' },
							{ key: 'agentAssignedDate', value: null },
						],
					})
				);

				toast.success('Manager updated successfully');

				// send lead notification
				sendLeadNotification(user?._id, managerAssignedValue, lead);
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
				{/* <Tooltip hasArrow whiteSpace='pre-line'>
					<Icon as={InfoIcon} boxSize={leadIconSize} color='blue.300' />
				</Tooltip> */}

				<CustomTooltip
					label={`Assign Date:\n${
						lead?.managerAssignedDate
							? format(
									new Date(lead?.managerAssignedDate),
									'MMM d, yyyy h:mm a'
								)
							: 'N/A'
					}`}
				>
					<Icon as={InfoIcon} boxSize={leadIconSize} color='blue.300' />
				</CustomTooltip>
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
		</>
	);
};

export default Managers;
