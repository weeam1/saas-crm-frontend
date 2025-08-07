import { Select } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { putApi } from 'services/api';
import { sendLeadFeedback } from 'api';

import BoxLoading from 'components/shared/BoxLoading';
import CloseDealModal from 'views/admin/lead-v2/components/deals/CloseDealModal';

import { mainLeadStatus, eventMainLeadStatus } from 'utils/options';
import { extractLocationData } from 'utils/helpers';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import useUserSession from 'hooks/useUserSession';

const RenderEStatus = ({ id, cellValue, lead, countries }) => {
	const [value, setValue] = useState('');
	const [loading, setLoading] = useState(false);
	const [closeDeal, setCloseDeal] = useState(false);

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	const setStatusData = async (statusOrEvent, options = {}) => {
		try {
			const newStatus =
				typeof statusOrEvent === 'string'
					? statusOrEvent
					: statusOrEvent?.target?.value;

			const data = {
				eLeadStatus: newStatus,
			};

			const { skipDealModal = false } = options;

			if (newStatus === 'deal' && !skipDealModal) {
				return setCloseDeal(true);
			}

			setLoading(true);

			const response = await putApi(`api/lead/update/e-status/${id}`, data);

			if (response.status === 200) {
				setValue(data.eLeadStatus);
				!skipDealModal && toast.success('Main Lead Status Updated!');

				// check if status is event lead status
				if (eventMainLeadStatus.includes(newStatus)) {
					const leadEmail = lead?.leadEmail ?? '';
					const leadPhone =
						typeof lead?.leadPhoneNumber === 'object'
							? lead?.leadPhoneNumber?.result
							: lead?.leadPhoneNumber;

					const { ip } = extractLocationData(lead?.ip, countries);

					sendLeadFeedback({
						email: leadEmail,
						phone: leadPhone,
						status: newStatus,
						action: 'MStatus',
						ip,
						fcblid: lead?.fcblid || null,
					});

					// update user activity log
					createUserLog({
						userId: user?._id,
						action: 'UPDATE',
						entity: 'Lead',
						entityId: lead._id || null,
						status: 'success',
						message: `${user?.fullName} update the lead main status from '${value || 'No Status'} to '${newStatus}'.`,
					});
				}
			} else if (response.status === 400) {
				// Handle 400 Bad Request specifically
				console.log(response);
				const errorDetails =
					response?.response?.data?.message || 'Invalid request data.';
				toast.error(`${errorDetails}`);
			} else {
				toast.error('Something went wrong!');
				// update user activity log
				createUserLog({
					userId: user?._id,
					action: 'UPDATE',
					entity: 'Lead',
					entityId: lead._id || null,
					status: 'error',
					message: `failed to update the lead main status'.`,
				});
			}
		} catch (error) {
			// Check if the error contains response data
			if (error.response?.status === 400) {
				const errorDetails =
					error.response.data?.message || 'Invalid input provided.';
				toast.error(`Bad Request: ${errorDetails}`);

				// update user activity log
				createUserLog({
					userId: user?._id,
					action: 'UPDATE',
					entity: 'Lead',
					entityId: lead._id || null,
					status: 'error',
					message: errorDetails,
				});
			} else {
				console.error('Unexpected error:', error);
				toast.error('Something went wrong!');

				// update user activity log
				createUserLog({
					userId: user?._id,
					action: 'UPDATE',
					entity: 'Lead',
					entityId: lead._id || null,
					status: 'error',
					message: `failed to update the lead main status'.`,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setValue(cellValue || '');
	}, [cellValue, id]);

	const handleCloseDealSuccess = async () => {
		setCloseDeal(false);
		setStatusData('deal', { skipDealModal: true });
	};

	return loading ? (
		<BoxLoading />
	) : (
		<>
			<Select
				onChange={setStatusData}
				height={7}
				width={160}
				maxWidth={200}
				value={value || ''}
				style={{
					fontSize: '14px',
					backgroundColor: '#faf5ea',
					color: '#bb892a',
					border: '1px solid #ebd3a6',
					padding: '4px 8px',
				}}
			>
				<option value='' disabled style={{ color: '#999' }}>
					Choose M.Status
				</option>
				{mainLeadStatus?.map((item) => (
					<option key={item.value} value={item.value}>
						{item.label}
					</option>
				))}
			</Select>

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

export default RenderEStatus;
