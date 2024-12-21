import {
	Box,
	CircularProgress,
	Select,
	useColorModeValue,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { putApi } from "services/api";

const RenderAgent = ({
	value,
	managerAssigned,
	leadID,
	fetchData,
	displaySearchData,
	setSearchedData,
	setData,
}) => {
	const [AgentSelected, setAgentSelected] = useState(value || "");
	const tree = useSelector((state) => state.user.tree);
	const [loading, setLoading] = useState(false);

	const textColor = useColorModeValue("black", "white");

	// Filter agents related to the assigned manager
	const agents = useMemo(() => {
		return tree?.agents?.[`manager-${managerAssigned}`] || [];
	}, [managerAssigned, tree]);

	const handleChangeAgent = async (e) => {
		try {
			const data = {
				agentAssigned: e.target.value,
				leadStatus: "reassigned",
			};

			setLoading(true);

			await putApi(`api/lead/edit/${leadID}`, data);
			toast.success("Agent updated successfuly");
			setAgentSelected(data.agentAssigned || "");

			if (displaySearchData) {
				setSearchedData((prevData) => {
					const newData = [...prevData];

					const updateIdx = newData.findIndex(
						(l) => l._id.toString() === leadID
					);
					if (updateIdx !== -1) {
						newData[updateIdx].agentAssigned = data.agentAssigned;
					}
					return newData;
				});
			} else {
				setData((prevData) => {
					const newData = [...prevData];

					const updateIdx = newData.findIndex(
						(l) => l._id.toString() === leadID
					);
					if (updateIdx !== -1) {
						newData[updateIdx].agentAssigned = data.agentAssigned;
					}
					return newData;
				});
			}
			// fetchData();
		} catch (error) {
			console.log(error);
			toast.error("Failed to update the agent");
		}
		setLoading(false);
	};

	if (agents?.length) {
		return loading ? (
			<Box
				border={"1px solid #eee"}
				borderRadius={"4px"}
				padding={"3"}
				display={"flex"}
				alignItems={"center"}
			>
				<p style={{ marginRight: 8 }}>Updating</p>{" "}
				<CircularProgress size={4} isIndeterminate />
			</Box>
		) : (
			<Select
				placeholder="No Agent"
				onInput={handleChangeAgent}
				value={AgentSelected === null ? "" : AgentSelected}
				style={{
					color: !AgentSelected ? "grey" : textColor,
				}}
			>
				{agents?.map((agent) => (
					<option key={agent?._id?.toString()} value={agent?._id?.toString()}>
						{agent?.firstName + " " + agent?.lastName}
					</option>
				))}
			</Select>
		);
	} else {
		return <p style={{ textAlign: "center" }}>No agents</p>;
	}
};

// const RenderAgent = ({
// 	value,
// 	managerAssigned,
// 	leadID,
// 	updateLeadData,
// 	displaySearchData,
// 	setSearchedData,
// 	setData,
// }) => {
// 	const [AgentSelected, setAgentSelected] = useState(value || "");
// 	const [loading, setLoading] = useState(false);
// 	const tree = useSelector((state) => state.user.tree);
// 	const textColor = useColorModeValue("black", "white");

// 	// Filter agents related to the assigned manager
// 	const agents = useMemo(() => {
// 		return tree?.agents?.[`manager-${managerAssigned}`] || [];
// 	}, [managerAssigned, tree]);

// 	// Handle agent selection change
// 	const handleChangeAgent = async (event) => {
// 		const agentAssigned = event.target.value;

// 		try {
// 			setLoading(true);

// 			const data = { agentAssigned, leadStatus: "reassigned" };
// 			await putApi(leadID, data);

// 			toast.success("Agent updated successfully");
// 			setAgentSelected(agentAssigned);

// 			// Update data in the appropriate list
// 			const updateData = (prevData) => {
// 				const updatedData = [...prevData];
// 				const idx = updatedData.findIndex(
// 					(item) => item._id.toString() === leadID
// 				);
// 				if (idx !== -1) {
// 					updatedData[idx].agentAssigned = agentAssigned;
// 				}
// 				return updatedData;
// 			};

// 			displaySearchData ? setSearchedData(updateData) : setData(updateData);
// 		} catch (error) {
// 			console.error("Failed to update agent:", error);
// 			toast.error("Failed to update the agent");
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return loading ? (
// 		<Box
// 			border="1px solid #eee"
// 			borderRadius="4px"
// 			padding="3"
// 			display="flex"
// 			alignItems="center"
// 		>
// 			<p style={{ marginRight: 8 }}>Updating</p>
// 			<CircularProgress size={4} isIndeterminate />
// 		</Box>
// 	) : agents.length ? (
// 		<Select
// 			placeholder="Select Agent"
// 			onChange={handleChangeAgent}
// 			value={AgentSelected}
// 			style={{ color: AgentSelected ? textColor : "grey" }}
// 		>
// 			{agents.map((agent) => (
// 				<option key={agent._id} value={agent._id}>
// 					{`${agent.firstName} ${agent.lastName}`}
// 				</option>
// 			))}
// 		</Select>
// 	) : (
// 		<p style={{ textAlign: "center" }}>No agents</p>
// 	);
// };

export default RenderAgent;
