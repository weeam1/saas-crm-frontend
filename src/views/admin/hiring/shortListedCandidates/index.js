import { memo, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Button, Flex, useBreakpointValue } from "@chakra-ui/react";
import InvitedData from "./InvitedData";
import ShortListedData from "./ShortListedData";
import { useFetchItemsQuery } from "api/apiSlice";
import Loader from "components/loading/Loader";
import MeetingSection from "./components/MeetingSection";
import PendingInvitedData from "./PendingInvitedData";

const DEFAULT_SUB_TAB = "short-listed";

const ShortListedCandidates = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabKey, setTabKey] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const isManager = user?.roles[0]?.roleName === "Manager";
  const subTabFromParams =
    searchParams.get("shortlisted-tab") || DEFAULT_SUB_TAB;

  const tabFontSize = useBreakpointValue({ base: "xs", sm: "sm", md: "md" });
  const tabPadding = useBreakpointValue({ base: "2", sm: "3", md: "4" });
  const buttonHeight = useBreakpointValue({ base: "8", md: "10" });

  const {
    data: invitedCandidates,
    isLoading: invitedCandidatesLoading,
    refetch: invitedRefetch,
  } = useFetchItemsQuery({
    path: `/applications/invited-candidates`,
    params: {
      sort: "interviewDate",
      limit: 4,
    },
  });

  const allSubTabs = [
    {
      title: "Short Listed",
      param: "short-listed",
      component: (
        <ShortListedData key={tabKey} invitedRefetch={invitedRefetch} />
      ),
    },
    {
      title: "Invited",
      param: "invited",
      component: <InvitedData key={tabKey} />,
    },
    {
      title: "Pending",
      param: "pending",
      component: (
        <PendingInvitedData key={tabKey} invitedRefetch={invitedRefetch} />
      ),
    },
  ];

  const subTabsData = isManager
    ? allSubTabs.filter((tab) => tab.param === "short-listed")
    : allSubTabs;

  const activeSubTabIndex = Math.max(
    0,
    subTabsData.findIndex((tab) => tab.param === subTabFromParams.toLowerCase())
  );

  useEffect(() => {
    if (
      !searchParams.get("shortlisted-tab") ||
      !subTabsData.some(
        (tab) => tab.param === searchParams.get("shortlisted-tab")
      )
    ) {
      const params = new URLSearchParams(searchParams);
      params.set("shortlisted-tab", DEFAULT_SUB_TAB);
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, setSearchParams, subTabsData]);

  const handleSubTabChange = (index) => {
    const tabParam = subTabsData[index].param;
    const params = new URLSearchParams(searchParams);
    params.set("shortlisted-tab", tabParam);
    setSearchParams(params, { replace: true });

    if (index === activeSubTabIndex) {
      setTabKey((prev) => prev + 1);
    }
  };

  if (invitedCandidatesLoading) {
    return <Loader />;
  }

  return (
    <Box fontFamily="'DM Sans', sans-serif">
      {/* <Button
				colorScheme='gray'
				borderRadius='5px'
				size={{ base: 'sm', md: 'md' }}
				px={{ base: 4, md: 6 }}
				py={{ base: 2, md: 3 }}
				fontSize={{ base: 'sm', md: 'md' }}
				leftIcon={<Icon as={IoArrowBack} boxSize={4} />}
				onClick={() => navigate('/hiring')}
				mb={4}
			>
				Back
			</Button> */}

      {!isManager && (
        <MeetingSection
          invitedCandidates={invitedCandidates}
          refetch={invitedRefetch}
          setActiveTab={() => handleSubTabChange(1)}
        />
      )}
      {/* <Box>
				<Box display='flex' mb={2}>
					<Button
						onClick={() => handleTabChange(0)}
						colorScheme={activeTab === 0 ? 'brand' : 'gray'}
						bg={activeTab === 0 ? 'brand.500' : 'white'}
						color={activeTab === 0 ? 'white' : 'gray.800'}
						_focus={{ outline: 'none' }}
						mr={4}
						transition='background-color 0.1s ease, color 0.1s ease'
						borderRadius='5px'
						_hover={{
							bg: activeTab === 0 ? 'brand.600' : 'gray.100',
							color: activeTab === 0 ? 'white' : 'gray.800',
						}}
						fontWeight='normal'
					>
						Short Listed
					</Button>
					<Button
						onClick={() => handleTabChange(1)}
						colorScheme={activeTab === 1 ? 'brand' : 'gray'}
						bg={activeTab === 1 ? 'brand.500' : 'white'}
						color={activeTab === 1 ? 'white' : 'gray.800'}
						_focus={{ outline: 'none' }}
						borderRadius='5px'
						transition='background-color 0.1s ease, color 0.1s ease'
						_hover={{
							bg: activeTab === 1 ? 'brand.600' : 'gray.100',
							color: activeTab === 1 ? 'white' : 'gray.800',
						}}
						fontWeight='normal'
					>
						Invited Candidates
					</Button>
					<Button
						onClick={() => handleTabChange(3)}
						colorScheme={activeTab === 1 ? 'brand' : 'gray'}
						bg={activeTab === 1 ? 'brand.500' : 'white'}
						color={activeTab === 1 ? 'white' : 'gray.800'}
						_focus={{ outline: 'none' }}
						borderRadius='5px'
						transition='background-color 0.1s ease, color 0.1s ease'
						_hover={{
							bg: activeTab === 1 ? 'brand.600' : 'gray.100',
							color: activeTab === 1 ? 'white' : 'gray.800',
						}}
						fontWeight='normal'
					>
						Pending Invited Candidates
					</Button>
				</Box>

				
				{activeTab === 0 ? (
					<ShortListedData invitedRefetch={invitedRefetch} />
				) : activeTab === 1 ? (
					<InvitedData />
				) : (
					<PendingInvitedData />
				)}
			</Box> */}

      {/* <Tabs index={activeTab} onChange={setActiveTab} variant='soft-rounded'>
				<TabList width='fit-content' px='4' gap='2'>
					{tabData.map((tab, index) => (
						<Tab
							key={index}
							bg={activeTab !== index && 'white'}
							color={activeTab !== index && 'gray.800'}
							_selected={{ bg: 'brand.400', color: 'white' }}
							_focus={{ boxShadow: 'none' }}
							rounded='md'
							shadow='sm'
							fontSize='lg'
							fontWeight='normal'
						>
							{tab.title}
						</Tab>
					))}
				</TabList>

				<TabPanels>
					{tabData.map((tab, index) => (
						<TabPanel key={index}>{tab.component}</TabPanel>
					))}
				</TabPanels>
			</Tabs> */}
			
      <Box>
        <Flex
          width="fit-content"
          overflowX="auto"
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          py="1"
        >
          {!isManager &&
            subTabsData.map((tab, index) => (
              <Button
                key={index}
                onClick={() => handleSubTabChange(index)}
                bg={activeSubTabIndex === index ? "#EDD199" : "softGray.50"}
                color={activeSubTabIndex === index ? "black" : "gray.500"}
                borderTop={
                  activeSubTabIndex === index
                    ? "4px solid #B79045"
                    : "4px solid transparent"
                }
                fontWeight={activeSubTabIndex === index ? "normal" : "normal"}
                _focus={{ outline: "none" }}
                _hover={{
                  bg: activeSubTabIndex === index ? "#EDD199" : "gray.100",
                }}
                rounded="none"
                shadow="sm"
                fontSize={tabFontSize}
                px={tabPadding}
                h={buttonHeight}
                whiteSpace="nowrap"
                flexShrink={0}
                transition="all 0.2s ease"
                minW="max-content"
              >
                {tab.title}
              </Button>
            ))}
        </Flex>

        <Box
          mt="4"
          p={{ base: "3", md: "4" }}
          bg="white"
          shadow="sm"
          minH="100px"
          transition="opacity 0.3s ease"
          opacity={1}
          key={activeSubTabIndex}
        >
          {subTabsData[activeSubTabIndex].component}
        </Box>
      </Box>
    </Box>
  );
});

export default ShortListedCandidates;
