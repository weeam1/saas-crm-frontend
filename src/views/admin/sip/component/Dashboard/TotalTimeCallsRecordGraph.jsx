"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Select,
  HStack,
  VStack,
  Square,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import Chart from "chart.js/auto";
import moment from "moment";
import { fetchTotalTimeCallsRecordStats } from "../../../../../services/sip/index";
import { useModalColors } from "hooks/useModalColors";
import RefreshButton from "components/refresh/RefreshButton";

const formatSeconds = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs > 0 ? `${hrs} hrs ` : ""}${mins} min${
    secs > 0 ? ` ${secs}s` : ""
  }`;
};

export default function TotalTimeCallsRecordGraph() {
  const colors = useModalColors();
  const [days, setDays] = useState(30);
  const [uniqueCalls, setUniqueCalls] = useState(0);
  const [avgMinutes, setAvgMinutes] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [monthRanges, setMonthRanges] = useState([]);
  const [monthHeader, setMonthHeader] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Chart colors based on theme
  const chartColors = {
    totalTimeGradient: {
      start: "rgba(212, 175, 55, 0.9)",    // Gold
      end: "rgba(212, 175, 55, 0.2)"       // Gold transparent
    },
    uniqueCalls: "#10B981",                 // Success green
    grid: colors.borderColor,
    text: colors.bodyText,
    tooltipBg: colors.bgDeep,
    tooltipBorder: colors.accentGold
  };

  const updateChart = (data) => {
    const daily = data.daily
      .map((d) => ({
        date: moment(d.date),
        duration: parseFloat(d.duration.replace("s", "")) / 60,
        unique: d.joinedCount,
      }))
      .sort((a, b) => a.date - b.date);

    // Group by month
    const grouped = daily.reduce((acc, item) => {
      const month = item.date.format("MMM");
      if (!acc[month]) acc[month] = [];
      acc[month].push(item);
      return acc;
    }, {});

    const labels = daily.map((d) => d.date.format("D"));
    const totalTime = daily.map((d) => d.duration);
    const uniqueCallsData = daily.map((d) => d.unique);

    const ranges = Object.keys(grouped).map((month) => {
      const daysInMonth = grouped[month].map((d) => d.date.date());
      const start = Math.min(...daysInMonth);
      const end = Math.max(...daysInMonth);
      return `${month} ${start}–${end}`;
    });
    setMonthRanges(ranges);

    const months = Object.keys(grouped);
    if (months.length > 0) {
      const firstMonth = months[0];
      const lastMonth = months[months.length - 1];
      setMonthHeader(
        months.length === 1 ? firstMonth : `${firstMonth} – ${lastMonth}`
      );
    }

    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Total Time (minutes)",
            data: totalTime,
            backgroundColor: (ctx) => {
              const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
              gradient.addColorStop(0, chartColors.totalTimeGradient.start);
              gradient.addColorStop(1, chartColors.totalTimeGradient.end);
              return gradient;
            },
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.5,
            categoryPercentage: 0.5,
            yAxisID: "y",
          },
          {
            label: "Unique Calls",
            data: uniqueCallsData,
            borderColor: chartColors.uniqueCalls,
            backgroundColor: "transparent",
            borderWidth: 2,
            pointBackgroundColor: chartColors.uniqueCalls,
            pointRadius: 4,
            pointBorderColor: colors.bg,
            pointBorderWidth: 2,
            tension: 0.3,
            type: "line",
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        scales: {
          x: {
            grid: { display: false, color: chartColors.grid },
            ticks: {
              color: chartColors.text,
              font: { size: 12, family: "'Poppins', 'Cairo', sans-serif" },
              padding: 10,
              maxRotation: 0,
              minRotation: 0,
              autoSkip: true,
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: chartColors.grid, drawBorder: false },
            ticks: { color: chartColors.text },
            title: {
              display: true,
              text: "Total Time (min)",
              color: chartColors.text,
              font: { size: 13, weight: "bold", family: "'Poppins', 'Cairo', sans-serif" },
            },
          },
          y1: {
            beginAtZero: true,
            grid: { display: false },
            position: "right",
            ticks: { color: chartColors.text },
            title: {
              display: true,
              text: "Unique Calls",
              color: chartColors.text,
              font: { size: 13, weight: "bold", family: "'Poppins', 'Cairo', sans-serif" },
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: chartColors.text,
              boxWidth: 15,
              padding: 15,
              font: { size: 13, weight: 500, family: "'Poppins', 'Cairo', sans-serif" },
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            backgroundColor: chartColors.tooltipBg,
            titleColor: colors.headingText,
            bodyColor: chartColors.text,
            borderWidth: 1,
            borderColor: colors.accentGold,
            cornerRadius: 8,
            bodyFont: { family: "'Poppins', 'Cairo', sans-serif" },
            titleFont: { family: "'Poppins', 'Cairo', sans-serif", weight: "bold" },
            callbacks: {
              title: (tooltipItems) => {
                const index = tooltipItems[0].dataIndex;
                return daily[index].date.format("DD MMM YYYY");
              },
            },
          },
        },
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
      },
    });
  };

  const getData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTotalTimeCallsRecordStats(days);
      console.log("Fetched chart data:", data);
      setUniqueCalls(data.unique_calls);
      setAvgMinutes(data.average_minutes);
      setTotalMinutes(data?.total_minutes);
      updateChart(data);
    } catch (error) {
      console.error("Error loading chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [days]);

  return (
    <Box
      p={6}
      bg={colors.bg}
      borderRadius="xl"
      boxShadow={colors.cardShadow}
      border="1px solid"
      borderColor={colors.borderColor}
      mx={2}
      mt={-2}
    >
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
        <Heading
          size="lg"
          fontWeight="bold"
          color={colors.headingText}
          fontFamily="'Poppins', 'Cairo', sans-serif"
        >
          Total Time and Calls
        </Heading>

        <HStack gap={3} flexWrap="wrap">
        <RefreshButton
                          label="Refresh"
                          onClick={getData}
                          isLoading={isLoading}
                          isFetching={isLoading}
                          size="sm"
                        />

          <Select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            w="160px"
            bg={colors.bgInput}
            borderColor={colors.borderColor}
            color={colors.headingText}
            borderRadius="lg"
            _hover={{ borderColor: colors.accentGold, cursor: "pointer" }}
            _focus={{ borderColor: colors.accentGold, boxShadow: `0 0 0 1px ${colors.accentGold}` }}
            fontSize="sm"
          >
            <option style={{ background: colors.bg, color: colors.headingText }} value={30}>30 Days</option>
            <option style={{ background: colors.bg, color: colors.headingText }} value={60}>60 Days</option>
            <option style={{ background: colors.bg, color: colors.headingText }} value={90}>90 Days</option>
            <option style={{ background: colors.bg, color: colors.headingText }} value={180}>180 Days</option>
            <option style={{ background: colors.bg, color: colors.headingText }} value={360}>360 Days</option>
          </Select>
        </HStack>
      </Flex>

      {/* Summary Stats Cards */}
      <Flex justify="space-between" mb={8} wrap="wrap" gap={4}>
        <VStack
          align="flex-start"
          spacing={2}
          flex="1"
          minW="180px"
          p={4}
          bg={colors.bgDeep}
          borderRadius="lg"
          border="1px solid"
          borderColor={colors.borderColor}
        >
          <HStack>
            <Square size="12px" bg={colors.accentGold} borderRadius="full" />
            <Text color={colors.labelColor} fontWeight="medium" fontSize="sm">
              Total Time
            </Text>
          </HStack>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={colors.headingText}
            fontFamily="'Poppins', 'Cairo', sans-serif"
          >
            {totalMinutes}
          </Text>
          <Text fontSize="xs" color={colors.mutedText}>minutes</Text>
        </VStack>

        <VStack
          align="flex-start"
          spacing={2}
          flex="1"
          minW="180px"
          p={4}
          bg={colors.bgDeep}
          borderRadius="lg"
          border="1px solid"
          borderColor={colors.borderColor}
        >
          <HStack>
            <Box w="16px" h="2px" bg="#10B981" my="auto" borderRadius="full" />
            <Text color={colors.labelColor} fontWeight="medium" fontSize="sm">
              Unique Calls
            </Text>
          </HStack>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={colors.headingText}
            fontFamily="'Poppins', 'Cairo', sans-serif"
          >
            {uniqueCalls}
          </Text>
        </VStack>

        <VStack
          align="flex-start"
          spacing={2}
          flex="1"
          minW="180px"
          p={4}
          bg={colors.bgDeep}
          borderRadius="lg"
          border="1px solid"
          borderColor={colors.borderColor}
        >
          <Text color={colors.labelColor} fontWeight="medium" fontSize="sm">
            Average Call Duration
          </Text>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={colors.headingText}
            fontFamily="'Poppins', 'Cairo', sans-serif"
          >
            {formatSeconds(avgMinutes * 60)}
          </Text>
        </VStack>
      </Flex>

      {/* Top Month Header */}
      {monthHeader && (
        <Text
          textAlign="center"
          fontSize="lg"
          fontWeight="bold"
          color={colors.accentGold}
          mb={4}
          fontFamily="'Poppins', 'Cairo', sans-serif"
        >
          {monthHeader}
        </Text>
      )}

      {/* Chart */}
      <Box h="60vh" w="100%" mb={4}>
        <canvas ref={chartRef} />
      </Box>

      {/* Month Range Summary */}
      <Divider my={4} borderColor={colors.borderColor} />
      <Flex justify="center" gap={6} wrap="wrap">
        {monthRanges.map((range, i) => (
          <Text
            key={i}
            fontSize="sm"
            color={colors.mutedText}
            fontWeight="medium"
            _hover={{ color: colors.accentGold }}
            transition="color 0.2s"
          >
            {range}
          </Text>
        ))}
      </Flex>
    </Box>
  );
}