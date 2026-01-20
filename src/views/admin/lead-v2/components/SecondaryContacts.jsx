// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Grid,
//   Flex,
//   Icon,
//   Divider,
//   useColorModeValue,
// } from "@chakra-ui/react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { toast } from "react-toastify";
// import { useUpdateItemMutation } from "api/apiSlice";
// import RenderFields from "components/shared/RenderFields";
// import { extractLocationData, toCapitalCase } from "utils/helpers";
// import { useSelector, useDispatch } from "react-redux";
// import { safeValue } from "utils";
// import useUserSession from "hooks/useUserSession";
// import { useUserActivityLog } from "hooks/useUserActivityLog";
// import { usePermissions } from "hooks/usePermissions";
// import { addOrUpdateLead } from "../../../../redux/leadsSlice";

// import {
//   FaUserEdit,
//   FaWhatsapp,
//   FaPhone,
//   FaEnvelope,
//   FaFlag,
//   FaMoneyBill,
// } from "react-icons/fa";
// import {
//   MdLocationOn,
//   MdCampaign,
//   MdLanguage,
//   MdNoteAlt,
//   MdAccessTime,
//   MdOutlineWeb,
//   MdLocationCity,
//   MdApartment,
//   MdHome,
//   MdPublic,
// } from "react-icons/md";

// export const SecondaryContactForm = ({ isOpen, onClose, leadData }) => {
//   const dispatch = useDispatch();
//   const { user } = useUserSession();
//   const { hasPermission } = usePermissions();
//   const { createUserLog } = useUserActivityLog();
//   const [updateItemMutation, { isLoading }] = useUpdateItemMutation();

//   const bgColor = useColorModeValue("white", "gray.800");
//   const headerColor = useColorModeValue("brand.300", "brand.100");
//   const textColor = useColorModeValue("brand.700", "brand.900");
//   const closeBtnColor = useColorModeValue("brand.700", "brand.900");

//   // Initial Values (ONLY TWO FIELDS)
//   const initialValues = {
//     secondaryPhone: safeValue(leadData?.secondaryPhone) || "",
//     secondaryWhatsapp: safeValue(leadData?.secondaryWhatsapp) || "",
//   };

//   // Validation Schema
//   const validationSchema = Yup.object({
//     secondaryPhone: Yup.string().required("Secondary phone is required"),
//     secondaryWhatsapp: Yup.string().required("Secondary WhatsApp is required"),
//   });

//   // Only Two Fields
//   const fields = [
//     {
//       name: "secondaryPhone",
//       label: "Secondary Phone",
//       type: "text",
//       icon: FaPhone,
//     },
//     {
//       name: "secondaryWhatsapp",
//       label: "Secondary WhatsApp",
//       type: "text",
//       icon: FaWhatsapp,
//     },
//   ];

//   // Apply Permissions (keep same logic as before)
//   const allowedFields = (() => {
//     if (hasPermission("leads", "update")) return fields;
//     if (hasPermission("leads", "edit_contacts")) {
//       return fields;
//     }
//     return [];
//   })();
//   console.log(leadData, "check lead adta");

//   // Submit Handler
//   const handleSubmit = async (values, actions) => {
//     try {
//       const res = await updateItemMutation({
//         path: `/lead/edit-lead/${leadData?._id}`,
//         body: values,
//       }).unwrap();

//       dispatch(addOrUpdateLead(res));

//       toast.success("Lead updated successfully.");

//       createUserLog({
//         userId: user?._id,
//         action: "UPDATE",
//         entity: "Lead",
//         entityType: "Lead",
//         entityId: leadData?._id,
//         status: "success",
//         message: `Secondary contacts updated successfully`,
//       });

//       actions.resetForm();
//       onClose();
//     } catch (error) {
//       console.error(error);

//       const errorMsg =
//         error?.data?.message || "Failed to update secondary contacts";

//       toast.error(errorMsg);

