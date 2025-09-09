import SelectInput from 'components/shared/SelectInput';
import { InfoIcon } from '@chakra-ui/icons';
import { Flex, Icon, Text } from '@chakra-ui/react';
import { useState, useEffect, useMemo } from 'react';
import {
	leadIconSize,
	leadlabelFontSize,
	leadSelectInputSize,
} from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { putApi } from 'services/api';
import { updateLeadFields } from '../../../../../redux/leadsSlice';
import { format } from 'date-fns';
import { sendLeadNotification } from 'api';
import { mergeSort, removeDisableUser } from 'utils/helpers';
import CustomTooltip from 'components/shared/CustomTooltip';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';

const Managers = ({ lead, managerAssigned, refreshLeads, role }) => {
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState('');
	const tree = useSelector((state) => state.user.tree);

	// const user = JSON.parse(localStorage.getItem('user'));

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

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
							// {
							// 	key: 'leadType',
							// 	value: res?.data?.leadType || null,
							// },
							{
								key: 'isReleased',
								value: res?.data?.isReleased,
							},
						],
					})
				);

				toast.success('Manager updated successfully');

				// send lead notification
				sendLeadNotification(user?._id, managerAssignedValue, lead);

				let message;

				if (managerAssignedValue === '') {
					message = `Lead '${lead?.leadName || ''}' unassigned from Manager by ${user?.fullName}.`;
				} else {
					const manager = tree?.managers?.find(
						(user) => user._id === managerAssignedValue
					);

					message = `Lead '${lead?.leadName || ''}' assigned to Manager ${manager?.fullName} by ${user?.fullName}.`;
				}

				// update user activity log
				createUserLog({
					userId: user?._id,
					action: 'UPDATE',
					entity: 'Lead',
					enityType: 'Lead',
					entityId: managerAssignedValue || null,
					status: 'success',
					message,
					rawPayload: {
						previousManager: lead?.managerAssigned || null,
						newManager: managerAssignedValue || null,
						leadId: lead?.intID || null,
					},
				});
			}
		} catch (error) {
			console.error('Failed to update the manager:', error);
			toast.error('Failed to update the manager');

			// update user activity log
			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Lead',
				enityType: 'Lead',
				entityId: lead._id || null,
				status: error?.response?.status === 500 ? 'error' : 'fail',
				message: 'Failed to update the manager',
			});
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
					<Icon
						as={InfoIcon}
						cursor='pointer'
						boxSize={leadIconSize}
						color='blue.300'
					/>
				</CustomTooltip>
			</Flex>

			<SelectInput
				name='managerAssigned'
				placeholder='Select'
				options={mergeSort(removeDisableUser(tree?.managers || []))}
				selectedValue={selected}
				type='dynamic'
				size={leadSelectInputSize}
				loading={loading}
				onChange={handleChangeManager}
			/>
		</>
	);
};

export default Managers;
