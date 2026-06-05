import React, { useMemo } from 'react';
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Flex,
	IconButton,
	Badge,
	Text,
	Tooltip,
	TableContainer,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import NoData from 'components/Message/NoData';
import TableSkeleton from '../../../TableSkeleton';
import { useModalColors } from 'hooks/useModalColors';

const MetaIdTab = ({
	metaIds,
	isLoading,
	onEdit,
	onDelete,
	isDeleting,
	deletingId,
}) => {
	const colors = useModalColors();

	const columns = useMemo(
		() => [
			{ Header: 'Name', accessor: 'label', width: 200 },
			{ Header: 'Key', accessor: 'key', width: 200 },
			{ Header: 'Description', accessor: 'description', width: 400 },
			{ Header: 'Actions', accessor: 'actions', width: 100 },
		],
		[],
	);

	return (
		<TableContainer
			maxHeight='70vh'
			minH='60vh'
			overflowY='auto'
			overflowX='auto'
			border='1px solid'
			borderColor={colors.borderColor}
			borderRadius='lg'
		>
			<Table variant='simple' size='sm'>
				<Thead position='sticky' top={0} bg={colors.bg} zIndex={1}>
					<Tr>
						{columns.map((col) => (
							<Th
								key={col.accessor}
								width={col?.width ? `${col.width}px` : 'auto'}
								minWidth={col?.width ? `${col.width}px` : '100px'}
								textAlign='center'
								py={3}
								fontSize='sm'
								fontWeight='semibold'
								color={colors.headingText}
								textTransform='capitalize'
								borderBottom={`2px solid ${colors.borderColor}`}
								whiteSpace='nowrap'
							>
								{col.Header}
							</Th>
						))}
					</Tr>
				</Thead>

				<Tbody>
					{isLoading ? (
						<TableSkeleton columns={columns} rowCount={3} />
					) : metaIds && metaIds.length > 0 ? (
						metaIds.map((metaId) => (
							<Tr
								borderBottom={`1px solid ${colors.borderColor}`}
								key={metaId._id || metaId.id}
								// bg={colors.bgInput}
								_hover={{ bg: colors.bgInputHover }}
								opacity={isDeleting && deletingId === metaId._id ? 0.5 : 1}
								transition='opacity 0.2s ease'
							>
								<Td
									textAlign='center'
									maxW='400px'
									whiteSpace='normal'
									wordBreak='break-word'
									color={colors.headingText}
									py={3}
								>
									{metaId.label}
								</Td>
								<Td textAlign='center' fontWeight='500' py={3}>
									<Badge
										bg={`rgba(212, 175, 55, 0.15)`}
										color={colors.accentGold}
										fontSize='sm'
										px={3}
										py={1}
										borderRadius='full'
										fontWeight='medium'
									>
										{metaId.key}
									</Badge>
								</Td>
								<Td
									textAlign='center'
									maxW='400px'
									whiteSpace='normal'
									wordBreak='break-word'
									color={colors.bodyText}
									py={3}
								>
									{metaId.description || '-'}
								</Td>
								<Td textAlign='center' py={3}>
									<Flex gap={1} justify='center'>
										<Tooltip label='Edit meta ID' hasArrow>
											<IconButton
												icon={<EditIcon />}
												size='xs'
												variant='ghost'
												onClick={() => onEdit(metaId)}
												aria-label='Edit meta ID'
												isLoading={isDeleting && deletingId === metaId._id}
												color={colors.accentGold}
												_hover={{
													bg: `rgba(212, 175, 55, 0.1)`,
													color: colors.goldLight,
													transform: 'scale(1.1)',
												}}
												transition='all 0.2s ease'
											/>
										</Tooltip>

										<Tooltip label='Delete meta ID' hasArrow>
											<IconButton
												icon={<DeleteIcon />}
												size='xs'
												variant='ghost'
												onClick={() => onDelete(metaId._id, metaId.key)}
												aria-label='Delete meta ID'
												isLoading={isDeleting && deletingId === metaId._id}
												color={colors.badgeErrorText}
												_hover={{
													bg: colors.badgeErrorBg,
													color: colors.badgeErrorText,
													transform: 'scale(1.1)',
												}}
												transition='all 0.2s ease'
											/>
										</Tooltip>
									</Flex>
								</Td>
							</Tr>
						))
					) : (
						<Tr>
							<Td colSpan={columns.length} py={10} textAlign='center'>
								<NoData label='meta IDs' />
							</Td>
						</Tr>
					)}
				</Tbody>
			</Table>
		</TableContainer>
	);
};

export default MetaIdTab;
