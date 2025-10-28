import { useMemo } from "react";
import ManagerAgentForm from "./ManagerAgentForm";
import { mainLeadStatus, leadStatus } from "utils/options";
import {
  Grid,
  GridItem,
  FormLabel,
  Input,
  Text,
  Select,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import {
  FiHash,
  FiUser,
  FiMail,
  FiPhone,
  FiMessageCircle,
  FiFlag,
  FiGlobe,
  FiMapPin,
  FiTarget,
  FiLink,
  FiCompass,
  FiClock,
  FiDollarSign,
  FiEdit,
  FiBookOpen,
} from "react-icons/fi";

const AdvancedSearchForm = (props) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    user,
    tree,
    setFieldValue,
  } = props;

  // Define field configurations
  const fields = useMemo(
    () => [
      { name: "intID", label: "Lead ID", placeholder: "Enter Lead ID", icon: FiHash },
      { name: "leadName", label: "Name", placeholder: "Enter Lead Name", icon: FiUser },
      { name: "leadEmail", label: "Email", placeholder: "Enter Lead Email", icon: FiMail },
      { name: "leadPhoneNumber", label: "Phone Number", placeholder: "Enter Lead Phone Number", icon: FiPhone },
      { name: "leadWhatsappNumber", label: "Whatsapp Number", placeholder: "Search by Whatsapp Number", icon: FiMessageCircle },
      { name: "nationality", label: "Nationality", placeholder: "Search by Nationality", icon: FiFlag },
      { name: "ip", label: "Country Source", placeholder: "Search by Country Source", icon: FiGlobe },
      { name: "leadAddress", label: "Lead Address", placeholder: "Search by Address", icon: FiMapPin },
      { name: "leadCampaign", label: "Lead Campaign", placeholder: "Search by Campaign", icon: FiTarget },
      { name: "leadSourceDetails", label: "Source Content", placeholder: "Search by Source Content", icon: FiBookOpen },
      { name: "leadSourceMedium", label: "Source Medium", placeholder: "Search by Source Medium", icon: FiLink },
      { name: "pageUrl", label: "Campaign URL", placeholder: "Search by Campaign URL", icon: FiGlobe },
      { name: "r_u_in_uae", label: "Are You in UAE?", placeholder: "Search by UAE Status", icon: FiCompass },
      { name: "leadLang", label: "Lead Language", placeholder: "Search by Language", icon: FiBookOpen },
      { name: "lastNote", label: "Last Note", placeholder: "Search by Last Note", icon: FiEdit },
      { name: "budget", label: "Budget", placeholder: "Search by Budget", icon: FiDollarSign },
      { name: "timetocall", label: "Time To Call", placeholder: "Search by Time To Call", icon: FiClock },
    ],
    []
  );

  // Utility function for rendering fields
  const renderField = (field) => (
    <GridItem colSpan={{ base: 12, md: 6 }} key={field.name}>
      <FormLabel
        display="flex"
        ms="4px"
        fontSize="sm"
        fontWeight="600"
        color="#000"
        mb="0"
        mt={2}
      >
        {field.label}
      </FormLabel>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={field.icon} color="gray.400" boxSize={4} />
        </InputLeftElement>
        <Input
          fontSize="sm"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[field.name]}
          name={field.name}
          placeholder={field.placeholder}
          fontWeight="500"
          pl="2rem"
        />
      </InputGroup>
      <Text mb="10px" color="red">
        {errors[field.name] && touched[field.name] && errors[field.name]}
      </Text>
    </GridItem>
  );

  return (
    <Grid
      overflow="scroll"
      height="65vh"
      p="2"
      templateColumns="repeat(24, 1fr)"
      mb={3}
      gap={2}
    >
      {fields.map(renderField)}

      {/* Lead Status Field */}
      <GridItem colSpan={{ base: 12, md: 6 }}>
        <FormLabel
          display="flex"
          ms="4px"
          fontSize="sm"
          fontWeight="600"
          color="#000"
          mb="0"
          mt={2}
        >
          Status
        </FormLabel>
        <Select
          value={values?.leadStatus}
          fontSize="sm"
          name="leadStatus"
          onChange={handleChange}
          fontWeight="500"
          placeholder="Select Lead Status"
        >
          {leadStatus.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
        <Text mb="10px" color="red">
          {errors.leadStatus && touched.leadStatus && errors.leadStatus}
        </Text>
      </GridItem>

      {/* Extra Status Field */}
      <GridItem colSpan={{ base: 12, md: 6 }}>
        <FormLabel
          display="flex"
          ms="4px"
          fontSize="sm"
          fontWeight="600"
          color="#000"
          mb="0"
          mt={2}
        >
          Main Status
        </FormLabel>
        <Select
          value={values?.eLeadStatus}
          fontSize="sm"
          name="eLeadStatus"
          onChange={handleChange}
          fontWeight="500"
          placeholder="Select Main Lead Status"
        >
          {mainLeadStatus?.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
          <option value="-1">No E.Status</option>
        </Select>
        <Text mb="10px" color="red">
          {errors.eLeadStatus && touched.eLeadStatus && errors.eLeadStatus}
        </Text>
      </GridItem>

      {/* Released Leads */}
      {user?.roles[0]?.roleName !== "Agent" && (
        <GridItem colSpan={{ base: 12, md: 6 }}>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="600"
            color="#000"
            mb="0"
            mt={2}
          >
            Released
          </FormLabel>
          <Select
            value={values?.isReleased}
            fontSize="sm"
            name="isReleased"
            onChange={handleChange}
            fontWeight="500"
            placeholder="Select Released Status"
          >
            <option value={true}>Released Leads</option>
          </Select>
          <Text mb="10px" color="red">
            {errors.isReleased && touched.isReleased && errors.isReleased}
          </Text>
        </GridItem>
      )}

      {/* Manager / Agent Fields */}
      <ManagerAgentForm
        user={user}
        tree={tree}
        handleChange={handleChange}
        values={values}
        errors={errors}
        touched={touched}
        setFieldValue={setFieldValue}
      />
    </Grid>
  );
};

export default AdvancedSearchForm;
