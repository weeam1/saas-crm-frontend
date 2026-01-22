import React, { useState, useRef, useEffect } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  Flex,
  Button,
  Heading,
  Text,
  Icon,
  VStack,
  Badge,
  FormControl,
  FormLabel,
  Input,
  useRadioGroup,
  useRadio,
  Textarea,
  Grid,
  GridItem,
  useTheme,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";
import { useFormik } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import {
  useCreateLeadQualificationMutation,
  useUpdateLeadQualificationMutation,
} from "../../../../api/apiSlice";
import {
  FiInfo,
  FiBriefcase,
  FiCheck,
  FiTrendingUp,
  FiUser,
  FiDollarSign,
  FiCalendar,
  FiTarget,
  FiHome,
  FiMapPin,
  FiClock,
  FiThermometer,
  FiCheckCircle,
  FiAward,
  FiPercent,
  FiBarChart2,
  FiPackage,
  FiCreditCard,
  FiShield,
  FiGlobe,
  FiHeart,
  FiTrendingDown,
  FiCornerRightUp,
  FiPhone,
  FiMessageSquare,
  FiFileText,
  FiUsers,
  FiHelpCircle,
} from "react-icons/fi";
import { RiWhatsappLine, RiWhatsappFill } from "react-icons/ri";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_WEEAM_LOCAL_API; // or your base URL

// ===================== OPTIONS DATA WITH ICONS =====================

const buildQualificationPayload = ({ leadId, values }) => {
  const payload = {
    lead: leadId, // ✅ include leadId here
    coreQualification: {
      leadType: values.leadType,
      budgetRange: values.budgetRange,
      exactRequirement: values.exactRequest,
      propertyTypes: values.propertyType,
      preferredLocations: values.preferredLocations,
      purchaseTimeline: values.purchaseTimeline,
      decisionStatus: values.decisionStatus,
      clientTemperature: values.clientTemperature,
      nextActionType: values.nextActionType,
      nextActionDate: new Date(values.nextActionDate).toISOString(),
    },
    dealQualification: {
      decisionMaker: values.decisionMaker || null,
      paymentMethod: values.paymentMethod || null,
      downPaymentPreference: values.downPaymentPreference || null,
      handoverPreference: values.handoverPreference || null,
      installmentDuration: values.installmentDuration || null,
      clientPriorities: values.clientPriority || [],
    },
  };

  if (values.leadType === "INVESTOR") {
    payload.investmentProfile = {
      investmentGoal: values.investmentGoal || null,
      targetROI: values.targetROI || null,
      holdingPeriod: values.holdingPeriod || null,
      exitStrategy: values.exitStrategy || null,
    };
  }

  return payload;
};

