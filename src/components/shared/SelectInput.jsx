import { leadSelectInputFontSize } from 'views/admin/lead-v2/components/constants';
import { leadlabelFontSize } from 'views/admin/lead-v2/components/constants';

import {
	FormControl,
	FormLabel,
	Select,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const UNASSIGN_LEADS_LABELS = {
	managerAssigned: 'Manager',
	agentAssigned: 'Agent',
	teamLeadAssigned: 'Team Lead',
};

const SelectInput = ({
	label,
	name,
	options = [],
	placeholder = 'Select',
	size = 'sm',
	borderColorCustom,
	textColorCustom,
	bgColorCustom,
	dropdownBgCustom,
	selectedValue,
	loading,
	type = 'static',
	...props
}) => {
	// Use theme tokens directly (no useColorModeValue needed since theme handles it)
	const borderColor = borderColorCustom || 'border.default';
	const textColor = textColorCustom || 'text.body';
	const bgColor = bgColorCustom || 'bg.input';
	const dropdownBg = dropdownBgCustom || 'bg.surface';

	return (
		<FormControl>
			{label && (
				<FormLabel
					fontSize={leadlabelFontSize}
					color='text.muted'
					fontWeight='medium'
				>
					{label}
				</FormLabel>
			)}
			<Select
				size={size}
				name={name}
				value={loading ? '' : (selectedValue ?? '')}
				fontSize={leadSelectInputFontSize || 'sm'}
				variant='outline'
				bg={type === 'static' ? bgColor : 'bg.input'}
				borderColor={borderColor}
				borderWidth='1px'
				borderRadius='lg'
				color={type === 'static' ? textColor : 'text.body'}
				icon={<ChevronDownIcon />}
				_hover={{
					borderColor: 'border.gold',
					bg: 'bg.elevated',
					color: 'text.accent',
					cursor: 'pointer',
				}}
				_focus={{
					borderColor: 'border.focus',
					boxShadow: 'goldGlow',
				}}
				transition='all 0.2s ease'
				isDisabled={loading || options.length < 1}
				{...props}
			>
				{loading ? (
					<option value='' disabled>
						Updating...
					</option>
				) : (
					<>
						{UNASSIGN_LEADS_LABELS[name] ? (
							<option
								value=''
								disabled={!selectedValue}
								style={{
									backgroundColor: '#10273A', // bg.surface
									color: '#B0B0B0', // text.muted
								}}
							>
								Unassigned {UNASSIGN_LEADS_LABELS[name]}
							</option>
						) : (
							<option
								value=''
								selected={selectedValue === ''}
								style={{
									backgroundColor: '#10273A',
									color: '#B0B0B0',
								}}
							>
								{placeholder}
							</option>
						)}

						{/* Dynamic options */}
						{options.map((opt) => (
							<option
								key={type === 'dynamic' ? opt._id : opt.value}
								value={type === 'dynamic' ? opt._id : opt.value}
								disabled={opt.isActive === false}
								style={{
									backgroundColor: opt?.isActive === false ? '#24496E' : '#10273A',
									color: opt?.isActive === false ? '#808080' : '#B0B0B0',
								}}
							>
								{type === 'dynamic' ? `${opt?.fullName}` : opt.label}
							</option>
						))}
					</>
				)}
			</Select>
		</FormControl>
	);
};

export default SelectInput;