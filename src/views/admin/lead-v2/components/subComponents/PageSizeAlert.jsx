import { useEffect, useState } from 'react';
import {
	Alert,
	AlertIcon,
	AlertTitle,
	CloseButton,
	Box,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';

const PageSizeAlert = () => {
	const [showAlert, setShowAlert] = useState(false);

	const leads = useSelector((state) => state.leads);

	useEffect(() => {
		if (leads?.pageSize === 200) {
			setShowAlert(true);
		} else {
			setShowAlert(false);
		}
	}, [leads?.pageSize]);

	if (!showAlert) return null;

	return (
		<Alert flex='1' status='warning' borderRadius='md' boxShadow='sm'>
			<Box display='flex' alignItems='center'>
				<AlertIcon />
				<AlertTitle fontSize='sm' fontWeight='normal'>
					Loading a large dataset (200 items) may impact performance and
					rendering speed. Consider using pagination or filters for a smoother
					experience
				</AlertTitle>
			</Box>
			<CloseButton
				position='absolute'
				right='8px'
				top='8px'
				onClick={() => setShowAlert(false)}
			/>
		</Alert>
	);
};

export default PageSizeAlert;
