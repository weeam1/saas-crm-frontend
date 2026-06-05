// import React from "react";
// import {
//   Box,
//   Heading,
//   Text,
//   Flex,
//   Badge,
//   Divider,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   TableContainer,
// } from "@chakra-ui/react";

// const AnalyticsCard = ({ item, month, year }) => {
//   const now = new Date();
//   const currentMonth = now.getMonth() + 1;
//   const currentYear = now.getFullYear();

//   const cellFont = "clamp(0.55rem, 1.5vw, 0.85rem)";
//   const headingFont = "clamp(0.7rem, 1.8vw, 1rem)";
//   const smallFont = "clamp(0.5rem, 1.2vw, 0.75rem)";

//   const formatDuration = (seconds) => {
//     if (!seconds || isNaN(seconds) || seconds <= 0) return "0h 0m 0s";
//     const totalSeconds = Math.round(seconds);
//     const h = Math.floor(totalSeconds / 3600);
//     const m = Math.floor((totalSeconds % 3600) / 60);
//     const s = totalSeconds % 60;
//     return `${h}h ${m}m ${s}s`;
//   };

//   const getLabel = () => {
//     if (year === currentYear && month === currentMonth) return "This Month";
//     if (year === currentYear && month === currentMonth - 1) return "Last Month";
//     const monthName = new Date(year, month - 1).toLocaleString("default", { month: "long" });
//     return `${monthName} ${year}`;
//   };

//   const label = getLabel();
//   const isCurrentMonth = year === currentYear && month === currentMonth;

//   const dailyCalls = isCurrentMonth ? item?.total_calls?.today || 0 : 0;
//   const dailyAnswered = isCurrentMonth ? item?.answered?.today || 0 : 0;
//   const dailyUnanswered = isCurrentMonth ? item?.unanswered?.today || 0 : 0;
//   const dailySeconds = isCurrentMonth ? item?.duration?.today_seconds || 0 : 0;

//   const monthlyCalls = item?.total_calls?.month || 0;
//   const monthlyAnswered = item?.answered?.month || 0;
//   const monthlyUnanswered = item?.unanswered?.month || 0;
//   const monthSeconds = item?.duration?.month_seconds || 0;

//   const dailyAvgDurationSeconds = dailyAnswered > 0 ? dailySeconds / dailyAnswered : 0;
//   const avgCallsSeconds = monthlyCalls > 0 ? monthSeconds / 30 : 0;
//   const avgDurationSeconds = monthlyAnswered > 0 ? monthSeconds / monthlyAnswered : 0;

//   const dailyAvgDuration = formatDuration(dailyAvgDurationSeconds);
//   const avgCalls = formatDuration(avgCallsSeconds);
//   const avgDuration = formatDuration(avgDurationSeconds);

//   return (
//     <Box
//       p={{ base: 2, sm: 3, md: 5 }}
//       borderRadius="2xl"
//       shadow="sm"
//       bg="white"
//       border="1px solid"
//       borderColor="gray.300"
//       transition="all 0.3s ease"
//       _hover={{
//         transform: "translateY(-3px) scale(1.01)",
//         boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
//         bgGradient: "linear(to-br, #f0fff4, #e0f7fa)",
//         borderColor: "gray.400",
//       }}
//       w="100%"
//     >
//       {/* Header */}
//       <Flex
//         justify="space-between"
//         align={{ base: "flex-start", sm: "center" }}
//         direction={{ base: "column", sm: "row" }}
//         mb={1}
//         gap={1}
//       >
//         <Heading
//           fontSize={headingFont}
//           color="black"
//           noOfLines={1}
//           textOverflow="ellipsis"
//           overflow="hidden"
//           whiteSpace="nowrap"
//           maxW="100%"
//         >
//           {item.fullName || "Unknown User"}
//         </Heading>

//         <Badge
//           colorScheme="yellow"
//           fontSize={smallFont}
//           px={2}
//           py={0.5}
//           borderRadius="md"
//           whiteSpace="nowrap"
//         >
//           Caller ID: {item.sipId || "-"}
//         </Badge>
//       </Flex>

//       {/* Month Label */}
//       <Badge
//         px={2}
//         py={0.5}
//         borderRadius="full"
//         bg="goldenrod"
//         color="white"
//         fontSize={smallFont}
//         fontWeight="semibold"
//         shadow="sm"
//         mb={2}
//       >
//         📅 {label}
//       </Badge>

