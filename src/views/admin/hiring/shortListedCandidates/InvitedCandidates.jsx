import { useState } from 'react';
import { toast } from 'react-toastify';
import { Box, Button, Heading, HStack } from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa';

import CandidateView from 'views/admin/hiring/candidates/components/CandidateView';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import SearchBar from 'components/search/SearchBar';
import TablePagination from 'components/pagination/TablePagination';
import ArrangeInterview from './components/ArrangeInterview';
import { constant } from 'constant';
import { useUpdateItemMutation } from 'api/apiSlice';
import InvitedTable from './components/InvitedTable';
import { addMissingFile } from './../../../../redux/missingFilesSlice';

import { useDispatch, useSelector } from 'react-redux';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';

const InvitedCandidates = ({
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

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	const headers = [
		{ key: 'name', label: 'Name', width: '300px' }, // Name column width
		{ key: 'email', label: 'Email', width: '250px' }, // Email column width
		{ key: 'agency', label: 'Agency', width: '100px' }, // Email column width
		{ key: 'position', label: 'Job Role', width: '150px' }, // Job Role column width
		{ key: 'phone', label: 'Phone No', width: '150px' }, // Phone No column width
		{ key: 'whatsApp', label: 'WhatsApp No', width: '150px' }, // WhatsApp No column width
		{
			key: 'interviewDate&Time',
			label: 'Interveiw Date',
			width: '150px',
		}, // Apply Date column width
		{ key: 'action', label: 'Action', width: '200px' }, // Action column width
	];

	const [arrangeInterviewOpen, setArrangeInterviewOpen] = useState(false);

	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTime, setSelectedTime] = useState('');

	const handleScheduleInterview = async () => {
		try {
			await updateItemMuation({
				path: `/applications/schedule-interview/${candidate._id}`,
				body: {
					interviewDate: selectedDate,
					interviewTime: selectedTime,
				},
			}).unwrap();

			toast.success('Invite succesfully sended');

			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Hiring',
				entityType: 'Application',
				entityId: candidate._id,
				status: 'success',
				message: `Interview invitation sent to ${candidate.name} by ${user?.fullName}.`,
			});
		} catch (err) {
			console.log(err);
			const errorMsg =
				err?.data?.message || 'Interview is not arranged, please try again.';
			toast.error(errorMsg);
			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Hiring',
				entityType: 'Application',
				entityId: candidate._id,
				status: err?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		} finally {
			setArrangeInterviewOpen(false);
		}
	};

	const dispatch = useDispatch();
	const missingFiles = useSelector((state) => state.missingFiles.missingFiles);

	const handleViewCV = async (resume) => {
		try {
			const pdfURL = `${constant['baseUrl']}${resume}`;

			// Check if this file was already marked as missing
			if (missingFiles.includes(resume)) {
				toast.error('CV not found!');
				return; // Stop further execution
			}

			// Send a single HEAD request to check if the file exists
			const response = await fetch(pdfURL, { method: 'HEAD' });

			if (!response.ok) {
				// Store the missing file to prevent future requests
				dispatch(addMissingFile(resume));
				toast.error('CV not found!');
				return;
			}

			// Open the PDF if it exists
			window.open(pdfURL, '_blank');
			createUserLog({
				userId: user?._id,
				action: 'VIEW',
				entity: 'Hiring',
				entityType: 'Application',
				entityId: candidate._id,
				status: 'success',
				message: `Candidate ${candidate.name}’s CV viewed by ${user?.fullName}.`,
			});
		} catch (error) {
			console.error('Error viewing CV:', error);
			toast.error('Failed to retrieve the CV. Please try again later.');
		}
	};
	const handleDownloadCV = async (resume) => {
		try {
			const pdfURL = `${constant['baseUrl']}${resume}`;
			// Check if this file was already marked as missing
			if (missingFiles.includes(resume)) {
				toast.error('CV could not be downloaded');
				return;
			}

			// Check if the file exists using a HEAD request
			const response = await fetch(pdfURL, { method: 'HEAD' });

			if (!response.ok) {
				// Store the missing file to prevent future requests
				dispatch(addMissingFile(resume));
				toast.error('CV could not be downloaded');
				return;
			}

			// Create an anchor element for the download
			const link = document.createElement('a');
			link.href = pdfURL;
			link.download = pdfURL.split('/').pop(); // Extract the file name from the URL
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link); // Clean up the DOM

			createUserLog({
				userId: user?._id,
				action: 'VIEW',
				entity: 'Hiring',
				entityType: 'Application',
				entityId: candidate._id,
				status: 'success',
				message: `Candidate ${candidate.name}’s CV downloaded by ${user?.fullName}.`,
			});
		} catch (error) {
			console.error('Error viewing CV:', error);
			toast.error('Failed to retrieve the CV. Please try again later.');
		}
	};

	const handleViewCandidate = async (id) => {
		const selectedCandidate = data.find((item) => item._id === id);
		setCandidate(selectedCandidate);
		setApplicationOpen(true);

		if (selectedCandidate) {
			createUserLog({
				userId: user?._id,
				action: 'VIEW',
				entity: 'Hiring',
				entityType: 'Application',
				entityId: selectedCandidate?._id,
				status: 'success',
				message: `Candidate ${selectedCandidate?.name}’s details viewed by ${user?.fullName}.`,
			});
		}
	};

	// Update filtered data on search change
	const handleFilteredData = (filtered) => {
		setIsSearch(true);
		setSearchData(filtered);
	};

	// Update filtered data on search change
	const handleSearchTermChange = (term) => {
		if (!term) {
			setIsSearch(false);
			setSearchData([]); // Reset to original data
			return;
		}

		const filteredData = allData?.doc?.filter((item) =>
			item.name.toLowerCase().includes(term.toLowerCase())
		);

		setIsSearch(true);
		setSearchData(filteredData);
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
				mb={2}
				gap='2'
			>
				<HStack gap='2'>
					<FaUsers w='14' h='14' />
					<Heading size='20px' color='gray.800' fontWeight={'bold'}>
						Invited Candidates
						{data && (
							<span style={{ marginLeft: '6px' }}>
								({<CountUpComponent targetNumber={totalDocs || 0} />})
							</span>
						)}
					</Heading>
				</HStack>

				<HStack
					w={{ base: '100%', md: 'fit-content' }}
					justify='flex-end'
					flexDir={{ base: 'column', md: 'row' }}
					gap='2'
				>
					{/* <SearchBar data={allData?.doc} onFilteredData={handleFilteredData} /> */}

					<SearchBar onSearchTermChange={handleSearchTermChange} />

					<Button
						colorScheme='brand'
						rounded='md'
						size={'sm'} // Adjusts the size
						py={3}
						px={6}
						onClick={() => setAdvanceSearch(true)}
					>
						Advanced Search
					</Button>
				</HStack>
			</Box>

			<InvitedTable
				headers={headers}
				data={isSearch ? searchData : data}
				handleSort={handleSort}
				sortConfig={sortConfig}
				loading={loading}
				handleViewCandidate={handleViewCandidate}
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
					missingFiles={missingFiles}
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

export default InvitedCandidates;
