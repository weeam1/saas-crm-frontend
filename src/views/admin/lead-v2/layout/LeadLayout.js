// import React, {
//   lazy,
//   memo,
//   Suspense,
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import { shallowEqual, useSelector } from "react-redux";
// import { Box, Button, Flex, VStack } from "@chakra-ui/react";
// import { BiX } from "react-icons/bi";
// import { DeleteIcon } from "@chakra-ui/icons";
// import useFilteredQueryParams from "../useFilteredQueryParams";
// import ErrorMessage from "components/Message/ErrorMessage";
// import { usePermissions } from "hooks/usePermissions";

// import { buttonStyle } from "utils/btn";
// import AdvancedSearchModal from "../components/AdvancedSearchModal";
// import SearchBox from "../components/SearchBox";
// import LeadsModals from "../components/LeadsModals";
// import DateFilter from "../components/DateFilter";
// // import Pagination from '../components/Pagination';
// import QuickFilterModal from "../components/QuickFilterModal";
// import DisplayQuickFilter from "../components/DisplayQuickFilter";
// import Loader from "components/loading/Loader";
// import TopPagination from "components/pagination/TopPagination";
// import { useSearchParams } from "react-router-dom";
// import SearchTags from "components/shared/SearchTags";

// const LeadTableView = lazy(() => import("./table"));
// const LeadGridView = lazy(() => import("./grid"));

// const LeadsLayout = memo(
//   ({
//     layoutView,
//     data,
//     pageSize,
//     setPageSize,
//     currentPage,
//     setCurrentPage,
//     leadsError,
//     leadsLoading,
//     leadsRefetching,
//     refreshLeads,
//     addLead,
//     setAddLead,
//     selectedValues,
//     setSelectedValues,
//     setSelectedLeads,
//     selectAllChecked,
//     setSelectAllChecked,
//     dateTimeIsOpen,
//     dateTimeOnClose,
//     setCurrentPageSelection,
//     currentPageSelection,
//     manageColumnsOpen,
//     openManageColumns,
//     closeManageColumns,
//   }) => {
//     const { hasPermission } = usePermissions();

//     const {
//       // currentPage,
//       // setCurrentPage,
//       // pageSize,
//       // setPageSize,
//       leads,
//       queryParams,
//       setQueryParams,
//       setSearchQueryParams,
//       searchTags,
//       setSearchTags,
//       searchClear,
//       setSearchClear,
//       clearSearchParams,
//       setRefetchLoading,
//     } = useFilteredQueryParams();

//     // const leads = useSelector(
//     // 	(state) => state.leads,
//     // 	(prev, next) => prev === next
//     // );

//     // const leads = useSelector((state) => state.leads, shallowEqual);

//     const [isLoaded, setIsLoaded] = useState(false);
//     // const [refetchLoading, setRefetchLoading] = useState(false);

//     const [selectedStatus, setSelectedStatus] = useState([]);
//     const [selectedMstatus, setSelectedMstatus] = useState([]);

//     const statusOptions = [
//       { value: "active", label: "Interested" },
//       { value: "sold", label: "Sold" },
//       { value: "not_interested", label: "Not Interested" },
//       { value: "reassigned", label: "Reassigned" },
//       { value: "new", label: "New" },
//       { value: "no_answer", label: "No Answer" },
//       { value: "unreachable", label: "Unreachable" },
//       { value: "callback", label: "Callback" },
//       { value: "voice_mail", label: "Voice Mail" },
//       { value: "wrong_number", label: "Wrong Number" },
//       { value: "waiting", label: "Waiting" },
//       { value: "follow_up", label: "Follow Up" },
//       { value: "meeting", label: "Meeting" },
//       { value: "follow_up_after_meeting", label: "Follow Up After Meeting" },
//       { value: "deal", label: "Deal" },
//       { value: "deal_out", label: "Deal Out" },
//       { value: "whatsapp_send", label: "Whatsapp Send" },
//       { value: "whatsapp_rec", label: "Whatsapp Rec" },
//       { value: "will_attend_the_show", label: "Will Attend the Show" },
//       { value: "attended_the_show", label: "Attended the Show" },
//       { value: "junk", label: "Junk" },
//       { value: "shift_project", label: "Shift Project" },
//       { value: "broker", label: "Broker" },
//       { value: "request", label: "Request" },
//     ];

//     const mstatusOptions = [
//       { value: "interested", label: "Interested" },
//       { value: "not_interested", label: "Not Interested" },
//       { value: "no_response", label: "No Response" },
//       { value: "interested_seller", label: "Interested Seller" },
//       { value: "interested_buyer", label: "Interested Buyer" },
//       { value: "hot", label: "Hot" },
//       { value: "secondary_request", label: "Secondary request" },
//       { value: "show", label: "Show" },
//       { value: "junk", label: "Junk" },
//       { value: "deal", label: "Deal" },
//       { value: "change_agent", label: "Change Agent" },
//     ];

//     useEffect(() => {
//       if (leadsLoading) {
//         setIsLoaded(false);
//       } else {
//         const timer = setTimeout(() => setIsLoaded(true), 700);
//         return () => clearTimeout(timer);
//       }
//     }, [leadsLoading, currentPage]);

