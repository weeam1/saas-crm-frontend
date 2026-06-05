// /* eslint-disable react-hooks/exhaustive-deps */
// import { usePermissions } from 'hooks/usePermissions';
// import { useTeamStructure } from 'hooks/user/useTeamStructure';
// import useUserSession from 'hooks/useUserSession';
// import React, { useState, useEffect } from 'react';

// const { GridItem, FormLabel, Text, Select, Box } = require('@chakra-ui/react');

// const ManagerAgentImport = ({
// 	// user,
// 	tree,
// 	handleChange,
// 	values,
// 	errors,
// 	touched,
// 	setFieldValue,
// }) => {
// 	const [filteredAgents, setFilteredAgents] = useState([]);
// 	const [filteredTeamLeaders, setFilteredTeamLeaders] = useState([]);
// 	const [managerId, setMangerId] = useState(null);
// 	const [teamLeadId, setTeamLeadId] = useState(null);
// 	// const isSuperAdmin = user?.role === 'superAdmin';

// 	const { hasPermission } = usePermissions();

// 	const {
// 		team: managers,
// 		getAgentsByManager,
// 		getAgentsByManagerAndTL,
// 		getTeamLeadsByManager,
// 	} = useTeamStructure();

// 	const { user, userRoleName } = useUserSession();
// 	const isManager = user?.roles?.[0]?.roleName === 'Manager';

// 	const handleManagerChange = (e) => {
// 		const selectedManagerId = e.target.value;
// 		handleChange(e); // Update form values
// 		if (selectedManagerId) {
// 			// const agentsKey = `manager-${selectedManagerId}`;
// 			// const agentsList = tree?.agents[agentsKey] || [];
// 			const teamLeads = getTeamLeadsByManager(selectedManagerId);
// 			const agents = getAgentsByManager(selectedManagerId);

// 			console.log({ teamLeads, agents });

// 			setFilteredTeamLeaders(teamLeads || []);
// 			// setFilteredAgents(agents || []);
// 			setMangerId(selectedManagerId);
// 		} else {
// 			setFilteredAgents([]);
// 			setFilteredTeamLeaders([]);
// 			setMangerId(null);
// 		}

// 		setFieldValue('agentAssigned', '');
// 		setFieldValue('teamLeadAssigned', '');
// 	};

// 	const handleTeamLeaderChange = (e) => {
// 		const selectedTeamLeadId = e.target.value;
// 		handleChange(e); // Update form values
// 		if (selectedTeamLeadId) {
// 			const agents = getAgentsByManagerAndTL(managerId, selectedTeamLeadId);
// 			console.log({ agents });
// 			setFilteredAgents(agents || []);
// 			setTeamLeadId(selectedTeamLeadId);
// 		} else {
// 			setFilteredAgents([]);
// 			setTeamLeadId(null);
// 		}

// 		setFieldValue('agentAssigned', '');
// 	};

// 	// console.log({ filteredTeamLeaders, filteredAgents });

// 	useEffect(() => {
// 		if (userRoleName === 'Manager') {
// 			const _managerId = user?._id;
// 			const teamLeads = getTeamLeadsByManager(_managerId);
// 			const agents = getAgentsByManager(_managerId);

// 			setFilteredTeamLeaders(teamLeads || []);
// 			// setFilteredAgents(agents || []);
// 			setMangerId(_managerId);
// 		} else if (userRoleName === 'Team Leader' && user?.parent) {
// 			const _TLId = user?._id;
// 			const agents = getAgentsByManagerAndTL(user?.parent, _TLId);

// 			setFilteredAgents(agents || []);
// 			setMangerId(user?.parent);
// 			setTeamLeadId(_TLId);
// 		}
// 	}, [userRoleName, user]);

// 	// Update filtered agents when manager selection changes
// 	// useEffect(() => {
// 	// 	const selectedManagerId = values['managerAssigned'];

// 	// 	if (!selectedManagerId) {
// 	// 		// If no manager selected, show all agents
// 	// 		setFilteredAgents([]);
// 	// 	} else {
// 	// 		// Show only the agents assigned to the selected manager
// 	// 		setFilteredAgents(tree?.agents[`manager-${selectedManagerId}`] || []);
// 	// 	}
// 	// }, [values['managerAssigned'], tree]);

// 	// Filter Managers when no agent is selected (for Super Admin)
// 	// const filteredManagers = isSuperAdmin
// 	// 	? !values['agentAssigned']
// 	// 		? tree?.managers || []
// 	// 		: []
// 	// 	: [];

