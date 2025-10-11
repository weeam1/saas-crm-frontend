import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Box, Heading, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";

const COLORS = ["#3B82F6", "#F97316", "#10B981", "#8B5CF6", "#EAB308"];

const UserChartAnalytics = ({ analytics }) => {
  const bgCard = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const gridColor = useColorModeValue("#e5e7eb", "#4b5563");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  if (!analytics?.length)
    return (
      <Box w="full" p="4" textAlign="center">
        <NoData label="user analytics records" />
      </Box>
    );

  // Prepare data
  const barData = analytics.map((item, index) => ({
    id: index + 1,
    fullName: item.fullName || "N/A",
    Answered: item.answered?.month || 0,
    Unanswered: item.unanswered?.month || 0,
  }));

  const totalAnswered = barData.reduce((a, b) => a + b.Answered, 0);
  const totalUnanswered = barData.reduce((a, b) => a + b.Unanswered, 0);

  const pieData = [
    { name: "Answered", value: totalAnswered },
    { name: "Unanswered", value: totalUnanswered },
  ];

  const radarData = barData.map((item) => ({
    fullName: item.fullName,
    Answered: item.Answered,
    Unanswered: item.Unanswered,
  }));

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
      {/* Bar Chart */}
      <Box
        bg={bgCard}
        p={5}
        rounded="2xl"
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
      >
        <Heading size="sm" mb={4} color={textColor}>
          📊 Answered vs Unanswered per Agent
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={barData}
            margin={{ top: 30, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="id"
              tick={{ fill: textColor, fontSize: 12 }}
              label={{ value: "Agents", position: "insideBottom", dy: 10 }}
            />
            <YAxis tick={{ fill: textColor, fontSize: 12 }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <Box
                      bg={bgCard}
                      p={3}
                      borderRadius="md"
                      boxShadow="md"
                      border={`1px solid ${gridColor}`}
                    >
                      <strong>{data.fullName}</strong>
                      <br />
                      <span>Answered: {data.Answered}</span>
                      <br />
                      <span>Unanswered: {data.Unanswered}</span>
                    </Box>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" wrapperStyle={{ marginBottom: 10 }} />
            <Bar dataKey="Answered" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Unanswered" fill="#F97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Pie Chart */}
      <Box
        bg={bgCard}
        p={5}
        rounded="2xl"
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
      >
        <Heading size="sm" mb={4} color={textColor}>
          🥧 Team Summary: Total Answered vs Unanswered
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart margin={{ top: 20 }}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: bgCard,
                border: `1px solid ${gridColor}`,
              }}
            />
            <Legend verticalAlign="bottom" wrapperStyle={{ marginTop: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Line Chart */}
      <Box
        bg={bgCard}
        p={5}
        rounded="2xl"
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
      >
        <Heading size="sm" mb={4} color={textColor}>
          📈 Monthly Calls Trend
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={barData}
            margin={{ top: 30, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="id"
              tick={{ fill: textColor, fontSize: 12 }}
              label={{ value: "Agents", position: "insideBottom", dy: 10 }}
            />
            <YAxis tick={{ fill: textColor, fontSize: 12 }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <Box
                      bg={bgCard}
                      p={3}
                      borderRadius="md"
                      boxShadow="md"
                      border={`1px solid ${gridColor}`}
                    >
                      <strong>{data.fullName}</strong>
                      <br />
                      <span>Answered: {data.Answered}</span>
                      <br />
                      <span>Unanswered: {data.Unanswered}</span>
                    </Box>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" wrapperStyle={{ marginBottom: 10 }} />
            <Line
              type="monotone"
              dataKey="Answered"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Unanswered"
              stroke="#F97316"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Radar Chart */}
      <Box
        bg={bgCard}
        p={5}
        rounded="2xl"
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
      >
        <Heading size="sm" mb={4} color={textColor}>
          🕸 Agent Comparison
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData} margin={{ top: 30, bottom: 10 }}>
            <PolarGrid stroke={gridColor} />
            <PolarRadiusAxis tick={{ fill: textColor }} />
            <Radar
              name="Answered"
              dataKey="Answered"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.5}
            />
            <Radar
              name="Unanswered"
              dataKey="Unanswered"
              stroke="#F97316"
              fill="#F97316"
              fillOpacity={0.5}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <Box
                      bg={bgCard}
                      p={3}
                      borderRadius="md"
                      boxShadow="md"
                      border={`1px solid ${gridColor}`}
                    >
                      <strong>{data.fullName}</strong>
                      <br />
                      <span>Answered: {data.Answered}</span>
                      <br />
                      <span>Unanswered: {data.Unanswered}</span>
                    </Box>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" wrapperStyle={{ marginBottom: 10 }} />
          </RadarChart>
        </ResponsiveContainer>
      </Box>
    </SimpleGrid>
  );
};

export default UserChartAnalytics;
