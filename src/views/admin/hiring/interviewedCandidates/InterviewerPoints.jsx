import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerCloseButton,
	DrawerBody,
	Grid,
} from '@chakra-ui/react';
import DisplayField from 'components/displays/DisplayField';

const InterviewerPoints = ({ isOpen, onClose, evaluation }) => {
	return (
		<Drawer isOpen={isOpen} onClose={onClose} placement='left' size='sm'>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>
					{evaluation?.interviewer?.fullName || 'Interviewer'} Points
				</DrawerHeader>
				<DrawerBody>
					<Grid
						templateColumns={{
							base: '1fr',
							md: 'repeat(2, 1fr)',
						}}
						overflowY='auto'
						height='70vh'
						p='4'
						gap={3}
					>
						{evaluation?.criteria?.map((item) => (
							<DisplayField
								key={item._id}
								label={`${item.key}`}
								value={item.score}
							/>
						))}
					</Grid>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default InterviewerPoints;
