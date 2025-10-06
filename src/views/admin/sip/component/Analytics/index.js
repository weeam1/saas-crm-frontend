import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Skeleton,
  IconButton,
} from "@chakra-ui/react";
import { FiRefreshCw } from "react-icons/fi";
import { useDisclosure } from "@chakra-ui/react";
import { useFetchItemsQuery } from "api/apiSlice";
import axios from "axios";
import keys from "config/keys";
import AnalyticsCard from "./components/AnalyticsCard";
import FilterModal from "./components/FilterModal";
import { FiCalendar } from "react-icons/fi";

const Analytics = () => {
  const { data, isLoading } = useFetchItemsQuery(
    { path: "sipSetting" },
    { refetchOnMountOrArgChange: true }
  );

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const [month, setMonth] = useState(8);
  const [year, setYear] = useState(2025);

  const [tempMonth, setTempMonth] = useState(month);
  const [tempYear, setTempYear] = useState(year);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchAnalytics = async (m = month, y = year) => {
    if (!data?.sipSettings?.length) return;

    const extensionsParams = data.sipSettings
      .map((item) => `extensions=${item.extensionId}`)
      .join("&");

    const url = `${keys.sipApiUrl}/call-analytics?${extensionsParams}&month=${m}&year=${y}`;

    try {
      setLoadingAnalytics(true);
      const res = await axios.get(url);
      setAnalyticsData(res.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    if (data?.sipSettings?.length) {
      fetchAnalytics();
    }
  }, [data]);

  const handleDateFilter = () => {
    setMonth(tempMonth);
    setYear(tempYear);
    fetchAnalytics(tempMonth, tempYear);
    onClose();
  };

  return (
    <Box p={6} bg={"white"} mt={"-16px"}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={6}
      >
        <Heading size="lg" color="goldenrod">
          SIP Call Analytics
        </Heading>
        <Box display="flex" gap={3}>
          <IconButton
            icon={<FiCalendar />}
            aria-label="Filter Data"
            onClick={onOpen}
            variant="brand"
            size="md"
            borderColor="goldenrod"
            color="white"
          />
          <IconButton
            icon={<FiRefreshCw />}
            aria-label="Refresh Analytics"
            onClick={() => fetchAnalytics()}
            isLoading={loadingAnalytics}
            variant="outline"
            size="md"
          />
        </Box>
      </Box>

      {loadingAnalytics || isLoading ? (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height="200px" borderRadius="md" />
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {analyticsData?.analytics?.map((item) => (
            <AnalyticsCard key={item.extension} item={item} />
          ))}
        </SimpleGrid>
      )}

      <FilterModal
        isOpen={isOpen}
        onClose={onClose}
        tempMonth={tempMonth}
        setTempMonth={setTempMonth}
        tempYear={tempYear}
        setTempYear={setTempYear}
        handleDateFilter={handleDateFilter}
      />
    </Box>
  );
};

export default Analytics;
