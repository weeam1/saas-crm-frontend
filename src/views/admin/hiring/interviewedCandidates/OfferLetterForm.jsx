// import { Flex } from '@chakra-ui/react';
// import CustomButton from 'components/shared/CustomButton';
// import React from 'react';

// const OfferLetterForm = () => {
// 	return (
// 		<Formik
// 			enableReinitialize
// 			initialValues={offerDetails}
// 			validationSchema={validationSchema}
// 			onSubmit={onSubmitOffer}
// 		>
// 			{({ handleSubmit, setFieldValue, errors, touched, values }) => (
// 				<Form onSubmit={handleSubmit}>
// 					<Grid
// 						templateColumns={{
// 							base: '1fr',
// 							md: 'repeat(2, 1fr)',
// 							lg: 'repeat(3, 1fr)',
// 						}}
// 						gap={3}
// 						w='full'
// 						mt={2}
// 					>
// 						<CustomSelect
// 							label='Position'
// 							name='position'
// 							options={positionOptions?.doc}
// 							isReadOnly={!isEditing}
// 							isInvalid={errors.position && touched.position}
// 							placeholder={offerDetails.position}
// 							onChange={(e) => {
// 								setFieldValue('position', e.target.value);
// 								handleFieldChange('position', e.target.value);
// 							}}
// 						/>

// 						<CustomSelect
// 							label='Job Type'
// 							name='jobType'
// 							options={jobTypes}
// 							isReadOnly={!isEditing}
// 							isInvalid={errors.jobType && touched.jobType}
// 							placeholder={offerDetails.jobType}
// 							onChange={(e) => {
// 								setFieldValue('jobType', e.target.value);
// 								handleFieldChange('jobType', e.target.value);
// 							}}
// 						/>

// 						{values?.jobType !== 'Commission' && (
// 							<CustomInput
// 								label='Salary Amount'
// 								name='amount'
// 								type='number'
// 								placeholder={offerDetails.amount}
// 								isReadOnly={!isEditing}
// 								isInvalid={errors.amount && touched.amount}
// 								onChange={(e) => {
// 									setFieldValue('amount', e.target.value);
// 									handleFieldChange('amount', e.target.value);
// 								}}
// 							/>
// 						)}
// 						{values.jobType !== 'Salary' && (
// 							<CustomInput
// 								label='Commission %'
// 								name='commission'
// 								min={1}
// 								max={100}
// 								type='number'
// 								placeholder={offerDetails.commission}
// 								isReadOnly={!isEditing}
// 								isInvalid={errors.commission && touched.commission}
// 								onChange={(e) => {
// 									setFieldValue('commission', e.target.value);
// 									handleFieldChange('commission', e.target.value);
// 								}}
// 							/>
// 						)}

// 						<FormControl mb={4} isInvalid={errors?.joiningDate}>
// 							{!isEditing ? (
// 								interview?.doc?.joiningDate && (
// 									<>
// 										<FormLabel fontSize='sm'>Joining Date</FormLabel>

// 										<Box
// 											border='none'
// 											outline='none'
// 											bg='#F2F2F2'
// 											p='3'
// 											fontSize='sm'
// 											rounded='md'
// 											shadow='sm'
// 										>
// 											{formattedDate(interview?.doc?.joiningDate)}
// 										</Box>
// 									</>
// 								)
// 							) : (
// 								<Box position='relative' width='100%'>
// 									<FormLabel fontSize='sm'>Joining Date</FormLabel>
// 									<InputGroup>
// 										<Input
// 											value={
// 												selectedDate ? selectedDate.toLocaleDateString() : ''
// 											}
// 											placeholder='Select a date'
// 											readOnly
// 											required
// 											bg='gray.100'
// 											borderColor={errors?.joiningDate ? 'red.500' : 'gray.300'}
// 											borderRadius='md'
// 											fontSize='sm'
// 											py={1}
// 											focusBorderColor={
// 												errors?.joiningDate ? 'red.500' : '#E0B960'
// 											}
// 											isReadOnly
// 										/>
// 										<InputRightElement>
// 											<FaRegCalendar
// 												size={16}
// 												cursor='pointer'
// 												onClick={toggleCalendar}
// 											/>
// 										</InputRightElement>
// 									</InputGroup>
// 									{showCalendar && (
// 										<Box
// 											position='absolute'
// 											top='50px'
// 											zIndex='10'
// 											bg='white'
// 											border='1px solid #e2e8f0'
// 											borderRadius='md'
// 											boxShadow='0px 4px 6px rgba(0, 0, 0, 0.1)'
// 										>
// 											<Calendar
// 												onChange={handleDateChange}
// 												value={selectedDate}
// 												minDate={new Date()}
// 												className='custom-calendar'
// 											/>
// 										</Box>
// 									)}
// 								</Box>
// 							)}
// 							{errors?.joiningDate && (
// 								<Text color='red.500' fontSize='sm'>
// 									{errors?.joiningDate}
// 								</Text>
// 							)}
// 						</FormControl>
// 					</Grid>

// 					<CustomInput
// 						label='Location'
// 						name='location'
// 						placeholder={offerDetails.location}
// 						isReadOnly={!isEditing}
// 						isInvalid={errors.location && touched.location}
// 						onChange={(e) => {
// 							setFieldValue('location', e.target.value);
// 							handleFieldChange('location', e.target.value);
// 						}}
// 					/>

// 					<CustomInput
// 						label='Instructions'
// 						name='instructions'
// 						isReadOnly={!isEditing}
// 						isInvalid={errors.instructions && touched.instructions}
// 						placeholder={offerDetails.instructions}
// 						onChange={(e) => {
// 							setFieldValue('instructions', e.target.value);
// 							handleFieldChange('instructions', e.target.value);
// 						}}
// 					/>

// 					<FormLabel fontSize='sm' my='2'>
// 						Remarks
// 					</FormLabel>
// 					<Box
// 						border='none'
// 						outline='none'
// 						bg='#F2F2F2'
// 						p='3'
// 						fontSize='sm'
// 						rounded='md'
// 						shadow='sm'
// 					>
// 						{offerDetails?.remarks}
// 					</Box>

// 					<OfferLetterEditor
// 						onSend={onSubmitOffer}
// 						offerDetails={offerDetails}
// 						emailBody={emailBody}
// 						setEmailBody={setEmailBody}
// 						setOfferDetails={setOfferDetails}
// 					/>
// 					<Flex justifyContent='flex-end'>
// 						<CustomButton isLoading={sendingOffer} isDisabled={!isEditing}>
// 							{interview?.doc?.isOffer ? 'Resend Offer' : 'Submit Offer'}
// 						</CustomButton>
// 					</Flex>
// 				</Form>
// 			)}
// 		</Formik>
// 	);
// };

// export default OfferLetterForm;
