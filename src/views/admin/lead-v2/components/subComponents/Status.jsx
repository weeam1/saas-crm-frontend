import SelectInput from 'components/shared/SelectInput';
import { leadStatus } from 'utils/options';
import { HStack, Icon, Text } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
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
import { eventLeadStatus } from 'utils/options';
import { sendLeadFeedback } from 'api';
import CustomTooltip from 'components/shared/CustomTooltip';
import { extractLocationData } from 'utils/helpers';

const Status = ({ lead }) => {
	const [selected, setSelected] = useState('' || lead?.leadStatus);
	const [label, setLabel] = useState('');
	const [bgColor, setBgColor] = useState('');
	const [textColor, setTextColor] = useState('');

	const countries = useSelector((state) => state.countries.countryNames);

	const [loading, setLoading] = useState(false);
	const [inviteModal, setInviteModal] = useState(false);

	const dispatch = useDispatch();

	const handleStatus = async (e) => {
		try {
			setLoading(true);
			const data = {
				leadStatus: e.target.value,
			};

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
				toast.success('Lead Status Updated!');

				if (data.leadStatus === 'will_attend_the_show') {
					setInviteModal(true);
				}

				// check if status is event lead status
				if (eventLeadStatus.includes(data.leadStatus)) {
					const leadEmail = lead?.leadEmail ?? '';
					const leadPhone =
						typeof lead?.leadPhoneNumber === 'object'
							? lead?.leadPhoneNumber?.result
							: lead?.leadPhoneNumber;

					const { ip } = extractLocationData(lead?.ip, countries);

					sendLeadFeedback({
						email: leadEmail,
						phone: leadPhone,
						status: data.leadStatus,
						action: 'Status',
						ip,
						fcblid: lead?.fcblid || null,
					});
				}
			}
		} catch (e) {
			console.log(e);
			toast.error('Something went wrong!');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const selectedOption = leadStatus.find((item) => item.value === selected);

		if (selectedOption) {
			setBgColor(selectedOption.bgColor || 'white');
			setTextColor(selectedOption.textColor || 'black');
			setLabel(selectedOption?.label);
		} else {
			setBgColor('white');
			setTextColor('black');
		}
	}, [selected]);

	return (
		<>
			<HStack alignItems='center' justifyContent='space-between'>
				<Text
					fontWeight='medium'
					fontSize={leadlabelFontSize}
					color='softGray.200'
					mr={2}
				>
					Status
				</Text>
				{/* 
				<Tooltip label={label} closeOnClick={false} hasArrow>
					<Icon as={InfoIcon} boxSize={leadIconSize} color='blue.300' />
				</Tooltip> */}
				<CustomTooltip label={label}>
					<Icon as={InfoIcon} boxSize={leadIconSize} color='blue.300' />
				</CustomTooltip>
			</HStack>
			<SelectInput
				name='leadStatus'
				options={leadStatus}
				placeholder='Select'
				selectedValue={selected}
				loading={loading}
				onChange={handleStatus}
				bgColorCustom={bgColor}
				textColorCustom={textColor}
				size={leadSelectInputSize}
			/>

			{inviteModal && (
				<InvitationModal
					onClose={() => setInviteModal(false)}
					isOpen={inviteModal}
					lead={lead}
				/>
			)}
		</>
	);
};

export default Status;
