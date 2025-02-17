import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
} from '@chakra-ui/react';

const AgencyTable = ({ data }) => {
	return (
		<TableContainer>
			<Table variant='striped' size='md'>
				<Thead bg='brand.200'>
					<Tr>
						<Th color='gray.800'>S.No</Th>
						<Th color='gray.800'>Name</Th>
						<Th color='gray.800'>Location</Th>
					</Tr>
				</Thead>
				<Tbody>
					{data?.length > 0 ? (
						data?.map((row, i) => (
							<Tr key={row._id}>
								<Td>{++i}</Td>
								<Td>{row.name}</Td>
								<Td>{row.location}</Td>
							</Tr>
						))
					) : (
						<Tr>
							<Td>No data found!</Td>
						</Tr>
					)}
				</Tbody>
			</Table>
		</TableContainer>
	);
};

export default AgencyTable;
