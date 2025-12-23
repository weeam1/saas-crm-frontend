import { Box, Grid, HStack, Icon, Text, Tooltip } from '@chakra-ui/react';
import CustomTooltip from 'components/shared/CustomTooltip';
import { FaInfoCircle, FaPhone } from 'react-icons/fa';

const InfoItem = ({
	icon,
	label,
	value,
	color = 'gray.400',
	maxW = '120px',
	labelFontSize = '10px',
	valueFontSize = '12px',
	valueCase = undefined,
	...props
}) => {
	const isLong = value && value.length > 16;

	return (
		<HStack align='center' spacing={3} {...props}>
			<Icon
				as={icon}
				color={color}
				boxSize={3}
				transform={icon === FaPhone ? 'scaleX(-1)' : undefined}
			/>

			<Box minW={0}>
				{/* Label row */}
				{label && (
					<Box position='relative' display='inline-flex' alignItems='center'>
						<Text fontSize={labelFontSize} color='gray.500' lineHeight='1'>
							{label}
						</Text>

						{isLong && (
							<Tooltip label={value} hasArrow placement='top'>
								<Box
									position='absolute'
									right='-18px'
									top='50%'
									transform='translateY(-50%)'
									w='14px'
									h='14px'
									display='flex'
									alignItems='center'
									justifyContent='center'
									cursor='pointer'
									pointerEvents='auto'
								>
									<Icon as={FaInfoCircle} boxSize={3} color='gray.400' />
								</Box>
							</Tooltip>
						)}
					</Box>
				)}

				<Text
					fontSize={valueFontSize}
					fontWeight='500'
					// color='gray.700'
					color={color}
					isTruncated
					maxW={maxW}
					textTransform={label === 'Email' ? 'lowercase' : 'capitalize'}
				>
					{value || '-'}
				</Text>
			</Box>
		</HStack>
	);
};

export default InfoItem;
