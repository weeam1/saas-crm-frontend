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
import { useModalColors } from 'hooks/useModalColors';

const TemplatesTable = ({ data, isLoading, isFetching }) => {
	const colors = useModalColors();
	const columns = ['Name', 'Category', 'Status', 'Language'];

	return (
		<Box
		      maxHeight="70vh"
      minH="70vh"
			overflowY='auto'
			borderRadius='md'
			boxShadow={colors.cardShadow}
			bg={colors.bg}
			py='2'
			border='1px solid'
			borderColor={colors.borderColor}
		>
			<Table variant='simple' size='md'>
				<Thead position='sticky' top={0} bg={colors.bgDeep} zIndex={2}>
					<Tr>
						{columns.map((header, index) => (
							<Th key={index} bg={colors.bgDeep} py={4} borderColor={colors.borderColor}>
								<Text
									fontSize='sm'
									fontWeight='600'
									color={colors.headingText}
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
							<Tr key={item?.name + index} textAlign='center' borderColor={colors.borderColor}>
								<Td minW='200px' isTruncated color={colors.bodyText} borderColor={colors.borderColor}>
									{item?.name}
								</Td>
								<Td minW='100px' textAlign='center' isTruncated color={colors.bodyText} borderColor={colors.borderColor}>
									{item?.category}
								</Td>

								<Td textAlign='center' borderColor={colors.borderColor}>
									<Badge
										bg={item?.status === 'APPROVED' ? colors.badgeSuccessBg : colors.badgeErrorBg}
										color={item?.status === 'APPROVED' ? colors.badgeSuccessText : colors.badgeErrorText}
										variant='subtle'
										px={3}
										py={1}
										borderRadius='full'
										fontSize='xs'
									>
										{item?.status}
									</Badge>
								</Td>
								<Td minW='50px' isTruncated textAlign='center' color={colors.bodyText} borderColor={colors.borderColor}>
									{templatesLanguages.find(
										(lang) => lang.value === item?.language
									)?.label || item?.language}
								</Td>
							</Tr>
						))
					) : (
						<Tr>
							<Td colSpan={columns.length} textAlign='center' py={4} borderColor={colors.borderColor}>
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