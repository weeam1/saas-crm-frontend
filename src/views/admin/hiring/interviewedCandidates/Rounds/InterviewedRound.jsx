import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Box, Button, Heading, HStack } from '@chakra-ui/react';
import { FaUserCheck } from 'react-icons/fa';

import CandidateView from 'views/admin/hiring/candidates/components/CandidateView';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import SearchBar from 'components/search/SearchBar';
import TablePagination from 'components/pagination/TablePagination';
import { constant } from 'constant';

import { useDispatch, useSelector } from 'react-redux';
import { addMissingFile } from './../../../../../redux/missingFilesSlice';
import InterviewResult from './../InterviewResult';
import { useNavigate } from 'react-router-dom';
import InterviewedRoundTable from './InterviewRoundTable';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';

const InterviewedRound = ({
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
	const [searchData, setSearchData] = useState([]);
	const [interview, setInterview] = useState(null);
	const [interviewId, setInterviewId] = useState(null);
	const [isSearch, setIsSearch] = useState(false);

	const [resultModalOpen, setResultModalOpen] = useState(false);

	const headers = [
		{ key: 'name', label: 'Name', width: '250px' }, // Name column width
		{ key: 'email', label: 'Email', width: '250px' }, // Email column width
		{ key: 'agency', label: 'Agency', width: '100px' }, // Email column width
		{ key: 'position', label: 'Job Role', width: '150px' }, // Job Role column width
		{ key: 'phone', label: 'Phone No', width: '150px' }, // Phone No column width
		{ key: 'whatsApp', label: 'WhatsApp No', width: '150px' }, // WhatsApp No column width
		{ key: 'type', label: 'Type', width: '150px' }, // WhatsApp No column width
		{ key: 'percentageSocre', label: 'T.Percentage', width: '150px' }, // WhatsApp No column width
		{ key: 'action', label: 'Action', width: '200px' }, // Action column width
	];

	const dispatch = useDispatch();
	const missingFiles = useSelector((state) => state.missingFiles.missingFiles);

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

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
				entityId: interview?.candidate._id,
				status: 'success',
				message: `Candidate ${interview?.candidate.name}’s CV viewed by ${user?.fullName}.`,
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
				entityId: interview?.candidate._id,
				status: 'success',
				message: `Candidate ${interview?.candidate.name}’s CV downloaded by ${user?.fullName}.`,
			});
		} catch (error) {
			console.error('Error viewing CV:', error);
			toast.error('Failed to retrieve the CV. Please try again later.');
		}
	};

	const handleViewCandidate = async (id) => {
		const interview = data.find((item) => item.candidate._id === id);
		setInterview(interview);
		setApplicationOpen(true);

		createUserLog({
			userId: user?._id,
			action: 'VIEW',
			entity: 'Hiring',
			entityType: 'Application',
			entityId: interview.candidate._id,
			status: 'success',
			message: `Candidate ${interview.candidate.name}’s details viewed by ${user?.fullName}.`,
		});
	};

	// Update filtered data on search change
	const handleFilteredData = (filtered) => {
		setIsSearch(true);
		setSearchData(filtered);
	};

	const handleViewResult = (interview) => {
		setInterview(interview);
		setInterviewId(interview._id);
		setResultModalOpen(true);
	};

	const navigate = useNavigate();

	const handleSendOffer = (interviewId, offerType) => {
		navigate(
			`/hiring/interviewed-candidates/offer-letter/${interviewId}?type=${offerType}`
		);
	};

	// Update filtered data on search change
	const handleSearchTermChange = (term) => {
		if (!term) {
			setIsSearch(false);
			setSearchData(data); // Reset to original data
			return;
		}

		const filteredData = data.filter((item) =>
			item.candidate.name.toLowerCase().includes(term.toLowerCase())
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
				mb='4'
				shadow='none'
			>
				<HStack gap='2'>
					<FaUserCheck w='14' h='14' />
					<Heading size='20px' color='gray.800' fontWeight={"bold"}>
						Multi-Round Interviewed
						{data && (
							<span style={{ marginLeft: '6px' }}>
								({<CountUpComponent targetNumber={totalDocs || 0} />})
							</span>
						)}
					</Heading>
				</HStack>

				<HStack gap='2'>
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

			<InterviewedRoundTable
				headers={headers}
				data={isSearch ? searchData : data}
				handleSort={handleSort}
				sortConfig={sortConfig}
				loading={loading}
				handleViewResult={handleViewResult}
				handleViewCandidate={handleViewCandidate}
				handleSendOffer={handleSendOffer}
				refetch={refetch}
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
					candidate={interview.candidate}
					missingFiles={missingFiles}
					onViewCV={handleViewCV}
					onDownloadCV={handleDownloadCV}
					refetch={refetch}
				/>
			)}

			{resultModalOpen && (
				<InterviewResult
					onClose={() => setResultModalOpen(false)}
					isOpen={resultModalOpen}
					data={interview}
					interviewId={interviewId}
					refetch={refetch}
					mode='running'
					title='Previous Result'
				/>
			)}
		</Box>
	);
};

export default InterviewedRound;
