import { useState, lazy, Suspense } from 'react';
import Loader from 'components/loading/Loader';
import ToggleSwitch from './TogleSwitch';
import { VStack } from '@chakra-ui/react';

const LeadsCards = lazy(() => import('./LeadsCards'));
const LeadsTable = lazy(() => import('./../lead'));

const Index = () => {
	const [isTableView, setIsTableView] = useState(() => {
		return localStorage.getItem('leadViewMode') === 'table';
	});

	const handleToggle = () => {
		const newView = !isTableView;
		setIsTableView(newView);
		localStorage.setItem('leadViewMode', newView ? 'table' : 'cards');
	};

	return (
		<VStack align='end' justifyContent='flex-start' gap='2'>
			<ToggleSwitch handleToggle={handleToggle} isTableView={isTableView} />
			<Suspense fallback={<Loader />}>
				{isTableView ? <LeadsTable /> : <LeadsCards />}
			</Suspense>
		</VStack>
	);
};

export default Index;
