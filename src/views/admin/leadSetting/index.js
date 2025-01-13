import React from "react";
import LeadLimitForm from "./LeadSettingForm";
import { Box, Heading } from "@chakra-ui/react";

const LeadSetting = () => {
	return (
		<Box p={6}>
			<Heading as="h1" size="md" textAlign="left" mb="4" color="brand.600">
				Lead Settings
			</Heading>
			<LeadLimitForm />
		</Box>
	);
};

export default LeadSetting;
