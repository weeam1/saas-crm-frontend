import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  FormControl,
  FormLabel,
  Text,
  useBreakpointValue,
  useTheme,
} from "@chakra-ui/react";
import { FaRegCalendar } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./style.css"

const CustomDatePicker = ({
  selectedDate,
  handleDateChange,
  errors,
  errorKey,
  label,
  minDate,
  maxDate,
  placeholder = "Select a date",
  isCalendarOpen,
  toggleCalendar,
  inputStyles,
  containerProps,
}) => {
  const errorMessage = errors?.[errorKey];
  const containerRef = useRef();
  const popupRef = useRef();
  const [popupStyle, setPopupStyle] = useState({});
  
  const isMobile = useBreakpointValue({ base: true, md: false });
  const theme = useTheme();
  
  const calendarWidth = useBreakpointValue({ 
    base: 280, 
    sm: 300, 
    md: 320 
  });
  
  const calendarHeight = useBreakpointValue({ 
    base: 280, 
    sm: 300, 
    md: 320 
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        !e.target.closest('.react-calendar')
      ) {
        if (isCalendarOpen) toggleCalendar(null);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCalendarOpen, toggleCalendar]);

  useEffect(() => {
    if (isCalendarOpen && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      const spaceRight = viewportWidth - containerRect.right;
      const spaceLeft = containerRect.left;
      const spaceBelow = viewportHeight - containerRect.bottom;
      const spaceAbove = containerRect.top;

      const shouldOpenLeft = spaceRight < calendarWidth && spaceLeft >= calendarWidth;
      const shouldOpenAbove = spaceBelow < calendarHeight && spaceAbove >= calendarHeight;
      
      if (isMobile) {
        setPopupStyle({
          position: 'fixed',
          zIndex: 9999,
          width: '90%',
          left: '5%',
          right: '5%',
          backgroundColor: 'white',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.15)',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          top: spaceBelow > calendarHeight ? `${containerRect.bottom + window.scrollY + 8}px` : 'auto',
          bottom: spaceBelow > calendarHeight ? 'auto' : `${viewportHeight - containerRect.top + window.scrollY + 8}px`,
          marginTop: '0',
          marginBottom: '0',
        });
      } else {
        setPopupStyle({
          position: 'fixed',
          zIndex: 9999,
          width: `${calendarWidth}px`,
          backgroundColor: 'white',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.15)',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          top: shouldOpenAbove ? 'auto' : `${containerRect.bottom + window.scrollY + 8}px`,
          bottom: shouldOpenAbove ? `${viewportHeight - containerRect.top + window.scrollY - 8}px` : 'auto',
          left: shouldOpenLeft ? 'auto' : `${containerRect.left + window.scrollX}px`,
          right: shouldOpenLeft ? `${viewportWidth - containerRect.right + window.scrollX}px` : 'auto',
        });
      }
    }
  }, [isCalendarOpen, isMobile, calendarWidth, calendarHeight]);

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDateSelect = (date) => {
    handleDateChange(date);
    setTimeout(() => {
      toggleCalendar(null);
    }, 100);
  };

  const handleCalendarClick = (e) => {
    e.stopPropagation();
  };

  return (
    <FormControl 
      mb={4} 
      isInvalid={!!errorMessage} 
      ref={containerRef}
      {...containerProps}
    >
      {label && <FormLabel>{label}</FormLabel>}
      <Box position="relative" width="100%">
        <InputGroup>
          <Input
            value={formatDate(selectedDate)}
            placeholder={placeholder}
            readOnly
            required
            bg="gray.50"
            borderColor={errorMessage ? "red.500" : "gray.200"}
            focusBorderColor={errorMessage ? "red.500" : "blue.500"}
            _hover={{ borderColor: errorMessage ? "red.500" : "gray.300" }}
            cursor="pointer"
            onClick={toggleCalendar}
            {...inputStyles}
          />
          <InputRightElement>
            <FaRegCalendar
              size={16}
              cursor="pointer"
              onClick={toggleCalendar}
              color={errorMessage ? theme.colors.red[500] : theme.colors.gray[500]}
            />
          </InputRightElement>
        </InputGroup>

        {isCalendarOpen && (
          <Box 
            ref={popupRef} 
            style={popupStyle}
            className="date-picker-calendar"
            onClick={handleCalendarClick}
          >
            <Calendar
              onChange={handleDateSelect}
              value={selectedDate}
              minDate={minDate}
              maxDate={maxDate}
              className="custom-calendar"
            />
          </Box>
        )}
      </Box>
      {errorMessage && (
        <Text color="red.500" fontSize="sm" mt={1}>
          {errorMessage}
        </Text>
      )}
    </FormControl>
  );
};

export default CustomDatePicker;
