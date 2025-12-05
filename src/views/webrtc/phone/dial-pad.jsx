// import { Box, Button, HStack, VStack } from '@chakra-ui/react';
// import DialPadAudioElements from './DialPadSoundElement';
// import { useEffect, useRef } from 'react';

// const keySounds = new DialPadAudioElements();

// export const DialPad = ({ handleDigitPress }) => {
// 	const selfRef = useRef(null);
// 	const isVisibleRef = useRef(false);
// 	const buttons = [
// 		['1', '2', '3'],
// 		['4', '5', '6'],
// 		['7', '8', '9'],
// 		['*', '0', '#'],
// 	];

// 	const handleKeyDown = (e) => {
// 		if (
// 			['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '#'].includes(
// 				e.key
// 			)
// 		) {
// 			if (isVisibleRef.current) {
// 				keySounds?.playKeyTone(e.key);
// 				handleDigitPress(e.key, true);
// 			}
// 		}
// 	};

// 	useEffect(() => {
// 		const observer = new IntersectionObserver(
// 			([entry]) => {
// 				isVisibleRef.current = entry.isIntersecting;
// 			},
// 			{
// 				threshold: 0.5,
// 			}
// 		);
// 		if (selfRef.current) {
// 			observer.observe(selfRef.current);
// 		}
// 		document.addEventListener('keydown', handleKeyDown);
// 		return () => {
// 			document.removeEventListener('keydown', handleKeyDown);
// 			if (selfRef.current) {
// 				observer.unobserve(selfRef.current);
// 			}
// 		};
// 	}, []);

// 	return (
// 		<Box p={2} w='full' h='280px' ref={selfRef}>
// 			<VStack w='full' h='full' bg='grey.500' spacing={0.5}>
// 				{buttons.map((row, rowIndex) => (
// 					<HStack
// 						key={rowIndex}
// 						justifyContent='space-between'
// 						spacing={0.5}
// 						w='full'
// 						h='full'
// 					>
// 						{row.map((num) => (
// 							<Button
// 								key={num}
// 								onClick={() => {
// 									keySounds?.playKeyTone(num);
// 									handleDigitPress(num, false);
// 								}}
// 								size='lg'
// 								p={0}
// 								width='calc(100% / 3)'
// 								height='100%'
// 								variant='unstyled'
// 								bg='white'
// 								_hover={{
// 									bg: 'gray.100',
// 								}}
// 								borderRadius={0}
// 							>
// 								{num}
// 							</Button>
// 						))}
// 					</HStack>
// 				))}
// 			</VStack>
// 		</Box>
// 	);
// };

// export default DialPad;

import { Box, Button, VStack, HStack } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import DialPadAudioElements from './DialPadSoundElement';

const keySounds = new DialPadAudioElements();

export const DialPad = ({ handleDigitPress }) => {
	const selfRef = useRef(null);
	const isVisibleRef = useRef(false);

	const buttons = [
		['1', '2', '3'],
		['4', '5', '6'],
		['7', '8', '9'],
		['*', '0', '#'],
	];

	const handleKeyDown = (e) => {
		const valid = '0123456789*#';
		if (!valid.includes(e.key)) return;

		if (isVisibleRef.current) {
			keySounds.playKeyTone(e.key);
			handleDigitPress(e.key, true);
		}
	};

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => (isVisibleRef.current = entry.isIntersecting),
			{ threshold: 0.3 }
		);

		if (selfRef.current) observer.observe(selfRef.current);

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			if (selfRef.current) observer.unobserve(selfRef.current);
		};
	}, []);

	return (
		<Box ref={selfRef} p={1} w='100%'>
			<VStack spacing={2}>
				{buttons.map((row, i) => (
					<HStack key={i} spacing={2} w='100%'>
						{row.map((num) => (
							<Button
								key={num}
								onClick={() => {
									keySounds.playKeyTone(num);
									handleDigitPress(num, false);
								}}
								flex={1}
								height='58px'
								bg='gray.100'
								fontSize='xl'
								fontWeight='bold'
								rounded='md'
								shadow='sm'
								_hover={{
									bg: 'gray.200',
									shadow: 'md',
									transform: 'scale(1.04)',
								}}
								_active={{
									bg: 'gray.300',
									transform: 'scale(0.97)',
								}}
								_focus={{
									outline: '2px solid #3182ce',
									outlineOffset: '2px',
								}}
								transition='0.12s ease'
							>
								{num}
							</Button>
						))}
					</HStack>
				))}
			</VStack>
		</Box>
	);
};

export default DialPad;
