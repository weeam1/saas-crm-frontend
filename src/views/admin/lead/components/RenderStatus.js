import { Select } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import BoxLoading from 'components/shared/BoxLoading';

import { putApi } from 'services/api';

import { leadStatus } from 'utils/options';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';

const RenderStatus = ({
	id,
	lead,
	cellValue,
	rowOriginalStatus,
	updateRowStatus,
	countries,
}) => {
	const [value, setValue] = useState(cellValue || rowOriginalStatus || '');
	const [loading, setLoading] = useState(false);

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	const setStatusData = async (e) => {
		try {
			setLoading(true);
			const data = {
				leadStatus: e.target.value,
			};

			let response = await putApi(`api/lead/changeStatus/${id}`, data);
			if (response.status === 200) {
				setValue(data.leadStatus);
				updateRowStatus(id, data.leadStatus);
				toast.success('Lead Status Updated!');

				// update user activity log
				createUserLog({
					userId: user?._id,
					action: 'UPDATE',
					entity: 'Lead',
					enityType: 'Lead',
					entityId: lead._id || null,
					status: 'success',
					message: `${user?.fullName} update the lead status from '${value || 'No Status'} to '${data.leadStatus}'.`,
				});
			}
		} catch (e) {
			console.log(e);
			toast.error('Something went wrong!');

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

	useEffect(() => {
		// setValue(cellValue || rowOriginalStatus); // Sync state when props change

		if (rowOriginalStatus) {
			setValue(rowOriginalStatus);
		} else setValue(cellValue);
	}, [cellValue, rowOriginalStatus]);

	const changeStatus = (value) => {
		switch (value) {
			case 'pending':
				return 'pending';
			case 'active':
				return 'interested'; // Updated to match the status name
			case 'sold':
				return 'sold';
			case 'not_interested':
				return 'notInterested';
			case 'interested_seller':
				return 'interestedSeller';
			case 'interested_buyer':
				return 'interestedBuyer';
			case 'reassigned':
				return 'reassigned';
			case 'new':
				return 'new';
			case 'no_answer':
				return 'noAnswer';
			case 'unreachable':
				return 'unreachable';
			case 'waiting':
				return 'waiting';
			case 'follow_up':
				return 'followUp';
			case 'meeting':
				return 'meeting';
			case 'follow_up_after_meeting':
				return 'followUpAfterMeeting';
			case 'deal':
				return 'deal';
			case 'junk':
				return 'junk';
			case 'whatsapp_send':
				return 'whatsappSend';
			case 'whatsapp_rec':
				return 'whatsappRec';
			case 'deal_out':
				return 'dealOut';
			case 'shift_project':
				return 'shiftProject';
			case 'wrong_number':
				return 'wrongNumber';
			case 'broker':
				return 'broker';
			case 'voice_mail':
				return 'voiceMail';
			case 'request':
				return 'request';
			case 'will_attend_the_show':
				return 'willAttendTheShow';
			case 'attended_the_show':
				return 'attendedTheShow';
			case 'callback':
				return 'callback';
			default:
				return 'toDo'; // Default for unhandled statuses
		}
	};

	return loading ? (
		<BoxLoading />
	) : (
		<Select
			// defaultValue={"new"}
			className={changeStatus(value)}
			onChange={setStatusData}
			height={7}
			width={160}
			maxWidth={200}
			value={value || 'new'}
			style={{ fontSize: '14px' }}
		>
			{leadStatus.map((item) => (
				<option key={item.value} value={item.value}>
					{item.label}
				</option>
			))}
			{/* <option value='active'>Interested</option>
			<option value='sold'>Sold</option>
			<option value='pending'>Not interested</option>
			<option value='reassigned'>Reassigned</option>
			<option value='new'>New</option>
			<option value='no_answer'>No Answer</option>
			<option value='unreachable'>Unreachable</option>

			<option value='waiting'>Waiting</option>
			<option value='follow_up'>Follow Up</option>
			<option value='meeting'>Meeting</option>
			<option value='follow_up_after_meeting'>Follow Up After Meeting</option>
			<option value='deal'>Deal</option>
			<option value='junk'>Junk</option>
			<option value='whatsapp_send'>Whatsapp Send</option>
			<option value='whatsapp_rec'>Whatsapp Rec</option>
			<option value='deal_out'>Deal Out</option>
			<option value='shift_project'>Shift Project</option>
			<option value='wrong_number'>Wrong Number</option>
			<option value='broker'>Broker</option>
			<option value='voice_mail'>Voice Mail</option>
			<option value='request'>Request</option>
			<option value='will_attend_the_show'>Will attend the show</option>
			<option value='attended_the_show'>Attended the show</option>
			<option value='callback'>Callback</option> */}
		</Select>
	);
};

export default RenderStatus;
