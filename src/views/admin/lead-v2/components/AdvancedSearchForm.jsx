import { useMemo, useState } from 'react';
import ManagerAgentForm from './ManagerAgentForm';
import { mainLeadStatus } from 'utils/options';
import { leadStatus } from 'utils/options';
import CustomDatePicker from 'components/datetime/CustomDatePicker';
import { useSelector } from 'react-redux';
import { toCapitalCase } from 'utils/helpers';

const {
	Grid,
	GridItem,
	FormLabel,
	Input,
	Text,
	Select,
	Box,
} = require('@chakra-ui/react');

const AdvancedSearchForm = (props) => {
	const {
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		user,
		tree,
		setFieldValue,
	} = props;

	const [openCalendar, setOpenCalendar] = useState(null); // Track which calendar is open
	const allCountries = useSelector((state) => state.countries.countryNames);

	const toggleCalendar = (calendar) => {
		setOpenCalendar(openCalendar === calendar ? null : calendar);
	};

	const countries = allCountries.map((name) => {
		const countryName = toCapitalCase(name);
		return { label: countryName, value: countryName };
	});

	// Define field configurations
	const fields = useMemo(
		() => [
			{ name: 'intID', label: 'Lead ID', placeholder: 'Enter Lead ID' },
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
			// {
			// 	name: 'ip',
			// 	label: 'Country Source',
			// 	placeholder: 'Search by Country Source',
			// },
			{
				name: 'attendanceDay',
				label: 'Attendance Day',
				placeholder: 'Search by Attendance day',
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
				// label: 'Source Content',
				label: 'Ad Name',
				placeholder: 'Search by Ad Name',
			},
			{
				name: 'leadSourceMedium',
				label: 'Source Medium',
				placeholder: 'Search by Source Medium',
			},
			{
				name: 'leadSourceChannel',
				label: 'Source Channel',
				placeholder: 'Search by Source Channel',
			},
			{
				name: 'adset',
				label: 'Adset',
				placeholder: 'Search by Adset',
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
			{
				name: 'city',
				label: 'City',
				placeholder: 'Search by city',
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
		<Grid
			p='2'
			templateColumns={{ base: '1fr', sm: '1fr', md: 'repeat(24, 1fr)' }}
			mb={3}
			gap={2}
		>
			{/* Start Date */}
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
					Start Date
				</FormLabel>
				<CustomDatePicker
					selectedDate={values.startDate}
					handleDateChange={(date) => setFieldValue('startDate', date)}
					errors={touched.startDate && errors.startDate}
					// label='Start Date'
					placeholder='Select start date'
					maxDate={values.endDate || new Date()}
					isCalendarOpen={openCalendar === 'start'}
					toggleCalendar={() => toggleCalendar('start')}
				/>
			</GridItem>

			{/* End Date */}
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
					End Date
				</FormLabel>
				<CustomDatePicker
					selectedDate={values.endDate}
					handleDateChange={(date) => setFieldValue('endDate', date)}
					errors={touched.endDate && errors.endDate}
					// label='End Date'
					placeholder='Select end date'
					minDate={values.startDate} // Ensure the end date is after the start date
					maxDate={new Date()}
					isCalendarOpen={openCalendar === 'end'}
					toggleCalendar={() => toggleCalendar('end')}
				/>
			</GridItem>

			{fields.map(renderField)}

			{/* Country  Field */}
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
					Country
				</FormLabel>
				<Select
					value={values?.country}
					fontSize='sm'
					name='country'
					onChange={handleChange}
					fontWeight='500'
					placeholder='Select country'
				>
					{countries?.map((item) => (
						<option key={item.value} value={item.value}>
							{item.label}
						</option>
					))}
				</Select>
				<Text mb='10px' color='red'>
					{errors.eLeadStatus && touched.eLeadStatus && errors.eLeadStatus}
				</Text>
			</GridItem>

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

			{/* M Status Sort Field */}
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
					Sort Main Status
				</FormLabel>

				<Select
					value={values?.mainStatusSort}
					name='mainStatusSort'
					onChange={handleChange}
					fontSize='sm'
					fontWeight='500'
					placeholder='Select Main Status Order'
				>
					<option value='-1'>Latest to Oldest</option>
					<option value='1'>Oldest to Latest</option>
				</Select>
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

			{user?.roles[0]?.roleName !== 'Agent' && (
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
						Rleased
					</FormLabel>
					<Select
						value={values?.isReleased}
						fontSize='sm'
						name='isReleased'
						onChange={handleChange}
						fontWeight='500'
						placeholder='Select Released Status'
					>
						<option value={true}>Released Leads</option>
					</Select>
					<Text mb='10px' color='red'>
						{errors.isReleased && touched.isReleased && errors.isReleased}
					</Text>
				</GridItem>
			)}

			<ManagerAgentForm
				user={user}
				tree={tree}
				handleChange={handleChange}
				values={values}
				errors={errors}
				touched={touched}
				setFieldValue={setFieldValue}
			/>
		</Grid>
	);
};

export default AdvancedSearchForm;