const LEAD_QUALIFICATION_OPTIONS = {
  leadType: [
    { value: "END_USER", label: "End User", icon: FiUser, color: "blue" },
    { value: "SELLER", label: "Seller", icon: FiDollarSign, color: "purple" },
    {
      value: "INVESTOR",
      label: "Investor",
      icon: FiTrendingUp,
      color: "green",
    },
    {
      value: "BROKER",
      label: "Broker",
      icon: FiBriefcase,
      color: "yellow",
    },
  ],

  budgetRange: [
    { value: "UNDER_500K", label: "Under 500K", color: "gray" },
    { value: "500K_TO_1M", label: "500K – 1M", color: "blue" },
    { value: "1M_TO_2M", label: "1M – 2M", color: "green" },
    { value: "2M_TO_5M", label: "2M – 5M", color: "yellow" },
    { value: "OVER_5M", label: "Over 5M", color: "red" },
  ],

  propertyTypes: [
    { value: "APARTMENT", label: "Apartment", icon: FiHome, color: "blue" },
    { value: "VILLA", label: "Villa", icon: FiHome, color: "purple" },
    { value: "TOWNHOUSE", label: "Townhouse", icon: FiHome, color: "green" },
    { value: "PLOT", label: "Plot", icon: FiMapPin, color: "yellow" },
    {
      value: "COMMERCIAL",
      label: "Commercial",
      icon: FiBriefcase,
      color: "red",
    },
  ],

  preferredLocations: [
    {
      value: "DUBAI_MARINA",
      label: "Dubai Marina",
      icon: FiMapPin,
      color: "blue",
    },
    {
      value: "DOWNTOWN",
      label: "Downtown Dubai",
      icon: FiMapPin,
      color: "blue",
    },
    {
      value: "BUSINESS_BAY",
      label: "Business Bay",
      icon: FiMapPin,
      color: "blue",
    },
    {
      value: "PALM_JUMEIRAH",
      label: "Palm Jumeirah",
      icon: FiMapPin,
      color: "green",
    },
    {
      value: "JVC",
      label: "Jumeirah Village Circle (JVC)",
      icon: FiMapPin,
      color: "green",
    },
    {
      value: "JVT",
      label: "Jumeirah Village Triangle (JVT)",
      icon: FiMapPin,
      color: "green",
    },
    {
      value: "SPORTS_CITY",
      label: "Dubai Sports City",
      icon: FiMapPin,
      color: "yellow",
    },
    {
      value: "DLRC",
      label: "Dubai Land Residence Complex (DLRC)",
      icon: FiMapPin,
      color: "yellow",
    },
    { value: "ARJAN", label: "Arjan", icon: FiMapPin, color: "yellow" },
    { value: "MEYDAN", label: "Meydan", icon: FiMapPin, color: "purple" },
    { value: "MAJAN", label: "Majan", icon: FiMapPin, color: "purple" },
    {
      value: "DIP",
      label: "Dubai Investment Park (DIP)",
      icon: FiMapPin,
      color: "cyan",
    },
    {
      value: "DUBAI_SOUTH",
      label: "Dubai South",
      icon: FiMapPin,
      color: "cyan",
    },
    { value: "OTHER", label: "Other", icon: FiMapPin, color: "gray" },
  ],

  purchaseTimeline: [
    { value: "IMMEDIATE", label: "Immediate", icon: FiClock, color: "green" },
    {
      value: "ONE_TO_THREE_MONTHS",
      label: "1–3 Months",
      icon: FiCalendar,
      color: "blue",
    },
    {
      value: "THREE_TO_SIX_MONTHS",
      label: "3–6 Months",
      icon: FiCalendar,
      color: "yellow",
    },
    {
      value: "SIX_PLUS_MONTHS",
      label: "6+ Months",
      icon: FiCalendar,
      color: "gray",
    },
  ],

  decisionStatus: [
    {
      value: "READY",
      label: "Ready to Buy",
      icon: FiCheckCircle,
      color: "green",
    },
    {
      value: "COMPARING",
      label: "Comparing Options",
      icon: FiTarget,
      color: "blue",
    },
    {
      value: "NEEDS_APPROVAL",
      label: "Needs Approval",
      icon: FiShield,
      color: "amber",
    },
    {
      value: "JUST_EXPLORING",
      label: "Just Exploring",
      icon: FiGlobe,
      color: "gray",
    },
  ],

  clientTemperature: [
    { value: "HOT", label: "Hot", icon: FiThermometer, color: "red" },
    { value: "WARM", label: "Warm", icon: FiThermometer, color: "yellow" },
    { value: "COLD", label: "Cold", icon: FiThermometer, color: "blue" },
  ],

  nextActionType: [
    { value: "CALL", label: "Call", icon: FiPhone, color: "teal" },
    { value: "WHATSAPP", label: "WhatsApp", icon: FaWhatsapp, color: "green" },
    {
      value: "SEND_OPTIONS",
      label: "Send Options",
      icon: FiPackage,
      color: "blue",
    },
    {
      value: "SEND_SALES_OFFER",
      label: "Send Sales Offer",
      icon: FiFileText,
      color: "yellow",
    },
    {
      value: "BOOK_MEETING",
      label: "Book Meeting",
      icon: FiCalendar,
      color: "purple",
    },
    { value: "FOLLOW_UP", label: "Follow Up", icon: FiClock, color: "gray" },
  ],

  decisionMaker: [
    { value: "SELF", label: "Self", icon: FiUser, color: "blue" },
    { value: "SPOUSE", label: "Spouse", icon: FiHeart, color: "pink" },
    { value: "FAMILY", label: "Family", icon: FiUsers, color: "green" },
    {
      value: "PARTNER",
      label: "Business Partner",
      icon: FiBriefcase,
      color: "yellow",
    },
    { value: "COMPANY", label: "Company", icon: FiGlobe, color: "cyan" },
  ],

  paymentMethod: [
    { value: "CASH", label: "Cash", icon: FiDollarSign, color: "green" },
    { value: "MORTGAGE", label: "Mortgage", icon: FiCreditCard, color: "blue" },
    {
      value: "INSTALLMENTS",
      label: "Installments",
      icon: FiCalendar,
      color: "purple",
    },
    {
      value: "UNDECIDED",
      label: "Undecided",
      icon: FiHelpCircle,
      color: "gray",
    },
  ],

  downPaymentPreference: [
    {
      value: "TEN_TO_TWENTY_PERCENT",
      label: "10% – 20%",
      // icon: FiPercent,
      color: "green",
    },
    {
      value: "TWENTY_TO_THIRTY_PERCENT",
      label: "20% – 30%",
      // icon: FiPercent,
      color: "blue",
    },
    {
      value: "THIRTY_PLUS_PERCENT",
      label: "30%+",
      // icon: FiPercent,
      color: "purple",
    },
  ],

  handoverPreference: [
    {
      value: "READY",
      label: "Ready Property",
      icon: FiCheckCircle,
      color: "green",
    },
    { value: "OFF_PLAN", label: "Off-Plan", icon: FiCalendar, color: "blue" },
    { value: "BOTH", label: "Both", icon: FiGlobe, color: "yellow" },
  ],

  installmentDuration: [
    {
      value: "TWO_TO_THREE_YEARS",
      label: "2–3 Years",
      icon: FiCalendar,
      color: "green",
    },
    {
      value: "FOUR_TO_FIVE_YEARS",
      label: "4–5 Years",
      icon: FiCalendar,
      color: "blue",
    },
    {
      value: "SIX_TO_EIGHT_YEARS",
      label: "6–8 Years",
      icon: FiCalendar,
      color: "purple",
    },
  ],

  clientPriorities: [
    { value: "PRICE", label: "Price", icon: FiDollarSign, color: "green" },
    { value: "LOCATION", label: "Location", icon: FiMapPin, color: "blue" },
    {
      value: "ROI",
      label: "Return on Investment",
      icon: FiTrendingUp,
      color: "yellow",
    },
    {
      value: "PAYMENT_PLAN",
      label: "Payment Plan",
      icon: FiCreditCard,
      color: "purple",
    },
    {
      value: "DEVELOPER_BRAND",
      label: "Developer Brand",
      icon: FiAward,
      color: "cyan",
    },
  ],

  investmentGoal: [
    {
      value: "RENTAL_YIELD",
      label: "Rental Yield",
      icon: FiBarChart2,
      color: "blue",
    },
    {
      value: "CAPITAL_APPRECIATION",
      label: "Capital Appreciation",
      icon: FiTrendingUp,
      color: "green",
    },
    {
      value: "BOTH",
      label: "Rental + Appreciation",
      icon: FiTarget,
      color: "purple",
    },
  ],

  targetROI: [
    {
      value: "UNDER_FIVE_PERCENT",
      label: "Under 5%",
      // icon: FiPercent,
      color: "red",
    },
    {
      value: "FIVE_TO_SEVEN_PERCENT",
      label: "5% – 7%",
      // icon: FiPercent,
      color: "yellow",
    },
    {
      value: "SEVEN_TO_TEN_PERCENT",
      label: "7% – 10%",
      // icon: FiPercent,
      color: "green",
    },
    {
      value: "TEN_PLUS_PERCENT",
      label: "10%+",
      // icon: FiPercent,
      color: "blue",
    },
  ],

  holdingPeriod: [
    {
      value: "UNDER_ONE_YEAR",
      label: "Under 1 Year",
      icon: FiCalendar,
      color: "red",
    },
    {
      value: "ONE_TO_THREE_YEARS",
      label: "1–3 Years",
      icon: FiCalendar,
      color: "yellow",
    },
    {
      value: "THREE_TO_FIVE_YEARS",
      label: "3–5 Years",
      icon: FiCalendar,
      color: "green",
    },
    {
      value: "FIVE_PLUS_YEARS",
      label: "5+ Years",
      icon: FiCalendar,
      color: "blue",
    },
  ],

  exitStrategy: [
    { value: "RESALE", label: "Resale", icon: FiCornerRightUp, color: "green" },
    { value: "RENT", label: "Rent", icon: FiHome, color: "blue" },
    { value: "FLIP", label: "Flip", icon: FiTrendingDown, color: "yellow" },
    {
      value: "UNDECIDED",
      label: "Undecided",
      icon: FiHelpCircle,
      color: "gray",
    },
  ],
};
const crmSteps = [
  // ===================== STEP 1: CORE QUALIFICATION (All Mandatory) =====================
  {
    title: "Core Qualification",
    subtitle: "All fields are mandatory",
    icon: FiInfo,
    color: "#B79045",
    fields: [
      {
        name: "leadType",
        label: "Lead Type",
        type: "cardSelect",
        required: true,
        options: LEAD_QUALIFICATION_OPTIONS.leadType,
      },
      {
        name: "budgetRange",
        label: "Budget Range",
        type: "cardSelect",
        required: true,
        options: LEAD_QUALIFICATION_OPTIONS.budgetRange,
      },
      {
        name: "exactRequest",
        label: "Exact Request",
        type: "textarea",
        required: true,
        placeholder: "Describe exactly what the client is looking for...",
      },
      {
        name: "propertyType",
        label: "Property Type",
        type: "tagSelect",
        required: true,
        options: LEAD_QUALIFICATION_OPTIONS.propertyTypes,
      },
      {
        name: "preferredLocations",
        label: "Preferred Locations",
        type: "tagSelect",
        required: true,
        options: LEAD_QUALIFICATION_OPTIONS.preferredLocations,
      },
      {
        name: "purchaseTimeline",
        label: "Purchase Timeline",
        type: "cardSelect",
        required: true,
        options: LEAD_QUALIFICATION_OPTIONS.purchaseTimeline,
      },
      {
        name: "decisionStatus",
        label: "Decision Status",
        type: "cardSelect",
        required: true,
        options: LEAD_QUALIFICATION_OPTIONS.decisionStatus,
      },
      {
        name: "clientTemperature",
        label: "Client Temperature",
        type: "cardSelect",
        required: true,
        options: LEAD_QUALIFICATION_OPTIONS.clientTemperature,
      },
      {
        name: "nextActionType",
        label: "Next Action Type",
        type: "cardSelect",
        required: true,
        options: LEAD_QUALIFICATION_OPTIONS.nextActionType,
      },
      {
        name: "nextActionDate",
        label: "Next Action Date",
        type: "date",
        required: true,
      },
    ],
  },

  // ===================== STEP 2: DEAL QUALIFICATION (Optional) =====================
  {
    title: "Deal Qualification",
    subtitle: "All fields are optional",
    icon: FiBriefcase,
    color: "#4299E1",
    fields: [
      {
        name: "decisionMaker",
        label: "Decision Maker",
        type: "cardSelect",
        required: false,
        options: LEAD_QUALIFICATION_OPTIONS.decisionMaker,
      },
      {
        name: "paymentMethod",
        label: "Payment Method",
        type: "cardSelect",
        required: false,
        options: LEAD_QUALIFICATION_OPTIONS.paymentMethod,
      },
      {
        name: "downPaymentPreference",
        label: "Down Payment Preference",
        type: "cardSelect",
        required: false,
        options: LEAD_QUALIFICATION_OPTIONS.downPaymentPreference,
      },
      {
        name: "handoverPreference",
        label: "Handover Preference",
        type: "cardSelect",
        required: false,
        options: LEAD_QUALIFICATION_OPTIONS.handoverPreference,
      },
      {
        name: "installmentDuration",
        label: "Installment Duration",
        type: "cardSelect",
        required: false,
        options: LEAD_QUALIFICATION_OPTIONS.installmentDuration,
      },
      {
        name: "clientPriority",
        label: "Client Priority",
        type: "tagSelect",
        required: false,
        options: LEAD_QUALIFICATION_OPTIONS.clientPriorities,
      },
    ],
  },

  // ===================== STEP 3: INVESTMENT PROFILE (Conditional) =====================
  {
    title: "Investment Profile",
    subtitle: "Only for Investor lead type",
    icon: FiTrendingUp,
    color: "#38A169",
    fields: [
      {
        name: "investmentGoal",
        label: "Investment Goal",
        type: "cardSelect",
        required: false,
        options: LEAD_QUALIFICATION_OPTIONS.investmentGoal,
      },
      {
        name: "targetROI",
        label: "Target ROI / Yield",
        type: "cardSelect",
        required: false,
        options: LEAD_QUALIFICATION_OPTIONS.targetROI,
      },
      {
        name: "holdingPeriod",
        label: "Holding Period",
        type: "cardSelect",
        required: false,
        options: LEAD_QUALIFICATION_OPTIONS.holdingPeriod,
      },
      {
        name: "exitStrategy",
        label: "Exit Strategy",
        type: "cardSelect",
        required: false,
        options: LEAD_QUALIFICATION_OPTIONS.exitStrategy,
      },
    ],
  },
];

