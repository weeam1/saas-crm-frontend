import { useState } from "react";
import FilterSearch from "./Component/FilterSearch";
import { Box, Grid } from "@chakra-ui/react";
import SurveyCard from "./Component/SurveyCard";
import SurveyCardLoading from "./Loader/SurveyCardLoading";
import { useFetchItemsQuery } from "api/apiSlice";
import NoData from "components/Message/NoData";
import SurveyTable from "./Component/SurveyTable";
import SurveySummary from "./Component/SurveySummary";
import SurveyGraph from "./Component/SurveyGraph";
import { useNavigate } from "react-router-dom";

const Survey = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [closesAt, setClosesAt] = useState(false);
  const [search, setSearch] = useState("");
  const [searchTags, setSearchTags] = useState(null);
  const [view, setView] = useState(() => {
    return localStorage.getItem("surveysView") || "grid";
  });

  const navigate = useNavigate();

  const buildQueryParams = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role =
      user?.role === "superAdmin"
        ? "superAdmin"
        : (user?.roles?.[0]?.roleName ?? "unknown");

    const params = {
      page: currentPage,
      limit: pageSize,
    };

    if (role !== "superAdmin") params.closesAt = closesAt;
    if (search) params.search = search;
    if (startDate) params.after = startDate;
    if (endDate) params.before = endDate;
    return params;
  };

  const {
    data: surveys,
    isLoading,
    isFetching,
    refetch,
  } = useFetchItemsQuery(
    { path: "/surveys", params: buildQueryParams() },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: surveysStats,
    isLoading: SurveyStatsLoading,
  } = useFetchItemsQuery(
    { path: "/surveys/stats" },
    { refetchOnMountOrArgChange: true }
  );

  console.log("surveysStats", surveysStats);
  const handleViewChange = (newView) => {
    setView(newView);
    localStorage.setItem("surveysView", newView);
  };

  return (
    <>
      <SurveySummary
        title="Survey"
        data={surveysStats?.data?.summaryData}
        buttonText="+ Create Survey"
        onButtonClick={() => navigate("/survey/create-survey")}
        secondaryButtonText = "LeaderBoard"
        onSecondaryButtonClick = {() => navigate('/survey/survey-leader-board')}
        isLoading={SurveyStatsLoading}
      />
      <SurveyGraph
        isLoading={SurveyStatsLoading}
        data={surveysStats?.data?.graphData}
      />
      <Box
        bg="white"
        p={{ base: 3, md: 4 }}
        borderRadius="md"
        boxShadow="sm"
        mt={4}
        width="100%"
      >
        <FilterSearch
          currentPage={currentPage}
          totalPages={surveys?.totalPages || 1}
          onPageChange={setCurrentPage}
          totalItems={surveys?.totalDocs || 0}
          pageSize={pageSize}
          setPageSize={setPageSize}
          handlePageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          isLoading={isLoading || isFetching}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setSearchTags={setSearchTags}
          searchTags={searchTags}
          handleViewChange={handleViewChange}
          view={view}
        />
        {view === "grid" && (isLoading || isFetching) ? (
          <SurveyCardLoading count={pageSize} />
        ) : view === "grid" ? (
          surveys?.doc?.surveys.length > 0 ? (
            <Grid
              // display='grid'
              sx={{
                // >= 0px
                "@media (min-width: 0px)": {
                  gridTemplateColumns: "1fr",
                },
                // >= 992px
                "@media (min-width: 600px)": {
                  gridTemplateColumns: "repeat(2, 1fr)",
                },
                // >= 1280px
                "@media (min-width: 1040px)": {
                  gridTemplateColumns: "repeat(3, 1fr)",
                },
                // >= 1664px
                "@media (min-width: 1564px)": {
                  gridTemplateColumns: "repeat(4, 1fr)",
                },
                // >= 1920px (e.g., Full HD+)
                "@media (min-width: 2120px)": {
                  gridTemplateColumns: "repeat(5, 1fr)",
                },
                // >= 2560px (2.5K / QHD)
                "@media (min-width: 2560px)": {
                  gridTemplateColumns: "repeat(6, 1fr)",
                },
                // >= 3840px (4K)
                "@media (min-width: 3840px)": {
                  gridTemplateColumns: "repeat(7, 1fr)",
                },
                // >= 7680px (8K)
                "@media (min-width: 7680px)": {
                  gridTemplateColumns: "repeat(8, 1fr)",
                },
              }}
              gap={3}
              marginTop={{ base: 4, md: 6 }}
              width="100%"
              justifyItems="center"
            >
              {surveys?.doc?.surveys.map((survey) => (
                <Box key={survey._id} minWidth="240px" width="100%">
                  <SurveyCard
                    isActive={survey.status === "active"}
                    data={{
                      id: survey._id,
                      name: survey.title,
                      taken: `${survey.submittedUsers || 0}/${survey.invitedUsersCount || 0}`,
                      totalQuestions: survey.questionsCount,
                      closingDate: new Date(
                        survey.closesAt
                      ).toLocaleDateString(),
                      surveyDate: new Date(
                        survey.createdAt
                      ).toLocaleDateString(),
                      invitedUsers: survey.invitedUsers,
                      data: survey,
                    }}
                    refetch={refetch}
                  />
                </Box>
              ))}
            </Grid>
          ) : (
            <Box w="full" p="4" textAlign="center">
              <NoData label="surveys" />
            </Box>
          )
        ) : (
          <SurveyTable
            data={surveys}
            isLoading={isLoading}
            isFetching={isFetching}
            refetch={refetch}
          />
        )}
      </Box>
    </>
  );
};

export default Survey;
