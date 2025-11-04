import { useState, useEffect } from 'react';
import {
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Button,
	Flex,
	Text,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	FormControl,
	FormLabel,
	Input,
	useDisclosure,
	Switch,
	Select,
	Stack,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';
import TableLoading from 'components/loading/TableLoading';
import {
	useFetchItemsQuery,
	useCreateItemMutation,
	useDeleteItemMutation,
	useUpdateItemMutation,
} from 'api/apiSlice';
import TopPagination from 'components/pagination/TopPagination';
import AppButton from 'components/shared/AppButton';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useUserActivityLog } from 'hooks/useUserActivityLog';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useModalColors } from "hooks/useModalColors";

const validationSchema = Yup.object().shape({
	unitType: Yup.string().required('Unit Type is required'),
	name: Yup.string()
		.max(50, 'Name must be at most 50 characters')
		.required('Sub Type is required'),
	status: Yup.boolean(),
});

const unitTypeValidationSchema = Yup.object().shape({
	name: Yup.string()
		.max(50, 'Name must be at most 50 characters')
		.required('Unit Type name is required'),
	status: Yup.boolean(),
});

const SubUnitType = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [totalPages, setTotalPages] = useState(0);
	const [totalItems, setTotalItems] = useState(0);
	const [isEditMode, setIsEditMode] = useState(false);
	const [currentUnitType, setCurrentUnitType] = useState(null);
	const user = JSON.parse(localStorage.getItem('user')) || {};

	const { createUserLog } = useUserActivityLog();
	const navigate = useNavigate();

	const { headerBg, headerText, footerBg, borderColor } = useModalColors();

	const [isUnitTypeModalOpen, setIsUnitTypeModalOpen] = useState(false);

	const buildQueryParams = () => {
		const params = { page: currentPage, limit: pageSize };
		return params;
	};

	const { data, isLoading, isError, refetch, isFetching } = useFetchItemsQuery(
		{
			path: `/listing/secondary/unit-types/sub-category/`,
			params: buildQueryParams(),
		},
		{ refetchOnMountOrArgChange: true, skip: !user._id }
	);

	const { data: unitTypeData, refetch: refetchingUnitType } =
		useFetchItemsQuery(
			{ path: `/listing/secondary/unit-types`, params: buildQueryParams() },
			{ refetchOnMountOrArgChange: true, skip: !user._id }
		);

	const [createItemMuation] = useCreateItemMutation();
	const [updateItemMuation] = useUpdateItemMutation();
	const [deleteItemMutation] = useDeleteItemMutation();

	const columns = ['Main Type', 'Sub Type', 'Status', 'Created At', 'Actions'];

	useEffect(() => {
		if (data) {
			setTotalPages(data.totalPages || 0);
			setTotalItems(data.totalDocs || 0);
		}
	}, [data]);

	const handlePageSizeChange = (newPageSize) => {
		setPageSize(newPageSize);
		setCurrentPage(1);
		refetch();
	};

	const handleSubmit = async (values, { resetForm }) => {
		try {
			if (isEditMode) {
				await updateItemMuation({
					path: `/listing/secondary/unit-types/sub-category/${currentUnitType._id}`,
					body: values,
				}).unwrap();
				toast.success('Unit Type updated successfully');
				createUserLog({
					userId: user?._id,
					action: 'UPDATE',
					entity: 'listing_Sub_Unit_Type',
					entityType: 'ListingSubUnitType',
					entityId: currentUnitType._id,
					status: 'success',
					message: `"${user?.fullName}" update the listing sub Unit Type "${
						currentUnitType?.name || 'Untitled'
					}".`,
				});
			} else {
				const response = await createItemMuation({
					path: '/listing/secondary/unit-types/sub-category',
					body: values,
				}).unwrap();
				toast.success('Sub Unit Type created successfully');
				createUserLog({
					userId: user?._id,
					action: 'CREATE',
					entity: 'listing_Sub_Unit_Type',
					entityType: 'ListingSubUnitType',
					entityId: response?.doc?._id,
					status: 'success',
					message: `"${user?.fullName}" created the listing sub unit type "${
						response?.doc.name || 'Untitled'
					}".`,
				});
			}
			resetForm();
			onClose();
			refetch();
		} catch (error) {
			console.error(error);
			toast.error(error.data?.message || 'An error occurred');
			const errorMsg =
				error?.data?.message ||
				`Failed to ${isEditMode ? 'updated' : 'create'} the listing  sub unit type. Please try again.`;
			toast.error(error.data?.message || 'An error occurred');
			createUserLog({
				userId: user?._id,
				action: isEditMode ? 'UPDATE' : 'CREATE',
				entity: 'listing_Sub_Unit_Type',
				entityType: 'ListingSubUnitType',
				entityId: currentUnitType._id,
				status: error?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		}
	};

	const handleUnitTypeSave = async (values, { resetForm }) => {
		try {
			const response = await createItemMuation({
				path: '/listing/secondary/unit-types',
				body: values,
			}).unwrap();
			createUserLog({
				userId: user?._id,
				action: 'CREATE',
				entity: 'listing_Sub_Unit_Type',
				entityType: 'ListingSubUnitType',
				entityId: response?.doc?._id,
				status: 'success',
				message: `"${user?.fullName}" created the listing sub unit type "${
					response?.doc?.name || 'Untitled'
				}".`,
			});
			toast.success('Unit Type created successfully');
			setIsUnitTypeModalOpen(false);
			resetForm();
			refetchingUnitType();
			onOpen();
		} catch (error) {
			toast.error(error.data?.message || 'Failed to create unit type');
			const errorMsg =
				error?.data?.message ||
				`Failed to create the listing  sub unit type. Please try again.`;
			toast.error(error.data?.message || 'An error occurred');
			createUserLog({
				userId: user?._id,
				action: 'CREATE',
				entity: 'listing_Sub_Unit_Type',
				entityType: 'ListingSubUnitType',
				status: error?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		}
	};

	const handleEdit = (unitType) => {
		setCurrentUnitType(unitType);
		setIsEditMode(true);
		onOpen();
	};

	const handleDelete = async (id) => {
		try {
			await deleteItemMutation({
				path: `/listing/secondary/unit-types/sub-category/${id}`,
			}).unwrap();
			toast.success('Unit Type deleted successfully');
			createUserLog({
				userId: user?._id,
				action: 'DELETE',
				entity: 'listing_Sub_Unit_Type',
				entityType: 'ListingSubUnitType',
				entityId: id,
				status: 'success',
				message: `"${user?.fullName}" deleted the listing sub unit type.`,
			});
			refetch();
		} catch (error) {
			console.error(error);
			toast.error(error.data?.message || 'Failed to delete unit type');
			const errorMsg =
				error?.data?.message ||
				'Failed to delete the unit listing type. Please try again.';
			createUserLog({
				userId: user?._id,
				action: 'DELETE',
				entity: 'listing_Sub_Unit_Type',
				entityType: 'ListingSubUnitType',
				entityId: id,
				status: error?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		}
	};

	const handleStatusChange = async (type) => {
		try {
			const newStatus = !type.status;
			const response = await updateItemMuation({
				path: `/listing/secondary/unit-types/sub-category/status/${type._id}`,
				body: { status: newStatus },
			}).unwrap();
			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'listing_Sub_Unit_Type',
				entityType: 'ListingSubUnitType',
				entityId: response?.doc?._id,
				status: 'success',
				message: `"${user?.fullName}" update the status of listing sub Unit Type "${response?.doc?.name || 'Untitled'}".`,
			});
			toast.success(`Listing type status updated successfully`);
			refetch();
		} catch (error) {
			console.error(error);
			toast.error(
				error.data?.message || 'Failed to update listing type status'
			);
			const errorMsg =
				error?.data?.message ||
				'Failed to delete the status of unit listing type. Please try again.';
			createUserLog({
				userId: user?._id,
				action: 'DELETE',
				entity: 'listing_Sub_Unit_Type',
				entityType: 'ListingSubUnitType',
				entityId: type._id,
				status: error?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		}
	};

	return (
		<Box overflowY='auto' scrollBehavior='smooth' boxShadow='sm' px={2}>
			<AppButton
				ml='2'
				leftIcon={<IoArrowBack />}
				onClick={() => navigate(-1)}
				mb={4}
			>
				Back
			</AppButton>
			<Box
				overflowY='auto'
				scrollBehavior='smooth'
				boxShadow='sm'
				bg='white'
				px={2}
			>
				<Flex
					justifyContent='space-between'
					alignItems={{ base: 'flex-start', md: 'center' }}
					flexDirection={{ base: 'column', md: 'row' }}
					p={3}
					gap={{ base: 3, md: 0 }}
				>
					<Text
						fontSize={{ base: '20px', md: '20px' }}
						fontWeight='bold'
						color='black'
						p={{ base: 1, md: 3 }}
						textAlign={{ base: 'left', md: 'inherit' }}
						w='100%'
					>
						Listing Sub Unit Types
					</Text>
					<Stack
						direction={{ base: 'column', sm: 'row' }}
						spacing={{ base: 2, md: 5 }}
						w={{ base: '100%', md: 'auto' }}
						align={{ base: 'stretch', md: 'center' }}
					>
						<Button
							size='sm'
							borderRadius={"md"}
							variant='brand'
							leftIcon={<AddIcon />}
							py={3}
							px={6}
							w={{ base: '100%', md: 'auto' }}
							onClick={() => {
								setIsEditMode(false);
								onOpen();
							}}
						>
							Add New
						</Button>
					</Stack>
				</Flex>

				<Box mx={1} mb={1}>
					<TopPagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
						totalItems={totalItems}
						itemsPerPage={pageSize}
						setPageSize={setPageSize}
						handlePageSize={handlePageSizeChange}
						refetching={isLoading}
						loading={isLoading}
					/>
				</Box>

				<Box
					borderRadius='4px'
					boxShadow='sm'
					borderWidth='1px'
					overflow='hidden'
					mx={1}
				>
					<Box position='relative' maxH='120vh' overflowY='auto'>
						<Table variant='striped' size='lg'>
							<Thead
								position='sticky'
								top={0}
								bg='white'
								zIndex={2}
								boxShadow='0px 2px 8px rgba(0, 0, 0, 0.1)'
								fontSize={'16px'}
								borderRadius='lg'
							>
								<Tr>
									{columns.map((header, index) => (
										<Th key={index} bg='brand.200' whiteSpace='nowrap' py={4}>
											<Box
												display='flex'
												alignItems='center'
												justifyContent='center'
											>
												<Text
													fontSize={{ base: '12px', md: '14px' }}
													fontWeight='600'
													color='gray.700'
												>
													{header}
												</Text>
											</Box>
										</Th>
									))}
								</Tr>
							</Thead>
							{isLoading && isFetching ? (
								<TableLoading columns={columns} length={7} py='4' />
							) : (
								<Tbody>
									{data?.doc?.map((unitType) => (
										<Tr key={unitType._id}>
											<Td
												py={4}
												fontSize={{ base: '12px', md: '14px' }}
												fontWeight='400'
												minWidth='100px'
												textAlign={'center'}
											>
												{unitType?.unitType?.name || 'N/A'}
											</Td>
											<Td
												py={4}
												fontSize={{ base: '12px', md: '14px' }}
												fontWeight='400'
												minWidth='100px'
												textAlign={'center'}
											>
												{unitType.name || 'N/A'}
											</Td>
											<Td
												py={4}
												fontSize={{ base: '12px', md: '14px' }}
												fontWeight='400'
												minWidth='100px'
												textAlign={'center'}
											>
												<Switch
													colorScheme='green'
													isChecked={unitType.status}
													onChange={() => handleStatusChange(unitType)}
												/>
											</Td>
											<Td
												py={4}
												fontSize={{ base: '12px', md: '14px' }}
												fontWeight='400'
												minWidth='100px'
												textAlign={'center'}
											>
												{new Date(unitType.createdAt).toLocaleDateString()}
											</Td>
											<Td
												py={4}
												fontSize={{ base: '12px', md: '14px' }}
												fontWeight='400'
												minWidth='100px'
												display={'flex'}
												gap={2}
												justifyContent={'center'}
											>
												<IconButton
													aria-label='Edit'
													icon={<EditIcon />}
													size='sm'
													color={'#c09f5f'}
													_hover={{
														backgroundColor: '#c09f5f',
														color: 'white',
													}}
													onClick={() => handleEdit(unitType)}
												/>
												<IconButton
													aria-label='Delete'
													icon={<DeleteIcon />}
													size='sm'
													color={'#c09f5f'}
													_hover={{
														backgroundColor: '#c09f5f',
														color: 'white',
													}}
													onClick={() => handleDelete(unitType._id)}
												/>
											</Td>
										</Tr>
									))}
								</Tbody>
							)}
						</Table>
						{!isLoading && !isFetching && data?.doc?.length === 0 && (
							<Text textAlign='center' color='gray.500' py={6}>
								No listing unit types found.
							</Text>
						)}
					</Box>
				</Box>
			</Box>

			{/* Add/Edit Modal */}
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent w={{ base: '95vw', md: '500px' }} borderRadius="2xl" overflow="hidden">

						   <ModalHeader
								display="flex"
								align="center"
								justify="space-between"
								bg={headerBg}
								color={headerText}
								px={6}
								py={3}
								borderBottom="1px solid"
								borderColor={borderColor}
								position="sticky"
								top="0"
								zIndex="10"
							  >
								<Text fontSize="lg" fontWeight="bold">
								{isEditMode ? 'Edit Unit Types' : 'Add New Unit Types'}
								</Text>
								<ModalCloseButton
								  position="absolute"
								  right="12px"
								  top="10px"
								  color={headerText}
								  _hover={{ bg: "whiteAlpha.200" }}
								/>
							  </ModalHeader>
					<Formik
						initialValues={{
							unitType: currentUnitType?.unitType?._id || '',
							name: currentUnitType?.name || '',
							status: currentUnitType?.status ?? true,
						}}
						validationSchema={validationSchema}
						enableReinitialize
						onSubmit={handleSubmit}
					>
						{({ errors, touched, values, setFieldValue }) => (
							<Form>
								<ModalBody   overflowY="auto"
                  scrollBehavior="smooth"
                  sx={{
                    "&::-webkit-scrollbar": { width: "6px" },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#c1c1c1",
                      borderRadius: "10px",
                    },
                  }}>
									<FormControl isInvalid={errors.unitType && touched.unitType}>
										<FormLabel>Unit Type</FormLabel>
										<Select
											name='unitType'
											value={values.unitType}
											onChange={(e) =>
												setFieldValue('unitType', e.target.value)
											}
										>
											<option value=''>Select unit type</option>
											{unitTypeData?.doc?.map((type) => (
												<option key={type._id} value={type._id}>
													{type.name}
												</option>
											))}
										</Select>
										{errors.unitType && touched.unitType && (
											<Text color='red.500' fontSize='sm'>
												{errors.unitType}
											</Text>
										)}
									</FormControl>

									<FormControl mt={4} isInvalid={errors.name && touched.name}>
										<FormLabel>Sub Type</FormLabel>
										<Field
											as={Input}
											name='name'
											placeholder='Enter sub type'
										/>
										{errors.name && touched.name && (
											<Text color='red.500' fontSize='sm'>
												{errors.name}
											</Text>
										)}
									</FormControl>

									<FormControl mt={4}>
										<FormLabel>Active Status</FormLabel>
										<Switch
											isChecked={values.status}
											onChange={(e) =>
												setFieldValue('status', e.target.checked)
											}
											colorScheme='green'
										/>
									</FormControl>
								</ModalBody>

								<ModalFooter        bg={footerBg}
                  borderTop="1px solid"
                  borderColor={borderColor}
                  position="sticky"
                  bottom="0"
                  zIndex="10"
                  py={3}
                  px={5}
                  justifyContent="flex-end"
                  gap={3}>
									<Button onClick={onClose} mr={2}   borderRadius="md"
														size="sm">
										Cancel
									</Button>
									<Button type='submit' bg='#d99a36' color='white'   borderRadius="md"
                    size="sm">
										Save
									</Button>
								</ModalFooter>
							</Form>
						)}
					</Formik>
				</ModalContent>
			</Modal>

			{/* Unit Type Modal */}
			<Modal
				isOpen={isUnitTypeModalOpen}
				onClose={() => setIsUnitTypeModalOpen(false)}
				isCentered
			>
				<ModalOverlay />
				<ModalContent w={{ base: '95vw', md: '500px' }}>
					<ModalHeader>Create New Unit Type</ModalHeader>
					<ModalCloseButton />
					<Formik
						initialValues={{ name: '', status: true }}
						validationSchema={unitTypeValidationSchema}
						onSubmit={handleUnitTypeSave}
					>
						{({ errors, touched, values, setFieldValue }) => (
							<Form>
								<ModalBody pb={6}>
									<FormControl isInvalid={errors.name && touched.name}>
										<FormLabel>Unit Type Name</FormLabel>
										<Field
											as={Input}
											name='name'
											placeholder='Enter unit type name'
										/>
										{errors.name && touched.name && (
											<Text color='red.500' fontSize='sm'>
												{errors.name}
											</Text>
										)}
									</FormControl>

									<FormControl mt={4}>
										<FormLabel>Active Status</FormLabel>
										<Switch
											isChecked={values.status}
											onChange={(e) =>
												setFieldValue('status', e.target.checked)
											}
											colorScheme='green'
										/>
									</FormControl>
								</ModalBody>

								<ModalFooter>
									<Button onClick={() => setIsUnitTypeModalOpen(false)} mr={2}>
										Cancel
									</Button>
									<Button type='submit' bg='#d99a36' color='white'>
										Save
									</Button>
								</ModalFooter>
							</Form>
						)}
					</Formik>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default SubUnitType;
