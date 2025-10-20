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
  Label,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
} from "@chakra-ui/react";
import { FiMaximize2 } from "react-icons/fi";
import {
  BsPeopleFill,
  BsCalendarDate,
  BsPieChartFill,
  BsDiagram3,
  BsTelephoneFill,
  BsCheckCircleFill,
  BsXCircleFill,
  BsPersonFill,
} from "react-icons/bs";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
import moment from "moment";

const COLORS = [
  "#B8860B",
  "#C0A060",
  "#A67B5B",
  "#8B7500",
  "#E6BE8A",
  "#C5B358",
  "#DAA520",
  "#D4AF37",
  "#C9AE5D",
  "#F0E68C",
  "#C0A060",
  "#E1C16E",
  "#CFB53B",
  "#BFA76F",
  "#D9B611",
  "#FFD700",
];

const TooltipBox = ({ children }) => (
  <Box bg="gray.800" color="white" p={3} rounded="md" fontSize="xs">
    {children}
  </Box>
);

const CustomBarTooltip = ({ active, payload }) =>
  active && payload?.length ? (
    <TooltipBox>
      <Text fontWeight="bold">{payload[0].payload.fullName}</Text>
      <Text display="flex" alignItems="center" gap={1}>
        <BsTelephoneFill /> Total: {payload[0].payload.total}
      </Text>
      <Text display="flex" alignItems="center" gap={1}>
        <BsCheckCircleFill color="green"/> Answered: {payload[0].payload.answered}
      </Text>
      <Text display="flex" alignItems="center" gap={1}>
        <BsXCircleFill color="red"/> Unanswered: {payload[0].payload.unanswered}
      </Text>
      <Text>⏱ Duration: {payload[0].payload.duration}s</Text>
    </TooltipBox>
  ) : null;

const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    const sorted = [...payload].sort((a, b) => b.value - a.value);
    return (
      <TooltipBox>
        <Text fontWeight="bold" display="flex" alignItems="center" gap={1}>
          <BsCalendarDate /> {label}
        </Text>
        {sorted.map((p, i) => (
          <Text key={i} display={"flex"} gap={1} alignItems={"center"}>
            <Box
              w="10px"
              h="10px"
              borderRadius="50%"
              bg={p.color || "gray.400"}
            />{" "}
            {p.name}: {p.value} calls
          </Text>
        ))}
      </TooltipBox>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) =>
  active && payload?.length ? (
    <TooltipBox>
      <Text fontWeight="bold" display="flex" alignItems="center" gap={1}>
        <BsPersonFill /> {payload[0].payload.fullName}
      </Text>
      <Text display="flex" alignItems="center" gap={1}>
        <BsCheckCircleFill color="green"/> Answered: {payload[0].payload.answered}
      </Text>
      <Text display="flex" alignItems="center" gap={1}>
        <BsXCircleFill color="red"/> Unanswered: {payload[0].payload.unanswered}
      </Text>
    </TooltipBox>
  ) : null;

const CustomRadarTooltip = ({ active, payload }) =>
  active && payload?.length ? (
    <TooltipBox>
      <Text fontWeight="bold" display="flex" alignItems="center" gap={1}>
        <BsPersonFill /> {payload[0].payload.fullName}
      </Text>
      <Text display="flex" alignItems="center" gap={1}>
        <BsTelephoneFill /> Total Calls: {payload[0].payload.total_calls}
      </Text>
      <Text display="flex" alignItems="center" gap={1}>
        <BsCheckCircleFill color="green"/> Answered: {payload[0].payload.answered}
      </Text>
      <Text display="flex" alignItems="center" gap={1}>
        <BsXCircleFill color="red"/> Unanswered: {payload[0].payload.unanswered}
      </Text>
      <Text>⏱ Avg Duration: {payload[0].payload.avg_duration_min} min</Text>
    </TooltipBox>
  ) : null;

