import { Select, Text, useColorModeValue } from "@chakra-ui/react";
import BoxLoading from "components/shared/BoxLoading";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { putApi } from "services/api";

const RenderManager = ({
	isAdmin,
	value,
	leadID,
	fetchData,
	pageIndex,
	displaySearchData,
	setSearchedData,
	setData,
}) => {
	const [selectedManager, setSelectedManager] = useState("");
	const [loading, setLoading] = useState(false);
	const tree = useSelector((state) => state.user.tree);

	const handleChangeManager = async (e) => {
		const managerAssigned = e.target.value;
		const dataObj = {
			managerAssigned: managerAssigned || "",
			leadStatus: "reassigned",
			agentAssigned: managerAssigned ? "" : undefined,
		};

		try {
			setLoading(true);
			await putApi(`api/lead/edit/${leadID}`, dataObj);
			toast.success("Manager updated successfully");

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
			placeholder="No Manager Selected"
			color={!selectedManager ? "gray.500" : textColor}
			width={200}
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
