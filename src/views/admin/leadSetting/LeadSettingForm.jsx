import React, { useEffect, useState } from "react";
import {
	Input,
	Button,
	FormControl,
	FormLabel,
	Box,
	Spinner,
	Text,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { getApi, postApi } from "services/api";

const LeadLimitForm = () => {
	const [leadLimit, setLeadLimit] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isFetching, setIsFetching] = useState(false);

	// Fetch the lead settings when the component mounts
	useEffect(() => {
		setIsFetching(true);
		const fetchLeadSettings = async () => {
			try {
				const res = await getApi("api/lead-settings");
				if (res.status === 200) {
					// Set the initial input value
					setLeadLimit(res.data.doc.agentLeadLimit);
				}
			} catch (error) {
				console.error("Error fetching lead settings:", error);
				toast.error("Could not retrieve current lead settings.");
			} finally {
				setIsFetching(false);
			}
		};

		fetchLeadSettings();
	}, []);

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			const res = await postApi("api/lead-settings", {
				agentLeadLimit: leadLimit,
			});
			if (res.status === 200) {
				toast.success("Lead limit updated successfully.");
			}
		} catch (error) {
			console.error("Error updating lead limit:", error);
			toast.error("Could not update the lead limit.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (e) => {
		const newValue = e.target.value;
		if (newValue === "" || /^\d+$/.test(newValue)) {
			setLeadLimit(newValue === "" ? "" : Number(newValue));
		} else {
			toast.error("Please enter a valid number.");
		}
	};

	return isFetching ? (
		<Spinner size="sm" />
	) : (
		<Box
			p={6}
			bg="white"
			borderRadius="md"
			boxShadow="md"
			maxWidth="600px"
			mx="auto"
		>
			<Text size="md" textAlign="center" fontWeight="bold" mb={4}>
				Update Agent Lead Limit
			</Text>

			<form onSubmit={handleSubmit}>
				<FormControl id="agentLeadLimit" isRequired>
					<FormLabel>Agent Lead Limit</FormLabel>
					<Input
						type="number"
						value={leadLimit}
						onChange={handleInputChange}
						// onChange={(e) => setLeadLimit(Number(e.target.value))}
						placeholder="Enter new lead limit"
						bg="gray.50"
						_focus={{ bg: "white", borderColor: "brand.400" }}
						borderColor="gray.300"
					/>
				</FormControl>
				<Button
					mt={4}
					colorScheme="brand"
					type="submit"
					width="full"
					isLoading={isLoading}
				>
					Save
				</Button>
			</form>
		</Box>
	);
};

export default LeadLimitForm;
