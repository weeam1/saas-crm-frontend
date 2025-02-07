import { Button, Box, List, ListItem, Text } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

const PositionsList = ({ positions, onEdit }) => {
	return (
		<Box
			mt={5}
			textAlign='center'
			bg='softGray.100'
			rounded='sm'
			shadow='sm'
			p='4'
		>
			<Text fontSize='2xl' fontWeight='bold' mb='4'>
				Positions
			</Text>
			<List spacing={3} width='500px' margin='auto' p='4'>
				{positions?.totalDocs > 0 ? (
					positions?.doc?.map((position) => (
						<ListItem
							key={position?.doc?._id}
							display='flex'
							justifyContent='space-between'
							alignItems='center'
							shadow='sm'
							bg='white'
							p='2'
						>
							{position.name}
							<Button
								size='xs'
								colorScheme='green'
								onClick={() => onEdit(position)}
								leftIcon={<EditIcon />}
							>
								Edit
							</Button>
						</ListItem>
					))
				) : (
					<Text message={'Position not found!'} />
				)}
			</List>
		</Box>
	);
};

export default PositionsList;
