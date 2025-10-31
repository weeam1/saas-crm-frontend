import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Flex,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";

// Custom components
import AttendanceSelector from "./myAttendance/AttendanceSelectors";
import LeaveNoteModal from "./myAttendance/LeaveNoteModal";
import NoteModal from "./myAttendance/NoteModal";

import { useUpdateItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";
import { buttonStyle } from "../constants";
import useUserSession from "hooks/useUserSession";
import { useUserActivityLog } from "hooks/useUserActivityLog";

const AttendanceUpdate = ({ isOpen, onClose, data, refetch, updateKey }) => {
  const [checkInTime, setCheckInTime] = useState(data.checkin ?? "09:00 AM");
  const [checkOutTime, setCheckOutTime] = useState(data.checkout ?? "06:00 PM");
  const [attendanceStatus, setAttendanceStatus] = useState("present");

  const { user } = useUserSession();
  const { createUserLog } = useUserActivityLog();

  const { isOpen: noteIsOpen, onOpen: noteOnOpen, onClose: noteOnClose } = useDisclosure();
  const { isOpen: checkinNoteIsOpen, onOpen: checkinNoteOnOpen, onClose: checkinNoteOnClose } = useDisclosure();
  const { isOpen: absentNoteIsOpen, onOpen: absentNoteOnOpen, onClose: absentNoteOnClose } = useDisclosure();

  const today = new Date().toISOString().split("T")[0];
  const isToday = data?.date === today;
  const showCheckout = isToday ? data?.checkout : true;

  const [updateItemMutation, { isLoading: isUpdating }] = useUpdateItemMutation();

  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("brand.300", "brand.100");
  const headerText = useColorModeValue("brand.700", "brand.900");
  const footerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleSave = async (values) => {
    let updatedData = {};

    if (attendanceStatus === "leave") {
      updatedData = { status: 3, leaveNote: values.note, leaveType: values.leaveType };
    } else if (attendanceStatus === "absent") {
      updatedData = { status: 0, absentNote: values.note };
    } else {
      updatedData = {
        status: 1,
        checkinNote: values.note,
        checkin: checkInTime,
        ...(showCheckout && { checkout: checkOutTime }),
      };

      const checkIn = moment(checkInTime, "hh:mm A");
      const checkOut = moment(checkOutTime, "hh:mm A");

      if (checkOut.isBefore(checkIn)) {
        toast.error("Check-Out time must be greater than Check-In time!");
        return;
      }
    }

    try {
      if (data?._id) {
        const res = await updateItemMutation({ path: `/attendance/${data?._id}`, body: updatedData }).unwrap();

        toast.success("Attendance record updated successfully");

        if (updateKey === "record") {
          const updated = res?.doc;
          const updatedFields = {
            checkin: updated?.checkin,
            checkout: showCheckout ? updated?.checkout : null,
            status: updated?.status,
            updatedAt: updated?.updatedAt,
            totalWorkingHours: updated?.totalWorkingHours,
            leaveNote: updated?.leaveNote,
            leaveType: updated?.leaveType,
            checkinNote: updated?.checkinNote,
            absentNote: updated?.absentNote,
          };

          refetch(data?._id, updatedFields);
        } else refetch({ force: true });

        createUserLog({
          userId: user?._id,
          action: "UPDATE",
          entity: "Attendance",
          entityType: "Attendance",
          entityId: res?.doc?._id,
          status: "success",
          message: `${user?.fullName || ""} updated ${data?.employee?.fullName || ""} attendance record`,
        });
      }
    } catch (e) {
      console.log(e);
      const errorMsg = e?.data?.message || "Error in attendance update";
      toast.error(errorMsg);

      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Attendance",
        entityType: "Attendance",
        status: e?.status === 500 ? "error" : "fail",
        message: errorMsg,
      });
    }
    onClose();
  };

  const onSaveClick = () => {
    if (attendanceStatus === "leave") noteOnOpen();
    else if (attendanceStatus === "absent") absentNoteOnOpen();
    else checkinNoteOnOpen();
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
                Update Attendance
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
            <AttendanceSelector
              checkInTime={checkInTime}
              checkOutTime={checkOutTime}
              setCheckInTime={setCheckInTime}
              setCheckOutTime={setCheckOutTime}
              attendanceStatus={attendanceStatus}
              setAttendanceStatus={setAttendanceStatus}
              showCheckout={showCheckout}
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
            <Button variant="outline" colorScheme="gray" size="sm" borderRadius="md" onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="brand" size="sm" borderRadius="md" onClick={onSaveClick} isLoading={isUpdating}>
              {isUpdating ? "Updating..." : "Save"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Note Modals */}
      {noteIsOpen && (
        <LeaveNoteModal
          isOpen={noteIsOpen}
          onClose={noteOnClose}
          onSubmit={(values) => handleSave(values)}
          isLoading={isUpdating}
        />
      )}

      {checkinNoteIsOpen && (
        <NoteModal
          title="Check In Note"
          isOpen={checkinNoteIsOpen}
          onClose={checkinNoteOnClose}
          onSubmit={(values) => handleSave(values)}
          isLoading={isUpdating}
        />
      )}

      {absentNoteIsOpen && (
        <NoteModal
          title="Absent Note"
          isOpen={absentNoteIsOpen}
          onClose={absentNoteOnClose}
          onSubmit={(values) => handleSave(values)}
          isLoading={isUpdating}
        />
      )}
    </>
  );
};

export default AttendanceUpdate;
