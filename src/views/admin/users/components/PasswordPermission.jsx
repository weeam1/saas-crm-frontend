import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Input,
	Text,
	HStack,
	Icon,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { buttonStyle } from 'utils/btn';

const securityPasswordPermission = ({
	isOpen,
	onClose,
	securityPassword,
	setSecurityPassword,
	handleProceed,
	type = '',
}) => {
	const handleKeyDown = (event) => {
		if (event.key === 'Enter' && securityPassword) {
			handleProceed();
		}
	};

	return (
		<Modal isOpen={isOpen} isCentered size='2xl'>
			<ModalOverlay />
			<ModalContent fontFamily="'DM Sans', sans-serif">
				<ModalHeader>Enter Your Password</ModalHeader>
				<ModalBody>
					<HStack spacing={2} mb={2}>
						<Icon as={InfoIcon} color='blue.500' boxSize={4} mt={0.5} />
						<Text fontSize='sm' color='blue.600'>
							For security reasons, please confirm your identity by entering
							your Password.
						</Text>
					</HStack>
					<form>
						<Input
							type='password'
							placeholder='Enter your Password'
							value={securityPassword}
							onChange={(e) => setSecurityPassword(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
					</form>
				</ModalBody>
				<ModalFooter>
					<Button
						{...buttonStyle}
						variant='solid'
						bg='gray.200'
						color='gray.800'
						_active={{ bg: 'gray.300' }}
						mr='3'
						fontSize='md'
						aria-label='close'
						onClick={onClose}
					>
						Close
					</Button>
					<Button
						{...buttonStyle}
						variant='solid'
						bg='brand.400'
						fontSize='md'
						aria-label='proceed'
						onClick={handleProceed}
						isDisabled={!securityPassword}
					>
						Proceed
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default securityPasswordPermission;
