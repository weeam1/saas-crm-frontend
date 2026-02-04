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
import { fetchAgentLeadsStats, sendLeadNotification } from 'api';
import { mergeSort } from 'utils/helpers';
import CustomTooltip from 'components/shared/CustomTooltip';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import { useTeamStructure } from 'hooks/user/useTeamStructure';

const TeamLeaders = ({ lead, setIsErrorModalOpen, setErrorLeadData }) => {
	const {
		_id,
		intID,
		leadName,
		managerAssigned,
		teamLeadAssigned,
		teamLeadAssignedDate,
	} = lead;

	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState('');
	// const tree = useSelector((state) => state.user.tree);

	// const user = JSON.parse(localStorage.getItem('user'));
	const { team } = useTeamStructure();
	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	useEffect(() => {
		setSelected(teamLeadAssigned);
	}, [teamLeadAssigned]);

	const dispatch = useDispatch();

	// Filter agents related to the assigned manager + team lead
	const teamLeaders = useMemo(() => {
		const manager = team?.find((manager) => manager?._id === managerAssigned);

		return mergeSort(manager?.teamLeaders || []);
	}, [managerAssigned, team]);

	const handleChangeTeamLead = async (e) => {
		const teamLeadAssignedValue = e.target.value || null;

		const dataObj = {
			teamLeadAssigned: teamLeadAssignedValue,
		};

		try {
			setLoading(true);

			if (dataObj.teamLeadAssigned) {
				const stats = await fetchAgentLeadsStats(dataObj.teamLeadAssigned);

				if (!stats.canAddLeads) {
					setErrorLeadData(stats);
					setIsErrorModalOpen(true);
					setLoading(false);
					return;
				}
			}

			const res = await putApi(`api/lead/v2/assign/${_id}`, dataObj);

			if (res.status === 200) {
				setSelected(teamLeadAssignedValue);

				dispatch(
					updateLeadFields({
						id: _id,
						updates: [
							{ key: 'teamLeadAssigned', value: teamLeadAssignedValue },
							{
								key: 'teamLeadDetails',
								value: res?.data?.teamLeadDetails || null,
							},

							// if manager is unassigned then null agent also
							...(teamLeadAssignedValue === null
								? [{ key: 'agentDetails', value: null }]
								: []),

							{
								key: 'teamLeadAssignedDate',
								value:
									teamLeadAssignedValue !== null
										? new Date().toISOString()
										: null,
							},
							{ key: 'agentAssigned', value: null },
							{ key: 'agentAssignedDate', value: null },
							{
								key: 'isReleased',
								value: res?.data?.isReleased,
							},
						],
					}),
				);

				toast.success('Team Lead updated successfully');

				// send lead notification
				if (teamLeadAssignedValue) {
					sendLeadNotification(user?._id, teamLeadAssignedValue, lead);
				}

				let message;

				if (teamLeadAssignedValue === null) {
					message = `Lead '${leadName || ''}' unassigned from Team lead by ${user?.fullName}.`;
				} else {
					const teamLeader = teamLeaders?.find(
						(teamLead) => teamLead?._id === teamLeadAssignedValue,
					);

					message = `Lead '${leadName || ''}' assigned to Team lead ${teamLeader?.fullName} by ${user?.fullName}.`;
				}

				// update user activity log
				createUserLog({
					userId: user?._id,
					action: 'ASSIGN',
					entity: 'Lead',
					enityType: 'Lead',
					entityId: _id || null,
					leadTeamLead: teamLeadAssignedValue || null,
					status: 'success',
					message,
					rawPayload: {
						previousTeamLead: teamLeadAssigned || null,
						newTeamLead: teamLeadAssignedValue || null,
						leadId: intID || null,
					},
				});
			} else {
				const errorMessage =
					res?.response?.data?.message || 'Failed to update the team lead';
				console.error(errorMessage);

				toast.error(errorMessage);

				// update user activity log
				createUserLog({
					userId: user?._id,
					action: 'ASSIGN',
					entity: 'Lead',
					enityType: 'Lead',
					entityId: _id || null,
					status: res?.response?.status === 500 ? 'error' : 'fail',
					message: errorMessage,
				});
			}
		} catch (error) {
			const errorMessage =
				error?.data?.message || 'Failed to update the team lead';

			toast.error(errorMessage);

			// update user activity log
			createUserLog({
				userId: user?._id,
				action: 'ASSIGN',
				entity: 'Lead',
				enityType: 'Lead',
				entityId: _id || null,
				status: error?.response?.status === 500 ? 'error' : 'fail',
				message: errorMessage,
			});
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
					Team Lead
				</Text>

				{/* Info Icon with Tooltip */}
				{/* <Tooltip hasArrow whiteSpace='pre-line'>
          <Icon as={InfoIcon} boxSize={leadIconSize} color='blue.300' />
        </Tooltip> */}

				<CustomTooltip
					label={`Assign Date:\n${
						teamLeadAssignedDate
							? format(new Date(teamLeadAssignedDate), 'MMM d, yyyy h:mm a')
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
				name='teamLeadAssigned'
				placeholder='Select'
				options={teamLeaders}
				selectedValue={selected}
				type='dynamic'
				size={leadSelectInputSize}
				loading={loading}
				onChange={handleChangeTeamLead}
			/>
		</>
	);
};

export default TeamLeaders;
