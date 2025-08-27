import React from 'react';
import { Box } from '@chakra-ui/react';
import Header from './components/Header';
import PermissionSection from './components/PermissionSection';

const DefaultDashboard = () => {
	return (
		<Box>
			<Header />
			<PermissionSection />
		</Box>
	);
};

export default DefaultDashboard;
