import CountUpComponent from 'components/countUpComponent/countUpComponent';
import {
	Badge,
	Box,
	Button,
	Flex,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import { usePermissions } from 'hooks/usePermissions';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import TopPagination from 'components/pagination/TopPagination';
import UpsertSubCategory from './UpsertSubCategory';
import SubCategoryTable from './SubCategoryTable';

const SubCategory = () => {
	const [subCategories, setCategories] = useState([]);
	const [page, setPage] = useState(1);
	const { hasPermission } = usePermissions();
	const navigate = useNavigate();

	const {
		isOpen: categoryIsOpen,
		onClose: categoryOnClose,
		onOpen: categoryOpen,
	} = useDisclosure();

	const [editData, setEditData] = useState(null);

	const handleOpenAdd = () => {
		setEditData(null);
		categoryOpen();
	};

	const handleOpenEdit = (category) => {
		setEditData(category);
		categoryOpen();
	};

	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
	});

	const queryParams = useMemo(() => {
		return {
			page: pagination.page,
			limit: pagination.limit,
		};
	}, [pagination]);

	const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
		{
			path: 'finance/expenses/subcategories',
			params: queryParams,
		},
		{
			refetchOnMountOrArgChange: true,
		}
	);

	useEffect(() => {
		if (data?.doc?.length) {
			setCategories(data?.doc);
		}
	}, [data?.doc]);

	useEffect(() => {
		refetch();
	}, [page, refetch]);

	const updateData = (id, updated) => {
		setCategories((prev) => {
			const exists = prev.some((item) => item._id === id);
			if (exists) {
				// Update existing category
				return prev.map((item) =>
					item._id === id ? { ...item, ...updated } : item
				);
			}
			// Add new category if not found
			return [{ ...updated }, ...prev];
		});
	};

	const removeCategory = (id) => {
		setCategories((prev) => prev.filter((item) => item._id !== id));
	};

	const handlePageChange = (page) => {
		setPagination((prev) => ({ ...prev, page: Number(page) }));
	};

	const handlePageSize = (limit) => {
		setPagination({ page: 1, limit: Number(limit) });
	};

	return (
		<Box p={6} bg='white' borderRadius='md' boxShadow='sm'>
			<Flex
				flexDir={{ base: 'column', md: 'row' }}
				justify='space-between'
				align='center'
				mb={4}
			>
				<Flex alignSelf='flex-start' fontSize='lg' fontWeight='bold' gap='2'>
					<Text>All Sub Categories</Text>

					<CountUpComponent
						key={subCategories?.length}
						targetNumber={subCategories?.length}
					/>
				</Flex>

				<Button
					alignSelf='flex-end'
					leftIcon={<FaPlus size='1em' />}
					colorScheme='brand'
					size='sm'
					rounded='md'
					px={4}
					shadow='md'
					onClick={handleOpenAdd}
				>
					Add Sub Category
				</Button>
			</Flex>

			{!isLoading && (
				<TopPagination
					currentPage={queryParams.page}
					totalPages={data?.totalPages}
					onPageChange={handlePageChange}
					totalItems={data?.totalRecords}
					itemsPerPage={queryParams.limit}
					refetching={isFetching}
					loading={isLoading}
					handlePageSize={handlePageSize}
				/>
			)}

			<SubCategoryTable
				data={subCategories}
				updateData={updateData}
				handleOpenEdit={handleOpenEdit}
				removeCategory={removeCategory}
				isLoading={isLoading || isFetching}
			/>

			{categoryIsOpen && (
				<UpsertSubCategory
					isOpen={categoryIsOpen}
					onClose={categoryOnClose}
					initialData={editData}
					updateData={updateData}
					mode='Add'
				/>
			)}
		</Box>
	);
};

export default SubCategory;
