import { Select } from "@chakra-ui/react";
import BoxLoading from "components/shared/BoxLoading";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { putApi } from "services/api";

const RenderEStatus = ({ id, cellValue, user }) => {
	const [value, setValue] = useState("");
	const [loading, setLoading] = useState(false);

	const isSuperAdmin = user.role === "superAdmin";

	const setStatusData = async (e) => {
		try {
			const data = {
				eLeadStatus: e.target.value,
			};

			if (data.eLeadStatus === "deal" && !isSuperAdmin) {
				return toast.error("Only a Super Admin can change the deal status.");
			}

			setLoading(true);
			let response = await putApi(`api/lead/update/e-status/${id}`, data);
			if (response.status === 200) {
				setValue(data.eLeadStatus);
				toast.success("Extra Lead Status Updated!");
			}
		} catch (e) {
			console.log(e);
			toast.error("Something went wrong!");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setValue(cellValue || "");
	}, [cellValue, id]);

	return loading ? (
		<BoxLoading />
	) : (
		<Select
			defaultValue=""
			onChange={setStatusData}
			height={7}
			width={150}
			value={value || ""}
			style={{
				fontSize: "14px",
				backgroundColor: "#faf5ea",
				color: "#bb892a",
				border: "1px solid #ebd3a6",
				padding: "4px 8px",
			}}
		>
			<option value="" disabled style={{ color: "#999" }}>
				Choose E.Status
			</option>
			<option value="interested">Interested</option>
			<option value="not-interested">Not interested</option>
			<option value="deal">Deal</option>
			<option value="qualified">Qualified</option>
			<option value="junk">Junk</option>
			<option value="change-agent">Change Agent</option>
		</Select>
	);
};

export default RenderEStatus;
