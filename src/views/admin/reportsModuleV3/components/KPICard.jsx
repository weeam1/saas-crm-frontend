/**
 * KPICard
 * -------
 * Reusable KPI / summary tile. Handles its own loading skeleton and supports
 * number / percent / currency formatting plus an optional trend badge.
 */

import { Badge, Box, Flex, Icon, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import { FiArrowDownRight, FiArrowUpRight, FiHelpCircle, FiMinus } from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';
import { formatCurrency, formatFull, formatPercent } from '../helpers';

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {number|string} props.value
 * @param {React.ElementType} [props.icon]
 * @param {'number'|'percent'|'currency'} [props.format]
 * @param {number} [props.trend]            Optional +/- percentage badge
 * @param {boolean} [props.isLoading]
 * @param {string} [props.tooltip]
 * @param {string} [props.helpText]         Small caption under the value
 */
export const KPICard = ({
	title,
	value,
	icon: IconComponent,
	format = 'number',
	trend,
	isLoading = false,
	tooltip,
	helpText,
}) => {
	const colors = useModalColors();

	const formatted =
		format === 'percent'
			? formatPercent(value)
			: format === 'currency'
				? formatCurrency(value)
				: formatFull(value);

	const trendColor =
		trend > 0
			? colors.badgeSuccessText
			: trend < 0
				? colors.badgeErrorText
				: colors.mutedText;
	const TrendIcon =
		trend > 0 ? FiArrowUpRight : trend < 0 ? FiArrowDownRight : FiMinus;

	return (
		<Box
			bg={colors.bgInput}
			p={5}
			rounded='lg'
			shadow={colors.cardShadow}
			borderWidth='1px'
			borderColor={colors.borderColor}
			transition='all 0.2s ease'
			_hover={{
				borderColor: colors.accentGold,
				transform: 'translateY(-2px)',
				boxShadow: colors.modalShadow,
			}}
			role='group'
		>
			<Flex justify='space-between' align='center' mb={3}>
				<Flex align='center' gap={1}>
					<Text fontSize='sm' fontWeight='medium' color={colors.mutedText}>
						{title}
					</Text>
					{tooltip && (
						<Tooltip label={tooltip} hasArrow>
							<Box as='span' display='inline-flex' aria-label={tooltip}>
								<Icon as={FiHelpCircle} boxSize={4} color={colors.mutedText} />
							</Box>
						</Tooltip>
					)}
				</Flex>
				{IconComponent && (
					<Flex
						bg={colors.bg}
						rounded='full'
						p={3}
						align='center'
						justify='center'
						color={colors.accentGold}
						borderWidth='1px'
						borderColor={colors.borderColor}
						aria-hidden
					>
						<Icon as={IconComponent} boxSize={5} />
					</Flex>
				)}
			</Flex>

			<Skeleton
				isLoaded={!isLoading}
				minH='34px'
				display='flex'
				alignItems='center'
				startColor={colors.bgInput}
				endColor={colors.bgInputHover}
			>
				<Text
					fontSize={{ base: 'xl', md: '2xl' }}
					fontWeight='bold'
					color={colors.headingText}
					lineHeight='1.2'
				>
					{formatted}
				</Text>
			</Skeleton>

			{(trend !== undefined || helpText) && !isLoading && (
				<Flex align='center' mt={3} gap={2} wrap='wrap'>
					{trend !== undefined && (
						<Badge
							display='flex'
							alignItems='center'
							px={2}
							py={0.5}
							borderRadius='full'
							fontSize='xs'
							bg={colors.bg}
							color={trendColor}
						>
							<Icon as={TrendIcon} boxSize={3} mr={1} aria-hidden />
							{Math.abs(Number(trend || 0)).toFixed(1)}%
						</Badge>
					)}
					{helpText && (
						<Text fontSize='xs' color={colors.mutedText}>
							{helpText}
						</Text>
					)}
				</Flex>
			)}
		</Box>
	);
};

export default KPICard;
