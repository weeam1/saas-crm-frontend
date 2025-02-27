import { Routes, Route, useNavigate } from "react-router-dom";
import { Box, SimpleGrid, Text, Icon } from "@chakra-ui/react";
import {
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaUserCheck,
} from "react-icons/fa";
import Dashboard from "./components/dashboard/index";
import Employees from "./components/employees/index";
import MyAttendance from "./components/myAttendence/index";
import Records from "./components/records/index";

const NavigationBoxes = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: "Dashboard",
      icon: FaTachometerAlt,
      route: "/employees_dashboard",
    },
    { label: "Employees", icon: FaUsers, route: "/employees" },
    { label: "My Attendance", icon: FaUserCheck, route: "/my-attendance" },
    { label: "Records", icon: FaClipboardList, route: "/records" },
  ];

  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} p={6}>
      {menuItems.map((item) => (
        <Box
          key={item.label}
          p={6}
          bg="white"
          borderRadius="lg"
          textAlign="center"
          cursor="pointer"
          _hover={{ bg: "green.400", color: "white" }}
          onClick={() => navigate(item.route)}
        >
          <Icon as={item.icon} boxSize={8} mb={2} />
          <Text fontSize="md" fontWeight="bold">
            {item.label}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
};

const App = () => {
  return (
    <>
      <NavigationBoxes />
      <Routes>
        <Route path="/employee-dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/my-attendance" element={<MyAttendance />} />
        <Route path="/employees-records" element={<Records />} />
      </Routes>
    </>
  );
};

export default App;
