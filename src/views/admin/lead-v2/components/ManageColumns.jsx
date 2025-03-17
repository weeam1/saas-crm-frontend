import { useCallback } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Grid,
	Text,
	Checkbox,
	Button,
} from '@chakra-ui/react';

const columnList = [
	{ accessor: 'intID', name: '#' },
	{ accessor: 'leadName', name: 'Name' },
	{ accessor: 'managerAssigned', name: 'Manager' },
	{ accessor: 'agentAssigned', name: 'Agent' },
	{ accessor: 'eLeadStatus', name: 'M.Status' },
	{ accessor: 'leadStatus', name: 'Status' },
	{ accessor: 'managerAssignedDate', name: 'Manager Assign Date' },
	{ accessor: 'agentAssignedDate', name: 'Agent Assign Date' },
	{ accessor: 'leadWhatsappNumber', name: 'Whatsapp' },
	{ accessor: 'leadPhoneNumber', name: 'Phone' },
	{ accessor: 'createdDate', name: 'Date & Time' },
	{ accessor: 'timetocall', name: 'Timetocall' },
	{ accessor: 'budget', name: 'Budget' },
	{ accessor: 'nationality', name: 'Nationality' },
	{ accessor: 'leadLang', name: 'Language' },
	{ accessor: 'lastNote', name: 'Last Note' },
	{ accessor: 'ip', name: 'Country' },
	{ accessor: 'leadSourceDetails', name: 'Source Content' },
	{ accessor: 'attendanceDay', name: 'Attendance Day' },
	{ accessor: 'leadCampaign', name: 'Campaign' },
	{ accessor: 'pageUrl', name: 'Campaign URL' },
	{ accessor: 'leadAddress', name: 'Address' },
	{ accessor: 'leadEmail', name: 'Email' },
	{ accessor: 'leadSourceMedium', name: 'Medium' },
	{ accessor: 'r_u_in_uae', name: 'In UAE?' },
];

const ManageCols = ({
	setManageCols,
	manageCols,
	hiddenCols,
	setHiddenCols,
	saveManageCols,
}) => {
	const handleToggle = useCallback(
		(accessor) => {
			setHiddenCols((prev) =>
				prev.includes(accessor)
					? prev.filter((col) => col !== accessor)
					: [...prev, accessor]
			);
		},
		[setHiddenCols]
	);

	return (
		<Modal
			size='2xl'
			isOpen={manageCols}
			onClose={() => setManageCols(false)}
			isCentered
			motionPreset='scale'
			// closeOnOverlayClick={false}
			disableScrollLocking={true}
		>
			<ModalOverlay />
			<ModalContent overflowY='auto' maxHeight='80vh'>
				<ModalHeader>Manage Columns</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Grid templateColumns='repeat(3, 1fr)' gap={3}>
						{columnList.map(({ accessor, name }) => (
							<Text key={accessor} display='flex' alignItems='center'>
								<Checkbox
									isChecked={!hiddenCols.includes(accessor)}
									onChange={() => handleToggle(accessor)}
									mr={2}
								/>
								{name}
							</Text>
						))}
					</Grid>
				</ModalBody>
				<ModalFooter>
					<Button
						size='sm'
						variant='outline'
						colorScheme='red'
						mr='2'
						onClick={() => setManageCols(false)}
					>
						Close
					</Button>
					<Button colorScheme='brand' size='sm' mr={2} onClick={saveManageCols}>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ManageCols;
