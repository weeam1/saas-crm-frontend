import React, { useState } from 'react';
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
import { CiMenuKebab } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

import { AiFillInfoCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { generateRoomId } from 'views/admin/whatsapp/components/helpers';

import { setActiveChat } from '../../../../../redux/whatsappSlice';
import { validatePhoneNumber } from 'utils/helpers';
import ReleaseLead from 'views/admin/lead-v2/components/ReleaseLead';
import LeadPhoneHistory from 'views/admin/lead-v2/components/subComponents/LeadPhoneHistory';
import LeadAdditionalInfoModal from 'views/admin/lead-v2/components/lead-note/LeadAdditionalInfoModal';
import useUserSession from 'hooks/useUserSession';
import { usePermissions } from 'hooks/usePermissions';

const LeadMenu = ({
	refreshData,
	setEditLead,
	setSendEmail,
	setSelectedValues,
	setIsLeadCycle,

	callAccess,
	setSelectedId,
	setLeadDetails,
	setDeleteLead,
	lead,
	access,
	emailAccess,
	setTaskInits,
	onTaskOpen,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// const user = useSelector((state) => state.user.user);
	const { user, userRoleName, isSuperAdmin } = useUserSession();
	const { hasPermission } = usePermissions();

	const [viewPhoneHistory, setViewPhoneHistory] = useState({
		modal: false,
		leadId: null,
	});

	const [leadAddtionalInfo, setLeadAddtionalInfo] = useState(false);

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
	const allowedUserEdit = isSuperAdmin
		? true
		: userRoleName === 'Agent'
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

		const validNum = validatePhoneNumber(whatsappNumber);

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
		<>
			<Menu
				isLazy
				closeOnSelect={false}
				placement='bottom-start'
				zIndex='10000'
			>
				<MenuButton as={IconButton} icon={<CiMenuKebab />} variant='ghost' />
				<MenuList minW='fit-content' fontSize='xs'>
					{hasPermission('leads', 'update') && allowedUserEdit ? (
						<MenuItem
							// py={2.5}
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

					{hasPermission('leads', 'sendEmail') && (
						<MenuItem
							// py={2.5}
							onClick={() => {
								setLeadDetails(lead);
								setSelectedId(lead._id);
								setSendEmail(true);
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
						py={2.5}
						onClick={handleOpenWhatsapp}
						icon={<BsWhatsapp fontSize={15} />}
					>
						Open in WhatsApp
					</MenuItem>
					{/* {user?.roles[0]?.roleName === 'Agent' && (
						<MenuItem
							// onClick={() => {2
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

			{leadAddtionalInfo && (
				<LeadAdditionalInfoModal
					isOpen={leadAddtionalInfo}
					onClose={() => setLeadAddtionalInfo(false)}
					leadId={lead?._id}
				/>
			)}

			{viewPhoneHistory?.modal && (
				<LeadPhoneHistory
					isOpen={viewPhoneHistory?.modal}
					onClose={() =>
						setViewPhoneHistory({
							modal: false,
							leadId: null,
						})
					}
					leadId={viewPhoneHistory?.leadId}
				/>
			)}
		</>
	);
};

export default LeadMenu;