//     // useEffect(() => {
//     // 	if (leadsRefetching) {
//     // 		setRefetchLoading(true);
//     // 	} else {
//     // 		const timer = setTimeout(() => setRefetchLoading(false), 2000);
//     // 		return () => clearTimeout(timer);
//     // 	}
//     // }, [leadsRefetching, refetchLoading, setRefetchLoading]);

//     const [viewLead, setViewLead] = useState({
//       isOpen: false,
//       lid: null,
//       tab: "basic",
//     });
//     const [editLead, setEditLead] = useState(false);
//     const [editSecondary, setEditSecondary] = useState(false);
//     const [viewPhoneHistory, setViewPhoneHistory] = useState({
//       modal: false,
//       leadId: null,
//     });
//     const [leadDetails, setLeadDetails] = useState(null);
//     const [sendEmail, setSendEmail] = useState(false);
//     const [isLeadCycle, setIsLeadCycle] = useState(null);
//     const [deleteLead, setDeleteLead] = useState(false);
//     const [leadAddtionalInfo, setLeadAddtionalInfo] = useState(false);

//     const [advanceSearch, setAdvanceSearch] = useState(false);

//     // const [formValues, setFormValues] = useState([]);
//     const [isFormReset, setIsFormReset] = useState(false);
//     // const [searchTags, setSearchTags] = useState([]);
//     // const [searchClear, setSearchClear] = useState(false);
//     // const [searchTerm, setSearchTerm] = useState('');

//     const searchTermRef = useRef("");

//     const [searchParams, setSearchParams] = useSearchParams();
//     let isLeadParam = searchParams.get("lead") || searchParams.get("invite");

//     const removeTag = (key) => {
//       const removedTag = searchTags.find((tag) => tag.key === key);
//       if (!removedTag) return;

//       const updatedTags = searchTags.filter((tag) => tag.key !== key);
//       setSearchTags(updatedTags);

//       // Check if it's a status tag by looking at originalKey
//       if (removedTag.originalKey === "status") {
//         handleRemoveStatus(removedTag.value);
//         return;
//       }

//       if (removedTag.originalKey === "mstatus") {
//         handleRemoveMstatus(removedTag.value);
//         return;
//       }

//       // Handle advanced search tags
//       const updatedParams = updatedTags.reduce(
//         (acc, { originalKey, value }) => {
//           acc[originalKey] = value;
//           return acc;
//         },
//         {},
//       );

//       const newQueryParams = {
//         advancedSearch: JSON.stringify(updatedParams),
//         page: 1,
//         limit: pageSize,
//       };

//       setQueryParams(newQueryParams);
//       setCurrentPage(1);
//       setRefetchLoading(true);
//     };

//     const clearAllTags = () => {
//       setSearchTags([]);

//       // Clear both advanced search and status filters
//       const newQueryParams = {
//         advancedSearch: JSON.stringify({}),
//         statusFilters: JSON.stringify({}),
//         page: 1,
//         limit: pageSize,
//       };

//       setQueryParams(newQueryParams);
//       setCurrentPage(1);
//       setRefetchLoading(true);
//       setSearchClear(false);

//       // Clear status states
//       setSelectedStatus([]);
//       setSelectedMstatus([]);
//     };

//     const handleClear = () => {
//       if (isLeadParam) {
//         const newParams = new URLSearchParams(searchParams);
//         newParams.delete("lead");
//         newParams.delete("invite");
//         setSearchParams(newParams);
//       }

//       // for selected leads
//       if (searchTags?.length === 0) {
//         setSelectedLeads([]);
//         setSelectedValues([]);
//         setCurrentPageSelection([]);
//         setSearchClear(false);
//         return;
//       }

//       clearAllTags(); // Use clearAllTags instead of manual clearing
//       searchTermRef.current = "";
//       const searchInput = document.getElementById("searchInput");
//       if (searchInput) {
//         searchInput.value = "";
//       }
//       setIsFormReset(true);
//     };
//     useEffect(() => {
//       if (queryParams?.statusFilters) {
//         let parsedFilters;
//         try {
//           parsedFilters =
//             typeof queryParams.statusFilters === "string"
//               ? JSON.parse(queryParams.statusFilters)
//               : queryParams.statusFilters;
//         } catch (err) {
//           console.error("Invalid statusFilters JSON:", err);
//           return;
//         }

//         const { mainStatuses, statuses } = parsedFilters;

//         if (Array.isArray(statuses)) {
//           setSelectedStatus(statuses);
//         }
//         if (Array.isArray(mainStatuses)) {
//           setSelectedMstatus(mainStatuses);
//         }

//         // Create tags for status filters
//         const statusTags = [];

//         // Add status tags
//         if (Array.isArray(statuses) && statuses.length > 0) {
//           statuses.forEach((status) => {
//             const statusLabel =
//               statusOptions.find((opt) => opt.value === status)?.label ||
//               status;
//             statusTags.push({
//               key: "Status", // ← Changed from `status-${status}` to "Status"
//               value: statusLabel,
//               originalKey: "status",
//               uniqueKey: `status-${status}`, // Add unique key for React
//             });
//           });
//         }

