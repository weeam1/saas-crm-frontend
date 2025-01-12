import { Badge } from "@chakra-ui/react";

const LeadTypeBadge = ({ leadType, roleName }) => {
	const badgeDetails = {
		leadpool: { role: "Agent", color: "green", text: "Pool" },
		release: { role: "Manager", color: "pink", text: "Release" },
	};

	console.log({ leadType, roleName });

	const badgeInfo = badgeDetails[leadType];

	if (badgeInfo && badgeInfo.role === roleName) {
		return (
			<Badge
				colorScheme={badgeInfo.color}
				fontSize="0.7rem"
				size="sm"
				p="2px"
				rounded="full"
				textTransform="capitalize"
			>
				{badgeInfo.text}
			</Badge>
		);
	}
	return null;
};

export default LeadTypeBadge;
