export const buildPermissionMap = (user) => {
	if (!user?.roles?.length && !user?.permissionOverrides?.length) return {};

	let permissions = [];
	if (user?.permissionOverrides?.length > 0) {
		permissions = user?.permissionOverrides;
	} else if (user?.roles?.[0]?.permissions?.length > 0) {
		permissions = user?.roles?.[0]?.permissions;
	} else {
		return {};
	}

	const map = {};
	permissions?.forEach(({ moduleId, isModuleEnabled, actions }) => {
		map[`${moduleId}:__module`] = !!isModuleEnabled;
		actions?.forEach(({ actionKey, isAllowed }) => {
			map[`${moduleId}:${actionKey}`] = !!isAllowed;
		});
	});

	// user.roles.forEach((role) => {
	// 	role?.permissions?.forEach(({ moduleId, isModuleEnabled, actions }) => {
	// 		map[`${moduleId}:__module`] = !!isModuleEnabled;
	// 		actions?.forEach(({ actionKey, isAllowed }) => {
	// 			map[`${moduleId}:${actionKey}`] = !!isAllowed;
	// 		});
	// 	});
	// });

	return map;
};

export const checkPermission = (map, moduleId, actionKey = null) => {
	const key = actionKey ? `${moduleId}:${actionKey}` : `${moduleId}:__module`;
	return !!map[key];
};
