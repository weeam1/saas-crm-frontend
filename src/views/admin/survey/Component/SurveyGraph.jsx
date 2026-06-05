// import { useEffect, useRef, useState } from "react";
// import {
//   Box,
//   Flex,
//   Heading,
//   Skeleton,
//   useColorModeValue,
// } from "@chakra-ui/react";
// import Chart from "chart.js/auto";

// const SurveyGraph = ({ data, isLoading, isFetching }) => {
//   const lineChartRef = useRef(null);
//   const pieChartRef = useRef(null);
//   const [lineChart, setLineChart] = useState(null);
//   const [pieChart, setPieChart] = useState(null);
//   const bgColor = useColorModeValue("white", "gray.800");
//   const textColor = useColorModeValue("gray.800", "white");
//   const skeletonColor = useColorModeValue("gray.100", "gray.700");

//   // Vibrant color palette
//   const chartColors = {
//     line: "#6C5CE7",
//     areaFill: "rgba(108, 92, 231, 0.1)",
//     pie: ["#00B894", "#FDCB6E", "#E17055", "#0984E3", "#6C5CE7"],
//   };

//   useEffect(() => {
//     // Cleanup function
//     return () => {
//       if (lineChart) {
//         lineChart.destroy();
//       }
//       if (pieChart) {
//         pieChart.destroy();
//       }
//     };
//   }, [lineChart, pieChart]);

//   useEffect(() => {
//     if (isLoading || !data) return;

//     // Destroy existing charts
//     if (lineChart) {
//       lineChart.destroy();
//     }
//     if (pieChart) {
//       pieChart.destroy();
//     }

//     // Create Line Chart
//     if (lineChartRef.current) {
//       const lineCtx = lineChartRef.current.getContext("2d");
//       const newLineChart = new Chart(lineCtx, {
//         type: "line",
//         data: {
//           labels: data.lineChart.labels,
//           datasets: [
//             {
//               label: data.lineChart.datasets[0].label,
//               data: data.lineChart.datasets[0].data,
//               borderColor: chartColors.line,
//               backgroundColor: chartColors.areaFill,
//               borderWidth: 3,
//               tension: 0.4,
//               fill: true,
//               pointBackgroundColor: chartColors.line,
//               pointRadius: 5,
//               pointHoverRadius: 7,
//             },
//           ],
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           plugins: {
//             legend: { display: false },
//           },
//           scales: {
//             x: {
//               grid: { display: false },
//               ticks: { color: textColor },
//             },
//             y: {
//               beginAtZero: true,
//               grid: { color: "rgba(255,255,255,0.1)" },
//               ticks: { color: textColor },
//             },
//           },
//         },
//       });
//       setLineChart(newLineChart);
//     }

//     // Create Pie Chart
//     if (pieChartRef.current) {
//       const pieCtx = pieChartRef.current.getContext("2d");
//       const newPieChart = new Chart(pieCtx, {
//         type: "doughnut",
//         data: {
//           labels: data.pieChart.labels,
//           datasets: [
//             {
//               data: data.pieChart.datasets[0].data,
//               backgroundColor: chartColors.pie,
//               borderWidth: 0,
//             },
//           ],
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           cutout: "65%",
//           plugins: {
//             legend: {
//               position: "right",
//               labels: { color: textColor },
//             },
//           },
//         },
//       });
//       setPieChart(newPieChart);
//     }
//   }, [data, isLoading, textColor]);

//   return (
//     <Flex direction={{ base: "column", lg: "row" }} gap={6} mt={8}>
//       {/* Line Chart */}
//       <Box
//         flex={2}
//         bg={bgColor}
//         p={5}
//         borderRadius="12px"
//         boxShadow="sm"
//         position="relative"
//       >
//         <Heading size="md" mb={4} color={textColor}>
//           Responses Over Time
//         </Heading>
//         <Box h="300px" position="relative">
//           {(isLoading || isFetching) && (
//             <Skeleton
//               position="absolute"
//               top={0}
//               left={0}
//               right={0}
//               bottom={0}
//               borderRadius="8px"
//               opacity={0.8}
//               bg={skeletonColor}
//             />
//           )}
//           <canvas
//             ref={lineChartRef}
//             style={{ display: isLoading ? "none" : "block" }}
//           />
//         </Box>
//       </Box>

//       {/* Pie Chart */}
//       <Box
//         flex={1}
//         bg={bgColor}
//         p={5}
//         borderRadius="12px"
//         boxShadow="sm"
//         position="relative"
//       >
//         <Heading size="md" mb={4} color={textColor}>
//           Response Distribution
//         </Heading>
//         <Box h="300px" position="relative">
//           {(isLoading || isFetching) && (
//             <Skeleton
//               position="absolute"
//               top={0}
//               left={0}
//               right={0}
//               bottom={0}
//               borderRadius="8px"
//               opacity={0.8}
//               bg={skeletonColor}
//             />
//           )}
//           <canvas
//             ref={pieChartRef}
//             style={{ display: isLoading ? "none" : "block" }}
//           />
//         </Box>
//       </Box>
//     </Flex>
//   );
// };

// export default SurveyGraph;

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Skeleton,
} from "@chakra-ui/react";
import Chart from "chart.js/auto";