// 	// Get the list of agents for a manager (if user is a manager)
// 	// const managerAgents = isManager
// 	// 	? tree?.agents[`manager-${user._id}`] || []
// 	// 	: filteredAgents;

// 	// Create a reusable SelectField component
// 	const SelectField = ({
// 		label,
// 		name,
// 		options = [],
// 		defaultValue = { value: '', label: 'Select...' },
// 		onChange,
// 		error,
// 		touched,
// 		labelProps = {},
// 	}) => (
// 		<GridItem colSpan={{ base: 12, md: 6 }}>
// 			<FormLabel
// 				fontSize='sm'
// 				fontWeight='600'
// 				color='text.body'
// 				mt={2}
// 				{...labelProps}
// 			>
// 				{label}
// 			</FormLabel>
// 			<Box>
// 				<Select name={name} onChange={onChange} value={values[name] || ''}>
// 					<option value={defaultValue.value}>{defaultValue.label}</option>
// 					{options.map((option) => (
// 						<option key={option.value} value={option.value}>
// 							{option.label}
// 						</option>
// 					))}
// 				</Select>
// 			</Box>
// 			{error && touched && (
// 				<Text mb='10px' color='red'>
// 					{error}
// 				</Text>
// 			)}
// 		</GridItem>
// 	);

// 	return (
// 		// <>
// 		// 	{/* Manager Selection (Super Admin Only) */}
// 		// 	{hasPermission('leads', 'bulkAssign_all') ? (
// 		// 		<>
// 		// 			<GridItem colSpan={{ base: 12, md: 6 }}>
// 		// 				<FormLabel fontSize='sm' fontWeight='600' color='#000' mt={2}>
// 		// 					Select Manager
// 		// 				</FormLabel>
// 		// 				<Box>
// 		// 					<Select
// 		// 						name='managerAssigned'
// 		// 						// placeholder='Select Manager'
// 		// 						onChange={handleManagerChange}
// 		// 						value={values['managerAssigned'] || ''}
// 		// 					>
// 		// 						<option value=''>No manager</option>
// 		// 						{managers?.map((manager) => (
// 		// 							<option key={manager._id} value={manager._id}>
// 		// 								{manager.fullName}
// 		// 							</option>
// 		// 						))}
// 		// 					</Select>
// 		// 				</Box>
// 		// 				<Text mb='10px' color='red'>
// 		// 					{errors.managerAssigned &&
// 		// 						touched.managerAssigned &&
// 		// 						errors.managerAssigned}
// 		// 				</Text>
// 		// 			</GridItem>

// 		// 			<GridItem colSpan={{ base: 12, md: 6 }}>
// 		// 				<FormLabel
// 		// 					display='flex'
// 		// 					ms='4px'
// 		// 					fontSize='sm'
// 		// 					fontWeight='600'
// 		// 					color='#000'
// 		// 					mb='0'
// 		// 					mt={2}
// 		// 				>
// 		// 					Team Lead
// 		// 				</FormLabel>
// 		// 				<Box>
// 		// 					<Select
// 		// 						name='teamLeadAssigned'
// 		// 						onChange={handleTeamLeaderChange}
// 		// 						value={values['teamLeadAssigned']}
// 		// 					>
// 		// 						{/* <option value=''>Select team lead</option> */}
// 		// 						<option value=''>No Team Lead</option>

// 		// 						{managerId &&
// 		// 							filteredTeamLeaders?.length &&
// 		// 							filteredTeamLeaders?.map((tl) => (
// 		// 								<option key={tl._id} value={tl._id}>
// 		// 									{tl.fullName}
// 		// 								</option>
// 		// 							))}
// 		// 					</Select>
// 		// 				</Box>
// 		// 				<Text mb='10px' color='red'>
// 		// 					{errors.teamLeadAssigned &&
// 		// 						touched.teamLeadAssigned &&
// 		// 						errors.teamLeadAssigned}
// 		// 				</Text>
// 		// 			</GridItem>

// 		// 			<GridItem colSpan={{ base: 12, md: 6 }}>
// 		// 				<FormLabel fontSize='sm' fontWeight='600' color='#000' mt={2}>
// 		// 					Select Agent
// 		// 				</FormLabel>
// 		// 				<Box>
// 		// 					<Select
// 		// 						name='agentAssigned'
// 		// 						onChange={handleChange}
// 		// 						value={values['agentAssigned'] || ''}
// 		// 						// placeholder='Select Agent'
// 		// 					>
// 		// 						<option value=''>No agent</option>

