import SelectInput from 'components/shared/SelectInput';
import { HStack, Icon, Text } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { useEffect, useMemo, useState } from 'react';
import {
	leadIconSize,
	leadlabelFontSize,
	leadSelectInputSize,
	QualificationMainStatus,
	QualificationSubStatus,
} from '../constants';
import { toast } from 'react-toastify';
import { putApi } from 'services/api';
import {
	updateLeadField,
	updateLeadFields,
} from '../../../../../redux/leadsSlice';
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
import CRMQualificationModal from '../CrmQualificationModal';

const Status = ({ lead }) => {
	const [selected, setSelected] = useState('' || lead?.leadStatus);
	const [currentStatus, setCurrentStatus] = useState(null);
	const [pendingStatus, setPendingStatus] = useState(null);

	const [openQualification, setOpenQualification] = useState(false);
	const [closeDeal, setCloseDeal] = useState(false);

	const layoutView = localStorage.getItem('leadView') || 'grid';

	const [loading, setLoading] = useState(false);
	const [inviteModal, setInviteModal] = useState(false);

	const { getSubStatuses } = useLeadStatuses();
	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	const dispatch = useDispatch();

	const leadSubStatuses = useMemo(() => {
		if (!lead?.eLeadStatus) return [];

		return getSubStatuses(lead.eLeadStatus) || [];
	}, [lead?.eLeadStatus]);

	useEffect(() => {
		if (!lead?.leadStatus) {
			setCurrentStatus(null);
			setSelected('');
			return;
		}

		const selectedOption = leadSubStatuses?.find(
			(item) => item.value === lead.leadStatus,
		);

		setSelected(lead.leadStatus);
		setCurrentStatus(selectedOption ?? null);
	}, [lead?.leadStatus, leadSubStatuses]);

	// useEffect(() => {
	// 	const selectedOption = leadSubStatuses?.find(
	// 		(item) => item.value === lead.leadStatus,
	// 	);

	// 	console.log({ selectedOption });

	// 	setSelected(lead.leadStatus);

	// 	if (selectedOption) {
	// 		setCurrentStatus(selectedOption);
	// 	} else setCurrentStatus(null);
	// }, [lead?.leadStatus, lead?.eLeadStatus]);

	const resolveStatus = (statusOrEvent) =>
		typeof statusOrEvent === 'string'
			? statusOrEvent
			: statusOrEvent?.target?.value || null;

	// const handleStatus = async (statusOrEvent, options = {}) => {
	// 	try {
	// 		setLoading(true);

	// 		const newStatus =
	// 			typeof statusOrEvent === 'string'
	// 				? statusOrEvent
	// 				: statusOrEvent?.target?.value;

	// 		const data = {
	// 			leadStatus: newStatus,
	// 		};

	// 		const { skipDealModal = false } = options;

	// 		if (newStatus === 'deal' && !skipDealModal) {
	// 			return setCloseDeal(true);
	// 		}

	// 		let response = await putApi(`api/lead/changeStatus/${lead?._id}`, data);
	// 		if (response.status === 200) {
	// 			setSelected(data.leadStatus);
	// 			// if (data.leadStatus === 'new') refreshLeads();

	// 			dispatch(
	// 				updateLeadField({
	// 					id: lead?._id,
	// 					key: 'leadStatus',
	// 					value: data.leadStatus,
	// 				}),
	// 			);
	// 			!skipDealModal && toast.success('Lead Status Updated!');

	// 			if (data.leadStatus === 'will_attend_the_show') {
	// 				setInviteModal(true);
	// 			}

	// 			if (newStatus) {
	// 				const statusData = leadSubStatuses?.find(
	// 					(item) => item.value === newStatus,
	// 				);

	// 				if (statusData?.meta_id) {
	// 					const leadEmail = lead?.leadEmail ?? '';
	// 					const leadPhone =
	// 						typeof lead?.leadPhoneNumber === 'object'
	// 							? lead?.leadPhoneNumber?.result
	// 							: lead?.leadPhoneNumber;

	// 					const { ip, city, country } = extractLocationData(lead?.ip);

	// 					sendLeadFeedback({
	// 						email: leadEmail,
	// 						phone: leadPhone,
	// 						status: statusData,
	// 						action: 'Status',
	// 						ip,
	// 						fcblid: lead?.fcblid || null,
	// 						fbp: lead?.fbp || null,
	// 						country,
	// 						city,
	// 						zip: lead?.zip || null,
	// 						userAgent: lead?.userAgent || null,
	// 						leadName: lead?.leadName,
	// 						leadId: lead?.intID,
	// 					});
	// 				}
	// 			}

	// 			// check if status is event lead status
	// 			// if (eventLeadStatus.includes(data.leadStatus)) {

	// 			// }

	// 			// update user activity log
	// 			createUserLog({
	// 				userId: user?._id,
	// 				action: 'UPDATE',
	// 				entity: 'Lead',
	// 				enityType: 'Lead',
	// 				entityId: lead._id || null,
	// 				status: 'success',
	// 				message: `${user?.fullName} update the lead status from '${selected || 'No Status'} to '${data.leadStatus}'.`,
	// 			});
	// 		} else {
	// 			console.log(response);
	// 			toast.error(
	// 				response?.response?.data?.message || 'Something went wrong!',
	// 			);

	// 			// update user activity log
	// 			createUserLog({
	// 				userId: user?._id,
	// 				action: 'UPDATE',
	// 				entity: 'Lead',
	// 				enityType: 'Lead',
	// 				entityId: lead._id || null,
	// 				status: response?.status === 500 ? 'error' : 'fail',
	// 				message: `failed to update the lead status'.`,
	// 			});
	// 		}
	// 	} catch (e) {
	// 		console.log(e?.response);
	// 		toast.error(e?.response?.data?.message || 'Something went wrong!');

	// 		// update user activity log
	// 		createUserLog({
	// 			userId: user?._id,
	// 			action: 'UPDATE',
	// 			entity: 'Lead',
	// 			enityType: 'Lead',
	// 			entityId: lead._id || null,
	// 			status: e?.status === 500 ? 'error' : 'fail',
	// 			message: `failed to update the lead status'.`,
	// 		});
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	// const handleCloseDealSuccess = async () => {
	// 	setCloseDeal(false);
	// 	handleStatus('deal', { skipDealModal: true });
	// };
	const executeSubStatusUpdate = async (newStatus, { silent = false } = {}) => {
		setLoading(true);

		try {
			const response = await putApi(`api/lead/changeStatus/${lead?._id}`, {
				leadStatus: newStatus,
			});

			if (response.status !== 200) {
				throw response;
			}

			setSelected(newStatus);
			!silent && toast.success('Lead Status Updated!');

			// dispatch(
			// 	updateLeadField({
			// 		id: lead?._id,
			// 		key: 'leadStatus',
			// 		value: newStatus,
			// 	}),
			// );

			let updates = [
				{
					key: 'leadStatus',
					value: newStatus,
				},
			];

			const isQaualificationReq =
				!lead?.isQualification &&
				!QualificationMainStatus.includes(lead?.eLeadStatus) &&
				!QualificationSubStatus.includes(newStatus);

			if (isQaualificationReq) {
				updates.push({ key: 'isQualification', value: true });
			}

			dispatch(
				updateLeadFields({
					id: lead?._id,
					updates,
				}),
			);

			handleMetaFeedback(newStatus);
			logSubStatusChange(newStatus, 'success');

			if (newStatus === 'will_attend_the_show') {
				setInviteModal(true);
			}
		} catch (error) {
			handleSubStatusError(error);
			logSubStatusChange(newStatus, error?.status === 500 ? 'error' : 'fail');
		} finally {
			setLoading(false);
		}
	};

	const handleMetaFeedback = (newStatus) => {
		const statusData = leadSubStatuses?.find(
			(item) => item.value === newStatus,
		);

		if (!statusData?.meta_id) return;

		const leadPhone =
			typeof lead?.leadPhoneNumber === 'object'
				? lead?.leadPhoneNumber?.result
				: lead?.leadPhoneNumber;

		const { ip, city, country } = extractLocationData(lead?.ip);

		sendLeadFeedback({
			email: lead?.leadEmail ?? '',
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
	};

	const handleSubStatus = (statusOrEvent) => {
		const newStatus = resolveStatus(statusOrEvent);

		const isQualificationReq =
			lead?.eLeadStatus === 'show'
				? !lead?.isQualification && !QualificationSubStatus.includes(newStatus)
				: !lead?.isQualification &&
					!QualificationMainStatus.includes(lead?.eLeadStatus);

		if (isQualificationReq) {
			setPendingStatus(newStatus);
			return setOpenQualification(true);
		}

		executeSubStatusUpdate(newStatus);
	};

	const handleQualificationSuccess = () => {
		setOpenQualification(false);
		executeSubStatusUpdate(pendingStatus ?? '', { silent: true });
		setPendingStatus(null);
	};

	const logSubStatusChange = (newStatus, status) => {
		createUserLog({
			userId: user?._id,
			action: 'UPDATE',
			entity: 'Lead',
			enityType: 'Lead',
			entityId: lead?._id || null,
			status,
			message: `${user?.fullName} updated lead sub-status from '${
				selected || 'No Status'
			}' to '${newStatus}'.`,
		});
	};

	const handleSubStatusError = (error) => {
		const message = error?.response?.data?.message || 'Something went wrong!';
		toast.error(message);
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
				onChange={handleSubStatus}
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

			{/* {closeDeal && (
				<CloseDealModal
					isOpen={closeDeal}
					onClose={() => setCloseDeal(false)}
					lead={lead}
					mode='add'
					onSuccess={handleCloseDealSuccess}
				/>
			)} */}

			{openQualification && (
				<CRMQualificationModal
					leadId={lead._id}
					userId={user?._id}
					isOpen={openQualification}
					onClose={() => setOpenQualification(false)}
					onSuccess={handleQualificationSuccess}
				/>
			)}
		</>
	);
};

export default Status;