// ===================== CARD SELECT COMPONENT =====================
const CardSelect = ({ options, value, onChange, name, isInvalid, onBlur }) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    value,
    onChange: (val) => {
      onChange(name, val);
      if (onBlur) {
        setTimeout(() => onBlur({ target: { name } }), 100);
      }
    },
  });

  const group = getRootProps();

  // Check which field this is for responsive columns
  const isBudgetRange = name === "budgetRange";
  const isNextActionType = name === "nextActionType";
  const isDecisionMaker = name === "decisionMaker"; // 5 options

  // Get number of options
  const optionCount = options.length;

  // If 3 or fewer options, show them in one row (full width)
  if (optionCount <= 3) {
    return (
      <SimpleGrid
        columns={optionCount} // Dynamic columns based on option count
        spacing={2}
        {...group}
      >
        {options.map((option) => {
          const radio = getRadioProps({ value: option.value });
          const isSelected = value === option.value;
          return (
            <CardOption
              key={option.value}
              label={option.label}
              color={option.color}
              icon={option.icon}
              isSelected={isSelected}
              isInvalid={isInvalid}
              {...radio}
            />
          );
        })}
      </SimpleGrid>
    );
  }

  // For Decision Maker (5 options) - show as 3 in first row, 2 in second row
  if (isDecisionMaker) {
    // Split options into two rows: first 3, then last 2
    const firstRowOptions = options.slice(0, 3);
    const secondRowOptions = options.slice(3);

    return (
      <Box {...group}>
        {/* First row with 3 buttons */}
        <SimpleGrid
          columns={3}
          spacing={2}
          mb={2} // Add margin bottom for spacing between rows
        >
          {firstRowOptions.map((option) => {
            const radio = getRadioProps({ value: option.value });
            const isSelected = value === option.value;
            return (
              <CardOption
                key={option.value}
                label={option.label}
                color={option.color}
                icon={option.icon}
                isSelected={isSelected}
                isInvalid={isInvalid}
                {...radio}
              />
            );
          })}
        </SimpleGrid>

        {/* Second row with 2 buttons */}
        <SimpleGrid
          columns={2}
          spacing={2}
          maxW="66.666%" // Make it take only 2/3 of the width to center it
          mx="auto" // Center the grid
        >
          {secondRowOptions.map((option) => {
            const radio = getRadioProps({ value: option.value });
            const isSelected = value === option.value;
            return (
              <CardOption
                key={option.value}
                label={option.label}
                color={option.color}
                icon={option.icon}
                isSelected={isSelected}
                isInvalid={isInvalid}
                {...radio}
              />
            );
          })}
        </SimpleGrid>
      </Box>
    );
  }

  // For other fields with more than 3 options
  return (
    <SimpleGrid
      columns={{
        base: isBudgetRange ? 5 : isNextActionType ? 3 : 2,
        sm: isBudgetRange ? 5 : isNextActionType ? 3 : 3,
        md: isBudgetRange ? 5 : isNextActionType ? 3 : 4,
      }}
      spacing={isBudgetRange ? 1 : 2}
      {...group}
    >
      {options.map((option) => {
        const radio = getRadioProps({ value: option.value });
        const isSelected = value === option.value;
        return (
          <CardOption
            key={option.value}
            label={option.label}
            color={option.color}
            icon={option.icon}
            isSelected={isSelected}
            isInvalid={isInvalid}
            {...radio}
          />
        );
      })}
    </SimpleGrid>
  );
};
const CardOption = ({
  label,
  color,
  icon,
  isSelected,
  isInvalid,
  ...props
}) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const theme = useTheme();

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  const colorScheme = color || "blue";
  const selectedColor =
    theme.colors[colorScheme]?.[500] || theme.colors.blue[500];
  const defaultColor =
    theme.colors[colorScheme]?.[400] || theme.colors.gray[500];

  const IconComponent = icon;

  return (
    <Box as="label" w="100%">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        borderColor={
          isInvalid ? "red.400" : isSelected ? selectedColor : "gray.200"
        }
        bg={isSelected ? `${colorScheme}.50` : "white"}
        color={isSelected ? `${colorScheme}.700` : "gray.700"}
        p={2}
        textAlign="center"
        fontWeight="medium"
        fontSize="xs"
        transition="all 0.2s"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        gap={2}
        _hover={{
          borderColor: isInvalid
            ? "red.400"
            : isSelected
              ? selectedColor
              : `${colorScheme}.300`,
          bg: isInvalid
            ? "red.50"
            : isSelected
              ? `${colorScheme}.50`
              : "gray.50",
          transform: "translateY(-1px)",
          boxShadow: "sm",
        }}
        _checked={{
          borderColor: selectedColor,
          bg: `${colorScheme}.50`,
          color: `${colorScheme}.700`,
        }}
      >
        {/* Only show icon if it exists */}
        {icon && (
          <Flex
            align="center"
            justify="center"
            w="24px"
            h="24px"
            flexShrink={0}
          >
            <IconComponent
              size={14}
              color={isSelected ? selectedColor : defaultColor}
            />
          </Flex>
        )}

        <Text fontWeight="semibold" fontSize="xs" noOfLines={1}>
          {label}
        </Text>
      </Box>
    </Box>
  );
};

