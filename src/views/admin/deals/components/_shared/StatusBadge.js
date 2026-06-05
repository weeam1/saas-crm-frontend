const { Badge } = require('@chakra-ui/react');

export const StatusBadge = ({ status }) => {
	const statusConfig = {
		'fully paid': { color: 'green', label: 'Paid' },
		'partially paid': { color: 'orange', label: 'Partial Paid' },
		pending: { color: 'yellow', label: 'Pending' },
		rejected: { color: 'red', label: 'Rejected' },
		default: { color: 'gray', label: status },
	};

	const config = statusConfig[status.toLowerCase()] || statusConfig.default;

	console.log({ status, config });

	return (
		<Badge
			colorScheme={config.color}
			px={2}
			variant='solid'
			borderRadius='md'
			fontSize='xs'
			fontWeight='bold'
			textTransform='uppercase'
			maxWidth='fit-content'
		>
			{config.label}
		</Badge>
	);
};
