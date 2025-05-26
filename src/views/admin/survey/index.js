import { useState } from "react";
import TopHeader from "./Component/TopHeader";
import FilterSearch from "./Component/FilterSearch";
import { Box, Divider, VStack } from "@chakra-ui/react";
import NavigationLinks from "./Component/NavigationLinks";
import SurveyCard from "./Component/SurveyCard";

const Survey = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const surveyData = [
    {
      id: 1,
      name: "Customer Satisfaction Q1 2023 dfsfsdfdsdfsfdsfsdfsfdsdfdsfsddfsfs dfdsfsfdsfsfdsfdsfdsfsdfsddfssfsdf",
      taken: "10/20",
      totalQuestions: 10,
      closingDate: "3/10/23",
      surveyDate: "2/15/23",
    },
    {
      id: 2,
      name: "Product Feedback Survey",
      taken: "15/30",
      totalQuestions: 12,
      closingDate: "3/15/23",
      surveyDate: "2/20/23",
    },
    {
      id: 3,
      name: "Employee Engagement",
      taken: "25/50",
      totalQuestions: 15,
      closingDate: "3/20/23",
      surveyDate: "2/25/23",
    },
  ];
  return (
    <>
      <TopHeader />
      <FilterSearch
        currentPage={currentPage}
        totalPages={10}
        onPageChange={setCurrentPage}
        totalItems={100}
        pageSize={pageSize}
        setPageSize={setPageSize}
        handlePageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        isLoading={false}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      <Box width="100%" my={4}>
        <Divider borderColor="gray.200" borderWidth="1px" opacity={1} />
      </Box>
      <NavigationLinks />

      {/* Survey Cards Section */}
      <Box spacing={4} mt={6} display="flex" gap="35px" flexWrap={"wrap"}>
        {surveyData.map((survey) => (
          <SurveyCard key={survey.id} data={survey} isActive={true} />
        ))}
      </Box>
    </>
  );
};

export default Survey;
