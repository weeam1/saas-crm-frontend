import keys from 'config/keys';

const PdfViewer = ({ pdfUrl }) => {
	return (
		<div>
			<object data={pdfUrl} type='application/pdf' width='100%' height='600px'>
				<p>
					Your browser does not support viewing PDFs.
					<a
						href={`${keys.base}/pdfUrl`}
						target='_blank'
						rel='noopener noreferrer'
					>
						Click here to download the PDF.
					</a>
				</p>
			</object>
		</div>
	);
};

export default PdfViewer;
