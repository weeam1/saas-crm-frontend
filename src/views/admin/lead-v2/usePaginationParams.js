import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const usePaginationParams = (defaultPage = 1, defaultPageSize = 32) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const initialPage = Number(searchParams.get('page')) || defaultPage;
	const initialPageSize =
		Number(searchParams.get('pageSize')) || defaultPageSize;
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [pageSize, setPageSize] = useState(initialPageSize);

	useEffect(() => {
		const pageParam = Number(searchParams.get('page')) || defaultPage;
		const pageSizeParam =
			Number(searchParams.get('pageSize')) || defaultPageSize;
		if (pageParam !== currentPage) {
			setCurrentPage(pageParam);
		}
		if (pageSizeParam !== pageSize) {
			setPageSize(pageSizeParam);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	useEffect(() => {
		if (
			searchParams.get('page') !== String(currentPage) ||
			searchParams.get('pageSize') !== String(pageSize)
		) {
			setSearchParams({ page: currentPage, pageSize });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, pageSize]);

	return { currentPage, setCurrentPage, pageSize, setPageSize };
};

export default usePaginationParams;
