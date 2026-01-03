"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Skeleton,
  useColorModeValue,
} from "@chakra-ui/react";
import Chart from "chart.js/auto";

const SurveyGraph = ({ data, isLoading, isFetching }) => {
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const [lineChart, setLineChart] = useState(null);
  const [pieChart, setPieChart] = useState(null);
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const skeletonColor = useColorModeValue("gray.100", "gray.700");

  // Vibrant color palette
  const chartColors = {
    line: "#6C5CE7",
    areaFill: "rgba(108, 92, 231, 0.1)",
    pie: ["#00B894", "#FDCB6E", "#E17055", "#0984E3", "#6C5CE7"],
  };

  useEffect(() => {
    // Cleanup function
    return () => {
      if (lineChart) {
        lineChart.destroy();
      }
      if (pieChart) {
        pieChart.destroy();
      }
    };
  }, [lineChart, pieChart]);

  useEffect(() => {
    if (isLoading || !data) return;

    // Destroy existing charts
    if (lineChart) {
      lineChart.destroy();
    }
    if (pieChart) {
      pieChart.destroy();
    }

    // Create Line Chart
    if (lineChartRef.current) {
      const lineCtx = lineChartRef.current.getContext("2d");
      const newLineChart = new Chart(lineCtx, {
        type: "line",
        data: {
          labels: data.lineChart.labels,
          datasets: [
            {
              label: data.lineChart.datasets[0].label,
              data: data.lineChart.datasets[0].data,
              borderColor: chartColors.line,
              backgroundColor: chartColors.areaFill,
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: chartColors.line,
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: textColor },
            },
            y: {
              beginAtZero: true,
              grid: { color: "rgba(255,255,255,0.1)" },
              ticks: { color: textColor },
            },
          },
        },
      });
      setLineChart(newLineChart);
    }

    // Create Pie Chart
    if (pieChartRef.current) {
      const pieCtx = pieChartRef.current.getContext("2d");
      const newPieChart = new Chart(pieCtx, {
        type: "doughnut",
        data: {
          labels: data.pieChart.labels,
          datasets: [
            {
              data: data.pieChart.datasets[0].data,
              backgroundColor: chartColors.pie,
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "65%",
          plugins: {
            legend: {
              position: "right",
              labels: { color: textColor },
            },
          },
        },
      });
      setPieChart(newPieChart);
    }
  }, [data, isLoading, textColor]);

  return (
    <Flex direction={{ base: "column", lg: "row" }} gap={6} mt={8}>
      {/* Line Chart */}
      <Box
        flex={2}
        bg={bgColor}
        p={5}
        borderRadius="12px"
        boxShadow="sm"
        position="relative"
      >
        <Heading size="md" mb={4} color={textColor}>
          Responses Over Time
        </Heading>
        <Box h="300px" position="relative">
          {(isLoading || isFetching) && (
            <Skeleton
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              borderRadius="8px"
              opacity={0.8}
              bg={skeletonColor}
            />
          )}
          <canvas
            ref={lineChartRef}
            style={{ display: isLoading ? "none" : "block" }}
          />
        </Box>
      </Box>

      {/* Pie Chart */}
      <Box
        flex={1}
        bg={bgColor}
        p={5}
        borderRadius="12px"
        boxShadow="sm"
        position="relative"
      >
        <Heading size="md" mb={4} color={textColor}>
          Response Distribution
        </Heading>
        <Box h="300px" position="relative">
          {(isLoading || isFetching) && (
            <Skeleton
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              borderRadius="8px"
              opacity={0.8}
              bg={skeletonColor}
            />
          )}
          <canvas
            ref={pieChartRef}
            style={{ display: isLoading ? "none" : "block" }}
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default SurveyGraph;
