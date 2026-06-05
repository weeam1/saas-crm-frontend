import CountUpComponent from 'components/countUpComponent/countUpComponent';
import {
	Box,
	Button,
	Flex,
	IconButton,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import TopPagination from 'components/pagination/TopPagination';
import UpsertSubCategory from './UpsertSubCategory';
import SubCategoryTable from './SubCategoryTable';
import CustomTooltip from 'components/shared/CustomTooltip';
import RefreshButton from 'components/refresh/RefreshButton';
const SubCategory = () => {
	const [subCategories, setCategories] = useState([]);

	const [searchParams] = useSearchParams();
	const activeTab = searchParams.get('tab') || 'sub-category';

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
			activeTab,
		},
		{
			skip: activeTab !== 'sub-category',
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
			refetchOnReconnect: true,
		},
	);

	useEffect(() => {
		if (data?.doc?.length) {
			setCategories(data?.doc);
		}
	}, [data?.doc]);

	// useEffect(() => {
	// 	refetch();
	// }, [pagination, refetch]);

	const updateData = (id, updated) => {
		setCategories((prev) => {
			const exists = prev.some((item) => item._id === id);
			if (exists) {
				// Update existing category
				return prev.map((item) =>
					item._id === id ? { ...item, ...updated } : item,
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
		<Box p={6} bg='bg.surface' borderRadius='lg' boxShadow='card'>
			<Flex
				flexDir={{ base: 'column', md: 'row' }}
				justify='space-between'
				align='center'
				mb={4}
			>
				<Flex
					alignSelf='flex-start'
					color='white'
					fontSize='lg'
					fontWeight='bold'
					gap='2'
				>
					<Text>All Sub Categories</Text>

					<CountUpComponent
						key={data?.totalRecords}
						targetNumber={data?.totalRecords}
					/>
				</Flex>
				<Flex gap={2}>
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
						<RefreshButton
																label="Refresh"
																onClick={() => refetch()}
																isLoading={isLoading}
																isFetching={isFetching}
																size="sm"
															/>
				</Flex>
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
