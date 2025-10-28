import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  Select,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { Field } from "formik";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

const RenderFields = ({ fields }) => {
  return fields?.map((field) => (
    <Field name={field.name} key={field.name}>
      {({ field: formikField, form, meta }) => (
        <FormControl mb={4} isInvalid={meta.touched && meta.error}>
          {/* Label */}
          {field.type !== "checkbox" && (
            <FormLabel
              htmlFor={field.name}
              fontSize="sm"
              fontWeight="semibold"
              color="gray.600"
            >
              {field.label}
            </FormLabel>
          )}

          {/* Input Type Handling */}
          {field.type === "textarea" ? (
            <Textarea
              id={field.name}
              {...formikField}
              bg="gray.50"
              borderColor="gray.300"
              _hover={{ borderColor: "brand.400" }}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
              placeholder={field.label}
              minH="100px"
            />
          ) : field.type === "checkbox" ? (
            <Checkbox
              id={field.name}
              {...formikField}
              isChecked={formikField.value}
              colorScheme="brand"
            >
              {field.label}
            </Checkbox>
          ) : field.type === "select" ? (
            <InputGroup>
              {field.icon && (
                <InputLeftElement pointerEvents="none" width="2.5rem">
                  <Icon as={field.icon} color="gray.400" boxSize={4} />
                </InputLeftElement>
              )}
              <Select
                id={field.name}
                {...formikField}
                bg="gray.50"
                borderColor="gray.300"
                pl={field.icon ? 10 : 4}
                _hover={{ borderColor: "brand.400" }}
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                }}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </InputGroup>
          ) : (field.name === "leadPhoneNumber" || field.name === "leadWhatsappNumber") ? (
            <PhoneInput
              country={"pk"}
              value={formikField.value}
              onChange={(phone) => form.setFieldValue(field.name, phone)}
              inputStyle={{
                width: "100%",
                height: "40px",
                backgroundColor: "#F9FAFB",
                borderColor: "#D1D5DB",
                borderRadius: "0.375rem",
                paddingLeft: "48px",
              }}
              buttonStyle={{
                borderColor: "#D1D5DB",
                backgroundColor: "#F9FAFB",
              }}
              dropdownStyle={{
                zIndex: 10000,
              }}
              placeholder={field.label}
            />
          ) : (
            <InputGroup>
              {field.icon && (
                <InputLeftElement pointerEvents="none" width="2.5rem">
                  <Icon as={field.icon} color="gray.400" boxSize={4} />
                </InputLeftElement>
              )}
              <Input
                id={field.name}
                type={field.type}
                {...formikField}
                bg="gray.50"
                borderColor="gray.300"
                pl={field.icon ? 10 : 4}
                height="40px"
                _hover={{ borderColor: "brand.400" }}
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                }}
                placeholder={field.label}
              />
            </InputGroup>
          )}

          {/* Error message */}
          {meta.touched && meta.error && (
            <div style={{ color: "red", fontSize: "0.8em", marginTop: "2px" }}>
              {meta.error}
            </div>
          )}
        </FormControl>
      )}
    </Field>
  ));
};

export default RenderFields;
