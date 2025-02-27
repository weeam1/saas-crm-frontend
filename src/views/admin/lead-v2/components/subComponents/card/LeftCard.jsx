import EntityField from "./EntityField";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Text,
} from "@chakra-ui/react";
import LastNoteField from "./LastNoteField";
import MainStatus from "../MainStatus";
import Status from "../Status";
import Agents from "../Agents";
import Managers from "../Managers";
import { IoMdEye } from "react-icons/io";
import { leadlabelFontSize } from "../../constants";
import LeadTypeBadge from "../LeadTypeBadge";
import { useMemo } from "react";

const LeftCard = ({ lead, setViewLead, refreshLeads, role }) => {
  const leadType = useMemo(() => {
    return lead?.leadType ?? (lead?.leadStatus === "new" ? "new" : undefined);
  }, [lead?.leadType, lead?.leadStatus]);

  return (
    <Box flex="1">
      <Flex alignItems="center" gap="2">
        <Icon
          as={IoMdEye}
          boxSize="12px"
          onClick={() => setViewLead({ isOpen: true, lid: lead?._id })}
          color="gray.400"
          cursor="pointer"
        />

        <Text fontSize={leadlabelFontSize} color="softGray.200">
          {lead?.intID || "N/A"}
        </Text>
      </Flex>
      <HStack mb={2}>
        <Text fontSize="12px" fontWeight="semibold">
          {lead?.leadName || "N/A"}
        </Text>
        <LeadTypeBadge leadType={leadType} roleName={role} />
      </HStack>

      <Grid
        // minWidth='14.75rem'
        minWidth="12em" // Scales based on the parent element's font size
        // templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
        templateColumns="repeat(2, 1fr)"
        alignItems="start"
        gap={{ base: 4, md: 2 }}
      >
        <EntityField
          label="Country"
          value={lead?.ip?.split("-")[1]}
          valueProps={{ color: "#FF0004" }}
        />
        <EntityField
          label="Nationality"
          value={lead.nationality}
          valueProps={{ color: "#FF0004" }}
        />
        {/* Manager */}
        {role === "superAdmin" && (
          <GridItem>
            <Managers
              managerAssigned={lead?.managerAssigned}
              lead={lead}
              refreshLeads={refreshLeads}
              role={role}
            />
          </GridItem>
        )}

        {/* Agent */}
        {["superAdmin", "Manager"].includes(role) && (
          <GridItem colSpan={role === "Manager" ? "2" : "1"}>
            <Agents
              agentAssigned={lead?.agentAssigned}
              managerAssigned={lead?.managerAssigned}
              lead={lead}
              refreshLeads={refreshLeads}
            />
          </GridItem>
        )}

        {/* Main lead status */}
        <GridItem>
          <MainStatus lead={lead} refreshLeads={refreshLeads} role={role} />
        </GridItem>
        {/* Lead status */}
        <GridItem>
          <Status lead={lead} refreshLeads={refreshLeads} />
        </GridItem>

        {/* Phone */}
        <GridItem>
          <EntityField
            label="Phone"
            value={
              typeof lead?.leadPhoneNumber === "object"
                ? lead?.leadPhoneNumber?.result
                : lead?.leadPhoneNumber
            }
            isCopy
            valueProps={{ color: "#7667FF" }}
          />
        </GridItem>

        {/* WhatsApp */}
        <GridItem>
          <EntityField
            label="WhatsApp"
            value={
              typeof lead.leadWhatsappNumber === "object"
                ? lead.leadWhatsappNumber?.result
                : lead.leadWhatsappNumber
            }
            isCopy
            valueProps={{ color: "green.700" }}
          />
        </GridItem>

        {/* Last Note (occupy full width) */}
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <LastNoteField label="Last Note" value={lead.lastNote} />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default LeftCard;
