/**
 * StateViews
 * ----------
 * Reusable Loading / Empty / Error primitives used by every data section so
 * each chart, KPI grid and table renders consistent states.
 */

import { Box, Button, Flex, Icon, Skeleton, Spinner, Text } from '@chakra-ui/react';
import { FiAlertTriangle, FiInbox, FiRefreshCw } from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';

/** Centered spinner for in-card loading. */
export const LoadingState = ({ minH = '220px', label = 'Loading…' }) => {
	const colors = useModalColors();
	return (
		<Flex
			minH={minH}
			align='center'
			justify='center'
			direction='column'
			gap={3}
			role='status'
			aria-live='polite'
			aria-busy='true'
		>
			<Spinner
				thickness='3px'
				speed='0.65s'
				color={colors.accentGold}
				emptyColor={colors.bgInput}
				size='lg'
			/>
			<Text fontSize='sm' color={colors.mutedText}>
				{label}
			</Text>
		</Flex>
	);
};

/** Skeleton grid for KPI tiles / blocks. */
export const SkeletonGrid = ({ count = 4, height = '110px' }) => {
	const colors = useModalColors();
	return (
		<>
			{Array.from({ length: count }).map((_, i) => (
				<Skeleton
					key={i}
					height={height}
					borderRadius='lg'
					startColor={colors.bgInput}
					endColor={colors.bgInputHover}
				/>
			))}
		</>
	);
};

/** Empty state for sections with no data. */
export const EmptyState = ({
	minH = '220px',
	title = 'No data available',
	description = 'Try adjusting your filters or date range.',
}) => {
	const colors = useModalColors();
	return (
		<Flex
			minH={minH}
			align='center'
			justify='center'
			direction='column'
			gap={2}
			textAlign='center'
			px={4}
		>
			<Icon as={FiInbox} boxSize={8} color={colors.mutedText} aria-hidden />
			<Text fontWeight='semibold' color={colors.headingText}>
				{title}
			</Text>
			<Text fontSize='sm' color={colors.mutedText} maxW='320px'>
				{description}
			</Text>
		</Flex>
	);
};

/** Error state with optional retry. */
export const ErrorState = ({
	minH = '220px',
	title = 'Something went wrong',
	description = 'We could not load this report. Please try again.',
	onRetry,
}) => {
	const colors = useModalColors();
	return (
		<Flex
			minH={minH}
			align='center'
			justify='center'
			direction='column'
			gap={3}
			textAlign='center'
			px={4}
			role='alert'
		>
			<Icon
				as={FiAlertTriangle}
				boxSize={8}
				color={colors.badgeErrorText}
				aria-hidden
			/>
			<Box>
				<Text fontWeight='semibold' color={colors.headingText}>
					{title}
				</Text>
				<Text fontSize='sm' color={colors.mutedText} maxW='320px'>
					{description}
				</Text>
			</Box>
			{onRetry && (
				<Button
					size='sm'
					leftIcon={<FiRefreshCw />}
					onClick={onRetry}
					bg={colors.bgInput}
					color={colors.headingText}
					borderWidth='1px'
					borderColor={colors.borderColor}
					_hover={{ bg: colors.bgInputHover, borderColor: colors.accentGold }}
				>
					Retry
				</Button>
			)}
		</Flex>
	);
};
