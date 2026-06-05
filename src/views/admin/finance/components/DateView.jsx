// import {
// 	Box,
// 	Text,
// 	Badge,
// 	useBreakpointValue,
// 	SimpleGrid,
// 	Icon,
// 	Flex,
// } from '@chakra-ui/react';

// /**
//  * Enhanced reusable component to show label + value pair
//  * Props:
//  *  - label: string
//  *  - value: string | number | ReactNode
//  *  - isBadge: boolean (optional)
//  *  - badgeColor: string (optional) — Chakra color scheme
//  *  - badgeVariant: string (optional) — Chakra badge variant
//  *  - customStyles: object (optional) — additional styles for Box
//  *  - truncate: boolean (optional) — enable text truncation
//  *  - align: string (optional) — text alignment
//  *  - icon: ReactElement (optional) — Icon component to display
//  */

// export const DataView = ({
// 	label,
// 	value,
// 	isBadge = false,
// 	badgeColor = 'gray',
// 	badgeVariant = 'subtle',
// 	customStyles = {},
// 	truncate = false,
// 	align = 'left',
// 	icon, // New optional icon prop
// }) => {
// 	// Responsive font sizes
// 	const labelSize = useBreakpointValue({ base: 'xs', md: 'sm' });
// 	const valueSize = useBreakpointValue({ base: 'sm', md: 'md' });
// 	const badgeSize = useBreakpointValue({ base: '0.8em', md: '0.9em' });
// 	const iconSize = useBreakpointValue({ base: 3, md: 3 });

// 	if (!value && value !== 0) value = '—';

// 	return (
// 		<Box
// 			{...customStyles}
// 			textAlign={align}
// 			minWidth='0' // Enable text truncation
// 		>
// 			{label && (
// 				<Flex align='center' gap={2} mb={1}>
// 					{icon && <Icon as={icon} boxSize={iconSize} color='gray.500' />}
// 					<Text
// 						fontSize={labelSize}
// 						color='gray.600'
// 						fontWeight='medium'
// 						letterSpacing='wide'
// 					>
// 						{label}
// 					</Text>
// 				</Flex>
// 			)}

// 			{isBadge ? (
// 				<Badge
// 					colorScheme={badgeColor}
// 					variant={badgeVariant}
// 					fontSize={badgeSize}
// 					px={3}
// 					py={1}
// 					borderRadius='full'
// 					textTransform='capitalize'
// 					fontWeight='semibold'
// 					display='inline-flex'
// 					alignItems='center'
// 					minH='24px'
// 				>
// 					{value}
// 				</Badge>
// 			) : (
// 				<Text
// 					fontSize={valueSize}
// 					fontWeight='normal'
// 					color='gray.900'
// 					{...(truncate && {
// 						noOfLines: 2,
// 						title: typeof value === 'string' ? value : undefined,
// 						wordBreak: 'break-word',
// 					})}
// 				>
// 					{value}
// 				</Text>
// 			)}
// 		</Box>
// 	);
// };

// // Additional specialized DataView components
// export const DataViewGroup = ({
// 	children,
// 	columns = { base: 1, md: 2 },
// 	spacing = 4,
// }) => (
// 	<SimpleGrid columns={columns} spacing={spacing}>
// 		{children}
// 	</SimpleGrid>
// );

import {
	Box,
	Text,
	Badge,
	useBreakpointValue,
	SimpleGrid,
	Icon,
	Flex,
} from '@chakra-ui/react';

/**
 * Enhanced reusable component to show label + value pair
 * Props:
 *  - label: string
 *  - value: string | number | ReactNode
 *  - isBadge: boolean (optional)
 *  - badgeColor: string (optional) — Chakra color scheme (or custom)
 *  - badgeVariant: string (optional) — Chakra badge variant
 *  - customStyles: object (optional) — additional styles for Box
 *  - truncate: boolean (optional) — enable text truncation
 *  - align: string (optional) — text alignment
 *  - icon: ReactElement (optional) — Icon component to display
 *  - valueColor: string (optional) — custom color for value text
 *  - highlight: boolean (optional) — highlight value with gold color
 */

export const DataView = ({
	label,
	value,
	isBadge = false,
	badgeColor = 'gray',
	badgeVariant = 'subtle',
	customStyles = {},
	truncate = false,
	align = 'left',
	icon,
	valueColor,
	highlight = false,
}) => {
	// Responsive font sizes
	const labelSize = useBreakpointValue({ base: 'xs', md: 'sm' });
	const valueSize = useBreakpointValue({ base: 'sm', md: 'md' });
	const badgeSize = useBreakpointValue({ base: '0.75em', md: '0.85em' });
	const iconSize = useBreakpointValue({ base: 3, md: 3.5 });

	if (!value && value !== 0) value = '—';

	// Get badge styling based on theme
	const getBadgeStyles = () => {
		if (badgeColor === 'gold') {
			return {
				bg: 'rgba(212, 175, 55, 0.1)',
				color: 'gold.primary',
				border: '1px solid',
				borderColor: 'rgba(212, 175, 55, 0.3)',
			};
		}
		return {
			colorScheme: badgeColor,
			variant: badgeVariant,
		};
	};

	const badgeStyles = getBadgeStyles();

	// Determine value text color
	const getValueColor = () => {
		if (valueColor) return valueColor;
		if (highlight) return 'gold.primary';
		if (isBadge) return undefined;
		return 'text.body';
	};

	return (
		<Box
			{...customStyles}
			textAlign={align}
			minWidth='0' // Enable text truncation
		>
			{label && (
				<Flex align='center' gap={2} mb={1.5}>
					{icon && <Icon as={icon} boxSize={iconSize} color='text.muted' />}
					<Text
						fontSize={labelSize}
						color='text.muted'
						fontWeight='500'
						letterSpacing='wide'
						textTransform='uppercase'
					>
						{label}
					</Text>
				</Flex>
			)}

			{isBadge ? (
				<Badge
					{...badgeStyles}
					fontSize={badgeSize}
					px={3}
					py={1.5}
					borderRadius='full'
					textTransform='capitalize'
					fontWeight='500'
					display='inline-flex'
					alignItems='center'
					minH='28px'
				>
					{value}
				</Badge>
			) : (
				<Text
					fontSize={valueSize}
					fontWeight={highlight ? 'bold' : 'medium'}
					color={getValueColor()}
					{...(truncate && {
						noOfLines: 2,
						title: typeof value === 'string' ? value : undefined,
						wordBreak: 'break-word',
					})}
					fontFamily={highlight ? 'inherit' : 'inherit'}
				>
					{value}
				</Text>
			)}
		</Box>
	);
};

// Additional specialized DataView components
export const DataViewGroup = ({
	children,
	columns = { base: 1, md: 2 },
	spacing = 5,
}) => (
	<SimpleGrid columns={columns} spacing={spacing}>
		{children}
	</SimpleGrid>
);
