import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  FormControl,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import React, { useRef, useEffect, useState } from "react";
import { FaRegCalendar } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CustomDatePicker = ({
  selectedDate,
  handleDateChange,
  errors,
  errorKey,
  label,
  minDate,
  maxDate,
  placeholder,
  isCalendarOpen,
  toggleCalendar,
  inputStyles,
}) => {
  const errorMessage = errors?.[errorKey];
  const containerRef = useRef();
  const popupRef = useRef();
  const [popupStyle, setPopupStyle] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        if (isCalendarOpen) toggleCalendar(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCalendarOpen]);

  useEffect(() => {
    if (isCalendarOpen && popupRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const popupWidth = 320; // Approximate width of calendar
      const popupHeight = 300;

      const spaceRight = window.innerWidth - containerRect.right;
      const spaceLeft = containerRect.left;
      const spaceBelow = window.innerHeight - containerRect.bottom;
      const spaceAbove = containerRect.top;

      const openLeft = spaceRight < popupWidth && spaceLeft >= popupWidth;
      const openAbove = spaceBelow < popupHeight && spaceAbove >= popupHeight;

      const leftOffset = openLeft ? 'auto' : '0px';
      const rightOffset = openLeft ? '0px' : 'auto';
      const translateX = openLeft ? 'translateX(-100%)' : 'translateX(0)';
      const topOffset = openAbove ? 'auto' : '50px';
      const bottomOffset = openAbove ? '50px' : 'auto';

      setPopupStyle({
        position: 'absolute',
        zIndex: 9999,
        width: 'max-content',
        minWidth: containerRect.width,
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        top: topOffset,
        bottom: bottomOffset,
        left: leftOffset,
        right: rightOffset,
        transform: translateX,
      });
    }
  }, [isCalendarOpen, isMobile]);

  return (
    <FormControl mb={4} isInvalid={!!errorMessage} ref={containerRef}>
      <FormLabel>{label}</FormLabel>
      <Box position="relative" width="100%">
        <InputGroup>
          <Input
            value={selectedDate ? selectedDate.toLocaleDateString() : ""}
            placeholder={placeholder}
            readOnly
            required
            bg="#F2F2F2"
            borderColor={errorMessage ? "red.500" : "gray.300"}
            focusBorderColor={errorMessage ? "red.500" : "#E0B960"}
            {...inputStyles}
          />
          <InputRightElement>
            <FaRegCalendar
              size={16}
              cursor="pointer"
              onClick={toggleCalendar}
            />
          </InputRightElement>
        </InputGroup>

        {isCalendarOpen && (
          <Box ref={popupRef} style={popupStyle}>
            <Calendar
              onChange={(date) => {
                handleDateChange(date);
                toggleCalendar(null);
              }}
              value={selectedDate}
              minDate={minDate}
              maxDate={maxDate}
            />
          </Box>
        )}
      </Box>
      {errorMessage && (
        <Text color="red.500" fontSize="sm">
          {errorMessage}
        </Text>
      )}
    </FormControl>
  );
};

export default CustomDatePicker;
