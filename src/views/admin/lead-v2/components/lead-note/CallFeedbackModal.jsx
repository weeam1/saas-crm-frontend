import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	VStack,
	FormControl,
	FormLabel,
	Select,
	Textarea,
	Input,
	Text,
	Flex,
	Box,
	Badge,
	Icon,
	SimpleGrid,
	HStack,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiMic, FiWifi, FiPhone, FiStar } from 'react-icons/fi';
import {
	CALL_MEDIUM_OPTIONS,
	CALL_QUALITY_OPTIONS,
	QUALITY_STARS,
} from 'constants/callFeedback.constants';
import { StarIcon } from '@chakra-ui/icons';

// Common reasons as tags
const COMMON_ISSUES = [
	'Voice Cutting',
	// 'Latency',
	'VPN Issue',
	'No Audio',
	'Call Drop',
	'Login Failed',
];

// Simplified validation
const feedbackSchema = Yup.object({
	callMedium: Yup.string().required('Select medium'),
	callQuality: Yup.string().required('Select quality'),
	reason: Yup.string().required('Select reason'),
	description: Yup.string()
		.min(2, 'Add more details')
		.max(200, 'Too long')
		.required('Details required'),
});

const CallFeedbackModal = ({ isOpen, onClose, onSubmit }) => {
	const formik = useFormik({
		initialValues: {
			callMedium: '',
			callQuality: '',
			reason: '',
			description: '',
		},
		validationSchema: feedbackSchema,
		onSubmit: (values) => {
			onSubmit(values);
			// formik.resetForm();
		},
	});

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='xl'
			isCentered
			closeOnOverlayClick={false}
		>
			<ModalOverlay backdropFilter='blur(2px)' />
			<ModalContent mx='2' borderRadius='xl' boxShadow='xl'>
				<ModalHeader pb={2}>
					<Flex align='center' gap={2}>
						<Icon as={FiPhone} color='green.500' />
						<Text fontSize='lg' fontWeight='semibold'>
							Call Feedback
						</Text>
					</Flex>
					<Text fontSize='md' color='gray.500' fontWeight='normal' mt={1}>
						Help us improve call quality
					</Text>
				</ModalHeader>

				<ModalBody>
					<VStack
						overflow='scroll'
						maxH={{ base: '60dvh', md: '70dvh' }}
						p={2}
						scrollBehavior='smooth'
						spacing={4}
					>
						{/* Call Medium */}
						<FormControl>
							<FormLabel fontSize='md' mb={1}>
								How did you call?
							</FormLabel>
							<SimpleGrid columns={3} spacing={2}>
								{CALL_MEDIUM_OPTIONS.map((medium) => (
									<Box
										key={medium.value}
										as='button'
										type='button'
										p={2}
										borderRadius='md'
										border='1px solid'
										borderColor={
											formik.values.callMedium === medium.value
												? 'green.300'
												: 'gray.200'
										}
										bg={
											formik.values.callMedium === medium.value
												? 'green.50'
												: 'white'
										}
										onClick={() =>
											formik.setFieldValue('callMedium', medium.value)
										}
										_hover={{ borderColor: 'green.200' }}
									>
										<VStack spacing={1}>
											<Icon as={medium.icon} color={medium.color} />
											<Text fontSize='xs'>{medium.label}</Text>
										</VStack>
									</Box>
								))}
							</SimpleGrid>
						</FormControl>

						{/* Call Quality */}
						{/* <FormControl>
							<FormLabel fontSize='md' mb={1}>
								Call quality?
							</FormLabel>
							<Select
								placeholder='Select quality'
								size='md'
								value={formik.values.callQuality}
								onChange={formik.handleChange('callQuality')}
							>
								{CALL_QUALITY_OPTIONS.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</Select>
						</FormControl> */}
						<FormControl>
							<FormLabel fontSize='md' mb={2}>
								Call quality
							</FormLabel>

							<VStack align='stretch' spacing={2}>
								{QUALITY_STARS.map((item) => {
									const isActive = formik.values.callQuality === item.value;

									return (
										<Flex
											key={item.value}
											align='center'
											justify='space-between'
											px={4}
											py={2}
											borderRadius='lg'
											cursor='pointer'
											border='1px solid'
											borderColor={isActive ? 'green.400' : 'gray.200'}
											bg={isActive ? 'green.50' : 'white'}
											transition='all 0.15s ease'
											onClick={() =>
												formik.setFieldValue('callQuality', item.value)
											}
											_hover={{
												borderColor: 'green.300',
												bg: 'green.50',
											}}
										>
											{/* Label */}
											<Text fontWeight='medium' fontSize='xs'>
												{item.label}
											</Text>

											{/* Stars */}
											<HStack spacing={1}>
												{[...Array(5)].map((_, i) => (
													<StarIcon
														key={i}
														boxSize={3}
														color={i < item.stars ? 'yellow.400' : 'gray.300'}
													/>
												))}
											</HStack>
										</Flex>
									);
								})}
							</VStack>
						</FormControl>

						{/* Common Issues */}
						<FormControl>
							<FormLabel fontSize='md' mb={1}>
								What went wrong?
							</FormLabel>

							{/* Suggestions */}
							<Flex wrap='wrap' gap={2} mb={2}>
								{COMMON_ISSUES.map((issue) => {
									const isActive = formik.values.reason === issue;

									return (
										<Badge
											key={issue}
											as='button'
											type='button'
											px={2}
											py={1}
											borderRadius='full'
											fontSize='xs'
											fontWeight='medium'
											textTransform='capitalize'
											cursor='pointer'
											transition='all 0.15s ease'
											variant={isActive ? 'solid' : 'outline'}
											colorScheme={isActive ? 'purple' : 'gray'}
											onClick={() => formik.setFieldValue('reason', issue)}
											_hover={{ transform: 'scale(1.05)' }}
										>
											{issue.replace(/_/g, ' ')}
										</Badge>
									);
								})}
							</Flex>

							{/* Input */}
							<Input
								placeholder='Describe the issue (e.g. voice delay, echo, login error)'
								size='sm'
								value={formik.values.reason}
								onChange={(e) => formik.setFieldValue('reason', e.target.value)}
							/>

							{/* Helper text */}
							<Text mt={1} fontSize='xs' color='gray.500'>
								Select a common issue above or write a different problem if it’s
								not listed.
							</Text>
						</FormControl>

						{/* Details */}
						<FormControl>
							<FormLabel fontSize='md' mb={1}>
								Details
							</FormLabel>
							<Textarea
								placeholder='Briefly describe the reason...'
								size='sm'
								// rows={3}
								resize='none'
								maxH='100px'
								value={formik.values.description}
								onChange={formik.handleChange('description')}
							/>
							<Text fontSize='xs' color='gray.500' textAlign='right' mt={1}>
								{formik.values.description.length}/500
							</Text>
						</FormControl>
					</VStack>
				</ModalBody>

				<ModalFooter pt={0}>
					<Button
						variant='ghost'
						size='md'
						mr={2}
						onClick={() => {
							formik.resetForm();
							onClose();
						}}
					>
						Cancel
					</Button>
					<Button
						colorScheme='greenish'
						size='md'
						onClick={formik.handleSubmit}
						isLoading={formik.isSubmitting}
						isDisabled={!formik.isValid}
					>
						Submit
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CallFeedbackModal;
