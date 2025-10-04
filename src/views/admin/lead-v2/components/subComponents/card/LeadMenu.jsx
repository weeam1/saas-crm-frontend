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
import { useNavigate } from 'react-router-dom';

import ReleaseLead from '../../ReleaseLead';
import { AiFillInfoCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { generateRoomId } from 'views/admin/whatsapp/components/helpers';

import { setActiveChat } from '../../../../../../redux/whatsappSlice';
// import { validatePhoneNumber } from 'utils/helpers';
import { usePermissions } from 'hooks/usePermissions';
import useUserSession from 'hooks/useUserSession';
import { FiMoreVertical } from 'react-icons/fi';
import { extractLocationData } from 'utils/helpers';
import { normalizePhone } from 'utils/phoneValidation';

const LeadMenu = ({
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

	// const user = useSelector((state) => state.user.user);
	const { user, isSuperAdmin, userRoleName } = useUserSession();
	const { hasPermission } = usePermissions();

	const countries = useSelector(
		(state) => state?.countries?.countryNames || []
	);

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
	const allowedUserEdit = ['Admin', 'superAdmin'].includes(user?.roleName)
		? true
		: user?.roleName === 'Agent'
			? true
			: lead?.eLeadStatus === 'show';

	// const { setIsLeadCycle } = useStateContext();

	const handleOpenWhatsapp = async () => {
		const businessPhone = user?.whatsappDetails?.phoneNumber;

		if (!businessPhone) {
			toast.error(
				isSuperAdmin
					? 'Please first setup our whatsapp!'
					: 'Your WhatsApp is not setup, please contact with super Admin.'
			);
			return;
		}

		const { country } = extractLocationData(lead?.ip, countries);

		// const validNum = validatePhoneNumber(whatsappNumber);
		const validNum = normalizePhone(whatsappNumber, country);

		if (!validNum) return toast.error('Not valid WhatsApp number!');

		const roomId = generateRoomId(validNum, businessPhone);

		const newContact = {
			phoneNumber: validNum,
			roomId,
			ownerId: businessPhone,
		};

		dispatch(setActiveChat(newContact));

		const redirectUrl = isSuperAdmin
			? `/whatsapp/chat/${user._id}`
			: `/whatsapp/chat`;

		navigate(redirectUrl);
	};

	return (
		<Menu isLazy closeOnSelect={false} size='sm'>
			<MenuButton
				as={IconButton}
				icon={<FiMoreVertical />}
				aria-label='Options'
				variant='ghost'
				size='sm'
				fontSize='18px'
				rounded='full'
				_focus={{ boxShadow: 'none', outline: 'none' }}
			/>
			{/* <MenuButton as={IconButton} icon={<CiMenuKebab />} variant='ghost' /> */}
			<MenuList minW='fit-content' fontSize='sm'>
				{/* {(isSuperAdmin && access?.update) ||
				(user?.role !== 'superAdmin' && allowedUserEdit) ? ( */}
				{/* {(isSuperAdmin && access?.update) || */}
				{hasPermission('leads', 'update') && allowedUserEdit ? (
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
				{['Manager', 'Agent'].includes(userRoleName) && (
					<ReleaseLead
						isReleased={lead?.isReleased}
						role={userRoleName}
						leadId={lead?._id}
						as={MenuItem}
						refreshData={refreshData}
					/>
				)}
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
				{hasPermission('leads', 'sendEmail') && (
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
				{hasPermission('leads', 'viewLeadCycle') && (
					<MenuItem
						onClick={() => setIsLeadCycle({ isOpen: true, id: leadId })}
						icon={<FaHistory fontSize={15} />}
					>
						View Lead Cycle
					</MenuItem>
				)}
				{/* {isSuperAdmin && ( */}
				{hasPermission('leads', 'viewPhoneHistory') && (
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
				{/* <MenuItem
				
					onClick={() => navigate(`/leadHistory/${leadId}`)}
					icon={<FaHistory fontSize={15} />}
				>
					View Call History
				</MenuItem> */}
				<MenuItem
					display={{ sm: 'block', xl: 'none' }}
					onClick={() => {
						if (phoneNumber) window.location.href = `tel:${phoneNumber}`;
					}}
					icon={<PhoneIcon fontSize={15} />}
				>
					Open in Dialpad
				</MenuItem>
				<MenuItem
					onClick={handleOpenWhatsapp}
					icon={<BsWhatsapp fontSize={15} />}
				>
					Open in WhatsApp
				</MenuItem>
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

				{hasPermission('leads', 'leadAdditionalInfo') && (
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
				{hasPermission('leads', 'delete') && (
					<MenuItem
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