//         // Add main status tags
//         if (Array.isArray(mainStatuses) && mainStatuses.length > 0) {
//           mainStatuses.forEach((mstatus) => {
//             const mstatusLabel =
//               mstatusOptions.find((opt) => opt.value === mstatus)?.label ||
//               mstatus;
//             statusTags.push({
//               key: "Main Status", // ← Changed from `mstatus-${mstatus}` to "Main Status"
//               value: mstatusLabel,
//               originalKey: "mstatus",
//               uniqueKey: `mstatus-${mstatus}`, // Add unique key for React
//             });
//           });
//         }

//         setSearchTags(statusTags);
//         setSearchClear(statusTags.length > 0);
//       } else {
//         setSelectedStatus([]);
//         setSelectedMstatus([]);
//       }
//     }, [queryParams?.statusFilters]);
//     // build clean filters
//     const buildFilters = (statusesArr, mStatusesArr) => {
//       const filters = {};
//       if (statusesArr.length > 0) filters.statuses = statusesArr;
//       if (mStatusesArr.length > 0) filters.mainStatuses = mStatusesArr;
//       return filters;
//     };

//     // Status handler
//     const handleStatusChange = (value, isChecked) => {
//       setSelectedStatus((prev) => {
//         const updated = isChecked
//           ? [...prev, value]
//           : prev.filter((item) => item !== value);

//         setSearchQueryParams({
//           page: 1,
//           statusFilters: buildFilters(updated, selectedMstatus),
//         });

//         setRefetchLoading(true);
//         return updated;
//       });
//     };

//     // MStatus handler
//     const handleMstatusChange = (value, isChecked) => {
//       setSelectedMstatus((prev) => {
//         const updated = isChecked
//           ? [...prev, value]
//           : prev.filter((item) => item !== value);

//         setSearchQueryParams({
//           page: 1,
//           statusFilters: buildFilters(selectedStatus, updated),
//         });

//         setRefetchLoading(true);
//         return updated;
//       });
//     };

//     //  Remove Status
//     const handleRemoveStatus = (status) => {
//       setSelectedStatus((prev) => {
//         const updated = prev.filter((item) => item !== status);

//         setSearchQueryParams({
//           page: 1,
//           statusFilters: buildFilters(updated, selectedMstatus),
//         });

//         setRefetchLoading(true);
//         return updated;
//       });
//     };

//     // Remove MStatus
//     const handleRemoveMstatus = (mstatus) => {
//       setSelectedMstatus((prev) => {
//         const updated = prev.filter((item) => item !== mstatus);

//         setSearchQueryParams({
//           page: 1,
//           statusFilters: buildFilters(selectedStatus, updated),
//         });

//         setRefetchLoading(true);
//         return updated;
//       });
//     };

//     const handleSearchByName = useCallback(() => {
//       // const term = searchTermRef.current.trim();
//       const term = searchTermRef.current.trim().replace(/^\+/, "");

//       if (!term) return;

//       setSearchClear(true);
//       // setSearchTags([`search: ${term}`]);

//       setSearchQueryParams({ search: term, page: 1, pageSize });

//       // setQueryParams((prev) => ({
//       // 	...prev,
//       // 	page: 1,
//       // 	search: term,
//       // }));

//       setRefetchLoading(true);
//     }, [setQueryParams, setRefetchLoading]);

//     // Handle page changes
//     const handlePageChange = (page) => {
//       setCurrentPageSelection((prev) => ({
//         ...prev,
//         [currentPage]: {
//           selectAllChecked,
//           selectedValues: selectedValues.filter((id) =>
//             leads?.doc?.some((lead) => lead._id === id),
//           ),
//         },
//       }));

//       if (currentPageSelection[page]) {
//         setSelectAllChecked(currentPageSelection[page].selectAllChecked);
//         setSelectedValues((prev) => [
//           ...new Set([...prev, ...currentPageSelection[page].selectedValues]),
//         ]);
//       } else {
//         setSelectAllChecked(false);
//       }

//       setCurrentPage((prevPage) => {
//         if (prevPage === page) return prevPage;
//         setRefetchLoading(true);
//         return page;
//       });
//     };

//     const handlePageSize = (newPageSize) => {
//       if (newPageSize !== pageSize) {
//         setPageSize(newPageSize);
//         setCurrentPage(1);
//         setRefetchLoading(true);
//       }
//     };

//     const commonProps = {
//       isLoaded,
//       leadsRefetching,
//       leadsLoading,
//       refreshLeads,
//       setLeadDetails,
//       setViewLead,
//       queryParams,
//       setEditLead,
//       setAddLead,
//       editSecondary,
//       setEditSecondary,
//       setSendEmail,
//       selectedValues,
//       setSelectedValues,
//       setSelectedLeads,
//       setDeleteLead,
//       setSelectAllChecked,
//       selectAllChecked,
//       setViewPhoneHistory,
//       setLeadAddtionalInfo,
//       setIsLeadCycle,
//       leadAddtionalInfo,
//     };

