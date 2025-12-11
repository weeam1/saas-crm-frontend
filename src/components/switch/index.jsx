import { Box, Text } from '@chakra-ui/react';

function JambonzSwitch({
	onlabel,
	offLabel,
	checked: [isToggled, setToggled],
	isDisabled = false,
	onChange,
	size,
}) {
	return (
		<Box
			position='relative'
			w='40px'
			h='20px'
			bg={isToggled ? 'green.400' : 'grey.400'}
			borderRadius='full'
			onClick={() => {
				if (!isDisabled) {
					const value = !isToggled;
					setToggled(value);
					onChange(value);
				}
			}}
			_hover={{ cursor: 'pointer' }}
		>
			{onlabel && offLabel && (
				<Text
					position='absolute'
					top='50%'
					left={isToggled ? '40%' : '60%'}
					transform='translate(-50%, -50%)'
					color={isToggled ? 'white' : 'black'}
					fontWeight='bold'
				>
					{isToggled ? onlabel : offLabel}
				</Text>
			)}
			<Box
				position='absolute'
				top='50%'
				left={isToggled ? '50%' : '5%'}
				w='20px'
				h='20px'
				bg='white'
				borderRadius='full'
				transform='translateY(-50%)'
				transition='0.2s ease'
				style={{ boxShadow: '0 3px 4px rgba(0,0,0,0.5)' }}
			></Box>
		</Box>
	);
}

export default JambonzSwitch;
