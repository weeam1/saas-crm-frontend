import React from 'react';
import { Box, CircularProgress, Image } from '@chakra-ui/react';
import MediaIcon from './MediaIcon';

const MediaLoadingPlaceholder = ({ type }) => {
	// Dummy image placeholder for image/video types
	if (['image', 'video'].includes(type)) {
		return (
			<Box
				width='300px'
				height='200px'
				bg='gray.100'
				borderRadius='md'
				position='relative'
				overflow='hidden'
			>
				<Box
					position='absolute'
					inset='0'
					background='linear-gradient(45deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)'
					backgroundSize='200% 200%'
					animation='shimmer 1.5s infinite linear'
				/>
			</Box>
		);
	}

	// Audio player placeholder
	if (type === 'audio') {
		return (
			<Box
				width='350px'
				height='60px'
				bg='gray.50'
				borderRadius='md'
				p={3}
				position='relative'
				overflow='hidden'
			>
				<Box
					position='absolute'
					inset='0'
					background='linear-gradient(45deg, #f5f5f5 25%, #e5e5e5 50%, #f5f5f5 75%)'
					backgroundSize='200% 200%'
					animation='shimmer 1.5s infinite linear'
				/>
			</Box>
		);
	}

	// Document placeholder
	return (
		<Box
			width='200px'
			height='250px'
			bg='gray.50'
			borderRadius='md'
			p={4}
			position='relative'
			overflow='hidden'
		>
			<Box
				position='absolute'
				inset='0'
				background='linear-gradient(45deg, #f5f5f5 25%, #e5e5e5 50%, #f5f5f5 75%)'
				backgroundSize='200% 200%'
				animation='shimmer 1.5s infinite linear'
			/>
			<Box
				position='relative'
				zIndex='1'
				height='100%'
				display='flex'
				flexDirection='column'
				alignItems='center'
				justifyContent='center'
			>
				<Box
					width='60px'
					height='80px'
					bg='gray.200'
					borderRadius='md'
					mb={4}
				/>
				<Box
					width='120px'
					height='12px'
					bg='gray.200'
					mb={2}
					borderRadius='full'
				/>
				<Box width='80px' height='10px' bg='gray.200' borderRadius='full' />
			</Box>
		</Box>
	);
};

const ProgressWithIcon = ({ type, progress }) => {
	return (
		<Box position='relative' display='inline-flex'>
			<CircularProgress
				isIndeterminate={!progress}
				value={progress}
				color='gray.200'
				size='50px'
				thickness='4px'
			/>
			<Box
				position='absolute'
				top='50%'
				left='50%'
				transform='translate(-50%, -50%)'
			>
				{/* <MediaIcon type={type} size={32} /> */}
			</Box>
		</Box>
	);
};

const MediaLoadingEffect = ({ type, progress }) => {
	return (
		<Box position='relative'>
			{/* Show the placeholder */}
			<MediaLoadingPlaceholder type={type} />

			{/* Overlay with progress */}
			<Box
				position='absolute'
				top='0'
				left='0'
				right='0'
				bottom='0'
				bg='rgba(0, 0, 0, 0.4)'
				display='flex'
				alignItems='center'
				justifyContent='center'
				borderRadius={type === 'image' || type === 'video' ? 'md' : 'none'}
			>
				<ProgressWithIcon type={type} progress={progress} />
			</Box>
		</Box>
	);
};

export default MediaLoadingEffect;
