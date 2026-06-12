/**
 * FiltersBar
 * ----------
 * Responsive filter controls for the Leads Reports page: date-field selector,
 * date range (native, accessible date inputs), and data-driven Status / Source
 * dropdowns. Emits changes through `onChange(key, value)` and supports reset.
 */

import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Grid,
	Icon,
	Input,
	Select,
	Text,
} from '@chakra-ui/react';
import { FiFilter, FiRotateCcw } from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';

const DATE_FIELD_OPTIONS = [
	{ value: 'createdDate', label: 'Created date' },
	{ value: 'leadConversionDate', label: 'Conversion date' },
	{ value: 'leadStatusDate', label: 'Status change date' },
	{ value: 'updatedDate', label: 'Updated date' },
	{ value: 'agentAssignedDate', label: 'Agent assigned date' },
];

export const FiltersBar = ({
	filters,
	onChange,
	onReset,
	statusOptions = [],
	sourceOptions = [],
	isLoading = false,
}) => {
	const colors = useModalColors();

	const fieldStyles = {
		bg: colors.bgInput,
		color: colors.headingText,
		borderColor: colors.borderColor,
		borderRadius: 'md',
		_hover: { borderColor: colors.accentGold },
		_focus: { borderColor: colors.borderFocus, boxShadow: `0 0 0 1px ${colors.borderFocus}` },
	};

	const labelStyles = {
		fontSize: 'xs',
		fontWeight: 'medium',
		color: colors.labelColor,
		mb: 1,
	};

	return (
		<Box
			bg={colors.bg}
			rounded='lg'
			shadow={colors.cardShadow}
			borderWidth='1px'
			borderColor={colors.borderColor}
			p={{ base: 4, md: 5 }}
		>
			<Flex align='center' gap={2} mb={4}>
				<Icon as={FiFilter} color={colors.accentGold} aria-hidden />
				<Text fontWeight='semibold' color={colors.headingText}>
					Filters
				</Text>
			</Flex>

			<Grid
				templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }}
				gap={3}
				alignItems='end'
			>
				<FormControl>
					<FormLabel {...labelStyles} htmlFor='rv3-dateField'>Date field</FormLabel>
					<Select
						id='rv3-dateField'
						size='sm'
						value={filters.dateField}
						onChange={(e) => onChange('dateField', e.target.value)}
						{...fieldStyles}
					>
						{DATE_FIELD_OPTIONS.map((o) => (
							<option key={o.value} value={o.value} style={{ color: '#000' }}>
								{o.label}
							</option>
						))}
					</Select>
				</FormControl>

				<FormControl>
					<FormLabel {...labelStyles} htmlFor='rv3-dateFrom'>From</FormLabel>
					<Input
						id='rv3-dateFrom'
						size='sm'
						type='date'
						value={filters.dateFrom}
						max={filters.dateTo || undefined}
						onChange={(e) => onChange('dateFrom', e.target.value)}
						{...fieldStyles}
					/>
				</FormControl>

				<FormControl>
					<FormLabel {...labelStyles} htmlFor='rv3-dateTo'>To</FormLabel>
					<Input
						id='rv3-dateTo'
						size='sm'
						type='date'
						value={filters.dateTo}
						min={filters.dateFrom || undefined}
						onChange={(e) => onChange('dateTo', e.target.value)}
						{...fieldStyles}
					/>
				</FormControl>

				<FormControl>
					<FormLabel {...labelStyles} htmlFor='rv3-status'>Status</FormLabel>
					<Select
						id='rv3-status'
						size='sm'
						placeholder='All statuses'
						value={filters.leadStatus}
						onChange={(e) => onChange('leadStatus', e.target.value)}
						isDisabled={isLoading}
						{...fieldStyles}
					>
						{statusOptions.map((o) => (
							<option key={o.value} value={o.value} style={{ color: '#000' }}>
								{o.label} {o.count != null ? `(${o.count})` : ''}
							</option>
						))}
					</Select>
				</FormControl>

				<FormControl>
					<FormLabel {...labelStyles} htmlFor='rv3-source'>Source</FormLabel>
					<Select
						id='rv3-source'
						size='sm'
						placeholder='All sources'
						value={filters.source}
						onChange={(e) => onChange('source', e.target.value)}
						isDisabled={isLoading}
						{...fieldStyles}
					>
						{sourceOptions.map((o) => (
							<option key={o.value} value={o.value} style={{ color: '#000' }}>
								{o.label} {o.count != null ? `(${o.count})` : ''}
							</option>
						))}
					</Select>
				</FormControl>
			</Grid>

			<Flex justify='flex-end' mt={4}>
				<Button
					size='sm'
					leftIcon={<FiRotateCcw />}
					variant='outline'
					onClick={onReset}
					color={colors.secondaryBtnText}
					borderColor={colors.secondaryBtnBorder}
					bg='transparent'
					_hover={{ bg: colors.secondaryBtnHoverBg, color: colors.secondaryBtnHoverText }}
				>
					Reset filters
				</Button>
			</Flex>
		</Box>
	);
};

export default FiltersBar;
