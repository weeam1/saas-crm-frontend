import {
	Flex,
	Tag,
	TagLabel,
	TagCloseButton,
	Text,
	Box,
} from '@chakra-ui/react';
import { useRoles } from 'hooks/user/userRoles';
import { CloseIcon } from '@chakra-ui/icons';
import { useModalColors } from 'hooks/useModalColors';

const ActiveFiltersDisplay = ({ filters, onClearFilters, users = [] }) => {
	const colors = useModalColors();
	const hasFilters = Object.keys(filters).length > 0;
	const { roles } = useRoles();

	if (!hasFilters) return null;

	const getDisplayValue = (key, value) => {
		switch (key) {
			case 'userId':
				const user = users?.doc?.find((u) => u._id === value);
				return user ? user.fullName : 'Unknown User';
			case 'role':
				const role = roles?.find((role) => role?._id === value);
				return role ? role.roleName : 'Unknown Role';
			case 'status':
				return value.charAt(0).toUpperCase() + value.slice(1);
			default:
				return value;
		}
	};

	const getTagLabel = (key) => {
		const labels = {
			userId: 'Employee',
			role: 'Role',
			status: 'Status',
			department: 'Department',
			position: 'Position',
		};
		return labels[key] || key;
	};

	return (
		<Box
			bg={colors.bg}
			border='1px solid'
			borderColor={colors.borderColor}
			borderRadius='lg'
			p={4}
			mb={4}
			boxShadow={colors.cardShadow}
		>
			<Flex justify='space-between' align='center' mb={3}>
				<Text fontSize='sm' fontWeight='medium' color={colors.mutedText}>
					Active Filters ({Object.keys(filters).length})
				</Text>
				<Tag
					size='sm'
					variant='subtle'
					cursor='pointer'
					onClick={() => onClearFilters()}
					_hover={{ bg: colors.badgeErrorBg }}
					transition='all 0.2s'
					bg={colors.badgeErrorBg}
					color={colors.badgeErrorText}
				>
					<TagLabel fontSize='xs' fontWeight='medium'>
						Clear All
					</TagLabel>
				</Tag>
			</Flex>

			<Flex gap={2} wrap='wrap'>
				{Object.entries(filters).map(([key, value]) => (
					<Tag
						key={key}
						size='md'
						variant='subtle'
						borderRadius='full'
						py={2}
						px={3}
						boxShadow='xs'
						border='1px solid'
						borderColor={colors.borderColor}
						bg={colors.bgInput}
						color={colors.bodyText}
					>
						<Flex align='center' gap={2}>
							<Text fontSize='xs' fontWeight='medium' color={colors.mutedText}>
								{getTagLabel(key)}:
							</Text>
							<TagLabel fontWeight='semibold' fontSize='sm' color={colors.headingText}>
								{getDisplayValue(key, value)}
							</TagLabel>
							<TagCloseButton
								onClick={() => onClearFilters(key)}
								size='sm'
								borderRadius='full'
								_hover={{ bg: colors.bgDeep, color: colors.accentGold }}
							/>
						</Flex>
					</Tag>
				))}
			</Flex>
		</Box>
	);
};

export default ActiveFiltersDisplay;