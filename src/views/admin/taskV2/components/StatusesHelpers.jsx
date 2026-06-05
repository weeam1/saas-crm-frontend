import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Button,
	Badge,
	Box,
	Text,
	Icon,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG } from '../taskUtils';

// Status Badge Component
export const StatusBadgeSelect = ({ value, onChange }) => {
	const config = TASK_STATUS_CONFIG[value] || TASK_STATUS_CONFIG.Pending;

	return (
		<Menu>
			<MenuButton
				as={Button}
				rightIcon={<ChevronDownIcon />}
				size='sm'
				borderRadius='lg'
				bg={config.bgColor}
				color={config.textColor}
				border='1px solid'
				borderColor='border.default'
				_hover={{
					bg: config.hoverBg,
					borderColor: 'gold.primary',
					transform: 'translateY(-1px)',
				}}
				_active={{ transform: 'translateY(0)' }}
				transition='all 0.2s'
				fontWeight='500'
				leftIcon={<Box as='span' w='2px' />}
				sx={{
					backdropFilter: 'blur(10px)',
				}}
			>
				{config.label}
			</MenuButton>
			<MenuList
				bg='bg.surface'
				borderColor='border.default'
				boxShadow='card'
				py={2}
				sx={{
					backdropFilter: 'blur(20px)',
					background: 'rgba(16, 39, 58, 0.95)',
				}}
			>
				{Object.entries(TASK_STATUS_CONFIG).map(([key, config]) => (
					<MenuItem
						key={key}
						onClick={() => onChange(key)}
						bg={value === key ? 'bg.elevated' : 'transparent'}
						_hover={{ bg: 'bg.elevated' }}
						transition='all 0.15s'
						py={2}
					>
						<Badge
							bg={config.bgColor}
							color={config.textColor}
							borderRadius='full'
							px={3}
							py={1}
							fontSize='11px'
							fontWeight='500'
							minW='80px'
							textAlign='center'
						>
							{config.label}
						</Badge>
					</MenuItem>
				))}
			</MenuList>
		</Menu>
	);
};

// Priority Badge Component
export const PriorityBadgeSelect = ({ value, onChange }) => {
	const config = TASK_PRIORITY_CONFIG[value] || TASK_PRIORITY_CONFIG.Medium;

	return (
		<Menu>
			<MenuButton
				as={Button}
				rightIcon={<ChevronDownIcon />}
				size='sm'
				borderRadius='lg'
				bg={config.bgColor}
				color={config.textColor}
				border='1px solid'
				borderColor='border.default'
				_hover={{
					bg: config.hoverBg,
					borderColor: 'gold.primary',
					transform: 'translateY(-1px)',
				}}
				_active={{ transform: 'translateY(0)' }}
				transition='all 0.2s'
				fontWeight='500'
				sx={{
					backdropFilter: 'blur(10px)',
				}}
			>
				{config.label}
			</MenuButton>
			<MenuList
				bg='bg.surface'
				borderColor='border.default'
				boxShadow='card'
				py={2}
				sx={{
					backdropFilter: 'blur(20px)',
					background: 'rgba(16, 39, 58, 0.95)',
				}}
			>
				{Object.entries(TASK_PRIORITY_CONFIG).map(([key, config]) => (
					<MenuItem
						key={key}
						onClick={() => onChange(key)}
						bg={value === key ? 'bg.elevated' : 'transparent'}
						_hover={{ bg: 'bg.elevated' }}
						transition='all 0.15s'
						py={2}
					>
						<Badge
							bg={config.bgColor}
							color={config.textColor}
							borderRadius='full'
							px={3}
							py={1}
							fontSize='11px'
							fontWeight='500'
							minW='80px'
							textAlign='center'
						>
							{config.label}
						</Badge>
					</MenuItem>
				))}
			</MenuList>
		</Menu>
	);
};
