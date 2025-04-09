import React from 'react';
import {
	Input,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	PopoverArrow,
	Button,
	Box,
	Flex,
} from '@chakra-ui/react';
import ClockDisplay from './ClockDisplay';

const TimeInput = ({
	value,
	onChange,
	placeholder,
	bgColor,
	isHour,
	clockItems,
	selectedValue,
	onSelect,
	onConfirm,
	onCancel,
	isOpen,
	onOpen,
	onClose,
}) => {
	const angleStep = isHour ? 360 / 12 : 360 / 60;
	const radiusConfig = { base: 40, md: 50 };
	const centerConfig = { base: 50, md: 60 };
	const sizeConfig = { base: '100px', md: '120px' };

	return (
		// <Popover
		// 	isOpen={isOpen}
		// 	onOpen={onOpen}
		// 	onClose={onClose}
		// 	placement='bottom-start'
		// >
		// 	<PopoverTrigger>
		// 		<Input
		// 			value={value === '' ? '' : value.toString().padStart(2, '0')}
		// 			onChange={onChange}
		// 			maxLength={2}
		// 			size='xs'
		// 			width='40px'
		// 			height='28px'
		// 			textAlign='center'
		// 			bg={bgColor}
		// 			border='none'
		// 			borderRadius='6px'
		// 			fontSize='md'
		// 			fontWeight='bold'
		// 			color='black'
		// 			_focus={{ boxShadow: '0 0 0 2px #B57EDC' }}
		// 			_hover={{ bg: isHour ? '#B57EDC' : '#D3CDE6' }}
		// 			padding='0 2px'
		// 			placeholder={placeholder}
		// 		/>
		// 	</PopoverTrigger>
		// 	<PopoverContent
		// 		width={{ base: '140px', md: '160px' }}
		// 		borderRadius='8px'
		// 		boxShadow='md'
		// 		p={2}
		// 		bg='#ECE6EE'
		// 	>
		// 		<PopoverArrow bg='#B57EDC' />
		// 		<PopoverBody>
		// 			<Box
		// 				position='relative'
		// 				width={sizeConfig}
		// 				height={sizeConfig}
		// 				mx='auto'
		// 				mb={2}
		// 			>
		// 				<ClockDisplay
		// 					items={clockItems}
		// 					selectedValue={selectedValue}
		// 					onSelect={onSelect}
		// 					angleStep={angleStep}
		// 					radiusConfig={radiusConfig}
		// 					centerConfig={centerConfig}
		// 					showLabelsEvery={isHour ? null : 5}
		// 					sizeConfig={sizeConfig}
		// 				/>
		// 				{!isHour && (
		// 					<Box
		// 						position='absolute'
		// 						left='50%'
		// 						top='50%'
		// 						transform={`translate(-50%, -100%) rotate(${(selectedValue % 60) * 6}deg)`}
		// 						transformOrigin='bottom'
		// 						width='1.5px'
		// 						height={{ base: '35px', md: '40px' }}
		// 						bg='#675496'
		// 						borderRadius='1px'
		// 					/>
		// 				)}
		// 			</Box>
		// 			<Flex justify='flex-end' gap={1} mt={2}>
		// 				<Button
		// 					onClick={onCancel}
		// 					bg='#ECE6EE'
		// 					borderRadius='6px'
		// 					fontSize='xs'
		// 					textColor='#7766a1'
		// 					fontWeight='medium'
		// 					size='xs'
		// 					px={2}
		// 				>
		// 					Cancel
		// 				</Button>
		// 				<Button
		// 					onClick={onConfirm}
		// 					bg='#675496'
		// 					color='white'
		// 					borderRadius='6px'
		// 					fontSize='xs'
		// 					fontWeight='medium'
		// 					size='xs'
		// 					px={2}
		// 					_hover={{ bg: '#B57EDC' }}
		// 				>
		// 					OK
		// 				</Button>
		// 			</Flex>
		// 		</PopoverBody>
		// 	</PopoverContent>
		// </Popover>
		<Popover
			isOpen={isOpen}
			onOpen={onOpen}
			onClose={onClose}
			placement='bottom-start'
		>
			<PopoverTrigger>
				<Input
					value={value === '' ? '' : value.toString().padStart(2, '0')}
					onChange={onChange}
					maxLength={2}
					size='xs'
					width='40px'
					height='28px'
					textAlign='center'
					bg={bgColor}
					border='none'
					borderRadius='6px'
					fontSize='md'
					fontWeight='bold'
					color='black'
					_focus={{ boxShadow: '0 0 0 2px brand.500' }}
					_hover={{ bg: isHour ? 'brand.500' : 'brand.500' }}
					padding='0 2px'
					placeholder={placeholder}
				/>
			</PopoverTrigger>
			<PopoverContent
				width={{ base: '140px', md: '160px' }}
				borderRadius='8px'
				boxShadow='md'
				p={2}
				bg='softGray.100'
			>
				<PopoverArrow bg='softGray.100' />
				<PopoverBody>
					<Box
						position='relative'
						width={sizeConfig}
						height={sizeConfig}
						mx='auto'
						mb={2}
					>
						<ClockDisplay
							items={clockItems}
							selectedValue={selectedValue}
							onSelect={onSelect}
							angleStep={angleStep}
							radiusConfig={radiusConfig}
							centerConfig={centerConfig}
							showLabelsEvery={isHour ? null : 5}
							sizeConfig={sizeConfig}
						/>
						{!isHour && (
							<Box
								position='absolute'
								left='50%'
								top='50%'
								transform={`translate(-50%, -100%) rotate(${(selectedValue % 60) * 6}deg)`}
								transformOrigin='bottom'
								width='1.5px'
								height={{ base: '35px', md: '40px' }}
								bg='brand.500'
								borderRadius='1px'
							/>
						)}
					</Box>
					<Flex justify='flex-end' gap={1} mt={2}>
						<Button
							onClick={onCancel}
							bg='brand.500'
							borderRadius='6px'
							fontSize='xs'
							textColor='white'
							fontWeight='medium'
							size='xs'
							px={2}
						>
							Cancel
						</Button>
						<Button
							onClick={onConfirm}
							bg='brand.500'
							color='white'
							borderRadius='6px'
							fontSize='xs'
							fontWeight='medium'
							size='xs'
							px={2}
							_hover={{ bg: 'brand.500' }}
						>
							OK
						</Button>
					</Flex>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};

export default TimeInput;
