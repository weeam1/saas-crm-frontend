/* eslint-disable react-hooks/exhaustive-deps */
import { fetchAllUsers } from "api";
import useFetchUserHierarchy from "hooks/useFetchUserHierarchy";
import React, { useState, useEffect } from "react";

const {
	GridItem,
	FormLabel,
	Text,
	Select,
	Box,
	Spinner,
} = require("@chakra-ui/react");

const ManagerAgentForm = ({
	user,
	tree,
	handleChange,
	values,
	errors,
	touched,
}) => {
	// const [filteredAgents, setFilteredAgents] = useState([]);

	// const handleManagerChange = (e) => {
	// 	const selectedManagerId = e.target.value;
	// 	handleChange(e); // Update form values
	// 	if (selectedManagerId) {
	// 		const agentsKey = `manager-${selectedManagerId}`;
	// 		const agentsList = tree?.agents[agentsKey] || [];
	// 		// setFilteredAgents(agentsList);
	// 	} else {
	// 		setFilteredAgents([]); // Clear agents if no manager selected
	// 	}
	// };

	// useEffect(() => {
	// 	// Ensure filteredAgents updates if the initial value of manager changes
	// 	const initialManagerId = values["managerAssigned"];
	// 	if (initialManagerId) {
	// 		const agentsKey = `manager-${initialManagerId}`;
	// 		setFilteredAgents(tree?.agents[agentsKey] || []);
	// 	}
	// }, [values["managerAssigned"], tree]);

	const [users, setUsers] = useState([]);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setIsLoading(true);
				const data = await fetchAllUsers();
				setUsers(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUsers();
	}, []);

	return (
		<>
			{isLoading ? (
				<Spinner />
			) : users ? (
				<>
					{user?.role === "superAdmin" && (
						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color="#000"
								mb="0"
								mt={2}
							>
								Manager
							</FormLabel>
							<Box>
								<Select
									name="managerAssigned"
									onChange={handleChange}
									value={values["managerAssigned"]}
								>
									<option value="">Select manager</option>
									{users?.managers?.map((manager) => (
										<option key={manager._id} value={manager._id}>
											{manager.name}
										</option>
									))}
									<option value={-1}>No Manager</option>
								</Select>
							</Box>
							<Text mb="10px" color="red">
								{errors.managerAssigned &&
									touched.managerAssigned &&
									errors.managerAssigned}
							</Text>
						</GridItem>
					)}

					{user?.role === "superAdmin" && (
						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color="#000"
								mb="0"
								mt={2}
							>
								Agent
							</FormLabel>
							<Box>
								<Select
									name="agentAssigned"
									onChange={handleChange}
									value={values["agentAssigned"]}
								>
									<option value="">Select agent</option>
									{users?.agents?.map((agent) => (
										<option key={agent._id} value={agent._id}>
											{agent.name}
										</option>
									))}
									<option value={-1}>No Agent</option>
								</Select>
							</Box>
							<Text mb="10px" color="red">
								{errors.agentAssigned &&
									touched.agentAssigned &&
									errors.agentAssigned}
							</Text>
						</GridItem>
					)}

					{user?.roles?.[0]?.roleName === "Manager" && (
						<GridItem colSpan={{ base: 12, md: 6 }}>
							<FormLabel
								display="flex"
								ms="4px"
								fontSize="sm"
								fontWeight="600"
								color="#000"
								mb="0"
								mt={2}
							>
								Agent
							</FormLabel>
							<Box>
								<Select
									name="agentAssigned"
									onChange={handleChange}
									value={values["agentAssigned"]}
								>
									<option value="">Select agent</option>
									{tree?.agents[`manager-${user._id}`]?.map((agent) => (
										<option key={agent._id} value={agent._id}>
											{agent.firstName} {agent.lastName}
										</option>
									))}
								</Select>
							</Box>
							<Text mb="10px" color="red">
								{errors.agentAssigned &&
									touched.agentAssigned &&
									errors.agentAssigned}
							</Text>
						</GridItem>
					)}
				</>
			) : null}
		</>
	);
};

export default ManagerAgentForm;
