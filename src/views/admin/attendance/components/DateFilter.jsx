// import { useEffect, useRef, useState } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import { Box, Button, IconButton, useBreakpointValue, Text, HStack } from "@chakra-ui/react";
// import { CalendarIcon } from "@chakra-ui/icons";
// import moment from "moment";
// import { useSearchParams } from "react-router-dom";
// import { RiCalendar2Line } from "react-icons/ri";
// import CustomTooltip from "components/shared/CustomTooltip";
// import { useModalColors } from "hooks/useModalColors";

// const DateFilter = ({ onFilterChange, initialMonth, initialYear }) => {
//   const colors = useModalColors();
//   const [searchParams] = useSearchParams();

//   // Use props first, then searchParams, then current date
//   const monthFromProp = initialMonth ? String(initialMonth).padStart(2, '0') : null;
//   const yearFromProp = initialYear ? String(initialYear) : null;

//   const currentDate = moment().startOf("month");

//   const finalMonth = monthFromProp || searchParams.get("month") || currentDate.format("MM");
//   const finalYear = yearFromProp || searchParams.get("year") || currentDate.format("YYYY");

//   const [date, setDate] = useState(moment(`${finalYear}-${finalMonth}-01`).toDate());
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [popupStyle, setPopupStyle] = useState({});
//   const buttonRef = useRef();
//   const modalRef = useRef();

//   const isMobile = useBreakpointValue({ base: true, md: false });

//   // Format the display text
//   const displayText = moment(date).format("MMMM YYYY");

//   const handleDateChange = (selectedDate) => {
//     setDate(selectedDate);
//     setShowCalendar(false);
//     onFilterChange({
//       month: moment(selectedDate).format("MM"),
//       year: moment(selectedDate).format("YYYY"),
//     });
//   };

//   const calculatePopupPosition = () => {
//     if (!buttonRef.current) return;
//     const rect = buttonRef.current.getBoundingClientRect();
//     const calendarWidth = 350;
//     const calendarHeight = 350;
//     const screenWidth = window.innerWidth;
//     const screenHeight = window.innerHeight;

//     let left = rect.left + window.scrollX;
//     let top = rect.bottom + window.scrollY + 8;

//     if (left + calendarWidth > screenWidth - 10)
//       left = screenWidth - calendarWidth - 10;
//     if (left < 10) left = 10;
//     if (top + calendarHeight > screenHeight - 10)
//       top = rect.top + window.scrollY - calendarHeight - 8;

//     requestAnimationFrame(() => {
//       setPopupStyle({
//         position: "fixed",
//         top: `${top}px`,
//         left: `${left}px`,
//       });
//     });
//   };

//   useEffect(() => {
//     if (showCalendar && !isMobile) {
//       calculatePopupPosition();
//     }
//   }, [showCalendar, isMobile]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         modalRef.current &&
//         !modalRef.current.contains(e.target) &&
//         !buttonRef.current.contains(e.target)
//       ) {
//         setShowCalendar(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <Box position="relative" w="fit-content">
//       <CustomTooltip label="Select Month" hasArrow>
//         <Button
//           ref={buttonRef}
//           onClick={() => setShowCalendar(!showCalendar)}
//           variant="ghost"
//           size="sm"
//           borderRadius="full"
//           transition="all 0.2s ease"
//           leftIcon={<RiCalendar2Line />}
//         >
//           {displayText}
//         </Button>
//       </CustomTooltip>

//       {showCalendar && (
//         <>
//           {isMobile && (
//             <Box
//               position="fixed"
//               top="0"
//               left="0"
//               width="100vw"
//               height="100vh"
//               bg={colors.overlayBg}
//               zIndex="998"
//               onClick={() => setShowCalendar(false)}
//             />
//           )}

//           <Box
//             ref={modalRef}
//             zIndex="999"
//             bg={colors.bg}
//             borderRadius="xl"
//             boxShadow={colors.modalShadow}
//             border={`1px solid ${colors.borderColor}`}
//             p={{ base: 3, md: 4 }}
//             w={{ base: "90vw", sm: "80vw", md: "350px" }}
//             maxW="420px"
//             transition="all 0.3s ease"
//             {...(isMobile
//               ? {
//                   position: "fixed",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                 }
//               : popupStyle)}
//           >
//             <Calendar
//               onChange={handleDateChange}
//               value={date}
//               view="year"
//               onClickMonth={handleDateChange}
//               maxDate={moment().endOf("month").toDate()}
//               tileDisabled={({ date }) => date.getDate() !== 1}
//               className="custom-calendar"
//             />
//           </Box>
//         </>
//       )}

//       <style jsx global>{`
//         .react-calendar {
//           width: 100%;
//           border: none !important;
//           font-size: 0.9rem;
//           background: ${colors.bg} !important;
//         }
//         @media (max-width: 768px) {
//           .react-calendar {
//             font-size: 0.8rem;
//           }
//         }
//         .react-calendar__navigation {
//           background: ${colors.bgDeep} !important;
//           border-radius: 8px 8px 0 0;
//         }
//         .react-calendar__navigation button {
//           color: ${colors.headingText} !important;
//         }
//         .react-calendar__navigation button:hover {
//           background: ${colors.bgInput} !important;
//         }
//         .react-calendar__month-view__weekdays {
//           background: ${colors.bgDeep} !important;
//         }
//         .react-calendar__month-view__weekdays abbr {
//           color: ${colors.bodyText} !important;
//           text-decoration: none;
//         }
//         .react-calendar__tile {
//           background: ${colors.bg} !important;
//           color: ${colors.bodyText} !important;
//           border-radius: 8px;
//         }
//         .react-calendar__tile:hover {
//           background: ${colors.bgInput} !important;
//           color: ${colors.accentGold} !important;
//         }
//         .react-calendar__tile--active {
//           background: ${colors.accentGold} !important;
//           color: ${colors.headerText} !important;
//           border-radius: 8px;
//         }
//         .react-calendar__tile--now {
//           background: ${colors.bgInput} !important;
//           color: ${colors.accentGold} !important;
//         }
//         .react-calendar__tile--active:hover {
//           background: ${colors.goldLight} !important;
//         }
//         .react-calendar__navigation__arrow {
//           color: ${colors.accentGold} !important;
//         }
//         .react-calendar__navigation__arrow:hover {
//           background: ${colors.bgInput} !important;
//         }
//       `}</style>
//     </Box>
//   );
// };

