import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Select,
  VStack,
  Box,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import moment from "moment";
import CustomDatePicker from "components/datetime/CustomDatePicker";
import { useModalColors } from "hooks/useModalColors";


// const AdvancedSearchModal = ({
//   isOpen,
//   onClose,
//   onApplyFilters,
//   agencies = [],
//   initialFilters = {},
//   clearFilter,
// }) => {
//   const [openCalendar, setOpenCalendar] = useState(null);

//   const headerBg = useColorModeValue("brand.300", "brand.100");
//   const headerText = useColorModeValue("brand.700", "brand.900");
//   const footerBg = useColorModeValue("gray.50", "gray.700");
//   const borderColor = useColorModeValue("gray.200", "gray.600");
//   const bgColor = useColorModeValue("white", "gray.800");

//   const toggleCalendar = (calendar) => {
//     setOpenCalendar(openCalendar === calendar ? null : calendar);
//   };

//   const toUTCString = (date) =>
//     date ? moment(date).utcOffset(0, true).startOf("day").toISOString() : null;

//   const formik = useFormik({
//     initialValues: {
//       agency: initialFilters.agency || "",
//       from: initialFilters.from ? new Date(initialFilters.from) : null,
//       to: initialFilters.to ? new Date(initialFilters.to) : null,
//     },
//     enableReinitialize: true,
//     onSubmit: (values) => {
//       const cleaned = {
//         agency: values.agency,
//         from: values.from ? toUTCString(values.from) : undefined,
//         to: values.to ? toUTCString(values.to) : undefined,
//       };
//       onApplyFilters(
//         Object.fromEntries(
//           Object.entries(cleaned).filter(
//             ([, v]) => v !== "" && v !== undefined && v !== null
//           )
//         )
//       );
//       onClose();
//     },
//   });

//   useEffect(() => {
//     if (!clearFilter) {
//       formik.resetForm({
//         values: { agency: "", from: null, to: null },
//       });
//     }
//     // eslint-disable-next-line
//   }, [clearFilter]);

//   const handleClear = () => {
//     formik.resetForm({
//       values: { agency: "", from: null, to: null },
//     });
//     onApplyFilters({});
//     onClose();
//   };

//   const isFilterUnchanged = useMemo(() => {
//     const current = {
//       agency: formik.values.agency,
//       from: formik.values.from ? toUTCString(formik.values.from) : null,
//       to: formik.values.to ? toUTCString(formik.values.to) : null,
//     };

//     const initial = {
//       agency: initialFilters.agency || "",
//       from: initialFilters.from
//         ? toUTCString(new Date(initialFilters.from))
//         : null,
//       to: initialFilters.to ? toUTCString(new Date(initialFilters.to)) : null,
//     };

//     return (
//       current.agency === initial.agency &&
//       current.from === initial.from &&
//       current.to === initial.to
//     );
//   }, [formik.values, initialFilters]);

//   const isFilterEmpty = useMemo(() => {
//     return !formik.values.agency && !formik.values.from && !formik.values.to;
//   }, [formik.values]);

//   useEffect(() => {
//     if (isOpen) {
//       formik.resetForm({
//         values: {
//           agency: initialFilters.agency || "",
//           from: initialFilters.from ? new Date(initialFilters.from) : null,
//           to: initialFilters.to ? new Date(initialFilters.to) : null,
//         },
//       });
//     }
//     // eslint-disable-next-line
//   }, [isOpen, initialFilters]);

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} isCentered>
//       <ModalOverlay />
//       <ModalContent
//         maxW={{ base: "95vw", md: "600px" }}
//         mx="auto"
//         borderRadius="2xl"
//         shadow="2xl"
//         overflow="hidden"
//         bg={bgColor}
//       >
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
//           boxShadow="md"
//         >
//           <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
//             Advanced Search
//           </Text>
//           <ModalCloseButton position="static" />
//         </Flex>

//         <form onSubmit={formik.handleSubmit}>
//           <ModalBody
//             p={5}
//             overflowY="auto"
//             maxH="65vh"
//             borderBottom="1px solid"
//             borderColor={borderColor}
//           >
//             <VStack spacing={5}>
//               <FormControl>
//                 <FormLabel>Agency</FormLabel>
//                 <Select
//                   name="agency"
//                   placeholder="All"
//                   value={formik.values.agency}
//                   onChange={formik.handleChange}
//                   focusBorderColor="brand.500"
//                 >
//                   {agencies.map((agency) => (
//                     <option key={agency._id} value={agency._id}>
//                       {agency.name}
//                     </option>
//                   ))}
//                 </Select>
//               </FormControl>