//     const leadDataLayout = (
//       <Suspense
//         fallback={
//           <VStack h="80vh" justifyContent="center">
//             <Loader />
//           </VStack>
//         }
//       >
//         {layoutView === "grid" ? (
//           <LeadGridView {...commonProps} />
//         ) : (
//           <LeadTableView {...commonProps} />
//         )}
//       </Suspense>
//     );

//     // Convert advancedSearch params to tags when component loads or queryParams change
//     useEffect(() => {
//       if (queryParams?.advancedSearch) {
//         try {
//           const advancedSearchParams =
//             typeof queryParams.advancedSearch === "string"
//               ? JSON.parse(queryParams.advancedSearch)
//               : queryParams.advancedSearch;

//           if (
//             advancedSearchParams &&
//             Object.keys(advancedSearchParams).length > 0
//           ) {
//             const tags = [];

//             Object.entries(advancedSearchParams).forEach(([key, value]) => {
//               const label = key.charAt(0).toUpperCase() + key.slice(1);

//               if (Array.isArray(value)) {
//                 value.forEach((v) => {
//                   tags.push({
//                     key: `${key}-${v}`, // unique key
//                     label,
//                     value: v,
//                     originalKey: key,
//                   });
//                 });
//               } else {
//                 tags.push({
//                   key: `${key}-${value}`,
//                   label,
//                   value,
//                   originalKey: key,
//                 });
//               }
//             });

//             setSearchTags(tags);
//             setSearchClear(true);
//           } else {
//             setSearchTags([]);
//             setSearchClear(false);
//           }
//         } catch (err) {
//           console.error("Error parsing advancedSearch:", err);
//           setSearchTags([]);
//           setSearchClear(false);
//         }
//       } else {
//         setSearchTags([]);
//         setSearchClear(false);
//       }
//     }, [queryParams?.advancedSearch]); // Only run when advancedSearch changes

//     return (
//       <Box>
//         {/* Manage Columns Button */}
//         <Flex
//           gap={2}
//           flexDir={{ base: "column", md: "row" }}
//           alignItems={{ base: "stretch", md: "normal" }}
//         >
//           {/* Display selected status/mstatus buttons */}
//           {(selectedStatus.length > 0 || selectedMstatus.length > 0) && (
//             <DisplayQuickFilter
//               selectedStatus={selectedStatus}
//               selectedMstatus={selectedMstatus}
//               statusOptions={statusOptions}
//               mstatusOptions={mstatusOptions}
//               onRemoveStatus={handleRemoveStatus}
//               onRemoveMstatus={handleRemoveMstatus}
//             />
//           )}
//         </Flex>
//         <Flex
//           width="full"
//           justifyContent="space-between"
//           alignItems="center"
//           gap="2"
//           sx={{
//             flexDirection: {
//               base: "column",
//             },
//             "@media (min-width: 1695px)": {
//               flexDirection: "row",
//             },
//           }}
//           // flexDirection={{ base: 'column', xl: 'row' }}
//         >
//           {/* Pagination */}
//           {/* <Pagination
// 						currentPage={data?.currentPage ?? currentPage}
// 						totalPages={data?.totalPages ?? ''}
// 						onPageChange={handlePageChange}
// 						totalItems={data?.totalLeads ?? ''}
// 						itemsPerPage={pageSize}
// 						setPageSize={setPageSize}
// 						refetching={leadsRefetching}
// 						loading={leadsLoading}
// 						handlePageSize={handlePageSize}
// 					/> */}

//           <TopPagination
//             currentPage={queryParams?.page || currentPage}
//             totalPages={data?.totalPages ?? ""}
//             totalItems={data?.totalLeads ?? ""}
//             itemsPerPage={queryParams?.pageSize || pageSize}
//             refetching={leadsRefetching}
//             loading={leadsLoading}
//             onPageChange={handlePageChange}
//             handlePageSize={handlePageSize}
//             maximumPageSize={20}
//           />

//           {/* Search Box */}
//           <SearchBox
//             setQueryParams={setQueryParams}
//             setAdvanceSearch={setAdvanceSearch}
//             handleSearchByName={handleSearchByName}
//             searchTermRef={searchTermRef}
//             onClear={handleClear}
//           />
//         </Flex>

//         {/* Search tags */}
//         {searchClear && searchTags && searchTags.length > 0 && (
//           <SearchTags
//             searchTags={searchTags}
//             removeTag={removeTag}
//             clearAllTags={clearAllTags}
//           />
//         )}

//         <Box height="2px" my={4} bg="softGray.50" />

//         {leadsError ? (
//           <ErrorMessage
//             message={leadsError?.data?.message || "Something went wrong!"}
//           />
//         ) : (
//           leadDataLayout
//         )}

//         {/* Modals */}
//         <LeadsModals
//           refetchData={refreshLeads}
//           viewLead={viewLead}
//           setViewLead={setViewLead}
//           editLead={editLead}
//           setEditLead={setEditLead}
//           editSecondary={editSecondary}
//           setEditSecondary={setEditSecondary}
//           lead={leadDetails}
//           addLead={addLead}
//           setAddLead={setAddLead}
//           sendEmail={sendEmail}
//           setSendEmail={setSendEmail}
//           selectedValues={selectedValues}
//           setSelectedValues={setSelectedValues}
//           deleteLead={deleteLead}
//           setDeleteLead={setDeleteLead}
//           viewPhoneHistory={viewPhoneHistory}
//           setViewPhoneHistory={setViewPhoneHistory}
//           setLeadAddtionalInfo={setLeadAddtionalInfo}
//           leadAddtionalInfo={leadAddtionalInfo}
//           isLeadCycle={isLeadCycle}
//           setIsLeadCycle={setIsLeadCycle}
//         />

