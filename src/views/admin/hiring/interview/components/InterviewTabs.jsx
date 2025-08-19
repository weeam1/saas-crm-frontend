import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  HStack,
  Text,
} from "@chakra-ui/react";
import { LuUsers, LuFileText, LuCheckSquare } from "react-icons/lu";
import SelectInterviewers from "./SelectInterviewers";
import HiringInfo from "./HiringInfo";
import EvaluationPoints from "./EvaluationPoints";
import { toast } from "react-toastify";
import { memo, useEffect, useMemo, useState } from "react";
import { useUpdateItemMutation } from "api/apiSlice";
import { useNavigate } from "react-router-dom";
import { useFetchItemsQuery } from "api/apiSlice";
import Loader from "components/loading/Loader";

const InterviewTabs = memo(
  ({
    handleTabChange,
    interview,
    user,
    activeTabIndex,
    isLeadInterviewer,
    isCreatedBy,
    interviewRefetch,
    setInterviewersSelected,
    isInterviewerSubmittedPoints,
  }) => {
    const [hiringData, setHiringData] = useState();
    const [updateItemMutation, { isLoading: updatingInterview }] =
      useUpdateItemMutation();

    const userRole = user?.roles[0]?.roleName || user?.role;

    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (loading) {
        const timer = setTimeout(() => {
          setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }, [loading]);
    // const interviewerEvaluationPoints = interview?.evaluations?.filter(
    // 	(item) => item.interviewer._id === user._id
    // )[0];

    const { data: positionOptions, isLoading: positionsLoading } =
      useFetchItemsQuery(
        {
          path: `/positions/options`,
        },
        { refetchOnMountOrArgChange: true }
      );

    // Memoize computed values
    const isInvitedInterviewer = useMemo(
      () =>
        interview?.isMultiRound
          ? interview?.nextRound?.totalInterviewers > 0
          : interview?.totalInterviewers > 0,
      [
        interview?.isMultiRound,
        interview?.nextRound?.totalInterviewers,
        interview?.totalInterviewers,
      ]
    );

    const navigate = useNavigate();

    const handleSubmit = async (data) => {
      try {
        let hiringInfo = {};

        hiringInfo = {
          jobType: data.jobType,
          position: data.position,
        };

        hiringInfo.amount = data.jobType === "Commission" ? null : data.amount;
        hiringInfo.commission =
          data.jobType === "Salary" ? null : data.commission;
        hiringInfo.incentive = data.incentive || null;

        hiringInfo.isNextRound = data.isNextRound;

        await updateItemMutation({
          path: `/interviews/${interview._id}`,
          body: { hiringData: hiringInfo },
        }).unwrap();

        toast.success("Interview data updated successfully");

        // Redirect to the appropriate page based on the interviewer
        const redirectUrl = hiringInfo.isNextRound
          ? `/hiring?tab=multi-round-interviewed`
          : isLeadInterviewer
            ? `/hiring?tab=interviewed-candidates`
            : ["superAdmin", "HR"].includes(userRole)
              ? "/hiring"
              : "/";

        navigate(redirectUrl);
      } catch (error) {
        toast.error(error?.data?.message || "Failed to update interview data");
      }
    };

    return positionsLoading || loading ? (
      <Loader />
    ) : (
      <Box
        display="flex"
        bg="white"
        p={{ base: 4, lg: 8 }}
        rounded="md"
        shadow="sm"
        justifyContent="center"
        width="full"
        alignItems="center"
      >
        {isLeadInterviewer ? (
          <Tabs
            colorScheme="brand"
            variant="enclosed"
            onChange={handleTabChange}
            index={activeTabIndex}
            width={{ base: "full", md: "700px" }}
          >
            {/* Tab List */}
            <TabList
              bg="softGray.100"
              width="full"
              mx="auto"
              py={{ base: "1", md: "2" }}
              px={{ base: "2", md: "4" }}
              rounded="md"
              shadow="sm"
              display="flex"
              flexDirection={{ base: "column", sm: "row" }}
              gap={{ base: "1", sm: "2" }}
            >
              {/* Conditionally render the "Select Interviewers" tab separately if not invited */}
              {/* {isCreatedBy && ( */}
              <Tab
                isDisabled={isInvitedInterviewer}
                _selected={{ bg: "brand.400", color: "white" }}
                _focus={{ boxShadow: "none" }}
                rounded="md"
                color={isInvitedInterviewer ? "brand.500" : "gray.800"}
                flex="1"
                minWidth="0"
                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                py={{ base: "1", md: "2" }}
              >
                <HStack spacing={{ base: "1", md: "2" }}>
                  <Box
                    as={LuUsers}
                    fontSize={{ base: "14px", sm: "16px", md: "18px" }}
                  />
                  <Text whiteSpace="nowrap">Select Interviewers</Text>
                </HStack>
              </Tab>
			{/* )} */}

              <Tab
                isDisabled={
                  !isInvitedInterviewer || isInterviewerSubmittedPoints
                }
                _selected={{ bg: "brand.400", color: "white" }}
                _focus={{ boxShadow: "none" }}
                rounded="md"
                color={isInterviewerSubmittedPoints ? "brand.500" : "gray.800"}
                flex="1"
                minWidth="0"
                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                py={{ base: "1", md: "2" }}
              >
                <HStack spacing={{ base: "1", md: "2" }}>
                  <Box
                    as={LuCheckSquare}
                    fontSize={{ base: "14px", sm: "16px", md: "18px" }}
                  />
                  <Text whiteSpace="nowrap">Evaluation Points</Text>
                </HStack>
              </Tab>
              <Tab
                isDisabled={
                  !isInvitedInterviewer || !isInterviewerSubmittedPoints
                }
                _selected={{ bg: "brand.400", color: "white" }}
                _focus={{ boxShadow: "none" }}
                rounded="md"
                color={
                  !isInvitedInterviewer || !isInterviewerSubmittedPoints
                    ? "gray.500"
                    : "gray.800"
                }
                flex="1"
                minWidth="0"
                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                py={{ base: "1", md: "2" }}
              >
                <HStack spacing={{ base: "1", md: "2" }}>
                  <Box
                    as={LuFileText}
                    fontSize={{ base: "14px", sm: "16px", md: "18px" }}
                  />
                  <Text whiteSpace="nowrap">Hiring Info</Text>
                </HStack>
              </Tab>
              {/* Other tabs */}
              {/* {[
								{ label: 'Evaluation Points', icon: LuCheckSquare },
								{ label: 'Hiring Info', icon: LuFileText },
							].map((tab, index) => (
								<Tab
									key={index}
									isDisabled={!isInvitedInterviewer} // Disable all tabs if not invited
									_selected={{ bg: 'brand.400', color: 'white' }}
									_focus={{ boxShadow: 'none' }} // Removes focus outline
									rounded='md'
									width='full'
								>
									<HStack>
										<tab.icon />
										<Text>{tab.label}</Text>
									</HStack>
								</Tab>
							))} */}
            </TabList>

            {/* Tab Panels */}
            <TabPanels
              p={{ base: 4, md: 8 }}
              width={{ base: "100%", md: "700px" }}
              mx="auto"
            >
              {/* {isCreatedBy && ( */}
              <TabPanel p={{ base: 4, md: 8 }}>
                <SelectInterviewers
                  user={user}
                  interview={interview}
                  interviewRefetch={interviewRefetch}
                  setInterviewersSelected={setInterviewersSelected}
                  handleTabChange={handleTabChange}
                  isInvitedInterviewer={isInvitedInterviewer}
                  setLoading={setLoading}
                />
              </TabPanel>
              {/* )} */}

              <TabPanel bg="softGray.100" p={{ base: 4, md: 8 }} rounded="md">
                <EvaluationPoints
                  // onSubmit={handleSubmit}
                  interview={interview}
                  isLeadInterviewer={isLeadInterviewer}
                  handleTabChange={handleTabChange}
                  interviewRefetch={interviewRefetch}
                  isInterviewerSubmittedPoints={isInterviewerSubmittedPoints}
                />

                {/* <InterviewEvaluationTabs
									interviewDoc={interview}
									nextRoundDoc={interview?.nextRound}
									isLeadInterviewer={isLeadInterviewer}
									handleTabChange={handleTabChange}
									interviewRefetch={interviewRefetch}
									isInterviewerSubmittedPoints={isInterviewerSubmittedPoints}
								/> */}
              </TabPanel>
              <TabPanel bg="softGray.100" p={{ base: 4, md: 8 }} rounded="md">
                <HiringInfo
                  interview={interview}
                  hiringData={hiringData}
                  setHiringData={setHiringData}
                  onSubmit={handleSubmit}
                  positionOptions={positionOptions?.doc}
                  updatingInterview={updatingInterview}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        ) : (
          <Box
            width={{ base: "100%", md: "700px" }}
            bg="softGray.100"
            p={{ base: 4, md: 8 }}
            mx="auto"
            rounded="md"
          >
            <EvaluationPoints
              // onSubmit={handleSubmit}
              interview={interview}
              isLeadInterviewer={isLeadInterviewer}
              handleTabChange={handleTabChange}
              interviewRefetch={interviewRefetch}
              isInterviewerSubmittedPoints={isInterviewerSubmittedPoints}
            />
          </Box>
        )}
      </Box>
    );
  }
);

export default InterviewTabs;