//               <Box width="100%">
//                 <VStack width="100%" alignItems="flex-end" spacing={4}>
//                   <FormControl>
//                     <FormLabel>Start Date</FormLabel>
//                     <CustomDatePicker
//                       selectedDate={formik.values.from}
//                       handleDateChange={(date) => {
//                         formik.setFieldValue("from", date);
//                         if (formik.values.to && date > formik.values.to) {
//                           formik.setFieldValue("to", null);
//                         }
//                       }}
//                       placeholder="Select start date"
//                       maxDate={formik.values.to || new Date()}
//                       isCalendarOpen={openCalendar === "from"}
//                       toggleCalendar={() => toggleCalendar("from")}
//                     />
//                   </FormControl>

//                   <FormControl>
//                     <FormLabel>End Date</FormLabel>
//                     <CustomDatePicker
//                       selectedDate={formik.values.to}
//                       handleDateChange={(date) => {
//                         formik.setFieldValue("to", date);
//                         if (formik.values.from && date < formik.values.from) {
//                           formik.setFieldValue("from", null);
//                         }
//                       }}
//                       placeholder="Select end date"
//                       minDate={formik.values.from}
//                       maxDate={new Date()}
//                       isCalendarOpen={openCalendar === "to"}
//                       toggleCalendar={() => toggleCalendar("to")}
//                     />
//                   </FormControl>
//                 </VStack>
//               </Box>
//             </VStack>
//           </ModalBody>

//           <ModalFooter
//             position="sticky"
//             bottom="0"
//             bg={footerBg}
//             borderTop="1px solid"
//             borderColor={borderColor}
//             py={3}
//             px={5}
//             zIndex="10"
//             justifyContent="flex-end"
//             gap={3}
//           >
//             <Button
//               variant="outline"
//               onClick={handleClear}
//               isDisabled={isFilterEmpty}
//               borderRadius="md"
//             >
//               Clear Search
//             </Button>
//             <Button
//               colorScheme="brand"
//               type="submit"
//               isDisabled={isFilterUnchanged || isFilterEmpty}
//               borderRadius="md"
//             >
//               Apply Search
//             </Button>
//           </ModalFooter>
//         </form>
//       </ModalContent>
//     </Modal>
//   );
// };



const AdvancedSearchModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  agencies = [],
  initialFilters = {},
  clearFilter,
}) => {
  const mc = useModalColors();
  const [openCalendar, setOpenCalendar] = useState(null);

  const toggleCalendar = (calendar) => {
    setOpenCalendar(openCalendar === calendar ? null : calendar);
  };

  const toUTCString = (date) =>
    date ? moment(date).utcOffset(0, true).startOf("day").toISOString() : null;

  const formik = useFormik({
    initialValues: {
      agency: initialFilters.agency || "",
      from: initialFilters.from ? new Date(initialFilters.from) : null,
      to: initialFilters.to ? new Date(initialFilters.to) : null,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const cleaned = {
        agency: values.agency,
        from: values.from ? toUTCString(values.from) : undefined,
        to: values.to ? toUTCString(values.to) : undefined,
      };
      onApplyFilters(
        Object.fromEntries(
          Object.entries(cleaned).filter(
            ([, v]) => v !== "" && v !== undefined && v !== null
          )
        )
      );
      onClose();
    },
  });

  useEffect(() => {
    if (!clearFilter) {
      formik.resetForm({
        values: { agency: "", from: null, to: null },
      });
    }
    // eslint-disable-next-line
  }, [clearFilter]);

  const handleClear = () => {
    formik.resetForm({
      values: { agency: "", from: null, to: null },
    });
    onApplyFilters({});
    onClose();
  };

  const isFilterUnchanged = useMemo(() => {
    const current = {
      agency: formik.values.agency,
      from: formik.values.from ? toUTCString(formik.values.from) : null,
      to: formik.values.to ? toUTCString(formik.values.to) : null,
    };

    const initial = {
      agency: initialFilters.agency || "",
      from: initialFilters.from
        ? toUTCString(new Date(initialFilters.from))
        : null,
      to: initialFilters.to ? toUTCString(new Date(initialFilters.to)) : null,
    };

    return (
      current.agency === initial.agency &&
      current.from === initial.from &&
      current.to === initial.to
    );
  }, [formik.values, initialFilters]);

  const isFilterEmpty = useMemo(() => {
    return !formik.values.agency && !formik.values.from && !formik.values.to;
  }, [formik.values]);

  useEffect(() => {
    if (isOpen) {
      formik.resetForm({
        values: {
          agency: initialFilters.agency || "",
          from: initialFilters.from ? new Date(initialFilters.from) : null,
          to: initialFilters.to ? new Date(initialFilters.to) : null,
        },
      });
    }
    // eslint-disable-next-line
  }, [isOpen, initialFilters]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(3px)" bg={mc.overlayBg} />
      <ModalContent
        maxW={{ base: "95vw", md: "600px" }}
        mx="auto"
        borderRadius="2xl"
        boxShadow={mc.modalShadow}
        overflow="hidden"
        bg={mc.bg}
        border="1px solid"
        borderColor={mc.borderColor}
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
          <Text fontSize={{ base: "md", md: "lg" }} color={mc.headerText} fontWeight="bold">
            Advanced Search
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

        <form onSubmit={formik.handleSubmit}>
          <ModalBody
            p={6}
            overflowY="auto"
            maxH="65vh"
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
            <VStack spacing={5} align="stretch">
              {/* Agency Select */}
              <FormControl>
                <FormLabel fontWeight="semibold" color={mc.labelColor}>
                  Agency
                </FormLabel>
                <Select
                  name="agency"
                  placeholder="All"
                  value={formik.values.agency}
                  onChange={formik.handleChange}
                  bg={mc.bgInput}
                  borderColor={mc.borderColor}
                  color={formik.values.agency ? mc.headingText : mc.mutedText}
                  _hover={{ borderColor: mc.borderFocus }}
                  _focus={{
                    borderColor: mc.borderFocus,
                    boxShadow: `0 0 0 1px ${mc.borderFocus}`,
                  }}
                  borderRadius="md"
                  iconColor={mc.labelColor}
                >
                  {agencies.map((agency) => (
                    <option key={agency._id} value={agency._id}>
                      {agency.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Date Range */}
              <Box>
                <Text fontWeight="semibold" color={mc.labelColor} mb={3}>
                  Date Range
                </Text>
                <Box
                  bg={mc.bgDeep}
                  p={4}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={mc.borderColor}
                >
                  <VStack width="100%" alignItems="flex-end" spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" color={mc.labelColor}>
                        Start Date
                      </FormLabel>
                      <CustomDatePicker
                        selectedDate={formik.values.from}
                        handleDateChange={(date) => {
                          formik.setFieldValue("from", date);
                          if (formik.values.to && date > formik.values.to) {
                            formik.setFieldValue("to", null);
                          }
                        }}
                        placeholder="Select start date"
                        maxDate={formik.values.to || new Date()}
                        isCalendarOpen={openCalendar === "from"}
                        toggleCalendar={() => toggleCalendar("from")}
                      />
                    </FormControl>

                    {/* "TO" Divider */}
                    <Flex align="center" gap={2} w="full">
                      <Box flex={1} h="1px" bg={mc.divider} />
                      <Text fontSize="xs" color={mc.mutedText} fontWeight="medium">
                        TO
                      </Text>
                      <Box flex={1} h="1px" bg={mc.divider} />
                    </Flex>

                    <FormControl>
                      <FormLabel fontSize="sm" color={mc.labelColor}>
                        End Date
                      </FormLabel>
                      <CustomDatePicker
                        selectedDate={formik.values.to}
                        handleDateChange={(date) => {
                          formik.setFieldValue("to", date);
                          if (formik.values.from && date < formik.values.from) {
                            formik.setFieldValue("from", null);
                          }
                        }}
                        placeholder="Select end date"
                        minDate={formik.values.from}
                        maxDate={new Date()}
                        isCalendarOpen={openCalendar === "to"}
                        toggleCalendar={() => toggleCalendar("to")}
                      />
                    </FormControl>
                  </VStack>
                </Box>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter
            position="sticky"
            bottom="0"
            bg={mc.footerBg}
            borderTop="2px solid"
            borderColor={mc.headerBg}
            py={4}
            px={6}
            zIndex="10"
            gap={3}
          >
            <Button
              variant="ghost"
              onClick={handleClear}
              isDisabled={isFilterEmpty}
              borderRadius="md"
              color={mc.secondaryBtnText}
              _hover={{
                bg: mc.secondaryBtnHoverBg,
                color: mc.secondaryBtnHoverText,
              }}
            >
              Clear
            </Button>
            <Button
              type="submit"
              isDisabled={isFilterUnchanged || isFilterEmpty}
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
              Apply Search
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AdvancedSearchModal;
