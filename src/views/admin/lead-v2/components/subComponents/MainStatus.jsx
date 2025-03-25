import { HStack, Icon, Text } from '@chakra-ui/react';
import SelectInput from 'components/shared/SelectInput';
import { useEffect, useState } from 'react';

import { mainLeadStatus, eventMainLeadStatus } from 'utils/options';
import {
	leadIconSize,
	leadlabelFontSize,
	leadSelectInputSize,
} from '../constants';
import { InfoIcon } from '@chakra-ui/icons';
import { putApi } from 'services/api';
import { toast } from 'react-toastify';
import { updateLeadField } from '../../../../../redux/leadsSlice';
import { useDispatch } from 'react-redux';
import CustomTooltip from './CustomTooltip';
import { sendLeadFeedback } from 'api';

const MainStatus = ({ lead, role }) => {
	const [selected, setSelected] = useState('' || lead?.eLeadStatus);
	const [label, setLabel] = useState('');
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();

	const hanldeMainStatus = async (e) => {
		try {
			const data = {
				eLeadStatus: e.target.value,
			};

			setLoading(true);
			const response = await putApi(
				`api/lead/update/e-status/${lead?._id}`,
				data
			);

			if (response.status === 200) {
				setSelected(data.eLeadStatus);
				toast.success('Main Lead Status Updated!');

				dispatch(
					updateLeadField({
						id: lead?._id,
						key: 'eLeadStatus',
						value: data.eLeadStatus,
					})
				);

				console.log(eventMainLeadStatus, data.eLeadStatus);
				// check if status is event lead status
				if (eventMainLeadStatus.includes(data.eLeadStatus)) {
					const leadEmail = lead?.leadEmail ?? '';
					const leadPhone =
						typeof lead?.leadPhoneNumber === 'object'
							? lead?.leadPhoneNumber?.result
							: lead?.leadPhoneNumber;

					sendLeadFeedback({
						email: leadEmail,
						phone: leadPhone,
						status: data.eLeadStatus,
					});
				}
			} else if (response.status === 400) {
				// Handle 400 Bad Request specifically

				const errorDetails =
					response?.response?.data?.message || 'Invalid request data.';
				toast.error(`${errorDetails}`);
			} else {
				toast.error('Something went wrong!');
			}
		} catch (error) {
			// Check if the error contains response data
			if (error.response?.status === 400) {
				const errorDetails =
					error.response.data?.message || 'Invalid input provided.';
				toast.error(`Bad Request: ${errorDetails}`);
			} else {
				console.error('Unexpected error:', error);
				toast.error('Something went wrong!');
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const selectedOption = mainLeadStatus.find(
			(item) => item.value === selected
		);

		if (selectedOption) {
			setLabel(selectedOption?.label);
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
					M Status
				</Text>
				<CustomTooltip label={label}>
					<Icon as={InfoIcon} boxSize={leadIconSize} color='blue.300' />
				</CustomTooltip>
			</HStack>
			<SelectInput
				name='eLeadStatus'
				options={mainLeadStatus || []}
				placeholder='Select'
				selectedValue={selected}
				textColorCustom='white'
				bgColorCustom='brand.300'
				loading={loading}
				isDisabled={(selected === 'deal' && role === 'Agent') || loading}
				borderColorCustom='brand.600'
				size={leadSelectInputSize}
				onChange={hanldeMainStatus}
			/>
		</>
	);
};

export default MainStatus;
