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
	HStack,
	Box,
	useDisclosure,
	IconButton,
} from '@chakra-ui/react';
import TableLoading from 'components/loading/TableLoading';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';
import EditProject from './EditProject';
import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useDeleteItemMutation } from 'api/apiSlice';
import ConfirmationModal from 'components/Message/ConfirmationModal';
import { format } from 'date-fns';
import { useUserActivityLog } from 'hooks/useUserActivityLog';

const ProjectsTable = ({ data, isLoading, isFetching, refetch }) => {
	const columns = ['S.No', 'Name', 'Developer', 'Created Date', 'Action'];
	const [editData, setEditData] = useState();

	const [projectId, setProjectId] = useState(null);

	const [deleteModal, setDeleteModal] = useState(false);

	const user = JSON.parse(localStorage.getItem('user'));
	const { createUserLog } = useUserActivityLog();
	const [deleteItemMutation, { isLoading: isDeleting }] =
		useDeleteItemMutation();

	const {
		isOpen: isEditOpen,
		onOpen: onEditOpen,
		onClose: onEditClose,
	} = useDisclosure();

	const handleEdit = (data) => {
		setEditData(data);
		onEditOpen();
	};

	const handleDeleteModal = (id) => {
		setDeleteModal(true);
		setProjectId(id);
	};

	const handleDelete = async () => {
		try {
			await deleteItemMutation({
				path: `/developer/projects/${projectId}`,
			}).unwrap();
			createUserLog({
				userId: user?._id,
				action: 'DELETE',
				entity: 'Project',
				entityType: 'Project',
				entityId: projectId,
				status: 'success',
				message: `"${user?.fullName}" deleted project ".`,
			});
			toast.success('Project deleted successfully...');
			refetch();
		} catch (error) {
			const errorMsg =
				error?.data?.message ||
				'Failed to delete the project. Please try again.';
			createUserLog({
				userId: user?._id,
				action: 'DELETE',
				entity: 'Project',
				entityType: 'Project',
				entityId: projectId,
				status: error?.status === 500 ? 'error' : 'fail',
				message: errorMsg,
			});
			toast.error(error.data?.message || 'Error in deleting project');
		} finally {
			setDeleteModal(false);
			setProjectId(null);
		}
	};

	return (
		// <>
		// 	<Box
		// 		height={data?.results < 6 ? 'fit-content' : '80vh'}
		// 		overflowY='auto'
		// 		scrollBehavior='smooth'
		// 		borderRadius='md'
		// 		boxShadow='sm'
		// 		bg='bg.surface'
		// 		color='text.body'
		// 		mt='2'
		// 	>
		// 		<Table variant='striped' size='md'>
		// 			<Thead bg='brand.200'>
		// 				<Tr>
		// 					{columns.map((col, index) => (
		// 						<Th key={index} color='gray.800'>
		// 							{col}
		// 						</Th>
		// 					))}
		// 				</Tr>
		// 			</Thead>
		// 			<Tbody>
		// 				{isLoading || isFetching ? (
		// 					<TableLoading columns={columns} length={8} py='4' />
		// 				) : data?.doc?.length > 0 ? (
		// 					data?.doc?.map((row, i) => {
		// 						const date = new Date(row.createdAt) ?? null;
		// 						return (
		// 							<Tr key={row._id}>
		// 								<Td>{++i}</Td>
		// 								<Td>{row.name ?? 'N/A'}</Td>
		// 								<Td>{row.developer?.developer_name ?? 'N/A'}</Td>

		// 								<Td py={4} minWidth='150px'>
		// 									{/* {formattedDate(row?.createdAt)} */}

		// 									{date ? format(date, 'MMM d, yyyy h:mm a') : 'N/A'}
		// 								</Td>

		// 								<Td>
		// 									<HStack gap={2}>
		// 										<IconButton
		// 											rounded='full'
		// 											aria-label='edit'
		// 											icon={<FaEdit />}
		// 											size='xs'
		// 											colorScheme='green'
		// 											variant='solid'
		// 											onClick={() => handleEdit(row)}
		// 										/>

		// 										<IconButton
		// 											rounded='full'
		// 											aria-label='delete'
		// 											icon={<FaTrash />}
		// 											size='xs'
		// 											colorScheme='red'
		// 											variant='solid'
		// 											mr='1'
		// 											onClick={() => handleDeleteModal(row?._id)}
		// 										/>
		// 									</HStack>
		// 								</Td>
		// 							</Tr>
		// 						);
		// 					})
		// 				) : (
		// 					<Tr>
		// 						<Td colSpan={5}>
		// 							<NoData label='projects' />
		// 						</Td>
		// 					</Tr>
		// 				)}
		// 			</Tbody>
		// 		</Table>
		// 	</Box>

		// 	{isEditOpen && (
		// 		<EditProject
		// 			data={editData}
		// 			isOpen={isEditOpen}
		// 			onClose={onEditClose}
		// 			refetch={refetch}
		// 		/>
		// 	)}

		// 	{deleteModal && (
		// 		<ConfirmationModal
		// 			isOpen={deleteModal}
		// 			onClose={() => {
		// 				setDeleteModal(false);
		// 				setProjectId(null);
		// 			}}
		// 			onConfirm={handleDelete}
		// 			title='Delete Project'
		// 			message='Are you sure you want to delete this project?'
		// 			confirmText='Yes, Delete'
		// 			cancelText='Cancel'
		// 		/>
		// 	)}
		// </>
		<>
			<Box
				minHeight={'60vh'}
				overflowY='auto'
				scrollBehavior='smooth'
				borderRadius='xl'
				border='1px solid'
				borderColor='border.default'
				bg='bg.surface'
				boxShadow='card'
				mt={4}
			>
				<Table variant='simple' size='md'>
					<Thead position='sticky' top={0} bg='bg.elevated' zIndex={2}>
						<Tr>
							{columns.map((col, index) => (
								<Th
									key={index}
									py={4}
									px={4}
									color='gold.primary'
									fontSize='11px'
									fontWeight='700'
									letterSpacing='0.08em'
									textTransform='uppercase'
									whiteSpace='nowrap'
								>
									{col}
								</Th>
							))}
						</Tr>
					</Thead>

					<Tbody>
						{isLoading || isFetching ? (
							<TableLoading columns={columns} length={8} py='4' />
						) : data?.doc?.length > 0 ? (
							data?.doc?.map((row, i) => {
								const date = new Date(row.createdAt) ?? null;
								return (
									<Tr
										key={row._id}
										_hover={{ bg: 'bg.elevated' }}
										transition='background 0.15s'
									>
										<Td py={4} px={4} fontWeight='500' color='text.muted'>
											{++i}
										</Td>

										<Td py={4} px={4} fontWeight='500' color='text.white'>
											{row.name ?? 'N/A'}
										</Td>

										<Td py={4} px={4} color='text.white'>
											{row.developer?.developer_name ?? 'N/A'}
										</Td>

										<Td
											py={4}
											px={4}
											minWidth='180px'
											color='text.white'
											fontSize='sm'
										>
											{date ? format(date, 'MMM d, yyyy h:mm a') : 'N/A'}
										</Td>

										<Td py={4} px={4}>
											<HStack gap={2}>
												<IconButton
													aria-label='edit'
													icon={<FaEdit />}
													size='sm'
													variant='ghost'
													color='gold.primary'
													onClick={() => handleEdit(row)}
													_hover={{
														bg: 'rgba(212, 175, 55, 0.1)',
														transform: 'scale(1.05)',
													}}
													_active={{ transform: 'scale(0.95)' }}
													transition='all 0.15s'
												/>

												<IconButton
													aria-label='delete'
													icon={<FaTrash />}
													size='sm'
													variant='ghost'
													color='red.400'
													onClick={() => handleDeleteModal(row?._id)}
													_hover={{
														bg: 'rgba(245, 101, 101, 0.1)',
														color: 'red.300',
														transform: 'scale(1.05)',
													}}
													_active={{ transform: 'scale(0.95)' }}
													transition='all 0.15s'
												/>
											</HStack>
										</Td>
									</Tr>
								);
							})
						) : (
							<Tr>
								<Td colSpan={columns.length} py={12} textAlign='center'>
									<NoData label='projects' />
								</Td>
							</Tr>
						)}
					</Tbody>
				</Table>
			</Box>

			{isEditOpen && (
				<EditProject
					data={editData}
					isOpen={isEditOpen}
					onClose={onEditClose}
					refetch={refetch}
				/>
			)}

			{deleteModal && (
				<ConfirmationModal
					isOpen={deleteModal}
					onClose={() => {
						setDeleteModal(false);
						setProjectId(null);
					}}
					onConfirm={handleDelete}
					title='Delete Project'
					message='Are you sure you want to delete this project?'
					confirmText='Yes, Delete'
					cancelText='Cancel'
				/>
			)}
		</>
	);
};

export default ProjectsTable;
