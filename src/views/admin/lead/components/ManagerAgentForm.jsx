/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { removeDisableUser } from 'utils/helpers';

const { GridItem, FormLabel, Text, Select, Box } = require('@chakra-ui/react');

const ManagerAgentForm = ({
	user,
	tree,
	handleChange,
	values,
	errors,
	touched,
}) => {
	const [filteredAgents, setFilteredAgents] = useState([]);

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
		} else {
			setFilteredAgents([]);
		}
	};

	useEffect(() => {
		// Ensure filteredAgents updates if the initial value of manager changes
		const initialManagerId = values['managerAssigned'];
		if (initialManagerId) {
			const agentsKey = `manager-${initialManagerId}`;
			setFilteredAgents(tree?.agents[agentsKey] || []);
		}
	}, [values['managerAssigned'], tree]);

	return (
		<>
			{user?.role === 'superAdmin' && (
				<GridItem colSpan={{ base: 12, md: 6 }}>
					<FormLabel
						display='flex'
						ms='4px'
						fontSize='sm'
						fontWeight='600'
						color='#000'
						mb='0'
						mt={2}
					>
						Manager
					</FormLabel>
					<Box>
						<Select
							name='managerAssigned'
							onChange={handleManagerChange}
							value={values['managerAssigned']}
						>
							<option value=''>Select manager</option>
							{removeDisableUser(tree?.managers)?.map((manager) => (
								<option key={manager._id} value={manager._id}>
									{manager.firstName} {manager.lastName}
								</option>
							))}
							<option value={-1}>No Manager</option>
						</Select>
					</Box>
					<Text mb='10px' color='red'>
						{errors.managerAssigned &&
							touched.managerAssigned &&
							errors.managerAssigned}
					</Text>
				</GridItem>
			)}

			{user?.role === 'superAdmin' && (
				<GridItem colSpan={{ base: 12, md: 6 }}>
					<FormLabel
						display='flex'
						ms='4px'
						fontSize='sm'
						fontWeight='600'
						color='#000'
						mb='0'
						mt={2}
					>
						Agent
					</FormLabel>
					<Box>
						<Select
							name='agentAssigned'
							onChange={handleChange}
							value={values['agentAssigned']}
						>
							<option value=''>Select agent</option>
							{filteredAgents?.length
								? removeDisableUser(filteredAgents).map((agent) => (
										<option key={agent._id} value={agent._id}>
											{agent.firstName} {agent.lastName}
										</option>
									))
								: removeDisableUser(allAgents)?.map((agent) => (
										<option key={agent._id} value={agent._id}>
											{agent.firstName} {agent.lastName}
										</option>
									))}
							<option value={-1}>No Agent</option>
						</Select>
					</Box>
					<Text mb='10px' color='red'>
						{errors.agentAssigned &&
							touched.agentAssigned &&
							errors.agentAssigned}
					</Text>
				</GridItem>
			)}

			{user?.roles?.[0]?.roleName === 'Manager' && (
				<GridItem colSpan={{ base: 12, md: 6 }}>
					<FormLabel
						display='flex'
						ms='4px'
						fontSize='sm'
						fontWeight='600'
						color='#000'
						mb='0'
						mt={2}
					>
						Agent
					</FormLabel>
					<Box>
						<Select
							name='agentAssigned'
							onChange={handleChange}
							value={values['agentAssigned']}
						>
							<option value=''>Select agent</option>
							{removeDisableUser(tree?.agents[`manager-${user._id}`])?.map(
								(agent) => (
									<option key={agent._id} value={agent._id}>
										{agent.firstName} {agent.lastName}
									</option>
								)
							)}
						</Select>
					</Box>
					<Text mb='10px' color='red'>
						{errors.agentAssigned &&
							touched.agentAssigned &&
							errors.agentAssigned}
					</Text>
				</GridItem>
			)}
		</>
	);
};

export default ManagerAgentForm;
