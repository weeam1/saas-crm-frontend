import { HStack, Icon, Text } from '@chakra-ui/react';
import SelectInput from 'components/shared/SelectInput';
import { useEffect, useState } from 'react';

import {
	leadIconSize,
	leadlabelFontSize,
	leadSelectInputSize,
} from '../constants';
import { InfoIcon } from '@chakra-ui/icons';
import { putApi } from 'services/api';
import { toast } from 'react-toastify';
import { updateLeadFields } from '../../../../../redux/leadsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { sendLeadFeedback } from 'api';
import CustomTooltip from 'components/shared/CustomTooltip';
import { extractLocationData } from 'utils/helpers';
import CloseDealModal from '../deals/CloseDealModal';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import useUserSession from 'hooks/useUserSession';
import { useLeadStatuses } from 'hooks/leads/useLeadStatuses';
import CRMQualificationModal from '../CrmQualificationModal';

const AdminStatus = ['deal', 'show'];
// const AdminStatus = ['deal'];

const MainStatus = ({ lead, role }) => {
	const [selected, setSelected] = useState('' || lead?.eLeadStatus);
	const [loading, setLoading] = useState(false);
	const [currentStatus, setCurrentStatus] = useState(null);
	const [pendingStatus, setPendingStatus] = useState(null);

	const [closeDeal, setCloseDeal] = useState(false);
	const [openQualification, setOpenQualification] = useState(false);

	const layoutView = localStorage.getItem('leadView') || 'grid';

	// const countries = useSelector((state) => state.countries.countryNames);

	const dispatch = useDispatch();

	const { leadStatuses } = useLeadStatuses();
	const { user, userRoleName } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	useEffect(() => {
		const selectedOption = leadStatuses?.find(
			(item) => item.value === selected,
		);

		if (selectedOption) {
			setCurrentStatus(selectedOption);
		} else setCurrentStatus(null);
	}, [selected]);

	// const hanldeMainStatus = async (statusOrEvent, options = {}) => {
	// 	try {
	// 		const newStatus =
	// 			typeof statusOrEvent === 'string'
	// 				? statusOrEvent
	// 				: statusOrEvent?.target?.value;

	// 		const data = {
	// 			eLeadStatus: newStatus,
	// 		};

	// 		const { skipModal = false } = options;

	// 		if (userRoleName !== 'superAdmin' && AdminStatus.includes(selected)) {
	// 			return toast.error('Only super admin can change main status');
	// 		}

	// 		// check qualification added
	// 		if (!lead?.isQualification) {
	// 			return setOpenQualification(true);
	// 		}

	// 		if (newStatus === 'deal' && !skipModal) {
	// 			return setCloseDeal(true);
	// 		}

	// 		setLoading(true);
	// 		const response = await putApi(
	// 			`api/lead/update/e-status/${lead?._id}`,
	// 			data,
	// 		);

	// 		if (response.status === 200) {
	// 			setSelected(newStatus);
	// 			!skipModal && toast.success('Main Lead Status Updated!');

	// 			dispatch(
	// 				updateLeadFields({
	// 					id: lead?._id,
	// 					updates: [
	// 						{ key: 'eLeadStatus', value: newStatus },
	// 						{ key: 'leadStatus', value: null },
	// 					],
	// 				}),
	// 			);

	// 			// if (newStatus === 'deal') {
	// 			// 	dispatch(deleteLead(lead?._id));
	// 			// }

	// 			if (newStatus) {
	// 				const mainStatusData = leadStatuses?.find(
	// 					(status) => status.value === newStatus,
	// 				);

	// 				// check the main status has meta id
	// 				if (mainStatusData?.meta_id) {
	// 					const leadEmail = lead?.leadEmail ?? '';
	// 					const leadPhone =
	// 						typeof lead?.leadPhoneNumber === 'object'
	// 							? lead?.leadPhoneNumber?.result
	// 							: lead?.leadPhoneNumber;

	// 					const { ip, city, country } = extractLocationData(lead?.ip);

	// 					sendLeadFeedback({
	// 						email: leadEmail,
	// 						phone: leadPhone,
	// 						status: mainStatusData,
	// 						action: 'MStatus',
	// 						fcblid: lead?.fcblid || null,
	// 						fbp: lead?.fbp || null,
	// 						ip,
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
	// 			// if (eventMainLeadStatus.includes(newStatus)) {

	// 			// }

	// 			// update user activity log
	// 			createUserLog({
	// 				userId: user?._id,
	// 				action: 'UPDATE',
	// 				entity: 'Lead',
	// 				enityType: 'Lead',
	// 				entityId: lead._id || null,
	// 				status: 'success',
	// 				message: `${user?.fullName} update the lead main status from '${selected || 'No Status'} to '${newStatus}'.`,
	// 			});
	// 		} else if (response.status !== 200) {
	// 			const errorDetails =
	// 				response?.response?.data?.message || 'Invalid request data.';
	// 			toast.error(`${errorDetails}`);

	// 			// update user activity log
	// 			createUserLog({
	// 				userId: user?._id,
	// 				action: 'UPDATE',
	// 				entity: 'Lead',
	// 				enityType: 'Lead',
	// 				entityId: lead._id || null,
	// 				status: 'fail',
	// 				message: `failed to update the lead main status'.`,
	// 			});
	// 		} else {
	// 			toast.error('Something went wrong!');
	// 			// update user activity log
	// 			createUserLog({
	// 				userId: user?._id,
	// 				action: 'UPDATE',
	// 				entity: 'Lead',
	// 				enityType: 'Lead',
	// 				entityId: lead._id || null,
	// 				status: 'error',
	// 				message: `failed to update the lead main status'.`,
	// 			});
	// 		}
	// 	} catch (error) {
	// 		// Check if the error contains response data
	// 		if (error.response?.status === 400) {
	// 			const errorDetails =
	// 				error.response.data?.message || 'Invalid input provided.';
	// 			toast.error(`Bad Request: ${errorDetails}`);

	// 			// update user activity log
	// 			createUserLog({
	// 				userId: user?._id,
	// 				action: 'UPDATE',
	// 				entity: 'Lead',
	// 				enityType: 'Lead',
	// 				entityId: lead._id || null,
	// 				status: 'fail',
	// 				message: `failed to update the lead main status'.`,
	// 			});
	// 		} else {
	// 			console.error('Unexpected error:', error);
	// 			toast.error('Something went wrong!');

	// 			// update user activity log
	// 			createUserLog({
	// 				userId: user?._id,
	// 				action: 'UPDATE',
	// 				entity: 'Lead',
	// 				enityType: 'Lead',
	// 				entityId: lead._id || null,
	// 				status: 'error',
	// 				message: `failed to update the lead main status'.`,
	// 			});
	// 		}
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	const resolveStatus = (statusOrEvent) =>
		typeof statusOrEvent === 'string'
			? statusOrEvent
			: (statusOrEvent?.target?.value ?? '');

	const hanldeMainStatus = (statusOrEvent) => {
		const newStatus = resolveStatus(statusOrEvent);

		if (userRoleName !== 'superAdmin' && AdminStatus.includes(selected)) {
			return toast.error('Only super admin can change main status');
		}

		if (!lead?.isQualification) {
			setPendingStatus(newStatus);
			return setOpenQualification(true);
		}

		if (newStatus === 'deal') {
			setPendingStatus(newStatus);
			return setCloseDeal(true);
		}

		executeStatusUpdate(newStatus);
	};

	const executeStatusUpdate = async (newStatus, { silent = false } = {}) => {
		setLoading(true);

		try {
			const response = await putApi(`api/lead/update/e-status/${lead?._id}`, {
				eLeadStatus: newStatus,
			});

			if (response.status !== 200) {
				throw response;
			}

			setSelected(newStatus);
			!silent && toast.success('Main Lead Status Updated!');

			let updates = [
				{ key: 'eLeadStatus', value: newStatus },
				{ key: 'leadStatus', value: null },
			];

			if (!lead?.isQualification) {
				updates.push({ key: 'isQualification', value: true });
			}

			dispatch(
				updateLeadFields({
					id: lead?._id,
					updates,
				}),
			);

			handleMetaFeedback(newStatus);
			logStatusChange(newStatus, 'success');
		} catch (error) {
			handleStatusError(error);
			logStatusChange(newStatus, error?.status === 500 ? 'error' : 'fail');
		} finally {
			setLoading(false);
		}
	};

	const handleMetaFeedback = (newStatus) => {
		const mainStatusData = leadStatuses?.find(
			(status) => status.value === newStatus,
		);

		if (!mainStatusData?.meta_id) return;

		const leadPhone =
			typeof lead?.leadPhoneNumber === 'object'
				? lead?.leadPhoneNumber?.result
				: lead?.leadPhoneNumber;

		const { ip, city, country } = extractLocationData(lead?.ip);

		sendLeadFeedback({
			email: lead?.leadEmail ?? '',
			phone: leadPhone,
			status: mainStatusData,
			action: 'MStatus',
			fcblid: lead?.fcblid || null,
			fbp: lead?.fbp || null,
			ip,
			country,
			city,
			zip: lead?.zip || null,
			userAgent: lead?.userAgent || null,
			leadName: lead?.leadName,
			leadId: lead?.intID,
		});
	};

	const logStatusChange = (newStatus, status) => {
		createUserLog({
			userId: user?._id,
			action: 'UPDATE',
			entity: 'Lead',
			enityType: 'Lead',
			entityId: lead?._id || null,
			status,
			message: `${user?.fullName} updated lead status from '${
				selected || 'No Status'
			}' to '${newStatus}'.`,
		});
	};

	const handleStatusError = (error) => {
		const message = error?.response?.data?.message || 'Something went wrong!';
		toast.error(message);
	};

	const handleCloseDealSuccess = () => {
		setCloseDeal(false);
		executeStatusUpdate(pendingStatus ?? 'deal', { silent: true });
		setPendingStatus(null);
	};

	const handleQualificationSuccess = () => {
		setOpenQualification(false);
		executeStatusUpdate(pendingStatus ?? '', { silent: true });
		setPendingStatus(null);
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
						M Status
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
				name='eLeadStatus'
				// options={mainLeadStatus || []}
				options={leadStatuses || []}
				placeholder='Select'
				selectedValue={selected}
				// bgColorCustom={selected === 'deal' ? 'green.300' : 'brand.300'}
				loading={loading}
				isDisabled={
					(selected === 'deal' &&
						['Agent', 'Manager', 'Team Leader'].includes(role)) ||
					loading
				}
				// borderColorCustom={selected === 'deal' ? 'green.500' : 'brand.600'}
				bgColorCustom={currentStatus?.bgColor}
				textColorCustom={currentStatus?.textColor}
				borderColorCustom={currentStatus?.color}
				size={leadSelectInputSize}
				onChange={hanldeMainStatus}
			/>

			{closeDeal && (
				<CloseDealModal
					isOpen={closeDeal}
					onClose={() => setCloseDeal(false)}
					lead={lead}
					mode='add'
					onSuccess={handleCloseDealSuccess}
				/>
			)}

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

export default MainStatus;
