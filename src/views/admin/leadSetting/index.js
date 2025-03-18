import React, { useEffect, useState } from "react";
import LeadLimitForm from "./LeadSettingForm";
import { Box, Button, Heading, Spinner } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { getApi } from "services/api";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

const LeadSetting = () => {
	const [leadLimit, setLeadLimit] = useState("");
	const [isFetching, setIsFetching] = useState(false);

	// Fetch the lead settings when the component mounts
	useEffect(() => {
		setIsFetching(true);
		const fetchLeadSettings = async () => {
			try {
				const res = await getApi("api/lead-settings");
				if (res.status === 200) {
					// Set the initial input value
					setLeadLimit(res.data.doc.agentLeadLimit || 0);
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

	return isFetching ? (
		<Spinner />
	) : (
		<Box p={6}>
			<Button
				as={Link}
				to="/admin-setting"
				leftIcon={<BiArrowBack />}
				width="fit"
				bg="gray.100"
				color="gray.700"
				_hover={{ shadow: "md" }}
				rounded="full"
				padding="8px 16px"
				textAlign="center"
				mb="20px"
			>
				Go Back
			</Button>
			<Heading as="h1" size="md" textAlign="left" mb="4" color="brand.600">
				Lead Settings
			</Heading>
			<LeadLimitForm leadLimit={leadLimit} setLeadLimit={setLeadLimit} />
		</Box>
	);
};

export default LeadSetting;
