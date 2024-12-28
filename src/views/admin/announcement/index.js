import {
	Box,
	Text,
	Textarea,
	Button,
	useRadioGroup,
	HStack,
	Select,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { getApi } from "services/api";
import { toast } from "react-toastify";
import RadioCard from "./components/RadioCard";
import keys from "config/keys";

// const Announcements = () => {
// 	const [message, setMessage] = useState("");
// 	const [selectedRole, setSelectedRole] = useState("");
// 	const [receiverIds, setReceiverIds] = useState([]);
// 	const [loading, setLoading] = useState(false);

// 	const user = JSON.parse(localStorage.getItem("user"));

// 	const handleRoleChange = async (selectedRole) => {
// 		try {
// 			setSelectedRole(selectedRole);

// 			let apiUrl = "";

// 			// Determine API URL based on selected role
// 			switch (selectedRole) {
// 				case "all":
// 					apiUrl = "api/v2/user/hierarchy?type=all";
// 					break;
// 				case "managers":
// 					apiUrl = "api/v2/user/hierarchy?type=managers";
// 					break;
// 				case "agents":
// 					apiUrl = "api/v2/user/hierarchy?type=agents";
// 					break;
// 				// case "team":
// 				// 	apiUrl = `api/v2/user/hierarchy?managerId=${managerId}`;
// 				// 	break;
// 				default:
// 					return;
// 			}

// 			// Call the API
// 			const { data } = await getApi(user.role === "superAdmin" && apiUrl);

// 			// Filter out the current user's ID
// 			const filteredIds = data.doc.filter((item) => user._id !== item);

// 			// Update state
// 			setReceiverIds(filteredIds);
// 		} catch (error) {
// 			console.error("Failed to fetch data:", error);
// 			toast.error("Failed to fetch receiver IDs.");
// 		}
// 	};

// 	const handleSend = async (e) => {
// 		e.preventDefault();
// 		if (message.trim() && selectedRole) {
// 			try {
// 				setLoading(true);

// 				if (receiverIds.length > 0) {
// 					await axios.post("https://pystage.weeam.info/announcements", {
// 						message,
// 						receiver_ids: receiverIds,
// 					});
// 				} else toast.error("Please Select again");

// 				// webSocketService.socket.onmessage = (event) => {
// 				// 	const message = JSON.parse(event.data);
// 				// 	console.log(message);

// 				// 	// Check if the message type is for announcements
// 				// 	if (message.type === 1) {
// 				// 		console.log("Announcement message received added");
// 				// 		// Dispatch action to add the announcement to Redux store
// 				// 		dispatch(addAnnouncement(message.data));
// 				// 		// setIsModalOpen(true);
// 				// 	}
// 				// };

// 				toast.success("Announcement sent successfully.");

// 				setLoading(false);
// 				setMessage(""); // Clear the input field after sending
// 				setSelectedRole(""); // Reset checkboxes
// 			} catch (err) {
// 				console.log(err);
// 				toast.error("Failed to send announcement.");
// 			}
// 		} else {
// 			toast.error("Please fill in the message and select at least one role.");
// 		}
// 	};

// 	return (
// 		<Box
// 			p={6}
// 			maxW="800px"
// 			mx="auto"
// 			borderWidth={1}
// 			borderRadius="md"
// 			shadow="md"
// 		>
// 			<Text as="h3" fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
// 				Announcement
// 			</Text>
// 			<form onSubmit={handleSend}>
// 				<Textarea
// 					placeholder="Type your announcement message..."
// 					value={message}
// 					onChange={(e) => setMessage(e.target.value)}
// 					mb={4}
// 					size="lg"
// 					resize="vertical"
// 					focusBorderColor="orange.200"
// 				/>
// 				<Text fontWeight="bold" mb={2}>
// 					Send to:
// 				</Text>
// 				<RadioGroup
// 					colorScheme="brand"
// 					value={selectedRole}
// 					onChange={(value) => {
// 						handleRoleChange(value); // Trigger API call on selection change
// 					}}
// 				>
// 					<VStack align="start" spacing={3} mb={4}>
// 						<Radio value="all">All</Radio>
// 						<Radio value="managers">Managers</Radio>
// 						<Radio value="agents">Agents</Radio>
// 					</VStack>
// 				</RadioGroup>
// 				<Button
// 					colorScheme="brand"
// 					color="white"
// 					w="full"
// 					type="submit"
// 					isDisabled={!message.trim()}
// 				>
// 					{loading ? "Sending Announcement..." : "Send Announcement"}
// 				</Button>
// 			</form>
// 		</Box>
// 	);
// };
const Announcements = () => {
	const user = JSON.parse(localStorage.getItem("user"));

	const [message, setMessage] = useState("");
	const [selectedRole, setSelectedRole] = useState("");
	const [receiverIds, setReceiverIds] = useState([]);
	const [managerList, setManagerList] = useState([]);
	const [agentsList, setAgentsList] = useState([]);
	const [selectedManager, setSelectedManager] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleRoleChange = async (selectedRole) => {
		try {
			setSelectedRole(selectedRole);
			let apiUrl = "";

			switch (selectedRole) {
				case "all":
					apiUrl = "api/v2/user/hierarchy?type=all";
					break;
				case "managers":
					apiUrl = "api/v2/user/hierarchy?type=managers";
					break;
				case "agents":
					apiUrl = "api/v2/user/hierarchy?type=agents";
					break;
				default:
					return;
			}

			const { data } = await getApi(user.role === "superAdmin" && apiUrl);

			if (data) {
				let newReceiverIds = [];

				if (selectedRole === "managers") {
					setManagerList(data.doc || []);
					newReceiverIds = data.doc.map((manager) => manager._id);
				} else if (selectedRole === "agents") {
					setAgentsList(data.doc || []);
					newReceiverIds = data.doc.map((agent) => agent._id);
				} else if (selectedRole === "all") {
					newReceiverIds = data.doc.filter((item) => user._id !== item);
				}

				// Replace old receiverIds with new data
				setReceiverIds(newReceiverIds);
				console.log({ newReceiverIds });
			}
		} catch (error) {
			console.error("Failed to fetch data:", error);
			toast.error("Failed to fetch receiver IDs.");
		}
	};

	const handleManager = async (e) => {
		const selectedValue = e.target.value;

		if (selectedValue === "allManagers") {
			// If "All Managers" is selected, set receiver IDs to all managers
			const managerReceiverIds = managerList?.map((manager) => manager._id);

			console.log({ managerReceiverIds });
			setReceiverIds(managerReceiverIds);
			setSelectedManager(null); // Clear specific manager selection
		} else {
			setSelectedManager(selectedValue);

			if (selectedValue) {
				const apiUrl = `api/v2/user/hierarchy?managerId=${selectedValue}`;
				const { data } = await getApi(user.role === "superAdmin" && apiUrl);

				if (data.doc.length > 0) {
					const updatedReceiverIds = [...data.doc, selectedValue];
					console.log({ updatedReceiverIds });
				} else setReceiverIds(selectedValue);
			}
		}
	};

	const handleSend = async (e) => {
		e.preventDefault();
		if (message.trim() && selectedRole) {
			try {
				setLoading(true);

				console.log("ids: ", receiverIds);

				if (receiverIds.length > 0) {
					await axios.post(`${keys.socketUrl}/announcements`, {
						message,
						receiver_ids: receiverIds,
					});
				} else {
					toast.error("Please select again.");
				}

				toast.success("Announcement sent successfully.");
				setLoading(false);
				setMessage(""); // Clear the input field after sending
				setSelectedRole(""); // Reset checkboxes
				setSelectedManager(null); // Clear specific manager selection
			} catch (err) {
				console.log(err);
				toast.error("Failed to send announcement.");
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
		>
			<Text as="h3" fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
				Announcement
			</Text>
			<form onSubmit={handleSend}>
				<Textarea
					placeholder="Type your announcement message..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					mb={4}
					size="lg"
					resize="vertical"
					focusBorderColor="orange.200"
					backgroundColor="white"
				/>
				<Text fontWeight="bold" mb={2}>
					Send to:
				</Text>
				<HStack {...group} spacing={4} mb={4}>
					{options.map((value) => {
						const radio = getRadioProps({ value });
						return (
							<RadioCard key={value} {...radio}>
								{value.charAt(0).toUpperCase() + value.slice(1)}
							</RadioCard>
						);
					})}
					{selectedRole === "managers" && (
						<Select
							placeholder="Select a Manager"
							onChange={handleManager}
							mb={4}
						>
							<option value="allManagers">All Managers</option>
							{managerList.map((manager) => (
								<option color="black" key={manager._id} value={manager._id}>
									{manager.name}
								</option>
							))}
						</Select>
					)}
				</HStack>

				<Button
					colorScheme="brand"
					color="white"
					w="full"
					type="submit"
					isDisabled={!message.trim()}
				>
					{loading ? "Sending Announcement..." : "Send Announcement"}
				</Button>
			</form>
		</Box>
	);
};

export default Announcements;
