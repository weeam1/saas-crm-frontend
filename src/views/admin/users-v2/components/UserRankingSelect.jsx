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
import { useModalColors } from 'hooks/useModalColors';


const UserRankingSelect = ({ user }) => {

	const colors = useModalColors();

const RANKING_OPTIONS = [
	{ label: 'Normal', value: 'NORMAL', bg: `${colors.accentGold}15`, color: colors.accentGold },
	{ label: 'Good', value: 'GOOD', bg: `${colors.accentGold}25`, color: colors.accentGold },
	{ label: 'Excellent', value: 'EXCELLENT', bg: `${colors.accentGold}35`, color: colors.accentGold },
];
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
			setValue(newValue);

			try {
				await updateUser({
					path: `/v3/users/${user._id}`,
					body: { ranking: newValue },
				}).unwrap();

				toast.success('Ranking updated');
			} catch (error) {
				setValue(previous);
				toast.error('Failed to update ranking');
			}
		},
		[user?._id, updateUser, value],
	);

	if (!user?._id) return 'N/A';

	return (
		<Select
			value={isLoading ? '' : value}
			onChange={handleChange}
			isDisabled={isLoading}
			borderRadius='md'
			size='sm'
			bg={currentStyle.bg || colors.bgInput}
			color={currentStyle.color || colors.headingText}
			fontWeight='semibold'
			borderColor={colors.borderColor}
			_hover={{ borderColor: colors.accentGold }}
			_focus={{
				borderColor: colors.accentGold,
				boxShadow: `0 0 0 1px ${colors.accentGold}`
			}}
			transition='all 0.2s ease'
		>
			{isLoading && (
				<option value='' disabled style={{ background: colors.bg, color: colors.mutedText }}>
					Updating...
				</option>
			)}
			<option value='' disabled style={{ background: colors.bg, color: colors.mutedText }}>
				Select ranking
			</option>

			{RANKING_OPTIONS.map((opt) => (
				<option key={opt.value} value={opt.value} style={{ background: colors.bg, color: colors.headingText }}>
					{opt.label}
				</option>
			))}
		</Select>
	);
};

export default UserRankingSelect;