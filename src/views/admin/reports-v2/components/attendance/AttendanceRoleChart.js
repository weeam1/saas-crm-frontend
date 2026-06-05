// // import {
// // 	ResponsiveContainer,
// // 	BarChart,
// // 	Bar,
// // 	XAxis,
// // 	YAxis,
// // 	CartesianGrid,
// // 	Tooltip,
// // 	LabelList,
// // 	Cell,
// // } from 'recharts';
// // import { Box, HStack, Text } from '@chakra-ui/react';
// // import NoData from 'components/Message/NoData';

// // const AttendanceRoleChart = ({ data }) => {
// // 	const chartData = (data?.roleNames || []).map((name, i) => ({
// // 		name,
// // 		value: data?.roleCounts?.[i] ?? 0,
// // 	}));

// // 	const colors = ['#D99A36'];
// // console.log(chartData,"ChartData");
// // 	const CustomTooltip = ({ active, payload, label }) => {
// // 		if (!active || !payload?.length) return null;
// // 		return (
// // 			<Box
// // 				bg='white'
// // 				p={3}
// // 				rounded='md'
// // 				shadow='lg'
// // 				border='1px solid'
// // 				borderColor='gray.200'
// // 				minWidth='160px'
// // 			>
// // 				<Text fontWeight='semibold'>{label}</Text>
// // 				<HStack>
// // 					<Text fontSize='sm' color='gray.600'>
// // 						Count:
// // 					</Text>
// // 					<Text fontSize='md' color='blue.400'>
// // 						{payload[0].value}
// // 					</Text>
// // 				</HStack>
// // 			</Box>
// // 		);
// // 	};

// // 	return (
// // 		<Box>
// // 			<Text
// // 				fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
// // 				color='gray.700'
// // 				fontWeight='bold'
// // 			>
// // 				Weekly Attendance
// // 			</Text>

// // 			{chartData?.length > 0 ? (
// // 				<ResponsiveContainer width='100%' paddingTop={2} height={300}>
// // 					<BarChart
// // 						data={chartData}
// // 						margin={{ top: 33, right: 20, left: 0 }}
// // 						barSize={40}
// // 					>
// // 						<CartesianGrid
// // 							strokeDasharray='3 3'
// // 							vertical={false}
// // 							stroke='#e2e8f0'
// // 						/>
// // 						<XAxis
// // 							dataKey='name'
// // 							axisLine={true}
// // 							tickLine={false}
// // 							tick={{ fill: '#4a5568', fontSize: 14 }}
// // 						/>
// // 						<YAxis
// // 							// tickFormatter={(val) => `${Math.round(val)}`}
// // 							axisLine={true}
// // 							tickLine={false}
// // 							tick={{ fill: '#4a5568', fontSize: 12 }}
// // 						/>
// // 						<Tooltip content={<CustomTooltip />} cursor={{ fill: '#ebf8ff' }} />
// // 						<Bar dataKey='value' radius={[4, 4, 0, 0]}>
// // 							{chartData.map((_, i) => (
// // 								<Cell key={i} fill={colors[i % colors.length]} />
// // 							))}
// // 							<LabelList
// // 								dataKey='value'
// // 								position='top'
// // 								// formatter={(val) => `${val}`}
// // 								fill='#2d3748'
// // 								fontSize={14}
// // 								fontWeight={500}
// // 							/>
// // 						</Bar>
// // 					</BarChart>
// // 				</ResponsiveContainer>
// // 			) : (
// // 				<Box p='4'>
// // 					<NoData label='weekly attendance record' />
// // 					{/* <Text fontSize='md' color='gray.500' textAlign='center'>
// // 						no attendance record found in this week
// // 					</Text> */}
// // 				</Box>
// // 			)}
// // 		</Box>
// // 	);
// // };

// // export default AttendanceRoleChart;

// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   LabelList,
//   Cell,
// } from 'recharts';
// import { Box, Text, HStack, Flex } from '@chakra-ui/react';
// import NoData from 'components/Message/NoData';

