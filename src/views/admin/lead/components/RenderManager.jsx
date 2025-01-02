import { Select, Text, useColorModeValue } from "@chakra-ui/react";
import BoxLoading from "components/shared/BoxLoading";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { putApi } from "services/api";

const RenderManager = ({
	id,
	isAdmin,
	value,
	leadID,
	fetchData,
	pageIndex,
	displaySearchData,
	setSearchedData,
	setData,
	updateRowStatus,
}) => {
	const [selectedManager, setSelectedManager] = useState(value || "");
	const [loading, setLoading] = useState(false);
	const tree = useSelector((state) => state.user.tree);

	const handleChangeManager = async (e) => {
		const managerAssigned = e.target.value;
		const dataObj = {
			managerAssigned: managerAssigned || "",
			agentAssigned: managerAssigned ? "" : undefined,
			// agentAssigned: "",
		};

		try {
			setLoading(true);
			const res = await putApi(`api/lead/edit/${leadID}`, dataObj);

			if (res.status === 200) {
				updateRowStatus(leadID, res.data.leadStatus);
				toast.success("Manager updated successfully");
			}

			// Update data in the corresponding list (searched or default)
			const updateListData = (prevData) => {
				const newData = [...prevData];
				const updateIdx = newData.findIndex((l) => l._id.toString() === leadID);
				if (updateIdx !== -1) {
					newData[updateIdx].managerAssigned = dataObj.managerAssigned;
					newData[updateIdx].agentAssigned = dataObj.agentAssigned || "";
				}
				return newData;
			};

			if (displaySearchData) {
				setSearchedData(updateListData);
			} else {
				setData(updateListData);
			}
		} catch (error) {
			console.error("Failed to update the manager:", error);
			toast.error("Failed to update the manager");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setSelectedManager(value);
	}, [value]);

	const textColor = useColorModeValue("black", "white");

	return loading ? (
		<BoxLoading />
	) : isAdmin ? (
		<Select
			value={selectedManager || ""}
			onChange={handleChangeManager}
			placeholder="No Manager"
			color={!selectedManager ? "gray.500" : textColor}
			width={180}
			size="sm"
		>
			{tree?.managers?.map((manager) => (
				<option key={manager?._id?.toString()} value={manager?._id?.toString()}>
					{`${manager?.firstName} ${manager?.lastName}`}
				</option>
			))}
		</Select>
	) : (
		<Text textStyle="sm">
			{selectedManager
				? `${
						tree?.managers?.find((m) => m._id === selectedManager)?.firstName
					} ${tree?.managers?.find((m) => m._id === selectedManager)?.lastName}`
				: "No Manager Assigned"}
		</Text>
	);
};

export default RenderManager;
