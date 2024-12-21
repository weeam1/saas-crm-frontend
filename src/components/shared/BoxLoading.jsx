import { Box, CircularProgress, Text } from "@chakra-ui/react";
import React from "react";

const BoxLoading = () => {
	return (
		<Box
			border="1px solid #eee"
			borderRadius="4px"
			display="flex"
			padding={"4px"}
			alignItems="center"
			size="sm"
		>
			<Text margin="4px">Updating...</Text>
			<CircularProgress size="5" isIndeterminate />
		</Box>
	);
};

export default BoxLoading;