// const BAR_COLORS = ['#facc15', '#4ade80', '#f87171', '#818cf8', '#fb923c', '#38bdf8'];
// const GLOW_COLORS = [
//   'rgba(250,204,21,0.35)',
//   'rgba(74,222,128,0.35)',
//   'rgba(248,113,113,0.35)',
//   'rgba(129,140,248,0.35)',
//   'rgba(251,146,60,0.35)',
//   'rgba(56,189,248,0.35)',
// ];

// const CustomTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   const i = payload[0]?.payload?.__index ?? 0;
//   return (
//     <Box
//       bg="white"
//       p={3}
//       borderRadius="12px"
//       boxShadow={`0 4px 20px ${GLOW_COLORS[i % GLOW_COLORS.length]}, 0 1px 4px rgba(0,0,0,0.08)`}
//       border="1.5px solid"
//       borderColor={BAR_COLORS[i % BAR_COLORS.length]}
//       minW="150px"
//     >
//       <Text fontWeight="700" fontSize="13px" color="gray.800" mb={1}>{label}</Text>
//       <HStack justify="space-between">
//         <HStack spacing={1.5}>
//           <Box w="8px" h="8px" borderRadius="2px" bg={BAR_COLORS[i % BAR_COLORS.length]} />
//           <Text fontSize="11px" color="gray.500">Count</Text>
//         </HStack>
//         <Text fontSize="13px" fontWeight="700" color="gray.800">{payload[0].value}</Text>
//       </HStack>
//     </Box>
//   );
// };

// const CustomBar = (props) => {
//   const { x, y, width, height, index } = props;
//   const color = BAR_COLORS[index % BAR_COLORS.length];
//   const glow  = GLOW_COLORS[index % GLOW_COLORS.length];
//   const id    = `grad-${index}`;
//   return (
//     <g>
//       <defs>
//         <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
//           <stop offset="0%" stopColor={color} stopOpacity={1} />
//           <stop offset="100%" stopColor={color} stopOpacity={0.45} />
//         </linearGradient>
//         <filter id={`glow-${index}`}>
//           <feGaussianBlur stdDeviation="3" result="blur" />
//           <feComposite in="SourceGraphic" in2="blur" operator="over" />
//         </filter>
//       </defs>
//       <rect
//         x={x}
//         y={y}
//         width={width}
//         height={height}
//         rx={6}
//         fill={`url(#${id})`}
//         stroke={color}
//         strokeWidth={1}
//         style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
//       />
//     </g>
//   );
// };

// const AttendanceRoleChart = ({ data }) => {
//   const chartData = (data?.roleNames || []).map((name, i) => ({
//     name,
//     value: data?.roleCounts?.[i] ?? 0,
//     __index: i,
//   }));

//   return (
//     <Box
//       bg="white"
//       borderRadius="14px"
//       border="1.5px solid"
//       borderColor="#fde68a"
//     //   boxShadow="0 0 0 3px rgba(250,204,21,0.1), 0 4px 16px rgba(250,204,21,0.15)"
//       p={5}
//     >
//       <Flex justify="space-between" align="center" mb={4}>
//         <Box>
//           <Text fontSize="15px" fontWeight="700" color="gray.800">Weekly Attendance</Text>
//           <Text fontSize="12px" color="gray.400">Attendance count by role</Text>
//         </Box>
//       </Flex>

