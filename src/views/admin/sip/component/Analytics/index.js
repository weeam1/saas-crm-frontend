import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Skeleton,
  IconButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { FiRefreshCw } from "react-icons/fi";
import { useFetchItemsQuery } from "api/apiSlice";
import axios from "axios";
import keys from "config/keys";
import AnalyticsCard from "./components/AnalyticsCard";
import DateFilter from "../../../attendance/components/DateFilter";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
import ViewToggle from "./components/ViewToggle";
import UserChartAnalytics from "./components/UserChartAnalytics";

const Analytics = () => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const { data, isLoading } = useFetchItemsQuery(
    { path: "sipSetting" },
    { refetchOnMountOrArgChange: true }
  );

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [graphData, setGraphData] = useState(null);
  const [loadingGraph, setLoadingGraph] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedChart, setSelectedChart] = useState(null);
  const [view, setView] = useState(
    localStorage.getItem("analyticsView") || "card"
  );

  const fetchAnalytics = async (m = month, y = year) => {
    if (!data?.sipSettings?.length) return;

    const extensionsParams = data.sipSettings
      .map((item) => `extensions=${item.extensionId}`)
      .join("&");

    const url = `${keys.sipApiUrl}/call-analytics?${extensionsParams}&month=${m}&year=${y}`;

    try {
      setLoadingAnalytics(true);
      const res = await axios.get(url);
      const mergedAnalytics = res.data.analytics.map((a) => {
        const matchedUser = data.sipSettings.find(
          (s) => String(s.extensionId) === String(a.extension)
        );
        return {
          ...a,
          fullName: matchedUser?.userId?.fullName || "Unknown User",
          sipId: matchedUser?.sipId || "-",
        };
      });

      setAnalyticsData({
        ...res.data,
        analytics: mergedAnalytics,
      });
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchGraphAnalytics = async (m = month, y = year) => {
    if (!data?.sipSettings?.length) return;

    const extensionsParams = data.sipSettings
      .map((item) => `extensions=${item.extensionId}`)
      .join("&");

    const url = `${keys.sipApiUrl}/user-analytics?year=${y}&month=${m}&${extensionsParams}`;

    try {
      setLoadingGraph(true);
      const res = await axios.get(url);

      // Map extension IDs to names
      const mappedCharts = {};
      for (const [key, chart] of Object.entries(res.data.charts || {})) {
        if (Array.isArray(chart)) {
          mappedCharts[key] = chart.map((entry) => {
            if (entry.extension) {
              const matchedUser = data.sipSettings.find(
                (s) => String(s.extensionId) === String(entry.extension)
              );
              return {
                ...entry,
                fullName:
                  matchedUser?.userId?.fullName || `Ext ${entry.extension}`,
              };
            }
            return entry;
          });
        } else {
          mappedCharts[key] = chart;
        }
      }

      setGraphData({
        ...res.data,
        charts: mappedCharts,
      });
    } catch (err) {
      console.error("Error fetching graph analytics:", err);
    } finally {
      setLoadingGraph(false);
    }
  };

  useEffect(() => {
    if (data?.sipSettings?.length) {
      fetchAnalytics();
      fetchGraphAnalytics();
    }
  }, [data]);

  const onFilterChange = (value) => {
    setMonth(Number(value.month));
    setYear(Number(value.year));
    fetchAnalytics(value.month, value.year);
  };

  return (
    <Box p={6} bg={"white"} mt={"-16px"}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={6}
        flexDir={{ base: "column", sm: "column", md: "row" }}
        gap={2}
      >
        <Heading
          fontSize={{ base: "md", sm: "md", md: "lg" }}
          color="goldenrod"
        >
          SIP Call Analytics
        </Heading>
        <Box
          display="flex"
          gap={3}
          alignItems={"center"}
          flexDir={{ base: "column", sm: "column", md: "row" }}
        >
          <Button
            colorScheme="brand"
            size={{ base: "sm", sm: "md", md: "lg" }}
            w={{ base: "full", sm: "auto" }} 
            px={{ base: 4, sm: 6, md: 8 }} 
            py={{ base: 3, sm: 4, md: 4 }}
            fontSize={{ base: "sm", sm: "md", md: "lg" }} 
            borderRadius={"md"}
            onClick={() => {
              setSelectedChart("all");
              onOpen();
            }}
          >
            View Full Analytics
          </Button>

          <DateFilter onFilterChange={onFilterChange} />
          <ViewToggle
            view={view}
            handleView={(val) => {
              setView(val);
              localStorage.setItem("analyticsView", val);
            }}
            moduleView="analyticsView"
          />
          <IconButton
            icon={<FiRefreshCw />}
            aria-label="Refresh Analytics"
            onClick={() => {
              fetchAnalytics();
              fetchGraphAnalytics();
            }}
            isLoading={loadingAnalytics}
            variant="outline"
            size="md"
          />
        </Box>
      </Box>

      {view === "card" ? (
        <SimpleGrid
          spacing={6}
          sx={{
            gridTemplateColumns: {
              base: "repeat(auto-fit, minmax(250px, 1fr))",
              md: "repeat(auto-fit, minmax(300px, 1fr))",
              lg: "repeat(auto-fit, minmax(350px, 1fr))",
            },
            alignItems: "stretch",
          }}
        >
          {loadingAnalytics || isLoading ? (
            Array.from({ length: 30 }).map((_, i) => (
              <Skeleton key={i} height="220px" borderRadius="2xl" />
            ))
          ) : analyticsData?.analytics?.length > 0 ? (
            analyticsData.analytics.map((item) => (
              <AnalyticsCard
                key={item.extension}
                item={item}
                month={month}
                year={year}
              />
            ))
          ) : (
            <Box w="full" p="4" textAlign="center">
              <NoData label="user analytics records" />
            </Box>
          )}
        </SimpleGrid>
      ) : (
        <UserChartAnalytics
          graphData={graphData}
          loading={loadingGraph}
          loadingAnalytics={loadingAnalytics}
          selectedChart={selectedChart}
          setSelectedChart={setSelectedChart}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />
      )}
    </Box>
  );
};

export default Analytics;
