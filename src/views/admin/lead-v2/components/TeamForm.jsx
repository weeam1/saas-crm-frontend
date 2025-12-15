/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import { useTeamStructure } from 'hooks/user/useTeamStructure';

import { removeDisableUser } from 'utils/helpers';
import useUserSession from 'hooks/useUserSession';
import { usePermissions } from 'hooks/usePermissions';
const { GridItem, FormLabel, Text, Select, Box } = require('@chakra-ui/react');

const TeamForm = ({
	// user,
	// tree,
	handleChange,
	values,
	errors,
	touched,
	setFieldValue,
}) => {
	const [filteredAgents, setFilteredAgents] = useState([]);
	const [filteredTeamLeaders, setFilteredTeamLeaders] = useState([]);
	const [managerId, setMangerId] = useState(null);
	const [teamLeadId, setTeamLeadId] = useState(null);

	const {
		team,
		allAgents,
		allTeamLeaders,
		getAgentsByManager,
		getAgentsByManagerAndTL,
		getTeamLeadsByManager,
	} = useTeamStructure();
	const { user, userRoleName } = useUserSession();

	const handleManagerChange = (e) => {
		const selectedManagerId = e.target.value;
		handleChange(e); // Update form values
		if (selectedManagerId) {
			// const agentsKey = `manager-${selectedManagerId}`;
			// const agentsList = tree?.agents[agentsKey] || [];
			const teamLeads = getTeamLeadsByManager(selectedManagerId);
			const agents = getAgentsByManager(selectedManagerId);

			setFilteredTeamLeaders(teamLeads || []);
			setFilteredAgents(agents || []);
			setMangerId(selectedManagerId);
		} else {
			setFilteredAgents([]);
			setFilteredTeamLeaders([]);
			setMangerId(null);
		}

		setFieldValue('agentAssigned', '');
		setFieldValue('teamLeadAssigned', '');
	};

	const handleTeamLeaderChange = (e) => {
		const selectedTeamLeadId = e.target.value;
		handleChange(e); // Update form values
		if (selectedTeamLeadId) {
			const agents = getAgentsByManagerAndTL(managerId, selectedTeamLeadId);
			setFilteredAgents(agents || []);
			setTeamLeadId(selectedTeamLeadId);
		} else {
			setFilteredAgents([]);
			setTeamLeadId(null);
		}

		setFieldValue('agentAssigned', '');
	};

	useEffect(() => {
		if (userRoleName === 'Manager') {
			const _managerId = user?._id;
			const teamLeads = getTeamLeadsByManager(_managerId);
			const agents = getAgentsByManager(_managerId);

			setFilteredTeamLeaders(teamLeads || []);
			setFilteredAgents(agents || []);
			setMangerId(_managerId);
		} else if (userRoleName === 'Team Leader' && user?.parent) {
			const _TLId = user?._id;
			const agents = getAgentsByManagerAndTL(user?.parent, _TLId);

			setFilteredAgents(agents || []);
			setMangerId(user?.parent);
			setTeamLeadId(_TLId);
		}
	}, [userRoleName, user]);

	// useEffect(() => {
	// 	// Ensure filteredAgents updates if the initial value of manager changes
	// 	const initialManagerId = values['managerAssigned'];
	// 	if (initialManagerId) {
	// 		const agentsKey = `manager-${initialManagerId}`;
	// 		setFilteredAgents(tree?.agents[agentsKey] || []);
	// 	}
	// }, [values['managerAssigned'], tree]);

	return (
		<>
			{['Admin', 'superAdmin'].includes(userRoleName) && (
				<>
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
								{team?.map((manager) => (
									<option key={manager._id} value={manager._id}>
										{manager.fullName}
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
				</>
			)}

			{['Admin', 'superAdmin', 'Manager'].includes(userRoleName) && (
				<>
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
							Team Lead
						</FormLabel>
						<Box>
							<Select
								name='teamLeadAssigned'
								onChange={handleTeamLeaderChange}
								value={values['teamLeadAssigned']}
							>
								<option value=''>Select team lead</option>
								{managerId && filteredTeamLeaders
									? filteredTeamLeaders?.map((tl) => (
											<option key={tl._id} value={tl._id}>
												{tl.fullName}
											</option>
										))
									: allTeamLeaders?.map((tl) => (
											<option key={tl._id} value={tl._id}>
												{tl.fullName}
											</option>
										))}
								<option value={-1}>No Team Lead</option>
							</Select>
						</Box>
						<Text mb='10px' color='red'>
							{errors.teamLeadAssigned &&
								touched.teamLeadAssigned &&
								errors.teamLeadAssigned}
						</Text>
					</GridItem>

					{/* <GridItem colSpan={{ base: 12, md: 6 }}>
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
								<option value={-1}>No Agent</option>
							</Select>
						</Box>
						<Text mb='10px' color='red'>
							{errors.agentAssigned &&
								touched.agentAssigned &&
								errors.agentAssigned}
						</Text>
					</GridItem> */}
				</>
			)}

			{['Admin', 'superAdmin', 'Manager', 'Team Leader'].includes(
				userRoleName
			) && (
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
							{managerId && filteredAgents
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

			{/* {hasPermission('leads', 'agentAssigned') && (
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
							{removeDisableUser(tree?.agents[`manager-${user._id}`]).map(
								(agent) => (
									<option key={agent._id} value={agent._id}>
										{agent.firstName} {agent.lastName}
									</option>
								)
							)}
							<option value={-1}>No Agent</option>
						</Select>
					</Box>
					<Text mb='10px' color='red'>
						{errors.agentAssigned &&
							touched.agentAssigned &&
							errors.agentAssigned}
					</Text>
				</GridItem>
			)} */}
		</>
	);
};

export default TeamForm;
