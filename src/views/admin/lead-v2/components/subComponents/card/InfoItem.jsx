import { Flex, Text, Icon } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { leadIconSize, leadlabelFontSize } from '../../constants';
import CustomTooltip from 'components/shared/CustomTooltip';
import { safeValue } from 'utils';

const InfoItem = ({
	label,
	value,
	labelProps = {},
	tooltipProps = {},
	iconProps = {},
	...rest
}) => {
	let displayText = safeValue(value) || 'N/A';

	try {
		const url = new URL(value);
		displayText = `${url.hostname}${url.pathname}`;
	} catch (e) {
		// not a valid URL, leave displayText as-is
	}

	return (
		<Flex alignItems='center' justifyContent='space-between' {...rest}>
			{/* Label */}
			<Text
				fontWeight='medium'
				fontSize={leadlabelFontSize}
				color='text.muted'
				mr={2}
				{...labelProps}
			>
				{label}
			</Text>

			{/* Info Icon with Tooltip */}
			<CustomTooltip label={displayText} persistent={true}>
				<Icon
					as={InfoIcon}
					boxSize={leadIconSize}
					color='text.accent'
					cursor='pointer'
					_hover={{ color: 'accent.goldLight' }}
					{...iconProps}
				/>
			</CustomTooltip>
		</Flex>
	);
};

export default InfoItem;