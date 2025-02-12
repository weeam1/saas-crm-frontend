import { useMemo } from 'react';
import ManagerAgentForm from './ManagerAgentForm';
import { mainLeadStatus } from 'utils/options';
import { leadStatus } from 'utils/options';

const {
	Grid,
	GridItem,
	FormLabel,
	Input,
	Text,
	Select,
} = require('@chakra-ui/react');

const AdvancedSearchForm = (props) => {
	const { values, errors, touched, handleChange, handleBlur, user, tree } =
		props;

	// Define field configurations
	const fields = useMemo(
		() => [
			{ name: 'leadName', label: 'Name', placeholder: 'Enter Lead Name' },
			{ name: 'leadEmail', label: 'Email', placeholder: 'Enter Lead Email' },
			{
				name: 'leadPhoneNumber',
				label: 'Phone Number',
				placeholder: 'Enter Lead Phone Number',
			},
			{
				name: 'leadWhatsappNumber',
				label: 'Whatsapp Number',
				placeholder: 'Search by Whatsapp Number',
			},
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

	// Utility function for rendering fields
	const renderField = (field) => (
		<GridItem colSpan={{ base: 12, md: 6 }} key={field.name}>
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
				value={values[field.name]}
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
		<div>
			<Grid templateColumns='repeat(24, 1fr)' mb={3} gap={3}>
				{fields.map(renderField)}

				{/* Lead Status Field */}
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
						Status
					</FormLabel>
					<Select
						value={values?.leadStatus}
						fontSize='sm'
						name='leadStatus'
						onChange={handleChange}
						fontWeight='500'
						placeholder='Select Lead Status'
					>
						{leadStatus.map((item) => (
							<option key={item.value} value={item.value}>
								{item.label}
							</option>
						))}
					</Select>
					<Text mb='10px' color='red'>
						{errors.leadStatus && touched.leadStatus && errors.leadStatus}
					</Text>
				</GridItem>

				{/* Extra Status Field */}
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
						{mainLeadStatus?.map((item) => (
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

				<ManagerAgentForm
					user={user}
					tree={tree}
					handleChange={handleChange}
					values={values}
					errors={errors}
					touched={touched}
				/>
			</Grid>
		</div>
	);
};

export default AdvancedSearchForm;
