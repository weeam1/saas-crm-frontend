import React from 'react';
import {
	Box,
	Text,
	IconButton,
	Tooltip,
	useClipboard,
	useColorModeValue,
	HStack,
	Icon,
} from '@chakra-ui/react';
import { CopyIcon, InfoIcon } from '@chakra-ui/icons';
import {
	leadIconSize,
	leadlabelFontSize,
	leadValueFontSize,
} from '../../constants';

const EntityField = ({
	label,
	value,
	isCopy = false,
	isInfo = false,
	labelProps = {},
	valueProps = {},
	iconProps = {},
	...boxProps
}) => {
	const { hasCopied, onCopy } = useClipboard(value || '');

	const labelColor = useColorModeValue('softGray.200', 'gray.300');
	const valueColor = useColorModeValue('green.600', 'green.300');

	return (
		<Box
			display='flex'
			width='fit-content'
			maxWidth={isInfo ? '100px' : '200px'}
			flexDir='column'
			justifyContent='flex-start'
			justifySelf='stretch'
			{...boxProps}
		>
			{/* Label + Copy Icon*/}
			<HStack alignItems='center' justifyContent='space-between' flex='1' m={0}>
				{label && (
					<Text
						fontSize={leadlabelFontSize}
						mb='0'
						color={labelColor}
						{...labelProps}
					>
						{label}
					</Text>
				)}

				{isCopy && value && (
					<Tooltip
						label={hasCopied ? 'Copied!' : 'Copy'}
						closeOnClick={false}
						hasArrow
					>
						<IconButton
							icon={<CopyIcon />}
							size='xs'
							fontSize={leadIconSize}
							variant='ghost'
							onClick={onCopy}
							aria-label='Copy text'
							{...iconProps}
						/>
					</Tooltip>
				)}
				{isInfo && value && (
					<Tooltip label={value || 'N/A'} hasArrow>
						<Icon
							as={InfoIcon}
							boxSize={leadIconSize}
							color='blue.300'
							cursor='pointer'
						/>
					</Tooltip>
				)}
			</HStack>

			{/* Value */}
			<Text
				fontSize={leadValueFontSize}
				fontWeight='medium'
				color={valueColor}
				textTransform='capitalize'
				isTruncated={isInfo || isCopy}
				{...valueProps}
			>
				{value || 'N/A'}
			</Text>
		</Box>
	);
};
export default EntityField;