// export default DateFilter;
import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Box,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { RiCalendar2Line } from "react-icons/ri";
import CustomTooltip from "components/shared/CustomTooltip";
import { useModalColors } from "hooks/useModalColors";

const DateFilter = ({ onFilterChange, initialMonth, initialYear }) => {
  const colors = useModalColors();
  const [searchParams] = useSearchParams();

  // Use props first, then searchParams, then current date
  const monthFromProp = initialMonth
    ? String(initialMonth).padStart(2, "0")
    : null;

  const yearFromProp = initialYear
    ? String(initialYear)
    : null;

  const currentDate = moment().startOf("month");

  const finalMonth =
    monthFromProp ||
    searchParams.get("month") ||
    currentDate.format("MM");

  const finalYear =
    yearFromProp ||
    searchParams.get("year") ||
    currentDate.format("YYYY");

  const [date, setDate] = useState(
    moment(`${finalYear}-${finalMonth}-01`).toDate()
  );

  const [showCalendar, setShowCalendar] = useState(false);

  const [popupStyle, setPopupStyle] = useState({
    position: "fixed",
    top: "-9999px",
    left: "-9999px",
  });

  const buttonRef = useRef(null);
  const modalRef = useRef(null);

  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const displayText = moment(date).format("MMMM YYYY");

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

    let left = rect.left;
    let top = rect.bottom + 8;

    // Prevent overflow right
    if (left + calendarWidth > screenWidth - 10) {
      left = screenWidth - calendarWidth - 10;
    }

    // Prevent overflow left
    if (left < 10) {
      left = 10;
    }

    // Open upward if no space below
    if (top + calendarHeight > screenHeight - 10) {
      top = rect.top - calendarHeight - 8;
    }

    setPopupStyle({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
    });
  };

  const handleToggleCalendar = () => {
    if (!showCalendar && !isMobile) {
      calculatePopupPosition();
    }

    setShowCalendar((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <Box position="relative" w="fit-content">
      <CustomTooltip label="Select Month" hasArrow>
        <Button
          ref={buttonRef}
          onClick={handleToggleCalendar}
          variant="ghost"
          size="sm"
          borderRadius="full"
          transition="all 0.2s ease"
          leftIcon={<RiCalendar2Line />}
        >
          {displayText}
        </Button>
      </CustomTooltip>

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
              bg={colors.overlayBg}
              zIndex="998"
              onClick={() => setShowCalendar(false)}
            />
          )}

          {/* Calendar Popup */}
          <Box
            ref={modalRef}
            zIndex="999"
            bg={colors.bg}
            borderRadius="xl"
            boxShadow={colors.modalShadow}
            border={`1px solid ${colors.borderColor}`}
            p={{ base: 3, md: 4 }}
            w={{ base: "90vw", sm: "80vw", md: "350px" }}
            maxW="420px"
            transition="opacity 0.15s ease"
            opacity={showCalendar ? 1 : 0}
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

 <style jsx global>{`
  .react-calendar {
    width: 100%;
    border: none !important;
    font-size: 0.9rem;
    background: ${colors.bg} !important;
  }

  @media (max-width: 768px) {
    .react-calendar {
      font-size: 0.8rem;
    }
  }

  .react-calendar__navigation {
    background: ${colors.bgDeep} !important;
    border-radius: 8px 8px 0 0;
  }

  /* FIXED ARROW BUTTON BACKGROUND ISSUE */
  .react-calendar__navigation button {
    background: transparent !important;
    color: ${colors.headingText} !important;
    border-radius: 8px;
  }

  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background: ${colors.bgInput} !important;
    color: ${colors.accentGold} !important;
  }

  .react-calendar__navigation button:disabled {
    background: transparent !important;
    opacity: 0.5;
  }

  .react-calendar__month-view__weekdays {
    background: ${colors.bgDeep} !important;
  }

  .react-calendar__month-view__weekdays abbr {
    color: ${colors.bodyText} !important;
    text-decoration: none;
  }

  .react-calendar__tile {
    background: ${colors.bg} !important;
    color: ${colors.bodyText} !important;
    border-radius: 8px;
  }

  .react-calendar__tile:hover {
    background: ${colors.bgInput} !important;
    color: ${colors.accentGold} !important;
  }

  .react-calendar__tile--active {
    background: ${colors.accentGold} !important;
    color: ${colors.headerText} !important;
    border-radius: 8px;
  }

  .react-calendar__tile--now {
    background: ${colors.bgInput} !important;
    color: ${colors.accentGold} !important;
  }

  .react-calendar__tile--active:hover {
    background: ${colors.goldLight} !important;
  }

  .react-calendar__navigation__arrow {
    color: ${colors.accentGold} !important;
  }
`}</style>
    </Box>
  );
};

export default DateFilter;