//       createUserLog({
//         userId: user?._id,
//         action: "UPDATE",
//         entity: "Lead",
//         entityType: "Lead",
//         entityId: leadData?._id,
//         status: "fail",
//         message: errorMsg,
//       });
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       size="xl"
//       isCentered
//       scrollBehavior="inside"
//     >
//       <ModalOverlay />
//       <ModalContent bg={bgColor} borderRadius="2xl">
//         <ModalHeader
//           fontSize="lg"
//           bg={headerColor}
//           color={textColor}
//           px={5}
//           py={3}
//           borderTopRadius="2xl"
//         >
//           <Flex align="center" gap={2}>
//             <Icon as={FaUserEdit} boxSize={5} />
//             Edit Secondary Contacts
//           </Flex>
//           <ModalCloseButton color={closeBtnColor} />
//         </ModalHeader>

//         <Divider />

//         <Formik
//           initialValues={initialValues}
//           // validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {() => (
//             <Form>
//               <ModalBody py={4} px={6}>
//                 <Grid templateColumns="1fr" gap={4}>
//                   <RenderFields fields={allowedFields} />
//                 </Grid>
//               </ModalBody>

//               <Divider />

//               <ModalFooter gap={3}>
//                 <Button
//                   variant="outline"
//                   colorScheme="gray"
//                   onClick={onClose}
//                   size="sm"
//                 >
//                   Cancel
//                 </Button>

//                 {allowedFields.length > 0 && (
//                   <Button
//                     colorScheme="brand"
//                     type="submit"
//                     size="sm"
//                     isLoading={isLoading}
//                   >
//                     {isLoading ? "Updating..." : "Update"}
//                   </Button>
//                 )}
//               </ModalFooter>
//             </Form>
//           )}
//         </Formik>
//       </ModalContent>
//     </Modal>
//   );
// };

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
  const [updateItemMutation, { isLoading }] = useUpdateItemMutation();

  const bgColor = useColorModeValue("white", "gray.800");
  const headerColor = useColorModeValue("brand.300", "brand.100");
  const textColor = useColorModeValue("brand.700", "brand.900");
  const closeBtnColor = useColorModeValue("brand.700", "brand.900");

  /**
   * TEMP LOGIC
   * Later you can change keys when API is ready
   */
  const hasSecondaryContact =
    !!leadData?.secondaryPhone || !!leadData?.secondaryWhatsapp;

  /**
   * Initial Values
   * - Prefilled if data exists (EDIT)
   * - Empty if no data (ADD)
   */
  const initialValues = {
    secondaryPhone: safeValue(leadData?.secondaryPhone) || "",
    secondaryWhatsapp: safeValue(leadData?.secondaryWhatsapp) || "",
  };

  /**
   * Validation Schema
   */
  const validationSchema = Yup.object({
    secondaryPhone: Yup.string().required("Secondary phone is required"),
    secondaryWhatsapp: Yup.string().required("Secondary WhatsApp is required"),
  });

  /**
   * Form Fields
   */
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

  /**
   * Permissions
   */
  const allowedFields = (() => {
    if (hasPermission("leads", "update")) return fields;
    if (hasPermission("leads", "edit_contacts")) return fields;
    return [];
  })();

  /**
   * Submit Handler
   */
  const handleSubmit = async (values, actions) => {
    try {
      const res = await updateItemMutation({
        path: `/lead/edit-lead/${leadData?._id}`, // SAME API FOR NOW
        body: values,
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
      <ModalOverlay />
      <ModalContent bg={bgColor} borderRadius="2xl">
        <ModalHeader
          fontSize="lg"
          bg={headerColor}
          color={textColor}
          px={5}
          py={3}
          borderTopRadius="2xl"
        >
          <Flex align="center" gap={2}>
            <Icon as={FaUserEdit} boxSize={5} />
            {hasSecondaryContact
              ? "Edit Secondary Contacts"
              : "Add Secondary Contacts"}
          </Flex>
          <ModalCloseButton color={closeBtnColor} />
        </ModalHeader>

        <Divider />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <ModalBody py={4} px={6}>
                <Grid templateColumns="1fr" gap={4}>
                  <RenderFields fields={allowedFields} />
                </Grid>
              </ModalBody>

              <Divider />

              <ModalFooter gap={3}>
                <Button
                  variant="outline"
                  colorScheme="gray"
                  onClick={onClose}
                  size="sm"
                >
                  Cancel
                </Button>

                {allowedFields.length > 0 && (
                  <Button
                    colorScheme="brand"
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