// 		// 						{filteredAgents?.map((agent) => (
// 		// 							<option key={agent._id} value={agent._id}>
// 		// 								{agent.fullName}
// 		// 							</option>
// 		// 						))}
// 		// 					</Select>
// 		// 				</Box>
// 		// 				<Text mb='10px' color='red'>
// 		// 					{errors.agentAssigned &&
// 		// 						touched.agentAssigned &&
// 		// 						errors.agentAssigned}
// 		// 				</Text>
// 		// 			</GridItem>
// 		// 		</>
// 		// 	) : hasPermission('leads', 'bulkAssign_teamLead') ? (
// 		// 		<>
// 		// 			<GridItem colSpan={{ base: 12, md: 6 }}>
// 		// 				<FormLabel
// 		// 					display='flex'
// 		// 					ms='4px'
// 		// 					fontSize='sm'
// 		// 					fontWeight='600'
// 		// 					color='#000'
// 		// 					mb='0'
// 		// 					mt={2}
// 		// 				>
// 		// 					Team Lead
// 		// 				</FormLabel>
// 		// 				<Box>
// 		// 					<Select
// 		// 						name='teamLeadAssigned'
// 		// 						onChange={handleTeamLeaderChange}
// 		// 						value={values['teamLeadAssigned']}
// 		// 					>
// 		// 						<option value=''>No Team Lead</option>

// 		// 						{managerId &&
// 		// 							filteredTeamLeaders?.length &&
// 		// 							filteredTeamLeaders?.map((tl) => (
// 		// 								<option key={tl._id} value={tl._id}>
// 		// 									{tl.fullName}
// 		// 								</option>
// 		// 							))}
// 		// 					</Select>
// 		// 				</Box>
// 		// 				<Text mb='10px' color='red'>
// 		// 					{errors.teamLeadAssigned &&
// 		// 						touched.teamLeadAssigned &&
// 		// 						errors.teamLeadAssigned}
// 		// 				</Text>
// 		// 			</GridItem>
// 		// 			<GridItem colSpan={{ base: 12, md: 6 }}>
// 		// 				<FormLabel fontSize='sm' fontWeight='600' color='#000' mt={2}>
// 		// 					Select Agent
// 		// 				</FormLabel>
// 		// 				<Box>
// 		// 					<Select
// 		// 						name='agentAssigned'
// 		// 						onChange={handleManagerChange}
// 		// 						value={values['agentAssigned'] || ''}
// 		// 						// placeholder='Select Agent'
// 		// 					>
// 		// 						<option value=''>No agent</option>

// 		// 						{filteredAgents?.length &&
// 		// 							filteredAgents?.map((agent) => (
// 		// 								<option key={agent._id} value={agent._id}>
// 		// 									{agent.fullName}
// 		// 								</option>
// 		// 							))}
// 		// 					</Select>
// 		// 				</Box>
// 		// 				<Text mb='10px' color='red'>
// 		// 					{errors.agentAssigned &&
// 		// 						touched.agentAssigned &&
// 		// 						errors.agentAssigned}
// 		// 				</Text>
// 		// 			</GridItem>
// 		// 		</>
// 		// 	) : (
// 		// 		hasPermission('leads', 'bulkAssign_agents') && (
// 		// 			<>
// 		// 				<GridItem colSpan={{ base: 12, md: 6 }}>
// 		// 					<FormLabel fontSize='sm' fontWeight='600' color='#000' mt={2}>
// 		// 						Select Agent
// 		// 					</FormLabel>
// 		// 					<Box>
// 		// 						<Select
// 		// 							name='agentAssigned'
// 		// 							onChange={handleManagerChange}
// 		// 							value={values['agentAssigned'] || ''}
// 		// 							// placeholder='Select Agent'
// 		// 						>
// 		// 							<option value=''>No agent</option>

