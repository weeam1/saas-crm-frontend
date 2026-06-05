// export const sidebarFilterRoutes = (routes, hasPermission) => {
// 	return routes
// 		.map((route) => {
// 			// keep routes without moduleId always
// 			if (!route.moduleId) {
// 				const children = route.children
// 					? sidebarFilterRoutes(route.children, hasPermission)
// 					: undefined;

// 				return { ...route, children };
// 			}

// 			// module-level permission check
// 			if (!hasPermission(route.moduleId)) {
// 				return null;
// 			}

// 			// if module has children, filter each child with (moduleId, childId)
// 			const children = route.children
// 				? route.children.filter((child) =>
// 						hasPermission(route.moduleId, child.id)
// 					)
// 				: undefined;

// 			return { ...route, children };
// 		})
// 		.filter(
// 			(route) =>
// 				route &&
// 				// include non-nested routes
// 				(!route.isNested ||
// 					// include nested routes only if children exist
// 					(route.isNested &&
// 						Array.isArray(route.children) &&
// 						route.children.length > 0))
// 		);
// };

export const sidebarFilterRoutes = (routes, hasPermission) => {
  return routes
    .map((route) => {
      // keep routes without moduleId and without id always (like Dashboard)
      if (!route.moduleId && !route.id) {
        const children = route.children
          ? sidebarFilterRoutes(route.children, hasPermission)
          : undefined;
        return { ...route, children };
      }

      // NEW: Handle standalone routes with both moduleId and id (like Employee Loans)
      if (route.moduleId && route.id) {
        // Check permission for this specific action
        if (!hasPermission(route.moduleId, route.id)) {
          return null;
        }
        return route;
      }

      // Regular module-level permission check
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
    .filter(
      (route) =>
        route &&
        // include non-nested routes
        (!route.isNested ||
          // include nested routes only if children exist
          (route.isNested &&
            Array.isArray(route.children) &&
            route.children.length > 0))
    );
};
export const safeStorage = {
	get(key) {
		try {
			if (typeof window === 'undefined') return null;
			return window.localStorage.getItem(key);
		} catch {
			return null;
		}
	},
	set(key, value) {
		try {
			if (typeof window === 'undefined') return;
			window.localStorage.setItem(key, value);
		} catch {}
	},
};
