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
  Legend
} from "recharts";
import {
  Box,
  Heading,
  SimpleGrid,
  useColorModeValue,
  Skeleton,
  Text,
  useBreakpointValue,
  IconButton,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";

import { FiMaximize2 } from "react-icons/fi";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";

//brand variation colors
const COLORS = ["#D4AF37", "#B8860B", "#FFD700", "#C0A060", "#8B7500"];

// Tooltips 
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
      <Box bg="gray.800" color="white" p={3} rounded="md" fontSize="xs">
        <Text fontWeight="bold">👤 {data.fullName}</Text>
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
      <Box bg="gray.800" color="white" p={3} rounded="md" fontSize="xs">
        <Text fontWeight="bold">📅 {label}</Text>
        {payload.map((entry, idx) => (
          <Text key={idx}>
            👤 {entry.name}: {entry.value} calls
          </Text>
        ))}
      </Box>
    );
  }
  return null;
};

//  Main Component 
const UserChartAnalytics = ({ graphData, loading, selectedChart, setSelectedChart,  isOpen, onOpen, onClose }) => {

  const bgCard = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const gridColor = useColorModeValue("#e5e7eb", "#4b5563");
  const borderColor = useColorModeValue("gray.200", "#4b5563");

  const tickFontSize = useBreakpointValue({ base: 8, sm: 9, md: 11 });
  const chartHeight = useBreakpointValue({
    base: 200,
    sm: 240,
    md: 300,
    lg: 360,
  });
  const headingSize = useBreakpointValue({ base: "sm", sm: "md" });
  const gridSpacing = useBreakpointValue({ base: 4, sm: 5, md: 6 });
  const labelFontSize = useBreakpointValue({ base: 8, sm: 10, md: 12 });
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  // Data handling 
  if (loading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={gridSpacing}>
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
    const obj = { date: d.date };
    Object.keys(d)
      .filter((k) => k !== "date")
      .forEach((ext) => {
        const name = agentMap[ext];
        if (name) obj[name] = d[ext];
      });
    return obj;
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

  //Render Charts 
  const renderChart = (type) => {
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={top_10_agents}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="fullName" tick={{ fontSize: tickFontSize }} />
              <YAxis tick={{ fontSize: tickFontSize }} />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="answered" fill={COLORS[0]} />
              <Bar dataKey="unanswered" fill={COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={formattedLineData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" tick={{ fontSize: tickFontSize }} />
              <YAxis tick={{ fontSize: tickFontSize }} />
              <Tooltip content={<CustomLineTooltip />} />
              {agentNames.map((name, idx) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={COLORS[idx % COLORS.length]}
                  strokeWidth={1.5}
                  dot={{ r: isSmallScreen ? 1 : 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
        // Custom label renderer
        const renderCustomLabel = ({
          cx,
          cy,
          midAngle,
          innerRadius,
          outerRadius,
          percent,
          fullName,
        }) => {
          const RADIAN = Math.PI / 180;
          const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);

          // Responsive font size
          const fontSize =
            window.innerWidth < 400 ? 8 : window.innerWidth < 768 ? 10 : 12;

          return (
            <text
              x={x}
              y={y}
              fill="#333"
              textAnchor={x > cx ? "start" : "end"}
              dominantBaseline="central"
              fontSize={fontSize}
              fontWeight="600"
            >
              {fullName}
            </text>
          );
        };

        return (
          <Box
            w="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            h={{ base: "220px", sm: "260px", md: "320px", lg: "360px" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomPieTooltip />} />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={
                    window.innerWidth < 400
                      ? 60
                      : window.innerWidth < 768
                        ? 80
                        : 100
                  }
                  innerRadius={
                    window.innerWidth < 400
                      ? 30
                      : window.innerWidth < 768
                        ? 45
                        : 60
                  }
                  paddingAngle={2}
                  dataKey="answered"
                  label={renderCustomLabel}
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
        );

      case "radar":
        return (
          <ResponsiveContainer width="100%" height={chartHeight + 20}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis
                dataKey="fullName"
                tick={{ fontSize: labelFontSize }}
              />
              <PolarRadiusAxis tick={{ fontSize: tickFontSize }} />
              <Radar
                dataKey="answered"
                stroke={COLORS[2]}
                fill={COLORS[2]}
                fillOpacity={0.5}
              />
                 <Radar
                dataKey="total_calls"
                stroke={COLORS[1]}
                fill={COLORS[1]}
                fillOpacity={0.5}
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
        );

      default:
        return null;
    }
  };

  return (
    <Box w="full" px={[2, 3, 4, 6]}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={gridSpacing} mt={4}>
        {["bar", "line", "pie", "radar"].map((type, i) => (
          <Box
            key={i}
            bg={bgCard}
            p={4}
            rounded="xl"
            shadow="sm"
            border="1px solid"
            borderColor={borderColor}
            position="relative"
          >
            <IconButton
              icon={<FiMaximize2 size={16} />}
              position="absolute"
              top={3}
              right={3}
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedChart(type);
                onOpen();
              }}
              aria-label="Expand Chart"
            />
            <Heading size={headingSize} mb={2} color={textColor}>
              {type === "bar"
                ? "🧑‍💼 Top 10 Agents"
                : type === "line"
                  ? "📅 Daily Calls Trend"
                  : type === "pie"
                    ? "🥧 Answered vs Unanswered"
                    : "🕸 Agent Comparison"}
            </Heading>
            {renderChart(type)}
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay />
        <ModalContent bg="white" p={4}>
          <ModalCloseButton />
          <ModalBody>
            {selectedChart === "all" ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {["bar", "line", "pie", "radar"].map((type, i) => (
                  <Box key={i}>{renderChart(type)}</Box>
                ))}
              </SimpleGrid>
            ) : (
              <Box
                h="90vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {renderChart(selectedChart)}
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserChartAnalytics;