const SurveyGraph = ({ data, isLoading, isFetching }) => {
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const [lineChart, setLineChart] = useState(null);
  const [pieChart, setPieChart] = useState(null);

  // Fixed theme colors (no useColorModeValue)
  const bgColor = "bg.surface";
  const textColor = "text.body";
  const borderColor = "border.default";

  // Navy/Gold theme color palette
  const chartColors = {
    line: "#D4AF37", // Gold primary
    areaFill: "rgba(212, 175, 55, 0.1)",
    pie: ["#D4AF37", "#C9A227", "#F5D67B", "#B8901E", "#9A7818", "#7B6012"],
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
              borderWidth: 2,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: chartColors.line,
              pointBorderColor: "#000000",
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBorderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: "rgba(11, 28, 44, 0.95)",
              titleColor: "#FFFFFF",
              bodyColor: "#B0B0B0",
              borderColor: "#D4AF37",
              borderWidth: 1,
              borderRadius: 8,
              padding: 10,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
                drawBorder: true,
                borderColor: borderColor,
              },
              ticks: {
                color: "#fff",
                font: { size: 11 },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(212, 175, 55, 0.08)",
                drawBorder: true,
                borderColor: borderColor,
              },
              ticks: {
                color: "#fff",
                font: { size: 11 },
              },
            },
          },
        },
      });
      setLineChart(newLineChart);
    }

    // Create Pie/Doughnut Chart
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
              hoverOffset: 8,
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
              labels: {
                color: "text.body",
                font: { size: 11 },
                boxWidth: 12,
                padding: 10,
              },
            },
            tooltip: {
              backgroundColor: "rgba(11, 28, 44, 0.95)",
              titleColor: "#FFFFFF",
              bodyColor: "#B0B0B0",
              borderColor: "#D4AF37",
              borderWidth: 1,
              borderRadius: 8,
              padding: 10,
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            },
          },
        },
      });
      setPieChart(newPieChart);
    }
  }, [data, isLoading, borderColor]);

  return (
    <Flex direction={{ base: "column", lg: "row" }} gap={6} mt={8}>
      {/* Line Chart */}
      <Box
        flex={2}
        bg={bgColor}
        p={5}
        borderRadius="xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="card"
        position="relative"
      >
        <Heading size="sm" mb={4} color="text.heading" fontSize="16px">
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
              borderRadius="lg"
              opacity={0.8}
              startColor="rgba(212, 175, 55, 0.08)"
              endColor="rgba(26, 53, 80, 0.15)"
            />
          )}
          <canvas
            ref={lineChartRef}
            style={{ display: isLoading ? "none" : "block" }}
          />
        </Box>
      </Box>

      {/* Pie/Doughnut Chart */}
      <Box
        flex={1}
        bg={bgColor}
        p={5}
        borderRadius="xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="card"
        position="relative"
      >
        <Heading size="sm" mb={4} color="text.heading" fontSize="16px">
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
              borderRadius="lg"
              opacity={0.8}
              startColor="rgba(212, 175, 55, 0.08)"
              endColor="rgba(26, 53, 80, 0.15)"
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