//         {/* Date time filter */}
//         {dateTimeIsOpen && (
//           <DateFilter
//             setQueryParams={setQueryParams}
//             setRefetchLoading={setRefetchLoading}
//             setCurrentPage={setCurrentPage}
//             onClose={dateTimeOnClose}
//             isOpen={dateTimeIsOpen}
//             setSearchClear={setSearchClear}
//             setSearchTags={setSearchTags}
//             setSearchQueryParams={setSearchQueryParams}
//           />
//         )}

//         {/* Advance filter */}
//         {advanceSearch && (
//           <AdvancedSearchModal
//             advanceSearch={advanceSearch}
//             setAdvanceSearch={setAdvanceSearch}
//             setQueryParams={setQueryParams}
//             setGetTagValues={setSearchTags}
//             setSearchClear={setSearchClear}
//             handleClear={handleClear}
//             isFormReset={isFormReset}
//             setIsFormReset={setIsFormReset}
//             setRefetchLoading={setRefetchLoading}
//             setSearchQueryParams={setSearchQueryParams}
//           />
//         )}
//         {/* Manage Columns Modal */}
//         <QuickFilterModal
//           isOpen={manageColumnsOpen}
//           onClose={closeManageColumns}
//           statusOptions={statusOptions}
//           mstatusOptions={mstatusOptions}
//           selectedStatus={selectedStatus}
//           selectedMstatus={selectedMstatus}
//           onStatusChange={handleStatusChange}
//           onMstatusChange={handleMstatusChange}
//           setQueryParams={setQueryParams}
//           setRefetchLoading={setRefetchLoading}
//           setSelectedStatus={setSelectedStatus}
//           setSelectedMstatus={setSelectedMstatus}
//         />
//       </Box>
//     );
//   },
// );

// LeadsLayout.displayName = "LeadsLayout";

// export default LeadsLayout;

