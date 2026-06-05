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
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useUpdateItemMutation } from "api/apiSlice";
import RenderFields from "components/shared/RenderFields";
import { useDispatch } from "react-redux";
import { safeValue } from "utils";
import useUserSession from "hooks/useUserSession";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import { usePermissions } from "hooks/usePermissions";
import { addOrUpdateLead } from "../../../../redux/leadsSlice";

import { FaUserEdit, FaWhatsapp, FaPhone } from "react-icons/fa";

export const SecondaryContactForm = ({ isOpen, onClose, leadData }) => {
  const dispatch = useDispatch();
  const { user } = useUserSession();
  const { hasPermission } = usePermissions();
  const { createUserLog } = useUserActivityLog();
  const [updateItem, { isLoading }] = useUpdateItemMutation();

  // Check if secondary contacts exist
  const hasSecondaryContact =
    !!leadData?.secondaryContacts?.phoneNumber ||
    !!leadData?.secondaryContacts?.whatsapp;

  // Form initial values
  const initialValues = {
    secondaryPhone: safeValue(leadData?.secondaryContacts?.phoneNumber) || "",
    secondaryWhatsapp: safeValue(leadData?.secondaryContacts?.whatsapp) || "",
  };

  // Validation schema
  const validationSchema = Yup.object({
    secondaryPhone: Yup.string().required("Secondary phone is required"),
    secondaryWhatsapp: Yup.string().required("Secondary WhatsApp is required"),
  });

  // Form fields
  const fields = [
    {
      name: "secondaryPhone",
      label: "Secondary Phone",
      type: "text",
      icon: FaPhone,
    },
    {
      name: "secondaryWhatsapp",
      label: "Secondary WhatsApp",
      type: "text",
      icon: FaWhatsapp,
    },
  ];

  // Apply permissions
  const allowedFields = (() => {
    if (hasPermission("leads", "update")) return fields;
    if (hasPermission("leads", "edit_contacts")) return fields;
    return [];
  })();

  // Submit handler
  const handleSubmit = async (values, actions) => {
    if (!values.secondaryPhone && !values.secondaryWhatsapp) {
      toast.warning("Please fill at least one secondary contact");
      return;
    }
    try {
      const payload = {
        secondaryContacts: {
          phoneNumber: values.secondaryPhone,
          whatsapp: values.secondaryWhatsapp,
        },
      };
      const res = await updateItem({
        path: `/lead/v2/edit/${leadData?._id}`,
        body: payload,
      }).unwrap();

      dispatch(addOrUpdateLead(res));

      toast.success(
        hasSecondaryContact
          ? "Secondary contacts updated successfully"
          : "Secondary contacts added successfully",
      );

      createUserLog({
        userId: user?._id,
        action: hasSecondaryContact ? "UPDATE" : "CREATE",
        entity: "Lead",
        entityType: "Lead",
        entityId: leadData?._id,
        status: "success",
        message: hasSecondaryContact
          ? "Secondary contacts updated successfully"
          : "Secondary contacts added successfully",
      });

      actions.resetForm();
      onClose();
    } catch (error) {
      const errorMsg =
        error?.data?.message ||
        (hasSecondaryContact
          ? "Failed to update secondary contacts"
          : "Failed to add secondary contacts");

      toast.error(errorMsg);

      createUserLog({
        userId: user?._id,
        action: hasSecondaryContact ? "UPDATE" : "CREATE",
        entity: "Lead",
        entityType: "Lead",
        entityId: leadData?._id,
        status: "fail",
        message: errorMsg,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay bg="bg.overlay" />
      <ModalContent
        bg="bg.surface"
        borderRadius="2xl"
        boxShadow="deep"
        overflow="hidden"
      >
        <ModalHeader
          bg="accent.gold"
          color="#000000"
          px={5}
          py={3}
          borderBottom="1px solid"
          borderColor="border.default"
        >
          <Flex align="center" gap={2}>
            <Icon as={FaUserEdit} boxSize={5} color="#000000" />
            {hasSecondaryContact
              ? "Edit Secondary Contacts"
              : "Add Secondary Contacts"}
          </Flex>
          <ModalCloseButton
            color="#000000"
            _hover={{ bg: "rgba(0,0,0,0.1)" }}
          />
        </ModalHeader>

        <Divider borderColor="border.subtle" />

        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <ModalBody py={4} px={6} bg="bg.app">
                <Grid templateColumns="1fr" gap={4}>
                  <RenderFields fields={allowedFields} />
                </Grid>
              </ModalBody>

              <Divider borderColor="border.subtle" />

              <ModalFooter
                gap={3}
                borderTop="1px solid"
                borderColor="border.default"
                bg="bg.surface"
              >
                <Button
                  variant="outline"
                  onClick={onClose}
                  size="sm"
                >
                  Cancel
                </Button>

                {allowedFields.length > 0 && (
                  <Button
                    variant="brand"
                    type="submit"
                    size="sm"
                    isLoading={isLoading}
                  >
                    {isLoading
                      ? hasSecondaryContact
                        ? "Updating..."
                        : "Saving..."
                      : hasSecondaryContact
                        ? "Update"
                        : "Add"}
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