import { InfoIcon } from '@chakra-ui/icons';
import { Flex, Icon, Text } from '@chakra-ui/react';
import SelectInput from 'components/shared/SelectInput';
import { useMemo, useState, useEffect } from 'react';
import { leadIconSize, leadlabelFontSize } from '../constants';
import { leadSelectInputSize } from './../constants';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchAgentLeadsSats } from 'api';
import { putApi } from 'services/api';
import ErrorLeadLimitMessage from 'components/Message/ErrorLeadLimitMessage';
import { updateLeadFields } from '../../../../../redux/leadsSlice';
import { sendLeadNotification } from 'api';
import { format } from 'date-fns';
import { mergeSort } from 'utils/helpers';
import CustomTooltip from 'components/shared/CustomTooltip';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import { useTeamStructure } from 'hooks/user/useTeamStructure';

const Agents = ({ lead }) => {
	const { agentAssigned, managerAssigned, teamLeadAssigned } = lead;

	const [selected, setSelected] = useState(agentAssigned || '');
	const [loading, setLoading] = useState(false);

	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [errorLeadData, setErrorLeadData] = useState({});

	// const tree = useSelector((state) => state.user.tree);

	const { team } = useTeamStructure();
	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	useEffect(() => {
		setSelected(agentAssigned);
	}, [agentAssigned]);

	console.log({ managerAssigned, teamLeadAssigned, agentAssigned });

	const dispatch = useDispatch();

	const handleChangeAgent = async (e) => {
		try {
			setLoading(true);

			const agentAssignedValue = e.target.value || null;

			const data = {
				agentAssigned: agentAssignedValue,
			};

			if (data.agentAssigned) {
				const stats = await fetchAgentLeadsSats(data.agentAssigned);

				if (!stats.canAddLeads) {
					setErrorLeadData(stats);
					setIsErrorModalOpen(true);
					setLoading(false);
					return;
				}
			}

			const res = await putApi(`api/lead/v2/edit/${lead._id}`, data);

			if (res.status === 200) {
				setSelected(data.agentAssigned);

				toast.success('Agent updated successfully');

				dispatch(
					updateLeadFields({
						id: lead?._id,
						updates: [
							{ key: 'agentAssigned', value: agentAssignedValue },
							{ key: 'agentDetails', value: res?.data?.agentDetails || null },
							{
								key: 'agentAssignedDate',
								value:
									agentAssignedValue !== '' ? new Date().toISOString() : null,
							},
							{
								key: 'leadType',
								value: res?.data?.leadType || null,
							},
							{
								key: 'isReleased',
								value: res?.data?.isReleased,
							},
						],
					})
				);

				// send lead notification
				if (agentAssignedValue) {
					sendLeadNotification(user?._id, agentAssignedValue, lead);
				}

				let message;

				if (agentAssignedValue === null) {
					message = `Lead '${lead?.leadName || ''}' unassigned from Agent by ${user?.fullName}.`;
				} else {
					const agent = agents?.find(
						(agent) => agent._id === agentAssignedValue
					);
					message = `Lead '${lead?.leadName || ''}' assigned to Agent ${agent?.fullName || 'N/A'} by ${user?.fullName}.`;
				}

				// update user activity log
				createUserLog({
					userId: user?._id,
					action: 'ASSIGN',
					entity: 'Lead',
					enityType: 'Lead',
					entityId: lead?._id || null,
					leadAgent: agentAssignedValue || null,
					status: 'success',
					message,
					rawPayload: {
						previousAgent: lead?.agentAssigned || null,
						newAgent: agentAssignedValue || null,
						leadId: lead?.intID || null,
					},
				});
			}
		} catch (error) {
			const errorMessage = error?.data?.message || 'Failed to update the agent';
			console.error('Failed to update the agent:', errorMessage);
			toast.error(errorMessage);

			// update user activity log
			createUserLog({
				userId: user?._id,
				action: 'ASSIGN',
				entity: 'Lead',
				enityType: 'Lead',
				entityId: lead._id || null,
				status: error?.data?.status === 500 ? 'error' : 'fail',
				message: errorMessage,
			});
		} finally {
			setLoading(false);
		}
	};

	// Filter agents related to the assigned manager + team lead
	const agents = useMemo(() => {
		if (!team?.length || !managerAssigned || !teamLeadAssigned) return [];

		const manager = team.find((m) => m._id === managerAssigned);
		if (!manager?.teamLeaders?.length) return [];

		const teamLead = manager.teamLeaders.find(
			(tl) => tl._id === teamLeadAssigned
		);

		if (!teamLead?.agents?.length) return [];

		return mergeSort(teamLead.agents);
	}, [team, managerAssigned, teamLeadAssigned]);

	// const agents = useMemo(() => {
	// 	return mergeSort(
	// 		removeDisableUser(tree?.agents?.[`manager-${managerAssigned}`] || [])
	// 	);
	// }, [managerAssigned, tree]);

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
				<CustomTooltip
					label={`Assign Date:\n${
						lead?.agentAssignedDate
							? format(new Date(lead?.agentAssignedDate), 'MMM d, yyyy h:mm a')
							: 'N/A'
					}`}
				>
					<Icon
						as={InfoIcon}
						boxSize={leadIconSize}
						cursor='pointer'
						color='blue.300'
					/>
				</CustomTooltip>
			</Flex>
			<SelectInput
				name='agentAssigned'
				placeholder='Select'
				options={agents || []}
				selectedValue={selected}
				type='dynamic'
				size={leadSelectInputSize}
				loading={loading}
				onChange={handleChangeAgent}
			/>

			{errorLeadData && (
				<ErrorLeadLimitMessage
					isOpen={isErrorModalOpen}
					onClose={() => setIsErrorModalOpen(false)}
					errorLeadData={errorLeadData}
				/>
			)}
		</>
	);
};

export default Agents;
