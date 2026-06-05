// import React, { useState } from "react";
// import {
//   Button,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   VStack,
//   useColorModeValue,
//   Flex,
//   Text,
// } from "@chakra-ui/react";
// import "react-datepicker/dist/react-datepicker.css";
// import CustomDatePicker from "components/datetime/CustomDatePicker";

// import { useFormik } from "formik";
// import * as Yup from "yup";
// import moment from "moment";
// import { buttonStyle } from "utils/btn";

// const DateFilter = ({ dateFitlerHanlder, onClose, isOpen }) => {
//   const [openCalendar, setOpenCalendar] = useState(null); // Track which calendar is open

//   const headerBg = useColorModeValue("brand.300", "brand.100");
//   const headerText = useColorModeValue("brand.700", "brand.900");
//   const footerBg = useColorModeValue("gray.50", "gray.700");
//   const borderColor = useColorModeValue("gray.200", "gray.600");
//   const bgColor = useColorModeValue("white", "gray.800");

//   const toggleCalendar = (calendar) => {
//     setOpenCalendar(openCalendar === calendar ? null : calendar);
//   };

//   const toUTCString = (date) => {
//     return date
//       ? moment(date).utcOffset(0, true).startOf("day").toISOString()
//       : null;
//   };

//   const formik = useFormik({
//     initialValues: {
//       startDate: "",
//       endDate: "",
//     },
//     validationSchema: Yup.object({
//       startDate: Yup.date().required("Start date is required"),
//       endDate: Yup.date()
//         .required("End date is required")
//         .min(Yup.ref("startDate"), "End date must be after start date"),
//     }),
//     onSubmit: (values) => {
//       const from = toUTCString(values.startDate);
//       const to = toUTCString(values.endDate);
//       dateFitlerHanlder({ from, to });
//       onClose();
//     },
//   });

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
//       <ModalOverlay />
//       <ModalContent
//         m="2"
//         borderRadius="2xl"
//         bg={bgColor}
//         shadow="2xl"
//         overflow="hidden"
//         maxH="85vh"
//         display="flex"
//         flexDirection="column"
//       >
//         {/* Header */}
//         <Flex
//           align="center"
//           justify="space-between"
//           bg={headerBg}
//           color={headerText}
//           px={6}
//           py={3}
//           borderBottom="1px solid"
//           borderColor={borderColor}
//           position="sticky"
//           top="0"
//           zIndex="10"
//         >
//           <Text fontSize="lg" fontWeight="bold">
//             Date Range Filter
//           </Text>
//           <ModalCloseButton position="static" />
//         </Flex>

//         {/* Body */}
//         <ModalBody
//           p={5}
//           overflowY="auto"
//           maxH="65vh"
//           scrollBehavior="smooth"
//           sx={{
//             "&::-webkit-scrollbar": {
//               width: "6px",
//             },
//             "&::-webkit-scrollbar-thumb": {
//               background: "#c1c1c1",
//               borderRadius: "10px",
//             },
//           }}
//         >
//           <VStack spacing={5} width="100%" alignItems="flex-end">
//             {/* Start Date */}
//             <CustomDatePicker
//               selectedDate={formik.values.startDate}
//               handleDateChange={(date) => {
//                 formik.setFieldValue("startDate", date);
//                 if (formik.values.endDate && date > formik.values.endDate) {
//                   formik.setFieldValue("endDate", null);
//                 }
//               }}
//               errors={formik.touched.startDate && formik.errors.startDate}
//               label="Start Date"
//               placeholder="Select start date"
//               maxDate={formik.values.endDate || new Date()}
//               isCalendarOpen={openCalendar === "start"}
//               toggleCalendar={() => toggleCalendar("start")}
//             />

//             {/* End Date */}
//             <CustomDatePicker
//               selectedDate={formik.values.endDate}
//               handleDateChange={(date) => formik.setFieldValue("endDate", date)}
//               errors={formik.touched.endDate && formik.errors.endDate}
//               label="End Date"
//               placeholder="Select end date"
//               minDate={formik.values.startDate}
//               maxDate={new Date()}
//               isCalendarOpen={openCalendar === "end"}
//               toggleCalendar={() => toggleCalendar("end")}
//             />
//           </VStack>
//         </ModalBody>

//         {/* Footer */}
//         <ModalFooter
//           bg={footerBg}
//           borderTop="1px solid"
//           borderColor={borderColor}
//           position="sticky"
//           bottom="0"
//           zIndex="10"
//           py={3}
//           px={5}
//           justifyContent="flex-end"
//           gap={3}
//         >
//           <Button
//             py="2"
//             px="5"
//             variant="outline"
//             onClick={onClose}
//             borderRadius={"md"}
//             size="sm"
//           >
//             Cancel
//           </Button>
//           <Button
//             {...buttonStyle}
//             variant="solid"
//             bg="brand.400"
//             py="2"
//             px="5"
//             onClick={formik.handleSubmit}
//             isDisabled={!formik.dirty || !formik.isValid}
//             size="sm"
//           >
//             Apply Filter
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default DateFilter;


