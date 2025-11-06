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
import CategoryTable from './CategoryTable';
import UpsertCategory from './UpsertCategory';

const Category = () => {
	const [categories, setCategories] = useState([]);
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

	const handleSubmit = (formData) => {
		console.log('Submitted:', formData);
		// your API call here
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
			path: 'finance/expenses/categories',
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
					<Text>All Categories</Text>

					<CountUpComponent
						key={categories?.length}
						targetNumber={categories?.length}
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
					Add Category
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

			<CategoryTable
				data={categories}
				updateData={updateData}
				removeCategory={removeCategory}
				handleOpenEdit={handleOpenEdit}
				isLoading={isLoading || isFetching}
			/>

			{categoryIsOpen && (
				<UpsertCategory
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

export default Category;
