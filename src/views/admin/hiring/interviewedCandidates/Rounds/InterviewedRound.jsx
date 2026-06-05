
// import { useEffect, useState, useRef } from "react";
// import { toast } from "react-toastify";
// import {
//   Box,
//   Button,
//   Heading,
//   HStack,
//   IconButton,
//   Flex,
// } from "@chakra-ui/react";
// import { FaUserCheck } from "react-icons/fa";

// import CandidateView from "views/admin/hiring/candidates/components/CandidateView";
// import CountUpComponent from "components/countUpComponent/countUpComponent";
// import TopPagination from "components/pagination/TopPagination";
// import { constant } from "constant";

// import { useDispatch, useSelector } from "react-redux";
// import { addMissingFile } from "./../../../../../redux/missingFilesSlice";
// import InterviewResult from "./../InterviewResult";
// import { useNavigate } from "react-router-dom";
// import InterviewedRoundTable from "./InterviewRoundTable";
// import useUserSession from "hooks/useUserSession";
// import { useUserActivityLog } from "hooks/useUserActivityLog";
// import SearchBox from "views/admin/lead-v2/components/SearchBox";
// import CustomTooltip from "components/shared/CustomTooltip";

// const InterviewedRound = ({
//   data,
//   allData,
//   loading,
//   totalDocs,
//   handleSort,
//   sortConfig,
//   refetch,
//   totalPages,
//   currentPage,
//   pageSize,
//   handleGotoPage,
//   handlePageSizeChange,
//   gopageValue,
//   setGopageValue,
//   setAdvanceSearch,
//   isFetching,
// }) => {
//   const [isApplicationOpen, setApplicationOpen] = useState(false);
//   const [searchData, setSearchData] = useState([]);
//   const [interview, setInterview] = useState(null);
//   const [interviewId, setInterviewId] = useState(null);
//   const [isSearch, setIsSearch] = useState(false);

//   // Search ref for SearchBox component
//   const searchTermRef = useRef("");

//   const [resultModalOpen, setResultModalOpen] = useState(false);

//   const headers = [
//     { key: "name", label: "Name", width: "250px" },
//     { key: "email", label: "Email", width: "250px" },
//     { key: "agency", label: "Agency", width: "100px" },
//     { key: "position", label: "Job Role", width: "150px" },
//     { key: "phone", label: "Phone No", width: "150px" },
//     { key: "whatsApp", label: "WhatsApp No", width: "150px" },
//     { key: "type", label: "Type", width: "150px" },
//     { key: "percentageSocre", label: "T.Percentage", width: "150px" },
//     { key: "action", label: "Action", width: "200px" },
//   ];

//   const dispatch = useDispatch();
//   const missingFiles = useSelector((state) => state.missingFiles.missingFiles);

//   const { user } = useUserSession();
//   const { createUserLog } = useUserActivityLog();

//   // Handle search from SearchBox
//   const handleSearchByName = () => {
//     const term = searchTermRef.current.trim();

//     if (!term) {
//       setIsSearch(false);
//       setSearchData([]);
//       return;
//     }

//     const candidatesToSearch = data || [];

//     const filteredData = candidatesToSearch.filter((item) =>
//       item.candidate?.name?.toLowerCase().includes(term.toLowerCase()),
//     );

//     setIsSearch(true);
//     setSearchData(filteredData);
//   };

//   const handleViewCV = async (resume) => {
//     try {
//       const pdfURL = `${constant["baseUrl"]}${resume}`;

//       if (missingFiles.includes(resume)) {
//         toast.error("CV not found!");
//         return;
//       }

//       const response = await fetch(pdfURL, { method: "HEAD" });

//       if (!response.ok) {
//         dispatch(addMissingFile(resume));
//         toast.error("CV not found!");
//         return;
//       }

//       window.open(pdfURL, "_blank");

//       createUserLog({
//         userId: user?._id,
//         action: "VIEW",
//         entity: "Hiring",
//         entityType: "Application",
//         entityId: interview?.candidate._id,
//         status: "success",
//         message: `Candidate ${interview?.candidate.name}’s CV viewed by ${user?.fullName}.`,
//       });
//     } catch (error) {
//       console.error("Error viewing CV:", error);
//       toast.error("Failed to retrieve the CV. Please try again later.");
//     }
//   };

//   const handleDownloadCV = async (resume) => {
//     try {
//       const pdfURL = `${constant["baseUrl"]}${resume}`;
//       if (missingFiles.includes(resume)) {
//         toast.error("CV could not be downloaded");
//         return;
//       }

//       const response = await fetch(pdfURL, { method: "HEAD" });

//       if (!response.ok) {
//         dispatch(addMissingFile(resume));
//         toast.error("CV could not be downloaded");
//         return;
//       }

