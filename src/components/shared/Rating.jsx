import { HStack, Icon } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const Rating = ({ value = 0, max = 5 }) => {
	return (
		<HStack spacing={1}>
			{Array.from({ length: max }).map((_, i) => (
				<Icon
					as={StarIcon}
					key={i}
					color={i < value ? 'yellow.400' : 'gray.300'}
					boxSize={5}
				/>
			))}
		</HStack>
	);
};

export default Rating;
