import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  VStack,
  HStack,
  Icon,
  useClipboard,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import {
  FaUser,
  FaChartLine,
  FaGlobe,
  FaClipboardList,
  FaInfoCircle,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { getApi } from "services/api";
import { extractLocationData } from "utils/helpers";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { mainLeadStatusLabels, leadStatusLabels } from "utils/searchLabels";
import CardShimmer from "components/loading/CardShimmer";
import NoData from "components/Message/NoData";
import { format } from "date-fns";
import CustomTooltip from "components/shared/CustomTooltip";
import { toast } from "react-toastify";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import useUserSession from "hooks/useUserSession";
import { usePermissions } from "hooks/usePermissions";
import { safeValue } from "utils";

const LeadDetails = ({ leadId, reFreshData, isInLeadPool }) => {
  const { user, userRoleName } = useUserSession();
  const { hasPermission } = usePermissions();
  const countries = useSelector((state) => state.countries.countryNames);
  const { createUserLog } = useUserActivityLog();

  const [data, setData] = useState();
  const [leadIp, setLeadIp] = useState({ ip: "", city: "", country: "" });
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getApi("api/lead/view/", leadId);
      setData(response?.data?.lead);

      const { ip, city, country } = extractLocationData(
        response?.data?.lead?.ip,
        countries
      );
      setLeadIp({ ip, city, country });

      createUserLog({
        userId: user?._id,
        action: "VIEW",
        entity: "Lead",
        entityType: "Lead",
        entityId: leadId,
        status: "success",
        message: `${user?.fullName || ""} viewed ${response?.data?.lead?.leadName || ""} lead.`,
      });
    } catch (err) {
      console.error(err);
      const errorMsg = err?.data?.message || "Lead details not found!";
      toast.error(errorMsg);

      createUserLog({
        userId: user?._id,
        action: "VIEW",
        entity: "Lead",
        entityType: "Lead",
        entityId: leadId,
        status: err?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchParams] = useSearchParams();
  let hideContact = false;

  if (userRoleName === "superAdmin") {
    hideContact = false;
  } else if (searchParams.get("invite") && userRoleName !== "superAdmin") {
    hideContact = user?._id !== data?.agentAssigned;
  } else if (isInLeadPool) hideContact = true;

  if (isLoading) {
    return (
      <VStack gap="2" width="100%">
        <CardShimmer
          count={4}
          height="200px"
          columns={{ base: 1, sm: 1, md: 2, lg: 2, xl: 2, "2xl": 2 }}
        />
        <CardShimmer
          count={1}
          height="100px"
          width={{ base: "full" }}
          columns={{ base: 1, sm: 1, md: 1, lg: 1, xl: 1, "2xl": 1 }}
        />
      </VStack>
    );
  }

  if (!data) {
    return (
      <Box>
        <NoData label="lead details" />
      </Box>
    );
  }

  const formatValue = (value) =>
    !value
      ? "N/A"
      : typeof value === "object"
        ? value.result || value.text
        : value;

  return (
    <Grid templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }} gap={4}>
      {/* Basic Information */}
      <GridItem colSpan={2}>
        <SectionCard title="Basic Information" icon={FaUser} color="brand.500">
          <DetailGrid>
            <DetailItem label="Lead Name" value={data?.leadName} />
            {hasPermission("leads", "contactDetails") && !hideContact && (
              <>
                <DetailItem label="Email" value={data?.leadEmail} />
                <DetailItem
                  label="Phone"
                  value={formatValue(data?.leadPhoneNumber)}
                />
                <DetailItem
                  label="WhatsApp"
                  value={formatValue(data?.leadWhatsappNumber)}
                />
              </>
            )}
            <DetailItem label="Address" value={data?.leadAddress} />
          </DetailGrid>
        </SectionCard>
      </GridItem>

      {/* Source & Tracking */}
      <GridItem>
        <SectionCard
          title="Source & Tracking"
          icon={FaClipboardList}
          color="brand.500"
        >
          <DetailGrid>
            <DetailItem label="Source" value={data?.leadSource} />
            <DetailItem
              label="Channel"
              value={data?.leadSourceChannel || data?.leadSourceMedium}
            />
            <DetailItem label="Campaign" value={data?.leadCampaign} />
            <DetailItem label="Adset" value={data?.adset} />
            <DetailItem
              label="Source Content"
              value={data?.leadSourceDetails}
            />
            <DetailItem label="Page URL" value={data?.pageUrl} isLink />
          </DetailGrid>
        </SectionCard>
      </GridItem>

      {/* Status & Timeline */}
      <GridItem>
        <SectionCard
          title="Status & Timeline"
          icon={FaChartLine}
          color="brand.500"
        >
          <DetailGrid>
            <DetailItem
              label="Status"
              value={leadStatusLabels[data?.leadStatus] || "N/A"}
            />
            <DetailItem
              label="Main Status"
              value={mainLeadStatusLabels[data?.eLeadStatus] || "N/A"}
            />
            <DetailItem
              label="Follow-up Status"
              value={data?.leadFollowUpStatus}
            />
            <DetailItem
              label="Created Date"
              value={
                data?.createdDate
                  ? format(new Date(data?.createdDate), "d MMM, yyyy h:mm a")
                  : "N/A"
              }
            />
          </DetailGrid>
        </SectionCard>
      </GridItem>

      {/* Additional Details */}
      <GridItem colSpan={2}>
        <SectionCard
          title="Additional Details"
          icon={FaInfoCircle}
          color="brand.500"
        >
          <DetailGrid>
            <DetailItem
              label="Nationality"
              value={safeValue(data?.nationality)}
            />
            <DetailItem
              label="Preferred Time"
              value={safeValue(data?.timetocall)}
            />
            <DetailItem label="In UAE?" value={safeValue(data?.r_u_in_uae)} />
            <DetailItem label="Interest" value={safeValue(data?.interest)} />
            <DetailItem label="Language" value={safeValue(data?.leadLang)} />
            <DetailItem label="Budget" value={safeValue(data?.budget)} />
          </DetailGrid>
        </SectionCard>
      </GridItem>

      {/* Technical Details */}
      <GridItem colSpan={2}>
        <SectionCard title="Technical Details" icon={FaGlobe} color="brand.500">
          <DetailGrid>
            <DetailItem
              label="City"
              value={leadIp?.city}
              textTransform="capitalize"
            />
            <DetailItem
              label="Country"
              value={leadIp?.country}
              textTransform="capitalize"
            />
            {/* Optionally show IP for non-Agent roles:
            {!['Agent'].includes(user?.roles[0]?.roleName) && (
              <DetailItem label='IP Address' value={data?.ip} />
            )} */}
          </DetailGrid>
        </SectionCard>
      </GridItem>
    </Grid>
  );
};

