import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Grid,
  Flex,
  Icon,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useUpdateItemMutation } from "api/apiSlice";
import RenderFields from "components/shared/RenderFields";
import { extractLocationData, toCapitalCase } from "utils/helpers";
import { useSelector, useDispatch } from "react-redux";
import { safeValue } from "utils";
import useUserSession from "hooks/useUserSession";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import { usePermissions } from "hooks/usePermissions";
import { addOrUpdateLead } from "../../../../redux/leadsSlice";

import {
  FaUserEdit,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaFlag,
  FaMoneyBill,
} from "react-icons/fa";
import {
  MdLocationOn,
  MdCampaign,
  MdLanguage,
  MdNoteAlt,
  MdAccessTime,
  MdOutlineWeb,
  MdLocationCity,
  MdApartment,
  MdHome,
  MdPublic,
} from "react-icons/md";

const EditLeadModal = ({ isOpen, onClose, leadData }) => {
  const dispatch = useDispatch();
  const countries = useSelector((state) => state.countries.countryNames);
  const { ip, city, country } = extractLocationData(leadData?.ip, countries);
  const { user } = useUserSession();
  const { hasPermission } = usePermissions();
  const { createUserLog } = useUserActivityLog();
  const [updateItemMutation, { isLoading }] = useUpdateItemMutation();

  const bgColor = useColorModeValue("white", "gray.800");
  const headerColor = useColorModeValue("brand.300", "brand.100");

  // Initial Values
  const initialValues = {
    leadName: safeValue(leadData?.leadName) || "",
    leadWhatsappNumber: safeValue(leadData?.leadWhatsappNumber) || "",
    leadPhoneNumber: safeValue(leadData?.leadPhoneNumber) || "",
    nationality: safeValue(leadData?.nationality) || "",
    budget: safeValue(leadData?.budget) || "",
    ip: safeValue(ip) || "",
    city: safeValue(city) || "",
    country: safeValue(country) || "",
    leadLang: safeValue(leadData?.leadLang) || "",
    timetocall: safeValue(leadData?.timetocall) || "",
    leadSourceDetails: safeValue(leadData?.leadSourceDetails) || "",
    leadSourceChannel: safeValue(leadData?.leadSourceChannel) || "",
    leadCampaign: safeValue(leadData?.leadCampaign) || "",
    pageUrl: safeValue(leadData?.pageUrl) || "",
    leadAddress: safeValue(leadData?.leadAddress) || "",
    leadEmail: safeValue(leadData?.leadEmail) || "",
    leadSourceMedium: safeValue(leadData?.leadSourceMedium) || "",
    r_u_in_uae: safeValue(leadData?.r_u_in_uae) || "",
    attendanceDay: safeValue(leadData?.attendanceDay) || "",
    adset: safeValue(leadData?.adset) || "",
  };

  // Validation
  const validationSchema = Yup.object({
    leadName: Yup.string().required("Name is required"),
  });

  const fields = [
    { name: "leadName", label: "Name", type: "text", icon: FaUserEdit },
    { name: "leadEmail", label: "Email", type: "email", icon: FaEnvelope },
    { name: "leadWhatsappNumber", label: "WhatsApp", type: "text", icon: FaWhatsapp },
    { name: "leadPhoneNumber", label: "Phone Number", type: "text", icon: FaPhone },
    { name: "nationality", label: "Nationality", type: "text", icon: FaFlag },
    { name: "budget", label: "Budget", type: "text", icon: FaMoneyBill },
    { name: "timetocall", label: "Time to Call", type: "text", icon: MdAccessTime },
    { name: "ip", label: "IP", type: "text", icon: MdPublic },
    { name: "city", label: "City", type: "text", icon: MdLocationCity },
    {
      name: "country",
      label: "Country",
      type: "select",
      icon: MdApartment,
      options: countries.map((name) => ({
        label: toCapitalCase(name),
        value: toCapitalCase(name),
      })),
    },
    { name: "leadLang", label: "Language", type: "text", icon: MdLanguage },
    { name: "leadSourceDetails", label: "Source Content", type: "text", icon: MdNoteAlt },
    { name: "leadSourceChannel", label: "Lead Source Channel", type: "text", icon: MdCampaign },
    { name: "leadCampaign", label: "Campaign", type: "text", icon: MdCampaign },
    { name: "pageUrl", label: "Page URL", type: "url", icon: MdOutlineWeb },
    { name: "leadSourceMedium", label: "Source Medium", type: "text", icon: MdCampaign },
    { name: "leadAddress", label: "Address", type: "text", icon: MdHome },
    { name: "r_u_in_uae", label: "Are you In UAE ?", type: "text", icon: MdPublic },
    { name: "attendanceDay", label: "Attendance Day", type: "text", icon: MdAccessTime },
    { name: "adset", label: "Adset", type: "text", icon: MdCampaign },
  ];

  // Apply Permissions
  const allowedFields = (() => {
    if (hasPermission("leads", "update")) return fields;
    if (hasPermission("leads", "edit_contacts")) {
      return fields.filter((f) =>
        ["leadPhoneNumber", "leadWhatsappNumber"].includes(f.name)
      );
    }
    return [];
  })();

  // Submit Handler
  const handleSubmit = async (values, actions) => {
    try {
      const formattedIp = [values.ip || "", values.city || "", values.country || ""]
        .join("-")
        .trim();

      const updatedValues = { ...values, ip: formattedIp };
      delete updatedValues.city;
      delete updatedValues.country;

      const res = await updateItemMutation({
        path: `/lead/edit-lead/${leadData?._id}`,
        body: updatedValues,
      }).unwrap();

      dispatch(addOrUpdateLead(res));

      toast.success("Lead updated successfully.");
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Lead",
        entityType: "Lead",
        entityId: leadData?._id,
        status: "success",
        message: `${res?.leadName || ""} Lead updated successfully`,
      });

      actions.resetForm();
      onClose();
    } catch (error) {
      console.error(error);
      const errorMsg =
        error?.data?.message ||
        `Lead ${leadData?.leadName || ""} failed to update.`;

      toast.error(errorMsg);
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Lead",
        entityType: "Lead",
        entityId: leadData?._id,
        status: error?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      isCentered
      scrollBehavior="inside"
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent
        bg={bgColor}
        borderRadius="2xl"
        boxShadow="2xl"
        maxH="90vh"
        maxW={{ base: "full", sm: "full", md: "70vw" }}
        overflow="hidden"
        mx={{ base: 2, md: 8 }}
        w="full"
      >
        {/* Header */}
        <ModalHeader fontSize="lg" fontWeight="semibold" color="white" m="0" p="0">
          <Flex
            align="center"
            justify="space-between"
            bg={headerColor}
            color="white"
            position="sticky"
            top="0"
            zIndex="20"
            boxShadow="md"
            px={5}
            py={3}
          >
            <Flex align="center" gap={2}>
              <Icon as={FaUserEdit} boxSize={5} />
              Edit Lead
            </Flex>
            <ModalCloseButton color="white" position="relative" top="0" />
          </Flex>
        </ModalHeader>

        <Divider />

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <ModalBody py={4} px={6} flex="1" overflowY="auto" maxH="60vh">
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={4}
                >
                  <RenderFields fields={allowedFields} />
                </Grid>
              </ModalBody>

              <Divider />

              <ModalFooter
                gap={3}
                position="sticky"
                bottom="0"
                bg={bgColor}
                borderTop="1px solid"
                borderColor="gray.200"
                py={3}
                zIndex="10"
              >
                <Button
                  variant="outline"
                  colorScheme="gray"
                  onClick={onClose}
                  size="sm"
                  borderRadius="md"
                >
                  Cancel
                </Button>
                {allowedFields.length > 0 && (
                  <Button
                    colorScheme="brand"
                    type="submit"
                    size="sm"
                    borderRadius="md"
                    isLoading={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Lead"}
                  </Button>
                )}
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default EditLeadModal;