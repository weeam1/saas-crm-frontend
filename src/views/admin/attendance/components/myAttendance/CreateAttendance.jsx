import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Box,
  Flex,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";

// Custom components
import CustomDatePicker from "components/datetime/CustomDatePicker";
import AttendanceSelector from "./AttendanceSelectors";
import LeaveNoteModal from "./LeaveNoteModal";
import NoteModal from "./NoteModal";
import { useCreateItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";
import { buttonStyle } from "utils/btn";
import useUserSession from "hooks/useUserSession";
import { useUserActivityLog } from "hooks/useUserActivityLog";

const CreateAttendance = ({
  isOpen,
  onClose,
  employeeId,
  refetch,
  employeeName,
}) => {
  const [checkInTime, setCheckInTime] = useState("09:00 AM");
  const [checkOutTime, setCheckOutTime] = useState("06:00 PM");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openCalendar, setOpenCalendar] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState("present");
  const [initialPayload, setInitialPayload] = useState({
    employeeId: "",
    date: "",
  });

  const { user } = useUserSession();
  const { createUserLog } = useUserActivityLog();
  const [createItemMutation, { isLoading: isUpdating }] =
    useCreateItemMutation();

  const {
    isOpen: noteIsOpen,
    onOpen: noteOnOpen,
    onClose: noteOnClose,
  } = useDisclosure();
  const {
    isOpen: checkinNoteIsOpen,
    onOpen: checkinNoteOnOpen,
    onClose: checkinNoteOnClose,
  } = useDisclosure();
  const {
    isOpen: absentNoteIsOpen,
    onOpen: absentNoteOnOpen,
    onClose: absentNoteOnClose,
  } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("brand.300", "brand.100");
  const headerText = useColorModeValue("brand.700", "brand.900");
  const footerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const toggleCalendar = (target) =>
    setOpenCalendar((prev) => (prev === target ? null : target));

  const handleSave = async () => {
    const payload = {
      employeeId,
      date: moment(selectedDate).format("YYYY-MM-DD"),
    };
    setInitialPayload(payload);

    const actionHandlers = {
      absent: absentNoteOnOpen,
      leave: noteOnOpen,
      present: checkinNoteOnOpen,
    };

    if (actionHandlers[attendanceStatus]) {
      await actionHandlers[attendanceStatus]();
    }
  };

  const handlePresent = async ({ note }) => {
    const checkIn = moment(checkInTime, "hh:mm A");
    const checkOut = moment(checkOutTime, "hh:mm A");

    if (checkOut.isBefore(checkIn)) {
      toast.error("Check-Out time must be after Check-In!");
      return;
    }

    checkinNoteOnClose();
    await handleAttendanceAction("present", {
      ...initialPayload,
      checkinNote: note,
      checkin: checkInTime,
      checkout: checkOutTime,
    });
  };

  const handleAttendanceAction = async (type, payload) => {
    const endpointMap = {
      present: "/attendance",
      absent: "/attendance/absent",
      leave: "/attendance/leave",
    };

    try {
      await createItemMutation({
        path: endpointMap[type],
        body: payload,
      }).unwrap();
      toast.success("Attendance record added successfully");
      refetch({ force: true });
      onClose();

      createUserLog({
        userId: user?._id,
        action: "CREATE",
        entity: "Attendance",
        entityType: "Attendance",
        status: "success",
        message: `${user?.fullName} added ${employeeName || ""} attendance record.`,
      });
    } catch (error) {
      console.error(error);
      const errorMsg = error?.data?.message || `Error in employee ${type}`;
      toast.error(errorMsg);

      createUserLog({
        userId: user?._id,
        action: "CREATE",
        entity: "Attendance",
        entityType: "Attendance",
        status: error?.status === 500 ? "error" : "fail",
        message: errorMsg,
      });
    }
  };

  const handleLeave = async (values) => {
    noteOnClose();
    await handleAttendanceAction("leave", { ...values, ...initialPayload });
  };

  const handleAbsent = async ({ note = "" }) => {
    absentNoteOnClose();
    await handleAttendanceAction("absent", {
      ...initialPayload,
      absentNote: note,
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        isCentered
        scrollBehavior="inside"
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent
          bg={bgColor}
          borderRadius="2xl"
          shadow="2xl"
          maxW={{ base: "full", sm: "90vw", md: "500px" }}
          overflow="hidden"
          mx={{ base: 3, md: 0 }}
        >
          {/* Header */}
          <ModalHeader p={0} borderBottom="1px solid" borderColor={borderColor}>
            <Flex
              bg={headerBg}
              color={headerText}
              px={6}
              py={3}
              position="sticky"
              top="0"
              zIndex="10"
              boxShadow="md"
            >
              <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
                Add Attendance
              </Text>
              <ModalCloseButton
                position="absolute"
                right="12px"
                top="10px"
                color={headerText}
                _hover={{ bg: "whiteAlpha.200" }}
              />
            </Flex>
          </ModalHeader>

          {/* Body */}
          <ModalBody p={5} borderBottom="1px solid" borderColor={borderColor}>
            <Box mb={4}>
              <CustomDatePicker
                selectedDate={selectedDate}
                handleDateChange={setSelectedDate}
                label="Date"
                placeholder="Select date"
                maxDate={new Date()}
                isCalendarOpen={openCalendar === "start"}
                toggleCalendar={() => toggleCalendar("start")}
              />
            </Box>
            {/* <HStack
							flexDir={{ base: 'column', md: 'row' }}
							justifyContent='center'
							alignItems='center'
							gap={3}
							width='100%'
						>
							<Box bg='softGray.50' p='3' rounded='md' minW='200px'>
								<Text mb={2} fontWeight='500'>
									Check In
								</Text>
								<NormalTimePicker
									value={checkInTime}
									onChange={setCheckInTime}
								/>
							</Box>

							<Box bg='softGray.50' p='3' rounded='md' minW='200px'>
								<Text mb={2} fontWeight='500'>
									Check Out
								</Text>
								<NormalTimePicker
									value={checkOutTime}
									onChange={setCheckOutTime}
								/>
							</Box>
						</HStack> */}

            <AttendanceSelector
              checkInTime={checkInTime}
              checkOutTime={checkOutTime}
              setCheckInTime={setCheckInTime}
              setCheckOutTime={setCheckOutTime}
              attendanceStatus={attendanceStatus}
              setAttendanceStatus={setAttendanceStatus}
            />
          </ModalBody>

          {/* Footer */}
          <ModalFooter
            position="sticky"
            bottom="0"
            bg={footerBg}
            borderTop="1px solid"
            borderColor={borderColor}
            py={3}
            px={5}
            zIndex="10"
            justifyContent="flex-end"
            gap={3}
          >
            <Button
              variant="outline"
              colorScheme="gray"
              size="sm"
              borderRadius="md"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              colorScheme="brand"
              size="sm"
              borderRadius="md"
              onClick={handleSave}
              isLoading={isUpdating}
            >
              {isUpdating ? "Loading..." : "Add"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Note Modals */}
      {noteIsOpen && (
        <LeaveNoteModal
          isOpen={noteIsOpen}
          onClose={noteOnClose}
          onSubmit={handleLeave}
          isLoading={isUpdating}
        />
      )}
      {checkinNoteIsOpen && (
        <NoteModal
          title="Check In Note"
          isOpen={checkinNoteIsOpen}
          onClose={checkinNoteOnClose}
          onSubmit={handlePresent}
          isLoading={isUpdating}
        />
      )}
      {absentNoteIsOpen && (
        <NoteModal
          title="Absent Note"
          isOpen={absentNoteIsOpen}
          onClose={absentNoteOnClose}
          onSubmit={handleAbsent}
          isLoading={isUpdating}
        />
      )}
    </>
  );
};

export default CreateAttendance;
