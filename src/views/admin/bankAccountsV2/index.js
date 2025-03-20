<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import AccountsView from './View';
import Header from './components/Header';
import Pagination from './components/Pagination';
import { useCreateItemMutation, useFetchItemsQuery } from 'api/apiSlice';
import { Box, Grid, Skeleton, useBreakpointValue } from '@chakra-ui/react';
import { toast } from 'react-toastify';

export default function Index() {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(25);
	const [accountsArray, setAccountsArray] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [totalLeads, setTotalLeads] = useState(0);
	console.log(accountsArray, 'account array index');

	const [createItemMutation, { isLoading: isAdding }] = useCreateItemMutation();

	const templateColumns = useBreakpointValue({
		base: 'repeat(1, 1fr)',
		sm: 'repeat(1, 1fr)',
		md: 'repeat(2, 1fr)',
		lg: 'repeat(3, 1fr)',
	});
=======

// import React, { useState, useEffect } from "react";
// import AccountsView from "./View";
// import Header from "./components/Header";
// import Pagination from "./components/Pagination";
// import { useCreateItemMutation, useFetchItemsQuery } from "api/apiSlice";
// import { Box, Grid, Skeleton, useBreakpointValue } from "@chakra-ui/react";
// import { toast } from "react-toastify";

// export default function Index() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(25); // Default to 25
//   const [accountsArray, setAccountsArray] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalLeads, setTotalLeads] = useState(0);
//   const [searchTerm, setSearchTerm] = useState(""); // Track search term

//   const {
//     data,
//     error,
//     isLoading: isGetting,
//     refetch,
//   } = useFetchItemsQuery({
//     path: searchTerm ? `/bankAccount/search?search=${searchTerm}` : "/bankAccount/get",
//     params: {
//       page: currentPage,
//       pageSize: pageSize,
//     },
//     refetchOnMountOrArgChange: true,
//   });

//   const [createItemMutation, { isLoading: isAdding }] = useCreateItemMutation();

//   const templateColumns = useBreakpointValue({
//     base: "repeat(1, 1fr)",
//     sm: "repeat(1, 1fr)",
//     md: "repeat(2, 1fr)",
//     lg: "repeat(3, 1fr)",
//   });

//   const gridProps = {
//     templateColumns,
//     gap: { base: 4, md: 6 },
//     p: { base: 4, md: 6 },
//   };

//   const skeletonCount = isGetting
//     ? accountsArray.length > 0
//       ? accountsArray.length
//       : 9
//     : 0;

//   useEffect(() => {
//     if (data) {
//       console.log("API Response:", data);
//       console.log("Setting accountsArray to:", data.data);
//       setAccountsArray(data.data || []);
//       setTotalPages(data.totalPages || 1);
//       setTotalLeads(data.total || 0);
//       console.log("Updated accountsArray:", data.data || []);
//     }
//     if (error) {
//       console.error("Error fetching accounts:", error);
//       toast.error(error?.data?.message || "Failed to fetch accounts. Please try again.");
//     }
//   }, [data, error]);

//   const handleAdd = async (newAccount) => {
//     try {
//       await createItemMutation({
//         path: "/bankAccount/add",
//         body: newAccount,
//       }).unwrap();
//       toast.success("The new account has been added successfully.");
//       setCurrentPage(1);
//       setSearchTerm(""); // Clear search on add
//       refetch();
//     } catch (error) {
//       console.error("Failed to add account:", error);
//       toast.error(
//         error?.data?.message || "Failed to add the account. Please try again."
//       );
//     }
//   };

//   const handleSearchResults = (term) => {
//     console.log("Search term received:", term);
//     setSearchTerm(term); // Update search term, triggering API refetch
//     setCurrentPage(1); // Reset to page 1 for new search
//   };

//   const handleFetchData = (searchTermFromPagination, page, size) => {
//     console.log("handleFetchData called with:", { searchTermFromPagination, page, size });
//     setCurrentPage(page);
//     setPageSize(size);
//     setSearchTerm(searchTermFromPagination); // Use search term from pagination if provided
//   };

//   console.log("Rendering with accountsArray:", accountsArray);

//   return (
//     <Box bg="white" borderRadius="8px" minHeight="100vh">
//       <Header
//         accountCount={totalLeads}
//         onAdd={handleAdd}
//         isAdding={isAdding}
//         // onSearchResults={handleSearchResults} // Re-enable search
//       />
//       <Pagination
//         data={accountsArray}
//         totalPages={totalPages}
//         totalLeads={totalLeads}
//         isLoading={isGetting}
//         fetchData={handleFetchData}
//         currentPage={currentPage}
//         setCurrentPage={setCurrentPage}
//         pageSize={pageSize}
//         setPageSize={setPageSize}
//         setData={setAccountsArray}
//         setTotalPages={setTotalPages}
//         setTotalLeads={setTotalLeads}
//       />
//       {isGetting ? (
//         <Grid {...gridProps}>
//           {Array.from({ length: skeletonCount }).map((_, index) => (
//             <Skeleton
//               key={index}
//               height="350px"
//               borderRadius="md"
//               startColor="gray.100"
//               endColor="gray.200"
//             />
//           ))}
//         </Grid>
//       ) : (
//         <AccountsView accounts={accountsArray} refetch={refetch} />
//       )}
//     </Box>
//   );
// }
import React, { useState, useEffect } from "react";
import AccountsView from "./View";
import Header from "./components/Header";
import Pagination from "./components/Pagination";
import { useCreateItemMutation, useFetchItemsQuery } from "api/apiSlice";
import { Box, Grid, Skeleton, useBreakpointValue } from "@chakra-ui/react";
import { toast } from "react-toastify";

export default function Index() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25); // Default to 25
  const [accountsArray, setAccountsArray] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Define the query as a constant within the component scope
  const bankAccountsQuery = useFetchItemsQuery({
    path: searchTerm ? `/bankAccount/search?search=${searchTerm}` : "/bankAccount/get",
    params: {
      page: currentPage,
      pageSize: pageSize,
    },
    refetchOnMountOrArgChange: true,
  });

  const { data, error, isLoading: isGetting, refetch } = bankAccountsQuery;

  const [createItemMutation, { isLoading: isAdding }] = useCreateItemMutation();
