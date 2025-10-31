import { useFetchItemsQuery } from 'api/apiSlice';
import { useNavigate } from 'react-router-dom';
import SurveySummary from './SurveySummary';
import SurveyGraph from './SurveyGraph';

const SurveyDashboard = () => {
	const navigate = useNavigate();

	const { data: surveysStats, isLoading } = useFetchItemsQuery(
		{ path: '/surveys/stats' },
		{ refetchOnMountOrArgChange: true }
	);

	return (
		<>
			<SurveySummary
				title='Survey'
				data={surveysStats?.data?.summaryData}
				buttonText='+ Create Survey'
				onButtonClick={() => navigate('/survey/create')}
				secondaryButtonText='LeaderBoard'
				onSecondaryButtonClick={() =>
					navigate('/survey/dashboard/survey-leader-board')
				}
				isLoading={isLoading}
			/>
			<SurveyGraph isLoading={isLoading} data={surveysStats?.data?.graphData} />
		</>
	);
};

export default SurveyDashboard;
