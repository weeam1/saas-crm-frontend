import { useState, lazy, Suspense, useEffect } from 'react';
import Loader from 'components/loading/Loader';
import ToggleSwitch from './TogleSwitch';
import { VStack } from '@chakra-ui/react';
import PageSizeAlert from './components/subComponents/PageSizeAlert';
import { usePermissions } from 'hooks/usePermissions';
import { useNavigate } from 'react-router-dom';

const LeadsCards = lazy(() => import('./LeadsCards'));
const LeadsTable = lazy(() => import('./../lead'));

const Index = () => {
	const [view, setView] = useState(() => {
		return localStorage.getItem('leadView') || 'grid';
	});

	const handleViewChange = (newView) => {
		setView(newView);
		localStorage.setItem('leadView', newView);
	};

	const { hasPermission } = usePermissions();
	const navigate = useNavigate();

	useEffect(() => {
		if (!hasPermission('leads')) return navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<VStack justifyContent='flex-start' gap='2'>
			{view !== 'table' && <PageSizeAlert />}
			{/* {view === 'table' ? (
					<LeadsTable handleView={handleViewChange} view={view} />
				) : (
					<LeadsCards handleView={handleViewChange} view={view} />
				)} */}
			<LeadsCards handleView={handleViewChange} view={view} />
		</VStack>
	);
};

export default Index;
