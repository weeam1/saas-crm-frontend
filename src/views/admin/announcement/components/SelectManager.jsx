"use client";

import { Select } from "@chakra-ui/react";

const SelectManager = ({ selectedRole, handleManager, managerList }) => {
	return (
		selectedRole === "managers" && (
			<Select
				size="md"
				width={{ base: "260px", md: "320px" }}
				placeholder="Select a Manager"
				onChange={handleManager}
			>
				<option value="allManagers">All Managers</option>
				{managerList.map((manager) => (
					<option key={manager._id} value={manager._id}>
						{manager.name}
					</option>
				))}
			</Select>
		)
	);
};

export default SelectManager;
