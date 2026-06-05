import { Flex, Avatar, Text, Box } from '@chakra-ui/react';
import { constant } from 'constant';

const UserProfileCell = ({ user }) => {
	const imgSrc = user?.profileImage
		? `${constant.baseUrl}${user.profileImage}`
		: undefined;

	return (
		<Flex align='center' gap={3}>
			<Avatar size='md' src={imgSrc} name={user.fullName} />
			<Box>
				<Text fontWeight='semibold' color='gray.100' fontSize='sm'>
					{user.fullName}
				</Text>
				<Text fontSize='xs' color='gray.400' textTransform='capitalize'>
					{user.roles?.[0]?.roleName || 'User'}
				</Text>
			</Box>
		</Flex>
	);
};

export default UserProfileCell;