import React, {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { shallowEqual, useSelector } from "react-redux";
import { Box, Button, Flex, VStack } from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { DeleteIcon } from "@chakra-ui/icons";
import useFilteredQueryParams from "../useFilteredQueryParams";
import ErrorMessage from "components/Message/ErrorMessage";
import { usePermissions } from "hooks/usePermissions";

import { buttonStyle } from "utils/btn";
import AdvancedSearchModal from "../components/AdvancedSearchModal";
import SearchBox from "../components/SearchBox";
import LeadsModals from "../components/LeadsModals";
import DateFilter from "../components/DateFilter";
// import Pagination from '../components/Pagination';
import QuickFilterModal from "../components/QuickFilterModal";
import DisplayQuickFilter from "../components/DisplayQuickFilter";
import Loader from "components/loading/Loader";
import TopPagination from "components/pagination/TopPagination";
import { useSearchParams } from "react-router-dom";
import SearchTags from "components/shared/SearchTags";

const LeadTableView = lazy(() => import("./table"));
const LeadGridView = lazy(() => import("./grid"));

const LeadsLayout = memo(
  ({
    layoutView,
    data,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    leadsError,
    leadsLoading,
    leadsRefetching,
    refreshLeads,
    addLead,
    setAddLead,
    selectedValues,
    setSelectedValues,
    setSelectedLeads,
    selectAllChecked,
    setSelectAllChecked,
    dateTimeIsOpen,
    dateTimeOnClose,
    setCurrentPageSelection,
    currentPageSelection,
    manageColumnsOpen,
    openManageColumns,
    closeManageColumns,
  }) => {
    const { hasPermission } = usePermissions();

    const {
      leads,
      queryParams,
      setQueryParams,
      setSearchQueryParams,
      searchTags,
      setSearchTags,
      searchClear,
      setSearchClear,
      clearSearchParams,
      setRefetchLoading,
    } = useFilteredQueryParams();

    const [isLoaded, setIsLoaded] = useState(false);

    const [selectedStatus, setSelectedStatus] = useState([]);
    const [selectedMstatus, setSelectedMstatus] = useState([]);

    const statusOptions = [
      { value: "active", label: "Interested" },
      { value: "sold", label: "Sold" },
      { value: "not_interested", label: "Not Interested" },
      { value: "reassigned", label: "Reassigned" },
      { value: "new", label: "New" },
      { value: "no_answer", label: "No Answer" },
      { value: "unreachable", label: "Unreachable" },
      { value: "callback", label: "Callback" },
      { value: "voice_mail", label: "Voice Mail" },
      { value: "wrong_number", label: "Wrong Number" },
      { value: "waiting", label: "Waiting" },
      { value: "follow_up", label: "Follow Up" },
      { value: "meeting", label: "Meeting" },
      { value: "follow_up_after_meeting", label: "Follow Up After Meeting" },
      { value: "deal", label: "Deal" },
      { value: "deal_out", label: "Deal Out" },
      { value: "whatsapp_send", label: "Whatsapp Send" },
      { value: "whatsapp_rec", label: "Whatsapp Rec" },
      { value: "will_attend_the_show", label: "Will Attend the Show" },
      { value: "attended_the_show", label: "Attended the Show" },
      { value: "junk", label: "Junk" },
      { value: "shift_project", label: "Shift Project" },
      { value: "broker", label: "Broker" },
      { value: "request", label: "Request" },
    ];

    const mstatusOptions = [
      { value: "interested", label: "Interested" },
      { value: "not_interested", label: "Not Interested" },
      { value: "no_response", label: "No Response" },
      { value: "interested_seller", label: "Interested Seller" },
      { value: "interested_buyer", label: "Interested Buyer" },
      { value: "hot", label: "Hot" },
      { value: "secondary_request", label: "Secondary request" },
      { value: "show", label: "Show" },
      { value: "junk", label: "Junk" },
      { value: "deal", label: "Deal" },
      { value: "change_agent", label: "Change Agent" },
    ];

    useEffect(() => {
      if (leadsLoading) {
        setIsLoaded(false);
      } else {
        const timer = setTimeout(() => setIsLoaded(true), 700);
        return () => clearTimeout(timer);
      }
    }, [leadsLoading, currentPage]);

    const [viewLead, setViewLead] = useState({
      isOpen: false,
      lid: null,
      tab: "basic",
    });
    const [editLead, setEditLead] = useState(false);
    const [editSecondary, setEditSecondary] = useState(false);
    const [viewPhoneHistory, setViewPhoneHistory] = useState({
      modal: false,
      leadId: null,
    });
    const [leadDetails, setLeadDetails] = useState(null);
    const [sendEmail, setSendEmail] = useState(false);
    const [isLeadCycle, setIsLeadCycle] = useState(null);
    const [deleteLead, setDeleteLead] = useState(false);
    const [leadAddtionalInfo, setLeadAddtionalInfo] = useState(false);

    const [advanceSearch, setAdvanceSearch] = useState(false);
    const [isFormReset, setIsFormReset] = useState(false);

    const searchTermRef = useRef("");

    const [searchParams, setSearchParams] = useSearchParams();
    let isLeadParam = searchParams.get("lead") || searchParams.get("invite");

    const removeTag = (key) => {
      const removedTag = searchTags.find((tag) => tag.key === key);
      if (!removedTag) return;

      const updatedTags = searchTags.filter((tag) => tag.key !== key);
      setSearchTags(updatedTags);

      // Check if it's a status tag
      if (removedTag.originalKey === "status") {
        handleRemoveStatus(removedTag.originalValue); // ← Use originalValue
        return;
      }

      if (removedTag.originalKey === "mstatus") {
        handleRemoveMstatus(removedTag.originalValue); // ← Use originalValue
        return;
      }

      // Handle advanced search tags - REBUILD params from remaining tags
      const advancedSearchParams = updatedTags.reduce((acc, tag) => {
        if (tag.originalKey !== "status" && tag.originalKey !== "mstatus") {
          acc[tag.originalKey] = tag.originalValue; // ← Use originalValue, not value!
        }
        return acc;
      }, {});

      // Get current search param from queryParams
      const currentSearch = queryParams?.search || "";

      // Build new query params
      const newQueryParams = {
        page: 1,
        limit: pageSize,
      };

      // Add search if exists
      if (currentSearch) {
        newQueryParams.search = currentSearch;
      }

      // Add advanced search if there are tags
      if (Object.keys(advancedSearchParams).length > 0) {
        newQueryParams.data = advancedSearchParams;
      }

      // Add status filters if they exist
      if (selectedStatus.length > 0 || selectedMstatus.length > 0) {
        newQueryParams.statusFilters = buildFilters(
          selectedStatus,
          selectedMstatus,
        );
      }

      setQueryParams(newQueryParams);
      setCurrentPage(1);
      setRefetchLoading(true);
    };

    const clearAllTags = () => {
      setSearchTags([]);

      // Get current search param
      const currentSearch = queryParams?.search || "";

      // Build new query params - preserve search if exists
      const newQueryParams = {
        page: 1,
        limit: pageSize,
      };

      if (currentSearch) {
        newQueryParams.search = currentSearch;
      }

      setQueryParams(newQueryParams);
      setCurrentPage(1);
      setRefetchLoading(true);
      setSearchClear(false);

      // Clear status states
      setSelectedStatus([]);
      setSelectedMstatus([]);
    };
    const handleClear = () => {
      if (isLeadParam) {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("lead");
        newParams.delete("invite");
        setSearchParams(newParams);
      }

      // Clear global search input
      searchTermRef.current = "";
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        searchInput.value = "";
      }

      // Clear ALL filters including search
      setSearchQueryParams({ page: 1, pageSize });

      // Clear all tags
      setSearchTags([]);
      setSelectedStatus([]);
      setSelectedMstatus([]);
      setSelectedLeads([]);
      setSelectedValues([]);
      setCurrentPageSelection([]);
      setIsFormReset(true);
      setRefetchLoading(true);
      setSearchClear(false);
    };

    // Handle status filters and create tags
    useEffect(() => {
      if (queryParams?.statusFilters) {
        let parsedFilters;
        try {
          parsedFilters =
            typeof queryParams.statusFilters === "string"
              ? JSON.parse(queryParams.statusFilters)
              : queryParams.statusFilters;
        } catch (err) {
          console.error("Invalid statusFilters JSON:", err);
          return;
        }

        const { mainStatuses, statuses } = parsedFilters;

        if (Array.isArray(statuses)) {
          setSelectedStatus(statuses);
        }
        if (Array.isArray(mainStatuses)) {
          setSelectedMstatus(mainStatuses);
        }

        // Create tags for status filters
        const statusTags = [];

        // Add status tags
        if (Array.isArray(statuses) && statuses.length > 0) {
          statuses.forEach((status) => {
            const statusLabel =
              statusOptions.find((opt) => opt.value === status)?.label ||
              status;
            statusTags.push({
              key: `status-${status}`,
              label: "Status",
              value: statusLabel,
              originalKey: "status",
            });
          });
        }

        // Add main status tags
        if (Array.isArray(mainStatuses) && mainStatuses.length > 0) {
          mainStatuses.forEach((mstatus) => {
            const mstatusLabel =
              mstatusOptions.find((opt) => opt.value === mstatus)?.label ||
              mstatus;
            statusTags.push({
              key: `mstatus-${mstatus}`,
              label: "Main Status",
              value: mstatusLabel,
              originalKey: "mstatus",
            });
          });
        }

        setSearchTags(statusTags);
        setSearchClear(statusTags.length > 0);
      }
    }, [queryParams?.statusFilters]);

    // build clean filters
    const buildFilters = (statusesArr, mStatusesArr) => {
      const filters = {};
      if (statusesArr.length > 0) filters.statuses = statusesArr;
      if (mStatusesArr.length > 0) filters.mainStatuses = mStatusesArr;
      return filters;
    };

    // Status handler
    const handleStatusChange = (value, isChecked) => {
      setSelectedStatus((prev) => {
        const updated = isChecked
          ? [...prev, value]
          : prev.filter((item) => item !== value);

        setSearchQueryParams({
          page: 1,
          statusFilters: buildFilters(updated, selectedMstatus),
        });

        setRefetchLoading(true);
        return updated;
      });
    };

    // MStatus handler
    const handleMstatusChange = (value, isChecked) => {
      setSelectedMstatus((prev) => {
        const updated = isChecked
          ? [...prev, value]
          : prev.filter((item) => item !== value);

        setSearchQueryParams({
          page: 1,
          statusFilters: buildFilters(selectedStatus, updated),
        });

        setRefetchLoading(true);
        return updated;
      });
    };

    // Remove Status
    const handleRemoveStatus = (status) => {
      setSelectedStatus((prev) => {
        const updated = prev.filter((item) => item !== status);

        setSearchQueryParams({
          page: 1,
          statusFilters: buildFilters(updated, selectedMstatus),
        });

        setRefetchLoading(true);
        return updated;
      });
    };

    // Remove MStatus
    const handleRemoveMstatus = (mstatus) => {
      setSelectedMstatus((prev) => {
        const updated = prev.filter((item) => item !== mstatus);

        setSearchQueryParams({
          page: 1,
          statusFilters: buildFilters(selectedStatus, updated),
        });

        setRefetchLoading(true);
        return updated;
      });
    };

    const handleSearchByName = useCallback(() => {
      const term = searchTermRef.current.trim().replace(/^\+/, "");
      if (!term) return;

      // This should NOT create tags
      setSearchQueryParams({ search: term, page: 1, pageSize });
      setRefetchLoading(true);
    }, [setSearchQueryParams, setRefetchLoading, pageSize]);
    // Handle page changes
    const handlePageChange = (page) => {
      setCurrentPageSelection((prev) => ({
        ...prev,
        [currentPage]: {
          selectAllChecked,
          selectedValues: selectedValues.filter((id) =>
            leads?.doc?.some((lead) => lead._id === id),
          ),
        },
      }));

      if (currentPageSelection[page]) {
        setSelectAllChecked(currentPageSelection[page].selectAllChecked);
        setSelectedValues((prev) => [
          ...new Set([...prev, ...currentPageSelection[page].selectedValues]),
        ]);
      } else {
        setSelectAllChecked(false);
      }

      setCurrentPage((prevPage) => {
        if (prevPage === page) return prevPage;
        setRefetchLoading(true);
        return page;
      });
    };

    const handlePageSize = (newPageSize) => {
      if (newPageSize !== pageSize) {
        setPageSize(newPageSize);
        setCurrentPage(1);
        setRefetchLoading(true);
      }
    };

    const commonProps = {
      isLoaded,
      leadsRefetching,
      leadsLoading,
      refreshLeads,
      setLeadDetails,
      setViewLead,
      queryParams,
      setEditLead,
      setAddLead,
      editSecondary,
      setEditSecondary,
      setSendEmail,
      selectedValues,
      setSelectedValues,
      setSelectedLeads,
      setDeleteLead,
      setSelectAllChecked,
      selectAllChecked,
      setViewPhoneHistory,
      setLeadAddtionalInfo,
      setIsLeadCycle,
      leadAddtionalInfo,
    };

    const leadDataLayout = (
      <Suspense
        fallback={
          <VStack h="80vh" justifyContent="center">
            <Loader />
          </VStack>
        }
      >
        {layoutView === "grid" ? (
          <LeadGridView {...commonProps} />
        ) : (
          <LeadTableView {...commonProps} />
        )}
      </Suspense>
    );

    return (
      <Box p="2">

        <Flex
          gap={2}
          flexDir={{ base: "column", md: "row" }}
          alignItems={{ base: "stretch", md: "normal" }}
        >
          {(selectedStatus.length > 0 || selectedMstatus.length > 0) && (
            <DisplayQuickFilter
              selectedStatus={selectedStatus}
              selectedMstatus={selectedMstatus}
              statusOptions={statusOptions}
              mstatusOptions={mstatusOptions}
              onRemoveStatus={handleRemoveStatus}
              onRemoveMstatus={handleRemoveMstatus}
            />
          )}
        </Flex>
        <Flex
          width="full"
          justifyContent="space-between"
          alignItems="center"
          gap="2"
          sx={{
            flexDirection: {
              base: "column",
            },
            "@media (min-width: 1695px)": {
              flexDirection: "row",
            },
          }}
        >
          <TopPagination
            currentPage={queryParams?.page || currentPage}
            totalPages={data?.totalPages ?? ""}
            totalItems={data?.totalLeads ?? ""}
            itemsPerPage={queryParams?.pageSize || pageSize}
            refetching={leadsRefetching}
            loading={leadsLoading}
            onPageChange={handlePageChange}
            handlePageSize={handlePageSize}
            maximumPageSize={20}
          />

          <SearchBox
            setQueryParams={setQueryParams}
            setAdvanceSearch={setAdvanceSearch}
            handleSearchByName={handleSearchByName}
            searchTermRef={searchTermRef}
            onClear={handleClear}
          />
        </Flex>

        {searchTags && searchTags.length > 0 && (
          <>
            {console.log("Tags being passed to SearchTags:", searchTags)}
            {console.log("Type of first tag:", typeof searchTags[0])}
            {console.log(
              "Is first tag an object?",
              typeof searchTags[0] === "object",
            )}
            <SearchTags
              searchTags={searchTags}
              removeTag={removeTag}
              clearAllTags={clearAllTags}
            />
          </>
        )}

<Box height="2px" my={4} bg="border.subtle" />

        {leadsError ? (
          <ErrorMessage
            message={leadsError?.data?.message || "Something went wrong!"}
          />
        ) : (
          leadDataLayout
        )}

        <LeadsModals
          refetchData={refreshLeads}
          viewLead={viewLead}
          setViewLead={setViewLead}
          editLead={editLead}
          setEditLead={setEditLead}
          editSecondary={editSecondary}
          setEditSecondary={setEditSecondary}
          lead={leadDetails}
          addLead={addLead}
          setAddLead={setAddLead}
          sendEmail={sendEmail}
          setSendEmail={setSendEmail}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          deleteLead={deleteLead}
          setDeleteLead={setDeleteLead}
          viewPhoneHistory={viewPhoneHistory}
          setViewPhoneHistory={setViewPhoneHistory}
          setLeadAddtionalInfo={setLeadAddtionalInfo}
          leadAddtionalInfo={leadAddtionalInfo}
          isLeadCycle={isLeadCycle}
          setIsLeadCycle={setIsLeadCycle}
        />

        {dateTimeIsOpen && (
          <DateFilter
            setQueryParams={setQueryParams}
            setRefetchLoading={setRefetchLoading}
            setCurrentPage={setCurrentPage}
            onClose={dateTimeOnClose}
            isOpen={dateTimeIsOpen}
            setSearchClear={setSearchClear}
            setSearchTags={setSearchTags}
            setSearchQueryParams={setSearchQueryParams}
          />
        )}

        {advanceSearch && (
          <AdvancedSearchModal
            advanceSearch={advanceSearch}
            setAdvanceSearch={setAdvanceSearch}
            setQueryParams={setQueryParams}
            setGetTagValues={setSearchTags}
            setSearchClear={setSearchClear}
            handleClear={handleClear}
            isFormReset={isFormReset}
            setIsFormReset={setIsFormReset}
            setRefetchLoading={setRefetchLoading}
            setSearchQueryParams={setSearchQueryParams}
          />
        )}

        <QuickFilterModal
          isOpen={manageColumnsOpen}
          onClose={closeManageColumns}
          statusOptions={statusOptions}
          mstatusOptions={mstatusOptions}
          selectedStatus={selectedStatus}
          selectedMstatus={selectedMstatus}
          onStatusChange={handleStatusChange}
          onMstatusChange={handleMstatusChange}
          setQueryParams={setQueryParams}
          setRefetchLoading={setRefetchLoading}
          setSelectedStatus={setSelectedStatus}
          setSelectedMstatus={setSelectedMstatus}
        />
      </Box>
    );
  },
);

LeadsLayout.displayName = "LeadsLayout";

export default LeadsLayout;
