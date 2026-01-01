import {
	Spinner,
	Switch,
	Text,
	useDisclosure,
	Flex,
	Box,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useUpdateItemMutation } from 'api/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import useUserSession from 'hooks/useUserSession';
import { useTeamStructure } from 'hooks/user/useTeamStructure';
import ReplaceManager from 'views/admin/users/components/ReplaceManager';
import ReplaceTeamLead from 'views/admin/users/components/ReplaceTeamLead';
import SecurityPasswordPermission from 'views/admin/users/components/PasswordPermission';
import InfoModal from 'views/admin/users/components/InfoModal';

const UserStatusToggle = ({ user, refetchUsers }) => {
	const [isActive, setIsActive] = useState(user?.isActive || false);
	const [isAllowed, setIsAllowed] = useState(false);

	const [replacementManager, setReplacementManager] = useState('');
	const [replacementTeamLead, setReplacementTeamLead] = useState(null);
	const [securityPassword, setSecurityPassword] = useState('');

	const { isSuperAdmin } = useUserSession();

	const {
		team: managers,
		getTeamLeadsByManager,
		refreshTeam,
	} = useTeamStructure();

	const {
		isOpen: replaceIsOpen,
		onOpen: replaceOnOpen,
		onClose: replaceOnClose,
	} = useDisclosure();

	const {
		isOpen: replaceLeadIsOpen,
		onOpen: replaceLeadOnOpen,
		onClose: replaceLeadOnClose,
	} = useDisclosure();

	const {
		isOpen: passwordIsOpen,
		onOpen: passwordOnOpen,
		onClose: passwordOnClose,
	} = useDisclosure();

	const {
		isOpen: infoIsOpen,
		onOpen: infoOnOpen,
		onClose: infoOnClose,
	} = useDisclosure();

	const [updateItemMutation, { isLoading: isUpdating }] =
		useUpdateItemMutation();

	const handleToggle = async () => {
		try {
			const newStatus = !isActive;

			if (
				user?.roles?.roleName === 'Manager' &&
				isActive &&
				!replacementManager
			) {
				// Filter agents related to the assigned manager
				// const agents = tree?.agents?.[`manager-${user._id}`];

				// if (agents?.length > 0) {
				return replaceOnOpen();

				// }
			} else if (
				user?.roles?.roleName === 'Team Leader' &&
				isActive &&
				!replacementTeamLead
			) {
				return replaceLeadOnOpen();
			}

			if (!newStatus && !isAllowed) {
				infoOnOpen();
				return;
			}

			let bodyData = { isActive: newStatus };

			if (securityPassword) bodyData.securityPassword = securityPassword;
			if (replacementManager) bodyData.replacementManager = replacementManager;
			if (replacementTeamLead)
				bodyData.replacementTeamLead = replacementTeamLead;

			if (!securityPassword) return passwordOnOpen();

			await updateItemMutation({
				path: `/v2/user/status/${user._id}`,
				body: bodyData,
			}).unwrap();

			setIsActive(newStatus);
			toast.success(`User ${newStatus ? 'enabled' : 'disabled'} successfully`);

			refetchUsers();
			resetStates();
			refreshTeam();
		} catch (error) {
			toast.error(error?.data?.message || 'Error updating user status');
			resetStates();
		}
	};

	const resetStates = () => {
		setIsAllowed(false);
		setSecurityPassword('');
		setReplacementManager('');
	};

	const handleUpdate = () => {
		passwordOnClose();
		handleToggle();
	};

	const handleInfoProceed = () => {
		infoOnClose();
		setIsAllowed(true);
		passwordOnOpen();
	};

	useEffect(() => {
		setIsActive(user?.isActive || false);
	}, [user?.isActive]);

	const managerTeamLeaders = useMemo(() => {
		if (!user?.parent || user?.roles?.roleName !== 'Team Leader') return [];

		return getTeamLeadsByManager(user.parent)?.filter(
			(tl) => tl?._id !== user?._id
		);
	}, [user?._id]);

	return (
		<Box>
			<Text
				color={isActive ? 'green.400' : 'red.400'}
				fontSize='sm'
				fontWeight='700'
				textAlign='center'
			>
				{isUpdating ? (
					<Spinner
						ml={2}
						thickness='2px'
						speed='0.65s'
						emptyColor='gray.200'
						color='brand.400'
						size='sm'
					/>
				) : (
					<>
						<Flex gap={1}>
							{isActive ? 'Active' : 'Inactive'}
							{isSuperAdmin && (
								<Switch
									ml={2}
									colorScheme='brand'
									isChecked={isActive}
									disabled={!isSuperAdmin}
									onChange={handleToggle}
								/>
							)}
						</Flex>
					</>
				)}
			</Text>

			{replaceIsOpen && (
				<ReplaceManager
					isOpen={replaceIsOpen}
					onClose={() => {
						replaceOnClose();
						setIsAllowed(false);
						setSecurityPassword('');
					}}
					managers={managers?.filter((item) => item._id !== user?._id)}
					replacementManager={replacementManager}
					setReplacementManager={setReplacementManager}
					type='userStatus'
					handleProceed={() => {
						replaceOnClose();
						handleToggle();
					}}
				/>
			)}

			{replaceLeadIsOpen && (
				<ReplaceTeamLead
					isOpen={replaceLeadIsOpen}
					onClose={() => {
						replaceLeadOnClose();
						setIsAllowed(false);
						setSecurityPassword('');
					}}
					teamLeaders={managerTeamLeaders}
					replacementTeamLead={replacementTeamLead}
					handleProceed={() => {
						replaceLeadOnClose();
						handleToggle();
					}}
					setReplacementTeamLead={setReplacementTeamLead}
				/>
			)}

			{passwordIsOpen && (
				<SecurityPasswordPermission
					isOpen={passwordIsOpen}
					onClose={passwordOnClose}
					securityPassword={securityPassword}
					setSecurityPassword={setSecurityPassword}
					handleProceed={handleUpdate}
					type='userStatus'
				/>
			)}

			{infoIsOpen && (
				<InfoModal
					isOpen={infoIsOpen}
					onClose={infoOnClose}
					username={user?.fullName}
					handleProceed={handleInfoProceed}
				/>
			)}
		</Box>
	);
};

export default UserStatusToggle;