// 		// 							{filteredAgents?.length &&
// 		// 								filteredAgents?.map((agent) => (
// 		// 									<option key={agent._id} value={agent._id}>
// 		// 										{agent.fullName}
// 		// 									</option>
// 		// 								))}
// 		// 						</Select>
// 		// 					</Box>
// 		// 					<Text mb='10px' color='red'>
// 		// 						{errors.agentAssigned &&
// 		// 							touched.agentAssigned &&
// 		// 							errors.agentAssigned}
// 		// 					</Text>
// 		// 				</GridItem>
// 		// 			</>
// 		// 		)
// 		// 	)}
// 		// </>
// 		// Then in your JSX:
// 		hasPermission('leads', 'bulkAssign_all') ? (
// 			<>
// 				<SelectField
// 					label='Select Manager'
// 					name='managerAssigned'
// 					options={managers?.map((m) => ({ value: m._id, label: m.fullName }))}
// 					defaultValue={{ value: '', label: 'No manager' }}
// 					onChange={handleManagerChange}
// 					error={errors.managerAssigned}
// 					touched={touched.managerAssigned}
// 				/>
// 				<SelectField
// 					label='Team Lead'
// 					name='teamLeadAssigned'
// 					options={
// 						managerId && filteredTeamLeaders?.length
// 							? filteredTeamLeaders.map((tl) => ({
// 									value: tl._id,
// 									label: tl.fullName,
// 								}))
// 							: []
// 					}
// 					defaultValue={{ value: '', label: 'No Team Lead' }}
// 					onChange={handleTeamLeaderChange}
// 					error={errors.teamLeadAssigned}
// 					touched={touched.teamLeadAssigned}
// 					labelProps={{ display: 'flex', ms: '4px', mb: '0' }}
// 				/>
// 				<SelectField
// 					label='Select Agent'
// 					name='agentAssigned'
// 					options={filteredAgents?.map((a) => ({
// 						value: a._id,
// 						label: a.fullName,
// 					}))}
// 					defaultValue={{ value: '', label: 'No agent' }}
// 					onChange={handleChange}
// 					error={errors.agentAssigned}
// 					touched={touched.agentAssigned}
// 				/>
// 			</>
// 		) : hasPermission('leads', 'bulkAssign_team') ? (
// 			<>
// 				<SelectField
// 					label='Team Lead'
// 					name='teamLeadAssigned'
// 					options={
// 						managerId && filteredTeamLeaders?.length
// 							? filteredTeamLeaders.map((tl) => ({
// 									value: tl._id,
// 									label: tl.fullName,
// 								}))
// 							: []
// 					}
// 					defaultValue={{ value: '', label: 'No Team Lead' }}
// 					onChange={handleTeamLeaderChange}
// 					error={errors.teamLeadAssigned}
// 					touched={touched.teamLeadAssigned}
// 					labelProps={{ display: 'flex', ms: '4px', mb: '0' }}
// 				/>
// 				<SelectField
// 					label='Select Agent'
// 					name='agentAssigned'
// 					options={filteredAgents?.map((a) => ({
// 						value: a._id,
// 						label: a.fullName,
// 					}))}
// 					defaultValue={{ value: '', label: 'No agent' }}
// 					onChange={handleChange}
// 					error={errors.agentAssigned}
// 					touched={touched.agentAssigned}
// 				/>
// 			</>
// 		) : hasPermission('leads', 'bulkAssign_agents') ? (
// 			<SelectField
// 				label='Select Agent'
// 				name='agentAssigned'
// 				options={filteredAgents?.map((a) => ({
// 					value: a._id,
// 					label: a.fullName,
// 				}))}
// 				defaultValue={{ value: '', label: 'No agent' }}
// 				onChange={handleChange}
// 				error={errors.agentAssigned}
// 				touched={touched.agentAssigned}
// 			/>
// 		) : null
// 	);
// };

// export default ManagerAgentImport;


/* eslint-disable react-hooks/exhaustive-deps */
import { usePermissions } from 'hooks/usePermissions';
import { useTeamStructure } from 'hooks/user/useTeamStructure';
import useUserSession from 'hooks/useUserSession';
import React, { useState, useEffect } from 'react';
import { GridItem, FormLabel, Text, Select, Box } from '@chakra-ui/react';

