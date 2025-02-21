import React from 'react';
import {
	Box,
	Text,
	IconButton,
	Tooltip,
	useClipboard,
	useColorModeValue,
	HStack,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';

const EntityField = ({
	label,
	value,
	isCopy = false,
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
			// p='1'
			display='flex'
			width='fit-content'
			flexDir='column'
			{...boxProps}
		>
			{/* Label + Copy Icon*/}
			<HStack alignItems='center' justifyContent='space-between' flex='1' m={0}>
				{label && (
					<Text fontSize='6px' mb='0' color={labelColor} {...labelProps}>
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
							size='20px'
							fontSize='6px'
							variant='ghost'
							onClick={onCopy}
							aria-label='Copy text'
							{...iconProps}
						/>
					</Tooltip>
				)}
			</HStack>

			{/* Value */}
			<Text
				fontSize='8px'
				fontWeight='normal'
				color={valueColor}
				{...valueProps}
			>
				{value}
			</Text>
		</Box>
	);
};
export default EntityField;