//       <Divider borderColor="goldenrod" opacity={0.3} mb={2} />

//       {/* Table */}
//       <TableContainer w="100%" overflowX="hidden">
//         <Table
//           size="sm"
//           variant="unstyled"
//           w="100%"
//           sx={{
//             tableLayout: "fixed",
//             wordWrap: "break-word",
//             whiteSpace: "normal",
//           }}
//         >
//           <Thead>
//             <Tr>
//               <Th
//                 color="black"
//                 fontSize={cellFont}
//                 p="0.25rem"
//                 textAlign="left"
//                 whiteSpace="nowrap"
//                 w="40%"
//               >
//                 Status
//               </Th>
//               {isCurrentMonth && (
//                 <Th
//                   color="black"
//                   textAlign="center"
//                   fontSize={cellFont}
//                   p="0.25rem"
//                   w="30%"
//                 >
//                   Today
//                 </Th>
//               )}
//               <Th
//                 color="black"
//                 textAlign="center"
//                 fontSize={cellFont}
//                 p="0.25rem"
//                 w={isCurrentMonth ? "30%" : "40%"}
//               >
//                 Monthly
//               </Th>
//             </Tr>
//           </Thead>

//           <Tbody>
//             <Tr>
//               <Td fontWeight="medium" color="green.700" fontSize={cellFont} p="0.25rem">
//                 Answered
//               </Td>
//               {isCurrentMonth && (
//                 <Td textAlign="center" fontSize={cellFont} p="0.25rem">
//                   {dailyAnswered}
//                 </Td>
//               )}
//               <Td textAlign="center" fontSize={cellFont} p="0.25rem">
//                 {monthlyAnswered}
//               </Td>
//             </Tr>

//             <Tr>
//               <Td fontWeight="medium" color="red.600" fontSize={cellFont} p="0.25rem">
//                 Unanswered
//               </Td>
//               {isCurrentMonth && (
//                 <Td textAlign="center" fontSize={cellFont} p="0.25rem">
//                   {dailyUnanswered}
//                 </Td>
//               )}
//               <Td textAlign="center" fontSize={cellFont} p="0.25rem">
//                 {monthlyUnanswered}
//               </Td>
//             </Tr>

//             <Tr>
//               <Td fontWeight="medium" color="purple.700" fontSize={cellFont} p="0.25rem">
//                 Avg Calls (Time)
//               </Td>
//               {isCurrentMonth && (
//                 <Td
//                   textAlign="center"
//                   color="purple.600"
//                   fontWeight="semibold"
//                   fontSize={cellFont}
//                   p="0.25rem"
//                   sx={{ wordBreak: "break-word" }}
//                 >
//                   {avgCalls}
//                 </Td>
//               )}
//               <Td
//                 textAlign="center"
//                 color="purple.600"
//                 fontWeight="semibold"
//                 fontSize={cellFont}
//                 p="0.25rem"
//                 sx={{ wordBreak: "break-word" }}
//               >
//                 {avgCalls}
//               </Td>
//             </Tr>

//             <Tr>
//               <Td fontWeight="medium" color="orange.700" fontSize={cellFont} p="0.25rem">
//                 Avg Duration
//               </Td>
//               {isCurrentMonth && (
//                 <Td
//                   textAlign="center"
//                   color="orange.600"
//                   fontWeight="semibold"
//                   fontSize={cellFont}
//                   p="0.25rem"
//                   sx={{ wordBreak: "break-word" }}
//                 >
//                   {dailyAvgDuration}
//                 </Td>
//               )}
//               <Td
//                 textAlign="center"
//                 color="orange.600"
//                 fontWeight="semibold"
//                 fontSize={cellFont}
//                 p="0.25rem"
//                 sx={{ wordBreak: "break-word" }}
//               >
//                 {avgDuration}
//               </Td>
//             </Tr>

//             <Tr>
//               <Td fontWeight="medium" color="gray.800" fontSize={cellFont} p="0.25rem">
//                 Total Calls
//               </Td>
//               {isCurrentMonth && (
//                 <Td textAlign="center" fontSize={cellFont} p="0.25rem">
//                   {dailyCalls}
//                 </Td>
//               )}
//               <Td
//                 textAlign="center"
//                 fontWeight="bold"
//                 color="gray.800"
//                 fontSize={cellFont}
//                 p="0.25rem"
//               >
//                 {monthlyCalls}
//               </Td>
//             </Tr>
//           </Tbody>
//         </Table>
//       </TableContainer>

