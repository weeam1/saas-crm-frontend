import { useEffect, useState } from 'react';
import { Box, Button, Heading, HStack } from '@chakra-ui/react';
import ShortListedTable from './ShortListedTable';
import { toast } from 'react-toastify';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { FaUsers } from 'react-icons/fa';

const ShortListed = ({ data, loading, totalDocs, handleSort, sortConfig }) => {
	const headers = [
		{ key: 'name', label: 'Name' },
		{ key: 'email', label: 'Email' },
		{ key: 'position', label: 'Job Role' },
		{ key: 'phone', label: 'Phone No' },
		{ key: 'whatsApp', label: 'WhatsApp No' },
		{ key: 'createdAt', label: 'Apply Date' },
		// { key: 'nationality', label: 'Nationality' },
		{ key: 'action', label: 'Action' },
	];

	const handleViewCV = async (PdfURL) => {
		try {
			// Make a request to check if the file exists
			const response = await fetch(PdfURL, { method: 'HEAD' });

			if (!response.ok) {
				throw new Error('File not found');
			}

			// Open the PDF if it exists
			window.open(PdfURL, '_blank');
		} catch (error) {
			// Handle errors (e.g., file not found or server error)
			console.error('Error viewing CV:', error);
			toast.error('The requested CV could not be found.');
		}
	};

	const handleDownloadCV = async (pdfURL) => {
		try {
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

	return (
		<Box w='full' p={6} bg='white'>
			<Box
				display='flex'
				justifyContent='space-between'
				alignItems='center'
				p='1rem'
				mb='2'
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

				<Button
					colorScheme='brand'
					rounded='full'
					// onClick={() => setAdvanceSearch(true)}
				>
					Advanced Search
				</Button>
			</Box>

			<ShortListedTable
				headers={headers}
				data={data}
				handleSort={handleSort}
				sortConfig={sortConfig}
				loading={loading}
				handleViewCV={handleViewCV}
				handleDownloadCV={handleDownloadCV}
			/>
		</Box>
	);
};

export default ShortListed;
