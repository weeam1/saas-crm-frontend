const { getApi } = require("./api");

const fetchAndStoreHierarchyData = async () => {
	try {
		const user = JSON.parse(localStorage.getItem("user"));

		// Fetch data for all roles
		const [allData, managersData, agentsData] = await Promise.all([
			getApi(user.role === "superAdmin" && "api/v2/user/hierarchy?type=all"),
			getApi(
				user.role === "superAdmin" && "api/v2/user/hierarchy?type=managers"
			),
			getApi(user.role === "superAdmin" && "api/v2/user/hierarchy?type=agents"),
		]);

		// Structure the data
		const hierarchyData = {
			all: allData.data.doc,
			managers: managersData.data.doc,
			agents: agentsData.data.doc,
		};

		// Store in local storage
		localStorage.setItem("hierarchyData", JSON.stringify(hierarchyData));
	} catch (error) {
		console.error("Failed to fetch hierarchy data:", error);
	}
};
