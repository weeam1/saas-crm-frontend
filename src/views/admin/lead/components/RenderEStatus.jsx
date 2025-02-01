import { Select } from '@chakra-ui/react';
import BoxLoading from 'components/shared/BoxLoading';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { putApi } from 'services/api';

const RenderEStatus = ({ id, cellValue, user }) => {
	const [value, setValue] = useState('');
	const [loading, setLoading] = useState(false);

	const isSuperAdmin = user.role === 'superAdmin';

	const setStatusData = async (e) => {
		try {
			const data = {
				eLeadStatus: e.target.value,
			};

			setLoading(true);

			const response = await putApi(`api/lead/update/e-status/${id}`, data);

			if (response.status === 200) {
				setValue(data.eLeadStatus);
				toast.success('Extra Lead Status Updated!');
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
		setValue(cellValue || '');
	}, [cellValue, id]);

	return loading ? (
		<BoxLoading />
	) : (
		<Select
			defaultValue=''
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
				Choose E.Status
			</option>
			<option value='interested'>Interested</option>
			<option value='not-interested'>Not interested</option>
			<option value='no-response'>No response</option>
			<option value='hot'>Hot</option>
			<option value='secondary-request'>Secondary request</option>
			<option value='show'>Show</option>
			<option value='junk'>Junk</option>
			<option value='deal'>Deal</option>
			<option value='change-agent'>Change Agent</option>
		</Select>
	);
};

export default RenderEStatus;
