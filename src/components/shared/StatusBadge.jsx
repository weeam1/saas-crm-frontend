import { Badge, Flex } from '@chakra-ui/react';

const StatusBadge = ({ status, color, Icon, size }) => {
	return (
		<Flex align='center' gap={1}>
			{Icon && <Icon color={color} size={size} />}
			<Badge colorScheme={color}>{status}</Badge>
		</Flex>
	);
};

export default StatusBadge;
