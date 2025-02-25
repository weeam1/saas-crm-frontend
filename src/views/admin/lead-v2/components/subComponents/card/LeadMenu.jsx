import React from 'react';
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	IconButton,
} from '@chakra-ui/react';
import {
	EditIcon,
	DeleteIcon,
	ViewIcon,
	PhoneIcon,
	EmailIcon,
} from '@chakra-ui/icons';
import { FaHistory } from 'react-icons/fa';
import { BsWhatsapp } from 'react-icons/bs';
import { MdTask } from 'react-icons/md';
import { CiMenuKebab } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

const LeadMenu = ({
	lead,
	user,
	access,
	callAccess,
	emailAccess,

	setLeadDetails,
	setAddPhoneCall,
	setCallSelectedId,
	setIsLeadCycle,
	setTaskInits,
	onTaskOpen,

	setEditLead,
	setSendEmail,
	setSelectedValues,
	setDeleteLead,
}) => {
	const navigate = useNavigate();
	const leadId = lead?._id;
	const phoneNumber = lead?.leadPhoneNumber;

	return (
		<Menu isLazy>
			<MenuButton as={IconButton} icon={<CiMenuKebab />} variant='ghost' />
			<MenuList minW='fit-content'>
				{access?.update && user?.role === 'superAdmin' && (
					<MenuItem
						py={2.5}
						onClick={() => {
							setEditLead(true);
							setLeadDetails(lead);
						}}
						icon={<EditIcon fontSize={15} />}
					>
						Edit
					</MenuItem>
				)}
				{callAccess?.create && (
					<MenuItem
						py={2.5}
						// onClick={() => {
						// 	setAddPhoneCall(true);
						// 	setCallSelectedId(leadId);
						// }}
						icon={<PhoneIcon fontSize={15} />}
					>
						Create Call
					</MenuItem>
				)}
				{emailAccess?.create && (
					<MenuItem
						py={2.5}
						onClick={() => {
							setSendEmail(true);
							setLeadDetails(lead);
						}}
						icon={<EmailIcon fontSize={15} />}
					>
						Send Email
					</MenuItem>
				)}
				<MenuItem
					py={2.5}
					onClick={() => setIsLeadCycle({ isOpen: true, id: leadId })}
					icon={<FaHistory fontSize={15} />}
				>
					View Lead Cycle
				</MenuItem>
				<MenuItem
					py={2.5}
					onClick={() => navigate(`/leadHistory/${leadId}`)}
					icon={<FaHistory fontSize={15} />}
				>
					View Call History
				</MenuItem>
				<MenuItem
					py={2.5}
					display={{ sm: 'block', xl: 'none' }}
					onClick={() => {
						if (phoneNumber) window.location.href = `tel:+92${phoneNumber}`;
					}}
					icon={<PhoneIcon fontSize={15} />}
				>
					Open in Dialpad
				</MenuItem>
				<MenuItem
					py={2.5}
					onClick={() => {
						if (phoneNumber)
							window.open(
								`https://api.whatsapp.com/send/?phone=${phoneNumber}`
							);
					}}
					icon={<BsWhatsapp fontSize={15} />}
				>
					Open in WhatsApp
				</MenuItem>
				{user?.roles[0]?.roleName === 'Agent' && (
					<MenuItem
						py={2.5}
						// onClick={() => {
						// 	setTaskInits(lead);
						// 	onTaskOpen();
						// }}
						icon={<MdTask fontSize={15} />}
					>
						Create Follow Up
					</MenuItem>
				)}
				{access?.delete && user?.role === 'superAdmin' && (
					<MenuItem
						py={2.5}
						color='red'
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
	);
};

export default LeadMenu;
