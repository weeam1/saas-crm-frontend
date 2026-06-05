import {
	Box,
	Flex,
	Text,
	Icon,
	Badge,
	Tooltip,
	Skeleton,
} from '@chakra-ui/react';
import { useModalColors } from 'hooks/useModalColors';

import { FiArrowUp, FiArrowDown, FiHelpCircle, FiMinus } from 'react-icons/fi';

export const StatCard = ({
	title,
	value,
	icon: IconComponent,
	colorScheme = 'gold',
	trend,
	isLoading = false,
	tooltip,
	precision = 0,
	prefix = '',
	suffix = '',
}) => {
	const colors = useModalColors();

	// Map colorScheme to theme colors
	const getBgColor = () => {
		switch (colorScheme) {
			case 'gold':
				return colors.bgInput;
			default:
				return colors.bgInput;
		}
	};

	const getIconBgColor = () => {
		switch (colorScheme) {
			case 'gold':
				return colors.bgInput;
			default:
				return colors.bgInput;
		}
	};

	const getIconColor = () => {
		switch (colorScheme) {
			case 'gold':
				return colors.accentGold;
			default:
				return colors.accentGold;
		}
	};

	const trendColor =
		trend > 0 ? colors.accentGold : trend < 0 ? colors.badgeErrorText : colors.mutedText;
	const trendIcon = trend > 0 ? FiArrowUp : trend < 0 ? FiArrowDown : FiMinus;

	const formattedValue =
		typeof value === 'number'
			? Number(value).toLocaleString(undefined, {
					minimumFractionDigits: precision,
					maximumFractionDigits: precision,
				})
			: value;

	return (
		<Box
			bg={getBgColor()}
			p={5}
			shadow={colors.cardShadow}
			rounded='lg'
			transition='all 0.2s ease'
			border="1px solid"
			borderColor={colors.borderColor}
			_hover={{
				borderColor: colors.accentGold,
				transform: 'translateY(-2px)',
				boxShadow: colors.modalShadow,
			}}
		>
			<Flex justify='space-between' align='center' mb={3}>
				<Flex align='center'>
					<Text fontSize='sm' fontWeight='medium' color={colors.mutedText} mr={1}>
						{title}
					</Text>
					{tooltip && (
						<Tooltip label={tooltip}>
							<Icon as={FiHelpCircle} boxSize={4} color={colors.mutedText} />
						</Tooltip>
					)}
				</Flex>
				{IconComponent && (
					<Box
						bg={getIconBgColor()}
						rounded='full'
						p='3'
						display='flex'
						alignItems='center'
						justifyContent='center'
						cursor='pointer'
						color={getIconColor()}
						border="1px solid"
						borderColor={colors.borderColor}
					>
						<Icon as={IconComponent} boxSize={5} />
					</Box>
				)}
			</Flex>

			<Skeleton
				isLoaded={!isLoading}
				minH='36px'
				display='flex'
				alignItems='center'
				startColor={colors.bgInput}
				endColor={colors.bgInputHover}
			>
				<Text
					fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
					fontWeight='semibold'
					color={colors.headingText}
					lineHeight='1.2'
				>
					{prefix}
					{formattedValue}
					{suffix}
				</Text>
			</Skeleton>

			{trend !== undefined && (
				<Flex align='center' mt={3}>
					<Badge
						bg={trend > 0 ? `${colors.accentGold}15` : trend < 0 ? colors.badgeErrorBg : colors.bgInput}
						color={trend > 0 ? colors.accentGold : trend < 0 ? colors.badgeErrorText : colors.mutedText}
						display='flex'
						alignItems='center'
						px={2}
						py={0.5}
						borderRadius='full'
						fontSize='xs'
					>
						<Icon as={trendIcon} boxSize={3} mr={1} />
						{Math.abs(trend)}%
					</Badge>
					<Text ml={2} fontSize='xs' color={colors.mutedText}>
						vs last period
					</Text>
				</Flex>
			)}
		</Box>
	);
};