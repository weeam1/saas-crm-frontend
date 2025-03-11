import { InfoIcon } from '@chakra-ui/icons';
import { Box, Flex, Icon, Text, Tooltip } from '@chakra-ui/react';
import SelectInput from 'components/shared/SelectInput';
import { useMemo, useState, useEffect } from 'react';
import { leadIconSize, leadlabelFontSize, mergeSort } from '../constants';
import { leadSelectInputSize } from './../constants';
import { useDispatch, useSelector } from 'react-redux';
import { formattedDate } from 'utils/helpers';
import { toast } from 'react-toastify';
import { fetchAgentLeadsSats } from 'api';
import { putApi } from 'services/api';
import ErrorLeadLimitMessage from 'components/Message/ErrorLeadLimitMessage';
import {
	updateLeadField,
	updateLeadFields,
} from '../../../../../redux/leadsSlice';
import { format } from 'date-fns';
import CustomTooltip from './CustomTooltip';

const Agents = ({ lead, managerAssigned, agentAssigned, refreshLeads }) => {
	const [selected, setSelected] = useState(agentAssigned || '');
	const [loading, setLoading] = useState(false);

	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [errorLeadData, setErrorLeadData] = useState({});
	// const { list } = useSelector((state) => state?.users);

	const tree = useSelector((state) => state.user.tree);

	useEffect(() => {
		setSelected(agentAssigned);
	}, [agentAssigned]);

	const dispatch = useDispatch();

	const handleChangeAgent = async (e) => {
		try {
			setLoading(true);

			const agentAssignedValue = e.target.value;

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

			const res = await putApi(`api/lead/edit/${lead._id}`, data);

			if (res.status === 200) {
				setSelected(data.agentAssigned);

				toast.success('Agent updated successfully');
				// refreshLeads();

				console.log({ agentAssignedValue });

				// dispatch(
				// 	updateLeadField({
				// 		id: lead?._id,
				// 		key: 'agentAssigned',
				// 		value: agentAssignedValue,
				// 	})
				// );
				// dispatch(
				// 	updateLeadField({
				// 		id: lead?._id,
				// 		key: 'agentAssignedDate',
				// 		value: agentAssignedValue !== '' ? new Date() : null,
				// 	})
				// );

				dispatch(
					updateLeadFields({
						id: lead?._id,
						updates: [
							{ key: 'agentAssigned', value: agentAssignedValue },
							{
								key: 'agentAssignedDate',
								value:
									agentAssignedValue !== '' ? new Date().toISOString() : null,
							},
						],
					})
				);
			}
		} catch (error) {
			console.error('Failed to update the agent:', error);
			toast.error('Agent not updated. Please try again.');
		} finally {
			setLoading(false);
		}
	};

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
				{/* <Tooltip
					label={`Assign Date:\n${
						lead?.agentAssignedDate
							? format(new Date(lead?.agentAssignedDate), 'MMM d, yyyy h:mm a')
							: 'N/A'
					}`}
					hasArrow
					whiteSpace='pre-line'
					closeOnClick={false}
				>
					<Box as='button'>
						<Icon as={InfoIcon} boxSize={leadIconSize} color='blue.300' />
					</Box>
				</Tooltip> */}

				<CustomTooltip
					label={`Assign Date:\n${
						lead?.agentAssignedDate
							? new Date(lead?.agentAssignedDate).toLocaleString()
							: 'N/A'
					}`}
				>
					<Icon as={InfoIcon} boxSize={leadIconSize} color='blue.300' />
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
