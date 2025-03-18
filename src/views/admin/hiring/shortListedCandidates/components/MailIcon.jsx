import { MdEmail } from 'react-icons/md';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { Box, Icon } from '@chakra-ui/react';

const MailIcon = ({ isRead }) => {
	return (
		<Box
			position='relative'
			display='flex'
			alignItems='center'
			justifyContent='center'
			p={0}
			m={0}
		>
			{/* Mail Icon */}
			<Icon as={MdEmail} boxSize={6} color={isRead ? 'blue.400' : 'gray.400'} />

			{/* Green Tick for Read Mail */}
			{isRead && (
				<Icon
					as={CheckCircleIcon}
					boxSize={3}
					color='green.400'
					position='absolute'
					top='0'
					right='0'
					transform='translate(30%, -30%)'
					bg='white'
					borderRadius='full'
				/>
			)}
		</Box>
	);
};

export default MailIcon;
