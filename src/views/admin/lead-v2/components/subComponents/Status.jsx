import SelectInput from 'components/shared/SelectInput';
import { leadStatus } from 'utils/options';
import { HStack, Icon, Text, Tooltip } from '@chakra-ui/react';
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
import { useDispatch } from 'react-redux';
import CustomTooltip from './CustomTooltip';
import InvitationModal from './InvitationModal';

const Status = ({ lead, refreshLeads }) => {
	const [selected, setSelected] = useState('' || lead?.leadStatus);
	const [label, setLabel] = useState('');
	const [bgColor, setBgColor] = useState('');
	const [textColor, setTextColor] = useState('');

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
					leadName={lead?.leadName}
					leadId={lead?._id}
				/>
			)}
		</>
	);
};

export default Status;
