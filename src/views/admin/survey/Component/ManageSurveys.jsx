import { useState } from "react";
import { Box, Grid } from "@chakra-ui/react";
import { useFetchItemsQuery } from "api/apiSlice";
import SurveyCard from "./SurveyCard";
import SurveyCardLoading from "../Loader/SurveyCardLoading";
import NoData from "components/Message/NoData";
import SurveyTable from "./SurveyTable";
import FilterSearch from "./FilterSearch";

const ManageSurveys = () => {
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

  const buildQueryParams = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role === "superAdmin" ? "superAdmin" : (user?.roles?.[0]?.roleName ?? "unknown");

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

  const handleViewChange = (newView) => {
    setView(newView);
    localStorage.setItem("surveysView", newView);
  };

  return (
    <Box
      bg="white"
      p={{ base: 3, md: 4 }}
      boxShadow="sm"
      mt={"-16px"}
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
            sx={{
              "@media (min-width: 0px)": { gridTemplateColumns: "1fr" },
              "@media (min-width: 600px)": { gridTemplateColumns: "repeat(2, 1fr)" },
              "@media (min-width: 1040px)": { gridTemplateColumns: "repeat(3, 1fr)" },
              "@media (min-width: 1564px)": { gridTemplateColumns: "repeat(4, 1fr)" },
              "@media (min-width: 2120px)": { gridTemplateColumns: "repeat(5, 1fr)" },
              "@media (min-width: 2560px)": { gridTemplateColumns: "repeat(6, 1fr)" },
              "@media (min-width: 3840px)": { gridTemplateColumns: "repeat(7, 1fr)" },
              "@media (min-width: 7680px)": { gridTemplateColumns: "repeat(8, 1fr)" },
            }}
            gap={2}
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
                    closingDate: new Date(survey.closesAt).toLocaleDateString(),
                    surveyDate: new Date(survey.createdAt).toLocaleDateString(),
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
  );
};

export default ManageSurveys;