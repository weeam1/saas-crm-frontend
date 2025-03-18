import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
} from '@chakra-ui/react';

const PdfViewer = ({ isOpen, onClose, pdfUrl }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} size='full'>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>View CV</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<object
						data={pdfUrl}
						type='application/pdf'
						width='100%'
						height='700px'
					>
						<p>
							Your browser does not support viewing PDFs.
							<a href={pdfUrl} target='_blank' rel='noopener noreferrer'>
								Click here to download the PDF.
							</a>
						</p>
					</object>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default PdfViewer;
