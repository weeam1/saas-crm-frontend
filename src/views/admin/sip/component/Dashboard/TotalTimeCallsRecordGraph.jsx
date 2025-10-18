"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Select,
  useColorModeValue,
  HStack,
  VStack,
  Square,
} from "@chakra-ui/react";
import Chart from "chart.js/auto";
import moment from "moment";
import { fetchTotalTimeCallsRecordStats } from "../../../../../services/sip/index";

const formatSeconds = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs > 0 ? `${hrs} hrs ` : ""}${mins} min${secs > 0 ? ` ${secs}s` : ""}`;
};

export default function TotalTimeCallsRecordGraph() {
  const [days, setDays] = useState(30);
  const [uniqueCalls, setUniqueCalls] = useState(0);
  const [avgMinutes, setAvgMinutes] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("#2D3748", "#E2E8F0");
  const gridColor = useColorModeValue("#EDF2F7", "#4A5568");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const updateChart = (data) => {
    const labels = data.daily.map((d) => moment(d.date).format("MMM DD"));

    const totalTime = data.daily.map(
      (d) => parseFloat(d.duration.replace("s", "")) / 60
    ); // in minutes
    const uniqueCalls = data.daily.map((d) => d.joinedCount);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

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
              gradient.addColorStop(0, "rgba(66,153,225,0.9)");
              gradient.addColorStop(1, "rgba(66,153,225,0.3)");
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
            data: uniqueCalls,
            borderColor: "#38A169",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointBackgroundColor: "#38A169",
            pointRadius: 4,
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
            grid: {
              display: false,
            },
            ticks: {
              font: { size: 12 },
              color: textColor,
              padding: 10,
              autoSkip: false,
              maxRotation: 25,
              minRotation: 25,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: gridColor,
              drawBorder: false,
            },
            ticks: {
              color: textColor,
              callback: (value) => `${value}`,
            },
            title: {
              display: true,
              text: "Total Time (min)",
              color: textColor,
              font: { size: 13, weight: "bold" },
            },
          },
          y1: {
            beginAtZero: true,
            grid: {
              display: false,
            },
            position: "right",
            ticks: {
              color: textColor,
              callback: (value) => `${value}`,
            },
            title: {
              display: true,
              text: "Unique Calls",
              color: textColor,
              font: { size: 13, weight: "bold" },
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: textColor,
              boxWidth: 15,
              padding: 15,
              font: { size: 13, weight: 500 },
            },
          },
          tooltip: {
            backgroundColor: "#1A202C",
            titleColor: "#fff",
            bodyColor: "#E2E8F0",
            borderWidth: 1,
            borderColor: "#2D3748",
            cornerRadius: 6,
            displayColors: true,
          },
        },
        animation: {
          duration: 1200,
          easing: "easeOutQuart",
        },
      },
    });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchTotalTimeCallsRecordStats(days);
        setUniqueCalls(data.unique_calls);
        setAvgMinutes(data.average_minutes);
        const durationInSeconds = parseFloat(
          data.allTime.duration.replace("s", "")
        );
        setTotalSeconds(durationInSeconds);
        updateChart(data);
      } catch (error) {
        console.error("Error loading chart data:", error);
      }
    };

    getData();

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [days]);

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="lg"
      shadow="md"
      mx={2}
      mt={-2}
      h="100%"
    >
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" fontWeight="bold" color={textColor}>
          Total Time and Calls
        </Heading>
        <Select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          w="160px"
          bg="gray.100"
          borderRadius="md"
          _hover={{ cursor: "pointer" }}
        >
          <option value={30}>30 Days</option>
          <option value={60}>60 Days</option>
          <option value={90}>90 Days</option>
        </Select>
      </Flex>

      <Flex justify="space-between" mb={8} wrap="wrap">
        <VStack align="flex-start" spacing={1} minW="200px" mb={4}>
          <HStack>
            <Square size="16px" bg="blue.400" />
            <Text color="gray.600" fontWeight="medium">
              Total Time
            </Text>
          </HStack>
          <Text fontSize="2xl" fontWeight="bold">
            {formatSeconds(totalSeconds)}
          </Text>
        </VStack>

        <VStack align="flex-start" spacing={1} minW="200px" mb={4}>
          <HStack>
            <Box w="16px" h="2px" bg="green.400" my="auto" />
            <Text color="gray.600" fontWeight="medium">
              Unique Calls
            </Text>
          </HStack>
          <Text fontSize="2xl" fontWeight="bold">
            {uniqueCalls}
          </Text>
        </VStack>
        <VStack align="flex-start" spacing={1} minW="200px" mb={4}>
          <Text color="gray.600" fontWeight="medium">
            Average Call Duration
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {formatSeconds(avgMinutes * 60)}
          </Text>
        </VStack>
      </Flex>

      <Box h="60vh" w="100%">
        <canvas ref={chartRef} />
      </Box>
    </Box>
  );
}
