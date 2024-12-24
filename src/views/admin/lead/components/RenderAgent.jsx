import { Select, useColorModeValue } from "@chakra-ui/react";
import BoxLoading from "components/shared/BoxLoading";
import { useEffect, useMemo, useState } from "react";
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
				// leadStatus: "reassigned",
			};

			setLoading(true);
			await putApi(`api/lead/edit/${leadID}`, data);
			toast.success("Agent updated successfuly");
			setAgentSelected(data.agentAssigned || "");

			fetchData();

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
			<BoxLoading />
		) : (
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
		);
	} else {
		return <p style={{ textAlign: "center" }}>No agents</p>;
	}
};

export default RenderAgent;