const UserChartAnalytics = ({
  graphData,
  loading,
  loadingAnalytics,
  selectedChart,
  setSelectedChart,
  isOpen,
  onOpen,
  onClose,
  month,
  year,
}) => {
  const bgCard = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const gridColor = useColorModeValue("#e5e7eb", "#4b5563");
  const borderColor = useColorModeValue("gray.200", "#4b5563");

  const tickFontSize = useBreakpointValue({ base: 9, sm: 10, md: 12 });
  const labelFontSize = useBreakpointValue({ base: 8, sm: 10, md: 18 });
  const radarLabelFontSize = useBreakpointValue({ base: 8, sm: 10, md: 15 });
  const chartHeight = useBreakpointValue({
    base: 220,
    sm: 260,
    md: 320,
    lg: 360,
  });
  const modalChartHeight = useBreakpointValue({
    base: 320,
    sm: 520,
    md: 700,
    lg: 800,
  });
  const gridSpacing = useBreakpointValue({ base: 4, sm: 5, md: 6 });

  if (loading || loadingAnalytics) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={gridSpacing}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={chartHeight} borderRadius="2xl" />
        ))}
      </SimpleGrid>
    );
  }

  if (!graphData?.charts)
    return (
      <Box w="full" p="4" textAlign="center">
        <NoData label="User Graph Analytics" />
      </Box>
    );

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
    .map((item) =>
      agentMap[item.extension]
        ? { ...item, fullName: agentMap[item.extension] }
        : null
    )
    .filter(Boolean);

  const radarData = radar_chart
    .map((item) =>
      agentMap[item.extension]
        ? { ...item, fullName: agentMap[item.extension] }
        : null
    )
    .filter(Boolean);

  const formattedMonth = `${moment(`${year}-${month}`, "YYYY-M").format("MMM")} ${year}`;

  const generateRandomColors = (names) => {
    const colors = {};
    names.forEach((name) => {
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = Math.abs(hash) % 360;

      const saturation = 55 + Math.random() * 15;
      const lightness = 60 + Math.random() * 10;

      colors[name] = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    });
    return colors;
  };

  const colorMap = generateRandomColors(agentNames);
  const renderChart = (type, height = chartHeight) => {
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={top_10_agents}
              margin={{
                top: 20,
                right: 30,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#d3d3d3" />
              <XAxis
                dataKey="fullName"
                tick={{ fontSize: tickFontSize }}
                interval={0}
                angle={0}
                textAnchor="middle"
                tickFormatter={(fullName) => fullName.split(" ")[0]}
              />
              <YAxis tick={{ fontSize: tickFontSize }} />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: 10,
                  fontSize: tickFontSize,
                  textTransform: "capitalize",
                }}
              />
              <Bar
                dataKey="answered"
                name="Answered"
                stackId="a"
                fill={COLORS[0]}
                barSize={30}
                radius={[5, 5, 0, 0]}
              />
              <Bar
                dataKey="unanswered"
                name="Unanswered"
                stackId="a"
                fill={COLORS[1]}
                barSize={30}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={formattedLineData}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => {
                  const d = new Date(date);
                  const day = d.getDate();
                  return `${day}`;
                }}
                tick={{ fontSize: tickFontSize }}
                angle={0}
                textAnchor="end"
              >
                <Label
                  value={formattedMonth}
                  offset={-25}
                  position="insideBottom"
                  style={{ fontSize: 15, fill: textColor }}
                />
              </XAxis>
              <YAxis tick={{ fontSize: tickFontSize }}>
                <Label
                  value="Total Calls"
                  angle={-90}
                  position="insideLeft"
                  style={{
                    textAnchor: "middle",
                    fontSize: 12,
                    fill: textColor,
                  }}
                />
              </YAxis>
              <Tooltip content={<CustomLineTooltip />} />
              {agentNames.map((name, idx) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={colorMap[name]}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Tooltip content={<CustomPieTooltip />} />
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                outerRadius="60%"
                innerRadius="35%"
                label={({ fullName }) => fullName.split(" ")[0]}
                dataKey="answered"
                labelLine={false}
              >
                {pieData.map((value, index) => (
                  <Cell key={index} fill={colorMap[value.fullName]} />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: tickFontSize }}
                formatter={(value, entry) => {
                  const name = entry?.payload?.fullName
                    ? entry.payload.fullName.split(" ")[0]
                    : value;
                  return name;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case "radar":
        return (
            <ResponsiveContainer width="100%" height={height} position={"relative"}
            zindex={1000}>
              <RadarChart data={radarData} style={{padding:10}}>
                <PolarGrid />
                <PolarAngleAxis
                  dataKey="fullName"
                  tick={{ fontSize: radarLabelFontSize, dy: 5,padding:10 }}
                  tickFormatter={(fullName) => {
                    const name = fullName.split(" ")[0];
                    return name;
                  }}
                  style={{padding:10}}
                />
                <PolarRadiusAxis tick={{ fontSize: tickFontSize }} />
                <Radar
                  name="Answered"
                  dataKey="answered"
                  stroke={COLORS[0]}
                  fill={COLORS[0]}
                  fillOpacity={0.6}
                />
                <Radar
                  name="Total Calls"
                  dataKey="total_calls"
                  stroke={COLORS[2]}
                  fill={COLORS[2]}
                  fillOpacity={0.4}
                />
                <Tooltip content={<CustomRadarTooltip />} />
                <Legend wrapperStyle={{ fontSize: tickFontSize }} />
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
            <Heading
              size="md"
              mb={3}
              color={textColor}
              display="flex"
              gap={2}
              alignItems="center"
            >
              {type === "bar" ? (
                <>
                  <BsPeopleFill /> Top 10 Agents
                </>
              ) : type === "line" ? (
                <>
                  <BsCalendarDate />
                  Calls Trend
                </>
              ) : type === "pie" ? (
                <>
                  <BsPieChartFill /> Answered vs Unanswered
                </>
              ) : (
                <>
                  <BsDiagram3 /> Agent Comparison
                </>
              )}
            </Heading>
            {renderChart(type)}
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent bg={bgCard} overflow="hidden">
          <ModalHeader borderBottom="1px solid" borderColor={borderColor}>
            {selectedChart === "all"
              ? "All Charts Overview"
              : selectedChart === "bar"
                ? "Top 10 Agents"
                : selectedChart === "line"
                  ? "Daily Calls Trend"
                  : selectedChart === "pie"
                    ? "Answered vs Unanswered"
                    : "Agent Comparison"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="auto" py={6}>
            {selectedChart === "all" ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {["bar", "line", "pie", "radar"].map((type, i) => (
                  <Box key={i}>{renderChart(type, modalChartHeight / 1.2)}</Box>
                ))}
              </SimpleGrid>
            ) : (
              <Box
                h="80vh"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {renderChart(selectedChart, modalChartHeight)}
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserChartAnalytics;
