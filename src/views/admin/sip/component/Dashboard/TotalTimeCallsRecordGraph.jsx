"use client"

import { useEffect, useRef } from "react"
import { Box, Flex, Heading, Text, Select, useColorModeValue, HStack, VStack, Square } from "@chakra-ui/react"
import Chart from "chart.js/auto"

const chartData = {
  labels: ["Mar 11", "Mar 17", "Mar 23", "Mar 29", "Apr 4", "Apr 10"],
  totalTime: [0, 0, 0, 0, 0, 1],
  uniqueCalls: [0, 0, 0, 0, 0, 2],
}

export default function TotalTimeCallsRecordGraph() {
  const bgColor = useColorModeValue("white", "gray.800")
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartRef && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")

      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: "Total Time",
              data: chartData.totalTime,
              backgroundColor: "#4299E1", 
              barPercentage: 0.5,
              categoryPercentage: 0.5,
              order: 2,
              yAxisID: "y",
            },
            {
              label: "Unique Calls",
              data: chartData.uniqueCalls,
              borderColor: "#38A169", 
              backgroundColor: "transparent",
              borderWidth: 2,
              type: "line",
              pointRadius: 0,
              tension: 0,
              order: 1,
              yAxisID: "y1",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                font: {
                  size: 12,
                },
                padding: 10,
                autoSkip: false,
                maxRotation: 25,
                minRotation: 25,
              },
              border: {
                display: false,
              },
            },
            y: {
              position: "left",
              min: 0,
              max: 2,
              ticks: {
                stepSize: 1,
                count: 3,
              },
              grid: {
                color: "#E2E8F0",
                drawBorder: false,
              },
              border: {
                display: false,
              },
            },
            y1: {
              position: "right",
              min: 0,
              max: 2,
              ticks: {
                stepSize: 1,
                count: 3,
              },
              grid: {
                display: false,
                drawBorder: false,
              },
              border: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
            },
          },
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <Box p={4} bg={bgColor} borderRadius="md" maxW="auto" mx={2} my={4}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg" fontWeight="bold">
          Total Time and Calls
        </Heading>
        <Select value="30 Days" w="180px" bg="gray.100" borderRadius="md" _hover={{ cursor: "pointer" }}>
          <option value="30 Days">30 Days</option>
          <option value="60 Days">60 Days</option>
          <option value="90 Days">90 Days</option>
        </Select>
      </Flex>

      <Flex justify="space-between" mb={10} wrap="wrap">
        {/* Total Time */}
        <VStack align="flex-start" spacing={1} minW="200px" mb={4}>
          <HStack>
            <Square size="16px" bg="blue.400" />
            <Text color="gray.600" fontWeight="medium">
              Total Time
            </Text>
          </HStack>
          <Text fontSize="2xl" fontWeight="bold">
            0 hrs 1 min
          </Text>
        </VStack>

        {/* Unique Calls */}
        <VStack align="flex-start" spacing={1} minW="200px" mb={4}>
          <HStack>
            <Box w="16px" h="2px" bg="green.400" my="auto" />
            <Text color="gray.600" fontWeight="medium">
              Unique Calls
            </Text>
          </HStack>
          <Text fontSize="2xl" fontWeight="bold">
            2
          </Text>
        </VStack>

        {/* Average Call Duration */}
        <VStack align="flex-start" spacing={1} minW="200px" mb={4}>
          <Text color="gray.600" fontWeight="medium">
            Average Call Duration
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            0 min 30 s
          </Text>
        </VStack>
      </Flex>

      {/* Chart */}
      <Box h="300px" w="100%">
        <canvas ref={chartRef} />
      </Box>
    </Box>
  )
}
