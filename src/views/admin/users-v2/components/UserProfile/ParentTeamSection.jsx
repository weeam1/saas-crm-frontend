import {
	Grid,
	GridItem,
	Avatar,
	Text,
	VStack,
	HStack,
	Badge,
	Link,
	Box,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import CustomTooltip from 'components/shared/CustomTooltip';
import { usePermissions } from 'hooks/usePermissions';

const ParentTeamSection = ({ user }) => {
	const { hasPermission } = usePermissions();

	const renderPersonCard = (person, type) => {
		if (!person) return null;

		return (
			<Box
				p={2}
				bg='gray.50'
				borderRadius='lg'
				border='1px solid'
				borderColor='gray.200'
				_hover={{ bg: 'gray.100', transition: 'all 0.2s' }}
			>
				<HStack spacing={3}>
					<Avatar
						size='sm'
						name={person.fullName}
						src={person.profileImage}
						bg={type === 'parent' ? 'purple.500' : 'teal.500'}
						color='white'
					/>
					<VStack align='start' spacing={1} flex={1}>
						<HStack justify='space-between' w='full'>
							<Text
								fontSize={{ base: 'xs', md: 'sm' }}
								fontWeight='semibold'
								w='100%'
								isTruncated
								color='gray.800'
							>
								{person.fullName}
							</Text>
							{/* <Badge
								colorScheme={type === 'parent' ? 'purple' : 'teal'}
								fontSize='xs'
							>
								{type === 'parent' ? 'Manager' : person.roles?.[0]?.roleName}
							</Badge> */}
						</HStack>
						{hasPermission('users') && (
							<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.600'>
								{person.username}
							</Text>
						)}
						{/* <Text fontSize='sm' color='gray.500'>
							{person.agency?.name || 'No Agency'}
						</Text> */}
					</VStack>
					{hasPermission('users') && (
						<CustomTooltip label='User Details'>
							<Link
								as={NavLink}
								to={`/users-v2/${person?._id}`}
								display='inline-flex'
								alignItems='center'
								color='gray.400'
								cursor='pointer'
								_hover={{ color: 'gray.600' }}
							>
								<ChevronRightIcon />
							</Link>
						</CustomTooltip>
					)}

					{/* <ChevronRightIcon color='gray.400' /> */}
				</HStack>
			</Box>
		);
	};

	return (
		<Grid
			templateColumns={{
				base: '1fr',
				md: user.parent && user.teamLead ? 'repeat(2, 1fr)' : '1fr',
			}}
			gap={6}
		>
			{user.parent && (
				<GridItem>
					<VStack align='stretch' spacing={3}>
						<Text fontSize='md' fontWeight='semibold' color='gray.700'>
							Manager
						</Text>
						{renderPersonCard(user.parent, 'parent')}
					</VStack>
				</GridItem>
			)}

			{user.teamLead && (
				<GridItem>
					<VStack align='stretch' spacing={3}>
						<Text fontSize='md' fontWeight='semibold' color='gray.700'>
							Team Leader
						</Text>
						{renderPersonCard(user.teamLead, 'teamLead')}
					</VStack>
				</GridItem>
			)}
		</Grid>
	);
};

ParentTeamSection.propTypes = {
	user: PropTypes.object.isRequired,
};

export default ParentTeamSection;
