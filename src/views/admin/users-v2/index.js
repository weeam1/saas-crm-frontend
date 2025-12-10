import {
  Box,
  Flex,
  Text,
  Avatar,
  Badge,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Switch,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  Input,
  Button,
  PopoverBody,
  Portal,
  InputGroup,
  InputLeftElement,
  Select,
  InputRightElement,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Eye,
  Edit,
  Plus,
  Pencil,
  Coins,
  Search,
  Filter,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import AddUserModal from "./components/AddUserModal/AddUserModal";

// Step 1: Define role styles
const roleBadgeStyles = {
  superAdmin: { colorScheme: "red" },
  Admin: { colorScheme: "blue" },
  Agent: { colorScheme: "teal" },
  Manager: { colorScheme: "orange" },
  "Finance Manager": { colorScheme: "purple" },
  Developer: { colorScheme: "cyan" },
  HR: { colorScheme: "pink" },
  User: { colorScheme: "gray" }, // fallback for generic users
};

// const initialUsers = [];

// const initialUsers = [
//   {
//     id: 1,
//     name: "John Carter",
//     email: "john.carter@example.com",
//     status: "online",
//     role: "Admin",
//     coins: 1200,
//     target: "AED 5,000",
//     accountStatus: "Active",
//   },
//   {
//     id: 2,
//     name: "Sophia Khan",
//     email: "sophia.khan@example.com",
//     status: "offline",
//     role: "Manager",
//     coins: 950,
//     target: "AED 3,800",
//     accountStatus: "Suspended",
//   },
//   {
//     id: 3,
//     name: "Daniel Lee",
//     email: "daniel.lee@example.com",
//     status: "online",
//     role: "Agent",
//     coins: 300,
//     target: "AED 1,500",
//     accountStatus: "Active",
//   },
//   {
//     id: 4,
//     name: "Emma Watson",
//     email: "emma.watson@example.com",
//     status: "online",
//     role: "Finance Manager",
//     coins: 500,
//     target: "AED 2,500",
//     accountStatus: "Active",
//   },
//   {
//     id: 5,
//     name: "Liam Smith",
//     email: "liam.smith@example.com",
//     status: "offline",
//     role: "Manager",
//     coins: 800,
//     target: "AED 4,000",
//     accountStatus: "Suspended",
//   },
//   {
//     id: 6,
//     name: "Olivia Brown",
//     email: "olivia.brown@example.com",
//     status: "online",
//     role: "Admin",
//     coins: 1300,
//     target: "AED 6,500",
//     accountStatus: "Active",
//   },
//   {
//     id: 7,
//     name: "Noah Davis",
//     email: "noah.davis@example.com",
//     status: "offline",
//     role: "Developer",
//     coins: 200,
//     target: "AED 1,200",
//     accountStatus: "Suspended",
//   },
//   {
//     id: 8,
//     name: "Ava Wilson",
//     email: "ava.wilson@example.com",
//     status: "online",
//     role: "HR",
//     coins: 450,
//     target: "AED 2,000",
//     accountStatus: "Active",
//   },
//   {
//     id: 9,
//     name: "Ethan Taylor",
//     email: "ethan.taylor@example.com",
//     status: "offline",
//     role: "superAdmin",
//     coins: 900,
//     target: "AED 4,500",
//     accountStatus: "Active",
//   },
//   {
//     id: 10,
//     name: "Isabella Martinez",
//     email: "isabella.martinez@example.com",
//     status: "online",
//     role: "Agent",
//     coins: 350,
//     target: "AED 1,800",
//     accountStatus: "Active",
//   },
// ];

const initialUsers = [
  {
    id: 1,
    name: "John Carter",
    email: "john.carter@example.com",
    status: "online",
    role: "Admin",
    coins: 1200,
    target: "AED 5,000",
    accountStatus: "Active",
  },
  {
    id: 2,
    name: "Sophia Khan",
    email: "sophia.khan@example.com",
    status: "offline",
    role: "Manager",
    coins: 950,
    target: "AED 3,800",
    accountStatus: "Suspended",
  },
  {
    id: 3,
    name: "Daniel Lee",
    email: "daniel.lee@example.com",
    status: "online",
    role: "Agent",
    coins: 300,
    target: "AED 1,500",
    accountStatus: "Active",
  },
  {
    id: 4,
    name: "Emma Watson",
    email: "emma.watson@example.com",
    status: "online",
    role: "Finance Manager",
    coins: 500,
    target: "AED 2,500",
    accountStatus: "Active",
  },
  {
    id: 5,
    name: "Liam Smith",
    email: "liam.smith@example.com",
    status: "offline",
    role: "Manager",
    coins: 800,
    target: "AED 4,000",
    accountStatus: "Suspended",
  },
  {
    id: 6,
    name: "Olivia Brown",
    email: "olivia.brown@example.com",
    status: "online",
    role: "Admin",
    coins: 1300,
    target: "AED 6,500",
    accountStatus: "Active",
  },
  {
    id: 7,
    name: "Noah Davis",
    email: "noah.davis@example.com",
    status: "offline",
    role: "Developer",
    coins: 200,
    target: "AED 1,200",
    accountStatus: "Suspended",
  },
  {
    id: 8,
    name: "Ava Wilson",
    email: "ava.wilson@example.com",
    status: "online",
    role: "HR",
    coins: 450,
    target: "AED 2,000",
    accountStatus: "Active",
  },
  {
    id: 9,
    name: "Ethan Taylor",
    email: "ethan.taylor@example.com",
    status: "offline",
    role: "superAdmin",
    coins: 900,
    target: "AED 4,500",
    accountStatus: "Active",
  },
  {
    id: 10,
    name: "Isabella Martinez",
    email: "isabella.martinez@example.com",
    status: "online",
    role: "Agent",
    coins: 350,
    target: "AED 1,800",
    accountStatus: "Active",
  },

  // Additional 90 records
  {
    id: 11,
    name: "Mason Clark",
    email: "mason.clark@example.com",
    status: "online",
    role: "Manager",
    coins: 700,
    target: "AED 3,200",
    accountStatus: "Active",
  },
  {
    id: 12,
    name: "Mia Lopez",
    email: "mia.lopez@example.com",
    status: "offline",
    role: "Agent",
    coins: 250,
    target: "AED 1,400",
    accountStatus: "Suspended",
  },
  {
    id: 13,
    name: "James Miller",
    email: "james.miller@example.com",
    status: "online",
    role: "Developer",
    coins: 600,
    target: "AED 3,000",
    accountStatus: "Active",
  },
  {
    id: 14,
    name: "Charlotte Hernandez",
    email: "charlotte.hernandez@example.com",
    status: "online",
    role: "HR",
    coins: 480,
    target: "AED 2,200",
    accountStatus: "Active",
  },
  {
    id: 15,
    name: "Benjamin Walker",
    email: "benjamin.walker@example.com",
    status: "offline",
    role: "Manager",
    coins: 850,
    target: "AED 4,200",
    accountStatus: "Suspended",
  },
  {
    id: 16,
    name: "Amelia Hall",
    email: "amelia.hall@example.com",
    status: "online",
    role: "Admin",
    coins: 1500,
    target: "AED 7,000",
    accountStatus: "Active",
  },
  {
    id: 17,
    name: "Jacob Young",
    email: "jacob.young@example.com",
    status: "offline",
    role: "Agent",
    coins: 220,
    target: "AED 1,300",
    accountStatus: "Active",
  },
  {
    id: 18,
    name: "Harper King",
    email: "harper.king@example.com",
    status: "online",
    role: "Finance Manager",
    coins: 520,
    target: "AED 2,600",
    accountStatus: "Active",
  },
  {
    id: 19,
    name: "Michael Scott",
    email: "michael.scott@example.com",
    status: "online",
    role: "superAdmin",
    coins: 1700,
    target: "AED 8,500",
    accountStatus: "Active",
  },
  {
    id: 20,
    name: "Evelyn Green",
    email: "evelyn.green@example.com",
    status: "offline",
    role: "HR",
    coins: 400,
    target: "AED 2,000",
    accountStatus: "Suspended",
  },

  {
    id: 21,
    name: "Elijah Adams",
    email: "elijah.adams@example.com",
    status: "online",
    role: "Agent",
    coins: 310,
    target: "AED 1,600",
    accountStatus: "Active",
  },
  {
    id: 22,
    name: "Abigail Nelson",
    email: "abigail.nelson@example.com",
    status: "offline",
    role: "Developer",
    coins: 500,
    target: "AED 2,500",
    accountStatus: "Active",
  },
  {
    id: 23,
    name: "Alexander Hill",
    email: "alexander.hill@example.com",
    status: "online",
    role: "Manager",
    coins: 920,
    target: "AED 4,600",
    accountStatus: "Active",
  },
  {
    id: 24,
    name: "Emily Ramirez",
    email: "emily.ramirez@example.com",
    status: "online",
    role: "Agent",
    coins: 330,
    target: "AED 1,700",
    accountStatus: "Suspended",
  },
  {
    id: 25,
    name: "Henry Campbell",
    email: "henry.campbell@example.com",
    status: "offline",
    role: "Admin",
    coins: 1400,
    target: "AED 6,800",
    accountStatus: "Active",
  },
  {
    id: 26,
    name: "Ella Parker",
    email: "ella.parker@example.com",
    status: "online",
    role: "Finance Manager",
    coins: 560,
    target: "AED 2,900",
    accountStatus: "Active",
  },
  {
    id: 27,
    name: "Sebastian Rivera",
    email: "sebastian.rivera@example.com",
    status: "online",
    role: "HR",
    coins: 420,
    target: "AED 2,100",
    accountStatus: "Active",
  },
  {
    id: 28,
    name: "Aria Collins",
    email: "aria.collins@example.com",
    status: "offline",
    role: "Agent",
    coins: 290,
    target: "AED 1,500",
    accountStatus: "Suspended",
  },
  {
    id: 29,
    name: "David Morris",
    email: "david.morris@example.com",
    status: "online",
    role: "Developer",
    coins: 620,
    target: "AED 3,100",
    accountStatus: "Active",
  },
  {
    id: 30,
    name: "Scarlett Reed",
    email: "scarlett.reed@example.com",
    status: "online",
    role: "Manager",
    coins: 880,
    target: "AED 4,300",
    accountStatus: "Active",
  },

  {
    id: 31,
    name: "Joseph Cook",
    email: "joseph.cook@example.com",
    status: "offline",
    role: "Finance Manager",
    coins: 550,
    target: "AED 2,700",
    accountStatus: "Suspended",
  },
  {
    id: 32,
    name: "Grace Rogers",
    email: "grace.rogers@example.com",
    status: "online",
    role: "HR",
    coins: 430,
    target: "AED 2,200",
    accountStatus: "Active",
  },
  {
    id: 33,
    name: "Samuel Peterson",
    email: "samuel.peterson@example.com",
    status: "online",
    role: "superAdmin",
    coins: 1600,
    target: "AED 7,800",
    accountStatus: "Active",
  },
  {
    id: 34,
    name: "Chloe Price",
    email: "chloe.price@example.com",
    status: "offline",
    role: "Agent",
    coins: 300,
    target: "AED 1,400",
    accountStatus: "Suspended",
  },
  {
    id: 35,
    name: "Matthew Bailey",
    email: "matthew.bailey@example.com",
    status: "online",
    role: "Manager",
    coins: 950,
    target: "AED 4,700",
    accountStatus: "Active",
  },
  {
    id: 36,
    name: "Victoria Cox",
    email: "victoria.cox@example.com",
    status: "online",
    role: "Admin",
    coins: 1350,
    target: "AED 6,900",
    accountStatus: "Active",
  },
  {
    id: 37,
    name: "Owen Flores",
    email: "owen.flores@example.com",
    status: "offline",
    role: "Developer",
    coins: 580,
    target: "AED 2,900",
    accountStatus: "Active",
  },
  {
    id: 38,
    name: "Lily Howard",
    email: "lily.howard@example.com",
    status: "online",
    role: "Agent",
    coins: 360,
    target: "AED 1,900",
    accountStatus: "Active",
  },
  {
    id: 39,
    name: "Wyatt Ward",
    email: "wyatt.ward@example.com",
    status: "online",
    role: "Manager",
    coins: 890,
    target: "AED 4,500",
    accountStatus: "Active",
  },
  {
    id: 40,
    name: "Zoey Torres",
    email: "zoey.torres@example.com",
    status: "offline",
    role: "HR",
    coins: 410,
    target: "AED 2,100",
    accountStatus: "Suspended",
  },

  {
    id: 41,
    name: "Gabriel Brooks",
    email: "gabriel.brooks@example.com",
    status: "online",
    role: "Agent",
    coins: 320,
    target: "AED 1,700",
    accountStatus: "Active",
  },
  {
    id: 42,
    name: "Hannah Gray",
    email: "hannah.gray@example.com",
    status: "offline",
    role: "Finance Manager",
    coins: 540,
    target: "AED 2,800",
    accountStatus: "Suspended",
  },
  {
    id: 43,
    name: "Jack Bryant",
    email: "jack.bryant@example.com",
    status: "online",
    role: "Developer",
    coins: 610,
    target: "AED 3,200",
    accountStatus: "Active",
  },
  {
    id: 44,
    name: "Layla Jenkins",
    email: "layla.jenkins@example.com",
    status: "online",
    role: "HR",
    coins: 440,
    target: "AED 2,300",
    accountStatus: "Active",
  },
  {
    id: 45,
    name: "Aiden Perry",
    email: "aiden.perry@example.com",
    status: "offline",
    role: "Agent",
    coins: 280,
    target: "AED 1,400",
    accountStatus: "Suspended",
  },
  {
    id: 46,
    name: "Nora Powell",
    email: "nora.powell@example.com",
    status: "online",
    role: "Admin",
    coins: 1400,
    target: "AED 7,200",
    accountStatus: "Active",
  },
  {
    id: 47,
    name: "Luke Long",
    email: "luke.long@example.com",
    status: "offline",
    role: "Manager",
    coins: 930,
    target: "AED 4,800",
    accountStatus: "Active",
  },
  {
    id: 48,
    name: "Zoe Patterson",
    email: "zoe.patterson@example.com",
    status: "online",
    role: "HR",
    coins: 460,
    target: "AED 2,400",
    accountStatus: "Active",
  },
  {
    id: 49,
    name: "Dylan Hughes",
    email: "dylan.hughes@example.com",
    status: "online",
    role: "Developer",
    coins: 590,
    target: "AED 3,000",
    accountStatus: "Active",
  },
  {
    id: 50,
    name: "Aurora Foster",
    email: "aurora.foster@example.com",
    status: "offline",
    role: "Agent",
    coins: 310,
    target: "AED 1,600",
    accountStatus: "Suspended",
  },

  {
    id: 51,
    name: "Levi Simmons",
    email: "levi.simmons@example.com",
    status: "online",
    role: "Manager",
    coins: 920,
    target: "AED 4,600",
    accountStatus: "Active",
  },
  {
    id: 52,
    name: "Penelope Sanders",
    email: "penelope.sanders@example.com",
    status: "offline",
    role: "HR",
    coins: 430,
    target: "AED 2,200",
    accountStatus: "Active",
  },
  {
    id: 53,
    name: "Logan Ross",
    email: "logan.ross@example.com",
    status: "online",
    role: "Finance Manager",
    coins: 560,
    target: "AED 2,900",
    accountStatus: "Active",
  },
  {
    id: 54,
    name: "Riley Edwards",
    email: "riley.edwards@example.com",
    status: "online",
    role: "Agent",
    coins: 340,
    target: "AED 1,800",
    accountStatus: "Active",
  },
  {
    id: 55,
    name: "Hudson Price",
    email: "hudson.price@example.com",
    status: "offline",
    role: "Developer",
    coins: 620,
    target: "AED 3,200",
    accountStatus: "Active",
  },
  {
    id: 56,
    name: "Camila Butler",
    email: "camila.butler@example.com",
    status: "online",
    role: "HR",
    coins: 450,
    target: "AED 2,300",
    accountStatus: "Active",
  },
  {
    id: 57,
    name: "Nathan Barnes",
    email: "nathan.barnes@example.com",
    status: "online",
    role: "Manager",
    coins: 910,
    target: "AED 4,500",
    accountStatus: "Active",
  },
  {
    id: 58,
    name: "Luna Fisher",
    email: "luna.fisher@example.com",
    status: "offline",
    role: "Agent",
    coins: 290,
    target: "AED 1,500",
    accountStatus: "Suspended",
  },
  {
    id: 59,
    name: "Eli Richards",
    email: "eli.richards@example.com",
    status: "online",
    role: "Developer",
    coins: 570,
    target: "AED 2,900",
    accountStatus: "Active",
  },
  {
    id: 60,
    name: "Paisley Henry",
    email: "paisley.henry@example.com",
    status: "offline",
    role: "HR",
    coins: 420,
    target: "AED 2,100",
    accountStatus: "Suspended",
  },

  {
    id: 61,
    name: "Wyatt Armstrong",
    email: "wyatt.armstrong@example.com",
    status: "online",
    role: "Admin",
    coins: 1350,
    target: "AED 6,700",
    accountStatus: "Active",
  },
  {
    id: 62,
    name: "Ellie Lane",
    email: "ellie.lane@example.com",
    status: "offline",
    role: "Agent",
    coins: 310,
    target: "AED 1,600",
    accountStatus: "Suspended",
  },
  {
    id: 63,
    name: "Isaac Hopkins",
    email: "isaac.hopkins@example.com",
    status: "online",
    role: "Manager",
    coins: 880,
    target: "AED 4,400",
    accountStatus: "Active",
  },
  {
    id: 64,
    name: "Nina Arnold",
    email: "nina.arnold@example.com",
    status: "online",
    role: "HR",
    coins: 460,
    target: "AED 2,300",
    accountStatus: "Active",
  },
  {
    id: 65,
    name: "Adam Wheeler",
    email: "adam.wheeler@example.com",
    status: "offline",
    role: "Developer",
    coins: 600,
    target: "AED 3,100",
    accountStatus: "Active",
  },
  {
    id: 66,
    name: "Clara Barrett",
    email: "clara.barrett@example.com",
    status: "online",
    role: "Finance Manager",
    coins: 540,
    target: "AED 2,700",
    accountStatus: "Active",
  },
  {
    id: 67,
    name: "Thomas Norris",
    email: "thomas.norris@example.com",
    status: "online",
    role: "Manager",
    coins: 930,
    target: "AED 4,700",
    accountStatus: "Active",
  },
  {
    id: 68,
    name: "Lydia Holland",
    email: "lydia.holland@example.com",
    status: "offline",
    role: "Agent",
    coins: 280,
    target: "AED 1,400",
    accountStatus: "Suspended",
  },
  {
    id: 69,
    name: "Charles Fields",
    email: "charles.fields@example.com",
    status: "online",
    role: "Developer",
    coins: 620,
    target: "AED 3,200",
    accountStatus: "Active",
  },
  {
    id: 70,
    name: "Ruby Bowen",
    email: "ruby.bowen@example.com",
    status: "offline",
    role: "HR",
    coins: 420,
    target: "AED 2,100",
    accountStatus: "Suspended",
  },

  {
    id: 71,
    name: "Roman Shaw",
    email: "roman.shaw@example.com",
    status: "online",
    role: "Admin",
    coins: 1450,
    target: "AED 7,200",
    accountStatus: "Active",
  },
  {
    id: 72,
    name: "Maya Francis",
    email: "maya.francis@example.com",
    status: "offline",
    role: "HR",
    coins: 410,
    target: "AED 2,000",
    accountStatus: "Suspended",
  },
  {
    id: 73,
    name: "Asher Stone",
    email: "asher.stone@example.com",
    status: "online",
    role: "Manager",
    coins: 920,
    target: "AED 4,600",
    accountStatus: "Active",
  },
  {
    id: 74,
    name: "Stella Brady",
    email: "stella.brady@example.com",
    status: "online",
    role: "Agent",
    coins: 350,
    target: "AED 1,800",
    accountStatus: "Active",
  },
  {
    id: 75,
    name: "Ian Walsh",
    email: "ian.walsh@example.com",
    status: "offline",
    role: "Developer",
    coins: 580,
    target: "AED 2,900",
    accountStatus: "Active",
  },
  {
    id: 76,
    name: "Elise Mann",
    email: "elise.mann@example.com",
    status: "online",
    role: "Finance Manager",
    coins: 560,
    target: "AED 2,900",
    accountStatus: "Active",
  },
  {
    id: 77,
    name: "Chase Ramsey",
    email: "chase.ramsey@example.com",
    status: "online",
    role: "Manager",
    coins: 870,
    target: "AED 4,300",
    accountStatus: "Active",
  },
  {
    id: 78,
    name: "Hazel Stevenson",
    email: "hazel.stevenson@example.com",
    status: "offline",
    role: "Agent",
    coins: 290,
    target: "AED 1,500",
    accountStatus: "Suspended",
  },
  {
    id: 79,
    name: "Jaxon Fleming",
    email: "jaxon.fleming@example.com",
    status: "online",
    role: "Developer",
    coins: 610,
    target: "AED 3,200",
    accountStatus: "Active",
  },
  {
    id: 80,
    name: "Alice Briggs",
    email: "alice.briggs@example.com",
    status: "offline",
    role: "HR",
    coins: 430,
    target: "AED 2,200",
    accountStatus: "Suspended",
  },

  {
    id: 81,
    name: "Kevin Blake",
    email: "kevin.blake@example.com",
    status: "online",
    role: "Manager",
    coins: 910,
    target: "AED 4,500",
    accountStatus: "Active",
  },
  {
    id: 82,
    name: "Melody Cross",
    email: "melody.cross@example.com",
    status: "offline",
    role: "Agent",
    coins: 320,
    target: "AED 1,600",
    accountStatus: "Suspended",
  },
  {
    id: 83,
    name: "Carter Hayes",
    email: "carter.hayes@example.com",
    status: "online",
    role: "Developer",
    coins: 600,
    target: "AED 3,000",
    accountStatus: "Active",
  },
  {
    id: 84,
    name: "Valentina Porter",
    email: "valentina.porter@example.com",
    status: "online",
    role: "HR",
    coins: 450,
    target: "AED 2,300",
    accountStatus: "Active",
  },
  {
    id: 85,
    name: "Parker Leonard",
    email: "parker.leonard@example.com",
    status: "offline",
    role: "Finance Manager",
    coins: 550,
    target: "AED 2,800",
    accountStatus: "Suspended",
  },
  {
    id: 86,
    name: "Daisy Lyons",
    email: "daisy.lyons@example.com",
    status: "online",
    role: "Agent",
    coins: 340,
    target: "AED 1,800",
    accountStatus: "Active",
  },
  {
    id: 87,
    name: "Brayden Bishop",
    email: "brayden.bishop@example.com",
    status: "online",
    role: "Manager",
    coins: 930,
    target: "AED 4,700",
    accountStatus: "Active",
  },
  {
    id: 88,
    name: "Jade Cummings",
    email: "jade.cummings@example.com",
    status: "offline",
    role: "HR",
    coins: 420,
    target: "AED 2,200",
    accountStatus: "Suspended",
  },
  {
    id: 89,
    name: "Maxwell Baldwin",
    email: "maxwell.baldwin@example.com",
    status: "online",
    role: "Admin",
    coins: 1500,
    target: "AED 7,500",
    accountStatus: "Active",
  },
  {
    id: 90,
    name: "Quinn Harmon",
    email: "quinn.harmon@example.com",
    status: "offline",
    role: "Agent",
    coins: 300,
    target: "AED 1,500",
    accountStatus: "Suspended",
  },

  {
    id: 91,
    name: "Simon McKenzie",
    email: "simon.mckenzie@example.com",
    status: "online",
    role: "Developer",
    coins: 580,
    target: "AED 2,900",
    accountStatus: "Active",
  },
  {
    id: 92,
    name: "Tessa Boone",
    email: "tessa.boone@example.com",
    status: "offline",
    role: "Finance Manager",
    coins: 560,
    target: "AED 2,800",
    accountStatus: "Suspended",
  },
  {
    id: 93,
    name: "Reid Dalton",
    email: "reid.dalton@example.com",
    status: "online",
    role: "Manager",
    coins: 900,
    target: "AED 4,500",
    accountStatus: "Active",
  },
  {
    id: 94,
    name: "Vera O'Connor",
    email: "vera.oconnor@example.com",
    status: "online",
    role: "HR",
    coins: 430,
    target: "AED 2,200",
    accountStatus: "Active",
  },
  {
    id: 95,
    name: "Grant Shepard",
    email: "grant.shepard@example.com",
    status: "offline",
    role: "Agent",
    coins: 280,
    target: "AED 1,400",
    accountStatus: "Suspended",
  },
  {
    id: 96,
    name: "Alina Mercer",
    email: "alina.mercer@example.com",
    status: "online",
    role: "Manager",
    coins: 920,
    target: "AED 4,600",
    accountStatus: "Active",
  },
  {
    id: 97,
    name: "Tristan Doyle",
    email: "tristan.doyle@example.com",
    status: "online",
    role: "Developer",
    coins: 620,
    target: "AED 3,200",
    accountStatus: "Active",
  },
  {
    id: 98,
    name: "Selena Barrett",
    email: "selena.barrett@example.com",
    status: "offline",
    role: "HR",
    coins: 410,
    target: "AED 2,000",
    accountStatus: "Suspended",
  },
  {
    id: 99,
    name: "Weston Clarke",
    email: "weston.clarke@example.com",
    status: "online",
    role: "Admin",
    coins: 1550,
    target: "AED 7,800",
    accountStatus: "Active",
  },
  {
    id: 100,
    name: "Ivy McCoy",
    email: "ivy.mccoy@example.com",
    status: "offline",
    role: "Agent",
    coins: 310,
    target: "AED 1,600",
    accountStatus: "Suspended",
  },
];

const MotionFilterIcon = React.memo(motion(Filter));

const UserTable = () => {
  const [users, setUsers] = useState(initialUsers);

  // const [page, setPage] = useState(1);
  // const limit = 5; // rows per page

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPage, setJumpPage] = useState("");

  // Inside UserTable component, after this line
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [coinsFilter, setCoinsFilter] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  // Filtered users derived from search + role + status filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter
      ? user.accountStatus === statusFilter
      : true;

    // Handle coin ranges
    let matchesCoins = true;

    if (coinsFilter) {
      const [min, max] = coinsFilter.split("-").map(Number);
      if (coinsFilter === "10000+") {
        matchesCoins = user.coins > 10000;
      } else {
        matchesCoins = user.coins >= min && user.coins <= max;
      }
    }

    return matchesSearch && matchesRole && matchesStatus && matchesCoins;
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const filtersApplied =
    roleFilter || statusFilter || searchQuery || coinsFilter;

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Filtered users based on selections

  const [mode, setMode] = useState("add");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- HANDLER ---
  const handleUpdateCoins = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setIsLoading(true);

    try {
      const value = Number(amount);

      const payload = {
        userId: "1",
        coins: mode === "add" ? value : -value, // Add = +value, Subtract = -value
      };

      // 🔥 Call your backend API here
      // await updateUserCoins(payload);

      // Optional: refresh list or update local state
      // refreshUsers();
    } catch (err) {
      console.error(err);
    }

    setAmount("");
    setIsLoading(false);
  };

  const handleToggle = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              accountStatus:
                u.accountStatus === "Active" ? "Suspended" : "Active",
            }
          : u
      )
    );
  };

  return (
    <Box p={{ base: 2, md: 6 }}>
      {/* Header + Action Row */}
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        mb={4}
        flexDir={{ base: "column", md: "row" }}
        gap={{ base: 3, md: 0 }}
      >
        <Text fontSize={{ base: "20px", md: "26px" }} fontWeight="800">
          Users
        </Text>

        <Button
          leftIcon={<Plus size={18} />}
          bg="gray.50"
          color="gray.800"
          border="1px solid #D0D5DD"
          size="md"
          borderRadius="12px"
          fontWeight="600"
          px={5}
          mt={{ base: 2, md: 0 }} // spacing on mobile
          _hover={{ bg: "gray.100" }}
          boxShadow="0px 1px 3px rgba(0,0,0,0.08)"
          onClick={() => setIsAddUserOpen(true)}
        >
          New User
        </Button>
      </Flex>

      {/* Search + Filters Row */}
      <Flex
        justify={{ base: "flex-start", md: "flex-end" }}
        align="center"
        mb={4}
        gap={3}
        flexWrap="wrap"
      >
        {/* Search Input */}
        <InputGroup maxW={{ base: "100%", md: "260px" }}>
          <InputLeftElement pointerEvents="none">
            <Search size={16} color="#A0AEC0" />
          </InputLeftElement>

          <Input
            placeholder="Search users..."
            bg="white"
            border="1px solid #E2E8F0"
            borderRadius="12px"
            fontSize="sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            _focus={{
              borderColor: "gray.400",
              boxShadow: "0 0 0 1px #CBD5E0",
            }}
          />

          {searchQuery && (
            <InputRightElement>
              <X
                size={16}
                color="#A0AEC0"
                cursor="pointer"
                onClick={() => setSearchQuery("")}
              />
            </InputRightElement>
          )}
        </InputGroup>

        {/* Filter Toggle Button */}
        <Button
          leftIcon={
            <MotionFilterIcon
              size={16}
              color={showFilters ? "#4A5568" : "#A0AEC0"}
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          }
          bg={showFilters ? "gray.100" : "gray.50"}
          border="1px solid #D0D5DD"
          color="gray.800"
          borderRadius="12px"
          fontWeight="600"
          px={4}
          _hover={{ bg: showFilters ? "gray.200" : "gray.100" }}
          boxShadow={
            showFilters
              ? "0 2px 6px rgba(0,0,0,0.08)"
              : "0px 1px 3px rgba(0,0,0,0.08)"
          }
          onClick={() => setShowFilters((prev) => !prev)}
          mt={{ base: 2, md: 0 }} // spacing on mobile
        >
          Filters
        </Button>
      </Flex>

      {/* Filters Panel */}
      {showFilters && (
        <Flex
          mb={6}
          p={4}
          bg="white"
          borderRadius="20px"
          boxShadow="0px 8px 24px rgba(0,0,0,0.08)"
          align="center"
          justify="space-between"
          flexWrap="wrap"
          gap={4}
          border="1px solid #E2E8F0"
        >
          <Flex gap={4} flexWrap="wrap" align="center">
            {/* Role Filter */}
            <Box flex="1" minW={{ base: "100%", md: "200px" }}>
              <Text fontSize="sm" fontWeight="600" mb={1} color="gray.600">
                Role
              </Text>
              <Select
                placeholder="Select role"
                size="md"
                borderRadius="14px"
                borderColor="gray.300"
                bg="gray.50"
                fontSize="sm"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "gray.500",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                }}
              >
                {Object.keys(roleBadgeStyles).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Select>
            </Box>

            {/* Status Filter */}
            <Box flex="1" minW={{ base: "100%", md: "200px" }}>
              <Text fontSize="sm" fontWeight="600" mb={1} color="gray.600">
                Account Status
              </Text>
              <Select
                placeholder="Select status"
                size="md"
                borderRadius="14px"
                borderColor="gray.300"
                bg="gray.50"
                fontSize="sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "gray.500",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                }}
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </Select>
            </Box>

            {/* Coins Filter */}
            <Box flex="1" minW={{ base: "100%", md: "200px" }}>
              <Text fontSize="sm" fontWeight="600" mb={1} color="gray.600">
                Coins Range
              </Text>

              <Select
                placeholder="Select coins range"
                size="md"
                borderRadius="14px"
                borderColor="gray.300"
                bg="gray.50"
                fontSize="sm"
                value={coinsFilter}
                onChange={(e) => setCoinsFilter(e.target.value)}
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "gray.500",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                }}
              >
                <option value="0-100">0 - 100</option>
                <option value="100-500">100 - 500</option>
                <option value="500-1000">500 - 1000</option>
                <option value="1000-5000">1000 - 5000</option>
                <option value="5000-10000">5000 - 10000</option>
                <option value="10000+">Above 10000</option>
              </Select>
            </Box>

            {/* Salary Filter */}
            <Box flex="1" minW={{ base: "100%", md: "200px" }}>
              <Text fontSize="sm" fontWeight="600" mb={1} color="gray.600">
                Salary Type
              </Text>
              <Select
                placeholder="Select salary type"
                size="md"
                borderRadius="14px"
                borderColor="gray.300"
                bg="gray.50"
                fontSize="sm"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "gray.500",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                }}
              >
                <option value="Salary">Salary</option>
                <option value="Salary / Commission">
                  Salary / Commission{" "}
                </option>
                <option value="Salary / Incentive">Salary / Incentive </option>
                <option value="Salary / Commission">Salary / Commission</option>
                <option value="Salary / Commission / Incentive">
                  Salary / Commission / Incentive
                </option>
              </Select>
            </Box>

            {/* Agency Filter */}
            <Box flex="1" minW={{ base: "100%", md: "200px" }}>
              <Text fontSize="sm" fontWeight="600" mb={1} color="gray.600">
                Agency
              </Text>
              <Select
                placeholder="Select agency"
                size="md"
                borderRadius="14px"
                borderColor="gray.300"
                bg="gray.50"
                fontSize="sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "gray.500",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                }}
              >
                <option value="Dubai">Dubai</option>
                <option value="Egypt">Egypt</option>
                <option value="Cairo">Cairo</option>
              </Select>
            </Box>

            {/* Commission Type*/}
            <Box flex="1" minW={{ base: "100%", md: "200px" }}>
              <Text fontSize="sm" fontWeight="600" mb={1} color="gray.600">
                Commission Type
              </Text>

              <Select
                placeholder="Select commission type"
                size="md"
                borderRadius="14px"
                borderColor="gray.300"
                bg="gray.50"
                fontSize="sm"
                value={coinsFilter}
                onChange={(e) => setCoinsFilter(e.target.value)}
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "gray.500",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                }}
              >
                <option value="Deal commission">Deal commission</option>
                <option value="Company commission">Company commission</option>
              </Select>
            </Box>
          </Flex>

          {/* Clear Filters Button */}
          {filtersApplied && (
            <Box
              flex={{ base: "1", md: "auto" }}
              textAlign={{ base: "left", md: "right" }}
            >
              <Button
                size="md"
                borderRadius="14px"
                bg="white"
                color="gray.600"
                fontWeight="500"
                px={5}
                gap={2}
                leftIcon={<X size={16} />}
                border="1px solid #E2E8F0"
                _hover={{
                  bg: "gray.50",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                }}
                _active={{
                  bg: "gray.100",
                  transform: "scale(0.98)",
                }}
                transition="all 0.2s ease"
                onClick={() => {
                  setRoleFilter("");
                  setStatusFilter("");
                  setSearchQuery("");
                  setCoinsFilter("");
                }}
              >
                Clear Filters
              </Button>
            </Box>
          )}
        </Flex>
      )}

      <Box
        bg="white"
        borderRadius="20px"
        boxShadow="0px 4px 30px rgba(0,0,0,0.06)"
        p={{ base: 3, md: 6 }}
        border="1px solid"
        borderColor="gray.100"
        overflowX="auto"
        maxH={pageSize > 10 ? "520px" : "auto"}
        overflowY={pageSize > 10 ? "auto" : "visible"}
      >
        <Table variant="simple" size="md">
          <Thead bg="gray.50">
            <Tr>
              <Th
                fontSize="sm"
                fontWeight="700"
                color="gray.600"
                textTransform="uppercase"
                letterSpacing="0.5px"
                px={3} // reduce horizontal padding
                w="40px" // optional: fix width for #
              >
                #
              </Th>
              <Th
                fontSize="sm"
                fontWeight="700"
                color="gray.600"
                textTransform="uppercase"
                letterSpacing="0.5px"
                px={3} // reduce padding
              >
                User
              </Th>

              <Th
                fontSize="sm"
                fontWeight="700"
                color="gray.600"
                textTransform="uppercase"
                letterSpacing="0.5px"
                px={3}
              >
                Role
              </Th>
              <Th
                fontSize="sm"
                fontWeight="700"
                color="gray.600"
                textTransform="uppercase"
                letterSpacing="0.5px"
                px={3}
              >
                Online Status
              </Th>

              <Th
                fontSize="sm"
                fontWeight="700"
                color="gray.600"
                textTransform="uppercase"
                letterSpacing="0.5px"
                px={3}
              >
                Coins
              </Th>
              <Th
                fontSize="sm"
                fontWeight="700"
                color="gray.600"
                textTransform="uppercase"
                letterSpacing="0.5px"
                px={3}
              >
                Target
              </Th>
              <Th
                fontSize="sm"
                fontWeight="700"
                color="gray.600"
                textTransform="uppercase"
                letterSpacing="0.5px"
                px={3}
              >
                Active
              </Th>
              <Th
                textAlign="right"
                fontSize="sm"
                fontWeight="700"
                color="gray.600"
                textTransform="uppercase"
                letterSpacing="0.5px"
                px={3}
              >
                Actions
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {paginatedUsers.length === 0 ? (
              <Tr>
                <Td colSpan={8} py={14}>
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    gap={3}
                  >
                    <Box
                      w="60px"
                      h="60px"
                      borderRadius="full"
                      bg="gray.100"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Search size={28} color="#718096" />
                    </Box>

                    {/* Heading */}
                    <Text fontSize="lg" fontWeight="700" color="gray.700">
                      {initialUsers?.length === 0
                        ? "No users found"
                        : "No matching results"}
                    </Text>

                    {/* Sub-text */}
                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      {initialUsers?.length === 0
                        ? "There are no users to display right now."
                        : "Try adjusting your filters to find what you're looking for."}
                    </Text>

                    {/* Clear Filters button ONLY if filters caused this */}
                    {(roleFilter ||
                      statusFilter ||
                      coinsFilter ||
                      searchQuery) &&
                      initialUsers?.length > 0 && (
                        <Button
                          size="sm"
                          borderRadius="10px"
                          mt={2}
                          bg="gray.100"
                          _hover={{ bg: "gray.200" }}
                          onClick={() => {
                            setRoleFilter("");
                            setStatusFilter("");
                            setSearchQuery("");
                            setCoinsFilter("");
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                  </Flex>
                </Td>
              </Tr>
            ) : (
              paginatedUsers?.map((user, index) => (
                <Tr
                  key={user.id}
                  _hover={{
                    bg: "gray.50",
                    transform: "translateY(-1px)",
                    transition: "0.2s",
                  }}
                >
                  {/* # */}
                  <Td fontWeight="600" px={3} py={3}>
                    {index + 1}
                  </Td>

                  {/* User */}
                  <Td px={3} py={3}>
                    <Flex align="center" gap={2}>
                      {" "}
                      {/* reduce gap from 3 -> 2 */}
                      <Avatar name={user.name} size="sm" />
                      <Box>
                        <Text fontWeight="600">{user.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {user.email}
                        </Text>
                      </Box>
                    </Flex>
                  </Td>

                  {/* Role */}
                  <Td px={3} py={3}>
                    <Badge
                      px={3}
                      py={1}
                      borderRadius="12px"
                      variant="subtle"
                      fontWeight="600"
                      colorScheme={
                        roleBadgeStyles[user.role]
                          ? roleBadgeStyles[user.role].colorScheme
                          : "gray"
                      }
                    >
                      {user.role}
                    </Badge>
                  </Td>

                  {/* Online Status */}
                  <Td px={3} py={3}>
                    <Flex align="center" gap={2}>
                      {/* Colored dot */}
                      <Box
                        w="10px"
                        h="10px"
                        borderRadius="full"
                        bg={user.status === "online" ? "green.400" : "gray.400"}
                      />
                      {/* Status text */}
                      <Text
                        fontSize="sm"
                        fontWeight="600"
                        color={
                          user.status === "online" ? "green.600" : "gray.600"
                        }
                        textTransform="capitalize"
                      >
                        {user.status}
                      </Text>
                    </Flex>
                  </Td>

                  {/* Coins */}
                  <Td px={3} py={3}>
                    <Flex align="center" gap={2}>
                      {/* Coins Display */}

                      <Flex align="center" gap={2}>
                        <Coins size={16} strokeWidth={1.5} color="#D4A017" />
                        <Text
                          fontWeight="600"
                          fontSize="15px"
                          color="gray.800"
                          fontFamily="mono"
                        >
                          {user.coins}
                        </Text>
                      </Flex>

                      {/* Minimal Edit Trigger */}

                      <Popover placement="bottom-end" isLazy>
                        <PopoverTrigger>
                          <IconButton
                            aria-label="Edit Coins"
                            icon={<Pencil size={16} />}
                            variant="ghost"
                            size="xs"
                            opacity={0.6}
                            _hover={{
                              opacity: 1,
                              bg: "gray.100",
                            }}
                          />
                        </PopoverTrigger>

                        <Portal>
                          {/* Portal ensures popover renders above ALL z-index stack */}
                          <PopoverContent
                            w="220px"
                            borderRadius="14px"
                            p={3}
                            boxShadow="0px 6px 24px rgba(0,0,0,0.12)"
                            zIndex={2000}
                            border="1px solid"
                            borderColor="gray.100"
                            bg="white"
                            animation="fadeIn 0.15s ease-out"
                            _focus={{
                              outline: "none",
                              boxShadow:
                                "0px 6px 24px rgba(0,0,0,0.12) !important",
                            }}
                          >
                            <PopoverArrow />
                            <PopoverBody>
                              <Flex direction="column" gap={4}>
                                {/* Segmented Toggle */}
                                <Flex
                                  bg="gray.100"
                                  p="4px"
                                  borderRadius="10px"
                                  gap="4px"
                                >
                                  <Box
                                    flex={1}
                                    textAlign="center"
                                    py={1}
                                    fontSize="sm"
                                    fontWeight="600"
                                    cursor="pointer"
                                    borderRadius="8px"
                                    bg={
                                      mode === "add"
                                        ? "green.500"
                                        : "transparent"
                                    }
                                    color={
                                      mode === "add" ? "white" : "gray.700"
                                    }
                                    transition="all 0.15s"
                                    onClick={() => setMode("add")}
                                  >
                                    Add
                                  </Box>

                                  <Box
                                    flex={1}
                                    textAlign="center"
                                    py={1}
                                    fontSize="sm"
                                    fontWeight="600"
                                    cursor="pointer"
                                    borderRadius="8px"
                                    bg={
                                      mode === "subtract"
                                        ? "red.500"
                                        : "transparent"
                                    }
                                    color={
                                      mode === "subtract" ? "white" : "gray.700"
                                    }
                                    transition="all 0.15s"
                                    onClick={() => setMode("subtract")}
                                  >
                                    Sub
                                  </Box>
                                </Flex>

                                {/* Minimal Input */}
                                <Input
                                  variant="flushed"
                                  placeholder="Enter amount"
                                  type="number"
                                  min={1}
                                  value={amount}
                                  onChange={(e) => setAmount(e.target.value)}
                                  fontSize="sm"
                                  _focus={{ borderColor: "gray.400" }}
                                />

                                {/* Apply Button */}
                                <Button
                                  size="sm"
                                  borderRadius="10px"
                                  bg={mode === "add" ? "green.500" : "red.500"}
                                  color="white"
                                  fontWeight="600"
                                  _hover={{
                                    bg:
                                      mode === "add" ? "green.600" : "red.600",
                                  }}
                                  onClick={handleUpdateCoins}
                                >
                                  Apply
                                </Button>
                              </Flex>
                            </PopoverBody>
                          </PopoverContent>
                        </Portal>
                      </Popover>
                    </Flex>
                  </Td>

                  {/* Target */}
                  <Td px={3} py={3}>
                    <Box
                      px={2}
                      py={1}
                      bg="purple.50" // subtle background
                      color="purple.800" // text color
                      borderRadius="8px" // rounded corners
                      fontWeight="600"
                      fontSize="sm"
                      textAlign="center"
                      maxW="100px" // optional: control width
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {user.target}
                    </Box>
                  </Td>

                  {/* Active Toggle */}
                  <Td px={3} py={3}>
                    <Flex align="center" gap={2} minW="120px">
                      <Switch
                        size="md"
                        colorScheme={
                          user.accountStatus === "Active" ? "green" : "red"
                        }
                        isChecked={user.accountStatus === "Active"}
                        onChange={() => handleToggle(user.id)}
                        borderRadius="full"
                        boxShadow="sm"
                        transition="all 0.2s"
                        _hover={{ boxShadow: "md" }}
                      />
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        color={
                          user.accountStatus === "Active"
                            ? "green.600"
                            : "red.500"
                        }
                      >
                        {user.accountStatus}
                      </Text>
                    </Flex>
                  </Td>

                  {/* Actions */}
                  <Td textAlign="right" px={3} py={3}>
                    <Flex justify="flex-end" align="center" gap="2px">
                      {/* View */}
                      <Tooltip
                        label="View User"
                        placement="top"
                        bg="gray.700"
                        color="white"
                        fontSize="xs"
                        borderRadius="6px"
                        px={2}
                        py={1}
                        hasArrow
                      >
                        <IconButton
                          aria-label="View"
                          icon={<Eye size={16} />}
                          variant="ghost"
                          size="sm"
                          _hover={{ bg: "gray.100" }}
                        />
                      </Tooltip>

                      {/* Edit */}
                      <Tooltip
                        label="Edit User"
                        placement="top"
                        bg="gray.700"
                        color="white"
                        fontSize="xs"
                        borderRadius="6px"
                        px={2}
                        py={1}
                        hasArrow
                      >
                        <IconButton
                          aria-label="Edit"
                          icon={<Edit size={16} />}
                          variant="ghost"
                          size="sm"
                          _hover={{ bg: "gray.100" }}
                        />
                      </Tooltip>

                      {/* More Options */}
                      {/* <Menu placement="left-start">
                      <MenuButton
                        as={IconButton}
                        icon={<MoreVertical size={16} />}
                        variant="ghost"
                        size="sm"
                        _hover={{ bg: "gray.100" }}
                      />
                      <MenuList borderRadius="12px" py={2} shadow="lg">
                        <MenuItem icon={<Plus size={16} />}>Add Coins</MenuItem>
                        <MenuItem icon={<Minus size={16} />}>
                          Remove Coins
                        </MenuItem>
                        <Divider my={2} />
                        <MenuItem icon={<Trash2 size={16} />} color="red.500">
                          Delete User
                        </MenuItem>
                      </MenuList>
                    </Menu> */}
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>

        <Flex
          bg="white"
          py={4}
          mt={4}
          justify="space-between"
          align="center"
          borderTop="1px solid"
          borderColor="gray.100"
          zIndex={15}
          px={2}
          gap={4}
          flexWrap="wrap"
        >
          {/* Left: Page Size */}
          <Flex align="center" gap={2} flex="0 0 auto">
            <Text fontSize="sm" color="gray.600" fontWeight="500">
              Rows per page:
            </Text>

            <Select
              size="md"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              w="80px"
              borderRadius="14px"
              borderColor="gray.300"
              bg="gray.50"
              fontSize="sm"
              _hover={{ borderColor: "gray.400" }}
              _focus={{
                borderColor: "gray.500",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
              }}
            >
              {[10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </Flex>

          {/* Middle: Navigation Controls */}
          <Flex
            align="center"
            gap={1}
            bg="gray.50"
            px={3}
            py={2}
            borderRadius="12px"
            boxShadow="sm"
            flex="0 0 auto" // prevent stretching
            mx="auto" // center horizontally
            mt={{ base: 2, md: 0 }} // spacing for small screens
          >
            <Tooltip label="First Page">
              <IconButton
                aria-label="First Page"
                icon={<ChevronLeft size={18} />}
                size="sm"
                onClick={() => setPage(1)}
                isDisabled={page === 1}
                variant="ghost"
              />
            </Tooltip>
            <Tooltip label="Previous Page">
              <IconButton
                aria-label="Prev Page"
                icon={<ChevronLeft size={18} />}
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                isDisabled={page === 1}
                variant="ghost"
              />
            </Tooltip>

            <Text fontSize="sm" color="gray.700" fontWeight="600" px={2}>
              Page {page} of {totalPages}
            </Text>

            <Tooltip label="Next Page">
              <IconButton
                aria-label="Next Page"
                icon={<ChevronRight size={18} />}
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                isDisabled={page === totalPages}
                variant="ghost"
              />
            </Tooltip>
            <Tooltip label="Last Page">
              <IconButton
                aria-label="Last Page"
                icon={<ChevronRight size={18} />}
                size="sm"
                onClick={() => setPage(totalPages)}
                isDisabled={page === totalPages}
                variant="ghost"
              />
            </Tooltip>
          </Flex>

          {/* Right: Jump To Page */}
          <Flex
            align="center"
            gap={2}
            flex="0 0 auto"
            justify={{ base: "flex-start", md: "flex-end" }}
            mt={{ base: 2, md: 0 }}
          >
            <Text fontSize="sm" color="gray.600" fontWeight="500">
              Jump to:
            </Text>

            <Input
              type="number"
              size="sm"
              w="70px"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              borderRadius="14px"
              borderColor="gray.300"
              bg="gray.50"
              fontSize="sm"
              _hover={{ borderColor: "gray.400" }}
              _focus={{
                borderColor: "gray.500",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
              }}
            />

            <Button
              size="sm"
              bg="gray.50"
              color="gray.800"
              border="1px solid #D0D5DD"
              borderRadius="12px"
              fontWeight="600"
              px={4}
              _hover={{ bg: "gray.100" }}
              boxShadow="0px 1px 3px rgba(0,0,0,0.08)"
              onClick={() => {
                const num = Number(jumpPage);
                if (num >= 1 && num <= totalPages) setPage(num);
              }}
            >
              Go
            </Button>
          </Flex>
        </Flex>
      </Box>

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
      />
    </Box>
  );
};

export default UserTable;