// ===================== TAG SELECT COMPONENT (Multi-select with badges) =====================
const TagSelect = ({
  options,
  value = [],
  onChange,
  name,
  isInvalid,
  onBlur,
  isMulti = true,
}) => {
  const borderColor = isInvalid ? "red.400" : "gray.200";

  const handleToggle = (tagValue) => {
    const newValue = value.includes(tagValue)
      ? value.filter((v) => v !== tagValue)
      : [...value, tagValue];

    onChange(name, newValue);
    // Removed onBlur call here
  };

  // Add onBlur to the container if needed
  return (
    <Box
      borderWidth={isInvalid ? "2px" : "1px"}
      borderColor={borderColor}
      borderRadius="md"
      p={2}
      onBlur={onBlur} // Move onBlur here
    >
      <Flex wrap="wrap" gap={2}>
        {options.map((option) => {
          const isSelected = value.includes(option.value);
          return (
            <Badge
              key={option.value}
              as="button"
              type="button"
              px={4}
              py={2}
              borderRadius="md"
              fontSize="sm"
              fontWeight="medium"
              variant={isSelected ? "solid" : "outline"}
              colorScheme={isSelected ? "blue" : "gray"}
              sx={
                isSelected
                  ? {
                      bg: "blue.100",
                      color: "blue.800",
                      borderColor: "blue.300",
                      borderWidth: "1px",
                    }
                  : {}
              }
              cursor="pointer"
              onClick={() => handleToggle(option.value)}
            >
              {option.label}
            </Badge>
          );
        })}
      </Flex>
    </Box>
  );
};
const ReactSelectField = ({
  options,
  value = [],
  onChange,
  name,
  isInvalid,
  onBlur,
  placeholder = "Select options...",
}) => {
  const selectOptions = options.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  const selectedValues = value.map((val) => {
    const option = options.find((opt) => opt.value === val);
    return {
      value: val,
      label: option?.label || val,
    };
  });

  const handleSelectChange = (selected) => {
    const newValue = selected ? selected.map((item) => item.value) : [];
    onChange(name, newValue);
    if (onBlur) {
      setTimeout(() => onBlur({ target: { name } }), 100);
    }
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: isInvalid
        ? "#FC8181"
        : state.isFocused
          ? "#3182CE"
          : "#E2E8F0",
      borderWidth: isInvalid ? "2px" : "1px",
      borderRadius: "8px",
      boxShadow: state.isFocused && !isInvalid ? "0 0 0 1px #3182CE" : "none",
      "&:hover": {
        borderColor: isInvalid ? "#FC8181" : "#CBD5E0",
      },
      minHeight: "40px",
      backgroundColor: "white",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#E6F7FF",
      borderRadius: "6px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      fontWeight: "500",
      color: "#3182CE",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#3182CE",
      "&:hover": {
        backgroundColor: "#BEE3F8",
        color: "#2C5282",
      },
    }),
  };

  return (
    <>
      <Select
        isMulti
        options={selectOptions}
        value={selectedValues}
        onChange={handleSelectChange}
        onBlur={() => onBlur && onBlur({ target: { name } })}
        placeholder={placeholder}
        styles={customStyles}
        classNamePrefix="select"
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
      />
      {isInvalid && (
        <Text fontSize="xs" color="red.500" mt={2}>
          Please select at least one Preferred Location
        </Text>
      )}
    </>
  );
};

