import { useSelector } from 'react-redux';
import { checkPermission } from '../utils/permissionUtils';

export const usePermissions = () => {
	const permissionMap = useSelector((state) => state.permissions.permissionMap);

	const hasPermission = (moduleId, actionKey) =>
		checkPermission(permissionMap, moduleId, actionKey);

	return { hasPermission };
};
