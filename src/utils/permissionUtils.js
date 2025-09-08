export const buildPermissionMap = (user) => {
	if (!user?.roles?.length) return {};

	const map = {};
	user.roles.forEach((role) => {
		role?.permissions?.forEach(({ moduleId, isModuleEnabled, actions }) => {
			map[`${moduleId}:__module`] = !!isModuleEnabled;
			actions?.forEach(({ actionKey, isAllowed }) => {
				map[`${moduleId}:${actionKey}`] = !!isAllowed;
			});
		});
	});

	return map;
};

export const checkPermission = (map, moduleId, actionKey = null) => {
	const key = actionKey ? `${moduleId}:${actionKey}` : `${moduleId}:__module`;
	return !!map[key];
};
