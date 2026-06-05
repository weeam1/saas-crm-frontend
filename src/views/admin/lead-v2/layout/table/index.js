import React, { memo, useEffect, useMemo } from "react";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Box,
  Text,
  Flex,
  Button,
} from "@chakra-ui/react";
import LeadUnassignedMessage from "../../components/subComponents/LeadUnassignedMessage";
import NoData from "components/Message/NoData";
import useFilteredQueryParams from "../../useFilteredQueryParams";
import { shallowEqual, useSelector } from "react-redux";
import TableLoading from "components/loading/TableLoading";

import { usePermissions } from "hooks/usePermissions";
import { safeValue } from "utils";
import useUserSession from "hooks/useUserSession";
import LeadMenu from "../../components/subComponents/card/LeadMenu";
import Agents from "../../components/subComponents/Agents";
import Managers from "../../components/subComponents/Managers";
import Status from "../../components/subComponents/Status";
import MainStatus from "../../components/subComponents/MainStatus";
import { format } from "date-fns";
import { extractLocationData } from "utils/helpers";
import LeadTypeBadge from "../../components/subComponents/LeadTypeBadge";
import TeamLeaders from "../../components/subComponents/TeamLeaders";

const LeadTableView = memo((props) => {
  const {
    isLoaded,
    leadsLoading,
    refreshLeads,
    setLeadDetails,
    setViewLead,
    setEditLead,
    setAddLead,
    setSendEmail,
    selectedValues,
    setSelectedValues,
    setDeleteLead,
    setSelectAllChecked,
    selectAllChecked,
    leadsRefetching,
    setViewPhoneHistory,
    setLeadAddtionalInfo,
    setIsLeadCycle,
  } = props;

  const { hasPermission } = usePermissions();
  const { user, userRoleName } = useUserSession();
  const countries = useSelector((state) => state.countries.countryNames);

  const leads = useSelector((state) => state.leads, shallowEqual);

  const hiddenFields = useSelector((state) => state.leads.hiddenFields || []);

  const { pageSize, queryParams, refetchLoading, setRefetchLoading } =
    useFilteredQueryParams();

  useEffect(() => {
    if (leadsRefetching) {
      setRefetchLoading(true);
    } else {
      const timer = setTimeout(() => setRefetchLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [leadsRefetching, refetchLoading, setRefetchLoading]);

  const QR_CHANGE_MANAGER_AGENT_PERMISSION =
    queryParams?.invite && hasPermission("leads", "qr_change_manager_agent");

  const MANAGER_ASSIGNED_PERMISSION =
    !QR_CHANGE_MANAGER_AGENT_PERMISSION &&
    hasPermission("leads", "managerAssign") &&
    !hiddenFields.includes("managerAssigned");

  const AGENT_ASSIGNED_PERMISSION =
    !QR_CHANGE_MANAGER_AGENT_PERMISSION &&
    hasPermission("leads", "agentAssign") &&
    !hiddenFields.includes("agentAssigned");

  const TEAM_LEAD_ASSIGNED_PERMISSION =
    !QR_CHANGE_MANAGER_AGENT_PERMISSION &&
    hasPermission("leads", "teamLeadAssign") &&
    !hiddenFields.includes("teamLeadAssigned");

  // Dynamically filter columns by permission
  const tableColumns = useMemo(() => {
    const baseCols = [
      { Header: "ID", accessor: "intID", width: 10 },
      { Header: "Name", accessor: "leadName", width: 200 },
      { Header: "Budget", accessor: "budget", width: 120 },
      { Header: "City", accessor: "city", width: 100 },
      { Header: "Country", accessor: "country", width: 150 },
      { Header: "Timetocall", accessor: "timetocall", width: 100 },
      { Header: "Date & Time", accessor: "createdDate", width: 150 },
      { Header: "Nationality", accessor: "nationality", width: 100 },
      { Header: "Language", accessor: "leadLang", width: 100 },
      { Header: "Last Note", accessor: "lastNote", width: 200 },
      { Header: "Ad Name", accessor: "leadSourceDetails", width: 200 },
      { Header: "Campaign", accessor: "leadCampaign", width: 200 },
      { Header: "Campaign URL", accessor: "pageUrl", width: 200 },
      { Header: "Address", accessor: "leadAddress", width: 150 },
      { Header: "Medium", accessor: "leadSourceMedium", width: 120 },
      { Header: "Attendance", accessor: "attendanceDay", width: 100 },
      { Header: "In UAE?", accessor: "r_u_in_uae", width: 40 },
    ];

    if (MANAGER_ASSIGNED_PERMISSION) {
      baseCols.splice(2, 0, {
        Header: "Manager",
        accessor: "managerAssigned",
        width: 200,
      });
    }
    if (TEAM_LEAD_ASSIGNED_PERMISSION) {
      baseCols.splice(3, 0, {
        Header: "Team Lead",
        accessor: "teamLeadAssigned",
        width: 200,
      });
    }
    if (AGENT_ASSIGNED_PERMISSION) {
      baseCols.splice(4, 0, {
        Header: "Agent",
        accessor: "agentAssigned",
        width: 200,
      });
    }
    if (hasPermission("leads", "mainStatus")) {
      baseCols.splice(5, 0, {
        Header: "M Status",
        accessor: "eLeadStatus",
        width: 190,
      });
    }
    if (hasPermission("leads", "leadStatus")) {
      baseCols.splice(6, 0, {
        Header: "Status",
        accessor: "leadStatus",
        width: 200,
      });
    }

    if (hasPermission("leads", "contactDetails")) {
      baseCols.splice(7, 0, {
        Header: "Phone",
        accessor: "leadPhoneNumber",
        width: 170,
      });
      baseCols.splice(8, 0, {
        Header: "Whatsapp",
        accessor: "leadWhatsappNumber",
        width: 170,
      });
      baseCols.splice(9, 0, {
        Header: "Email",
        accessor: "leadEmail",
        width: 170,
      });
    }

    // Action column always last
    baseCols.push({
      Header: "Actions",
      accessor: "actions",
      isSortable: false,
      width: 20,
    });

    // filter out hidden fields by accessor
    return baseCols.filter((col) => !hiddenFields.includes(col.accessor));
  }, [hiddenFields]);

  const onContactClick = (value, type) => {
    if (!value) return null;

    if (type === "phone") {
      window.location.href = `tel:${value}`;
    }
    else window.open(`https://wa.me/${value}`);
  };

  return (
    <Box
      maxHeight="70vh"
      minH="70vh"
      overflowY="auto"
      scrollBehavior="smooth"
      borderRadius="xl"
      boxShadow="card"
      bg="bg.app"
      border="1px solid"
      borderColor="border.default"
    >
      <Table variant="simple" size="md">
        <Thead
          position="sticky"
          top={0}
          bg="bg.app"
          color="text.heading"
          zIndex={1}
        >
          <Tr>
            <Th
              bg="bg.app"
              borderColor="border.default"
              py="4"
              px={3}
            >
              <Checkbox
                isChecked={selectAllChecked}
                onChange={(e) => setSelectAllChecked(e.target.checked)}
              />
            </Th>
            {tableColumns.map((col) => (
              <Th
                key={col.accessor}
                minW={col?.width ? `${col.width}px` : "100px"}
                textAlign="center"
                py="4"
                px={3}
                fontSize="xs"
                fontWeight="semibold"
                letterSpacing="wider"
                color="text.muted"
                textTransform="none"
                bg="bg.app"
                borderColor="border.default"
              >
                {col.Header}
              </Th>
            ))}
          </Tr>
        </Thead>

        <Tbody>
          {refetchLoading || leadsRefetching || !isLoaded || leadsLoading ? (
            <TableLoading columns={tableColumns} length={10} py="4" />
          ) : leads && leads?.totalLeads ? (
            leads?.doc?.map((lead) => {
              const { city, country } = extractLocationData(
                lead?.ip,
                countries,
              );
              return (
                <Tr
                  key={lead._id}
                  _hover={{ bg: "bg.elevated" }}
                  bg="bg.surface"
                  transition="background-color 0.2s ease-in-out"
                >
                  {/* Row checkbox */}
                  <Td
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor="border.subtle"
                  >
                    <Checkbox
                      isChecked={selectedValues.includes(lead._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedValues([...selectedValues, lead._id]);
                        } else {
                          setSelectedValues(
                            selectedValues.filter((id) => id !== lead._id),
                          );
                        }
                      }}
                    />
                  </Td>

                  {/* Dynamic columns */}
                  {tableColumns.map((col) => {
                    if (col.accessor === "intID") {
                      return (
                        <Td
                          key={col.accessor}
                          py={3}
                          px={3}
                          cursor="pointer"
                          onClick={() => {
                            setLeadDetails(lead);
                            setViewLead({
                              isOpen: true,
                              lid: lead?._id,
                            });
                          }}
                          color="text.body"
                          fontWeight="medium"
                          borderBottom="1px solid"
                          borderColor="border.subtle"
                          _hover={{ textDecoration: "underline", color: "text.accent" }}
                        >
                          {lead.intID || "—"}
                        </Td>
                      );
                    }

                    if (col.Header === "Name") {
                      const leadType =
                        lead.leadType ??
                        (lead.leadStatus === "new" ? "new" : undefined);

                      return (
                        <Td
                          key={col.accessor}
                          py={3}
                          px={3}
                          borderBottom="1px solid"
                          borderColor="border.subtle"
                        >
                          <Flex
                            alignItems="center"
                            maxWidth="200px"
                            textAlign="left"
                          >
                            <Text
                              me="10px"
                              color="text.body"
                              fontSize="sm"
                              fontWeight="600"
                              maxW="160px"
                              isTruncated
                            >
                              {lead?.leadName || ""}
                            </Text>
                            <LeadTypeBadge
                              leadType={leadType}
                              roleName={userRoleName}
                            />
                          </Flex>
                        </Td>
                      );
                    }

                    if (col.accessor === "actions") {
                      return (
                        <Td
                          key={col.accessor}
                          textAlign="center"
                          py={3}
                          px={3}
                          borderBottom="1px solid"
                          borderColor="border.subtle"
                        >
                          <LeadMenu
                            user={user}
                            lead={lead}
                            setEditLead={setEditLead}
                            setAddLead={setAddLead}
                            setSendEmail={setSendEmail}
                            setSelectedValues={setSelectedValues}
                            setDeleteLead={setDeleteLead}
                            setLeadDetails={setLeadDetails}
                            refreshData={refreshLeads}
                            setViewPhoneHistory={setViewPhoneHistory}
                            setLeadAddtionalInfo={setLeadAddtionalInfo}
                            setIsLeadCycle={setIsLeadCycle}
                          />
                        </Td>
                      );
                    }

                    if (col.Header === "Manager") {
                      return (
                        <Td
                          key={col.accessor}
                          minW="200px"
                          textAlign="center"
                          py={3}
                          px={3}
                          borderBottom="1px solid"
                          borderColor="border.subtle"
                        >
                          <Managers lead={lead} />
                        </Td>
                      );
                    }
                    if (col.Header === "Team Lead") {
                      return (
                        <Td
                          key={col.accessor}
                          minW="200px"
                          textAlign="center"
                          py={3}
                          px={3}
                          borderBottom="1px solid"
                          borderColor="border.subtle"
                        >
                          <TeamLeaders lead={lead} />
                        </Td>
                      );
                    }
                    if (col.Header === "Agent") {
                      return (
                        <Td
                          key={col.accessor}
                          minW="200px"
                          textAlign="center"
                          py={3}
                          px={3}
                          borderBottom="1px solid"
                          borderColor="border.subtle"
                        >
                          <Agents lead={lead} />
                        </Td>
                      );
                    }
                    if (col.Header === "M Status") {
                      return (
                        <Td
                          key={col.accessor}
                          minW={`${col.width}px`}
                          textAlign="center"
                          py={3}
                          px={3}
                          borderBottom="1px solid"
                          borderColor="border.subtle"
                        >
                          <MainStatus
                            lead={lead}
                            refreshLeads={refreshLeads}
                            role={userRoleName}
                          />
                        </Td>
                      );
                    }
                    if (col.Header === "Status") {
                      return (
                        <Td
                          key={col.accessor}
                          minW={`${col.width}px`}
                          textAlign="center"
                          py={3}
                          px={3}
                          borderBottom="1px solid"
                          borderColor="border.subtle"
                        >
                          <Status lead={lead} refreshLeads={refreshLeads} />
                        </Td>
                      );
                    }

                    if (col.accessor === "createdDate") {
                      return (
                        <Td
                          key={col.accessor}
                          color="text.body"
                          minW="200px"
                          textAlign="center"
                          py={3}
                          px={3}
                          borderBottom="1px solid"
                          borderColor="border.subtle"
                        >
                          {format(
                            new Date(lead?.createdDate),
                            "MMM d, yyyy h:mm a",
                          )}
                        </Td>
                      );
                    }

                    if (col.Header === "City") {
                      return (
                        <Td
                          key={col.accessor}
                          color="text.body"
                          minW="80px"
                          textAlign="center"
                          py={3}
                          px={3}
                          borderBottom="1px solid"
                          borderColor="border.subtle"
                        >
                          {city || "N/A"}
                        </Td>
                      );
                    }

                    if (col.Header === "Country") {
                      return (
                        <Td
                          key={col.accessor}
                          color="text.body"
                          minW="80px"
                          textAlign="center"
                          py={3}
                          px={3}
                          borderBottom="1px solid"
                          borderColor="border.subtle"
                        >
                          {country || "N/A"}
                        </Td>
                      );
                    }
                    if (col.Header === "Phone") {
                      return (
                        <Td
                          key={col.accessor}
                          color="text.body"
                          minW="80px"
                          textAlign="center"
                          py={3}
                          px={3}
                          borderBottom="1px solid"
                          borderColor="border.subtle"
                        >
                          {lead?.leadPhoneNumber ? (
                            <Button
                              variant="link"
                              size="sm"
                              color="text.accent"
                              onClick={() =>
                                onContactClick(lead?.leadPhoneNumber, "phone")
                              }
                              _hover={{ color: "accent.goldLight" }}
                            >
                              {safeValue(lead?.leadPhoneNumber)}
                            </Button>
                          ) : (
                            "N/A"
                          )}
                        </Td>
                      );
                    }
                    if (col.Header === "Whatsapp") {
                      return (
                        <Td
                          key={col.accessor}
                          color="text.body"
                          minW="80px"
                          textAlign="center"
                          py={3}
                          px={3}
                          borderBottom="1px solid"
                          borderColor="border.subtle"
                        >
                          {lead?.leadWhatsappNumber ? (
                            <Button
                              variant="link"
                              size="sm"
                              color="text.accent"
                              onClick={() =>
                                onContactClick(
                                  lead?.leadWhatsappNumber,
                                  "whatsapp",
                                )
                              }
                              _hover={{ color: "accent.goldLight" }}
                            >
                              {safeValue(lead?.leadWhatsappNumber)}
                            </Button>
                          ) : (
                            "N/A"
                          )}
                        </Td>
                      );
                    }

                    if (col.accessor === "pageUrl") {
                      return (
                        <Td
                          py={3}
                          px={3}
                          key={col.accessor}
                          textAlign="center"
                          maxWidth="150px"
                          color="text.accent"
                          minW={col.width ? `${col.width}px` : "100px"}
                          fontWeight={400}
                          borderBottom="1px solid"
                          borderColor="border.subtle"
                        >
                          <Text noOfLines={2}>
                            {safeValue(lead[col.accessor]) || "N/A"}
                          </Text>
                        </Td>
                      );
                    }

                    return (
                      <Td
                        py={3}
                        px={3}
                        key={col.accessor}
                        textAlign="center"
                        maxWidth="150px"
                        color="text.body"
                        minW={col.width ? `${col.width}px` : "100px"}
                        fontWeight={400}
                        borderBottom="1px solid"
                        borderColor="border.subtle"
                      >
                        <Text noOfLines={2}>
                          {safeValue(lead[col.accessor]) || "N/A"}
                        </Text>
                      </Td>
                    );
                  })}
                </Tr>
              );
            })
          ) : queryParams?.lead ? (
            <Tr>
              <Td colSpan={tableColumns?.length + 1} py={10} borderColor="border.subtle">
                <LeadUnassignedMessage />
              </Td>
            </Tr>
          ) : (
            <Tr>
              <Td py={10} colSpan={tableColumns?.length + 1} borderColor="border.subtle">
                <NoData label="leads" />
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
});

LeadTableView.displayName = "LeadTableView";

export default LeadTableView;