import {
	Box,
	Text,
	Textarea,
	Button,
	useRadioGroup,
	HStack,
	Select,
	Icon,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { getApi } from "services/api";
import { toast } from "react-toastify";
import keys from "config/keys";

import RadioCard from "./RadioCard";
import { MdSend } from "react-icons/md";
import MessageSuccessModal from "./MessageSuccessModal";

const CreateAnnouncement = () => {
	const user = JSON.parse(localStorage.getItem("user"));

	const [message, setMessage] = useState("");
	const [selectedRole, setSelectedRole] = useState("");
	const [receiverIds, setReceiverIds] = useState([]);
	const [managerList, setManagerList] = useState([]);
	// const [agentsList, setAgentsList] = useState([]);
	const [selectedManager, setSelectedManager] = useState(null);
	const [loading, setLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [res, setRes] = useState(null);

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
					// setAgentsList(data.doc || []);
					newReceiverIds = data.doc || [];
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

			setReceiverIds(managerReceiverIds);
			setSelectedManager(selectedValue);
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
				setRes(null);

				if (receiverIds.length > 0) {
					const { data } = await axios.post(`${keys.socketUrl}/announcements`, {
						message,
						receiver_ids: receiverIds,
					});

					// Update state and immediately log the response
					setRes(data);
				} else {
					toast.error("Please select again.");
				}

				// toast.success("Announcement sent successfully.");
				setLoading(false);
				setMessage(""); // Clear the input field after sending
				setSelectedRole(""); // Reset checkboxes
				setSelectedManager(null); // Clear specific manager selection
				setIsModalOpen(true); // Open the success modal
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
			background="white"
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
					height="36"
					resize="vertical"
					focusBorderColor="orange.200"
					backgroundColor="gray.100"
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
					w="auto"
					px={4}
					type="submit"
					isDisabled={
						!message.trim() ||
						!selectedRole ||
						(selectedRole === "managers" && !selectedManager)
					}
					leftIcon={<Icon as={MdSend} />}
				>
					{loading ? "Sending..." : "Send"}
				</Button>
			</form>

			{/* Success Modal */}
			{res && (
				<MessageSuccessModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					messageResponse={res}
				/>
			)}
		</Box>
	);
};

export default CreateAnnouncement;
