import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const JoinedVsMadeCallGraph = () => {
  const [timeRange, setTimeRange] = useState('30 Days');
  const bgColor = useColorModeValue('white', 'gray.800');
  
  const labels = ['Mar 12', 'Mar 18', 'Mar 24', 'Mar 30', 'Apr 5', 'Apr 11'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Total Calls Made',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(237, 242, 247, 0.8)',
        borderWidth: 0,
        barPercentage: 0.5,
        categoryPercentage: 0.9,
      },
      {
        label: 'Total Calls Joined',
        data: [0, 0, 0, 0, 0, 2],
        backgroundColor: 'rgba(66, 153, 225, 0.9)',
        borderWidth: 0,
        barPercentage: 0.5,
        categoryPercentage: 0.9,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#666',
          font: {
            size: 11,
            family: 'Arial',
          },
          padding: 5,
          minRotation: 25,
          maxRotation: 25,
          autoSkip: false,
          align: 'middle',
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: 2,
        ticks: {
          stepSize: 1,
          color: '#666',
          font: {
            size: 11,
            family: 'Arial',
          },
          padding: 10,
          callback: function(value) {
            return value;
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.06)',
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 12,
        },
        padding: 10,
        displayColors: true,
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 20 + 25/2, 
      },
    },
    elements: {
      bar: {
        borderRadius: 0,
      },
    },
  };

  return (
    <Box p={4} bg={bgColor} borderRadius="md" maxW="auto" mx={2} my={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="md" fontWeight="bold" color="#000">
          Calls Made vs Joined
        </Heading>
        <Box 
          as="button"
          bg="#f5f5f5"
          borderRadius="md"
          px={4}
          py={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="120px"
        >
          <Text fontSize="sm" color="#333" fontWeight="medium">
            30 Days
          </Text>
          <ChevronDownIcon color="#666" />
        </Box>
      </Flex>

      <Flex mb={8} justify="space-between">
        <Box>
          <Flex align="center" mb={1}>
            <Box w="12px" h="12px" bg="rgba(237, 242, 247, 0.8)" mr={2} borderRadius="sm"></Box>
            <Text color="gray.600" fontSize="sm">Total Calls Made</Text>
          </Flex>
          <Text fontSize="3xl" fontWeight="bold" ml="20px">2</Text>
        </Box>
        
        <Box>
          <Flex align="center" mb={1}>
            <Box w="12px" h="12px" bg="rgba(66, 153, 225, 0.9)" mr={2} borderRadius="sm"></Box>
            <Text color="gray.600" fontSize="sm">Total Calls Joined</Text>
          </Flex>
          <Text fontSize="3xl" fontWeight="bold" ml="20px">2</Text>
        </Box>
        
        <Box textAlign="right">
          <Text color="gray.600" fontSize="sm" mb={1}>Acpt. Rate</Text>
          <Text fontSize="3xl" fontWeight="bold">100%</Text>
        </Box>
      </Flex>

      <Box height="350px" position="relative">
        <Bar data={data} options={options} />
      </Box>
      
    </Box>
  );
};

export default JoinedVsMadeCallGraph;

