import { useState, lazy, Suspense } from 'react';
import Loader from 'components/loading/Loader';
import ToggleSwitch from './TogleSwitch';
import { VStack } from '@chakra-ui/react';
import PageSizeAlert from './components/subComponents/PageSizeAlert';

const LeadsCards = lazy(() => import('./LeadsCards'));
const LeadsTable = lazy(() => import('./../lead'));

const Index = () => {
	const [view, setView] = useState(() => {
		return localStorage.getItem('leadViewMode') || 'grid';
	});

	const handleViewChange = (newView) => {
		setView(newView);
		localStorage.setItem('leadViewMode', newView);
	};

	return (
		<VStack justifyContent='flex-start' gap='2'>
			{view !== 'table' && <PageSizeAlert />}
			<Suspense fallback={<Loader />}>
				{view === 'table' ? (
					<LeadsTable handleView={handleViewChange} view={view} />
				) : (
					<LeadsCards handleView={handleViewChange} view={view} />
				)}
			</Suspense>
		</VStack>
	);
};

export default Index;
