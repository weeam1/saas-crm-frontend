import React from "react";
import { Icon } from "@chakra-ui/react";
import {
  MdHome,
  MdLeaderboard,
  MdOutlineLaptopMac,
  MdAdminPanelSettings,
  MdCampaign,
  MdAddBox,
} from "react-icons/md";
import {
  FaTasks,
  FaWpforms,
  FaRegCalendarCheck,
  FaRegCopy,
  FaList,
  FaPhone,
  FaWhatsapp,
  FaHandshake,
} from "react-icons/fa";
import { HiOutlineDocumentReport, HiUsers } from "react-icons/hi";
import { FaClipboardUser, FaSquarePlus } from "react-icons/fa6";

const PermissionIcon = ({ moduleName }) => {
  const cleanModuleName = moduleName.replace(/^[\s,]+/, "").trim();

  const iconMap = {
    "Admin Settings": MdAdminPanelSettings,
    "Lead Module": MdLeaderboard,
    "Announcement Module": MdCampaign,
    "Invoice Module": FaWpforms,
    "Expense Module": FaRegCopy,
    "Call Logs Module": FaPhone,
    "WhatsApp Module": FaWhatsapp,
    "Task Module": FaTasks,
    "System Log Module": MdOutlineLaptopMac,
    Dashboard: MdHome,
    "Deals Module": FaHandshake,
    "Attendance Module": FaRegCalendarCheck,
    "Hiring Module": FaClipboardUser,
    "Survey Module": FaSquarePlus,
    "Listing Module": FaList,
    "Users Module": HiUsers,
    "Reports Module": HiOutlineDocumentReport,
  };

  const IconComponent = iconMap[cleanModuleName] || MdAddBox;

  return <Icon as={IconComponent} width="20px" height="20px" color="inherit" />;
};

export default PermissionIcon;