import { Button, Spinner } from "@chakra-ui/react";
import ReleaseLeadModal from "components/Permission/ReleaseLeadModal";
import { useState } from "react";
import { toast } from "react-toastify";
import { putApi } from "services/api";

const ReleaseLead = ({ isReleased, role, leadId, setTotalLeads, setData }) => {
	const shouldRenderButton =
		(isReleased && role === "Manager") || role === "Agent";

	const [isLoading, setIsLoading] = useState(false);

	const [isOpen, setIsOpen] = useState(false);

	const handleRelease = async () => {
		try {
			setIsLoading(true);
			setIsOpen(false);
			const { data } = await putApi(`api/lead/release/${leadId}`);

			if (data.status === "success") {
				setData((prevData) => {
					// Reset and update the target row's fields
					const updatedData = prevData.map((row) =>
						row._id === leadId
							? {
									...row,
									leadType: data.result.leadType,
									isReleased: data.result.isReleased,
									managerAssigned: data.result.managerAssigned,
									agentAssigned: data.result.agentAssigned,
								}
							: row
					);

					let filteredData;
					// Filter out rows with null managerAssigned or agentAssigned
					if (role === "Manager") {
						filteredData = updatedData.filter(
							(row) => row.managerAssigned !== null
						);
					} else if (role === "Agent") {
						filteredData = updatedData.filter(
							(row) => row.agentAssigned !== null
						);
					}

					return filteredData;
				});
				setTotalLeads((prevValue) => prevValue - 1);
			}

			toast.success("Lead released successfully");
		} catch (error) {
			console.error(error);
			toast.error("Failed to release lead" || error.data.message);
		} finally {
			setIsLoading(false);
		}
	};

	return shouldRenderButton ? (
		<>
			{isOpen && (
				<ReleaseLeadModal
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					onConfirm={handleRelease}
				/>
			)}
			<Button
				bg="brand.500"
				color="white"
				size="sm"
				variant="solid"
				px={4}
				py={2}
				borderRadius="full"
				onClick={() => setIsOpen(true)}
				_hover={{
					bg: "brand.600",
				}}
				_active={{
					bg: "brand.700",
				}}
				isDisabled={isLoading}
			>
				{isLoading ? <Spinner size="sm" /> : "Release"}
			</Button>
		</>
	) : (
		"-"
	);
};

export default ReleaseLead;
