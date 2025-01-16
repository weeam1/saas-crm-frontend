import { Select, Text, useColorModeValue } from "@chakra-ui/react";
import { fetchAgentLeadsSats } from "api";
import ErrorLeadLimitMessage from "components/Message/ErrorLeadLimitMessage";
import BoxLoading from "components/shared/BoxLoading";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { putApi } from "services/api";

// const RenderAgent = ({
// 	value,
// 	managerAssigned,
// 	leadID,
// 	displaySearchData,
// 	setSearchedData,
// 	setData,
// 	updateRowStatus,
// }) => {
// 	const [AgentSelected, setAgentSelected] = useState(value || "");
// 	const tree = useSelector((state) => state.user.tree);
// 	const [loading, setLoading] = useState(false);

// 	const textColor = useColorModeValue("black", "white");

// 	// Filter agents related to the assigned manager
// 	const agents = useMemo(() => {
// 		return tree?.agents?.[`manager-${managerAssigned}`] || [];
// 	}, [managerAssigned, tree]);

// 	const handleChangeAgent = async (e) => {
// 		try {
// 			const data = {
// 				agentAssigned: e.target.value,
// 				// leadStatus: "reassigned",
// 			};

// 			setLoading(true);
// 			const res = await putApi(`api/lead/edit/${leadID}`, data);

// 			if (res.status === 200) {
// 				updateRowStatus(leadID, res.data.leadStatus);
// 				toast.success("Agent updated successfuly");
// 			}

// 			if (displaySearchData) {
// 				setSearchedData((prevData) => {
// 					const newData = [...prevData];

// 					const updateIdx = newData.findIndex(
// 						(l) => l._id.toString() === leadID
// 					);
// 					if (updateIdx !== -1) {
// 						newData[updateIdx].agentAssigned = data.agentAssigned;
// 					}
// 					return newData;
// 				});
// 			} else {
// 				setData((prevData) => {
// 					const newData = [...prevData];

// 					const updateIdx = newData.findIndex(
// 						(l) => l._id.toString() === leadID
// 					);
// 					if (updateIdx !== -1) {
// 						newData[updateIdx].agentAssigned = data.agentAssigned;
// 					}
// 					return newData;
// 				});
// 			}
// 			// fetchData();
// 		} catch (error) {
// 			console.log(error);
// 			toast.error("Failed to update the agent");
// 		}
// 		setLoading(false);
// 	};

// 	// setAgentSelected(data.agentAssigned);

// 	useEffect(() => {
// 		setAgentSelected(value);
// 	}, [value]);

// 	if (agents?.length) {
// 		return loading ? (
// 			<BoxLoading />
// 		) : (
// 			<Select
// 				placeholder="No Agent"
// 				onInput={handleChangeAgent}
// 				value={AgentSelected === null ? "" : AgentSelected}
// 				style={{
// 					color: !AgentSelected ? "grey" : textColor,
// 				}}
// 				width={200}
// 				size="sm"
// 			>
// 				{agents?.map((agent) => (
// 					<option key={agent?._id?.toString()} value={agent?._id?.toString()}>
// 						{agent?.firstName + " " + agent?.lastName}
// 					</option>
// 				))}
// 			</Select>
// 		);
// 	} else {
// 		return <p style={{ textAlign: "center" }}>No agents</p>;
// 	}
// };

