import { useCallback, useMemo, useState } from 'react';
import {
	Box,
	FormControl,
	FormLabel,
	Select,
	Spinner,
	useToast,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { useUpdateItemMutation } from 'api/apiSlice';

const RANKING_OPTIONS = [
	{ label: 'Normal', value: 'NORMAL', bg: 'gray.100', color: 'gray.800' },
	{ label: 'Good', value: 'GOOD', bg: 'blue.100', color: 'blue.800' },
	{
		label: 'Excellent',
		value: 'EXCELLENT',
		bg: 'green.100',
		color: 'green.800',
	},
];

const UserRankingSelect = ({ user }) => {
	const [updateUser, { isLoading }] = useUpdateItemMutation();
	const [value, setValue] = useState(user?.ranking || '');

	const currentStyle = useMemo(
		() => RANKING_OPTIONS.find((o) => o.value === value) || {},
		[value],
	);

	const handleChange = useCallback(
		async (e) => {
			const newValue = e.target.value;
			if (!newValue || newValue === value) return;

			const previous = value;
			setValue(newValue); // optimistic update

			try {
				await updateUser({
					path: `/v3/users/${user._id}`,
					body: { ranking: newValue },
				}).unwrap();

				toast.success('Ranking updated');
			} catch (error) {
				setValue(previous); // rollback
				toast.error('Failed to update ranking');
			}
		},
		[user?._id, updateUser, value],
	);

	if (!user?._id) return 'N/A';

	return (
		<>
			<Select
				value={isLoading ? '' : value}
				onChange={handleChange}
				isDisabled={isLoading}
				borderRadius='md'
				size='sm'
				bg={currentStyle.bg || 'gray.50'}
				color={currentStyle.color || 'gray.700'}
				fontWeight='semibold'
			>
				{/* Show updating option when loading */}
				{isLoading && (
					<option value='' disabled>
						Updating...
					</option>
				)}
				{/* Always show the ranking options */}
				<option value='' disabled>
					Select ranking
				</option>

				{RANKING_OPTIONS.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</Select>
		</>
	);
};

export default UserRankingSelect;