//       {chartData?.length > 0 ? (
//         <ResponsiveContainer width="100%" height={280}>
//           <BarChart
//             data={chartData}
//             margin={{ top: 28, right: 12, left: -10, bottom: 0 }}
//             barSize={42}
//           >
//             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//             <XAxis
//               dataKey="name"
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
//               interval={0}
//               width={80}
//             />
//             <YAxis
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: '#9ca3af', fontSize: 11 }}
//               allowDecimals={false}
//             />
//             <Tooltip
//               content={<CustomTooltip />}
//               cursor={{ fill: 'rgba(241,245,249,0.6)', radius: 6 }}
//             />
//             <Bar dataKey="value" shape={<CustomBar />} radius={[6, 6, 0, 0]}>
//               {chartData.map((_, i) => (
//                 <Cell key={i} />
//               ))}
//               <LabelList
//                 dataKey="value"
//                 position="top"
//                 style={{ fontSize: 11, fontWeight: 700, fill: '#374151' }}
//               />
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       ) : (
//         <Box p={4}>
//           <NoData label="weekly attendance record" />
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default AttendanceRoleChart;

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  Cell,
} from 'recharts';
import { Box, Text, HStack, Flex } from '@chakra-ui/react';
import NoData from 'components/Message/NoData';
import { useModalColors } from 'hooks/useModalColors';

const AttendanceRoleChart = ({ data }) => {
  const colors = useModalColors();

  const BAR_COLORS = [colors.accentGold, colors.goldLight, colors.goldDark, '#4A7BA3', '#2E5C87', '#7AAAC4'];
  const GLOW_COLORS = [
    `${colors.accentGold}59`,
    `${colors.goldLight}59`,
    `${colors.goldDark}59`,
    'rgba(74,123,163,0.35)',
    'rgba(46,92,135,0.35)',
    'rgba(122,170,196,0.35)',
  ];

  const chartData = (data?.roleNames || []).map((name, i) => ({
    name,
    value: data?.roleCounts?.[i] ?? 0,
    __index: i,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const i = payload[0]?.payload?.__index ?? 0;
    return (
      <Box
        bg={colors.bg}
        p={3}
        borderRadius="12px"
        boxShadow={colors.cardShadow}
        border="1.5px solid"
        borderColor={BAR_COLORS[i % BAR_COLORS.length]}
        minW="150px"
      >
        <Text fontWeight="700" fontSize="13px" color={colors.headingText} mb={1}>{label}</Text>
        <HStack justify="space-between">
          <HStack spacing={1.5}>
            <Box w="8px" h="8px" borderRadius="2px" bg={BAR_COLORS[i % BAR_COLORS.length]} />
            <Text fontSize="11px" color={colors.bodyText}>Count</Text>
          </HStack>
          <Text fontSize="13px" fontWeight="700" color={colors.headingText}>{payload[0].value}</Text>
        </HStack>
      </Box>
    );
  };

  const CustomBar = (props) => {
    const { x, y, width, height, index } = props;
    const color = BAR_COLORS[index % BAR_COLORS.length];
    const glow = GLOW_COLORS[index % GLOW_COLORS.length];
    const id = `grad-${index}`;
    return (
      <g>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.45} />
          </linearGradient>
          <filter id={`glow-${index}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={6}
          fill={`url(#${id})`}
          stroke={color}
          strokeWidth={1}
          style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
        />
      </g>
    );
  };

  return (
    <Box
      bg={colors.bg}
      borderRadius="14px"
      border="1.5px solid"
      borderColor={colors.borderColor}
      p={5}
      boxShadow={colors.cardShadow}
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          <Text fontSize="15px" fontWeight="700" color={colors.headingText}>Weekly Attendance</Text>
          <Text fontSize="12px" color={colors.mutedText}>Attendance count by role</Text>
        </Box>
      </Flex>

      {chartData?.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            margin={{ top: 28, right: 12, left: -10, bottom: 0 }}
            barSize={42}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.borderColor} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: colors.bodyText, fontSize: 11, fontWeight: 500 }}
              interval={0}
              width={80}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: colors.mutedText, fontSize: 11 }}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: `${colors.bgInput}80`, radius: 6 }}
            />
            <Bar dataKey="value" shape={<CustomBar />} radius={[6, 6, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                style={{ fontSize: 11, fontWeight: 700, fill: colors.headingText }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Box p={4}>
          <NoData label="weekly attendance record" />
        </Box>
      )}
    </Box>
  );
};

export default AttendanceRoleChart;