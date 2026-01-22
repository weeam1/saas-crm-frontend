import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  FormErrorMessage,
  Flex,
  Select as ChakraSelect,
  Box,
} from "@chakra-ui/react";
import Select from "react-select";

/**
 * FormFieldV2
 * Fully controlled Formik + Chakra field with React Select support for multi-select
 */
const FormFieldV2 = ({
  label,
  name,
  type = "text", // text | select | multiselect | textarea | number | date
  formik,
  options = [],
  isRequired = false,
  rows = 3,
  ...props
}) => {
  const value = formik.values[name];
  const error = formik.touched[name] && formik.errors[name];

  const baseStyles = {
    bg: "white",
    borderColor: "gray.300",
    _hover: { borderColor: "gray.400" },
    _focus: {
      borderColor: "#B79045",
      boxShadow: "0 0 0 1px #B79045",
    },
    fontSize: "sm",
  };

  const reactSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "white",
      borderColor: error ? "red" : "#CBD5E0",
      minHeight: "38px",
      boxShadow: state.isFocused ? "0 0 0 1px #B79045" : "none",
      "&:hover": { borderColor: "#B79045" },
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({ ...base, zIndex: 9999 }),
  };

  // =========================
  // FIELD RENDERERS
  // =========================
  const renderInput = () => (
    <Input
      id={name}
      name={name}
      type={type}
      value={value || ""}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      {...baseStyles}
      {...props}
    />
  );

  const renderTextarea = () => (
    <Textarea
      id={name}
      name={name}
      rows={rows}
      value={value || ""}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      {...baseStyles}
      {...props}
    />
  );

  const renderNumber = () => (
    <NumberInput
      value={value || ""}
      onChange={(val) => formik.setFieldValue(name, val)}
      onBlur={formik.handleBlur}
      min={0}
    >
      <NumberInputField {...baseStyles} />
    </NumberInput>
  );

  const renderChakraSelect = () => (
    <ChakraSelect
      id={name}
      name={name}
      value={value || ""}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      {...baseStyles}
      {...props}
    >
      <option value="">Select option</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </ChakraSelect>
  );

  const renderReactMultiSelect = () => (
    <Box>
      <Select
        name={name}
        options={options}
        isMulti
        value={options.filter(
          (opt) => Array.isArray(value) && value.includes(opt.value),
        )}
        onChange={(selected) =>
          formik.setFieldValue(
            name,
            selected ? selected.map((s) => s.value) : [],
          )
        }
        onBlur={() => formik.setFieldTouched(name, true)}
        styles={reactSelectStyles}
        menuPortalTarget={document.body}
        isClearable
      />
    </Box>
  );

  const renderField = () => {
    switch (type) {
      case "textarea":
        return renderTextarea();
      case "select":
        return renderChakraSelect(); // ✅ single-select uses Chakra
      case "multiselect":
        return renderReactMultiSelect(); // ✅ multi-select uses React Select
      case "number":
        return renderNumber();
      default:
        return renderInput();
    }
  };

  return (
    <FormControl isRequired={isRequired} isInvalid={!!error}>
      <Flex mb={1}>
        <FormLabel fontSize="sm" fontWeight="600" color="gray.600">
          {label}
        </FormLabel>
      </Flex>

      {renderField()}

      {error && <FormErrorMessage fontSize="xs">{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default FormFieldV2;
