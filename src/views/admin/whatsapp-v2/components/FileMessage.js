import React from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { FiDownload, FiImage, FiVideo, FiMusic, FiFile } from 'react-icons/fi';
import { FaCheck, FaCheckDouble } from 'react-icons/fa';

const FileMessage = ({ file, isSelf, onDownload, timestamp, status }) => {
	const getFileIcon = () => {
		if (file.type.includes('image')) return <FiImage size='24px' />;
		if (file.type.includes('video')) return <FiVideo size='24px' />;
		if (file.type.includes('audio')) return <FiMusic size='24px' />;
		return <FiFile size='24px' />;
	};

	const getFileType = () => {
		if (file.type.includes('image')) return 'Image';
		if (file.type.includes('video')) return 'Video';
		if (file.type.includes('audio')) return 'Audio';
		return file.name.split('.').pop().toUpperCase() + ' File';
	};

	const formatFileSize = (bytes) => {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	};

	return (
		<Box
			bg={isSelf ? '#D9FDD3' : 'gray.300'}
			borderRadius='lg'
			maxW={{ base: 'full' }}
			boxShadow='sm'
			w='100%'
			p={2}
		>
			<Flex align='center'>
				<Box mr={3}>{getFileIcon()}</Box>
				<Box flex={1} minW='0' overflow='hidden'>
					<Text fontWeight='bold' isTruncated>
						{file.name}
					</Text>
					<Text fontSize='sm' color='#667781' isTruncated>
						{getFileType()} • {formatFileSize(file.size)}
					</Text>
				</Box>
			</Flex>
			<Flex justify='space-between' align='center' mt={2}>
				{/* <Button
          size="sm"
          colorScheme="whatsapp"
          color="white"
          leftIcon={<FiDownload />}
          onClick={onDownload}
          flexShrink={0}
        >
          Download
        </Button> */}
				{/* <Flex align='center' gap={1} minW='fit-content'>
					<Text fontSize='10px' color='#667781' mr={1}>
						{timestamp}
					</Text>
					{isSelf && (
						<>
							{status === 'read' ? (
								<FaCheckDouble size='10px' color='#34B7F1' />
							) : status === 'delivered' ? (
								<FaCheckDouble size='10px' color='#667781' />
							) : (
								<FaCheck size='10px' color='#667781' />
							)}
						</>
					)}
				</Flex> */}
			</Flex>
		</Box>
	);
};

export default FileMessage;
