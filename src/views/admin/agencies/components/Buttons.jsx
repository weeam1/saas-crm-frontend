import { Button, Flex } from '@chakra-ui/react';
import { useModalColors } from 'hooks/useModalColors';

const Buttons = ({ onCancel, onSave, isUpdating }) => {
	const colors = useModalColors();

	return (
		<Flex
			justify={{ base: 'center', md: 'flex-end' }}
			mt={{ base: 3, md: 5 }}
			direction={{ base: 'column', md: 'row' }}
			alignItems={{ base: 'center', md: 'flex-end' }}
			gap={{ base: 2, md: 3 }}
		>
			<Button
				variant='outline'
				onClick={onCancel}
				w={{ base: '100%', md: '159px' }}
				maxW={{ base: '150px', md: '159px' }}
				borderRadius='5px'
				fontSize='16px'
				fontWeight='400'
			>
				Cancel
			</Button>
			<Button
				w={{ base: '100%', md: '159px' }}
				maxW={{ base: '150px', md: '159px' }}
				variant='brand'
				onClick={onSave}
				borderRadius='5px'
				fontSize='16px'
				fontWeight='400'
			>
				{isUpdating ? 'Saving...' : 'Save'}
			</Button>
		</Flex>
	);
};

export default Buttons;