/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

const { GridItem, FormLabel, Text, Select, Box } = require('@chakra-ui/react');

// const ManagerAgentImport = ({
// 	user,
// 	tree,
// 	handleChange,
// 	values,
// 	errors,
// 	touched,
// }) => {
// 	const [filteredAgents, setFilteredAgents] = useState([]);

// 	const handleManagerChange = (e) => {
// 		const selectedManagerId = e.target.value;
// 		handleChange(e); // Update form values
// 		if (selectedManagerId) {
// 			const agentsKey = `manager-${selectedManagerId}`;
// 			const agentsList = tree?.agents[agentsKey] || [];
// 			setFilteredAgents(agentsList);
// 		} else {
// 			setFilteredAgents([]); // Clear agents if no manager selected
// 		}
// 	};

// 	useEffect(() => {
// 		// Ensure filteredAgents updates if the initial value of manager changes
// 		const initialManagerId = values['managerAssigned'];
// 		if (initialManagerId) {
// 			const agentsKey = `manager-${initialManagerId}`;
// 			setFilteredAgents(tree?.agents[agentsKey] || []);
// 		}
// 	}, [values['managerAssigned'], tree]);

// 	return (
// 		<>
// 			{user?.role === 'superAdmin' && (
// 				<GridItem colSpan={{ base: 12, md: 6 }}>
// 					<FormLabel
// 						display='flex'
// 						ms='4px'
// 						fontSize='sm'
// 						fontWeight='600'
// 						color='#000'
// 						mb='0'
// 						mt={2}
// 					>
// 						Manager
// 					</FormLabel>
// 					<Box>
// 						<Select
// 							name='managerAssigned'
// 							placeholder='Select Manager'
// 							onChange={handleManagerChange}
// 							value={values['managerAssigned']}
// 						>
// 							<option value=''>No manager</option>
// 							{tree?.managers?.map((manager) => (
// 								<option key={manager._id} value={manager._id}>
// 									{manager.firstName} {manager.lastName}
// 								</option>
// 							))}
// 						</Select>
// 					</Box>
// 					<Text mb='10px' color='red'>
// 						{errors.managerAssigned &&
// 							touched.managerAssigned &&
// 							errors.managerAssigned}
// 					</Text>
// 				</GridItem>
// 			)}

// 			{user?.role === 'superAdmin' && (
// 				<GridItem colSpan={{ base: 12, md: 6 }}>
// 					<FormLabel
// 						display='flex'
// 						ms='4px'
// 						fontSize='sm'
// 						fontWeight='600'
// 						color='#000'
// 						mb='0'
// 						mt={2}
// 					>
// 						Agent
// 					</FormLabel>
// 					<Box>
// 						<Select
// 							name='agentAssigned'
// 							onChange={handleChange}
// 							value={values['agentAssigned'] || ''}
// 							placeholder='Select Agent'
// 							// isDisabled={!isManagerSelected}
// 						>
// 							<option value=''>No agent</option>
// 							{filteredAgents.map((agent) => (
// 								<option key={agent._id} value={agent._id}>
// 									{agent.firstName} {agent.lastName}
// 								</option>
// 							))}
// 						</Select>
// 					</Box>
// 					<Text mb='10px' color='red'>
// 						{errors.agentAssigned &&
// 							touched.agentAssigned &&
// 							errors.agentAssigned}
// 					</Text>
// 				</GridItem>
// 			)}

// 			{user?.roles?.[0]?.roleName === 'Manager' && (
// 				<GridItem colSpan={{ base: 12, md: 6 }}>
// 					<FormLabel
// 						display='flex'
// 						ms='4px'
// 						fontSize='sm'
// 						fontWeight='600'
// 						color='#000'
// 						mb='0'
// 						mt={2}
// 					>
// 						Agent
// 					</FormLabel>
// 					<Box>
// 						<Select
// 							name='agentAssigned'
// 							onChange={handleChange}
// 							value={values['agentAssigned']}
// 						>
// 							<option value=''>Select agent</option>
// 							{tree?.agents[`manager-${user._id}`]?.map((agent) => (
// 								<option key={agent._id} value={agent._id}>
// 									{agent.firstName} {agent.lastName}
// 								</option>
// 							))}
// 						</Select>
// 					</Box>
// 					<Text mb='10px' color='red'>
// 						{errors.agentAssigned &&
// 							touched.agentAssigned &&
// 							errors.agentAssigned}
// 					</Text>
// 				</GridItem>
// 			)}
// 		</>
// 	);
// };

const ManagerAgentImport = ({
	user,
	tree,
	handleChange,
	values,
	errors,
	touched,
}) => {
	const [filteredAgents, setFilteredAgents] = useState([]);
	const isSuperAdmin = user?.role === 'superAdmin';
	const isManager = user?.roles?.[0]?.roleName === 'Manager';

	// Update filtered agents when manager selection changes
	useEffect(() => {
		const selectedManagerId = values['managerAssigned'];

		if (!selectedManagerId) {
			// If no manager selected, show all agents
			setFilteredAgents([]);
		} else {
			// Show only the agents assigned to the selected manager
			setFilteredAgents(tree?.agents[`manager-${selectedManagerId}`] || []);
		}
	}, [values['managerAssigned'], tree]);

	// Filter Managers when no agent is selected (for Super Admin)
	// const filteredManagers = isSuperAdmin
	// 	? !values['agentAssigned']
	// 		? tree?.managers || []
	// 		: []
	// 	: [];

	// Get the list of agents for a manager (if user is a manager)
	const managerAgents = isManager
		? tree?.agents[`manager-${user._id}`] || []
		: filteredAgents;

	return (
		<>
			{/* Manager Selection (Super Admin Only) */}
			{isSuperAdmin && (
				<GridItem colSpan={{ base: 12, md: 6 }}>
					<FormLabel fontSize='sm' fontWeight='600' color='#000' mt={2}>
						Select Manager
					</FormLabel>
					<Box>
						<Select
							name='managerAssigned'
							// placeholder='Select Manager'
							onChange={handleChange}
							value={values['managerAssigned'] || ''}
						>
							<option value=''>No manager</option>
							{tree?.managers?.map((manager) => (
								<option key={manager._id} value={manager._id}>
									{manager.firstName} {manager.lastName}
								</option>
							))}
						</Select>
					</Box>
					<Text mb='10px' color='red'>
						{errors.managerAssigned &&
							touched.managerAssigned &&
							errors.managerAssigned}
					</Text>
				</GridItem>
			)}

			{/* Agent Selection (Super Admin & Manager) */}
			<GridItem colSpan={{ base: 12, md: 6 }}>
				<FormLabel fontSize='sm' fontWeight='600' color='#000' mt={2}>
					Select Agent
				</FormLabel>
				<Box>
					<Select
						name='agentAssigned'
						onChange={handleChange}
						value={values['agentAssigned'] || ''}
						// placeholder='Select Agent'
					>
						<option value=''>No agent</option>

						{managerAgents.map((agent) => (
							<option key={agent._id} value={agent._id}>
								{agent.firstName} {agent.lastName}
							</option>
						))}
					</Select>
				</Box>
				<Text mb='10px' color='red'>
					{errors.agentAssigned &&
						touched.agentAssigned &&
						errors.agentAssigned}
				</Text>
			</GridItem>
		</>
	);
};

export default ManagerAgentImport;
