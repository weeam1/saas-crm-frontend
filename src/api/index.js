const { getApi } = require("services/api");

export const fetchAgentLeadsSats = async (userId) => {
	try {
		const { data } = await getApi(`api/lead/leads-stats/${userId}`);

		return data?.doc;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export const fetchAllUsers = async () => {
	try {
		const response = await getApi("api/v2/user/hierarchy?type=all");

		if (response?.status === 200) {
			return response.data?.doc || [];
		} else {
			throw new Error(
				`Unexpected response: ${response?.status} - ${response?.statusText}`
			);
		}
	} catch (error) {
		// Rethrow the error for handling in the consuming component
		throw new Error(
			error?.message || "An unexpected error occurred while fetching users."
		);
	}
};