// ===================== MAIN COMPONENT =====================
export const CRMQualificationModal = ({
  isOpen,
  onClose,
  leadId,
  userId,
  data,
  isEditMode = false,
}) => {
  const [step, setStep] = useState(0);
  const contentRef = useRef(null);
  const [createLeadQualification, { isLoading }] =
    useCreateLeadQualificationMutation();
  const [updateLeadQualification, { isLoading: isUpdating }] = // ADD THIS
    useUpdateLeadQualificationMutation();
  // Reset scroll when step changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [step]);

  const getInitialValues = () => {
    // If editing and data exists, populate from data
    if (isEditMode && data) {
      // Format date for input field
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      return {
        leadType: data.coreQualification?.leadType || "",
        budgetRange: data.coreQualification?.budgetRange || "",
        exactRequest: data.coreQualification?.exactRequirement || "",
        propertyType: data.coreQualification?.propertyTypes || [],
        preferredLocations: data.coreQualification?.preferredLocations || [],
        purchaseTimeline: data.coreQualification?.purchaseTimeline || "",
        decisionStatus: data.coreQualification?.decisionStatus || "",
        clientTemperature: data.coreQualification?.clientTemperature || "",
        nextActionType: data.coreQualification?.nextActionType || "",
        nextActionDate: formatDateForInput(
          data.coreQualification?.nextActionDate,
        ),
        decisionMaker: data.dealQualification?.decisionMaker || "",
        paymentMethod: data.dealQualification?.paymentMethod || "",
        downPaymentPreference:
          data.dealQualification?.downPaymentPreference || "",
        handoverPreference: data.dealQualification?.handoverPreference || "",
        installmentDuration: data.dealQualification?.installmentDuration || "",
        clientPriority: data.dealQualification?.clientPriorities || [],
        investmentGoal: data.investmentProfile?.investmentGoal || "",
        targetROI: data.investmentProfile?.targetROI || "",
        holdingPeriod: data.investmentProfile?.holdingPeriod || "",
        exitStrategy: data.investmentProfile?.exitStrategy || "",
      };
    }

    // Default empty values for create mode
    const values = {};
    crmSteps.forEach((section) => {
      section.fields.forEach((field) => {
        values[field.name] = field.type === "tagSelect" ? [] : "";
      });
    });
    return values;
  };

  // Create validation schema for all fields
  const validationSchema = Yup.object().shape({
    leadType: Yup.string().required("Lead Type is required"),
    budgetRange: Yup.string().required("Budget Range is required"),
    exactRequest: Yup.string()
      .min(10, "Exact Request must be at least 10 characters")
      .max(500, "Exact Request must be at most 500 characters")
      .required("Exact Request is required"),
    propertyType: Yup.array()
      .min(1, "Please select at least one Property Type")
      .required("Property Type is required"),
    preferredLocations: Yup.array()
      .min(1, "Please select at least one Preferred Location")
      .required("Preferred Locations is required"),
    purchaseTimeline: Yup.string().required("Purchase Timeline is required"),
    decisionStatus: Yup.string().required("Decision Status is required"),
    clientTemperature: Yup.string().required("Client Temperature is required"),
    nextActionType: Yup.string().required("Next Action Type is required"),
    nextActionDate: Yup.string().required("Next Action Date is required"),
    decisionMaker: Yup.string().nullable(),
    paymentMethod: Yup.string().nullable(),
    downPaymentPreference: Yup.string().nullable(),
    handoverPreference: Yup.string().nullable(),
    installmentDuration: Yup.string().nullable(),
    clientPriority: Yup.array().nullable(),
    investmentGoal: Yup.string().nullable(),
    targetROI: Yup.string().nullable(),
    holdingPeriod: Yup.string().nullable(),
    exitStrategy: Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema,
    enableReinitialize: isEditMode, // ADD THIS LINE
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = buildQualificationPayload({ leadId, values });

        if (isEditMode) {
          // Use update mutation
          await updateLeadQualification({
            qualificationId: data._id, // Pass qualification ID
            leadId,
            createdBy: userId,
            body: payload,
          }).unwrap();
        } else {
          // Use create mutation
          await createLeadQualification({
            leadId,
            createdBy: userId,
            body: payload,
          }).unwrap();
        }

        handleClose();
      } catch (error) {
        console.error("Lead qualification submission failed", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setStep(0);
    onClose();
  };

  const validateCurrentStep = () => {
    const currentStepFields = crmSteps[step].fields;

    // Mark all fields in current step as touched
    const touchedFields = {};
    currentStepFields.forEach((field) => {
      touchedFields[field.name] = true;
    });

    formik.setTouched(touchedFields, false);

    // Check if any required fields in current step are empty
    const errors = {};
    let hasErrors = false;

    currentStepFields.forEach((field) => {
      if (field.required) {
        const value = formik.values[field.name];
        let isValid = true;

        if (field.type === "tagSelect") {
          isValid = value && value.length > 0;
        } else if (field.type === "textarea") {
          isValid = value && value.trim().length >= 10;
        } else {
          isValid = value && value.trim() !== "";
        }

        if (!isValid) {
          errors[field.name] = `${field.label} is required`;
          hasErrors = true;
        }
      }
    });

    if (hasErrors) {
      formik.setErrors({
        ...formik.errors,
        ...errors,
      });
      return false;
    }

    return true;
  };

  const handleNext = () => {
    // Step 0 → validate required fields
    if (step === 0) {
      const isValid = validateCurrentStep();
      if (isValid) setStep(1);
      return;
    }

    // Step 1 → submit OR go to investment profile
    if (step === 1) {
      if (formik.values.leadType === "INVESTOR") {
        setStep(2); // ONLY investors go to step 3
      } else {
        formik.handleSubmit(); // others submit directly
      }
      return;
    }

    // Step 2 (Investor only)
    if (step === 2) {
      formik.handleSubmit();
    }
  };

  const handleBack = () => {
    if (step === 2 && formik.values.leadType !== "INVESTOR") {
      setStep(1);
      return;
    }

    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Handle field change
  const handleFieldChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
    formik.setFieldTouched(fieldName, true, false);

    // Clear the specific field error when user interacts
    if (formik.errors[fieldName]) {
      formik.setFieldError(fieldName, undefined);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    formik.handleChange(e);
    formik.setFieldTouched(name, true, false);

    // Clear error for this field
    if (formik.errors[name]) {
      formik.setFieldError(name, undefined);
    }
  };

  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    formik.handleChange(e);
    formik.setFieldTouched(name, true, false);

    // Clear error for this field
    if (formik.errors[name]) {
      formik.setFieldError(name, undefined);
    }
  };

  const renderField = (field) => {
    // For step 3, only show if lead type is Investor
    if (step === 2 && formik.values.leadType !== "INVESTOR") {
      return null;
    }

    const error = formik.touched[field.name] && formik.errors[field.name];

    switch (field.type) {
      case "cardSelect":
        return (
          <FormControl isInvalid={error} isRequired={field.required}>
            <FormLabel fontSize="sm" fontWeight="semibold" mb={1}>
              {field.label}
            </FormLabel>
            <CardSelect
              options={field.options}
              value={formik.values[field.name]}
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
              name={field.name}
              isInvalid={error}
            />
            {error && (
              <Text fontSize="xs" color="red.500" mt={2}>
                {error}
              </Text>
            )}
          </FormControl>
        );

      case "tagSelect":
        return (
          <FormControl isInvalid={error} isRequired={field.required}>
            <FormLabel fontSize="sm" fontWeight="semibold" mb={1}>
              {field.label}
            </FormLabel>
            {field.name === "preferredLocations" ? (
              <ReactSelectField
                options={field.options}
                value={formik.values[field.name]}
                onChange={handleFieldChange}
                onBlur={formik.handleBlur}
                name={field.name}
                isInvalid={error}
                placeholder="Select preferred locations..."
              />
            ) : (
              <TagSelect
                options={field.options}
                value={formik.values[field.name]}
                onChange={handleFieldChange}
                onBlur={formik.handleBlur}
                name={field.name}
                isInvalid={error}
              />
            )}
            {field.name !== "preferredLocations" && error && (
              <Text fontSize="xs" color="red.500" mt={2}>
                {error}
              </Text>
            )}
          </FormControl>
        );
      case "textarea":
        return (
          <FormControl isInvalid={error} isRequired={field.required}>
            <FormLabel fontSize="sm" fontWeight="semibold" mb={1}>
              {field.label}
            </FormLabel>
            <Textarea
              name={field.name}
              value={formik.values[field.name]}
              onChange={handleTextareaChange}
              onBlur={formik.handleBlur}
              placeholder={field.placeholder}
              size="md"
              rows={4}
              borderRadius="lg"
              borderColor={error ? "red.400" : "gray.200"}
              _hover={{ borderColor: error ? "red.500" : "gray.300" }}
              _focus={{
                borderColor: error ? "red.500" : "blue.500",
                boxShadow: error ? "0 0 0 1px red.500" : "0 0 0 1px blue.500",
              }}
            />
            <Flex justify="space-between" mt={2}>
              {error && (
                <Text fontSize="xs" color="red.500">
                  {error}
                </Text>
              )}
              <Text fontSize="xs" color="gray.500" ml="auto">
                {formik.values[field.name]?.length || 0}/500
              </Text>
            </Flex>
          </FormControl>
        );

      case "date":
        return (
          <FormControl isInvalid={error} isRequired={field.required}>
            <FormLabel fontSize="sm" fontWeight="semibold" mb={1}>
              {field.label}
            </FormLabel>
            <Input
              name={field.name}
              type="date"
              value={formik.values[field.name]}
              onChange={handleInputChange}
              onBlur={formik.handleBlur}
              size="md"
              borderRadius="lg"
              min={new Date().toISOString().split("T")[0]}
              borderColor={error ? "red.400" : "gray.200"}
              _hover={{ borderColor: error ? "red.500" : "gray.300" }}
              _focus={{
                borderColor: error ? "red.500" : "blue.500",
                boxShadow: error ? "0 0 0 1px red.500" : "0 0 0 1px blue.500",
              }}
            />
            {error && (
              <Text fontSize="xs" color="red.500" mt={2}>
                {error}
              </Text>
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  // Check if step 3 should be visible
  const shouldShowStep3 = formik.values.leadType === "INVESTOR";
  const currentStepFields = crmSteps[step]?.fields || [];

  // Determine button text
  const getNextButtonText = () => {
    if (step === 1 && !shouldShowStep3) {
      return "Submit";
    }
    if (step === 2) {
      return "Submit";
    }
    return "Next";
  };

  // Filter steps to show
  const visibleSteps = crmSteps.filter((_, index) => {
    if (index === 2) {
      return shouldShowStep3;
    }
    return true;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent
        borderRadius="xl"
        boxShadow="xl"
        maxW="800px"
        maxH="90vh"
        display="flex"
        flexDirection="column"
      >
        <ModalHeader
          bg="#B79045"
          borderTopRadius="xl"
          py={3}
          fontSize="md"
          fontWeight="bold"
          color="white"
          borderBottom="1px"
          borderColor="gray.100"
        >
          <Flex align="center" justify="space-between">
            <Heading size="md" color="white">
              {isEditMode
                ? "Edit Qualification"
                : "Lead Qualification & Feedback"}{" "}
              {/* UPDATE THIS */}
            </Heading>
          </Flex>
        </ModalHeader>

        {/* Step Indicators */}
        <Box
          px={6}
          py={4}
          borderBottom="1px"
          borderColor="gray.100"
          bg="gray.50"
          flexShrink={0}
        >
          <Flex justify="space-between" position="relative">
            {/* Connecting Line */}
            <Box
              position="absolute"
              top="16px"
              left="20px"
              right="20px"
              height="2px"
              bg="gray.200"
              zIndex={0}
            />

            {visibleSteps.map((section, index) => {
              const isActive = index === step;
              const isCompleted = index < step;
              const isFuture = index > step;
              const circleColor = isCompleted
                ? "green.500"
                : isActive
                  ? section.color
                  : "gray.300";

              return (
                <VStack
                  key={index}
                  spacing={2}
                  position="relative"
                  zIndex={1}
                  flex={1}
                >
                  {/* Step Circle - Always filled with color */}
                  <Box
                    w="32px"
                    h="32px"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={circleColor}
                    border={isActive ? "2px solid white" : "none"}
                    boxShadow={
                      isActive
                        ? `0 0 0 3px ${section.color}`
                        : "0 1px 3px rgba(0, 0, 0, 0.1)"
                    }
                    transition="all 0.3s ease"
                  >
                    {isCompleted ? (
                      <FiCheck color="white" size={16} />
                    ) : (
                      <section.icon color="white" size={isActive ? 16 : 14} />
                    )}
                  </Box>

                  {/* Step Label */}
                  <Text
                    fontSize="xs"
                    fontWeight={isActive ? "600" : "500"}
                    color={
                      isActive
                        ? "gray.800"
                        : isCompleted
                          ? "gray.700"
                          : "gray.500"
                    }
                    textAlign="center"
                    maxW="100px"
                    lineHeight="shorter"
                  >
                    {section.title}
                  </Text>
                </VStack>
              );
            })}
          </Flex>
        </Box>
        {/* Scrollable form content */}
        <ModalBody
          ref={contentRef}
          flex="1"
          overflowY="auto"
          px={6}
          py={6}
          css={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              width: "8px",
              background: "#f1f1f1",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#c1c1c1",
              borderRadius: "4px",
              "&:hover": {
                background: "#a8a8a8",
              },
            },
          }}
        >
          <Grid templateColumns="1fr" gap={6} pb={4}>
            {currentStepFields.map((field, index) => (
              <GridItem key={field.name}>{renderField(field)}</GridItem>
            ))}
          </Grid>
        </ModalBody>

        <ModalFooter
          pt={3}
          borderTop="1px"
          borderColor="gray.100"
          flexShrink={0}
          bg="gray.200"
        >
          <Flex justify="space-between" w="full">
            <Button
              bg="gray.100"
              variant="ghost"
              size="md"
              onClick={step === 0 ? handleClose : handleBack}
            >
              {step === 0 ? "Cancel" : "Back"}
            </Button>

            <Flex align="center" gap={4}>
              <Button
                colorScheme={"brand"}
                size="md"
                onClick={handleNext}
                isLoading={formik.isSubmitting || isUpdating}
                isDisabled={formik.isSubmitting}
                px={6}
              >
                {getNextButtonText()}
              </Button>
            </Flex>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CRMQualificationModal;
