import { Flex, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { leadIconSize, leadlabelFontSize } from '../../constants';
import CustomTooltip from '../CustomTooltip';

const InfoItem = ({
	label,
	value,
	labelProps = {},
	tooltipProps = {},
	iconProps = {},
	...rest
}) => {
	// Optional color mode styling
	const labelColor = useColorModeValue('gray.800', 'gray.300');
	const iconBg = useColorModeValue('blue.100', 'blue.700');

	return (
		<Flex alignItems='center' justifyContent='space-between' {...rest}>
			{/* Label */}
			<Text
				fontWeight='medium'
				fontSize={leadlabelFontSize}
				color={labelColor}
				mr={2}
				{...labelProps}
			>
				{label}
			</Text>

			{/* Info Icon with Tooltip */}
			<CustomTooltip label={value || 'N/A'}>
				<Icon
					as={InfoIcon}
					boxSize={leadIconSize}
					color='blue.300'
					cursor='pointer'
					{...iconProps}
				/>
			</CustomTooltip>
		</Flex>
	);
};

export default InfoItem;
