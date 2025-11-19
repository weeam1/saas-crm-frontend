import { ChevronDownIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	Heading,
	Image,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Text,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { HSeparator } from 'components/separator/Separator';
import { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { getApi } from 'services/api';
import Delete from './Delete';
import Edit from './Edit';
import { useDispatch, useSelector } from 'react-redux';
import { constant } from 'constant';

// import DefaultUserImage from 'assets/img/avatars/user.jpg';
import DefaultUserImage from 'assets/logo/logo.png';

import Loader from 'components/loading/Loader';
import DisplayField from 'components/displays/DisplayField';
import { useFetchItemsQuery } from 'api/apiSlice';
import { formatCurrency } from 'utils/helpers';
import useUserSession from 'hooks/useUserSession';

const View = () => {
	const RoleColumn = [
		{ Header: '#', accessor: '_id', width: 10, display: false },
		{ Header: 'Role Name', accessor: 'roleName' },
		{ Header: 'Description', accessor: 'description' },
	];
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.user.user);

	const navigate = useNavigate();

	const { user, isSuperAdmin, isAdmin, userRoleName } = useUserSession();

	const userName =
		typeof userData === 'string' ? JSON.parse(userData) : userData;

	const param = useParams();

	const [delayedLoading, setDelayedLoading] = useState(true);

	const { data, isLoading, refetch, isFetching } = useFetchItemsQuery(
		{
			path: `/user/v2/view/${param.id}`,
		},
		{
			skip: !param.id,
			refetchOnMountOrArgChange: true,
		}
	);

	useEffect(() => {
		if (isLoading || isFetching) {
			setDelayedLoading(true);
		}

		const timer = setTimeout(() => {
			setDelayedLoading(isLoading || isFetching);
		}, 1500);

		return () => clearTimeout(timer);
	}, [isLoading, isFetching]);

	const handleOpenModal = (userData) => {
		setEdit(true);
		// dispatch(setIsOpen(true));
		// dispatch(setUser(userData));
	};

	// const [data, setData] = useState();
	const [roleData, setRoleData] = useState([]);
	// const { isOpen, onOpen, onClose } = useDisclosure();
	const [edit, setEdit] = useState(false);
	const [deleteModel, setDelete] = useState(false);
	const [roleModal, setRoleModal] = useState(false);
	const [isLoding, setIsLoding] = useState(false);
	const [action, setAction] = useState(false);

	const [preview, setPreview] = useState(DefaultUserImage);

	useEffect(() => {
		if (data?.profileImage && typeof data?.profileImage === 'string') {
			const imageUrl = `${constant['baseUrl']}${data?.profileImage}`;

			const img = new window.Image();
			img.src = imageUrl;

			img.onload = () => setPreview(imageUrl);
			img.onerror = () => setPreview(DefaultUserImage);
		} else {
			setPreview(DefaultUserImage);
		}
	}, [data?.profileImage]);

	const size = 'lg';

	useEffect(async () => {
		setIsLoding(true);
		let result = await getApi('api/role-access');
		setRoleData(result.data);
		setIsLoding(false);
	}, []);

	return (
		<>
			{isLoading || isFetching || delayedLoading ? (
				<Box height='60vh' p='8'>
					<Loader />
				</Box>
			) : (
				<>
					<Card>
						<Grid templateColumns={'repeat(12, 1fr)'} gap={4}>
							<GridItem colSpan={{ base: 12, md: 6 }}>
								<Heading size='md' mb={3} textTransform={'capitalize'}>
									{/* {data?.firstName || data?.lastName
										? `${data?.firstName} ${data?.lastName}`
										: 'User'}{' '} */}
									User Information
								</Heading>
							</GridItem>
							<GridItem mb='4' colSpan={{ base: 12, md: 6 }}>
								<Flex
									justifyContent={{ base: 'start', sm: 'start', md: 'end' }}
								>
									{isSuperAdmin || isAdmin || userRoleName === 'Manager' ? (
										<Menu>
											<MenuButton
												variant='outline'
												colorScheme='blackAlpha'
												size='sm'
												va
												mr={2.5}
												as={Button}
												rightIcon={<ChevronDownIcon />}
											>
												Actions
											</MenuButton>
											<MenuDivider />
											<MenuList minWidth={'13rem'}>
												{/* <MenuItem
													alignItems={'start'}
													onClick={() => onOpen()}
													icon={<AddIcon />}
												>
													Add
												</MenuItem> */}
												<MenuItem
													alignItems={'start'}
													onClick={() => {
														setEdit(true);
													}}
													icon={<EditIcon />}
													color='green'
												>
													Edit
												</MenuItem>
												{/* {data?.role !== 'superAdmin' &&
													JSON.parse(localStorage.getItem('user'))?.role ===
														'superAdmin' && (
														<>
															<MenuDivider />
															<MenuItem
																alignItems={'start'}
																onClick={() => setDelete(true)}
																icon={<DeleteIcon />}
															>
																Delete
															</MenuItem>
														</>
													)} */}
											</MenuList>
										</Menu>
									) : (
										data?._id === user?._id &&
										!isSuperAdmin && (
											<Button
												onClick={() => handleOpenModal(userData)}
												leftIcon={<EditIcon />}
												mr={2.5}
												variant='outline'
												size='sm'
												colorScheme='green'
											>
												Edit
											</Button>
										)
									)}
									<Button
										leftIcon={<IoIosArrowBack />}
										variant='brand'
										size='sm'
										onClick={() => navigate('/users')}
									>
										Back
									</Button>
								</Flex>
							</GridItem>
						</Grid>
						<HSeparator />
						{data ? (
							<Grid
								templateColumns={{
									base: 'repeat(1, 1fr)',
									md: 'repeat(2, 1fr)',
								}}
								gap={6}
								mt='5'
								px={{ base: 10, md: 14, lg: 18 }}
							>
								{/* Profile Section */}
								<GridItem colSpan={{ base: 1, md: 2 }} textAlign='center'>
									<Box
										position='relative'
										display='inline-block'
										w={{ base: '80px', md: '160px' }}
										h={{ base: '80px', md: '160px' }}
										borderRadius='full'
										overflow='hidden'
										boxShadow='lg'
									>
										<Image
											src={preview}
											alt='Profile'
											w='full'
											h='full'
											objectFit='cover'
										/>
									</Box>
								</GridItem>

								{/* Personal Information Section */}
								<GridItem colSpan={{ base: 1, md: 2 }}>
									<Box p={4}>
										<Text fontSize='lg' fontWeight='bold' mb={2}>
											Personal Information
										</Text>
										<Grid
											templateColumns={{ base: '1fr', md: '1fr 1fr' }}
											gap={4}
										>
											<DisplayField
												label='First Name'
												value={data?.firstName}
											/>
											<DisplayField label='Last Name' value={data?.lastName} />
											<DisplayField
												label='Phone Number'
												value={data?.phoneNumber}
											/>
											<DisplayField label='User Email' value={data?.username} />
											<DisplayField
												label='Role'
												value={
													data?.role === 'superAdmin'
														? 'Super Admin'
														: data?.roles[0]?.roleName
												}
											/>
										</Grid>
									</Box>
								</GridItem>

								<GridItem colSpan={{ base: 1, md: 2 }}>
									<HSeparator />
								</GridItem>

								{/* Work Information Section */}
								<GridItem colSpan={{ base: 1, md: 2 }}>
									<Box p={4}>
										<Text fontSize='lg' fontWeight='bold' mb={2}>
											Work Information
										</Text>
										<Grid
											templateColumns={{ base: '1fr', md: '1fr 1fr' }}
											gap={4}
										>
											<DisplayField
												label='Salary Type'
												value={data?.salaryType}
											/>
											<DisplayField label='Salary' value={data?.salary} />
											{data?.incentive && (
												<DisplayField
													label='Incentive'
													value={data?.incentive}
												/>
											)}
											{data?.commission && (
												<DisplayField
													label='Commission'
													value={data?.commission}
												/>
											)}
											<DisplayField
												label='Target'
												value={formatCurrency(data?.target, data?.currency)}
											/>
											<DisplayField label='Agency' value={data?.agency?.name} />
										</Grid>
									</Box>
								</GridItem>
							</Grid>
						) : (
							<Text>User data not found.</Text>
						)}
					</Card>
					{/* {data?.role !== 'superAdmin' && !isLoading && (
						<Card mt={3}>
							<RoleTable
								fetchData={refetch}
								columnsData={RoleColumn}
								roleModal={roleModal}
								setRoleModal={setRoleModal}
								tableData={data?.roles || []}
								title={'Role'}
							/>
						</Card>
					)} */}
				</>
			)}

			{/* <Card mt={3}>
							<Grid templateColumns='repeat(6, 1fr)' gap={1}>
								<GridItem colStart={6}>
									<Flex justifyContent={'right'}>
										<Button
											onClick={() => handleOpenModal(userData)}
											leftIcon={<EditIcon />}
											mr={2.5}
											variant='outline'
											size='sm'
											colorScheme='green'
										>
											Edit
										</Button>
										{data?.role !== 'superAdmin' &&
											JSON.parse(localStorage.getItem('user'))?.role ===
												'superAdmin' && (
												<Button
													size='sm'
													style={{ background: 'red.800' }}
													onClick={() => setDelete(true)}
													leftIcon={<DeleteIcon />}
													colorScheme='red'
												>
													Delete
												</Button>
											)}
									</Flex>
								</GridItem>
							</Grid>
						</Card> */}

			{/* {roleModal && (
				<RoleModal
					fetchData={refetch}
					isOpen={roleModal}
					onClose={setRoleModal}
					columnsData={RoleColumn}
					id={param.id}
					tableData={roleData}
					interestRoles={data?.roles.map((item) => item._id)}
				/>
			)} */}

			{/* {isOpen && <Add isOpen={isOpen} size={size} onClose={onClose} />} */}
			{edit && (
				<Edit
					isOpen={edit}
					size={size}
					onClose={setEdit}
					userData={userName}
					setAction={setAction}
					selectedId={param?.id}
					setEdit={setEdit}
					fetchData={refetch}
					data={data}
				/>
			)}

			{deleteModel && (
				<Delete
					isOpen={deleteModel}
					onClose={setDelete}
					method='one'
					url='api/user/delete/'
					id={param.id}
				/>
			)}
		</>
	);
};

export default View;
