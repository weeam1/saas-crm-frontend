import {
	Button,
	Checkbox,
	Flex,
	Grid,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
	Text,
} from "@chakra-ui/react";
import React, { useMemo } from "react";

const ManageColumnModal = (props) => {
	const {
		setManageColumns,
		manageColumns,
		handleColumnClear,
		toggleColumnVisibility,
		selectedColumns,
		dynamicColumns,
		isLoding,
		saveManageCols,
	} = props;

	const memoizedColumns = useMemo(() => dynamicColumns, [dynamicColumns]);

	return (
		<>
			{/* Modal Component */}
			<Modal
				size="2xl"
				isOpen={manageColumns}
				onClose={() => setManageColumns(false)}
				isCentered
			>
				<ModalOverlay />
				<ModalContent overflowY={"scroll"}>
					<ModalHeader>Manage Columns</ModalHeader>
					<ModalCloseButton onClick={() => setManageColumns(false)} />
					<ModalBody>
						<Grid templateColumns="repeat(4, 1fr)" mb={3} gap={3}>
							{memoizedColumns.map((column) => (
								<Text display={"flex"} key={column.accessor} py={2}>
									<Checkbox
										value={selectedColumns.some(
											(selectedColumn) =>
												selectedColumn.accessor === column.accessor
										)}
										defaultChecked={selectedColumns.some(
											(selectedColumn) =>
												selectedColumn.accessor === column.accessor
										)}
										onChange={() => toggleColumnVisibility(column.accessor)}
										pe={2}
									/>
									{column.Header}
								</Text>
							))}
						</Grid>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="brand"
							size="sm"
							mr={2}
							onClick={saveManageCols}
							disabled={isLoding}
						>
							{isLoding ? <Spinner /> : "Save"}
						</Button>
						<Button
							size="sm"
							variant="outline"
							colorScheme="red"
							onClick={() => {
								handleColumnClear();
							}}
						>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
	// return (
	// 	<Modal
	// 		size="2xl"
	// 		onClose={() => {
	// 			setManageColumns(false);
	// 		}}
	// 		isOpen={manageColumns}
	// 		isCentered
	// 	>
	// 		<ModalOverlay />
	// 		<ModalContent overflowY={"scroll"}>
	// 			<ModalHeader>Manage Columns</ModalHeader>
	// 			<ModalCloseButton
	// 				onClick={() => {
	// 					setManageColumns(false);
	// 				}}
	// 			/>
	// 			<ModalBody>
	// 				<Grid templateColumns="repeat(4, 1fr)" mb={3} gap={3}>
	// 					{dynamicColumns.map((column) => (
	// 						<Text display={"flex"} key={column.accessor} py={2}>
	// 							<Checkbox
	// 								value={selectedColumns.some(
	// 									(selectedColumn) =>
	// 										selectedColumn.accessor === column.accessor
	// 								)}
	// 								defaultChecked={selectedColumns.some(
	// 									(selectedColumn) =>
	// 										selectedColumn.accessor === column.accessor
	// 								)}
	// 								onChange={() => toggleColumnVisibility(column.accessor)}
	// 								pe={2}
	// 							/>
	// 							{column.Header}
	// 						</Text>
	// 					))}
	// 				</Grid>
	// 			</ModalBody>
	// 			<ModalFooter>
	// 				<Button
	// 					colorScheme="brand"
	// 					size="sm"
	// 					mr={2}
	// 					onClick={saveManageCols}
	// 					disabled={isLoding ? true : false}
	// 				>
	// 					{isLoding ? <Spinner /> : "Save"}
	// 				</Button>
	// 				<Button
	// 					size="sm"
	// 					variant="outline"
	// 					colorScheme="red"
	// 					onClick={() => handleColumnClear()}
	// 				>
	// 					Close
	// 				</Button>
	// 			</ModalFooter>
	// 		</ModalContent>
	// 	</Modal>
	// );
};

export default ManageColumnModal;
