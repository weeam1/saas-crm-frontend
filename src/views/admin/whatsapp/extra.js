{
	/* Chat messages */

	{
		/* {selectedFile && (
                <Flex
                  bg='white'
                  p={2}
                  mb={2}
                  borderRadius='md'
                  justify='space-between'
                  align='center'
                >
                  <Text fontSize='sm' isTruncated flex={1}>
                    {selectedFile.type.split('/')[0].charAt(0).toUpperCase() +
                      selectedFile.type.split('/')[0].slice(1)}{' '}
                    ready to send
                  </Text>
                  <Button size='sm' onClick={() => setSelectedFile(null)}>
                    Cancel
                  </Button>
                </Flex>
              )} */
	}
	{
		/* {isRecording && (
                    // <Flex
                    // 	bg='white'
                    // 	p={2}
                    // 	mb={2}
                    // 	borderRadius='lg'
                    // 	justify='space-between'
                    // 	align='center'
                    // 	w='100%'
                    // 	boxShadow='md'
                    // >
                    // 	<HStack spacing={2} flex={1} overflow='hidden'>
                    // 		<Box
                    // 			w='10px'
                    // 			h='10px'
                    // 			bg={whatsappColors.recordingDot}
                    // 			borderRadius='full'
                    // 			animation='pulse 1s infinite'
                    // 			flexShrink={0}
                    // 		/>
                    // 		<HStack
                    // 			spacing={1}
                    // 			flex={1}
                    // 			justify='center'
                    // 			h='24px'
                    // 			align='center'
                    // 			overflow='hidden'
                    // 			px={1}
                    // 		>
                    // 			{generateWaveformData()}
                    // 		</HStack>
                    // 		<Text
                    // 			fontSize='sm'
                    // 			fontWeight='bold'
                    // 			minW='40px'
                    // 			textAlign='right'
                    // 			flexShrink={0}
                    // 		>
                    // 			{formatTime(recordingTime)}
                    // 		</Text>
                    // 	</HStack>
                    // 	<HStack ml={2} spacing={1}>
                    // 		<IconButton
                    // 			icon={<IoMdClose />}
                    // 			aria-label='Cancel recording'
                    // 			size='sm'
                    // 			onClick={cancelRecording}
                    // 			color={whatsappColors.textSecondary}
                    // 			variant='ghost'
                    // 		/>
                    // 		<IconButton
                    // 			icon={<RiSendPlaneFill />}
                    // 			aria-label='Send recording'
                    // 			size='sm'
                    // 			bg={whatsappColors.primary}
                    // 			color='white'
                    // 			_hover={{ bg: whatsappColors.secondary }}
                    // 			onClick={stopRecording}
                    // 		/>
                    // 	</HStack>
                    // </Flex>
  
                    // <VoiceRecorder
                    // 	onSend={(blob) => {
                    // 		const form = new FormData();
                    // 		form.append('voice', blob);
                    // 		// axios.post('/upload', form) or socket.emit('send_voice', ...)
                    // 	}}
                    // />
                  )} */
	}
}
{
	/* <Box
            flex={1}
            p={4}
            overflowY='auto'
            css={{
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: whatsappColors.primary,
                borderRadius: '3px',
              },
            }}
          > */
}
{
	/* <VStack spacing={4} align='stretch'>
              // {groupedMessages.map((item) => {
              // 	// if (item.type === 'date') {
              // 	// 	return (
              // 	// 		<Flex key={item.id} justify='center' my={2}>
              // 	// 			<Box
              // 	// 				bg='rgba(0, 0, 0, 0.1)'
              // 	// 				px={3}
              // 	// 				py={1}
              // 	// 				borderRadius='full'
              // 	// 			>
              // 	// 				<Text fontSize='xs' color='gray.600'>
              // 	// 					{item.date}
              // 	// 				</Text>
              // 	// 			</Box>
              // 	// 		</Flex>
              // 	// 	);
              // 	// }
              // 	// const message = item.message;
              // 	// const isSelf = message.sender.id === currentUser.id;
              // 	// const showAvatar =
              // 	// 	!isSelf &&
              // 	// 	(!groupedMessages[item.id - 1]?.message ||
              // 	// 		groupedMessages[item.id - 1]?.message.sender.id !==
              // 	// 			message.sender.id);
              // 	// return (
              // 	// 	<React.Fragment key={item.id}>
              // 	// 		<Flex
              // 	// 			direction='column'
              // 	// 			align={isSelf ? 'flex-end' : 'flex-start'}
              // 	// 			_hover={{ bg: whatsappColors.messageHoverBg }}
              // 	// 			p={1}
              // 	// 			borderRadius='md'
              // 	// 			transition='background 0.2s ease'
              // 	// 			mt={showAvatar ? 3 : 1}
              // 	// 		>
              // 	// 			{showAvatar && (
              // 	// 				<Flex align='center' mb={1}>
              // 	// 					<Avatar
              // 	// 						src={message.sender.avatar}
              // 	// 						size='xs'
              // 	// 						mr={2}
              // 	// 					/>
              // 	// 					<Text
              // 	// 						fontSize='xs'
              // 	// 						color={whatsappColors.timeStampColor}
              // 	// 					>
              // 	// 						{message.sender.name}
              // 	// 					</Text>
              // 	// 				</Flex>
              // 	// 			)}
              // 	// 			{/* Reply indicator 
                  {message.replyTo && (
              // 	// 				<Box
              // 	// 					bg={whatsappColors.replyBg}
              // 	// 					borderLeft={`3px solid ${whatsappColors.replyBorder}`}
              // 	// 					borderRadius='md'
              // 	// 					p={2}
              // 	// 					mb={1}
              // 	// 					maxW={{ base: '90%', md: '80%' }}
              // 	// 					alignSelf={isSelf ? 'flex-end' : 'flex-start'}
              // 	// 				>
              // 	// 					<Text
              // 	// 						fontSize='xs'
              // 	// 						color={whatsappColors.textSecondary}
              // 	// 					>
              // 	// 						{message.replyTo.sender.name}
              // 	// 					</Text>
              // 	// 					<Text
              // 	// 						fontSize='sm'
              // 	// 						color={whatsappColors.textDark}
              // 	// 						isTruncated
              // 	// 					>
              // 	// 						{message.replyTo.text || 'Media message'}
              // 	// 					</Text>
              // 	// 				</Box>
              // 	// 			)}
              // 	// 			{message.type === 'text' && (
              // 	// 				<Box
              // 	// 					position='relative'
              // 	// 					bg={
              // 	// 						isSelf
              // 	// 							? whatsappColors.outgoingBg
              // 	// 							: whatsappColors.incomingBg
              // 	// 					}
              // 	// 					px={4}
              // 	// 					py={2}
              // 	// 					borderRadius='lg'
              // 	// 					maxW={{ base: '90%', md: '80%' }}
              // 	// 					boxShadow='sm'
              // 	// 					color={
              // 	// 						isSelf
              // 	// 							? whatsappColors.textDark
              // 	// 							: whatsappColors.textDark
              // 	// 					}
              // 	// 					borderTopLeftRadius={
              // 	// 						!isSelf && !showAvatar ? '4px' : 'lg'
              // 	// 					}
              // 	// 					borderTopRightRadius={isSelf ? '4px' : 'lg'}
              // 	// 					wordBreak='break-word'
              // 	// 				>
              // 	// 					<Text whiteSpace='pre-wrap' overflowWrap='break-word'>
              // 	// 						{message.text}
              // 	// 					</Text>
              // 	// 					<Flex
              // 	// 						justifyContent={'flex-end'}
              // 	// 						align='center'
              // 	// 						gap={1}
              // 	// 					>
              // 	// 						<Text
              // 	// 							fontSize='10px'
              // 	// 							color={whatsappColors.timeStampColor}
              // 	// 							mr={1}
              // 	// 						>
              // 	// 							{formatMessageTime(message.timestamp)}
              // 	// 						</Text>
              // 	// 						{isSelf && (
              // 	// 							<>
              // 	// 								{message.status === 'read' ? (
              // 	// 									<FaCheckDouble size='10px' color='#34B7F1' />
              // 	// 								) : message.status === 'delivered' ? (
              // 	// 									<FaCheckDouble
              // 	// 										size='10px'
              // 	// 										color={whatsappColors.timeStampColor}
              // 	// 									/>
              // 	// 								) : (
              // 	// 									<FaCheck
              // 	// 										size='10px'
              // 	// 										color={whatsappColors.timeStampColor}
              // 	// 									/>
              // 	// 								)}
              // 	// 							</>
              // 	// 						)}
              // 	// 					</Flex>
              // 	// 				</Box>
              // 	// 			)}
              // 	// 			{message.type === 'image' && (
              // 	// 				<Box
              // 	// 					position='relative'
              // 	// 					bg={
              // 	// 						isSelf
              // 	// 							? whatsappColors.outgoingBg
              // 	// 							: whatsappColors.incomingBg
              // 	// 					}
              // 	// 					color={isSelf ? 'white' : 'black'}
              // 	// 					p={2}
              // 	// 					borderRadius='lg'
              // 	// 					maxW={{ base: '90%', md: '80%' }}
              // 	// 					boxShadow='sm'
              // 	// 					borderTopLeftRadius={
              // 	// 						!isSelf && !showAvatar ? '4px' : 'lg'
              // 	// 					}
              // 	// 					borderTopRightRadius={isSelf ? '4px' : 'lg'}
              // 	// 				>
              // 	// 					<img
              // 	// 						src={message.file.url}
              // 	// 						alt='shared'
              // 	// 						style={{
              // 	// 							maxWidth: '100%',
              // 	// 							borderRadius: '8px',
              // 	// 							maxHeight: '300px',
              // 	// 							objectFit: 'contain',
              // 	// 							cursor: 'pointer',
              // 	// 						}}
              // 	// 						onClick={() => setSelectedImage(message.file.url)}
              // 	// 					/>
              // 	// 					<Flex
              // 	// 						justifyContent={'space-between'}
              // 	// 						align='center'
              // 	// 						mt={2}
              // 	// 					>
              // 	// 						<Button
              // 	// 							size='sm'
              // 	// 							colorScheme='whatsapp'
              // 	// 							color='white'
              // 	// 							leftIcon={<FiDownload />}
              // 	// 							onClick={() => handleDownloadFile(message.file)}
              // 	// 						>
              // 	// 							Download
              // 	// 						</Button>
              // 	// 						<Flex align='center' gap={1}>
              // 	// 							<Text
              // 	// 								fontSize='10px'
              // 	// 								color={isSelf ? 'whiteAlpha.800' : 'gray.600'}
              // 	// 								mr={1}
              // 	// 							>
              // 	// 								{formatMessageTime(message.timestamp)}
              // 	// 							</Text>
              // 	// 							{isSelf && (
              // 	// 								<>
              // 	// 									{message.status === 'read' ? (
              // 	// 										<FaCheckDouble
              // 	// 											size='10px'
              // 	// 											color='#34B7F1'
              // 	// 										/>
              // 	// 									) : message.status === 'delivered' ? (
              // 	// 										<FaCheckDouble
              // 	// 											size='10px'
              // 	// 											color={isSelf ? 'white' : 'gray.600'}
              // 	// 										/>
              // 	// 									) : (
              // 	// 										<FaCheck
              // 	// 											size='10px'
              // 	// 											color={isSelf ? 'white' : 'gray.600'}
              // 	// 										/>
              // 	// 									)}
              // 	// 								</>
              // 	// 							)}
              // 	// 						</Flex>
              // 	// 					</Flex>
              // 	// 				</Box>
              // 	// 			)}
              // 	// 			{message.type === 'video' && (
              // 	// 				<Box
              // 	// 					position='relative'
              // 	// 					bg={
              // 	// 						isSelf
              // 	// 							? whatsappColors.outgoingBg
              // 	// 							: whatsappColors.incomingBg
              // 	// 					}
              // 	// 					color={isSelf ? 'white' : 'black'}
              // 	// 					p={2}
              // 	// 					borderRadius='lg'
              // 	// 					maxW={{ base: '90%', md: '80%' }}
              // 	// 					boxShadow='sm'
              // 	// 					borderTopLeftRadius={
              // 	// 						!isSelf && !showAvatar ? '4px' : 'lg'
              // 	// 					}
              // 	// 					borderTopRightRadius={isSelf ? '4px' : 'lg'}
              // 	// 				>
              // 	// 					<video
              // 	// 						controls
              // 	// 						style={{
              // 	// 							maxWidth: '100%',
              // 	// 							borderRadius: '8px',
              // 	// 							maxHeight: '300px',
              // 	// 							objectFit: 'contain',
              // 	// 						}}
              // 	// 					>
              // 	// 						<source
              // 	// 							src={message.file.url}
              // 	// 							type={message.file.type}
              // 	// 						/>
              // 	// 						Your browser does not support the video tag.
              // 	// 					</video>
              // 	// 					<Flex
              // 	// 						justifyContent={'space-between'}
              // 	// 						align='center'
              // 	// 						mt={2}
              // 	// 					>
              // 	// 						<Button
              // 	// 							size='sm'
              // 	// 							colorScheme='whatsapp'
              // 	// 							color='white'
              // 	// 							leftIcon={<FiDownload />}
              // 	// 							onClick={() => handleDownloadFile(message.file)}
              // 	// 						>
              // 	// 							Download
              // 	// 						</Button>
              // 	// 						<Flex align='center' gap={1}>
              // 	// 							<Text
              // 	// 								fontSize='10px'
              // 	// 								color={isSelf ? 'whiteAlpha.800' : 'gray.600'}
              // 	// 								mr={1}
              // 	// 							>
              // 	// 								{formatMessageTime(message.timestamp)}
              // 	// 							</Text>
              // 	// 							{isSelf && (
              // 	// 								<>
              // 	// 									{message.status === 'read' ? (
              // 	// 										<FaCheckDouble
              // 	// 											size='10px'
              // 	// 											color='#34B7F1'
              // 	// 										/>
              // 	// 									) : message.status === 'delivered' ? (
              // 	// 										<FaCheckDouble
              // 	// 											size='10px'
              // 	// 											color={isSelf ? 'white' : 'gray.600'}
              // 	// 										/>
              // 	// 									) : (
              // 	// 										<FaCheck
              // 	// 											size='10px'
              // 	// 											color={isSelf ? 'white' : 'gray.600'}
              // 	// 										/>
              // 	// 									)}
              // 	// 								</>
              // 	// 							)}
              // 	// 						</Flex>
              // 	// 					</Flex>
              // 	// 				</Box>
              // 	// 			)}
              // 	// 			{message.type === 'audio' && (
              // 	// 				<Box
              // 	// 					position='relative'
              // 	// 					bg={
              // 	// 						isSelf
              // 	// 							? whatsappColors.outgoingBg
              // 	// 							: whatsappColors.incomingBg
              // 	// 					}
              // 	// 					color={isSelf ? 'white' : 'black'}
              // 	// 					p={2}
              // 	// 					borderRadius='lg'
              // 	// 					maxW={{ base: '90%', md: '80%' }}
              // 	// 					boxShadow='sm'
              // 	// 					borderTopLeftRadius={
              // 	// 						!isSelf && !showAvatar ? '4px' : 'lg'
              // 	// 					}
              // 	// 					borderTopRightRadius={isSelf ? '4px' : 'lg'}
              // 	// 				>
              // 	// 					<audio
              // 	// 						controls
              // 	// 						style={{
              // 	// 							width: '100%',
              // 	// 						}}
              // 	// 					>
              // 	// 						<source
              // 	// 							src={message.file.url}
              // 	// 							type={message.file.type}
              // 	// 						/>
              // 	// 						Your browser does not support the audio element.
              // 	// 					</audio>
              // 	// 					<Flex
              // 	// 						justifyContent={'space-between'}
              // 	// 						align='center'
              // 	// 						mt={2}
              // 	// 					>
              // 	// 						<Button
              // 	// 							size='sm'
              // 	// 							colorScheme='whatsapp'
              // 	// 							color='white'
              // 	// 							leftIcon={<FiDownload />}
              // 	// 							onClick={() => handleDownloadFile(message.file)}
              // 	// 						>
              // 	// 							Download
              // 	// 						</Button>
              // 	// 						<Flex align='center' gap={1}>
              // 	// 							<Text
              // 	// 								fontSize='10px'
              // 	// 								color={isSelf ? 'whiteAlpha.800' : 'gray.600'}
              // 	// 								mr={1}
              // 	// 							>
              // 	// 								{formatMessageTime(message.timestamp)}
              // 	// 							</Text>
              // 	// 							{isSelf && (
              // 	// 								<>
              // 	// 									{message.status === 'read' ? (
              // 	// 										<FaCheckDouble
              // 	// 											size='10px'
              // 	// 											color='#34B7F1'
              // 	// 										/>
              // 	// 									) : message.status === 'delivered' ? (
              // 	// 										<FaCheckDouble
              // 	// 											size='10px'
              // 	// 											color={isSelf ? 'white' : 'gray.600'}
              // 	// 										/>
              // 	// 									) : (
              // 	// 										<FaCheck
              // 	// 											size='10px'
              // 	// 											color={isSelf ? 'white' : 'gray.600'}
              // 	// 										/>
              // 	// 									)}
              // 	// 								</>
              // 	// 							)}
              // 	// 						</Flex>
              // 	// 					</Flex>
              // 	// 				</Box>
              // 	// 			)}
              // 	// 			{message.type === 'voice' && (
              // 	// 				<Box
              // 	// 					position='relative'
              // 	// 					bg={
              // 	// 						isSelf
              // 	// 							? whatsappColors.outgoingBg
              // 	// 							: whatsappColors.incomingBg
              // 	// 					}
              // 	// 					px={4}
              // 	// 					py={2}
              // 	// 					borderRadius='lg'
              // 	// 					maxW={{ base: '90%', md: '80%' }}
              // 	// 					minW='200px'
              // 	// 					boxShadow='sm'
              // 	// 					color={
              // 	// 						isSelf
              // 	// 							? whatsappColors.textDark
              // 	// 							: whatsappColors.textDark
              // 	// 					}
              // 	// 					borderTopLeftRadius={
              // 	// 						!isSelf && !showAvatar ? '4px' : 'lg'
              // 	// 					}
              // 	// 					borderTopRightRadius={isSelf ? '4px' : 'lg'}
              // 	// 				>
              // 	// 					<VoiceMessagePlayer
              // 	// 						url={message.audioUrl}
              // 	// 						isSelf={isSelf}
              // 	// 						onPause={(paused) =>
              // 	// 							handleVoiceMessagePause(message.id, paused)
              // 	// 						}
              // 	// 					/>
              // 	// 					<Flex
              // 	// 						justifyContent={'flex-end'}
              // 	// 						align='center'
              // 	// 						gap={1}
              // 	// 					>
              // 	// 						<Text
              // 	// 							fontSize='10px'
              // 	// 							color={whatsappColors.timeStampColor}
              // 	// 							mr={1}
              // 	// 						>
              // 	// 							{formatMessageTime(message.timestamp)}
              // 	// 						</Text>
              // 	// 						{isSelf && (
              // 	// 							<>
              // 	// 								{message.status === 'read' ? (
              // 	// 									<FaCheckDouble size='10px' color='#34B7F1' />
              // 	// 								) : message.status === 'delivered' ? (
              // 	// 									<FaCheckDouble
              // 	// 										size='10px'
              // 	// 										color={whatsappColors.timeStampColor}
              // 	// 									/>
              // 	// 								) : (
              // 	// 									<FaCheck
              // 	// 										size='10px'
              // 	// 										color={whatsappColors.timeStampColor}
              // 	// 									/>
              // 	// 								)}
              // 	// 							</>
              // 	// 						)}
              // 	// 					</Flex>
              // 	// 				</Box>
              // 	// 			)}
              // 	// 			{message.type === 'file' && (
              // 	// 				<FileMessage
              // 	// 					file={message.file}
              // 	// 					isSelf={isSelf}
              // 	// 					onDownload={() => handleDownloadFile(message.file)}
              // 	// 					timestamp={formatMessageTime(message.timestamp)}
              // 	// 					status={message.status}
              // 	// 				/>
              // 	// 			)}
              // 	// 		</Flex>
              // 	// 	</React.Fragment>
              // 	// );
              // })}

              // {/* <div ref={messagesEndRef} /> 
              {isSending && (
              // 	<Flex justify='flex-end' pr={4}>
              // 		<Spinner size='sm' color={whatsappColors.primary} />
              // 	</Flex>
              // )}
            {/* </VStack> */
}
{
	/* </Box> */
}
