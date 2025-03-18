// import {
// 	Table,
// 	Thead,
// 	Tbody,
// 	Tr,
// 	Th,
// 	Td,
// 	TableContainer,
// 	Icon,
// } from '@chakra-ui/react';
// import { FiEdit } from 'react-icons/fi';

// const AgencyTable = ({ data, handleEdit }) => {
// 	return (
// 		<TableContainer>
// 			<Table variant='striped' size='md'>
// 				<Thead bg='brand.200'>
// 					<Tr>
// 						<Th color='gray.800'>S.No</Th>
// 						<Th color='gray.800'>Name</Th>
// 						<Th color='gray.800'>Location</Th>
// 						<Th color='gray.800'>Action</Th>
// 					</Tr>
// 				</Thead>
// 				<Tbody>
// 					{data?.length > 0 ? (
// 						data?.map((row, i) => (
// 							<Tr key={row._id}>
// 								<Td>{++i}</Td>
// 								<Td>{row.name}</Td>
// 								<Td>{row.location}</Td>
// 								<Td onClick={() => handleEdit(row)}>
// 									<Icon
// 										as={FiEdit}
// 										boxSize={4}
// 										color='green.400'
// 										cursor='pointer'
// 									/>
// 								</Td>
// 							</Tr>
// 						))
// 					) : (
// 						<Tr>
// 							<Td>No data found!</Td>
// 						</Tr>
// 					)}
// 				</Tbody>
// 			</Table>
// 		</TableContainer>
// 	);
// };

// export default AgencyTable;
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
  import { FiEdit } from 'react-icons/fi';
  import { useNavigate } from 'react-router-dom';
  
  const AgencyTable = ({ data, handleEdit }) => {
	const navigate = useNavigate();
  
	const handleOfficeSettingsClick = (row) => {
		navigate('/office-setting'); 
	  };
  
	return (
	  <TableContainer>
		<Table variant="striped" size="md">
		  <Thead bg="brand.200">
			<Tr>
			  <Th color="gray.800">S.No</Th>
			  <Th color="gray.800">Name</Th>
			  <Th color="gray.800">Location</Th>
			  <Th color="gray.800">Agency Setting</Th>
			  <Th color="gray.800">Action</Th>
			</Tr>
		  </Thead>
		  <Tbody>
			{data?.length > 0 ? (
			  data?.map((row, i) => (
				<Tr key={row._id}>
				  <Td>{++i}</Td>
				  <Td>{row.name}</Td>
				  <Td>{row.location}</Td>
				  <Td>
					<Button
					  bg="#EDD199"
					  textAlign="center"
					  borderRadius="5px"
					  onClick={() => handleOfficeSettingsClick(row)}
					>
					  Office Setting
					</Button>
				  </Td>
				  <Td onClick={() => handleEdit(row)}>
					<Icon
					  as={FiEdit}
					  boxSize={4}
					  color="green.400"
					  cursor="pointer"
					/>
				  </Td>
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