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

// const CustomDatePicker = ({
// 	selectedDate,
// 	handleDateChange,
// 	errors,
// 	errorKey,
// 	label,
// 	minDate,
// 	maxDate,
// 	placeholder,
// 	isCalendarOpen,
// 	toggleCalendar,
// }) => {
// 	const errorMessage = errors?.[errorKey];

// 	return (
// 		<FormControl mb={4} isInvalid={!!errorMessage}>
// 			<FormLabel>{label}</FormLabel>
// 			<Box position='relative' width='100%'>
// 				<InputGroup>
// 					<Input
// 						value={selectedDate ? selectedDate.toLocaleDateString() : ''}
// 						placeholder={placeholder}
// 						readOnly
// 						required
// 						bg='#F2F2F2'
// 						borderColor={errorMessage ? 'red.500' : 'gray.300'}
// 						borderRadius='md'
// 						focusBorderColor={errorMessage ? 'red.500' : '#E0B960'}
// 					/>
// 					<InputRightElement>
// 						<FaRegCalendar
// 							size={16}
// 							cursor='pointer'
// 							onClick={toggleCalendar}
// 						/>
// 					</InputRightElement>
// 				</InputGroup>
// 				{isCalendarOpen && (
// 					<Box
// 						position='absolute'
// 						top='50px'
// 						zIndex='10'
// 						bg='white'
// 						border='1px solid #e2e8f0'
// 						borderRadius='md'
// 						boxShadow='0px 4px 6px rgba(0, 0, 0, 0.1)'
// 					>
// 						<Calendar
// 							onChange={(date) => {
// 								handleDateChange(date);
// 								toggleCalendar();
// 							}}
// 							value={selectedDate}
// 							minDate={minDate}
// 							maxDate={maxDate}
// 							className='custom-calendar'
// 						/>
// 					</Box>
// 				)}
// 			</Box>
// 			{errorMessage && (
// 				<Text color='red.500' fontSize='sm'>
// 					{errorMessage}
// 				</Text>
// 			)}
// 		</FormControl>
// 	);
// };

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
  const calendarRef = useRef();
  const popupRef = useRef();
  const [popupStyle, setPopupStyle] = useState({});

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        if (isCalendarOpen) toggleCalendar(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCalendarOpen]);

  useEffect(() => {
    if (isCalendarOpen && popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      const overflowRight = rect.right > window.innerWidth;
      if (overflowRight) {
        const shift = rect.right - window.innerWidth + 8; // 8px padding
        setPopupStyle({
          right: 0,
          left: "auto",
          minWidth: rect.width,
          transform: `translateX(-${shift}px)`,
        });
      } else {
        setPopupStyle({});
      }
    }
  }, [isCalendarOpen]);

  return (
    <FormControl mb={4} isInvalid={!!errorMessage} ref={calendarRef}>
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
            // borderRadius="md"
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
          <Box
            ref={popupRef}
            position="absolute"
            top="50px"
            zIndex="10"
            bg="white"
            border="1px solid #e2e8f0"
            // borderRadius="md"
            boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
            style={popupStyle}
          >
            <Calendar
              onChange={(date) => {
                handleDateChange(date);
                toggleCalendar(null);
              }}
              value={selectedDate}
              minDate={minDate}
              maxDate={maxDate}
              className="custom-calendar"
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
