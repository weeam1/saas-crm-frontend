import {
	Box,
	Text,
	Textarea,
	Button,
	useRadioGroup,
	HStack,
	Icon,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getApi } from "services/api";
import { toast } from "react-toastify";
import keys from "config/keys";

import RadioCard from "./RadioCard";
import { MdSend } from "react-icons/md";
import MessageSuccessModal from "./MessageSuccessModal";
import SelectManager from "./SelectManager";
import useFetchUserHierarchy from "hooks/useFetchUserHierarchy";

const CreateAnnouncement = () => {
	const user = JSON.parse(localStorage.getItem("user"));

	const { allUsers, managers, agents } = useFetchUserHierarchy(user);

	const isManager = user?.roles[0]?.roleName === "Manager";
	const isSuperAdmin = user.role === "superAdmin";

	const [message, setMessage] = useState("");
	const [selectedRole, setSelectedRole] = useState("");
	const [receiverIds, setReceiverIds] = useState([]);
	const [managerList, setManagerList] = useState([]);
	// const [agentsList, setAgentsList] = useState([]);
	const [selectedManager, setSelectedManager] = useState(null);
	const [loading, setLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [onlineUsers, setOnlineUsers] = useState(0);
	const [offlineUsers, setOfflineUsers] = useState(0);

	// const handleRoleChange = async (selectedRole) => {
	// 	try {
	// 		setSelectedRole(selectedRole);
	// 		let apiUrl = "";

	// 		switch (selectedRole) {
	// 			case "all":
	// 				apiUrl = "api/v2/user/hierarchy?type=all";
	// 				break;
	// 			case "managers":
	// 				apiUrl = "api/v2/user/hierarchy?type=managers";
	// 				break;
	// 			case "agents":
	// 				apiUrl = "api/v2/user/hierarchy?type=agents";
	// 				break;
	// 			default:
	// 				return;
	// 		}

	// 		const { data } = await getApi(user.role === "superAdmin" && apiUrl);

	// 		if (data) {
	// 			let newReceiverIds = [];

	// 			if (selectedRole === "managers") {
	// 				setManagerList(data.doc || []);
	// 			} else if (selectedRole === "agents") {
	// 				// setAgentsList(data.doc || []);
	// 				newReceiverIds = data.doc || [];
	// 			} else if (selectedRole === "all") {
	// 				newReceiverIds = data.doc.filter((item) => user._id !== item);
	// 			}

	// 			// Replace old receiverIds with new data
	// 			setReceiverIds(newReceiverIds);
	// 			console.log({ newReceiverIds });
	// 		}
	// 	} catch (error) {
	// 		console.error("Failed to fetch data:", error);
	// 		toast.error("Failed to fetch receiver IDs.");
	// 	}
	// };

	useEffect(() => {
		if (isManager) {
			fetchMangerAgents(user._id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isManager]);

	const fetchMangerAgents = async (selectedValue = "") => {
		try {
			// Fetch the hierarchy data for the selected manager
			const apiUrl = `api/v2/user/hierarchy?managerId=${selectedValue}`;
			const { data } = await getApi((isManager || isSuperAdmin) && apiUrl);

			if (data.results > 0) {
				const managerAgentsList = data?.doc?.map((agent) => agent._id);
				// If there are results, include the manager's own ID as well
				const updatedReceiverIds = isManager
					? [...managerAgentsList]
					: [...managerAgentsList, selectedValue];

				setReceiverIds(updatedReceiverIds);
				console.log({ receiverIds }); // Update the state with new receiver IDs
				setSelectedRole("Team");
			} else {
				// If no results, clear the receiver IDs (or just select the manager)
				setReceiverIds([selectedValue]);
			}
		} catch (error) {
			// Handle any errors that occur during the API call
			console.error("Error fetching manager hierarchy:", error);
			// Optionally, reset or update state in case of an error
			setReceiverIds([]);
		}
	};

	const handleRoleChange = (selectedRole) => {
		try {
			setSelectedRole(selectedRole);

			let newReceiverIds = [];

			switch (selectedRole) {
				case "managers":
					setManagerList(managers || []);
					newReceiverIds = managers.map((manager) => manager._id); // Extract manager IDs
					break;

				case "agents":
					// setAgentsList(agents || []);
					newReceiverIds = agents.map((agent) => agent._id); // Extract agent IDs
					break;

				case "all":
					newReceiverIds = allUsers
						.filter((userItem) => user._id !== userItem._id) // Exclude the current user
						.map((userItem) => userItem._id); // Extract all user IDs
					break;

				default:
					return;
			}

			setReceiverIds(newReceiverIds); // Update state with new receiver IDs
			console.log({ newReceiverIds });
		} catch (error) {
			console.error("Failed to handle role change:", error);
			toast.error("An error occurred while processing the role change.");
		}
	};

	const handleManager = async (e) => {
		const selectedValue = e.target.value;
		// Reset receiverIds to an empty array before making any updates
		setReceiverIds([]);

		// If "All Managers" is selected, set receiver IDs to all managers
		if (selectedValue === "allManagers") {
			const managerReceiverIds = managerList?.map((manager) => manager._id);
			setReceiverIds(managerReceiverIds); // Set all manager IDs
			setSelectedManager(selectedValue); // Update the selected manager state
		} else {
			fetchMangerAgents(selectedValue);
			setSelectedManager(selectedValue); // Set the selected manager
		}
	};

	const handleSend = async (e) => {
		e.preventDefault();
		if (message.trim()) {
			try {
				setLoading(true);
				setOnlineUsers(0);
				setOfflineUsers(0);

				if (receiverIds.length > 0) {
					const announcementData = {
						message,
						receiver_ids: receiverIds,
						user_id: user._id,
						type: selectedRole,
					};

					console.log(announcementData);

					const { data } = await axios.post(
						`${keys.socketUrl}/announcements`,
						announcementData
					);

					if (data) {
						setOfflineUsers(data?.disconnected_users?.length || 0);
						const online =
							receiverIds.length - data?.disconnected_users?.length || 0;
						setOnlineUsers(online);
						setIsModalOpen(true); // Open the success modal
						setSelectedManager(null); // Clear specific manager selection
						setSelectedRole(""); // Reset checkboxes
						setMessage(""); // Clear the input field after sending
					}
				} else {
					toast.error("Please select the recivers again.");
				}
			} catch (err) {
				console.log(err);
				toast.error("Failed to send announcement.");
			} finally {
				setLoading(false);
			}
		} else {
			toast.error("Please fill in the message and select at least one role.");
		}
	};

	const options = ["all", "managers", "agents"];
	const { getRootProps, getRadioProps } = useRadioGroup({
		name: "roles",
		value: selectedRole,
		onChange: handleRoleChange,
	});

	const group = getRootProps();

	return (
		<Box
			p={6}
			maxW="800px"
			mx="auto"
			borderWidth={1}
			borderRadius="md"
			shadow="md"
			background="white"
		>
			<Text as="h3" fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
				Announcement
			</Text>
			<form onSubmit={handleSend}>
				<Textarea
					placeholder="Type your message..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					mb={{ base: 2, md: 4 }} // Adjust margin based on screen size
					size="lg"
					height="36"
					resize="vertical"
					focusBorderColor="orange.200"
					backgroundColor="gray.100"
				/>

				{isSuperAdmin && (
					<>
						<Text fontWeight="bold" mb={{ base: 1, md: 2 }}>
							Send to:
						</Text>
						<HStack
							{...group}
							spacing={{ base: 2, md: 4 }} // Adjust spacing for different screen sizes
							mb={{ base: 2, md: 4 }} // Adjust margin based on screen size
							wrap="wrap" // Allow items to wrap on smaller screens
							gap="2"
						>
							{options.map((value) => {
								const radio = getRadioProps({ value });
								return (
									<RadioCard key={value} {...radio}>
										{value.charAt(0).toUpperCase() + value.slice(1)}
									</RadioCard>
								);
							})}
							<SelectManager
								selectedRole={selectedRole}
								managerList={managerList}
								handleManager={handleManager}
							/>
						</HStack>
					</>
				)}

				{isManager && (
					<Text mb={{ base: 1, md: 3 }} color="gray.500">
						Note: Announcement sent to all agents.
					</Text>
				)}

				<Button
					colorScheme="brand"
					color="white"
					w={{ base: "full", md: "auto" }} // Full width on smaller screens
					px={{ base: 4, md: 6 }} // Adjust padding based on screen size
					type="submit"
					isDisabled={
						!message.trim() ||
						(!isManager && !selectedRole) ||
						(selectedRole === "managers" && !selectedManager)
					}
					leftIcon={<Icon as={MdSend} />}
				>
					{loading ? "Sending..." : "Send"}
				</Button>
			</form>

			{/* Success Modal */}
			<MessageSuccessModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onlineUsers={onlineUsers}
				offlineUsers={offlineUsers}
			/>
		</Box>
	);
};

export default CreateAnnouncement;
