import React, { useEffect, useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { formattedDate } from 'utils/helpers';
import { InfoIcon } from '@chakra-ui/icons';

const OfferLetterEditor = ({ setEmailBody, offerDetails }) => {
	const [offerBody, setOfferBody] = useState(offerDetails?.offerMail || '');

	// ✅ Memoized Offer Details (Fixed, Non-Editable)
	const staticOfferDetails = useMemo(() => {
		return `
    <div contenteditable="false" style="background:#f3f4f6; padding:10px; border-radius:5px;">
      <strong>Offer Details:</strong><br/>
      <strong>Job Role:</strong> ${offerDetails.position} <br/>
      <strong>Job Type:</strong> ${offerDetails.jobType} <br/>
      <strong>Reporting To:</strong> ${offerDetails?.leadInterviewerName || 'N/A'} <br/>
      ${
				offerDetails.jobType !== 'Commission'
					? `<strong>Salary Amount:</strong> ${offerDetails.amount} <br/>`
					: ''
			}
      ${
				offerDetails.jobType !== 'Salary'
					? `<strong>Commission:</strong> ${offerDetails.commission}% <br/>`
					: ''
			}
      <strong>Joining Date:</strong> ${formattedDate(offerDetails.joiningDate)} <br/>
      <strong>Location:</strong> ${offerDetails.location} <br/>

			<p>${offerDetails.instructions}</p>
    </div><br/>
  `;
	}, [offerDetails]);

	const defaultTemplate = useMemo(
		() => `
    <p>Dear <strong>${offerDetails.candidateName}</strong>,</p>
    <p>We are pleased to offer you the position of <strong>${offerDetails.position}</strong> at <strong>WEAM ELNAGGAR</strong>.</p>
    <p>We believe your skills and experience will be a valuable addition to our team.</p>

    <!-- Offer Details Placeholder (Hidden) -->
    <div style="display: none;"></div>

    <h2 style="color: #2c3e50; font-size: 20px; margin-top: 20px;">Documents Required:</h2>
    <div class="documents-required" style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">
        <ul style="list-style-type: disc; padding-left: 20px; color: #333;">
            <li>Signed copy of this offer letter</li>
            <li>Government-issued ID proof (Aadhar, Passport, etc.)</li>
            <li>Address proof</li>
            <li>Educational certificates</li>
            <li>Previous employment documents (if applicable)</li>
            <li>Recent passport-size photographs</li>
            <li>Bank account details for salary processing</li>
        </ul>
    </div>

    <p>If you have any questions, feel free to reach out.</p>
    <p>Looking forward to welcoming you to our team!</p>
    
    <p>Thank you.</p>
    <p>WEAM ELNAGGAR HR Team</p>
  `,
		[offerDetails]
	);

	useEffect(() => {
		const finalEmailBody = defaultTemplate.replace(
			'<div style="display: none;"></div>',
			staticOfferDetails
		);
		setOfferBody(finalEmailBody);
		setEmailBody(finalEmailBody);
	}, [defaultTemplate, staticOfferDetails, offerDetails, setEmailBody]);

	const handleOfferBody = (e) => {
		const emailText = e;
		setOfferBody(emailText);
		// Replace the hidden placeholder `{offerDetails}` with actual static offer details
		const finalEmailBody = emailText.replace(
			'<div style="display: none;"></div>',
			staticOfferDetails
		);

		setEmailBody(finalEmailBody);
	};

	return (
		<Box p={4}>
			<Heading size='lg' mb={4}>
				Compose Offer Letter
			</Heading>

			{/* Editable Text Editor */}
			<Box border='1px solid #ccc' borderRadius='md' mb={4}>
				<ReactQuill value={offerBody} onChange={handleOfferBody} />
			</Box>

			{/* Information Message with Icon */}
			<Flex bg='blue.50' p={3} borderRadius='md' align='center' mb={3}>
				<InfoIcon color='blue.500' boxSize={5} mr={2} />
				<Text fontSize='sm' color='blue.600'>
					Offer details below will be automatically attached to the email.
				</Text>
			</Flex>

			{/* Non-Editable Offer Details (Fixed) */}
			<Box dangerouslySetInnerHTML={{ __html: staticOfferDetails }} />
		</Box>
	);
};

export default OfferLetterEditor;
