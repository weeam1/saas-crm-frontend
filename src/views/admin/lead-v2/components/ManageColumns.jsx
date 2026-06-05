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

	return (
		<Modal
			size='2xl'
			isOpen={manageCols}
			onClose={() => setManageCols(false)}
			isCentered
		>
			<ModalOverlay bg='bg.overlay' backdropFilter='blur(2px)' />
			<ModalContent
				bg='bg.surface'
				borderRadius='xl'
				boxShadow='deep'
				mx='2'
				overflow='hidden'
			>
				<ModalHeader
					bg='accent.gold'
					color='text.inverse'
					borderTopRadius='xl'
					py={4}
					px={6}
					borderBottom='1px solid'
					borderColor='border.default'
				>
					Manage Columns
				</ModalHeader>

				<ModalCloseButton
					color='text.inverse'
					_focus={{ outline: 'none' }}
					_hover={{ bg: 'rgba(0,0,0,0.1)' }}
				/>

				<ModalBody maxH='75vh' overflowY='auto' p={6} bg='bg.app'>
					<Grid templateColumns='repeat(3, 1fr)' gap={3}>
						{columnList.map(({ accessor, name }) => (
							<Text key={accessor} display='flex' alignItems='center' color='text.body'>
								<Checkbox
									isChecked={!hiddenCols.includes(accessor)}
									onChange={() => handleToggle(accessor)}
									mr={2}
									sx={{
										'.chakra-checkbox__control': {
											_focus: { boxShadow: 'none' },
										},
									}}
								/>
								{name}
							</Text>
						))}
					</Grid>
				</ModalBody>

				<ModalFooter
					borderTop='1px solid'
					borderColor='border.default'
					bg='bg.surface'
					gap={3}
				>
					<Button
						size='sm'
						variant='outline'
						onClick={() => setManageCols(false)}
					>
						Close
					</Button>
					<Button
						variant='brand'
						size='sm'
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