import { Box, Text, keyframes } from '@chakra-ui/react';

// Color palette for consistent avatar colors
const AVATAR_COLORS = [
	// Blue tones
	{ bg: '#3182CE', text: 'white', glow: '#90CDF4' },
	// Green tones
	{ bg: '#38A169', text: 'white', glow: '#9AE6B4' },
	// Purple tones
	{ bg: '#805AD5', text: 'white', glow: '#D6BCFA' },
	// Orange tones
	{ bg: '#DD6B20', text: 'white', glow: '#FBD38D' },
	// Pink tones
	{ bg: '#D53F8C', text: 'white', glow: '#FBB6CE' },
	// Teal tones
	{ bg: '#319795', text: 'white', glow: '#81E6D9' },
	// Red tones
	{ bg: '#E53E3E', text: 'white', glow: '#FEB2B2' },
	// Cyan tones
	{ bg: '#00B5D8', text: 'white', glow: '#9DECF9' },
];

// Smooth pulse animations
const pulseRing = keyframes`
  0% {
    transform: scale(0.85);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.2;
  }
  100% {
    transform: scale(0.85);
    opacity: 0.4;
  }
`;

const pulseWave = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  70% {
    transform: scale(1.4);
    opacity: 0;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
`;

// Get consistent color based on string
const getColorForString = (str) => {
	if (!str || str === 'Unknown') return AVATAR_COLORS[0];

	// Simple hash function for consistent color assignment
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	const index = Math.abs(hash) % AVATAR_COLORS.length;
	return AVATAR_COLORS[index];
};

const CallAvatar = ({
	leadDetails,
	number,
	size = 'lg',
	variant = 'incoming',
}) => {
	// Get avatar name
	const avatarName =
		leadDetails?.leadName || (number ? `Call ${number.slice(-4)}` : 'Unknown');

	// Get initials
	const getInitials = (name) => {
		if (!name || name === 'Unknown') return '?';

		const cleanName = name.trim().replace(/\s+/g, ' ');
		const parts = cleanName.split(' ');

		if (parts.length === 1) {
			return cleanName.slice(0, 2).toUpperCase();
		}

		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	};

	const initials = getInitials(avatarName);

	// Size mapping (in pixels)
	const sizeMap = {
		xs: { box: 48, ring1: 64, ring2: 96 },
		sm: { box: 64, ring1: 84, ring2: 120 },
		md: { box: 80, ring1: 100, ring2: 160 },
		lg: { box: 100, ring1: 130, ring2: 200 },
		xl: { box: 120, ring1: 150, ring2: 240 },
		'2xl': { box: 160, ring1: 200, ring2: 320 },
	};

	const sizes = sizeMap[size] || sizeMap.xl;
	const colorData = getColorForString(avatarName);

	// Pulse colors based on variant (using your color palette)
	const pulseColors = {
		incoming: AVATAR_COLORS[1], // Green
		outgoing: AVATAR_COLORS[0], // Blue
		active: AVATAR_COLORS[5], // Teal
	};

	const pulseColor = pulseColors[variant] || pulseColors.incoming;
	const showPulse = ['active', 'incoming', 'outgoing'].includes(variant);

	return (
		<Box
			position='relative'
			display='flex'
			alignItems='center'
			justifyContent='center'
			width={`${sizes.ring2}px`}
			height={`${sizes.ring2}px`}
			mx='auto'
		>
			{/* First outer wave */}
			{showPulse && (
				<Box
					position='absolute'
					width={`${sizes.ring2}px`}
					height={`${sizes.ring2}px`}
					borderRadius='full'
					border={`1.5px solid ${pulseColor.bg}`}
					animation={`${pulseWave} 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite`}
					opacity='0.4'
				/>
			)}

			{/* Second outer wave with delay */}
			{showPulse && (
				<Box
					position='absolute'
					width={`${sizes.ring2}px`}
					height={`${sizes.ring2}px`}
					borderRadius='full'
					border={`1.5px solid ${pulseColor.bg}`}
					animation={`${pulseWave} 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.6s`}
					opacity='0.3'
				/>
			)}

			{/* Inner pulse ring */}
			{showPulse && (
				<Box
					position='absolute'
					width={`${sizes.ring1}px`}
					height={`${sizes.ring1}px`}
					borderRadius='full'
					background={`linear-gradient(135deg, ${pulseColor.bg}40 0%, ${pulseColor.glow}20 100%)`}
					animation={`${pulseRing} 1.8s ease-in-out infinite`}
					boxShadow={`0 0 20px ${pulseColor.glow}40`}
				/>
			)}

			{/* Main Avatar Circle */}
			<Box
				width={`${sizes.box}px`}
				height={`${sizes.box}px`}
				borderRadius='full'
				background={`linear-gradient(135deg, ${colorData.bg} 0%, ${colorData.bg}90 100%)`}
				display='flex'
				alignItems='center'
				justifyContent='center'
				fontWeight='bold'
				fontSize={`${sizes.box / 2.8}px`}
				color={colorData.text}
				position='relative'
				zIndex={10}
				boxShadow={`
          0 0 0 4px white,
          0 8px 32px ${colorData.glow}50,
          inset 0 4px 8px rgba(255, 255, 255, 0.3),
          inset 0 -4px 8px rgba(0, 0, 0, 0.2)
        `}
				sx={{
					'&::before': {
						content: '""',
						position: 'absolute',
						top: '12%',
						left: '12%',
						width: '24%',
						height: '24%',
						borderRadius: 'full',
						background:
							'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 0%, transparent 70%)',
						zIndex: 1,
					},
				}}
			>
				<Text
					fontSize={`${sizes.box / 3}px`}
					fontWeight='bold'
					color='white'
					textShadow='0 2px 12px rgba(0,0,0,0.3)'
					position='relative'
					zIndex={2}
					letterSpacing='0.5px'
				>
					{initials}
				</Text>
			</Box>
		</Box>
	);
};

export default CallAvatar;
