/**
 * ModuleCard
 * ----------
 * A single report-module card on the Reports Home grid. Keyboard accessible
 * (button semantics) and disabled gracefully for "coming soon" modules.
 */

import { Badge, Box, Flex, Icon, Text } from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {React.ElementType} props.icon
 * @param {'active'|'soon'} [props.status]
 * @param {() => void} [props.onClick]
 */
export const ModuleCard = ({ title, description, icon: IconComponent, status = 'active', onClick }) => {
	const colors = useModalColors();
	const isActive = status === 'active';

	const handleKeyDown = (e) => {
		if (!isActive) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onClick?.();
		}
	};

	return (
		<Box
			role='button'
			tabIndex={isActive ? 0 : -1}
			aria-disabled={!isActive}
			aria-label={`${title} reports${isActive ? '' : ' — coming soon'}`}
			onClick={isActive ? onClick : undefined}
			onKeyDown={handleKeyDown}
			bg={colors.bg}
			rounded='xl'
			shadow={colors.cardShadow}
			borderWidth='1px'
			borderColor={colors.borderColor}
			p={6}
			cursor={isActive ? 'pointer' : 'not-allowed'}
			opacity={isActive ? 1 : 0.6}
			transition='all 0.2s ease'
			_hover={isActive ? { borderColor: colors.accentGold, transform: 'translateY(-4px)', boxShadow: colors.modalShadow } : {}}
			_focusVisible={{ outline: '2px solid', outlineColor: colors.accentGold, outlineOffset: '2px' }}
			h='100%'
			display='flex'
			flexDirection='column'
		>
			<Flex justify='space-between' align='flex-start' mb={4}>
				<Flex
					align='center'
					justify='center'
					boxSize='52px'
					rounded='lg'
					bg={colors.bgInput}
					color={colors.accentGold}
					borderWidth='1px'
					borderColor={colors.borderColor}
					aria-hidden
				>
					<Icon as={IconComponent} boxSize={6} />
				</Flex>
				<Badge
					px={2}
					py={1}
					rounded='full'
					fontSize='0.65rem'
					textTransform='uppercase'
					letterSpacing='wider'
					bg={isActive ? colors.badgeSuccessBg : colors.badgeWarningBg}
					color={isActive ? colors.badgeSuccessText : colors.badgeWarningText}
					borderWidth='1px'
					borderColor={isActive ? colors.badgeSuccessBorder : colors.badgeWarningBorder}
				>
					{isActive ? 'Active' : 'Coming soon'}
				</Badge>
			</Flex>

			<Text fontSize='lg' fontWeight='bold' color={colors.headingText} mb={1}>
				{title}
			</Text>
			<Text fontSize='sm' color={colors.mutedText} flex='1'>
				{description}
			</Text>

			{isActive && (
				<Flex align='center' gap={1} mt={4} color={colors.accentGold} fontSize='sm' fontWeight='medium'>
					<Text>View reports</Text>
					<Icon as={FiArrowRight} boxSize={4} aria-hidden />
				</Flex>
			)}
		</Box>
	);
};

export default ModuleCard;