const RenderAgent = ({
	value,
	managerAssigned,
	leadID,
	displaySearchData,
	setSearchedData,
	setData,
	updateRowStatus,
}) => {
	const [AgentSelected, setAgentSelected] = useState("");
	const tree = useSelector((state) => state.user.tree);
	const [loading, setLoading] = useState(false);

	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [errorLeadData, setErrorLeadData] = useState({});

	const textColor = useColorModeValue("black", "white");

	// Filter agents related to the assigned manager
	const agents = useMemo(() => {
		return tree?.agents?.[`manager-${managerAssigned}`] || [];
	}, [managerAssigned, tree]);

	// const handleChangeAgent = async (e) => {
	// 	try {
	// 		const data = {
	// 			agentAssigned: e.target.value,
	// 			// leadStatus: "reassigned",
	// 		};

	// 		setLoading(true);
	// 		const res = await putApi(`api/lead/edit/${leadID}`, data);

	// 		if (res.status === 200) {
	// 			updateRowStatus(leadID, res.data.leadStatus);
	// 			toast.success("Agent updated successfuly");
	// 		}

	// 		if (displaySearchData) {
	// 			setSearchedData((prevData) => {
	// 				const newData = [...prevData];

	// 				const updateIdx = newData.findIndex(
	// 					(l) => l._id.toString() === leadID
	// 				);
	// 				if (updateIdx !== -1) {
	// 					newData[updateIdx].agentAssigned = data.agentAssigned;
	// 				}
	// 				return newData;
	// 			});
	// 		} else {
	// 			setData((prevData) => {
	// 				const newData = [...prevData];

	// 				const updateIdx = newData.findIndex(
	// 					(l) => l._id.toString() === leadID
	// 				);
	// 				if (updateIdx !== -1) {
	// 					newData[updateIdx].agentAssigned = data.agentAssigned;
	// 				}
	// 				return newData;
	// 			});
	// 		}
	// 		// fetchData();
	// 	} catch (error) {
	// 		console.log(error);
	// 		toast.error("Failed to update the agent");
	// 	}
	// 	setLoading(false);
	// };

	// setAgentSelected(data.agentAssigned);

	const handleChangeAgent = async (e) => {
		try {
			setLoading(true);

			const data = {
				agentAssigned: e.target.value,
				// leadStatus: "reassigned", // Uncomment if lead status should change
			};

			const stats = await fetchAgentLeadsSats(data.agentAssigned);

			if (!stats.canAddLeads) {
				setErrorLeadData(stats);
				setIsErrorModalOpen(true);
				setLoading(false);
				return;
			}

			const res = await putApi(`api/lead/edit/${leadID}`, data);

			if (res.status === 200) {
				// Call updateRowStatus with the updated status from the response
				updateRowStatus(leadID, res.data.leadStatus);

				toast.success("Agent updated successfully");

				// Update the corresponding data list (searched or default)
				const updateListData = (prevData) => {
					const newData = [...prevData];
					const updateIdx = newData.findIndex(
						(l) => l._id.toString() === leadID
					);
					if (updateIdx !== -1) {
						newData[updateIdx].agentAssigned = data.agentAssigned;
						newData[updateIdx].leadType = data.leadType || null;
						newData[updateIdx].isReleased = data.isReleased;
					}
					return newData;
				};

				if (displaySearchData) {
					setSearchedData(updateListData);
				} else {
					setData(updateListData);
				}
			}
		} catch (error) {
			console.error("Failed to update the agent:", error);
			toast.error("Agent not updated. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setAgentSelected(value);
	}, [value]);

	if (agents?.length) {
		return loading ? (
			<BoxLoading />
		) : (
			<>
				<Select
					placeholder="No Agent"
					onInput={handleChangeAgent}
					value={AgentSelected === null ? "" : AgentSelected}
					style={{
						color: !AgentSelected ? "grey" : textColor,
					}}
					width={200}
					size="sm"
				>
					{agents?.map((agent) => (
						<option key={agent?._id?.toString()} value={agent?._id?.toString()}>
							{agent?.firstName + " " + agent?.lastName}
						</option>
					))}
				</Select>
				{errorLeadData && (
					<ErrorLeadLimitMessage
						isOpen={isErrorModalOpen}
						onClose={() => setIsErrorModalOpen(false)}
						errorLeadData={errorLeadData}
					/>
				)}
			</>
		);
	} else {
		return (
			<Text color="gray.500" textAlign="center">
				No agent
			</Text>
		);
	}
};

export default RenderAgent;
