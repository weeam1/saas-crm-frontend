/**
 * ChartCard
 * ---------
 * Titled container for a chart (or any data block) that centralizes the
 * loading / empty / error state machine so individual charts stay declarative.
 *
 * Pass the query flags (isLoading, isError) and an `isEmpty` predicate result;
 * children render only when there is data.
 */

import { Box, Flex, Text } from '@chakra-ui/react';
import { useModalColors } from 'hooks/useModalColors';
import { EmptyState, ErrorState, LoadingState } from './StateViews';

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} [props.actions]   Right-aligned header controls
 * @param {boolean} [props.isLoading]
 * @param {boolean} [props.isError]
 * @param {boolean} [props.isEmpty]
 * @param {() => void} [props.onRetry]
 * @param {string|number} [props.minH]        Body min height (keeps layout stable)
 * @param {React.ReactNode} props.children
 */
export const ChartCard = ({
	title,
	subtitle,
	actions,
	isLoading = false,
	isError = false,
	isEmpty = false,
	onRetry,
	minH = '300px',
	children,
}) => {
	const colors = useModalColors();

	const renderBody = () => {
		if (isError) return <ErrorState minH={minH} onRetry={onRetry} />;
		if (isLoading) return <LoadingState minH={minH} />;
		if (isEmpty) return <EmptyState minH={minH} />;
		return children;
	};

	return (
		<Box
			bg={colors.bg}
			rounded='lg'
			shadow={colors.cardShadow}
			borderWidth='1px'
			borderColor={colors.borderColor}
			p={{ base: 4, md: 5 }}
			h='100%'
			display='flex'
			flexDirection='column'
		>
			<Flex
				justify='space-between'
				align={{ base: 'flex-start', sm: 'center' }}
				direction={{ base: 'column', sm: 'row' }}
				gap={2}
				mb={4}
			>
				<Box>
					<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='semibold' color={colors.headingText}>
						{title}
					</Text>
					{subtitle && (
						<Text fontSize='sm' color={colors.mutedText} mt={0.5}>
							{subtitle}
						</Text>
					)}
				</Box>
				{actions && <Box>{actions}</Box>}
			</Flex>

			<Box flex='1' minH={minH}>
				{renderBody()}
			</Box>
		</Box>
	);
};

export default ChartCard;
