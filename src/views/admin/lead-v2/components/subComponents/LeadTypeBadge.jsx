import { Badge } from '@chakra-ui/react';

const LeadTypeBadge = ({ leadType, roleName }) => {
	const badgeDetails = {
		leadpool: { role: ['Agent', 'Manager'], color: 'green', text: 'Pool' },
		release: {
			role: ['Manager', 'superAdmin'],
			color: 'pink',
			text: 'Release',
		},
		new: {
			role: ['Manager', 'Agent', 'superAdmin'],
			color: 'brand',
			text: 'New',
		},
	};

	const badgeInfo = badgeDetails[leadType];

	if (badgeInfo && badgeInfo.role.includes(roleName)) {
		return (
			<Badge
				colorScheme={badgeInfo.color}
				fontSize='0.7rem'
				size='sm'
				p='4px'
				rounded='full'
				textTransform='capitalize'
			>
				{badgeInfo.text}
			</Badge>
		);
	}
	return null;
};

export default LeadTypeBadge;
