import { Flex, Avatar, Text, Box } from '@chakra-ui/react';
import { constant } from 'constant';

const UserProfileCell = ({ user }) => {
	const imgSrc = user?.profileImage
		? `${constant.baseUrl}${user.profileImage}`
		: undefined;

	return (
		<Flex align='center' gap={3}>
			<Avatar size='sm' src={imgSrc} name={user.fullName} />
			<Box>
				<Text fontWeight='semibold' color='gray.800' fontSize='sm'>
					{user.fullName}
				</Text>
				<Text fontSize='xs' color='gray.500' textTransform='capitalize'>
					{user.roles?.[0]?.roleName || 'User'}
				</Text>
			</Box>
		</Flex>
	);
};

export default UserProfileCell;
