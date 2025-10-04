/* eslint-disable react-hooks/exhaustive-deps */
import useUserSession from 'hooks/useUserSession';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { removeDisableUser } from 'utils/helpers';
const {
	GridItem,
	FormLabel,
	Text,
	Select,
	Box,
	SimpleGrid,
} = require('@chakra-ui/react');

const ManagerAgentDropdown = ({
	handleChange,
	values,
	errors,
	touched,
	formik,
}) => {
	const [filteredAgents, setFilteredAgents] = useState([]);
	const [managerId, setMangerId] = useState(null);

	const { user, userRoleName } = useUserSession();

	const tree = useSelector((state) => state.user.activeTree);

	const getAllAgents = (tree) => {
		const agentsList = Object.values(tree?.agents || {}).flat();
		return agentsList;
	};

	const allAgents = getAllAgents(tree);

	const handleManagerChange = (e) => {
		const selectedManagerId = e.target.value;
		handleChange(e); // Update form values
		if (selectedManagerId) {
			const agentsKey = `manager-${selectedManagerId}`;
			const agentsList = tree?.agents[agentsKey] || [];

			setFilteredAgents(agentsList);
			setMangerId(selectedManagerId);
		} else {
			setFilteredAgents([]);
			setMangerId(null);
		}

		formik.setFieldValue('leadAgent', '');
	};

	useEffect(() => {
		// Ensure filteredAgents updates if the initial value of manager changes
		const initialManagerId = values['leadManager'];
		if (initialManagerId) {
			const agentsKey = `manager-${initialManagerId}`;
			setFilteredAgents(tree?.agents[agentsKey] || []);
		}
	}, [values['leadManager'], tree]);

	return (
		<>
			{['Admin', 'superAdmin'].includes(user?.roles?.[0]?.roleName) && (
				<SimpleGrid columns={{ base: 1, lg: 2 }} gap={4} w='full'>
					<GridItem>
						<FormLabel
							display='flex'
							ms='4px'
							fontSize='sm'
							color='#000'
							mb='0'
							mt={2}
						>
							Lead Manager
						</FormLabel>
						<Box>
							<Select
								name='leadManager'
								onChange={handleManagerChange}
								value={values['leadManager']}
							>
								<option value=''>Select manager</option>
								{tree?.managers?.map((manager) => (
									<option key={manager._id} value={manager._id}>
										{manager.fullName}
									</option>
								))}
								{/* <option value={-1}>No Manager</option> */}
							</Select>
						</Box>
						<Text mb='10px' color='red'>
							{errors.leadManager && touched.leadManager && errors.leadManager}
						</Text>
					</GridItem>

					<GridItem>
						<FormLabel
							display='flex'
							ms='4px'
							fontSize='sm'
							color='#000'
							mb='0'
							mt={2}
						>
							Lead Agent
						</FormLabel>
						<Box>
							<Select
								name='leadAgent'
								onChange={handleChange}
								value={values['leadAgent']}
							>
								<option value=''>Select agent</option>
								{managerId
									? filteredAgents?.map((agent) => (
											<option key={agent._id} value={agent._id}>
												{agent.fullName}
											</option>
										))
									: allAgents?.map((agent) => (
											<option key={agent._id} value={agent._id}>
												{agent.fullName}
											</option>
										))}
								{/* <option value={-1}>No Agent</option> */}
							</Select>
						</Box>
						<Text mb='10px' color='red'>
							{errors.leadAgent && touched.leadAgent && errors.leadAgent}
						</Text>
					</GridItem>
				</SimpleGrid>
			)}

			{userRoleName === 'Manager' && (
				<SimpleGrid columns={{ base: 1 }} gap={4} w='full'>
					<GridItem>
						<FormLabel
							display='flex'
							ms='4px'
							fontSize='sm'
							color='#000'
							mb='0'
							mt={2}
						>
							Agent
						</FormLabel>
						<Box>
							<Select
								name='leadAgent'
								onChange={handleChange}
								value={values['leadAgent']}
							>
								<option value=''>Select agent</option>
								{removeDisableUser(tree?.agents[`manager-${user._id}`]).map(
									(agent) => (
										<option key={agent._id} value={agent._id}>
											{agent.fullName}
										</option>
									)
								)}
								{/* <option value={-1}>No Agent</option> */}
							</Select>
						</Box>
						<Text mb='10px' color='red'>
							{errors.leadAgent && touched.leadAgent && errors.leadAgent}
						</Text>
					</GridItem>
				</SimpleGrid>
			)}
		</>
	);
};

export default ManagerAgentDropdown;
