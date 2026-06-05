import React, { useMemo, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Box,
  Text,
  Divider,
  useBreakpointValue,
  Flex,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import CustomDatePicker from "components/datetime/CustomDatePicker";
import { toUTCString } from "utils/helpers";
import { useSelector } from "react-redux";
import { useModalColors } from "hooks/useModalColors";

const AdvancedSearchModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters,
  clearFilter,
  allowedUserIds = [],
}) => {
  const colors = useModalColors();
  const [openCalendar, setOpenCalendar] = useState(null);
  const colSpan = useBreakpointValue({ base: 1, md: 2 });
  const users = useSelector((state) => state.user.users);

  const filteredUsers = useMemo(() => {
    // If allowedUserIds is empty, show all users (admin or agent case)
    if (!allowedUserIds || allowedUserIds.length === 0) {
      return users;
    }

    // Filter users that are in the allowedUserIds array
    return users?.filter((user) => {
      // Handle different possible ID field names
      const userId = user._id || user.id;
      return allowedUserIds.includes(userId);
    });
  }, [users, allowedUserIds]);

  const toggleCalendar = (calendar) => {
    setOpenCalendar(openCalendar === calendar ? null : calendar);
  };

  const formik = useFormik({
    initialValues: {
      call_from: initialFilters.call_from || "",
      call_to: initialFilters.call_to || "",
      clid: initialFilters.clid || "",
      user_id: initialFilters.id || "",
      start_date: initialFilters.start_date
        ? new Date(initialFilters.start_date)
        : null,
      end_date: initialFilters.end_date
        ? new Date(initialFilters.end_date)
        : null,
      disposition: initialFilters.disposition || "",
      ...initialFilters,
    },
    onSubmit: (values) => {
      const cleanedValues = {
        ...values,
        start_date: values.start_date
          ? toUTCString(values.start_date)
          : undefined,
        end_date: values.end_date ? toUTCString(values.end_date) : undefined,
      };
      onApplyFilters(cleanedValues);
      onClose();
    },
  });

  const handleClear = () => {
    formik.resetForm({
      values: {
        call_from: "",
        call_to: "",
        user_id: "",
        clid: "",
        start_date: null,
        end_date: null,
        disposition: "",
      },
    });
  };

  const cleanedInitialFilters = useMemo(
    () => ({
      call_from: initialFilters.call_from || "",
      call_to: initialFilters.call_to || "",
      clid: initialFilters.clid || "",
      user_id: initialFilters.user_id || "",
      start_date: initialFilters.start_date || null,
      end_date: initialFilters.end_date || null,
      disposition: initialFilters.disposition || "",
    }),
    [initialFilters]
  );

  const isFilterUnchanged = useMemo(
    () =>
      Object.entries(cleanedInitialFilters).every(
        ([key, val]) => formik.values[key] === val
      ),
    [formik.values, cleanedInitialFilters]
  );

  useEffect(() => {
    if (!clearFilter) handleClear();
  }, [clearFilter]);

  const isFilterEmpty = useMemo(
    () =>
      Object.values(formik.values).every(
        (val) => val === "" || val === undefined || val === null
      ),
    [formik.values]
  );

  useEffect(() => {
    if (isOpen) {
      formik.resetForm({
        values: {
          call_from: initialFilters.call_from || "",
          call_to: initialFilters.call_to || "",
          clid: initialFilters.clid || "",
          user_id: initialFilters.user_id || "",
          start_date: initialFilters.start_date
            ? new Date(initialFilters.start_date)
            : null,
          end_date: initialFilters.end_date
            ? new Date(initialFilters.end_date)
            : null,
          disposition: initialFilters.disposition || "",
        },
      });
    }
  }, [isOpen, initialFilters]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      isCentered
      scrollBehavior="inside"
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
      <ModalContent
        bg={colors.viewBg}
        borderRadius="2xl"
        boxShadow={colors.modalShadow}
        maxW={{ base: "full", sm: "90vw", md: "500px" }}
        overflow="hidden"
        mx={{ base: 3, md: 0 }}
      >
        {/* Header - View Modal header (navy, not gold) */}
        <ModalHeader p={0} borderBottom="1px solid" borderColor={colors.viewHeaderBorder}>
          <Flex
            align="center"
            bg={colors.viewHeaderBg}
            color={colors.viewHeaderText}
            px={6}
            py={3}
            position="sticky"
            top="0"
            zIndex="10"
            boxShadow="sm"
          >
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
              flex="1"
            >
              Advanced Search
            </Text>
            <ModalCloseButton
              position="absolute"
              right="12px"
              top="10px"
              color={colors.viewHeaderText}
              _hover={{ bg: colors.closeBtnHoverBg }}
            />
          </Flex>
        </ModalHeader>

        {/* Body */}
        <form onSubmit={formik.handleSubmit}>
          <ModalBody
            p={5}
            overflowY="auto"
            maxH="65vh"
            borderBottom="1px solid"
            borderColor={colors.borderColor}
            bg={colors.viewBg}
          >
            <VStack spacing={5} align="stretch">
              <FormControl>
                <FormLabel fontWeight="semibold" color={colors.labelColor}>
                  User
                </FormLabel>
                <Select
                  name="user_id"
                  placeholder="Select user"
                  value={formik.values.user_id}
                  onChange={formik.handleChange}
                  bg={colors.bgInput}
                  borderColor={colors.borderColor}
                  color={colors.headingText}
                  _hover={{ borderColor: colors.accentGold }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                >
                  <option value="" style={{ background: colors.viewBg, color: colors.headingText }}>
                    All Users
                  </option>
                  {filteredUsers?.map((user) => (
                    <option
                      key={user.id}
                      value={user.id}
                      style={{ background: colors.viewBg, color: colors.headingText }}
                    >
                      {user.fullName || user.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold" color={colors.labelColor}>
                  Call From
                </FormLabel>
                <Input
                  name="call_from"
                  placeholder="Enter caller number"
                  value={formik.values.call_from}
                  onChange={formik.handleChange}
                  bg={colors.bgInput}
                  borderColor={colors.borderColor}
                  color={colors.headingText}
                  _placeholder={{ color: colors.mutedText }}
                  _hover={{ borderColor: colors.accentGold }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold" color={colors.labelColor}>
                  Call To
                </FormLabel>
                <Input
                  name="call_to"
                  placeholder="Enter recipient number"
                  value={formik.values.call_to}
                  onChange={formik.handleChange}
                  bg={colors.bgInput}
                  borderColor={colors.borderColor}
                  color={colors.headingText}
                  _placeholder={{ color: colors.mutedText }}
                  _hover={{ borderColor: colors.accentGold }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold" color={colors.labelColor}>
                  CLID
                </FormLabel>
                <Input
                  name="clid"
                  placeholder="Enter CLID"
                  value={formik.values.clid}
                  onChange={formik.handleChange}
                  bg={colors.bgInput}
                  borderColor={colors.borderColor}
                  color={colors.headingText}
                  _placeholder={{ color: colors.mutedText }}
                  _hover={{ borderColor: colors.accentGold }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                />
              </FormControl>

              <Divider borderColor={colors.borderColor} />

              <Box>
                <Text
                  fontWeight="semibold"
                  mb={2}
                  color={colors.labelColor}
                >
                  Date Range
                </Text>
                <VStack spacing={3} align="stretch">
                  <FormControl>
                    <FormLabel fontWeight="medium" color={colors.labelColor}>
                      Start Date
                    </FormLabel>
                    <CustomDatePicker
                      selectedDate={formik.values.start_date}
                      handleDateChange={(date) =>
                        formik.setFieldValue("start_date", date)
                      }
                      placeholder="Select start date"
                      maxDate={formik.values.end_date || new Date()}
                      isCalendarOpen={openCalendar === "start_date"}
                      toggleCalendar={() => toggleCalendar("start_date")}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="medium" color={colors.labelColor}>
                      End Date
                    </FormLabel>
                    <CustomDatePicker
                      selectedDate={formik.values.end_date}
                      handleDateChange={(date) =>
                        formik.setFieldValue("end_date", date)
                      }
                      placeholder="Select end date"
                      minDate={formik.values.start_date}
                      maxDate={new Date()}
                      isCalendarOpen={openCalendar === "end_date"}
                      toggleCalendar={() => toggleCalendar("end_date")}
                    />
                  </FormControl>
                </VStack>
              </Box>

              <Divider borderColor={colors.borderColor} />

              <FormControl>
                <FormLabel fontWeight="semibold" color={colors.labelColor}>
                  Disposition
                </FormLabel>
                <Select
                  name="disposition"
                  placeholder="Select disposition"
                  value={formik.values.disposition}
                  onChange={formik.handleChange}
                  bg={colors.bgInput}
                  borderColor={colors.borderColor}
                  color={colors.headingText}
                  _hover={{ borderColor: colors.accentGold }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                >
                  <option value="ANSWERED" style={{ background: colors.viewBg, color: colors.headingText }}>
                    Answered
                  </option>
                  <option value="NO ANSWER" style={{ background: colors.viewBg, color: colors.headingText }}>
                    No Answer
                  </option>
                  <option value="FAILED" style={{ background: colors.viewBg, color: colors.headingText }}>
                    Failed
                  </option>
                  <option value="BUSY" style={{ background: colors.viewBg, color: colors.headingText }}>
                    Busy
                  </option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          {/* Footer */}
          <ModalFooter
            position="sticky"
            bottom="0"
            bg={colors.viewFooterBg}
            borderTop="1px solid"
            borderColor={colors.viewFooterBorder}
            py={3}
            px={5}
            zIndex="10"
            justifyContent="flex-end"
            gap={3}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              borderRadius="md"
              isDisabled={isFilterEmpty}
            >
              Clear
            </Button>
            <Button
              variant="brand"
              size="sm"
              type="submit"
              borderRadius="md"
              isDisabled={isFilterUnchanged}
            >
              Apply
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AdvancedSearchModal;