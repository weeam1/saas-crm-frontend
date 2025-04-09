import { Switch, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useUpdateItemMutation } from 'api/apiSlice';

const StatusToggle = ({ userId, initialStatus, role }) => {
	const [isActive, setIsActive] = useState(initialStatus);

	const [updateItemMutation, { isLoading }] = useUpdateItemMutation();

	const handleToggle = async () => {
		try {
			const newStatus = !isActive;

			await updateItemMutation({
				path: `/v2/user/status/${userId}`,
				body: { isActive: newStatus },
			}).unwrap();

			setIsActive(newStatus);
			toast.success(`User ${newStatus ? 'enabled' : 'disabled'} successfully`);
		} catch (error) {
			toast.error('Error updating user status');
		}
	};

	return (
		<Text
			color={isActive ? 'green.400' : 'red.400'}
			fontSize='sm'
			fontWeight='700'
		>
			{isActive ? 'Enable' : 'Disable'}
			<Switch
				ml={2}
				colorScheme='brand'
				isChecked={isActive}
				disabled={role === 'superAdmin'}
				onChange={handleToggle}
			/>
		</Text>
	);
};

export default StatusToggle;