>>>>>>> 0dedbcfdf5d47ebe22a5e31836e3d8348f454f9a

	const gridProps = {
		templateColumns,
		gap: { base: 4, md: 6 },
		p: { base: 4, md: 6 },
	};

	const {
		data,
		error,
		isLoading: isGetting,
		refetch,
	} = useFetchItemsQuery(
		{
			path: '/bankAccount/get',
			params: {
				searchTerm: '',
				page: currentPage,
				pageSize: pageSize,
			},
		},
		{
			refetchOnMountOrArgChange: true,
		}
	);

	useEffect(() => {
		if (data) {
			console.log('API Response:', data);
			setAccountsArray(data.data || []);
			setTotalPages(data.totalPages || 1);
			setTotalLeads(data.total || 0);
		}
	}, [data]);

<<<<<<< HEAD
	useEffect(() => {
		refetch();
	}, [currentPage, pageSize]);

	const handleAdd = async (newAccount) => {
		try {
			await createItemMutation({
				path: '/bankAccount/add',
				body: newAccount,
			}).unwrap();
			toast.success('The new account has been added successfully.');
			setCurrentPage(1);
			refetch();
		} catch (error) {
			console.error('Failed to add account:', error);
			toast.error(
				error?.data?.message || 'Failed to add the account. Please try again.'
			);
		}
	};

	const handleSearchResults = (results) => {
		console.log('serach set ');
		setAccountsArray(results || []);
	};

	const handleFetchData = (searchTerm, page, size) => {
		console.log('fetch data ');
		setCurrentPage(page);
		setPageSize(size);
	};

	const skeletonCount = isGetting
		? accountsArray.length > 0
			? accountsArray.length
			: 9
		: 0;

	if (error) {
		console.error('Error fetching accounts:', error);
		toast.error(
			error?.data?.message || 'Failed to fetch accounts. Please try again.'
		);
	}

	return (
		<Box bg='white' borderRadius='8px' minHeight='100vh'>
			<Header
				accountCount={totalLeads}
				onAdd={handleAdd}
				isAdding={isAdding}
				onSearchResults={handleSearchResults}
			/>
			<Pagination
				data={accountsArray}
				totalPages={totalPages}
				totalLeads={totalLeads}
				isLoading={isGetting}
				fetchData={handleFetchData}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				pageSize={pageSize}
				setPageSize={setPageSize}
				setData={setAccountsArray}
				setTotalPages={setTotalPages}
				setTotalLeads={setTotalLeads}
			/>
			{isGetting ? (
				<Grid {...gridProps}>
					{Array.from({ length: skeletonCount }).map((_, index) => (
						<Skeleton
							key={index}
							height='350px'
							borderRadius='md'
							startColor='gray.100'
							endColor='gray.200'
						/>
					))}
				</Grid>
			) : (
				<AccountsView accounts={accountsArray} refetch={refetch} />
			)}
		</Box>
	);
}
=======
  useEffect(() => {
    if (data) {
      console.log("API Response:", data);
      console.log("Setting accountsArray to:", data.data);
      setAccountsArray(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalLeads(data.total || 0);
      console.log("Updated accountsArray:", data.data || []);
    }
    if (error) {
      console.error("Error fetching accounts:", error);
      toast.error(error?.data?.message || "Failed to fetch accounts. Please try again.");
    }
  }, [data, error]);

  const handleAdd = async (newAccount) => {
    try {
      await createItemMutation({
        path: "/bankAccount/add",
        body: newAccount,
      }).unwrap();
      toast.success("The new account has been added successfully.");
      setCurrentPage(1);
      setSearchTerm(""); // Clear search on add
      refetch();
    } catch (error) {
      console.error("Failed to add account:", error);
      toast.error(
        error?.data?.message || "Failed to add the account. Please try again."
      );
    }
  };

  const handleSearchResults = (term) => {
    console.log("Search term received:", term);
    const newSearchTerm = term || ""; // Ensure null/undefined becomes ""
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Reset to page 1 for new search
  };

  const handleFetchData = (searchTermFromPagination, page, size) => {
    console.log("handleFetchData called with:", { searchTermFromPagination, page, size });
    setCurrentPage(page);
    setPageSize(size);
    setSearchTerm(searchTermFromPagination); // Use search term from pagination if provided
  };

  console.log("Rendering with accountsArray:", accountsArray);

  return (
    <Box bg="white" borderRadius="8px" minHeight="100vh">
      <Header
        accountCount={totalLeads}
        onAdd={handleAdd}
        isAdding={isAdding}
        onSearchResults={handleSearchResults}
      />
      <Pagination
        data={accountsArray}
        totalPages={totalPages}
        totalLeads={totalLeads}
        isLoading={isGetting}
        fetchData={handleFetchData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        setData={setAccountsArray}
        setTotalPages={setTotalPages}
        setTotalLeads={setTotalLeads}
      />
      {isGetting ? (
        <Grid {...gridProps}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <Skeleton
              key={index}
              height="350px"
              borderRadius="md"
              startColor="gray.100"
              endColor="gray.200"
            />
          ))}
        </Grid>
      ) : (
        <AccountsView accounts={accountsArray} refetch={refetch} />
      )}
    </Box>
  );
}
>>>>>>> 0dedbcfdf5d47ebe22a5e31836e3d8348f454f9a
