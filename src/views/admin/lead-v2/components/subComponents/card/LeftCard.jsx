
import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { IoMdEye } from "react-icons/io";

import { safeValue } from "utils";
import { usePermissions } from "hooks/usePermissions";
import { leadlabelFontSize } from "../../constants";

import EntityField from "./EntityField";
import LastNoteField from "./LastNoteField";
import MainStatus from "../MainStatus";
import Status from "../Status";
import Agents from "../Agents";
import Managers from "../Managers";
import TeamLeaders from "../TeamLeaders";
import LeadTypeBadge from "../LeadTypeBadge";
import ErrorLeadLimitMessage from "components/Message/ErrorLeadLimitMessage";
import ContactBox from "./ContactBox";

const LeftCard = ({
  lead,
  setViewLead,
  refreshLeads,
  role,
  queryParams,
  user,
  hiddenFields,
}) => {
  const leadType = useMemo(() => {
    return lead?.leadType ?? (lead?.leadStatus === "new" ? "new" : undefined);
  }, [lead?.leadType, lead?.leadStatus]);

  const { hasPermission } = usePermissions();

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorLeadData, setErrorLeadData] = useState({});

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

  return (
    <Box flex="1" overflow="hidden">
      <Flex alignItems="center" gap="2">
        {hasPermission("leads", "read") && (
          <Icon
            as={IoMdEye}
            boxSize="12px"
            onClick={() => setViewLead({ isOpen: true, lid: lead?._id })}
            color="text.accent"
            cursor="pointer"
            _hover={{ color: "accent.goldLight" }}
          />
        )}

        {!hiddenFields.includes("intID") && (
          <Text fontSize={leadlabelFontSize} color="text.muted">
            {lead?.intID || "N/A"}
          </Text>
        )}
      </Flex>

      {!hiddenFields.includes("leadName") && (
        <HStack mb={2}>
          <Text
            fontSize="12px"
            fontWeight="semibold"
            isTruncated
            maxWidth="6rem"
            color="text.heading"
          >
            {safeValue(lead?.leadName) || "N/A"}
          </Text>
          <LeadTypeBadge leadType={leadType} roleName={role} />
        </HStack>
      )}

      <Grid
        minWidth="100%"
        templateColumns="repeat(2, 1fr)"
        alignItems="start"
        gap={{ base: 4, md: 2 }}
      >
        <GridItem colSpan={2} display="flex" justifyContent="space-between">
          {!hiddenFields.includes("leadSourceDetails") && (
            <EntityField
              label="Ad Name"
              value={safeValue(lead?.leadSourceDetails)}
              valueProps={{ color: "text.accent" }}
              isInfo={true}
            />
          )}

          {!hiddenFields.includes("adset") && (
            <EntityField
              label="Adset"
              value={safeValue(lead?.adset)}
              isInfo={true}
              valueProps={{ color: "text.body" }}
            />
          )}
        </GridItem>

        {/* QR Invite: permission to change assigned Manager or Agent */}
        {QR_CHANGE_MANAGER_AGENT_PERMISSION && (
          <>
            <GridItem colSpan={1}>
              <Managers
                lead={lead}
                setErrorLeadData={setErrorLeadData}
                setIsErrorModalOpen={setIsErrorModalOpen}
              />
            </GridItem>
            <GridItem colSpan={1}>
              <TeamLeaders
                lead={lead}
                setErrorLeadData={setErrorLeadData}
                setIsErrorModalOpen={setIsErrorModalOpen}
              />
            </GridItem>

            <GridItem colSpan={2}>
              <Agents
                lead={lead}
                setErrorLeadData={setErrorLeadData}
                setIsErrorModalOpen={setIsErrorModalOpen}
              />
            </GridItem>
          </>
        )}

        {/* Manager assigned */}
        {MANAGER_ASSIGNED_PERMISSION && (
          <GridItem colSpan={2}>
            <Managers
              lead={lead}
              setErrorLeadData={setErrorLeadData}
              setIsErrorModalOpen={setIsErrorModalOpen}
            />
          </GridItem>
        )}

        {/* Team lead assigned */}
        {TEAM_LEAD_ASSIGNED_PERMISSION && (
          <GridItem colSpan={AGENT_ASSIGNED_PERMISSION ? "1" : "2"}>
            <TeamLeaders
              lead={lead}
              setErrorLeadData={setErrorLeadData}
              setIsErrorModalOpen={setIsErrorModalOpen}
            />
          </GridItem>
        )}

        {/* Agent assigned*/}
        {AGENT_ASSIGNED_PERMISSION && (
          <GridItem colSpan={TEAM_LEAD_ASSIGNED_PERMISSION ? "1" : "2"}>
            <Agents
              lead={lead}
              refreshLeads={refreshLeads}
              setErrorLeadData={setErrorLeadData}
              setIsErrorModalOpen={setIsErrorModalOpen}
            />
          </GridItem>
        )}

        {/* Main lead status */}
        {hasPermission("leads", "leadStatus") &&
          !hiddenFields.includes("eLeadStatus") && (
            <GridItem colSpan={hiddenFields.includes("leadStatus") ? "2" : "1"}>
              <MainStatus lead={lead} refreshLeads={refreshLeads} role={role} />
            </GridItem>
          )}

        {/* Lead status */}
        {hasPermission("leads", "mainStatus") &&
          !hiddenFields.includes("leadStatus") && (
            <GridItem colSpan={hiddenFields.includes("eLeadStatus") ? "2" : "1"}>
              <Status lead={lead} refreshLeads={refreshLeads} />
            </GridItem>
          )}

        {hasPermission("leads", "contactDetails") ? (
          <GridItem colSpan={2} display="flex" justifyContent="space-between">
            {/* Phone */}
            {!hiddenFields.includes("leadPhoneNumber") && (
              <EntityField
                label="Phone"
                value={
                  typeof lead?.leadPhoneNumber === "object"
                    ? lead?.leadPhoneNumber?.result
                    : lead?.leadPhoneNumber
                }
                isCopy
                valueProps={{ color: "text.body" }}
              />
            )}

            {/* WhatsApp */}
            {!hiddenFields.includes("leadWhatsappNumber") && (
              <EntityField
                label="WhatsApp"
                value={
                  typeof lead.leadWhatsappNumber === "object"
                    ? lead.leadWhatsappNumber?.result
                    : lead.leadWhatsappNumber
                }
                isCopy
                valueProps={{ color: "green.400" }}
              />
            )}
          </GridItem>
        ) : (
          <ContactBox lead={lead} />
        )}

        {/* Last Note (occupy full width) */}
        {!hiddenFields.includes("lastNote") && (
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <LastNoteField label="Last Note" lead={lead} />
          </GridItem>
        )}
      </Grid>

      {errorLeadData && (
        <ErrorLeadLimitMessage
          isOpen={isErrorModalOpen}
          onClose={() => setIsErrorModalOpen(false)}
          errorLeadData={errorLeadData}
        />
      )}
    </Box>
  );
};

export default LeftCard;