const ManagerAgentImport = ({
	tree,
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

	const { hasPermission } = usePermissions();

	const {
		team: managers,
		getAgentsByManager,
		getAgentsByManagerAndTL,
		getTeamLeadsByManager,
	} = useTeamStructure();

	const { user, userRoleName } = useUserSession();

	const handleManagerChange = (e) => {
		const selectedManagerId = e.target.value;
		handleChange(e);
		if (selectedManagerId) {
			const teamLeads = getTeamLeadsByManager(selectedManagerId);
			const agents = getAgentsByManager(selectedManagerId);

			setFilteredTeamLeaders(teamLeads || []);
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
		handleChange(e);
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
			setMangerId(_managerId);
		} else if (userRoleName === 'Team Leader' && user?.parent) {
			const _TLId = user?._id;
			const agents = getAgentsByManagerAndTL(user?.parent, _TLId);

			setFilteredAgents(agents || []);
			setMangerId(user?.parent);
			setTeamLeadId(_TLId);
		}
	}, [userRoleName, user]);

	const SelectField = ({
		label,
		name,
		options = [],
		defaultValue = { value: '', label: 'Select...' },
		onChange,
		error,
		touched,
		labelProps = {},
	}) => (
		<GridItem colSpan={{ base: 12, md: 6 }}>
			<FormLabel
				fontSize='sm'
				fontWeight='600'
				color='text.body'
				mt={2}
				{...labelProps}
			>
				{label}
			</FormLabel>
			<Box>
				<Select
					name={name}
					onChange={onChange}
					value={values[name] || ''}
					bg='bg.input'
					borderColor='border.default'
					color='text.body'
					_focus={{
						borderColor: 'border.focus',
						boxShadow: 'goldGlow',
					}}
					_hover={{ borderColor: 'border.focus' }}
				>
					<option value={defaultValue.value} style={{ background: '#24496E', color: '#B0B0B0' }}>
						{defaultValue.label}
					</option>
					{options.map((option) => (
						<option key={option.value} value={option.value} style={{ background: '#24496E', color: '#B0B0B0' }}>
							{option.label}
						</option>
					))}
				</Select>
			</Box>
			{error && touched && (
				<Text mb='10px' color='red.500' fontSize='xs' mt={1}>
					{error}
				</Text>
			)}
		</GridItem>
	);

	return (
		<>
			{hasPermission('leads', 'bulkAssign_all') ? (
				<>
					<SelectField
						label='Select Manager'
						name='managerAssigned'
						options={managers?.map((m) => ({ value: m._id, label: m.fullName }))}
						defaultValue={{ value: '', label: 'No manager' }}
						onChange={handleManagerChange}
						error={errors.managerAssigned}
						touched={touched.managerAssigned}
					/>
					<SelectField
						label='Team Lead'
						name='teamLeadAssigned'
						options={
							managerId && filteredTeamLeaders?.length
								? filteredTeamLeaders.map((tl) => ({
										value: tl._id,
										label: tl.fullName,
									}))
								: []
						}
						defaultValue={{ value: '', label: 'No Team Lead' }}
						onChange={handleTeamLeaderChange}
						error={errors.teamLeadAssigned}
						touched={touched.teamLeadAssigned}
						labelProps={{ display: 'flex', ms: '4px', mb: '0' }}
					/>
					<SelectField
						label='Select Agent'
						name='agentAssigned'
						options={filteredAgents?.map((a) => ({
							value: a._id,
							label: a.fullName,
						}))}
						defaultValue={{ value: '', label: 'No agent' }}
						onChange={handleChange}
						error={errors.agentAssigned}
						touched={touched.agentAssigned}
					/>
				</>
			) : hasPermission('leads', 'bulkAssign_team') ? (
				<>
					<SelectField
						label='Team Lead'
						name='teamLeadAssigned'
						options={
							managerId && filteredTeamLeaders?.length
								? filteredTeamLeaders.map((tl) => ({
										value: tl._id,
										label: tl.fullName,
									}))
								: []
						}
						defaultValue={{ value: '', label: 'No Team Lead' }}
						onChange={handleTeamLeaderChange}
						error={errors.teamLeadAssigned}
						touched={touched.teamLeadAssigned}
						labelProps={{ display: 'flex', ms: '4px', mb: '0' }}
					/>
					<SelectField
						label='Select Agent'
						name='agentAssigned'
						options={filteredAgents?.map((a) => ({
							value: a._id,
							label: a.fullName,
						}))}
						defaultValue={{ value: '', label: 'No agent' }}
						onChange={handleChange}
						error={errors.agentAssigned}
						touched={touched.agentAssigned}
					/>
				</>
			) : hasPermission('leads', 'bulkAssign_agents') ? (
				<SelectField
					label='Select Agent'
					name='agentAssigned'
					options={filteredAgents?.map((a) => ({
						value: a._id,
						label: a.fullName,
					}))}
					defaultValue={{ value: '', label: 'No agent' }}
					onChange={handleChange}
					error={errors.agentAssigned}
					touched={touched.agentAssigned}
				/>
			) : null}
		</>
	);
};

export default ManagerAgentImport;