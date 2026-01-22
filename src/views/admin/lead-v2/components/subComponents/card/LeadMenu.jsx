import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, PhoneIcon, EmailIcon } from "@chakra-ui/icons";
import { FaHistory } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FiUsers } from "react-icons/fi";
import ReleaseLead from "../../ReleaseLead";
import { AiFillInfoCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { generateRoomId } from "views/admin/whatsapp/components/helpers";

import { usePermissions } from "hooks/usePermissions";
import useUserSession from "hooks/useUserSession";
import { FiMoreVertical } from "react-icons/fi";
import { normalizePhone, formatWebRTCPhone } from "utils/phoneValidation";
import { FaMessage } from "react-icons/fa6";
import DirectWhatsappMessage from "../../whatsapp-message/DirectWhatsappMessage";
import { setActiveChat } from "../../../../../../redux/whatsappSlice";
import { setAutoDialLead } from "../../../../../../redux/webrtc/webrtcSlice";

const LeadMenu = ({
  editSecondary,
  setEditSecondary,
  lead,
  // user,
  access,
  callAccess,
  emailAccess,
  refreshData,
  setLeadDetails,
  setIsLeadCycle,
  setEditLead,
  setSendEmail,
  setSelectedValues,
  setDeleteLead,
  setViewPhoneHistory,
  setLeadAddtionalInfo,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [directMessageModal, setDirectMessageModal] = useState(false);

  const webrtc = useSelector((state) => state.webrtc);
  const userSettings = webrtc?.userSettings;

  const isWssEnabled = Boolean(
    userSettings?.status?.wss || userSettings?.modes?.wss?.cid,
  );

  // const user = useSelector((state) => state.user.user);
  const { user, isSuperAdmin, userRoleName } = useUserSession();
  const { hasPermission } = usePermissions();

  const businessPhone = user?.whatsappDetails?.phoneNumber;

  const whatsappInstance =
    (user?.whatsappInstance?.sessionId && user?.whatsappInstance?.isActive) ||
    false;

  // const loginUser = useSelector((state) => state.user.user);

  const leadId = lead?._id;
  const phoneNumber =
    typeof lead?.leadPhoneNumber === "object"
      ? lead?.leadPhoneNumber?.result
      : lead?.leadPhoneNumber;
  const whatsappNumber =
    typeof lead.leadWhatsappNumber === "object"
      ? lead?.leadWhatsappNumber?.result
      : lead?.leadWhatsappNumber;

  // agent edit the lead only phone and lead name (when status is show)
  // const allowedUserEdit = ['Admin', 'superAdmin'].includes(user?.roleName)
  // 	? true
  // 	: lead?.eLeadStatus === 'show';

  // const { setIsLeadCycle } = useStateContext();

  const handleOpenWhatsapp = async () => {
    // console.log({ whatsapp: user?.whatsappDetails, businessPhone });

    if (!businessPhone) {
      toast.error(
        isSuperAdmin
          ? "Please first setup our whatsapp!"
          : "Your WhatsApp is not setup, please contact with super Admin.",
      );
      return;
    }

    const validNum = normalizePhone(whatsappNumber);

    if (!validNum) return toast.error("Not valid WhatsApp number!");

    const roomId = generateRoomId(validNum, businessPhone);

    const newContact = {
      phoneNumber: validNum,
      roomId,
      ownerId: businessPhone,
    };

    dispatch(setActiveChat(newContact));

    const redirectUrl = isSuperAdmin
      ? `/whatsapp/chats/${user._id}`
      : `/whatsapp/chats`;

    navigate(redirectUrl);
  };

  const handleDirectCall = () => {
    const validNum = formatWebRTCPhone(phoneNumber);

    if (validNum) {
      dispatch(
        setAutoDialLead({
          phoneNumber: validNum,
          leadName: lead?.leadName,
          id: lead?.leadId,
        }),
      );
    } else
      toast.warning(
        "Lead phone number is invalid for calling. Please check the format.",
      );
  };

  const handleDirectMessage = () => {
    setDirectMessageModal(true);
  };

  return (
    <>
      <Menu isLazy closeOnSelect={false} size="sm">
        <MenuButton
          as={IconButton}
          icon={<FiMoreVertical />}
          aria-label="Options"
          variant="ghost"
          size="sm"
          fontSize="18px"
          rounded="full"
          _focus={{ boxShadow: "none", outline: "none" }}
        />
        {/* <MenuButton as={IconButton} icon={<CiMenuKebab />} variant='ghost' /> */}
        <MenuList minW="fit-content" fontSize="sm">
          {/* {(isSuperAdmin && access?.update) ||
				(user?.role !== 'superAdmin' && allowedUserEdit) ? ( */}
          {/* {(isSuperAdmin && access?.update) || */}
          {hasPermission("leads", "update") ||
          hasPermission("leads", "edit_contacts") ? (
            <MenuItem
              onClick={() => {
                setEditLead(true);
                setLeadDetails(lead);
              }}
              icon={<EditIcon fontSize={15} />}
            >
              Edit
            </MenuItem>
          ) : null}
          {["Manager", "Agent", "Team Leader"].includes(userRoleName) && (
            <ReleaseLead
              isReleased={lead?.isReleased}
              role={userRoleName}
              leadId={lead?._id}
              lead={lead}
              as={MenuItem}
              refreshData={refreshData}
            />
          )}

          {hasPermission("call_dialer") && isWssEnabled && (
            <MenuItem
              onClick={handleDirectCall}
              icon={<PhoneIcon fontSize={15} />}
            >
              Direct Call
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              setEditSecondary(true);
              setLeadDetails(lead); // 🔹 set lead data
            }}
            icon={<FiUsers fontSize={15} />}
          >
            Secondary Contact
          </MenuItem>

          {/* {callAccess?.create && (
					<MenuItem

						// onClick={() => {
						// 	setAddPhoneCall(true);
						// 	setCallSelectedId(leadId);
						// }}
						icon={<PhoneIcon fontSize={15} />}
					>
						Create Call
					</MenuItem>
				)} */}
          {/* {emailAccess?.create && ( */}
          {hasPermission("leads", "sendEmail") && (
            <MenuItem
              onClick={() => {
                setSendEmail(true);
                setLeadDetails(lead);
              }}
              icon={<EmailIcon fontSize={15} />}
            >
              Send Email
            </MenuItem>
          )}
          {hasPermission("leads", "viewLeadCycle") && (
            <MenuItem
              onClick={() => setIsLeadCycle({ isOpen: true, id: leadId })}
              icon={<FaHistory fontSize={15} />}
            >
              View Lead Cycle
            </MenuItem>
          )}
          {/* {isSuperAdmin && ( */}
          {hasPermission("leads", "viewPhoneHistory") && (
            <MenuItem
              onClick={() => {
                setViewPhoneHistory({
                  modal: true,
                  leadId: lead._id,
                });
              }}
              icon={<FaHistory fontSize={15} />}
            >
              View Phone History
            </MenuItem>
          )}

          {hasPermission("whatsapp") && whatsappInstance && (
            <MenuItem
              py={2.5}
              onClick={handleDirectMessage}
              icon={<FaMessage fontSize={15} />}
            >
              Direct Message
            </MenuItem>
          )}
          {/* <MenuItem

					onClick={() => navigate(`/leadHistory/${leadId}`)}
					icon={<FaHistory fontSize={15} />}
				>
					View Call History
				</MenuItem> */}
          <MenuItem
            display={{ sm: "block", xl: "none" }}
            onClick={() => {
              if (phoneNumber) window.location.href = `tel:${phoneNumber}`;
            }}
            icon={<PhoneIcon fontSize={15} />}
          >
            Open in Dialpad
          </MenuItem>
          {businessPhone && hasPermission("whatsapp") && (
            <MenuItem
              onClick={handleOpenWhatsapp}
              icon={<BsWhatsapp fontSize={15} />}
            >
              Open in WhatsApp
            </MenuItem>
          )}

          {/* {user?.roles[0]?.roleName === 'Agent' && (
					<MenuItem
						// onClick={() => {
						// 	setTaskInits(lead);
						// 	onTaskOpen();
						// }}
						icon={<MdTask fontSize={15} />}
					>
						Create Follow Up
					</MenuItem>
				)} */}

          {hasPermission("leads", "leadAdditionalInfo") && (
            <MenuItem
              onClick={() => {
                setLeadAddtionalInfo(true);
                setLeadDetails(lead);
              }}
              icon={<AiFillInfoCircle fontSize={15} />}
            >
              Addtional Info
            </MenuItem>
          )}
          {/* {access?.delete && isSuperAdmin && ( */}
          {hasPermission("leads", "delete") && (
            <MenuItem
              color="red"
              onClick={() => {
                setSelectedValues([leadId]);
                setDeleteLead(true);
              }}
              icon={<DeleteIcon fontSize={15} />}
            >
              Delete
            </MenuItem>
          )}
        </MenuList>
      </Menu>

      {directMessageModal && (
        <DirectWhatsappMessage
          isOpen={directMessageModal}
          onClose={() => setDirectMessageModal(false)}
          user={user}
          number={lead.leadWhatsappNumber}
        />
      )}
    </>
  );
};

export default LeadMenu;
