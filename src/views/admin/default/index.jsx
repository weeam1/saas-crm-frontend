import { Box } from '@chakra-ui/react';

import Header from './components/Header';
import useUserSession from 'hooks/useUserSession';
import PermissionSection from './components/PermissionSection';
import { usePermissions } from 'hooks/usePermissions';
import AppDashboard from './AppDashboard';
import AppsDownloadSection from './components/AppsDownloadSection';

export default function Dashboard() {
	const { user, userRoleName } = useUserSession();
	const { hasPermission } = usePermissions();

	const dashboardRoleAccess = [
		'superAdmin',
		'Manager',
		'Agent',
		'Admin',
	].includes(userRoleName);

	return (
		<Box>
			<Header />

			{/* Main Dashboard Access */}
			{hasPermission('dashboard') ? (
				<AppDashboard />
			) : (
				<Box bg={'white'} py={1} borderRadius={'md'}>
					<PermissionSection />
				</Box>
			)}

			<AppsDownloadSection />
		</Box>
	);
}
