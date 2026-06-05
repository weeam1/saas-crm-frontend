
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import {
//   Button,
//   Flex,
//   FormControl,
//   FormErrorMessage,
//   FormLabel,
//   Input,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
// } from "@chakra-ui/react";
// import { toast } from "react-toastify";
// import { useCreateItemMutation, useUpdateItemMutation } from "api/apiSlice";

// // Validation schema
// const validationSchema = Yup.object({
//   name: Yup.string().required("Position name is required"),
// });

// const PositionForm = ({
//   isOpen,
//   onClose,
//   initialData = {},
//   mode = "create",
//   setMode,
//   refetch,
// }) => {
//   const [createItemMutation, { isLoading: isCreating }] =
//     useCreateItemMutation();

//   const [updateItemMutation, { isLoading: isUpdating }] =
//     useUpdateItemMutation();

//   const onSubmit = async (values, resetForm) => {
//     try {
//       if (mode === "edit") {
//         await updateItemMutation({
//           path: `/positions/${initialData._id}`,
//           body: values,
//         }).unwrap();

//         toast.success("Position updated successfully.");
//       } else {
//         await createItemMutation({
//           path: "/positions",
//           body: values,
//         }).unwrap();

//         toast.success("Position created successfully.");
//       }

//       resetForm();
//       setMode("create");
//       refetch();
//       onClose();
//     } catch (error) {
//       console.log(error);
//       toast.error(error?.data?.message || "Something went wrong");
//     }
//   };

//   const formik = useFormik({
//     initialValues: {
//       name: initialData?.name || "",
//     },
//     validationSchema,
//     enableReinitialize: true,

//     // 🔴 Prevent validation during modal close
//     validateOnBlur: false,
//     validateOnChange: false,

//     onSubmit: (values, { resetForm }) => {
//       onSubmit(values, resetForm);
//     },
//   });

//   const handleClose = () => {
//     formik.resetForm();
//     setMode("create");
//     onClose();
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={handleClose} isCentered size="md">
//       <ModalOverlay />

//       <ModalContent>
//         <ModalHeader>
//           {mode === "create" ? "Create New Position" : "Edit Position"}
//         </ModalHeader>

//         <ModalCloseButton />

//         <form onSubmit={formik.handleSubmit}>
//           <ModalBody>
//             <FormControl
//               mb={4}
//               isInvalid={formik.submitCount > 0 && !!formik.errors.name}
//             >
//               <FormLabel htmlFor="name">Position Name</FormLabel>

//               <Input
//                 id="name"
//                 name="name"
//                 placeholder="Enter position name"
//                 variant="filled"
//                 value={formik.values.name}
//                 onChange={formik.handleChange}
//                 borderColor="brand.500"
//                 focusBorderColor="brand.600"
//                 autoFocus
//               />

//               <FormErrorMessage>
//                 {formik.submitCount > 0 && formik.errors.name}
//               </FormErrorMessage>
//             </FormControl>
//           </ModalBody>

//           <ModalFooter>
//             <Flex gap={2}>
//               <Button
//                 colorScheme="gray"
//                 variant="ghost"
//                 onClick={handleClose}
//                 type="button"
//               >
//                 Cancel
//               </Button>

//               <Button
//                 type="submit"
//                 colorScheme="brand"
//                 isLoading={isCreating || isUpdating}
//                 loadingText={mode === "create" ? "Creating..." : "Updating..."}
//               >
//                 {mode === "create" ? "Create Position" : "Update Position"}
//               </Button>
//             </Flex>
//           </ModalFooter>
//         </form>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default PositionForm;


import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useCreateItemMutation, useUpdateItemMutation } from "api/apiSlice";
import { useModalColors } from "hooks/useModalColors";

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string().required("Position name is required"),
});

const PositionForm = ({
  isOpen,
  onClose,
  initialData = {},
  mode = "create",
  setMode,
  refetch,
}) => {
  const colors = useModalColors();
  const [createItemMutation, { isLoading: isCreating }] =
    useCreateItemMutation();

  const [updateItemMutation, { isLoading: isUpdating }] =
    useUpdateItemMutation();

  const onSubmit = async (values, resetForm) => {
    try {
      if (mode === "edit") {
        await updateItemMutation({
          path: `/positions/${initialData._id}`,
          body: values,
        }).unwrap();

        toast.success("Position updated successfully.");
      } else {
        await createItemMutation({
          path: "/positions",
          body: values,
        }).unwrap();

        toast.success("Position created successfully.");
      }

      resetForm();
      setMode("create");
      refetch();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const formik = useFormik({
    initialValues: {
      name: initialData?.name || "",
    },
    validationSchema,
    enableReinitialize: true,

    validateOnBlur: false,
    validateOnChange: false,

    onSubmit: (values, { resetForm }) => {
      onSubmit(values, resetForm);
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setMode("create");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="md">
      <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(2px)" />

      <ModalContent
        bg={colors.bg}
        borderRadius="xl"
        boxShadow={colors.modalShadow}
        overflow="hidden"
      >
        <ModalHeader
          bg={colors.headerBg}
          color={colors.headerText}
          borderTopRadius="xl"
          py={4}
          px={6}
        >
          {mode === "create" ? "Create New Position" : "Edit Position"}
        </ModalHeader>

        <ModalCloseButton
          color={colors.closeBtnColor}
          _hover={{ bg: colors.closeBtnHoverBg }}
        />

        <form onSubmit={formik.handleSubmit}>
          <ModalBody py={6}>
            <FormControl
              mb={4}
              isInvalid={formik.submitCount > 0 && !!formik.errors.name}
            >
              <FormLabel color={colors.labelColor}>Position Name</FormLabel>

              <Input
                id="name"
                name="name"
                placeholder="Enter position name"
                variant="filled"
                value={formik.values.name}
                onChange={formik.handleChange}
                bg={colors.bgInput}
                borderColor={colors.borderColor}
                color={colors.headingText}
                _hover={{ borderColor: colors.accentGold }}
                _focus={{
                  borderColor: colors.accentGold,
                  boxShadow: `0 0 0 1px ${colors.accentGold}`,
                }}
                _placeholder={{ color: colors.mutedText }}
                autoFocus
              />

              <FormErrorMessage color={colors.badgeErrorText}>
                {formik.submitCount > 0 && formik.errors.name}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter
            bg={colors.footerBg}
            borderTop={`1px solid ${colors.borderColor}`}
            gap={3}
            py={4}
          >
            <Flex gap={2}>
              <Button
                variant="ghost"
                onClick={handleClose}
                type="button"
                color={colors.bodyText}
                _hover={{
                  bg: colors.secondaryBtnHoverBg,
                  color: colors.headingText,
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                bg={colors.accentGold}
                color={colors.headerText}
                isLoading={isCreating || isUpdating}
                loadingText={mode === "create" ? "Creating..." : "Updating..."}
                _hover={{
                  bg: colors.goldLight,
                  transform: "translateY(-1px)",
                  boxShadow: colors.goldGlow,
                }}
                _active={{ bg: colors.goldDark }}
                transition="all 0.2s ease"
              >
                {mode === "create" ? "Create Position" : "Update Position"}
              </Button>
            </Flex>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default PositionForm;