import SelectInput from 'components/shared/SelectInput';
// import { leadStatus } from 'utils/options';
import { HStack, Icon, Text } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { useEffect, useMemo, useState } from 'react';
import {
	leadIconSize,
	leadlabelFontSize,
	leadSelectInputSize,
} from '../constants';
import { toast } from 'react-toastify';
import { putApi } from 'services/api';
import { updateLeadField } from '../../../../../redux/leadsSlice';
import { useDispatch, useSelector } from 'react-redux';
import InvitationModal from './InvitationModal';
// import { eventLeadStatus } from 'utils/options';
import { sendLeadFeedback } from 'api';
import CustomTooltip from 'components/shared/CustomTooltip';
import { extractLocationData } from 'utils/helpers';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import CloseDealModal from '../deals/CloseDealModal';
import { useLeadStatuses } from 'hooks/leads/useLeadStatuses';

const Status = ({ lead }) => {
	const [selected, setSelected] = useState('' || lead?.leadStatus);

	const [currentStatus, setCurrentStatus] = useState(null);
	// const [label, setLabel] = useState('');
	// const [bgColor, setBgColor] = useState('');
	// const [textColor, setTextColor] = useState('');

	const [closeDeal, setCloseDeal] = useState(false);

	const layoutView = localStorage.getItem('leadView') || 'grid';

	const [loading, setLoading] = useState(false);
	const [inviteModal, setInviteModal] = useState(false);

	const { getSubStatuses } = useLeadStatuses();
	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	const dispatch = useDispatch();

	const handleStatus = async (statusOrEvent, options = {}) => {
		try {
			setLoading(true);

			const newStatus =
				typeof statusOrEvent === 'string'
					? statusOrEvent
					: statusOrEvent?.target?.value;

			const data = {
				leadStatus: newStatus,
			};

			const { skipDealModal = false } = options;

			if (newStatus === 'deal' && !skipDealModal) {
				return setCloseDeal(true);
			}

			let response = await putApi(`api/lead/changeStatus/${lead?._id}`, data);
			if (response.status === 200) {
				setSelected(data.leadStatus);
				// if (data.leadStatus === 'new') refreshLeads();

				dispatch(
					updateLeadField({
						id: lead?._id,
						key: 'leadStatus',
						value: data.leadStatus,
					})
				);
				!skipDealModal && toast.success('Lead Status Updated!');

				if (data.leadStatus === 'will_attend_the_show') {
					setInviteModal(true);
				}

				if (newStatus) {
					const statusData = leadSubStatuses?.find(
						(item) => item.value === newStatus
					);

					if (statusData?.meta_id) {
						const leadEmail = lead?.leadEmail ?? '';
						const leadPhone =
							typeof lead?.leadPhoneNumber === 'object'
								? lead?.leadPhoneNumber?.result
								: lead?.leadPhoneNumber;

						const { ip, city, country } = extractLocationData(lead?.ip);

						sendLeadFeedback({
							email: leadEmail,
							phone: leadPhone,
							status: statusData,
							action: 'Status',
							ip,
							fcblid: lead?.fcblid || null,
							fbp: lead?.fbp || null,
							country,
							city,
							zip: lead?.zip || null,
							userAgent: lead?.userAgent || null,
							leadName: lead?.leadName,
							leadId: lead?.intID,
						});
					}
				}

				// check if status is event lead status
				// if (eventLeadStatus.includes(data.leadStatus)) {

				// }

				// update user activity log
				createUserLog({
					userId: user?._id,
					action: 'UPDATE',
					entity: 'Lead',
					enityType: 'Lead',
					entityId: lead._id || null,
					status: 'success',
					message: `${user?.fullName} update the lead status from '${selected || 'No Status'} to '${data.leadStatus}'.`,
				});
			} else {
				console.log(response);
				toast.error(
					response?.response?.data?.message || 'Something went wrong!'
				);

				// update user activity log
				createUserLog({
					userId: user?._id,
					action: 'UPDATE',
					entity: 'Lead',
					enityType: 'Lead',
					entityId: lead._id || null,
					status: response?.status === 500 ? 'error' : 'fail',
					message: `failed to update the lead status'.`,
				});
			}
		} catch (e) {
			console.log(e?.response);
			toast.error(e?.response?.data?.message || 'Something went wrong!');

			// update user activity log
			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Lead',
				enityType: 'Lead',
				entityId: lead._id || null,
				status: e?.status === 500 ? 'error' : 'fail',
				message: `failed to update the lead status'.`,
			});
		} finally {
			setLoading(false);
		}
	};

	const leadSubStatuses = useMemo(() => {
		if (!lead?.eLeadStatus) return [];

		return getSubStatuses(lead.eLeadStatus) || [];
	}, [lead?.eLeadStatus]);

	useEffect(() => {
		const selectedOption = leadSubStatuses?.find(
			(item) => item.value === selected
		);

		if (selectedOption) {
			setCurrentStatus(selectedOption);
			// setBgColor(selectedOption.bgColor || 'white');
			// setTextColor(selectedOption.textColor || 'black');
			// setLabel(selectedOption?.label);
		} else setCurrentStatus(null);
	}, [selected, lead?.eLeadStatus]);

	const handleCloseDealSuccess = async () => {
		setCloseDeal(false);
		handleStatus('deal', { skipDealModal: true });
	};

	return (
		<>
			{layoutView !== 'table' && (
				<HStack alignItems='center' justifyContent='space-between'>
					<Text
						fontWeight='medium'
						fontSize={leadlabelFontSize}
						color='softGray.200'
						mr={2}
					>
						Status
					</Text>

					<CustomTooltip label={currentStatus?.label || 'N/A'}>
						<Icon
							as={InfoIcon}
							cursor='pointer'
							boxSize={leadIconSize}
							color='blue.300'
						/>
					</CustomTooltip>
				</HStack>
			)}
			<SelectInput
				mt={layoutView === 'table' ? '20px' : 0}
				name='leadStatus'
				options={leadSubStatuses}
				// options={leadStatus}
				placeholder='Select'
				selectedValue={selected}
				loading={loading}
				onChange={handleStatus}
				bgColorCustom={currentStatus?.bgColor}
				textColorCustom={currentStatus?.textColor}
				borderColorCustom={currentStatus?.color}
				size={leadSelectInputSize}
			/>

			{inviteModal && (
				<InvitationModal
					onClose={() => setInviteModal(false)}
					isOpen={inviteModal}
					lead={lead}
				/>
			)}

			{closeDeal && (
				<CloseDealModal
					isOpen={closeDeal}
					onClose={() => setCloseDeal(false)}
					lead={lead}
					mode='add'
					onSuccess={handleCloseDealSuccess}
				/>
			)}
		</>
	);
};

export default Status;
