import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Box, Button, Heading, HStack, IconButton, Text, Flex } from "@chakra-ui/react";
import { FaUserCheck } from "react-icons/fa";

import CandidateView from "views/admin/hiring/candidates/components/CandidateView";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import SearchBar from "components/search/SearchBar";
import TopPagination from "components/pagination/TopPagination";
import { constant } from "constant";

import { useDispatch, useSelector } from "react-redux";
import InterviewedTable from "./InterviewedTable";
import { addMissingFile } from "./../../../../redux/missingFilesSlice";
import InterviewResult from "./InterviewResult";
import { useNavigate } from "react-router-dom";
import useUserSession from "hooks/useUserSession";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import CustomTooltip from "components/shared/CustomTooltip";
import { useModalColors } from "hooks/useModalColors";
import RefreshButton from "components/refresh/RefreshButton";

const Interviewed = ({
  data,
  allData,
  loading,
  totalDocs,
  handleSort,
  sortConfig,
  refetch,
  totalPages,
  currentPage,
  pageSize,
  handleGotoPage,
  handlePageSizeChange,
  setAdvanceSearch,
  isRefetching,
}) => {
  const colors = useModalColors();
  const [isApplicationOpen, setApplicationOpen] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [interview, setInterview] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  const headers = [
    { key: "name", label: "Name", width: "250px" },
    { key: "email", label: "Email", width: "250px" },
    { key: "agency", label: "Agency", width: "100px" },
    { key: "position", label: "Job Role", width: "150px" },
    { key: "phone", label: "Phone No", width: "150px" },
    { key: "whatsApp", label: "WhatsApp No", width: "150px" },
    { key: "type", label: "Type", width: "150px" },
    { key: "status", label: "Status", width: "100px" },
    { key: "rounds", label: "Rounds", width: "50px" },
    { key: "percentageSocre", label: "T.Percentage", width: "150px" },
    { key: "action", label: "Action", width: "200px" },
  ];

  const dispatch = useDispatch();
  const missingFiles = useSelector((state) => state.missingFiles.missingFiles);
  const { user } = useUserSession();
  const { createUserLog } = useUserActivityLog();
  const navigate = useNavigate();

  const handleViewCV = async (resume) => {
    try {
      const pdfURL = `${constant["baseUrl"]}${resume}`;

      if (missingFiles.includes(resume)) {
        toast.error("CV not found!");
        return;
      }

      const response = await fetch(pdfURL, { method: "HEAD" });

      if (!response.ok) {
        dispatch(addMissingFile(resume));
        toast.error("CV not found!");
        return;
      }

      window.open(pdfURL, "_blank");

      createUserLog({
        userId: user?._id,
        action: "VIEW",
        entity: "Hiring",
        entityType: "Application",
        entityId: interview?.candidate._id,
        status: "success",
        message: `Candidate ${interview?.candidate.name}’s CV viewed by ${user?.fullName}.`,
      });
    } catch (error) {
      console.error("Error viewing CV:", error);
      toast.error("Failed to retrieve the CV. Please try again later.");
    }
  };

  const handleDownloadCV = async (resume) => {
    try {
      const pdfURL = `${constant["baseUrl"]}${resume}`;

      if (missingFiles.includes(resume)) {
        toast.error("CV could not be downloaded");
        return;
      }

      const response = await fetch(pdfURL, { method: "HEAD" });

      if (!response.ok) {
        dispatch(addMissingFile(resume));
        toast.error("CV could not be downloaded");
        return;
      }

      const link = document.createElement("a");
      link.href = pdfURL;
      link.download = pdfURL.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      createUserLog({
        userId: user?._id,
        action: "VIEW",
        entity: "Hiring",
        entityType: "Application",
        entityId: interview?.candidate._id,
        status: "success",
        message: `Candidate ${interview?.candidate.name}’s CV downloaded by ${user?.fullName}.`,
      });
    } catch (error) {
      console.error("Error viewing CV:", error);
      toast.error("Failed to retrieve the CV. Please try again later.");
    }
  };

  const handleViewCandidate = async (id) => {
    const interview = data.find((item) => item.candidate._id === id);
    setInterview(interview);
    setApplicationOpen(true);

    createUserLog({
      userId: user?._id,
      action: "VIEW",
      entity: "Hiring",
      entityType: "Application",
      entityId: interview.candidate._id,
      status: "success",
      message: `Candidate ${interview.candidate.name}’s details viewed by ${user?.fullName}.`,
    });
  };

  const handleViewResult = (interview) => {
    setInterview(interview);
    setInterviewId(interview._id);
    setResultModalOpen(true);
  };

  const handleSendOffer = (interviewId, offerType) => {
    if (offerType === "view") {
      navigate(
        `/hiring/interviewed-candidates/offer-letter/view/${interviewId}`,
      );
    } else {
      navigate(
        `/hiring/interviewed-candidates/offer-letter/${interviewId}?type=${offerType}`,
      );
    }
  };

  const handleSearchTermChange = (term) => {
    if (!term) {
      setIsSearch(false);
      setSearchData([]);
      return;
    }

    const filteredData = data.filter((item) =>
      item.candidate.name.toLowerCase().includes(term.toLowerCase()),
    );

    setIsSearch(true);
    setSearchData(filteredData);
  };

  const handlePageChange = (page) => {
    handleGotoPage(page);
    setIsSearch(false);
    setSearchData([]);
  };

  const onPageSizeChange = (newSize) => {
    handlePageSizeChange(newSize);
    setIsSearch(false);
    setSearchData([]);
  };

  const handleRefresh = () => {
    setIsSearch(false);
    setSearchData([]);
    refetch();
  };

  const displayData = isSearch ? searchData : data;
  const displayTotalDocs = isSearch ? searchData.length : totalDocs;
  const showPagination = !isSearch && data?.length > 0 && totalPages > 0;

  return (
    <Box w="full" p={6} bg={colors.bg} rounded="md" shadow={colors.cardShadow} border="1px solid" borderColor={colors.borderColor}>
      <Flex
        justifyContent="space-between"
        alignItems={{ base: "flex-start", md: "center" }}
        flexDirection={{ base: "column", md: "row" }}
        gap={{ base: 4, xl: 0 }}
        mb={4}
      >
        <HStack gap="2">
          <FaUserCheck color={colors.accentGold} />
          <Text fontSize="20px" color={colors.headingText} fontWeight={"bold"}>
            Interviewed Candidates
            {!isSearch && (
              <span style={{ marginLeft: "6px" }}>
                (<CountUpComponent targetNumber={displayTotalDocs || 0} />)
              </span>
            )}
            {isSearch && (
              <span style={{ marginLeft: "6px", fontSize: "14px", color: colors.mutedText }}>
                (Search results: {displayTotalDocs})
              </span>
            )}
          </Text>
        </HStack>

        <HStack
          w={{ base: "100%", md: "fit-content" }}
          justify="flex-end"
          flexDir={{ base: "column", md: "row" }}
          gap="2"
        >
          <SearchBar onSearchTermChange={handleSearchTermChange} />

          <Button
            bg={colors.accentGold}
            color={colors.headerText}
            rounded="md"
            size={"sm"}
            py={3}
            px={6}
            onClick={() => setAdvanceSearch(true)}
            _hover={{
              bg: colors.goldLight,
              transform: "translateY(-1px)",
              boxShadow: colors.goldGlow,
            }}
            _active={{ bg: colors.goldDark }}
            transition="all 0.2s ease"
          >
            Advanced Search
          </Button>
            <RefreshButton
                                label="Refresh"
                                onClick={() => handleRefresh()}
                                isLoading={loading}
                                isFetching={isRefetching}
                                size="sm"
                              />

        </HStack>
      </Flex>

      <Box mb={4}>
        <TopPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalDocs}
          itemsPerPage={pageSize}
          handlePageSize={onPageSizeChange}
          refetching={isRefetching}
          loading={loading}
        />
      </Box>

      <InterviewedTable
        headers={headers}
        data={displayData}
        handleSort={handleSort}
        sortConfig={sortConfig}
        loading={loading}
        isRefetching={isRefetching}
        handleViewResult={handleViewResult}
        handleViewCandidate={handleViewCandidate}
        handleSendOffer={handleSendOffer}
      />

      {isSearch && searchData.length > 0 && (
        <Box mt={4} textAlign="center">
          <Text fontSize="sm" color={colors.mutedText}>
            Showing {searchData.length} search result{searchData.length !== 1 ? 's' : ''}
          </Text>
          <Button
            size="xs"
            variant="link"
            onClick={() => {
              setIsSearch(false);
              setSearchData([]);
            }}
            mt={2}
            color={colors.accentGold}
            _hover={{ color: colors.goldLight }}
          >
            Clear Search
          </Button>
        </Box>
      )}

      {isApplicationOpen && (
        <CandidateView
          isOpen={isApplicationOpen}
          onClose={() => setApplicationOpen(false)}
          candidate={interview?.candidate}
          missingFiles={missingFiles}
          onViewCV={handleViewCV}
          onDownloadCV={handleDownloadCV}
          refetch={refetch}
        />
      )}

      {resultModalOpen && (
        <InterviewResult
          onClose={() => setResultModalOpen(false)}
          isOpen={resultModalOpen}
          data={interview}
          interviewId={interviewId}
          refetch={refetch}
          title="Interview Result"
        />
      )}
    </Box>
  );
};

export default Interviewed;