import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Icon,
	Button,
} from '@chakra-ui/react';
import TableLoading from 'components/loading/TableLoading';
import { FiEdit } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AgencyTable = ({ data, handleEdit, isLoading }) => {
	const navigate = useNavigate();

	const handleOfficeSettingsClick = (row) => {
		console.log({ row });
		navigate(`/office-settings/${row._id}`, {
			state: { agencyName: row.name, agencyId: row._id },
		});
	};

	const columns = ['S.No', 'Name', 'Location', 'Agency Setting', 'Action'];

	return (
		<TableContainer>
			<Table variant='striped' size='md'>
				<Thead bg='brand.200'>
					<Tr>
						{columns.map((col, index) => (
							<Th key={index} color='gray.800'>
								{col}
							</Th>
						))}
					</Tr>
				</Thead>
				<Tbody>
					{isLoading ? (
						<TableLoading columns={columns} length={2} py='4' />
					) : data?.length > 0 ? (
						data?.map((row, i) => (
							<Tr key={row._id}>
								<Td>{++i}</Td>
								<Td>{row.name}</Td>
								<Td>{row.location}</Td>
								<Td>
									<Button
										bg='#EDD199'
										textAlign='center'
										borderRadius='5px'
										onClick={() => handleOfficeSettingsClick(row)}
									>
										Office Setting
									</Button>
								</Td>
								<Td onClick={() => handleEdit(row)}>
									<Icon
										as={FiEdit}
										boxSize={4}
										color='green.400'
										cursor='pointer'
									/>
								</Td>
							</Tr>
						))
					) : (
						<Tr>
							<Td colSpan={5}>No data found!</Td>
						</Tr>
					)}
				</Tbody>
			</Table>
		</TableContainer>
	);
};

export default AgencyTable;
