import React, { useRef } from 'react';
import { Box, Avatar, IconButton, Text, Flex, Tooltip } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaCamera, FaTrash } from 'react-icons/fa';
import { HiUser } from 'react-icons/hi';

const MotionBox = motion(Box);

const AvatarUpload = ({ image, onUpload, onRemove, name = '' }) => {
	const fileInputRef = useRef(null);

	const handleFileSelect = (event) => {
		const file = event.target.files[0];
		if (file) {
			onUpload(file);
		}
	};

	const handleClick = () => {
		fileInputRef.current.click();
	};

	return (
		<Box textAlign='center'>
			<Box position='relative' display='inline-block'>
				<Avatar
					size='2xl'
					src={image}
					name={name}
					icon={<HiUser size='40' />}
					border='4px solid white'
					boxShadow='lg'
					bg='gray.100'
				/>

				{/* Upload Overlay */}
				<MotionBox
					position='absolute'
					top={0}
					left={0}
					right={0}
					bottom={0}
					borderRadius='full'
					bg='rgba(0,0,0,0.5)'
					display='flex'
					alignItems='center'
					justifyContent='center'
					gap={2}
					opacity={0}
					whileHover={{ opacity: 1 }}
					transition={{ duration: 0.2 }}
					cursor='pointer'
					onClick={handleClick}
				>
					{image ? (
						<Tooltip label='Change photo' placement='top'>
							<IconButton
								aria-label='Change photo'
								icon={<FaCamera />}
								size='sm'
								colorScheme='teal'
								variant='ghost'
								color='white'
							/>
						</Tooltip>
					) : (
						<Tooltip label='Upload photo' placement='top'>
							<IconButton
								aria-label='Upload photo'
								icon={<FaCamera />}
								size='sm'
								colorScheme='teal'
								variant='ghost'
								color='white'
							/>
						</Tooltip>
					)}

					{image && (
						<Tooltip label='Remove photo' placement='top'>
							<IconButton
								aria-label='Remove photo'
								icon={<FaTrash />}
								size='sm'
								colorScheme='red'
								variant='ghost'
								color='white'
								onClick={(e) => {
									e.stopPropagation();
									onRemove();
								}}
							/>
						</Tooltip>
					)}
				</MotionBox>
			</Box>

			<input
				type='file'
				ref={fileInputRef}
				style={{ display: 'none' }}
				accept='image/*'
				onChange={handleFileSelect}
			/>

			<Text fontSize='sm' color='gray.500' mt={2}>
				Click to {image ? 'change' : 'upload'} profile photo
			</Text>
			<Text fontSize='xs' color='gray.400' mt={1}>
				JPG, PNG up to 2MB
			</Text>
		</Box>
	);
};

export default AvatarUpload;
