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
import { deleteLead, updateLeadField } from '../../../../../redux/leadsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { sendLeadFeedback } from 'api';
import CustomTooltip from 'components/shared/CustomTooltip';
import { extractLocationData } from 'utils/helpers';
import CloseDealModal from '../deals/CloseDealModal';

const MainStatus = ({ lead, role }) => {
	const [selected, setSelected] = useState('' || lead?.eLeadStatus);
	const [label, setLabel] = useState('');
	const [loading, setLoading] = useState(false);

	const [closeDeal, setCloseDeal] = useState(false);

	const countries = useSelector((state) => state.countries.countryNames);

	const dispatch = useDispatch();

	const hanldeMainStatus = async (statusOrEvent, options = {}) => {
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
			const response = await putApi(
				`api/lead/update/e-status/${lead?._id}`,
				data
			);

			if (response.status === 200) {
				setSelected(newStatus);
				toast.success('Main Lead Status Updated!');

				dispatch(
					updateLeadField({
						id: lead?._id,
						key: 'eLeadStatus',
						value: newStatus,
					})
				);

				// if (newStatus === 'deal') {
				// 	dispatch(deleteLead(lead?._id));
				// }

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
				}
			} else if (response.status === 400) {
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

	const handleCloseDealSuccess = async () => {
		setCloseDeal(false);
		hanldeMainStatus('deal', { skipDealModal: true });
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
				isDisabled={
					(selected === 'deal' && ['Agent', 'Manager'].includes(role)) ||
					loading
				}
				borderColorCustom='brand.600'
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
		</>
	);
};

export default MainStatus;
