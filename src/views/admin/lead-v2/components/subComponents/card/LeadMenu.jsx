import React from 'react';
import { toast } from 'react-toastify';
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	IconButton,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, PhoneIcon, EmailIcon } from '@chakra-ui/icons';
import { FaHistory } from 'react-icons/fa';
import { BsWhatsapp } from 'react-icons/bs';
import { MdTask } from 'react-icons/md';
import { CiMenuKebab } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from 'contexts/store';

import ReleaseLead from '../../ReleaseLead';
import { AiFillInfoCircle } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { generateRoomId } from 'views/admin/whatsapp/components/helpers';

import { setActiveChat } from '../../../../../../redux/whatsappSlice';
import { validatePhoneNumber } from 'utils/helpers';

const LeadMenu = ({
	lead,
	user,
	access,
	callAccess,
	emailAccess,

	setLeadDetails,
	setAddPhoneCall,
	setCallSelectedId,
	setTaskInits,
	onTaskOpen,

	setEditLead,
	setSendEmail,
	setSelectedValues,
	setDeleteLead,
	refreshData,
	setViewPhoneHistory,
	setLeadAddtionalInfo,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// const loginUser = useSelector((state) => state.user.user);

	const leadId = lead?._id;
	const phoneNumber =
		typeof lead?.leadPhoneNumber === 'object'
			? lead?.leadPhoneNumber?.result
			: lead?.leadPhoneNumber;
	const whatsappNumber =
		typeof lead.leadWhatsappNumber === 'object'
			? lead.leadWhatsappNumber?.result
			: lead.leadWhatsappNumber;

	// agent edit the lead only phone and lead name (when status is show)
	const allowedUserEdit =
		user?.roles[0]?.roleName === 'Agent' ? true : lead?.eLeadStatus === 'show';

	const { setIsLeadCycle } = useStateContext();

	const handleOpenWhatsapp = async () => {
		const businessPhone = user?.whatsappDetails?.phoneNumber;

		if (!businessPhone) {
			toast.error(
				user?.role === 'superAdmin'
					? 'Please first setup our whatsapp!'
					: 'Can not open the whatsapp, please contact with Admin.'
			);
			return;
		}

		const validNum = validatePhoneNumber(whatsappNumber);

		if (!validNum) return toast.error('Not valid WhatsApp number!');

		const roomId = generateRoomId(validNum, businessPhone);

		const newContact = {
			phoneNumber: validNum,
			roomId,
			ownerId: businessPhone,
		};

		dispatch(setActiveChat(newContact));

		const redirectUrl =
			user?.role === 'superAdmin'
				? `/whatsapp/chat/${user._id}`
				: `/whatsapp/chat`;

		navigate(redirectUrl);
	};

	return (
		<Menu isLazy closeOnSelect={false}>
			<MenuButton as={IconButton} icon={<CiMenuKebab />} variant='ghost' />
			<MenuList minW='fit-content'>
				{(user?.role === 'superAdmin' && access?.update) ||
				(user?.role !== 'superAdmin' && allowedUserEdit) ? (
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
				) : null}

				{['Manager', 'Agent'].includes(user?.roles[0]?.roleName) && (
					<ReleaseLead
						isReleased={lead?.isReleased}
						role={user?.roles[0]?.roleName}
						leadId={lead?._id}
						as={MenuItem}
						refreshData={refreshData}
					/>
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
				{user?.role === 'superAdmin' && (
					<MenuItem
						py={2.5}
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
						if (phoneNumber) window.location.href = `tel:${phoneNumber}`;
					}}
					icon={<PhoneIcon fontSize={15} />}
				>
					Open in Dialpad
				</MenuItem>
				<MenuItem
					py={2.5}
					onClick={handleOpenWhatsapp}
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

				<MenuItem
					py={2.5}
					onClick={() => {
						setLeadAddtionalInfo(true);
						setLeadDetails(lead);
					}}
					icon={<AiFillInfoCircle fontSize={15} />}
				>
					Addtional Info
				</MenuItem>
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
