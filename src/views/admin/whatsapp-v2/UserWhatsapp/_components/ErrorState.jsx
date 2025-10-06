import { Box, Text, Button, VStack, Icon, Center } from '@chakra-ui/react';
import { WarningIcon, CloseIcon, RepeatIcon } from '@chakra-ui/icons';

const ErrorState = ({
	message,
	type = 'error',
	onRetry = null,
	showReload = true,
	title = null,
}) => {
	const handleReload = () => {
		window.location.reload();
	};

	const handleRetry = () => {
		if (onRetry) {
			onRetry();
		} else {
			handleReload();
		}
	};

	const getConfig = () => {
		const configs = {
			error: {
				color: 'red.500',
				bg: 'red.50',
				borderColor: 'red.200',
				icon: WarningIcon,
				defaultTitle: 'Something went wrong',
				buttonScheme: 'red',
			},
			warning: {
				color: 'orange.500',
				bg: 'orange.50',
				borderColor: 'orange.200',
				icon: WarningIcon,
				defaultTitle: 'Warning',
				buttonScheme: 'orange',
			},
			info: {
				color: 'blue.500',
				bg: 'blue.50',
				borderColor: 'blue.200',
				icon: WarningIcon,
				defaultTitle: 'Information',
				buttonScheme: 'blue',
			},
		};

		return configs[type] || configs.error;
	};

	const config = getConfig();
	const IconComponent = config.icon;

	return (
		<Center
			position='fixed'
			top='0'
			left='0'
			width='100vw'
			height='100vh'
			bg='blackAlpha.50'
			backdropFilter='blur(2px)'
			zIndex='overlay'
			p={4}
		>
			<Box
				maxW='400px'
				w='full'
				p={8}
				borderWidth='1px'
				borderRadius='xl'
				borderColor={config.borderColor}
				bg='white'
				boxShadow='xl'
				textAlign='center'
			>
				<VStack spacing={4}>
					{/* Icon */}
					<Icon
						as={IconComponent}
						w={12}
						h={12}
						color={config.color}
						opacity={0.8}
					/>

					{/* Title */}
					<Text
						fontSize='xl'
						fontWeight='bold'
						color={config.color}
						lineHeight='short'
					>
						{title || config.defaultTitle}
					</Text>

					{/* Message */}
					<Text color='gray.600' fontSize='md' lineHeight='tall'>
						{message}
					</Text>

					{/* Action Buttons */}
					<VStack spacing={3} w='full' pt={2}>
						{showReload && (
							<Button
								size='md'
								colorScheme={config.buttonScheme}
								onClick={handleRetry}
								leftIcon={<RepeatIcon />}
								w='full'
								borderRadius='md'
							>
								{onRetry ? 'Try Again' : 'Reload Page'}
							</Button>
						)}

						{/* Optional secondary action */}
						<Button
							size='sm'
							variant='ghost'
							color='gray.500'
							onClick={() => window.history.back()}
							w='full'
						>
							Go Back
						</Button>
					</VStack>
				</VStack>
			</Box>
		</Center>
	);
};

export default ErrorState;
