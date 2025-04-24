import { useMemo } from 'react';
import {
	Grid,
	GridItem,
	FormLabel,
	Input,
	Text,
	Select,
	Box,
} from '@chakra-ui/react';
import useFetchUserHierarchy from 'hooks/useFetchUserHierarchy';
import { mainLeadStatus } from 'utils/options';

const AdvancedSearchForm = (props) => {
	const {
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		user: userProp,
		tree,
	} = props;

	const user = JSON.parse(localStorage.getItem('user')) || userProp;
	const { agents } = useFetchUserHierarchy(user);

	const isSuperAdmin = user?.role === 'superAdmin';
	const isAgent = user?.roles?.[0]?.roleName === 'Agent';

	// Define field configurations
	const allFields = useMemo(
		() => [
			{ name: 'leadName', label: 'Name', placeholder: 'Enter Lead Name' },
			{ name: 'leadEmail', label: 'Email', placeholder: 'Enter Lead Email' },
			{
				name: 'nationality',
				label: 'Nationality',
				placeholder: 'Search by Nationality',
			},
			{
				name: 'ip',
				label: 'Country Source',
				placeholder: 'Search by Country Source',
			},
			{
				name: 'leadAddress',
				label: 'Lead Address',
				placeholder: 'Search by Address',
			},
			{
				name: 'leadCampaign',
				label: 'Lead Campaign',
				placeholder: 'Search by Campaign',
			},
			{
				name: 'leadSourceDetails',
				label: 'Source Content',
				placeholder: 'Search by Source Content',
			},
			{
				name: 'leadSourceMedium',
				label: 'Source Medium',
				placeholder: 'Search by Source Medium',
			},
			{
				name: 'pageUrl',
				label: 'Campaign URL',
				placeholder: 'Search by Campaign URL',
			},
			{
				name: 'r_u_in_uae',
				label: 'Are You in UAE?',
				placeholder: 'Search by UAE Status',
			},
			{
				name: 'leadLang',
				label: 'Lead Language',
				placeholder: 'Search by Language',
			},
			{
				name: 'lastNote',
				label: 'Last Note',
				placeholder: 'Search by last note',
			},
			{
				name: 'budget',
				label: 'Budget',
				placeholder: 'Search by Budget',
			},
			{
				name: 'timetocall',
				label: 'Time To Call',
				placeholder: 'Search by time to call',
			},
		],
		[]
	);

	// Define fields to display based on roles
	const displayedFields = useMemo(() => {
		if (isAgent) {
			return allFields; // Show all fields to agents
		}

		if (isSuperAdmin) {
			// Show only specific fields to super admins
			return allFields.filter((field) =>
				[
					'leadName',
					'requestedByAgent',
					'nationality',
					'leadEmail',
					'status',
				].includes(field.name)
			);
		}

		// Default: Show all fields for other roles
		return allFields;
	}, [isSuperAdmin, isAgent, allFields]);

	// Utility function for rendering fields
	const renderField = (field) => (
		<GridItem key={field.name}>
			<FormLabel
				display='flex'
				ms='4px'
				fontSize='sm'
				fontWeight='600'
				color='#000'
				mb='0'
				mt={2}
			>
				{field.label}
			</FormLabel>
			<Input
				fontSize='sm'
				onChange={handleChange}
				onBlur={handleBlur}
				value={values[field.name] || ''}
				name={field.name}
				placeholder={field.placeholder}
				fontWeight='500'
			/>
			<Text mb='10px' color='red'>
				{errors[field.name] && touched[field.name] && errors[field.name]}
			</Text>
		</GridItem>
	);

	return (
		<Grid
			overflow='scroll'
			height={isSuperAdmin ? '30vh' : '45vh'}
			p='2'
			templateColumns={{
				base: 'repeat(1, 1fr)',
				md: 'repeat(3,1fr)',
				lg: isSuperAdmin ? 'repeat(3,1fr)' : 'repeat(4,1fr)',
			}}
			mb={3}
			gap={3}
		>
			{displayedFields.map(renderField)}

			{/* Lead Status Field */}
			<GridItem>
				<FormLabel
					display='flex'
					ms='4px'
					fontSize='sm'
					fontWeight='600'
					color='#000'
					mb='0'
					mt={2}
				>
					Status
				</FormLabel>
				<Select
					value={values?.leadStatus || ''}
					fontSize='sm'
					name='leadStatus'
					onChange={handleChange}
					fontWeight='500'
					placeholder='Select Lead Status'
				>
					<option value='active'>Interested</option>
					<option value='sold'>Sold</option>
					<option value='pending'>Not interested</option>
					<option value='reassigned'>Reassigned</option>
					<option value='new'>New</option>
					<option value='no_answer'>No Answer</option>
					<option value='unreachable'>Unreachable</option>
					<option value='waiting'>Waiting</option>
					<option value='follow_up'>Follow Up</option>
					<option value='meeting'>Meeting</option>
					<option value='follow_up_after_meeting'>
						Follow Up After Meeting
					</option>
					<option value='junk'>Junk</option>
					<option value='whatsapp_send'>Whatsapp Send</option>
					<option value='whatsapp_rec'>Whatsapp Rec</option>
					<option value='deal_out'>Deal Out</option>
					<option value='shift_project'>Shift Project</option>
					<option value='wrong_number'>Wrong Number</option>
					<option value='broker'>Broker</option>
					<option value='voice_mail'>Voice Mail</option>
					<option value='request'>Request</option>
					<option value='will_attend_the_show'>Will attend the show</option>
					<option value='attended_the_show'>Attended the show</option>
					<option value='callback'>Callback</option>
				</Select>
				<Text mb='10px' color='red'>
					{errors.leadStatus && touched.leadStatus && errors.leadStatus}
				</Text>
			</GridItem>

			{/* Extra Status Field */}
			<GridItem>
				<FormLabel
					display='flex'
					ms='4px'
					fontSize='sm'
					fontWeight='600'
					color='#000'
					mb='0'
					mt={2}
				>
					Main Status
				</FormLabel>
				<Select
					value={values?.eLeadStatus}
					fontSize='sm'
					name='eLeadStatus'
					onChange={handleChange}
					fontWeight='500'
					placeholder='Select Main Lead Status'
				>
					{mainLeadStatus
						?.filter((item) => item.value !== 'deal')
						?.map((item) => (
							<option key={item.value} value={item.value}>
								{item.label}
							</option>
						))}
					<option value='-1'>No E.Status</option>
				</Select>
				<Text mb='10px' color='red'>
					{errors.eLeadStatus && touched.eLeadStatus && errors.eLeadStatus}
				</Text>
			</GridItem>

			{isSuperAdmin && (
				<GridItem>
					<FormLabel
						display='flex'
						ms='4px'
						fontSize='sm'
						fontWeight='600'
						color='#000'
						mb='0'
						mt={2}
					>
						Requested By Agent
					</FormLabel>
					<Box>
						<Select
							name='agentAssigned'
							onChange={handleChange}
							value={values['agentAssigned'] || ''}
						>
							<option value=''>Select agent</option>
							{agents?.map((agent) => (
								<option key={agent._id} value={agent._id}>
									{agent?.name}
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
		</Grid>
	);
};

export default AdvancedSearchForm;
