import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getApi } from 'services/api';

const useFetchUserHierarchy = (user) => {
	const [allUsers, setAllUsers] = useState([]);
	const [managers, setManagers] = useState([]);
	const [agents, setAgents] = useState([]);

	useEffect(() => {
		const fetchAllData = async () => {
			try {
				// if (user?.role === "superAdmin") {
				const { data } = await getApi('api/v2/user/hierarchy?type=all');

				if (data?.doc) {
					const {
						allUsers: allData,
						managers: managerData,
						agents: agentData,
					} = data.doc;

					// Set the states with segregated data
					setAllUsers(allData || []);
					setManagers(managerData || []);
					setAgents(agentData || []);
				}
				// }
			} catch (error) {
				console.error('Failed to fetch data:', error);
				toast.error('Failed to fetch data. Please try again later.');
			}
		};

		fetchAllData();
	}, []);

	return { allUsers, managers, agents };
};

export default useFetchUserHierarchy;
