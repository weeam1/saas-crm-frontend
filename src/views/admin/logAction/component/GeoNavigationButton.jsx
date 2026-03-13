// import { IconButton, Tooltip } from '@chakra-ui/react';
// import { MdDirections } from 'react-icons/md';

// export default function GeoNavigationButton({
// 	latitude,
// 	longitude,
// 	size = 'md',
// 	variant = 'solid',
// }) {
// 	if (!latitude || !longitude) return null;

// 	const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
// 	// const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

// 	return (
// 		<Tooltip
// 			label={`Navigate to ${latitude}, ${longitude}`}
// 			placement='top'
// 			hasArrow
// 			borderRadius='md'
// 		>
// 			<IconButton
// 				as='a'
// 				href={mapsUrl}
// 				target='_blank'
// 				rel='noopener noreferrer'
// 				icon={<MdDirections />}
// 				size={size}
// 				colorScheme='blue'
// 				variant={variant}
// 				borderRadius='full'
// 				_hover={{
// 					transform: 'scale(1.1)',
// 					boxShadow: 'lg',
// 				}}
// 				_active={{
// 					transform: 'scale(0.95)',
// 				}}
// 				transition='all 0.2s'
// 				aria-label={`Open directions in Google Maps for location at ${latitude}, ${longitude}`}
// 			/>
// 		</Tooltip>
// 	);
// }

import { Button, Icon, Tooltip, HStack, Text } from '@chakra-ui/react';
import { ExternalLinkIcon, InfoIcon } from '@chakra-ui/icons';
import { MdDirections } from 'react-icons/md';

export default function GeoNavigationButton({
	latitude,
	longitude,
	showLabel = true,
	variant = 'solid',
}) {
	if (!latitude || !longitude) return null;

	const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

	// const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

	const buttonVariants = {
		solid: {
			colorScheme: 'blue',
			variant: 'solid',
			icon: <Icon as={MdDirections} />,
		},
		outline: {
			colorScheme: 'blue',
			variant: 'outline',
			icon: <Icon as={MdDirections} />,
		},
		ghost: {
			colorScheme: 'blue',
			variant: 'ghost',
			icon: <Icon as={MdDirections} />,
		},
		subtle: {
			colorScheme: 'gray',
			variant: 'ghost',
			icon: <InfoIcon />,
			size: 'xs',
		},
	};

	const config = buttonVariants[variant] || buttonVariants.solid;

	return (
		<Button
			as='a'
			href={mapsUrl}
			target='_blank'
			rel='noopener noreferrer'
			size={config.size || 'sm'}
			colorScheme={config.colorScheme}
			variant={config.variant}
			leftIcon={config.icon}
			rightIcon={
				!showLabel && variant !== 'subtle' ? <ExternalLinkIcon /> : undefined
			}
			borderRadius='full'
			_hover={{
				transform: 'translateY(-2px)',
				boxShadow: 'lg',
			}}
			_active={{
				transform: 'translateY(0)',
			}}
			transition='all 0.2s'
			fontWeight='medium'
			aria-label={`Open directions in Google Maps for location at ${latitude}, ${longitude}`}
			whiteSpace='normal'
			height='auto'
			py={2}
			mt={2}
		>
			{showLabel && (
				<HStack spacing={2}>
					<Text>Open in Google Maps</Text>
					<ExternalLinkIcon />
				</HStack>
			)}
		</Button>
	);
}
