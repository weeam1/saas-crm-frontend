import { useFetchItemsQuery } from "api/apiSlice";
import { useNavigate } from "react-router-dom";
import SurveySummary from "./SurveySummary";
import SurveyGraph from "./SurveyGraph";

const SurveyDashboard = () => {
  const navigate = useNavigate();

  const {
    data: surveysStats,
    isLoading,
    refetch,
    isFetching,
  } = useFetchItemsQuery(
    { path: "/surveys/stats" },
    { refetchOnMountOrArgChange: true }
  );

  return (
    <>
      <SurveySummary
        title="Survey"
        data={surveysStats?.data?.summaryData}
        isLoading={isLoading}
        refetch={refetch}
        isFetching={isFetching}
      />
      <SurveyGraph isLoading={isLoading} data={surveysStats?.data?.graphData} isFetching={isFetching} />
    </>
  );
};

export default SurveyDashboard;
