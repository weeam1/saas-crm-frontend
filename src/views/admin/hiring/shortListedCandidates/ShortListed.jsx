import { useState } from 'react';
import { toast } from 'react-toastify';
import { Box, Button, Heading, HStack, useDisclosure } from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa';

import CandidateView from 'views/admin/hiring/candidates/components/CandidateView';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import SearchBar from 'components/search/SearchBar';
import TablePagination from 'components/pagination/TablePagination';
import ArrangeInterview from './components/ArrangeInterview';
import ShortListedTable from './components/ShortListedTable';
import { constant } from 'constant';
import { useUpdateItemMutation } from 'api/apiSlice';

const ShortListed = ({
	data,
	allData,
	loading,
	totalDocs,
	handleSort,
	sortConfig,
	refetch,
	totalPages,
	currentPage,
	pageSize,
	handleGotoPage,
	handlePageSizeChange,
	gopageValue,
	setGopageValue,
	setAdvanceSearch,
}) => {
	const [isApplicationOpen, setApplicationOpen] = useState(false);
	const [candidate, setCandidate] = useState(null);
	const [searchData, setSearchData] = useState([]);
	const [isSearch, setIsSearch] = useState(false);

	const [updateItemMuation, { isLoading: isInviting }] =
		useUpdateItemMutation();

	const headers = [
		{ key: 'name', label: 'Name', width: '200px' }, // Name column width
		{ key: 'email', label: 'Email', width: '250px' }, // Email column width
		{ key: 'position', label: 'Job Role', width: '150px' }, // Job Role column width
		{ key: 'phone', label: 'Phone No', width: '150px' }, // Phone No column width
		{ key: 'whatsApp', label: 'WhatsApp No', width: '150px' }, // WhatsApp No column width
		{ key: 'createdAt', label: 'Apply Date', width: '150px' }, // Apply Date column width
		{ key: 'action', label: 'Action', width: '200px' }, // Action column width
	];

	const [arrangeInterviewOpen, setArrangeInterviewOpen] = useState(false);

	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTime, setSelectedTime] = useState('');

	const handleScheduleInterview = async () => {
		console.log('Date:', selectedDate);
		console.log('Time:', selectedTime);

		try {
			await updateItemMuation({
				path: `/applications/schedule-interview/${candidate._id}`,
				body: {
					interviewDate: selectedDate,
					interviewTime: selectedTime,
				},
			}).unwrap();

			toast.success('Invite succesfully sended');
		} catch (err) {
			console.log(err);
		} finally {
			setArrangeInterviewOpen(false);
		}
	};

	const handleViewCV = async (resume) => {
		try {
			const pdfURL = `${constant['baseUrl']}${resume}`;

			// Make a request to check if the file exists
			const response = await fetch(pdfURL, { method: 'HEAD' });

			if (!response.ok) {
				throw new Error('File not found');
			}

			// Open the PDF if it exists
			window.open(pdfURL, '_blank');
		} catch (error) {
			// Handle errors (e.g., file not found or server error)
			console.error('Error viewing CV:', error);
			toast.error('The requested CV could not be found.');
		}
	};

	const handleDownloadCV = async (resume) => {
		try {
			const pdfURL = `${constant['baseUrl']}${resume}`;

			// Check if the file exists using a HEAD request
			const response = await fetch(pdfURL, { method: 'HEAD' });

			if (!response.ok) {
				throw new Error('File not found');
			}

			// Create an anchor element for the download
			const link = document.createElement('a');
			link.href = pdfURL;
			link.download = pdfURL.split('/').pop(); // Extract the file name from the URL
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link); // Clean up the DOM
		} catch (error) {
			console.error('Error downloading CV:', error);
			toast.error('The requested CV could not be downloaded.');
		}
	};

	const handleViewCandidate = async (id) => {
		const selectedCandidate = data.find((item) => item._id === id);
		setCandidate(selectedCandidate);
		setApplicationOpen(true);
	};

	const handleArrangeInterview = async (id) => {
		const selectedCandidate = data.find((item) => item._id === id);
		setCandidate(selectedCandidate);
		setArrangeInterviewOpen(true);
	};

	// Update filtered data on search change
	const handleFilteredData = (filtered) => {
		setIsSearch(true);
		setSearchData(filtered);

		console.log({ searchData });
	};

	return (
		<Box w='full' p={6} bg='white' rounded='md' shadow='sm'>
			<Box
				display='flex'
				justifyContent='space-between'
				alignItems={{ base: 'flex-start', md: 'center' }}
				flexDirection={{ base: 'column', md: 'row' }}
				px='.5rem'
				shadow='none'
			>
				<HStack gap='2'>
					<FaUsers w='14' h='14' />
					<Heading size='md' color='gray.800'>
						Short Listed
						{data && (
							<span style={{ marginLeft: '6px' }}>
								({<CountUpComponent targetNumber={totalDocs || 0} />})
							</span>
						)}
					</Heading>
				</HStack>

				<HStack gap='2'>
					<SearchBar data={allData?.doc} onFilteredData={handleFilteredData} />

					<Button
						colorScheme='brand'
						rounded='full'
						size={{ base: 'sm', md: 'md' }} // Adjusts the size
						px={{ base: 4, md: 6 }} // Adjust padding for different breakpoints
						py={{ base: 2, md: 3 }} // Adjust vertical padding
						fontSize={{ base: 'sm', md: 'md' }} // Adjust font size
						onClick={() => setAdvanceSearch(true)}
					>
						Advanced Search
					</Button>
				</HStack>
			</Box>

			<ShortListedTable
				headers={headers}
				data={isSearch ? searchData : data}
				handleSort={handleSort}
				sortConfig={sortConfig}
				loading={loading}
				handleViewCandidate={handleViewCandidate}
				handleArrangeInterview={handleArrangeInterview}
			/>
			{data?.length > 0 && (
				<TablePagination
					gotoPage={handleGotoPage}
					gopageValue={gopageValue}
					setGopageValue={setGopageValue}
					pageCount={totalPages}
					canPreviousPage={currentPage > 1}
					previousPage={() => handleGotoPage(currentPage - 2)}
					canNextPage={currentPage < totalPages}
					nextPage={() => handleGotoPage(currentPage)}
					pageOptions={Array.from({ length: totalPages })}
					setPageSize={handlePageSizeChange}
					pageSize={pageSize}
					pageIndex={currentPage - 1}
					totalDocs={totalDocs}
				/>
			)}

			{isApplicationOpen && (
				<CandidateView
					isOpen={isApplicationOpen}
					onClose={() => setApplicationOpen(false)}
					candidate={candidate}
					onViewCV={handleViewCV}
					onDownloadCV={handleDownloadCV}
					refetch={refetch}
				/>
			)}

			{arrangeInterviewOpen && (
				<ArrangeInterview
					isOpen={arrangeInterviewOpen}
					onClose={() => setArrangeInterviewOpen(false)}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
					selectedTime={selectedTime}
					setSelectedTime={setSelectedTime}
					isLoading={isInviting}
					handleScheduleInterview={handleScheduleInterview}
				/>
			)}
		</Box>
	);
};

export default ShortListed;
