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
import { useModalColors } from 'hooks/useModalColors';

const columnList = [
	{ accessor: 'intID', name: '#' },
	{ accessor: 'leadName', name: 'Name' },
	{ accessor: 'managerAssigned', name: 'Manager' },
	{ accessor: 'teamLeadAssigned', name: 'Team Lead' },
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
	{ accessor: 'country', name: 'Country' },
	{ accessor: 'city', name: 'City' },
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

	const { headerBg, headerText } = useModalColors();

	return (
		<Modal
			size='2xl'
			isOpen={manageCols}
			onClose={() => setManageCols(false)}
			isCentered
		>
			<ModalOverlay backdropFilter='blur(2px)' />
			<ModalContent mx='2' borderRadius='xl' boxShadow='xl'>
				<ModalHeader
					display='flex'
					gap='2'
					bg={headerBg}
					color={headerText}
					borderTopRadius='xl'
					py={4}
					alignItems='center'
					w='100%'
				>
					Manage Columns
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody maxH='75vh' overflow='scroll' p={6}>
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
						// variant='outline'
						colorScheme='gray'
						mr='2'
						rounded='md'
						onClick={() => setManageCols(false)}
					>
						Close
					</Button>
					<Button
						colorScheme='brand'
						size='sm'
						rounded='md'
						mr={2}
						onClick={saveManageCols}
					>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ManageCols;
