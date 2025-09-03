import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Stack,
  Text,
  Box,
  Checkbox,
  Input,
  Icon,
  FormControl,
  FormLabel,
  HStack,
  SimpleGrid,
  Grid,
} from "@chakra-ui/react";
import { useForm, useWatch } from "react-hook-form";
import { FormInput } from "components/fields/FormFields";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateItemMutation, useFetchItemsQuery } from "api/apiSlice";
import { toast } from "react-toastify";
import {
  ALLOWED_FILE_TYPES,
  commissionStatuses,
  currencies,
  dealSchema,
  roundTo2,
} from "./../../../deals/dealUtils";
import { FormSelect } from "components/fields/FormFields";
import { FiUploadCloud } from "react-icons/fi";
import useUserSession from "hooks/useUserSession";
import SearchUsers from "views/admin/whatsapp/WhatsappSettings/SearchUsers";

const CloseDealModal = React.memo(
  ({
    isOpen,
    onClose,
    lead,
    initialData,
    onSuccess,
    mode = "add", // 'add' or 'edit'
  }) => {
    const { _id: leadId, leadName, leadPhoneNumber, leadWhatsappNumber } = lead;

    const { user, userRoleName, isSuperAdmin, isAdmin } = useUserSession();

    const phoneNumber =
      typeof leadPhoneNumber === "object"
        ? leadPhoneNumber?.result
        : leadPhoneNumber;
    const whatsappNumber =
      typeof leadWhatsappNumber === "object"
        ? leadWhatsappNumber?.result
        : leadWhatsappNumber;

    const defaultValues = useMemo(
      () => ({
        clientName: leadName || "",
        clientNumber: phoneNumber || "",
        clientWhatsapp: whatsappNumber || "",
        agentName: lead?.agentDetails?.fullName || "Unassigned",
        managerName: lead?.managerDetails?.fullName || "Unassigned",
        closedBy: user?.fullName || "",

        developer: "",
        salesPerson: "",
        projectName: "",
        unitNumber: "",
        unitType: "",
        unitPrice: "",
        downpaymentPaid: "",
        downpaymentPercent: "",
        bookingAmountPaid: "",
        bookingPercent: "",
        spaDone: false,
        invoiceSent: false,
        file: null, // invoice document file
        commissionStatus: "",
        currency: "AED",
        shareUser: null,
        sharePercent: 0,
      }),
      [lead]
    );

    const {
      register,
      handleSubmit,
      formState: { errors, isValid, isDirty },
      reset,
      watch,
      setValue,
      control,
      trigger,
    } = useForm({
      resolver: yupResolver(dealSchema),
      defaultValues,
      mode: "onChange",
    });

    // Calculate derived values
    const unitPrice = watch("unitPrice");
    const downpaymentPaid = useWatch({ control, name: "downpaymentPaid" });
    const bookingAmountPaid = useWatch({ control, name: "bookingAmountPaid" });
    const shareUser = useWatch({ control, name: "shareUser" });

    const downpaymentPercent = unitPrice
      ? roundTo2(((parseFloat(downpaymentPaid) || 0) / unitPrice) * 100)
      : 0;

    const bookingPercent = unitPrice
      ? roundTo2(((parseFloat(bookingAmountPaid) || 0) / unitPrice) * 100)
      : 0;

    const [createDeal, { isLoading: isCreating }] = useCreateItemMutation();

    // Fetch users data
    const { data: usersData } = useFetchItemsQuery(
      {
        path: "/v2/user/search_users",
      },
      { refetchOnMountOrArgChange: true }
    );

    // Handle modal close
    const handleClose = () => {
      reset();
      onClose();
    };

    const handleCreateDeal = async (data) => {
      try {
        await createDeal({ path: "/deals", body: data }).unwrap();

        toast.success("Deal was closed successfully");

        reset();
        onSuccess();
      } catch (error) {
        console.log(error);
        toast.error(error?.data?.message || "Deal is not created!");
      }
    };

    // Handle user selection
    const handleSelectUser = (selectedUser) => {
      if (selectedUser?._id) {
        setValue("shareUser", selectedUser._id);
        trigger("sharePercent");
      } else {
        setValue("shareUser", null);
        setValue("sharePercent", null);
      }
    };

    // Form submission
    const handleFormSubmit = (data) => {
      const formData = new FormData();

      formData.append("developer", data.developer);
      formData.append("salesPerson", data.salesPerson);
      formData.append("projectName", data.projectName);
      formData.append("unitNumber", data.unitNumber);
      formData.append("unitType", data.unitType);
      formData.append("unitPrice", data.unitPrice);
      formData.append("downpaymentPaid", data.downpaymentPaid);
      formData.append("bookingAmountPaid", data.bookingAmountPaid);
      formData.append("spaDone", data.spaDone);
      formData.append("invoiceSent", data.invoiceSent);
      formData.append("commissionStatus", data.commissionStatus);
      formData.append("downpaymentPercent", downpaymentPercent);
      formData.append("bookingPercent", bookingPercent);
      formData.append("manager", lead?.managerAssigned || "");
      formData.append("agent", lead?.agentAssigned || "");
      formData.append("lead", leadId);

      // Add shared user data if selected
      if (data.shareUser) {
        formData.append("shareUser", data.shareUser);
        formData.append("sharePercent", data.sharePercent);
      }

      // Optional file
      if (data.file && data.invoiceSent) {
        formData.append("file", data.file);
      } else if (!data?.file && data.invoiceSent) {
        return toast.error("Invoice document not uploaded!");
      }

      // Debug
      // console.log('Final FormData:', Object.fromEntries(formData));

      // Submission
      if (mode === "add") {
        handleCreateDeal(formData);
      }
    };

    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState("");

    const handleFileSelect = (event) => {
      const file = event.target.files[0];

      if (!file) return;

      const isValidType = ALLOWED_FILE_TYPES.includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;

      if (!isValidType) {
        toast.error("Only PDF, DOC, DOCX files are allowed.");
        return (event.target.value = null);
      }

      if (!isValidSize) {
        toast.error("Maximum allowed size is 5MB.");
        return (event.target.value = null);
      }

      setValue("file", file);
      setFileName(file.name);

      // finally clear the event
      event.target.value = null;
    };

    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="6xl" isCentered>
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent borderRadius="xl" boxShadow="xl" m="2">
          <ModalHeader
            bg="brand.50"
            borderTopRadius="xl"
            py={3}
            fontSize="md"
            fontWeight="bold"
            color="brand.700"
          >
            {mode === "add" ? "Close Deal" : "Edit Deal"}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody
            py={4}
            overflowY="auto"
            maxH={{ base: "50vh", md: "60vh" }}
          >
            <VStack spacing={6} align="stretch">
              {/* Lead Information */}
              <Box>
                <Text fontSize="md" fontWeight="bold" color="gray.600" mb={3}>
                  Lead Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                  <FormInput
                    label="Client Name"
                    name="clientName"
                    register={register}
                    errors={errors}
                    isRequired
                    isDisabled
                  />

                  {userRoleName !== "Manager" && (
                    <FormInput
                      label="Client Contact"
                      name="clientNumber"
                      register={register}
                      errors={errors}
                      isRequired
                      isDisabled
                    />
                  )}

                  <FormInput
                    label="Manager"
                    name="managerName"
                    register={register}
                    errors={errors}
                    isDisabled
                    isRequired
                  />
                  <FormInput
                    label="Agent"
                    name="agentName"
                    register={register}
                    errors={errors}
                    isDisabled
                    isRequired
                  />
                  <FormInput
                    label="Closed By"
                    name="closedBy"
                    register={register}
                    errors={errors}
                    isDisabled
                    isRequired
                  />
                </SimpleGrid>
              </Box>

              {/* Shared Deal Section */}
              <Box>
                <Text fontSize="md" fontWeight="bold" color="gray.600" mb={3}>
                  Shared Deal With
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                  <Box>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.600"
                    >
                      Share With User
                    </FormLabel>
                    <SearchUsers
                      selectedUserId={shareUser}
                      users={(usersData?.doc || []).filter((u) => {
                        const roleName = Array.isArray(u?.roles)
                          ? u.roles[0]?.roleName
                          : null;

                        return (
                          u._id !== user._id &&
                          u._id !== lead?.agentAssigned &&
                          u._id !== lead?.managerAssigned &&
                          roleName !== "superAdmin" &&
                          roleName !== "admin"
                        );
                      })}
                      onSelectUser={handleSelectUser}
                      isMobile={false}
                      size="sm"
                    />
                  </Box>
                  {shareUser && (
                    <FormInput
                      label="Share Percentage"
                      name="sharePercent"
                      register={register}
                      errors={errors}
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="100.00"
                      isRequired
                    />
                  )}
                </SimpleGrid>
              </Box>

              {/* Property Information */}
              <Box>
                <Text fontSize="md" fontWeight="bold" color="gray.600" mb={3}>
                  Property Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  <FormInput
                    label="Developer"
                    name="developer"
                    register={register}
                    errors={errors}
                    isRequired
                  />
                  <FormInput
                    label="Sales Person"
                    name="salesPerson"
                    register={register}
                    errors={errors}
                    isRequired
                  />
                  <FormInput
                    label="Project Name"
                    name="projectName"
                    register={register}
                    errors={errors}
                    isRequired
                  />
                  <FormInput
                    label="Unit Number"
                    name="unitNumber"
                    register={register}
                    errors={errors}
                    isRequired
                  />
                  <FormInput
                    label="Unit Type"
                    name="unitType"
                    register={register}
                    errors={errors}
                    isRequired
                  />
                  <FormInput
                    label="Unit Price"
                    name="unitPrice"
                    register={register}
                    errors={errors}
                    type="number"
                    step="0.01"
                    isRequired
                  />
                </SimpleGrid>
              </Box>

              {/* Payment Details */}
              <Box>
                <Text fontSize="md" fontWeight="bold" color="gray.600" mb={3}>
                  Payment Details
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                  <FormInput
                    label="Downpayment Paid"
                    name="downpaymentPaid"
                    register={register}
                    errors={errors}
                    type="number"
                    step="0.01"
                    isRequired
                  />
                  <VStack align="start" spacing={1} minW="180px">
                    <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                      Downpayment %
                    </Text>
                    <Text fontSize="sm" p={2} w="full" bg="gray.100">
                      {downpaymentPercent.toFixed(2)}%
                    </Text>
                  </VStack>
                  <FormInput
                    label="Booking Amount Paid"
                    name="bookingAmountPaid"
                    register={register}
                    errors={errors}
                    type="number"
                    step="0.01"
                    isRequired
                  />
                  <VStack align="start" spacing={1} minW="180px">
                    <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                      Booking %
                    </Text>
                    <Text p={2} w="full" bg="gray.100" fontSize="sm">
                      {bookingPercent.toFixed(2)}%
                    </Text>
                  </VStack>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                  <FormSelect
                    label="Currency"
                    name="currency"
                    register={register}
                    errors={errors}
                    isDisabled
                    isRequired
                    options={currencies}
                  />
                  <FormSelect
                    label="Commission Status"
                    name="commissionStatus"
                    register={register}
                    errors={errors}
                    isRequired
                    options={commissionStatuses}
                    placeholder="Select status"
                  />
                </SimpleGrid>

                {/* Extra Info & Upload */}
                <Box>
                  <HStack spacing={6} align="start" mb={4}>
                    <Checkbox
                      {...register("invoiceSent")}
                      colorScheme="brand"
                      size="md"
                    >
                      Invoice Sent
                    </Checkbox>
                    <Checkbox
                      {...register("spaDone")}
                      colorScheme="brand"
                      size="md"
                    >
                      SPA Document Signed
                    </Checkbox>
                  </HStack>

                  {useWatch({ control, name: "invoiceSent" }) && (
                    <FormControl mt={4}>
                      <FormLabel
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.600"
                      >
                        Upload Invoice
                      </FormLabel>
                      <Box
                        as="button"
                        onClick={() => fileInputRef.current?.click()}
                        border="2px dashed"
                        borderColor="gray.300"
                        p={5}
                        rounded="md"
                        textAlign="center"
                        bg="gray.50"
                        w="100%"
                        _hover={{ borderColor: "brand.500", bg: "gray.100" }}
                      >
                        <VStack spacing={1}>
                          <Icon
                            as={FiUploadCloud}
                            boxSize={6}
                            color="brand.500"
                          />
                          <Text fontSize="sm" color="gray.600">
                            Click to upload
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            Only PDF, DOC, DOCX — Max 5MB
                          </Text>
                          {fileName && (
                            <Text
                              fontSize="sm"
                              maxW="200px"
                              isTruncated
                              color="gray.700"
                              mt={1}
                            >
                              📄 {fileName}
                            </Text>
                          )}
                        </VStack>
                      </Box>
                      <Input
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                      />
                    </FormControl>
                  )}
                </Box>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter bg="gray.50" borderBottomRadius="xl" px={6} py={3}>
            <Button
              onClick={handleClose}
              variant="outline"
              colorScheme="gray"
              size="sm"
              mr={3}
            >
              Cancel
            </Button>
            <Button
              // type='submit'
              onClick={handleSubmit(handleFormSubmit)}
              colorScheme="brand"
              size="sm"
              isLoading={isCreating}
              isDisabled={!isValid || !isDirty}
            >
              {mode === "add" ? "Create Deal" : "Save Changes"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

CloseDealModal.displayName = "CloseDealModal";

export default CloseDealModal;
