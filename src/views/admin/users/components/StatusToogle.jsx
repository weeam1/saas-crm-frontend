import { Spinner, Switch, Text, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useUpdateItemMutation } from 'api/apiSlice';
import { useSelector } from 'react-redux';
import ReplaceManager from './ReplaceManager';
import PasswordPermission from './PasswordPermission';
import InfoModal from './InfoModal';

const StatusToggle = ({ user, initialStatus, role, statusChange }) => {
	const [isActive, setIsActive] = useState(initialStatus);
	const [isAllowed, setIsAllowed] = useState(false);

	const [replacementManager, setReplacementManager] = useState('');
	const [securityPassword, setSecurityPassword] = useState('');

	const {
		isOpen: replaceIsOpen,
		onOpen: replaceOnOpen,
		onClose: replaceOnClose,
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

	const tree = useSelector((state) => state.user.activeTree);

	const handleToggle = async () => {
		try {
			const newStatus = !isActive;

			// console.log({
			// 	isAllowed,
			// 	isActive,
			// 	replacementManager,
			// 	securityPassword,
			// });

			if (!newStatus && !isAllowed) {
				infoOnOpen();
				return;
			}

			if (!securityPassword) return passwordOnOpen();

			let bodyData = { isActive: newStatus };

			if (
				user?.roles[0]?.roleName === 'Manager' &&
				isActive &&
				!replacementManager
			) {
				// Filter agents related to the assigned manager
				// const agents = tree?.agents?.[`manager-${user._id}`];

				// if (agents?.length > 0) {
				// console.log('Agents legnth: ', agents);
				replaceOnOpen();
				return;
				// }
			}

			if (securityPassword) bodyData.securityPassword = securityPassword;
			if (replacementManager) bodyData.replacementManager = replacementManager;

			await updateItemMutation({
				path: `/v2/user/status/${user._id}`,
				body: bodyData,
			}).unwrap();

			setIsActive(newStatus);
			toast.success(`User ${newStatus ? 'enabled' : 'disabled'} successfully`);
			statusChange(user, newStatus);
			resetStates();
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
		setIsActive(initialStatus);
	}, [initialStatus]);

	return (
		<>
			<Text
				color={isActive ? 'green.400' : 'red.400'}
				fontSize='sm'
				fontWeight='700'
				textAlign='center'
				fontFamily="'DM Sans', sans-serif"
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
						{isActive ? 'Enable' : 'Disable'}
						<Switch
							ml={2}
							colorScheme='brand'
							isChecked={isActive}
							disabled={role === 'superAdmin'}
							onChange={handleToggle}
						/>
					</>
				)}
			</Text>

			{replaceIsOpen && (
				<ReplaceManager
					isOpen={replaceIsOpen}
					onClose={replaceOnClose}
					managers={tree?.managers?.filter((item) => item._id !== user?._id)}
					replacementManager={replacementManager}
					setReplacementManager={setReplacementManager}
					type='userStatus'
					handleProceed={() => {
						replaceOnClose();
						handleToggle();
					}}
				/>
			)}

			{passwordIsOpen && (
				<PasswordPermission
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
		</>
	);
};

export default StatusToggle;