//       const link = document.createElement("a");
//       link.href = pdfURL;
//       link.download = pdfURL.split("/").pop();
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       createUserLog({
//         userId: user?._id,
//         action: "VIEW",
//         entity: "Hiring",
//         entityType: "Application",
//         entityId: interview?.candidate._id,
//         status: "success",
//         message: `Candidate ${interview?.candidate.name}’s CV downloaded by ${user?.fullName}.`,
//       });
//     } catch (error) {
//       console.error("Error viewing CV:", error);
//       toast.error("Failed to retrieve the CV. Please try again later.");
//     }
//   };

//   const handleViewCandidate = async (id) => {
//     const selectedInterview = data.find((item) => item.candidate._id === id);
//     setInterview(selectedInterview);
//     setApplicationOpen(true);

//     createUserLog({
//       userId: user?._id,
//       action: "VIEW",
//       entity: "Hiring",
//       entityType: "Application",
//       entityId: selectedInterview.candidate._id,
//       status: "success",
//       message: `Candidate ${selectedInterview.candidate.name}’s details viewed by ${user?.fullName}.`,
//     });
//   };

//   const handleViewResult = (interview) => {
//     setInterview(interview);
//     setInterviewId(interview._id);
//     setResultModalOpen(true);
//   };

//   const navigate = useNavigate();

//   const handleSendOffer = (interviewId, offerType) => {
//     navigate(
//       `/hiring/interviewed-candidates/offer-letter/${interviewId}?type=${offerType}`,
//     );
//   };

//   // Get the data to display (search results or original data)
//   const displayData = isSearch ? searchData : data;

//   return (
//     <Box w="full" p={6} bg="white" rounded="md" shadow="sm">
//       {/* Header with Search and Actions */}
//       <Flex
//         justifyContent="space-between"
//         alignItems={{ base: "flex-start", xl: "center" }}
//         flexDirection={{ base: "column", md: "row" }}
//         gap={{ base: 4, xl: 0 }}
//         mb={4}
//       >
//         <HStack gap="2">
//           <FaUserCheck />
//           <Heading size="20px" color="gray.800" fontWeight={"bold"}>
//             Multi-Round Interviewed
//             <span style={{ marginLeft: "6px" }}>
//               (
//               {
//                 <CountUpComponent
//                   targetNumber={isSearch ? searchData.length : totalDocs || 0}
//                 />
//               }
//               )
//             </span>
//           </Heading>
//         </HStack>

//         <Flex gap={2} alignItems="center">
//           {/* Search Box - This includes Advanced Search button inside */}
//           <SearchBox
//             setQueryParams={() => {}}
//             setAdvanceSearch={setAdvanceSearch}
//             handleSearchByName={handleSearchByName}
//             searchTermRef={searchTermRef}
//           />

//           {/* Refresh Button */}
//
//         </Flex>
//       </Flex>

//       <Box display={"flex"} flexDirection={"column"} gap="4">
//         {/* Top Pagination */}
//         <TopPagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={(page) => handleGotoPage(page)}
//           totalItems={isSearch ? searchData.length : totalDocs}
//           itemsPerPage={pageSize}
//           refetching={isFetching}
//           loading={loading}
//           handlePageSize={handlePageSizeChange}
//         />

//         {/* Table */}
//         <InterviewedRoundTable
//           headers={headers}
//           data={displayData}
//           handleSort={handleSort}
//           sortConfig={sortConfig}
//           loading={loading}
//           handleViewResult={handleViewResult}
//           handleViewCandidate={handleViewCandidate}
//           handleSendOffer={handleSendOffer}
//           refetch={refetch}
//           isFetching={isFetching}
//         />
//       </Box>

//       {/* Modals */}
//       {isApplicationOpen && (
//         <CandidateView
//           isOpen={isApplicationOpen}
//           onClose={() => setApplicationOpen(false)}
//           candidate={interview?.candidate}
//           missingFiles={missingFiles}
//           onViewCV={handleViewCV}
//           onDownloadCV={handleDownloadCV}
//           refetch={refetch}
//         />
//       )}

//       {resultModalOpen && (
//         <InterviewResult
//           onClose={() => setResultModalOpen(false)}
//           isOpen={resultModalOpen}
//           data={interview}
//           interviewId={interviewId}
//           refetch={refetch}
//           mode="running"
//           title="Previous Result"
//         />
//       )}
//     </Box>
//   );
// };

// export default InterviewedRound;


import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Flex,
  Text,
} from "@chakra-ui/react";
import { FaUserCheck } from "react-icons/fa";

import CandidateView from "views/admin/hiring/candidates/components/CandidateView";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import TopPagination from "components/pagination/TopPagination";
import { constant } from "constant";

import { useDispatch, useSelector } from "react-redux";
import { addMissingFile } from "./../../../../../redux/missingFilesSlice";
import InterviewResult from "./../InterviewResult";
import { useNavigate } from "react-router-dom";
import InterviewedRoundTable from "./InterviewRoundTable";
import useUserSession from "hooks/useUserSession";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import SearchBox from "views/admin/lead-v2/components/SearchBox";
import CustomTooltip from "components/shared/CustomTooltip";
import { useModalColors } from "hooks/useModalColors";
import RefreshButton from "components/refresh/RefreshButton";

const InterviewedRound = ({
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
  gopageValue,
  setGopageValue,
  setAdvanceSearch,
  isFetching,
}) => {
  const colors = useModalColors();
  const [isApplicationOpen, setApplicationOpen] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [interview, setInterview] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  const [isSearch, setIsSearch] = useState(false);

  const searchTermRef = useRef("");

  const [resultModalOpen, setResultModalOpen] = useState(false);

  const headers = [
    { key: "name", label: "Name", width: "250px" },
    { key: "email", label: "Email", width: "250px" },
    { key: "agency", label: "Agency", width: "100px" },
    { key: "position", label: "Job Role", width: "150px" },
    { key: "phone", label: "Phone No", width: "150px" },
    { key: "whatsApp", label: "WhatsApp No", width: "150px" },
    { key: "type", label: "Type", width: "150px" },
    { key: "percentageSocre", label: "T.Percentage", width: "150px" },
    { key: "action", label: "Action", width: "200px" },
  ];

  const dispatch = useDispatch();
  const missingFiles = useSelector((state) => state.missingFiles.missingFiles);

  const { user } = useUserSession();
  const { createUserLog } = useUserActivityLog();

  const handleSearchByName = () => {
    const term = searchTermRef.current.trim();

    if (!term) {
      setIsSearch(false);
      setSearchData([]);
      return;
    }

    const candidatesToSearch = data || [];

    const filteredData = candidatesToSearch.filter((item) =>
      item.candidate?.name?.toLowerCase().includes(term.toLowerCase()),
    );

    setIsSearch(true);
    setSearchData(filteredData);
  };

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
    const selectedInterview = data.find((item) => item.candidate._id === id);
    setInterview(selectedInterview);
    setApplicationOpen(true);

    createUserLog({
      userId: user?._id,
      action: "VIEW",
      entity: "Hiring",
      entityType: "Application",
      entityId: selectedInterview.candidate._id,
      status: "success",
      message: `Candidate ${selectedInterview.candidate.name}’s details viewed by ${user?.fullName}.`,
    });
  };

  const handleViewResult = (interview) => {
    setInterview(interview);
    setInterviewId(interview._id);
    setResultModalOpen(true);
  };

  const navigate = useNavigate();

  const handleSendOffer = (interviewId, offerType) => {
    navigate(
      `/hiring/interviewed-candidates/offer-letter/${interviewId}?type=${offerType}`,
    );
  };

  const displayData = isSearch ? searchData : data;

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
          <FaUserCheck color={colors.accentGold} />
          <Text fontSize="20px" color={colors.headingText} fontWeight={"bold"}>
            Multi-Round Interviewed
            <span style={{ marginLeft: "6px" }}>
              (
              {
                <CountUpComponent
                  targetNumber={isSearch ? searchData.length : totalDocs || 0}
                />
              }
              )
            </span>
          </Text>
        </HStack>

        <Flex gap={2} alignItems="center">
          <SearchBox
            setQueryParams={() => {}}
            setAdvanceSearch={setAdvanceSearch}
            handleSearchByName={handleSearchByName}
            searchTermRef={searchTermRef}
          />

 <RefreshButton
                                label="Refresh"
                                 onClick={() => {
                setIsSearch(false);
                setSearchData([]);
                searchTermRef.current = "";
                refetch();
              }}
                                isLoading={loading}
                                isFetching={isFetching}
                                size="sm"
                              />

        </Flex>
      </Flex>

      <Box display={"flex"} flexDirection={"column"} gap="4">
        <TopPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => handleGotoPage(page)}
          totalItems={isSearch ? searchData.length : totalDocs}
          itemsPerPage={pageSize}
          refetching={isFetching}
          loading={loading}
          handlePageSize={handlePageSizeChange}
        />

        <InterviewedRoundTable
          headers={headers}
          data={displayData}
          handleSort={handleSort}
          sortConfig={sortConfig}
          loading={loading}
          handleViewResult={handleViewResult}
          handleViewCandidate={handleViewCandidate}
          handleSendOffer={handleSendOffer}
          refetch={refetch}
          isFetching={isFetching}
        />
      </Box>

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
          mode="running"
          title="Previous Result"
        />
      )}
    </Box>
  );
};

export default InterviewedRound;