const SectionCard = ({ title, children, icon, color }) => (
  <Box
    p={4}
    rounded="xl"
    bg="gray.50"
    borderWidth="1px"
    borderColor="gray.200"
    shadow="md"
    _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
    transition="0.18s ease"
  >
    <HStack mb={3} spacing={3}>
      {icon && <Icon as={icon} boxSize={5} color={color || "brand.500"} />}
      <Heading size="sm" color="gray.700" fontWeight="600">
        {title}
      </Heading>
    </HStack>
    {children}
  </Box>
);

const DetailGrid = ({ children }) => (
  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
    {children}
  </Grid>
);

const DetailItem = ({ label, value, isLink = false, ...props }) => {
  const { hasCopied, onCopy } = useClipboard(value || "");
  return (
    <Box>
      <Text fontSize="xs" color="gray.500" fontWeight="600" mb={1}>
        {label}
      </Text>

      {isLink && value ? (
        <HStack spacing={2}>
          <Text
            fontSize="sm"
            color="brand.500"
            fontWeight="500"
            isTruncated
            maxWidth="300px"
            {...props}
          >
            <a href={value} target="_blank" rel="noreferrer">
              {value}
            </a>
          </Text>
          <CustomTooltip label={value || "N/A"}>
            <Icon
              as={InfoIcon}
              boxSize={3}
              color="brand.300"
              cursor="pointer"
            />
          </CustomTooltip>
        </HStack>
      ) : (
        <Text
          fontSize="sm"
          color="gray.700"
          fontWeight="500"
          isTruncated
          {...props}
        >
          {value || "N/A"}
        </Text>
      )}
    </Box>
  );
};

export default LeadDetails;
