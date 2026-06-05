import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  useDisclosure,
  Flex,
  Text,
} from "@chakra-ui/react";
import { FaUsers } from "react-icons/fa";

import CandidateView from "views/admin/hiring/candidates/components/CandidateView";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import TopPagination from "components/pagination/TopPagination";
import ArrangeInterview from "./components/ArrangeInterview";
import ShortListedTable from "./components/ShortListedTable";
import { constant } from "constant";
import { useUpdateItemMutation } from "api/apiSlice";
import { addMissingFile } from "./../../../../redux/missingFilesSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import useUserSession from "hooks/useUserSession";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import AddShortListedNote from "../_components/AddShortListedNote";
import SearchBox from "views/admin/lead-v2/components/SearchBox";
import SearchTags from "components/shared/SearchTags";
import CustomTooltip from "components/shared/CustomTooltip";
import { useModalColors } from "hooks/useModalColors";
import RefreshButton from "components/refresh/RefreshButton";

const ShortListed = ({
  data,
  allData,
  loading,
  isFetching,
  totalDocs,
  handleSort,
  sortConfig,
  refetch,
  totalPages,
  currentPage,
  pageSize,
  handleGotoPage,
  handlePageSizeChange,
  gopageValue,
  setGopageValue,
  setAdvanceSearch,
  invitedRefetch,
  onSearchChange,
  searchTerm,
  searchTags,
  removeTag,
  clearAllTags,
  onClear,
}) => {
  const colors = useModalColors();
  const [isApplicationOpen, setApplicationOpen] = useState(false);
  const [candidate, setCandidate] = useState(null);

  const searchTermRef = useRef(searchTerm || "");

  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  const { user } = useUserSession();
  const { createUserLog } = useUserActivityLog();

  const [updateItemMuation, { isLoading: isInviting }] =
    useUpdateItemMutation();

  const headers = [
    { key: "name", label: "Name", width: "200px" },
    { key: "email", label: "Email", width: "250px" },
    { key: "agency", label: "Agency", width: "100px" },
    { key: "position", label: "Job Role", width: "150px" },
    { key: "phone", label: "Phone No", width: "150px" },
    { key: "whatsApp", label: "WhatsApp No", width: "150px" },
    { key: "createdAt", label: "Apply Date", width: "150px" },
    { key: "action", label: "Action", width: "200px" },
  ];

  const {
    isOpen: isFeedbackNoteOpen,
    onOpen: onFeedbackNoteOpen,
    onClose: onFeedbackNoteClose,
  } = useDisclosure();

  const [arrangeInterviewOpen, setArrangeInterviewOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  const toUTCString = (date) => {
    return date
      ? moment(date).utcOffset(0, true).startOf("day").toISOString()
      : null;
  };

  const handleSearchByName = () => {
    const term = searchTermRef.current.trim();
    onSearchChange?.(term);
  };

  const handleScheduleInterview = async () => {
    try {
      await updateItemMuation({
        path: `/applications/schedule-interview/${candidate._id}`,
        body: {
          interviewDate: toUTCString(selectedDate),
          interviewTime: selectedTime,
        },
      }).unwrap();

      toast.success("Invite succesfully sended");
      refetch();
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Hiring",
        entityId: candidate._id,
        status: "success",
        message: `Interview invitation sent to ${candidate.name} by ${user?.fullName}.`,
      });
    } catch (err) {
      console.log(err);
      const errorMsg =
        err?.data?.message || "Interview is not arranged, please try again.";
      toast.error(errorMsg);
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Hiring",
        entityId: candidate._id,
        status: err?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    } finally {
      setArrangeInterviewOpen(false);
      invitedRefetch();
    }
  };

  const dispatch = useDispatch();
  const missingFiles = useSelector((state) => state.missingFiles.missingFiles);

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
        entityId: candidate._id,
        status: "success",
        message: `Candidate ${candidate.name}’s CV viewed by ${user?.fullName}.`,
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
        entityId: candidate._id,
        status: "success",
        message: `Candidate ${candidate.name}’s CV downloaded by ${user?.fullName}.`,
      });
    } catch (error) {
      console.error("Error viewing CV:", error);
      toast.error("Failed to retrieve the CV. Please try again later.");
    }
  };

  const handleViewCandidate = async (id) => {
    const selectedCandidate = data.find((item) => item._id === id);
    setCandidate(selectedCandidate);
    setApplicationOpen(true);

    if (selectedCandidate) {
      createUserLog({
        userId: user?._id,
        action: "VIEW",
        entity: "Hiring",
        entityType: "Application",
        entityId: selectedCandidate?._id,
        status: "success",
        message: `Candidate ${selectedCandidate?.name}’s details viewed by ${user?.fullName}.`,
      });
    }
  };

  const handleArrangeInterview = async (id) => {
    const selectedCandidate = data.find((item) => item._id === id);
    setCandidate(selectedCandidate);
    setArrangeInterviewOpen(true);
  };

  const handleOpenFeedbackNote = (id) => {
    const selectedCandidate = data.find((item) => item._id === id);
    setCandidate(selectedCandidate);
    onFeedbackNoteOpen();
  };

  const handleClear = () => {
    searchTermRef.current = "";
    onClear?.();
  };

  return (
    <Box w="full" p={6} bg={colors.bg} rounded="md" shadow={colors.cardShadow} border="1px solid" borderColor={colors.borderColor}>
      <Flex
        justifyContent="space-between"
        alignItems={{ base: "flex-start", xl: "center" }}
        flexDirection={{ base: "column", md: "row" }}
        gap={{ base: 4, xl: 0 }}
        mb={4}
      >
        <HStack gap="2">
          <FaUsers color={colors.accentGold} />
          <Text fontSize="20px" color={colors.headingText} fontWeight={"bold"}>
            Short Listed
            <span style={{ marginLeft: "6px" }}>
              (<CountUpComponent targetNumber={totalDocs || 0} />)
            </span>
          </Text>
        </HStack>

        <Flex gap={2} alignItems="center">
          <SearchBox
            setQueryParams={() => {}}
            setAdvanceSearch={setAdvanceSearch}
            handleSearchByName={handleSearchByName}
            searchTermRef={searchTermRef}
            onClear={handleClear}
          />

        <RefreshButton
               label="Refresh"
               onClick={() => {
                searchTermRef.current = "";
                onSearchChange?.("");
                refetch();
              }}
               isLoading={isInviting}
               isFetching={isFetching}
               size="sm"
              />
        </Flex>
      </Flex>

      {searchTags.length > 0 && (
        <SearchTags
          removeTag={removeTag}
          searchTags={searchTags}
          clearAllTags={clearAllTags}
        />
      )}

      <Box display={"flex"} flexDirection={"column"} gap="4">
        <TopPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => handleGotoPage(page)}
          totalItems={totalDocs}
          itemsPerPage={pageSize}
          refetching={isFetching}
          loading={loading}
          handlePageSize={handlePageSizeChange}
        />

        <ShortListedTable
          headers={headers}
          data={data}
          handleSort={handleSort}
          sortConfig={sortConfig}
          loading={loading}
          isFetching={isFetching}
          handleViewCandidate={handleViewCandidate}
          handleArrangeInterview={handleArrangeInterview}
          handleOpenFeedbackNote={handleOpenFeedbackNote}
        />
      </Box>

      {isApplicationOpen && (
        <CandidateView
          isOpen={isApplicationOpen}
          onClose={() => setApplicationOpen(false)}
          candidate={candidate}
          missingFiles={missingFiles}
          onViewCV={handleViewCV}
          onDownloadCV={handleDownloadCV}
          refetch={refetch}
        />
      )}

      {arrangeInterviewOpen && (
        <ArrangeInterview
          isOpen={arrangeInterviewOpen}
          onClose={() => setArrangeInterviewOpen(false)}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          isLoading={isInviting}
          handleScheduleInterview={handleScheduleInterview}
        />
      )}

      {isFeedbackNoteOpen && (
        <AddShortListedNote
          applicationId={candidate?._id}
          isOpen={isFeedbackNoteOpen}
          onClose={onFeedbackNoteClose}
          refetch={refetch}
        />
      )}
    </Box>
  );
};

export default ShortListed;