import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Flex,
  Text,
  Icon,
  Box,
} from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import CustomDatePicker from "components/datetime/CustomDatePicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { useModalColors } from "hooks/useModalColors";
import { FiCalendar, FiFilter, FiX, FiArrowRight } from "react-icons/fi";

const DateFilter = ({ dateFitlerHanlder, onClose, isOpen }) => {
  const mc = useModalColors();
  const [openCalendar, setOpenCalendar] = useState(null);

  const toggleCalendar = (calendar) => {
    setOpenCalendar(openCalendar === calendar ? null : calendar);
  };

  const toUTCString = (date) => {
    return date
      ? moment(date).utcOffset(0, true).startOf("day").toISOString()
      : null;
  };

  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
    },
    validationSchema: Yup.object({
      startDate: Yup.date().required("Start date is required"),
      endDate: Yup.date()
        .required("End date is required")
        .min(Yup.ref("startDate"), "End date must be after start date"),
    }),
    onSubmit: (values) => {
      const from = toUTCString(values.startDate);
      const to = toUTCString(values.endDate);
      dateFitlerHanlder({ from, to });
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay backdropFilter="blur(3px)" bg={mc.overlayBg} />
      <ModalContent
        m="2"
        borderRadius="2xl"
        bg={mc.bg}
        boxShadow={mc.modalShadow}
        border="1px solid"
        borderColor={mc.borderColor}
        overflow="hidden"
        maxH="85vh"
        display="flex"
        flexDirection="column"
      >
        {/* Header — Gold Gradient */}
        <Flex
          align="center"
          background={mc.headerBg}
          color={mc.headerText}
          px={6}
          py={4}
          boxShadow="0 2px 10px rgba(0,0,0,0.15)"
          position="sticky"
          top="0"
          zIndex="10"
        >
          <Icon as={FiCalendar} boxSize={5} mr={3} />
          <Text fontSize="lg" fontWeight="bold" color={mc.headerText}>
            Date Range Filter
          </Text>
          <ModalCloseButton
            position="absolute"
            right="14px"
            top="14px"
            bg={mc.closeBtnBg}
            color={mc.closeBtnColor}
            borderRadius="full"
            _hover={{ bg: mc.closeBtnHoverBg }}
            _focus={{ boxShadow: "none" }}
          />
        </Flex>

        {/* Body */}
        <ModalBody
          p={6}
          overflowY="auto"
          maxH="65vh"
          scrollBehavior="smooth"
          sx={{
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: mc.bgDeep,
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: mc.borderColor,
              borderRadius: "3px",
              _hover: { background: mc.borderFocus },
            },
          }}
        >
          <VStack spacing={5} width="100%" alignItems="flex-end">
            {/* Start Date */}
            <CustomDatePicker
              selectedDate={formik.values.startDate}
              handleDateChange={(date) => {
                formik.setFieldValue("startDate", date);
                if (formik.values.endDate && date > formik.values.endDate) {
                  formik.setFieldValue("endDate", null);
                }
              }}
              errors={formik.touched.startDate && formik.errors.startDate}
              label="Start Date"
              placeholder="Select start date"
              maxDate={formik.values.endDate || new Date()}
              isCalendarOpen={openCalendar === "start"}
              toggleCalendar={() => toggleCalendar("start")}
            />

            {/* End Date */}
            <CustomDatePicker
              selectedDate={formik.values.endDate}
              handleDateChange={(date) => formik.setFieldValue("endDate", date)}
              errors={formik.touched.endDate && formik.errors.endDate}
              label="End Date"
              placeholder="Select end date"
              minDate={formik.values.startDate}
              maxDate={new Date()}
              isCalendarOpen={openCalendar === "end"}
              toggleCalendar={() => toggleCalendar("end")}
            />
          </VStack>
        </ModalBody>

        {/* Footer — Navy with gold accent */}
        <ModalFooter
          bg={mc.footerBg}
          borderTop="2px solid"
          borderColor={mc.headerBg}
          position="sticky"
          bottom="0"
          zIndex="10"
          py={4}
          px={6}
          gap={3}
        >
          <Button
            variant="ghost"
            onClick={onClose}
            borderRadius="md"
            size="sm"
            color={mc.secondaryBtnText}
            _hover={{
              bg: mc.secondaryBtnHoverBg,
              color: mc.secondaryBtnHoverText,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={formik.handleSubmit}
            isDisabled={!formik.dirty || !formik.isValid}
            size="sm"
            borderRadius="md"
            background={mc.primaryBtnBg}
            color={mc.primaryBtnText}
            fontWeight="bold"
            px={6}
            _hover={{
              background: mc.primaryBtnHoverBg,
              boxShadow: mc.primaryBtnShadow,
              transform: "translateY(-1px)",
            }}
            _active={{
              background: mc.primaryBtnActiveBg,
              transform: "translateY(0)",
            }}
            _disabled={{
              opacity: 0.5,
              cursor: "not-allowed",
              transform: "none",
              boxShadow: "none",
            }}
          >
            Apply Filter
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DateFilter;