import { useState } from "react";
import TopHeader from "./Component/TopHeader";
import FilterSearch from "./Component/FilterSearch";
import { Box, Divider } from "@chakra-ui/react";
import NavigationLinks from "./Component/NavigationLinks";
import SurveyCard from "./Component/SurveyCard";
import SurveyCardLoading from "./Loader/SurveyCardLoading";
import {
  useFetchItemsQuery,
} from "api/apiSlice";
const Survey = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [closesAt, setClosesAt] = useState(false);
  const [search, setSearch] = useState("");

  const buildQueryParams = () => {
    const params = {
      page: currentPage,
      limit: pageSize,

    };

    if (closesAt) params.closesAt = closesAt;
    if (search) params.search = search;
    if (startDate) params.after = startDate;
    if (endDate) params.before = endDate;
    return params;
  };

  const { data:surveys, isLoading, isFetching, refetch } = useFetchItemsQuery(
    { path: "/surveys", params: buildQueryParams() },
    { refetchOnMountOrArgChange: true }
  );
  return (
    <>
      <TopHeader />
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
      />

      <Box width="100%" my={4}>
        <Divider borderColor="gray.200" borderWidth="1px" opacity={1} />
      </Box>
      <NavigationLinks />

      <Box spacing={4} mt={6} display="flex" gap="10px" flexWrap={"wrap"}>
        {(isLoading || isFetching)
          ? Array.from({ length: 6 }).map((_, idx) => <SurveyCardLoading key={idx} />)
          : surveys?.doc?.surveys.length > 0 && surveys?.doc?.surveys.map((survey) => (
              <SurveyCard
                key={survey._id}
                isActive={survey.status === "active"}
                data={{
                  id: survey._id,
                  name: survey.title,
                  taken: `${survey.submittedUsers || 0}/${survey.invitedUsersCount || 0}`,
                  totalQuestions: survey.questionsCount,
                  closingDate: new Date(survey.closesAt).toLocaleDateString(),
                  surveyDate: new Date(survey.createdAt).toLocaleDateString(),
                  invitedUsers: survey.invitedUsers,
                  data: survey
                }}
                refetch={refetch}
              />
            ))
        }
      </Box>
    </>
  );
};

export default Survey;