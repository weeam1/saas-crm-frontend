import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Box, Button, useBreakpointValue } from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import moment from "moment";
import { useSearchParams } from "react-router-dom";

const DateFilter = ({ onFilterChange }) => {
  const [searchParams] = useSearchParams();
  const currentDate = moment().startOf("month");

  const month = searchParams.get("month") || currentDate.format("MM");
  const year = searchParams.get("year") || currentDate.format("YYYY");

  const [date, setDate] = useState(moment(`${year}-${month}-01`).toDate());
  const [showCalendar, setShowCalendar] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});
  const buttonRef = useRef();
  const modalRef = useRef();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setShowCalendar(false);
    onFilterChange({
      month: moment(selectedDate).format("MM"),
      year: moment(selectedDate).format("YYYY"),
    });
  };

const calculatePopupPosition = () => {
  if (!buttonRef.current) return;
  const rect = buttonRef.current.getBoundingClientRect();
  const calendarWidth = 350;
  const calendarHeight = 350;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  let left = rect.left + window.scrollX;
  let top = rect.bottom + window.scrollY + 8;

  if (left + calendarWidth > screenWidth - 10) left = screenWidth - calendarWidth - 10;
  if (left < 10) left = 10;
  if (top + calendarHeight > screenHeight - 10)
    top = rect.top + window.scrollY - calendarHeight - 8;

  // 🧠 Fix here
  requestAnimationFrame(() => {
    setPopupStyle({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
    });
  });
};

  useEffect(() => {
    if (showCalendar && !isMobile) {
      calculatePopupPosition();
    }
  }, [showCalendar, isMobile]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box position="relative" w="fit-content">
      <Button
        ref={buttonRef}
        leftIcon={<CalendarIcon />}
        bg="gray.50"
        color="gray.800"
        borderRadius="md"
        size={{ base: "sm", md: "md", lg: "lg" }}
        fontSize={{ base: "sm", md: "md", lg: "lg" }}
        px={{ base: 3, md: 5 }}
        py={{ base: 2, md: 2 }}
        onClick={() => setShowCalendar(!showCalendar)}
        _hover={{ bg: "gray.100" }}
        shadow="sm"
        border="1px solid rgba(0,0,0,0.15)"
        transition="all 0.2s ease-in-out"
      >
        {moment(date).format("MMM YYYY")}
      </Button>

      {showCalendar && (
        <>
          {/* Mobile Overlay */}
          {isMobile && (
            <Box
              position="fixed"
              top="0"
              left="0"
              width="100vw"
              height="100vh"
              bg="rgba(0,0,0,0.4)"
              zIndex="998"
              onClick={() => setShowCalendar(false)}
            />
          )}

          {/* Calendar */}
          <Box
            ref={modalRef}
            zIndex="999"
            bg="white"
            borderRadius="xl"
            boxShadow="0 10px 25px rgba(0,0,0,0.25)"
            border="1px solid rgba(0,0,0,0.2)"
            p={{ base: 3, md: 4 }}
            w={{ base: "90vw", sm: "80vw", md: "350px" }}
            maxW="420px"
            transition="all 0.3s ease"
            {...(isMobile
              ? {
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }
              : popupStyle)}
          >
            <Calendar
              onChange={handleDateChange}
              value={date}
              view="year"
              onClickMonth={handleDateChange}
              maxDate={moment().endOf("month").toDate()}
              tileDisabled={({ date }) => date.getDate() !== 1}
              className="custom-calendar"
            />
          </Box>
        </>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .react-calendar {
          width: 100%;
          border: none !important;
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          .react-calendar {
            font-size: 0.8rem;
          }
        }
        .react-calendar__tile--active {
          background: #3182ce !important;
          color: white !important;
          border-radius: 8px;
        }
        .react-calendar__navigation button {
          color: #2d3748;
        }
      `}</style>
    </Box>
  );
};

export default DateFilter;

// const DateFilter = ({ onFilterChange }) => {
// 	const [searchParams] = useSearchParams();
// 	const currentDate = moment().startOf('month');

// 	const month = searchParams.get('month') || currentDate.format('MM');
// 	const year = searchParams.get('year') || currentDate.format('YYYY');

// 	const [date, setDate] = useState(moment(`${year}-${month}-01`).toDate());
// 	const [showCalendar, setShowCalendar] = useState(false);

// 	const handleDateChange = (selectedDate) => {
// 		setDate(selectedDate);
// 		setShowCalendar(false);
// 		onFilterChange({
// 			month: moment(selectedDate).format('MM'),
// 			year: moment(selectedDate).format('YYYY'),
// 		});
// 	};

// 	return (
// 		<Box position='relative'>
// 			<Button
// 				leftIcon={<CalendarIcon />}
// 				bg='softGray.50'
// 				color='gray.800'
// 				borderRadius='md'
// 				onClick={() => setShowCalendar(!showCalendar)}
// 			>
// 				{moment(date).format('MMM YYYY')}
// 			</Button>

// 			{showCalendar && (
// 				<Box
// 					position='absolute'
// 					right='50%'
// 					zIndex='100'
// 					bg='white'
// 					boxShadow='md'
// 				>
// 					<Calendar
// 						onChange={handleDateChange}
// 						value={date}
// 						view='year'
// 						// minDate={minSelectableDate}
// 						// maxDate={new Date()}
// 						maxDate={moment().endOf('month').toDate()}
// 						onClickMonth={handleDateChange}
// 						tileDisabled={({ date }) => date.getDate() !== 1}
// 					/>
// 				</Box>
// 			)}
// 		</Box>
// 	);
// };
