import { HStack, Icon, Text, Tooltip } from '@chakra-ui/react';
import SelectInput from 'components/shared/SelectInput';
import { useEffect, useState } from 'react';

import { mainLeadStatus } from 'utils/options';
import {
	leadIconSize,
	leadlabelFontSize,
	leadSelectInputSize,
} from '../constants';
import { InfoIcon } from '@chakra-ui/icons';
import { putApi } from 'services/api';
import { toast } from 'react-toastify';

const MainStatus = ({ lead }) => {
	const [selected, setSelected] = useState('' || lead?.eLeadStatus);
	const [label, setLabel] = useState('');
	const [loading, setLoading] = useState(false);

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
			} else if (response.status === 400) {
				// Handle 400 Bad Request specifically
				console.log(response);
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
				<Tooltip label={label} closeOnClick={false} hasArrow>
					<Icon as={InfoIcon} boxSize={leadIconSize} color='blue.300' />
				</Tooltip>
			</HStack>
			<SelectInput
				name='eLeadStatus'
				options={mainLeadStatus}
				placeholder='Select'
				selectedValue={selected}
				textColorCustom='white'
				bgColorCustom='brand.300'
				loading={loading}
				borderColorCustom='brand.600'
				size={leadSelectInputSize}
				onChange={hanldeMainStatus}
			/>
		</>
	);
};

export default MainStatus;
