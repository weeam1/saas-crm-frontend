import React from 'react';
import { Flex, Box, Text, Input, Button } from '@chakra-ui/react';

const Chat = ({ chat }) => {
	return (
		<Flex direction='column' h='100%'>
			{/* Header */}
			<Box p={3} borderBottom='1px solid #ddd' bg='gray.100'>
				<Text fontWeight='bold'>{chat?.name || 'Unknown User'}</Text>
				<Text fontSize='sm' color='gray.500'>
					{chat?.phoneNumber}
				</Text>
			</Box>

			{/* Messages */}
			<Box flex='1' overflowY='auto' p={3} bg='white'>
				{chat?.messages?.length ? (
					chat.messages.map((msg, idx) => (
						<Box
							key={idx}
							p={2}
							my={1}
							bg={msg.fromMe ? 'green.100' : 'gray.200'}
							alignSelf={msg.fromMe ? 'flex-end' : 'flex-start'}
							borderRadius='md'
							maxW='70%'
						>
							<Text>{msg.body}</Text>
						</Box>
					))
				) : (
					<Flex align='center' justify='center' h='100%'>
						<Text color='gray.400'>No messages yet.</Text>
					</Flex>
				)}
			</Box>

			{/* Input */}
			<Box p={3} borderTop='1px solid #ddd' bg='gray.50'>
				<Flex>
					<Input placeholder='Type a message...' mr={2} />
					<Button colorScheme='green'>Send</Button>
				</Flex>
			</Box>
		</Flex>
	);
};

export default Chat;
