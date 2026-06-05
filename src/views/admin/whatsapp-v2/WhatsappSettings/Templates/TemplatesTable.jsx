import {
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Text,
	Badge,
} from '@chakra-ui/react';
import TableLoading from 'components/loading/TableLoading';
import NoData from 'components/Message/NoData';
import { templatesLanguages } from '../../components/helpers';

const TemplatesTable = ({ data, isLoading, isFetching }) => {
	const columns = ['Name', 'Category', 'Status', 'Language'];

	return (
		<Box
			      maxHeight="70vh"
      minH="70vh"
			overflowY='auto'
			borderRadius='md'
			boxShadow='sm'
			bg='white'
			py='2'
		>
			<Table variant='striped' size='md'>
				<Thead position='sticky' top={0} bg='white' zIndex={2}>
					<Tr>
						{columns.map((header, index) => (
							<Th key={index} bg='brand.200' py={4}>
								<Text
									fontSize='sm'
									fontWeight='600'
									color='gray.700'
									textAlign='center'
									textTransform='capitalize'
								>
									{header}
								</Text>
							</Th>
						))}
					</Tr>
				</Thead>

				<Tbody>
					{isLoading || isFetching ? (
						<TableLoading columns={columns} length={10} py='4' />
					) : data?.length > 0 ? (
						data.map((item, index) => (
							<Tr key={item?.name + index} textAlign='center'>
								<Td minW='200px' isTruncated>
									{item?.name}
								</Td>
								<Td minW='100px' textAlign='center' isTruncated>
									{item?.category}
								</Td>

								<Td textAlign='center'>
									<Badge
										colorScheme={item?.status === 'APPROVED' ? 'green' : 'red'}
										variant='subtle'
										px={3}
										py={1}
										borderRadius='full'
										fontSize='xs'
									>
										{item?.status}
									</Badge>
								</Td>
								<Td minW='50px' isTruncated textAlign='center'>
									{templatesLanguages.find(
										(lang) => lang.value === item?.language
									)?.label || item?.language}
								</Td>
							</Tr>
						))
					) : (
						<Tr>
							<Td colSpan={columns.length} textAlign='center' py={4}>
								<NoData label='templates' />
							</Td>
						</Tr>
					)}
				</Tbody>
			</Table>
		</Box>
	);
};

export default TemplatesTable;
