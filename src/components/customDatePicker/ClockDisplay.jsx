import React from 'react';
import { Circle, Text } from '@chakra-ui/react';

// const ClockDisplay = ({
//   items,
//   selectedValue,
//   onSelect,
//   angleStep,
//   radiusConfig,
//   centerConfig,
//   showLabelsEvery,
//   sizeConfig,
// }) => {
//   return (
//     <Circle
//       size={sizeConfig}
//       bg="#E6E0E9"
//       borderRadius="50%"
//       position="relative"
//     >
//       {items.map((item) => {
//         const shouldShowLabel = showLabelsEvery ? item % showLabelsEvery === 0 : true;
//         const angle = (showLabelsEvery ? (item * angleStep - 90) : (item - 3) * angleStep) * (Math.PI / 180);
//         const xBase = centerConfig.base + radiusConfig.base * Math.cos(angle) - (shouldShowLabel ? 8 : 4);
//         const yBase = centerConfig.base + radiusConfig.base * Math.sin(angle) - (shouldShowLabel ? 8 : 4);
//         const xMd = centerConfig.md + radiusConfig.md * Math.cos(angle) - (shouldShowLabel ? 8 : 4);
//         const yMd = centerConfig.md + radiusConfig.md * Math.sin(angle) - (shouldShowLabel ? 8 : 4);

//         return (
//           <Circle
//             key={item}
//             position="absolute"
//             left={{ base: `${xBase}px`, md: `${xMd}px` }}
//             top={{ base: `${yBase}px`, md: `${yMd}px` }}
//             size={shouldShowLabel ? "20px" : "8px"}
//             bg={item === selectedValue ? "#675496" : "transparent"}
//             color={item === selectedValue ? "white" : "#6B7280"}
//             onClick={() => onSelect(item)}
//             cursor="pointer"
//             _hover={{ bg: "#675496" }}
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//           >
//             {shouldShowLabel && (
//               <Text fontSize={{ base: "2xs", md: "xs" }} fontWeight="bold">
//                 {item}
//               </Text>
//             )}
//           </Circle>
//         );
//       })}
//       <Circle
//         position="absolute"
//         left="50%"
//         top="50%"
//         transform="translate(-50%, -50%)"
//         size="6px"
//         bg="#675496"
//       />
//     </Circle>
//   );
// };
const ClockDisplay = ({
	items,
	selectedValue,
	onSelect,
	angleStep,
	radiusConfig,
	centerConfig,
	showLabelsEvery,
	sizeConfig,
}) => {
	return (
		<Circle
			size={sizeConfig}
			bg='gray.200'
			borderRadius='50%'
			position='relative'
		>
			{items.map((item) => {
				const shouldShowLabel = showLabelsEvery
					? item % showLabelsEvery === 0
					: true;
				const angle =
					(showLabelsEvery ? item * angleStep - 90 : (item - 3) * angleStep) *
					(Math.PI / 180);
				const xBase =
					centerConfig.base +
					radiusConfig.base * Math.cos(angle) -
					(shouldShowLabel ? 8 : 4);
				const yBase =
					centerConfig.base +
					radiusConfig.base * Math.sin(angle) -
					(shouldShowLabel ? 8 : 4);
				const xMd =
					centerConfig.md +
					radiusConfig.md * Math.cos(angle) -
					(shouldShowLabel ? 8 : 4);
				const yMd =
					centerConfig.md +
					radiusConfig.md * Math.sin(angle) -
					(shouldShowLabel ? 8 : 4);

				return (
					<Circle
						key={item}
						position='absolute'
						left={{ base: `${xBase}px`, md: `${xMd}px` }}
						top={{ base: `${yBase}px`, md: `${yMd}px` }}
						size={shouldShowLabel ? '20px' : '8px'}
						bg={item === selectedValue ? 'gray.600' : 'transparent'}
						color={item === selectedValue ? 'white' : 'gray.500'}
						onClick={() => onSelect(item)}
						cursor='pointer'
						_hover={{ bg: 'gray.400' }}
						display='flex'
						alignItems='center'
						justifyContent='center'
					>
						{shouldShowLabel && (
							<Text fontSize={{ base: '2xs', md: 'xs' }} fontWeight='bold'>
								{item}
							</Text>
						)}
					</Circle>
				);
			})}
			<Circle
				position='absolute'
				left='50%'
				top='50%'
				transform='translate(-50%, -50%)'
				size='6px'
				bg='gray.600'
			/>
		</Circle>
	);
};

export default ClockDisplay;
