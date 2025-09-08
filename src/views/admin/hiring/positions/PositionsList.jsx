import { Button, Box, List, ListItem, Text } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

const PositionsList = ({ positions, onEdit }) => {
	return (
		<Box mt={5} textAlign='center' bg='white' rounded='sm' shadow='sm' p='4'>
			<Text fontSize='2xl' fontWeight='bold' mb='4'>
				Positions
			</Text>
			<List spacing={3} w={{base: "100%", sm: "100%", md: "50%"}} mx='auto' p='4'>
				{positions?.totalDocs > 0 ? (
					positions?.doc?.map((position) => (
						<ListItem
							key={position?.doc?._id}
							display='flex'
							justifyContent='space-between'
							alignItems='center'
							shadow='sm'
							bg='gray.100'
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
