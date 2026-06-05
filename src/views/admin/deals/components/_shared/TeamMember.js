// TeamMember.jsx or inline in the same file
import { Box, Flex, Icon, Text, VStack } from '@chakra-ui/react';
import {
	FaUserShield,
	FaUserTie,
	FaUserCheck,
	FaUserTag,
} from 'react-icons/fa';

const roleConfig = {
	manager: { label: 'Manager', icon: FaUserShield },
	agent: { label: 'Agent', icon: FaUserTag },
	closedBy: { label: 'Closed By', icon: FaUserCheck },
	salesPerson: { label: 'Sales Person', icon: FaUserCheck },
};

export const TeamMember = ({ role, person }) => {
	if (!person) return null;

	const { label, icon } = roleConfig[role];

	return (
		<Flex gap='2' align='center'>
			<Icon as={icon} color='gray.400' boxSize={3} />
			<Box>
				<Text fontSize='x-small' color='text.inverted'>
					{label}
				</Text>
				<Text fontSize='xs' color='text.inverted' isTruncated maxW='100px'>
					{person.fullName || person}
				</Text>
			</Box>
		</Flex>
	);
};
