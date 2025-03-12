import { Flex } from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
import { useFetchItemsQuery } from 'api/apiSlice';
import TabButton from 'components/shared/TabButton';
import { useEffect } from 'react';

const RoleTabs = ({ updateFilters }) => {
	const [searchParams] = useSearchParams();
	const currentRole = searchParams.get('role') || 'All';
	const { data: roles } = useFetchItemsQuery({ path: '/role-access/v2' });

	const handleRoleChange = (roleName) => {
		updateFilters({
			role: roleName,
			page: 1,
		});
	};

	return (
		<Flex gap='2' px='4' width='fit-content'>
			<TabButton
				isActive={currentRole === 'All'}
				onClick={() => handleRoleChange('All')}
			>
				All
			</TabButton>
			{roles
				?.filter((role) => !['sadmin'].includes(role.roleName))
				?.map((role) => (
					<TabButton
						key={role._id}
						isActive={currentRole === role.roleName}
						onClick={() => handleRoleChange(role.roleName)}
					>
						{role.roleName}
					</TabButton>
				))}
		</Flex>
	);
};

export default RoleTabs;
