export const filterRoutes = (routes, hasPermission) => {
	return routes
		.map((route) => {
			// keep routes without moduleId always
			if (!route.moduleId) {
				const children = route.children
					? filterRoutes(route.children, hasPermission)
					: undefined;

				return { ...route, children };
			}

			// module-level permission check
			if (!hasPermission(route.moduleId)) {
				return null;
			}

			// if module has children, filter each child with (moduleId, childId)
			const children = route.children
				? route.children.filter((child) =>
						hasPermission(route.moduleId, child.id)
					)
				: undefined;

			return { ...route, children };
		})
		.filter(Boolean);
};
