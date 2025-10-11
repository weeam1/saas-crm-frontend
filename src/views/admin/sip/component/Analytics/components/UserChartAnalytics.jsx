import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarRadiusAxis,
  PolarAngleAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Box,
  Heading,
  SimpleGrid,
  useColorModeValue,
  Skeleton,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";

const COLORS = ["#3B82F6", "#F97316", "#10B981", "#8B5CF6", "#EF4444"];

const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <Box bg="gray.800" color="white" p={3} rounded="md" fontSize="sm">
        <Text fontWeight="bold">{d.fullName}</Text>
        <Text>📞 Total: {d.total}</Text>
        <Text>✅ Answered: {d.answered}</Text>
        <Text>❌ Unanswered: {d.unanswered}</Text>
        <Text>⏱ Duration: {d.duration}s</Text>
      </Box>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <Box bg="gray.800" color="white" p={3} rounded="md" fontSize="sm">
        <Text fontWeight="bold">👤 {d.fullName}</Text>
        <Text>✅ Answered: {d.answered}</Text>
        <Text>❌ Unanswered: {d.unanswered}</Text>
      </Box>
    );
  }
  return null;
};

const CustomRadarTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const data = payload[0].payload;
    return (
      <Box
        bg="gray.800"
        color="white"
        p={3}
        rounded="md"
        shadow="lg"
        fontSize="sm"
      >
        <Text fontWeight="bold" mb={1}>
          👤 {data.fullName}
        </Text>
        <Text>📞 Total Calls: {data.total_calls}</Text>
        <Text>✅ Answered: {data.answered}</Text>
        <Text>❌ Unanswered: {data.unanswered}</Text>
        <Text>⏱ Avg Duration: {data.avg_duration_min} min</Text>
      </Box>
    );
  }
  return null;
};

const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <Box
        bg="gray.800"
        color="white"
        p={3}
        rounded="md"
        shadow="lg"
        fontSize="sm"
      >
        <Text fontWeight="bold" mb={1}>
          📅 {label}
        </Text>
        {payload.map((entry, idx) => {
          if (!entry.value) return null;
          return (
            <Text key={idx}>
              👤 {entry.name} — 📞 Calls: {entry.value}
            </Text>
          );
        })}
      </Box>
    );
  }
  return null;
};

const UserChartAnalytics = ({ graphData, loading }) => {
  const bgCard = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const gridColor = useColorModeValue("#e5e7eb", "#4b5563");
  const borderColor = useColorModeValue("gray.200", "#4b5563");

  // Responsive sizes
  const tickFontSize = useBreakpointValue({ base: 9, sm: 10, md: 11 });
  const chartHeight = useBreakpointValue({ base: 220, sm: 250, md: 300 });
  const headingSize = useBreakpointValue({ base: "xs", sm: "sm", md: "sm" });

  if (loading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={chartHeight} borderRadius="2xl" />
        ))}
      </SimpleGrid>
    );
  }

  if (!graphData?.charts) {
    return (
      <Box w="full" p="4" textAlign="center">
        <NoData label="user graph analytics" />
      </Box>
    );
  }

  const { top_10_agents, line_chart, radar_chart, answered_vs_unanswered } =
    graphData.charts;

  const agentMap = {};
  top_10_agents?.forEach((a) => {
    if (a.fullName) agentMap[a.extension] = a.fullName;
  });

  const formattedLineData = line_chart.map((d) => {
    const newObj = { date: d.date };
    Object.keys(d)
      .filter((k) => k !== "date")
      .forEach((ext) => {
        const name = agentMap[ext];
        if (name) newObj[name] = d[ext];
      });
    return newObj;
  });

  const agentNames = Object.keys(formattedLineData[0] || {}).filter(
    (k) => k !== "date"
  );

  const pieData = answered_vs_unanswered
    .map((item) => {
      const name = agentMap[item.extension];
      return name ? { ...item, fullName: name } : null;
    })
    .filter(Boolean);

  const radarData = radar_chart
    .map((item) => {
      const name = agentMap[item.extension];
      return name ? { ...item, fullName: name } : null;
    })
    .filter(Boolean);

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 8 }} mt={6}>
      {/* Top Agents Bar Chart */}
      <Box
        bg={bgCard}
        p={{ base: 3, md: 5 }}
        rounded="2xl"
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
      >
        <Heading size={headingSize} mb={4} color={textColor}>
          🧑‍💼 Top 10 Agents (Total Calls)
        </Heading>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={top_10_agents
              .map((a) => {
                const name = agentMap[a.extension];
                return name ? { ...a, fullName: name } : null;
              })
              .filter(Boolean)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="fullName"
              tick={{ fontSize: tickFontSize }}
              angle={-30}
              textAnchor="end"
              interval={0}
              height={50}
            />
            <YAxis />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar dataKey="answered" fill="#3B82F6" />
            <Bar dataKey="unanswered" fill="#F97316" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Daily Calls Line Chart */}
      <Box
        bg={bgCard}
        p={{ base: 3, md: 5 }}
        rounded="2xl"
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
      >
        <Heading size={headingSize} mb={4} color={textColor}>
          📅 Daily Calls Trend (By Agent)
        </Heading>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={formattedLineData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" tick={{ fontSize: tickFontSize }} />
            <YAxis />
            <Tooltip content={<CustomLineTooltip />} />
            {agentNames.map((name, index) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                name={name}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Pie Chart */}
      <Box
        bg={bgCard}
        p={{ base: 3, md: 5 }}
        rounded="2xl"
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
      >
        <Heading size={headingSize} mb={4} color={textColor}>
          🥧 Answered vs Unanswered (By Agent)
        </Heading>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Tooltip content={<CustomPieTooltip />} />
            <Pie
              data={pieData}
              dataKey="answered"
              cx="50%"
              cy="50%"
              outerRadius={chartHeight / 4}
              labelLine={false}
              label={false}
              isAnimationActive={false}
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Radar Chart */}
      <Box
        bg={bgCard}
        p={{ base: 3, md: 5 }}
        rounded="2xl"
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
      >
        <Heading size={headingSize} mb={4} color={textColor}>
          🕸 Agent Comparison (Avg Duration)
        </Heading>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="80%"
            data={radarData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <defs>
              <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="answeredGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <PolarGrid stroke={gridColor} strokeDasharray="3 3" radialLines />
            {/* <PolarAngleAxis
              dataKey="fullName"
              tick={{ fontSize: tickFontSize, fill: textColor }}
              tickLine={false}
            /> */}
            <PolarRadiusAxis
              angle={30}
              tick={{ fontSize: tickFontSize, fill: textColor }}
            />
            <Radar
              name="Total Calls"
              dataKey="total_calls"
              stroke="#3B82F6"
              fill="url(#totalGradient)"
              fillOpacity={1}
              strokeWidth={2}
              dot={{ fill: "#3B82F6", r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
            <Radar
              name="Answered"
              dataKey="answered"
              stroke="#10B981"
              fill="url(#answeredGradient)"
              fillOpacity={1}
              strokeWidth={2}
              dot={{ fill: "#10B981", r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
            <Tooltip content={<CustomRadarTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: tickFontSize, color: textColor }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Box>
    </SimpleGrid>
  );
};

export default UserChartAnalytics;
