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
  useColorModeValue,
  HStack,
  Text,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useCreateItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";
import { mainLeadStatus, leadStatus } from "utils/options";
import RenderFields from "components/shared/RenderFields";
import { useDispatch, useSelector } from "react-redux";
import { addOrUpdateLead } from "../../../../redux/leadsSlice";
import PhoneField from "components/fields/PhoneField";
import { toCapitalCase } from "utils/helpers";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import useUserSession from "hooks/useUserSession";
import { FiUserPlus } from "react-icons/fi";

const AddLead = ({ isOpen, onClose, size = "6xl" }) => {
  const { user } = useUserSession();
  const dispatch = useDispatch();
  const { createUserLog } = useUserActivityLog();
  const countries = useSelector((state) => state.countries.countryNames);
  const bg = useColorModeValue("white", "gray.800");
  const headerColor = useColorModeValue("brand.300", "brand.100");
  const textColor = useColorModeValue("brand.700", "brand.900");

  const initialValues = {
    leadName: "",
    leadWhatsappNumber: "",
    leadPhoneNumber: "",
    nationality: "",
    timetocall: "",
    budget: "",
    ip: "0.0.0.0",
    city: "",
    country: "",
    eLeadStatus: "",
    leadStatus: "",
    leadLang: "",
    lastNote: "",
    leadSourceDetails: "",
    leadSourceChannel: "",
    leadSourceMedium: "",
    leadCampaign: "",
    pageUrl: "",
    leadAddress: "",
    leadEmail: "",
    r_u_in_uae: "",
    attendanceDay: "",
    adset: "",
  };

  const validationSchema = Yup.object({
    leadName: Yup.string().required("Name is required"),
  });

  const fields = [
    { name: "leadName", label: "Name", type: "text", required: true },
    { name: "leadEmail", label: "Email", type: "email" },
    { name: "nationality", label: "Nationality", type: "text" },
    { name: "timetocall", label: "Time to Call", type: "text" },
    { name: "budget", label: "Budget", type: "text" },
    { name: "ip", label: "IP", type: "text" },
    { name: "city", label: "City", type: "text" },
    {
      name: "country",
      label: "Country",
      type: "select",
      options: countries.map((name) => {
        const countryName = toCapitalCase(name);
        return { label: countryName, value: countryName };
      }),
    },
    { name: "leadLang", label: "Language", type: "text" },
    { name: "leadSourceDetails", label: "Source Content", type: "text" },
    { name: "leadSourceChannel", label: "Lead Source Channel", type: "text" },
    { name: "leadCampaign", label: "Campaign", type: "text" },
    { name: "pageUrl", label: "Page URL", type: "url" },
    { name: "leadSourceMedium", label: "Source Medium", type: "text" },
    { name: "r_u_in_uae", label: "Are you In UAE?", type: "text" },
    { name: "leadAddress", label: "Address", type: "text" },
    { name: "attendanceDay", label: "Attendance Day", type: "text" },
    { name: "adset", label: "Adset", type: "text" },
    {
      name: "eLeadStatus",
      label: "Select Main Status",
      type: "select",
      options: mainLeadStatus,
    },
    {
      name: "leadStatus",
      label: "Select Lead Status",
      type: "select",
      options: leadStatus,
    },
  ];

  const [createItemMutation, { isLoading }] = useCreateItemMutation();

  const handleSubmit = async (values, actions) => {
    try {
      const formattedIp = [
        values.ip || "",
        values.city || "",
        values.country || "",
      ]
        .join("-")
        .trim();

      const updatedValues = { ...values, ip: formattedIp };
      delete updatedValues.city;
      delete updatedValues.country;

      const res = await createItemMutation({
        path: "/lead/add-lead",
        body: updatedValues,
      }).unwrap();

      toast.success("Lead added successfully.");
      onClose();
      actions.resetForm();
      dispatch(addOrUpdateLead(res));

      createUserLog({
        userId: user?._id,
        action: "CREATE",
        entity: "Lead",
        enityType: "Lead",
        entityId: res?._id || null,
        status: "success",
        message: `${res?.leadName || ""} Lead created successfully`,
      });
    } catch (error) {
      console.error(error);
      const errorMsg = error.data?.message || "Error creating lead.";
      toast.error(errorMsg);
      createUserLog({
        userId: user?._id,
        action: "CREATE",
        entity: "Lead",
        enityType: "Lead",
        status: error?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent
        bg={bg}
        borderRadius="lg"
        overflow="hidden"
        mx={{ base: 2, sm: 2, md: 0 }}
      >
        <ModalHeader
          bg={headerColor}
          color={textColor}
          py={{ base: 3, md: 4 }}
          px={{ base: 4, md: 6 }}
        >
          <HStack justify="space-between" align="center">
            <HStack spacing="2" align="center">
              <FiUserPlus size="22" />
              <Text fontSize="xl" fontWeight="600">
                Add New Lead
              </Text>
            </HStack>
            <ModalCloseButton color={textColor} position="relative" top="0"  />
          </HStack>
        </ModalHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleBlur, setFieldValue }) => (
            <Form>
              <ModalBody
                px={{ base: 4, md: 8 }}
                py={6}
                maxH="70vh"
                overflowY="auto"
              >
                <Grid
                  templateColumns={{
                    base: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    xl: "repeat(4, 1fr)",
                  }}
                  gap={5}
                >
                  <PhoneField
                    name="leadWhatsappNumber"
                    label="WhatsApp"
                    country="ae"
                    value={values.leadWhatsappNumber}
                    error={errors.leadWhatsappNumber}
                    touched={touched.leadWhatsappNumber}
                    onChange={(val) => setFieldValue("leadWhatsappNumber", val)}
                    onBlur={handleBlur}
                  />
                  <PhoneField
                    name="leadPhoneNumber"
                    label="Phone Number"
                    country="ae"
                    value={values.leadPhoneNumber}
                    error={errors.leadPhoneNumber}
                    touched={touched.leadPhoneNumber}
                    onChange={(val) => setFieldValue("leadPhoneNumber", val)}
                    onBlur={handleBlur}
                  />
                  <RenderFields fields={fields} />
                </Grid>
              </ModalBody>

              <ModalFooter gap={3} borderTop="1px solid" borderColor="gray.200">
                <Button
                  variant="outline"
                  colorScheme="gray"
                  size="sm"
                  onClick={onClose}
                  borderRadius={"md"}
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  colorScheme="brand"
                  type="submit"
                  borderRadius={"md"}
                  isLoading={isLoading}
                >
                  Add Lead
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AddLead;