//       <Divider borderColor="gray.200" my={2} />

//       {/* Duration Section */}
//       <Text
//         fontSize={smallFont}
//         color="gray.700"
//         wordBreak="break-word"
//         whiteSpace="normal"
//       >
//         🕒 <b>Total Duration ({label}):</b>{" "}
//         <Text as="span" color="goldenrod" fontWeight="bold">
//           {formatDuration(monthSeconds)}
//         </Text>
//       </Text>
//     </Box>
//   );
// };

// export default AnalyticsCard;

import React from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Badge,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useModalColors } from "hooks/useModalColors";

const AnalyticsCard = ({ item, month, year }) => {
  const colors = useModalColors();
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const cellFont = "clamp(0.55rem, 1.5vw, 0.85rem)";
  const headingFont = "clamp(0.7rem, 1.8vw, 1rem)";
  const smallFont = "clamp(0.5rem, 1.2vw, 0.75rem)";

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds) || seconds <= 0) return "0h 0m 0s";
    const totalSeconds = Math.round(seconds);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const getLabel = () => {
    if (year === currentYear && month === currentMonth) return "This Month";
    if (year === currentYear && month === currentMonth - 1) return "Last Month";
    const monthName = new Date(year, month - 1).toLocaleString("default", { month: "long" });
    return `${monthName} ${year}`;
  };

  const label = getLabel();
  const isCurrentMonth = year === currentYear && month === currentMonth;

  const dailyCalls = isCurrentMonth ? item?.total_calls?.today || 0 : 0;
  const dailyAnswered = isCurrentMonth ? item?.answered?.today || 0 : 0;
  const dailyUnanswered = isCurrentMonth ? item?.unanswered?.today || 0 : 0;
  const dailySeconds = isCurrentMonth ? item?.duration?.today_seconds || 0 : 0;

  const monthlyCalls = item?.total_calls?.month || 0;
  const monthlyAnswered = item?.answered?.month || 0;
  const monthlyUnanswered = item?.unanswered?.month || 0;
  const monthSeconds = item?.duration?.month_seconds || 0;

  const dailyAvgDurationSeconds = dailyAnswered > 0 ? dailySeconds / dailyAnswered : 0;
  const avgCallsSeconds = monthlyCalls > 0 ? monthSeconds / 30 : 0;
  const avgDurationSeconds = monthlyAnswered > 0 ? monthSeconds / monthlyAnswered : 0;

  const dailyAvgDuration = formatDuration(dailyAvgDurationSeconds);
  const avgCalls = formatDuration(avgCallsSeconds);
  const avgDuration = formatDuration(avgDurationSeconds);

  return (
    <Box
      p={{ base: 2, sm: 3, md: 5 }}
      borderRadius="2xl"
      boxShadow={colors.cardShadow}
      bg={colors.bg}
      border="1px solid"
      borderColor={colors.borderColor}
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-3px) scale(1.01)",
        boxShadow: colors.modalShadow,
        borderColor: colors.borderColor,
        bg: colors.bgDeep,
      }}
      w="100%"
    >
      {/* Header */}
      <Flex
        justify="space-between"
        align={{ base: "flex-start", sm: "center" }}
        direction={{ base: "column", sm: "row" }}
        mb={1}
        gap={1}
      >
        <Heading
          fontSize={headingFont}
          color={colors.headingText}
          noOfLines={1}
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
          maxW="100%"
        >
          {item.fullName || "Unknown User"}
        </Heading>

        <Badge
          bg={colors.bgInput}
          color={colors.bodyText}
          fontSize={smallFont}
          px={2}
          py={0.5}
          borderRadius="md"
          whiteSpace="nowrap"
        >
          Caller ID: {item.sipId || "-"}
        </Badge>
      </Flex>

      {/* Month Label */}
      <Badge
        px={2}
        py={0.5}
        borderRadius="full"
        bg={colors.bgInput}
        color={colors.bodyText}
        fontSize={smallFont}
        fontWeight="semibold"
        boxShadow="sm"
        mb={2}
      >
        📅 {label}
      </Badge>

      <Divider borderColor={colors.borderColor} opacity={0.5} mb={2} />

      {/* Table */}
      <TableContainer w="100%" overflowX="hidden">
        <Table
          size="sm"
          variant="unstyled"
          w="100%"
          sx={{
            tableLayout: "fixed",
            wordWrap: "break-word",
            whiteSpace: "normal",
          }}
        >
          <Thead>
            <Tr>
              <Th
                color={colors.labelColor}
                fontSize={cellFont}
                p="0.25rem"
                textAlign="left"
                whiteSpace="nowrap"
                w="40%"
              >
                Status
              </Th>
              {isCurrentMonth && (
                <Th
                  color={colors.labelColor}
                  textAlign="center"
                  fontSize={cellFont}
                  p="0.25rem"
                  w="30%"
                >
                  Today
                </Th>
              )}
              <Th
                color={colors.labelColor}
                textAlign="center"
                fontSize={cellFont}
                p="0.25rem"
                w={isCurrentMonth ? "30%" : "40%"}
              >
                Monthly
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            <Tr>
              <Td fontWeight="medium" color={colors.badgeSuccessText} fontSize={cellFont} p="0.25rem">
                Answered
              </Td>
              {isCurrentMonth && (
                <Td textAlign="center" fontSize={cellFont} p="0.25rem" color={colors.bodyText}>
                  {dailyAnswered}
                </Td>
              )}
              <Td textAlign="center" fontSize={cellFont} p="0.25rem" color={colors.bodyText}>
                {monthlyAnswered}
              </Td>
            </Tr>

            <Tr>
              <Td fontWeight="medium" color={colors.badgeErrorText} fontSize={cellFont} p="0.25rem">
                Unanswered
              </Td>
              {isCurrentMonth && (
                <Td textAlign="center" fontSize={cellFont} p="0.25rem" color={colors.bodyText}>
                  {dailyUnanswered}
                </Td>
              )}
              <Td textAlign="center" fontSize={cellFont} p="0.25rem" color={colors.bodyText}>
                {monthlyUnanswered}
              </Td>
            </Tr>

            <Tr>
              <Td fontWeight="medium" color={colors.bodyText} fontSize={cellFont} p="0.25rem">
                Avg Calls (Time)
              </Td>
              {isCurrentMonth && (
                <Td
                  textAlign="center"
                  color={colors.bodyText}
                  fontWeight="semibold"
                  fontSize={cellFont}
                  p="0.25rem"
                  sx={{ wordBreak: "break-word" }}
                >
                  {avgCalls}
                </Td>
              )}
              <Td
                textAlign="center"
                color={colors.bodyText}
                fontWeight="semibold"
                fontSize={cellFont}
                p="0.25rem"
                sx={{ wordBreak: "break-word" }}
              >
                {avgCalls}
              </Td>
            </Tr>

            <Tr>
              <Td fontWeight="medium" color={colors.bodyText} fontSize={cellFont} p="0.25rem">
                Avg Duration
              </Td>
              {isCurrentMonth && (
                <Td
                  textAlign="center"
                  color={colors.bodyText}
                  fontWeight="semibold"
                  fontSize={cellFont}
                  p="0.25rem"
                  sx={{ wordBreak: "break-word" }}
                >
                  {dailyAvgDuration}
                </Td>
              )}
              <Td
                textAlign="center"
                color={colors.bodyText}
                fontWeight="semibold"
                fontSize={cellFont}
                p="0.25rem"
                sx={{ wordBreak: "break-word" }}
              >
                {avgDuration}
              </Td>
            </Tr>

            <Tr>
              <Td fontWeight="medium" color={colors.headingText} fontSize={cellFont} p="0.25rem">
                Total Calls
              </Td>
              {isCurrentMonth && (
                <Td textAlign="center" fontSize={cellFont} p="0.25rem" color={colors.bodyText}>
                  {dailyCalls}
                </Td>
              )}
              <Td
                textAlign="center"
                fontWeight="bold"
                color={colors.headingText}
                fontSize={cellFont}
                p="0.25rem"
              >
                {monthlyCalls}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

      <Divider borderColor={colors.borderColor} my={2} />

      {/* Duration Section */}
      <Text
        fontSize={smallFont}
        color={colors.bodyText}
        wordBreak="break-word"
        whiteSpace="normal"
      >
        🕒 <b>Total Duration ({label}):</b>{" "}
        <Text as="span" color={colors.headingText} fontWeight="bold">
          {formatDuration(monthSeconds)}
        </Text>
      </Text>
    </Box>
  );
};

export default AnalyticsCard;