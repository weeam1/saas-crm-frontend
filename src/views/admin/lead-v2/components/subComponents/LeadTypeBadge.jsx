import { Badge } from '@chakra-ui/react';
import { leadlabelFontSize, leadValueFontSize } from '../constants';

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
				fontSize={leadlabelFontSize}
				size='xs'
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
