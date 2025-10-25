import { useEffect, useRef, useState } from "react";
import { IconButton, HStack, Tooltip, Box, Divider } from "@chakra-ui/react";
import { FaRegChartBar, FaThLarge } from "react-icons/fa"; 

const icons = [
  { label: "Card View", icon: FaThLarge, value: "card" },
  { label: "analyticsView View", icon: FaRegChartBar, value: "analyticsView" },
];

const ViewToggle = ({ view, handleView, moduleView }) => {
  const containerRef = useRef(null);
  const [startX, setStartX] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(view === "card" ? 0 : 1);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    localStorage.setItem(moduleView, view);
    if (!isDragging) {
      setSliderPosition(view === "card" ? 0 : 1);
    }
  }, [view, isDragging, moduleView]);

  const handlePointerDown = (e) => {
    setStartX(e.clientX || e.touches[0].clientX);
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !startX) return;

    const currentX = e.clientX || e.touches[0].clientX;
    const diffX = currentX - startX;
    const containerWidth = containerRef.current.offsetWidth;

    const newPosition =
      view === "card"
        ? Math.min(diffX / containerWidth, 1)
        : 1 + Math.max(diffX / containerWidth, -1);

    setSliderPosition(Math.max(0, Math.min(1, newPosition)));
  };

  const handlePointerUp = () => {
    if (sliderPosition > 0.5 && view === "card") {
      handleView("analyticsView");
    } else if (sliderPosition < 0.5 && view === "analyticsView") {
      handleView("card");
    } else {
      setSliderPosition(view === "card" ? 0 : 1);
    }
    setIsDragging(false);
    setStartX(null);
  };

  const handleClick = (value) => handleView(value);

  const renderButton = ({ label, icon: Icon, value }) => {
    console.log("value", value);
    console.log("view", view)
    const isActive = view === value;

    return (
      <Tooltip key={value} label={label} hasArrow>
        <Box position="relative" zIndex="2">
          <IconButton
            aria-label={label}
            icon={<Icon size={12} />}
            size="xs"
            variant="ghost"
            rounded="md"
            colorScheme="blue"
            onClick={() => handleClick(value)}
            width="46px"
            height="27px"
            minW="40px"
            bg="transparent"
            color={isActive ? "white" : "gray.600"}
            _hover={{
              color: isActive ? "white" : "blue.700",
            }}
            transition="color 0.2s ease"
            position="relative"
          />
        </Box>
      </Tooltip>
    );
  };

  return (
    <Box
      position="relative"
      display="inline-block"
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      style={{
        userSelect: "none",
        cursor: "pointer",
      }}
    >
      <HStack
        ref={containerRef}
        spacing={1}
        bg="gray.100"
        rounded="md"
        borderWidth="1px"
        borderColor="gray.200"
        position="relative"
        divider={
          <Divider orientation="vertical" height="20px" borderColor="gray.300" />
        }
      >
        {icons.map(renderButton)}
      </HStack>

      <Box
        position="absolute"
        top="0.5px"
        left={`calc(${sliderPosition * 100}% - ${sliderPosition * 46}px)`}
        width="46px"
        height="28px"
        bg="blue.600"
        rounded="md"
        zIndex="1"
        transition={isDragging ? "none" : "left 0.2s ease"}
        pointerEvents="none"
      />
    </Box>
  );
};

export default ViewToggle;
