const { Button } = require("@chakra-ui/react");

const StateButton = ({
	state,
	currentState,
	setCurrentState,
	label,
	isSuperAdmin,
}) => {
	return (
		<Button
			onClick={() => setCurrentState(state)}
			sx={{
				backgroundColor: currentState === state ? "#B79045" : "white",
				color: currentState === state ? "white" : "inherit",
				_hover: {
					backgroundColor: currentState === state ? "#B79045" : "gray.100",
					shadow: "sm",
				},
				transition: "background-all 0.3s ease",
				fontSize: { base: "xs", md: "md" }, // 'xs' for small devices, 'md' for medium and up
				padding: { base: "4px 8px", md: "8px 16px" }, // Adjust padding for different sizes
			}}
		>
			{isSuperAdmin && state === "all_leads" ? "All Lead Requests" : label}
		</Button>
	);
};

export default StateButton;
