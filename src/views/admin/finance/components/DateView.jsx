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
 *  - badgeColor: string (optional) — Chakra color scheme
 *  - badgeVariant: string (optional) — Chakra badge variant
 *  - customStyles: object (optional) — additional styles for Box
 *  - truncate: boolean (optional) — enable text truncation
 *  - align: string (optional) — text alignment
 *  - icon: ReactElement (optional) — Icon component to display
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
	icon, // New optional icon prop
}) => {
	// Responsive font sizes
	const labelSize = useBreakpointValue({ base: 'xs', md: 'sm' });
	const valueSize = useBreakpointValue({ base: 'sm', md: 'md' });
	const badgeSize = useBreakpointValue({ base: '0.8em', md: '0.9em' });
	const iconSize = useBreakpointValue({ base: 3, md: 3 });

	if (!value && value !== 0) value = '—';

	return (
		<Box
			{...customStyles}
			textAlign={align}
			minWidth='0' // Enable text truncation
		>
			{label && (
				<Flex align='center' gap={2} mb={1}>
					{icon && <Icon as={icon} boxSize={iconSize} color='gray.500' />}
					<Text
						fontSize={labelSize}
						color='gray.600'
						fontWeight='medium'
						letterSpacing='wide'
					>
						{label}
					</Text>
				</Flex>
			)}

			{isBadge ? (
				<Badge
					colorScheme={badgeColor}
					variant={badgeVariant}
					fontSize={badgeSize}
					px={3}
					py={1}
					borderRadius='full'
					textTransform='capitalize'
					fontWeight='semibold'
					display='inline-flex'
					alignItems='center'
					minH='24px'
				>
					{value}
				</Badge>
			) : (
				<Text
					fontSize={valueSize}
					fontWeight='normal'
					color='gray.900'
					{...(truncate && {
						noOfLines: 2,
						title: typeof value === 'string' ? value : undefined,
						wordBreak: 'break-word',
					})}
				>
					{value}
				</Text>
			)}
		</Box>
	);
};
// export const DataView = ({
// 	label,
// 	value,
// 	isBadge = false,
// 	badgeColor = 'gray',
// 	badgeVariant = 'subtle',
// 	customStyles = {},
// 	truncate = false,
// 	align = 'left',
// }) => {
// 	// Responsive font sizes
// 	const labelSize = useBreakpointValue({ base: 'xs', md: 'sm' });
// 	const valueSize = useBreakpointValue({ base: 'sm', md: 'md' });
// 	const badgeSize = useBreakpointValue({ base: '0.8em', md: '0.9em' });

// 	if (!value && value !== 0) value = '—';

// 	return (
// 		<Box
// 			{...customStyles}
// 			textAlign={align}
// 			minWidth='0' // Enable text truncation
// 		>
// 			{label && (
// 				<Text
// 					fontSize={labelSize}
// 					color='gray.600'
// 					fontWeight='medium'
// 					mb={1}
// 					letterSpacing='wide'
// 				>
// 					{label}
// 				</Text>
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

// Additional specialized DataView components
export const DataViewGroup = ({
	children,
	columns = { base: 1, md: 2 },
	spacing = 4,
}) => (
	<SimpleGrid columns={columns} spacing={spacing}>
		{children}
	</SimpleGrid>
);
