
// import React, { useRef, useState } from "react";
// import {
//   Button,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   VStack,
// } from "@chakra-ui/react";
// import { buttonStyle } from "./constants";

// import "react-datepicker/dist/react-datepicker.css";
// import CustomDatePicker from "components/datetime/CustomDatePicker";

// import { useFormik } from "formik";
// import * as Yup from "yup";
// import moment from "moment";
// import { useModalColors } from "hooks/useModalColors";

// const DateFilter = ({
//   setQueryParams,
//   setRefetchLoading,
//   setCurrentPage,
//   onClose,
//   isOpen,
//   setSearchQueryParams,
//   setSearchTags,
//   setSearchClear,
// }) => {
//   const [openCalendar, setOpenCalendar] = useState(null); // Track which calendar is open

//   const toggleCalendar = (calendar) => {
//     setOpenCalendar(openCalendar === calendar ? null : calendar);
//   };

//   const { headerBg, headerText, primaryBtnBg, secondaryBtnBg } =
//     useModalColors();

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

//       const dateTime = from && to ? `${from}|${to}` : from || to || "";

//       // ✅ Fix: Pass plain object directly, not a function
//       setSearchQueryParams({
//         page: 1,
//         dateTime,
//       });

//       setRefetchLoading(true);
//       onClose();
//     },
//   });

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} isCentered>
//       <ModalOverlay backdropFilter="blur(2px)" />
//       <ModalContent mx="2" borderRadius="xl" boxShadow="xl">
//         <ModalHeader
//           display="flex"
//           gap="2"
//           bg={headerBg}
//           color={headerText}
//           borderTopRadius="xl"
//           py={4}
//           alignItems="center"
//           w="100%"
//         >
//           Date Range Filter
//         </ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           <VStack p={4} width="100%" gap="2" alignItems="flex-end">
//             {/* Start Date */}
//             <CustomDatePicker
//               selectedDate={formik.values.startDate}
//               handleDateChange={(date) =>
//                 formik.setFieldValue("startDate", date)
//               }
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

//         <ModalFooter>
//           <Button
//             {...buttonStyle}
//             py="2"
//             px="5"
//             mr="2"
//             color="gray.600"
//             bg={secondaryBtnBg}
//             rounded="md"
//             onClick={onClose}
//           >
//             Cancel
//           </Button>
//           <Button
//             {...buttonStyle}
//             variant="solid"
//             bg={primaryBtnBg}
//             py="2"
//             px="5"
//             aria-label="New lead"
//             onClick={formik.handleSubmit}
//             isDisabled={!formik.dirty || !formik.isValid}
//           >
//             Apply Filter
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default DateFilter;

import React, { useRef, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
} from "@chakra-ui/react";

import "react-datepicker/dist/react-datepicker.css";
import CustomDatePicker from "components/datetime/CustomDatePicker";

import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";

const DateFilter = ({
  setQueryParams,
  setRefetchLoading,
  setCurrentPage,
  onClose,
  isOpen,
  setSearchQueryParams,
  setSearchTags,
  setSearchClear,
}) => {
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

      const dateTime = from && to ? `${from}|${to}` : from || to || "";

      setSearchQueryParams({
        page: 1,
        dateTime,
      });

      setRefetchLoading(true);
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg='bg.overlay' backdropFilter="blur(2px)" />
      <ModalContent
        bg='bg.surface'
        borderRadius="xl"
        boxShadow="deep"
        mx="2"
        overflow="hidden"
      >
        <ModalHeader
          bg='accent.gold'
          color='text.inverse'
          borderTopRadius="xl"
          py={4}
          px={6}
          borderBottom='1px solid'
          borderColor='border.default'
        >
          Date Range Filter
        </ModalHeader>

        <ModalCloseButton
          color='text.inverse'
          _focus={{ outline: "none" }}
          _hover={{ bg: 'rgba(0,0,0,0.1)' }}
        />

        <ModalBody bg='bg.app'>
          <VStack p={4} width="100%" gap="2" alignItems="flex-end">
            <CustomDatePicker
              selectedDate={formik.values.startDate}
              handleDateChange={(date) =>
                formik.setFieldValue("startDate", date)
              }
              errors={formik.touched.startDate && formik.errors.startDate}
              label="Start Date"
              placeholder="Select start date"
              maxDate={formik.values.endDate || new Date()}
              isCalendarOpen={openCalendar === "start"}
              toggleCalendar={() => toggleCalendar("start")}
            />

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

        <ModalFooter
          borderTop='1px solid'
          borderColor='border.default'
          bg='bg.surface'
          gap={3}
        >
          <Button
            variant='outline'
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant='brand'
            onClick={formik.handleSubmit}
            isDisabled={!formik.dirty || !formik.isValid}
          >
            Apply Filter
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DateFilter;