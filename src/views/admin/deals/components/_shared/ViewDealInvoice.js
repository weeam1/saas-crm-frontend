import { Button, IconButton } from '@chakra-ui/react';
import CustomTooltip from 'components/shared/CustomTooltip';
import { constant } from 'constant';
import { FiFileText } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ViewDealInvoice = ({ deal, type }) => {
	if (!deal.invoiceSent || !deal.invoiceUrl) return null;

	const handleViewInvoice = async () => {
		try {
			const pdfURL = `${constant['baseUrl']}${deal.invoiceUrl}`;

			// Send a single HEAD request to check if the file exists
			const response = await fetch(pdfURL, { method: 'HEAD' });

			if (!response.ok) {
				toast.error('Invoice not found!');
				return;
			}

			// Open the PDF if it exists
			window.open(pdfURL, '_blank');
		} catch (error) {
			console.error('Error viewing Invoice:', error);
			toast.error('Failed to retrieve the Invoice. Please try again later.');
		}
	};

	return type === 'button' ? (
		<Button
			onClick={handleViewInvoice}
			leftIcon={<FiFileText />}
			colorScheme='blue'
			variant='outline'
			py='4'
			size='md'
			w='full'
		>
			View Invoice
		</Button>
	) : (
		<CustomTooltip label='View Invoice'>
			<IconButton
				onClick={handleViewInvoice}
				icon={<FiFileText />}
				colorScheme='blue'
				variant='ghost'
				size='sm'
			/>
		</CustomTooltip>
	);
};

export default ViewDealInvoice;
