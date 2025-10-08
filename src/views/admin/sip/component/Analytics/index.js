import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Skeleton,
  IconButton,
} from "@chakra-ui/react";
import { FiRefreshCw } from "react-icons/fi";
import { useFetchItemsQuery } from "api/apiSlice";
import axios from "axios";
import keys from "config/keys";
import AnalyticsCard from "./components/AnalyticsCard";
import DateFilter from "../../../attendance/components/DateFilter";

const Analytics = () => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const { data, isLoading } = useFetchItemsQuery(
    { path: "sipSetting" },
    { refetchOnMountOrArgChange: true }
  );

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

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
          sipId : matchedUser.sipId,
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

  useEffect(() => {
    if (data?.sipSettings?.length) {
      fetchAnalytics();
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
      >
        <Heading size="lg" color="goldenrod">
          SIP Call Analytics
        </Heading>
        <Box display="flex" gap={3}>
          <DateFilter onFilterChange={onFilterChange} />
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
            <AnalyticsCard
              key={item.extension}
              item={item}
              month={month}
              year={year}
            />
          ))}
        </SimpleGrid>
      )}

    </Box>
  );
};

export default Analytics;
