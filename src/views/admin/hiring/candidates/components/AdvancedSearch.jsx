import React, { useEffect, useRef, useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Button,
	Grid,
	GridItem,
	FormLabel,
	Input,
	Text,
	Flex,
	Select,
	ModalFooter,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useFetchItemsQuery } from 'api/apiSlice';
import { jobTypes } from 'utils/options';
import { experienceYearsOptions, genderOptions } from '../../helpers';
import { visaOptions } from 'utils/options';
import useUserSession from 'hooks/useUserSession';
import { useModalColors } from 'hooks/useModalColors';

const AdvancedSearch = ({ isOpen, onClose, onSearch, type }) => {
	const initialValues = {
		name: '',
		position: '',
		email: '',
		whatsApp: '',
		phone: '',
		nationality: '',
		experienceYears: '',
		gender: '',
		status: '',
		agency: '',
		inviteAccepted: '',
		visaType: '',
		source: '',
	};

	const [formValues, setFormValues] = useState(initialValues);

	const { user, isSuperAdmin } = useUserSession();
	const colors = useModalColors();

	const { data: countries } = useFetchItemsQuery({
		path: '/countries',
	});

	const { data: positionOptions, isLoading: positionsLoading } =
		useFetchItemsQuery(
			{
				path: `/positions/options`,
			},
			{ refetchOnMountOrArgChange: true }
		);

	const { data: agencies } = useFetchItemsQuery(
		{
			path: '/agencies',
		},
		{
			skip: !isSuperAdmin,
		}
	);

	const isMounted = useRef(true);

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const validationSchema = Yup.object({
		name: Yup.string(),
		dob: Yup.date(),
		email: Yup.string(),
		phone: Yup.string().matches(
			/^\+?[0-9\s]+$/,
			'Phone number must only contain digits'
		),
		whatsApp: Yup.string().matches(
			/^\+?[0-9\s]+$/,
			'WhatsApp number must only contain digits'
		),
		nationality: Yup.string(),
		position: Yup.string(),
	});

	const getFields = (type) => {
		const baseFields = [
			{ name: 'name', label: 'Name', placeholder: 'Enter name' },
			{ name: 'email', label: 'Email', placeholder: 'Enter email' },
			{ name: 'phone', label: 'Phone No', placeholder: 'Enter phone number' },
			{
				name: 'whatsApp',
				label: 'WhatsApp No',
				placeholder: 'WhatsApp number',
			},
			{ name: 'source', label: 'Source', placeholder: 'Enter source' },
		];
		return baseFields;
	};

	const fields = getFields(type);

	const handleSubmit = (values) => {
		onSearch(values);
		onClose();
		if (isMounted.current) {
			setFormValues(values);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='2xl'>
			<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(2px)' />
			<ModalContent mx='2' borderRadius='xl' boxShadow={colors.modalShadow} bg={colors.viewBg}>
				<ModalHeader
					bg={colors.viewHeaderBg}
					color={colors.viewHeaderText}
					borderBottom={`1px solid ${colors.viewHeaderBorder}`}
					borderTopRadius='xl'
					py={4}
					px={6}
					w='100%'
				>
					Advanced Search
				</ModalHeader>
				<ModalCloseButton
					color={colors.bodyText}
					_hover={{ color: colors.accentGold, bg: colors.secondaryBtnHoverBg }}
				/>

				<Formik
					initialValues={formValues}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
				>
					{({
						handleChange,
						handleBlur,
						values,
						errors,
						touched,
						resetForm,
					}) => (
						<Form>
							<ModalBody p='2' bg={colors.viewBg}>
								<Grid
									height='70vh'
									overflow='scroll'
									p='4'
									templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
									gap={{ base: 3, md: 6 }}
								>
									{fields.map((field) => (
										<GridItem key={field.name}>
											<FormLabel
												display='flex'
												ms='4px'
												fontSize='md'
												fontWeight='400'
												color={colors.labelColor}
												mt={2}
												mb='1'
											>
												{field.label}
											</FormLabel>
											<Input
												fontWeight='500'
												fontSize='sm'
												type={field.type}
												name={field.name}
												placeholder={field.placeholder}
												onChange={handleChange}
												onBlur={handleBlur}
												value={values[field.name]}
												bg={colors.bgInput}
												borderColor={colors.borderColor}
												color={colors.headingText}
												_hover={{ borderColor: colors.accentGold }}
												_focus={{
													borderColor: colors.accentGold,
													boxShadow: `0 0 0 1px ${colors.accentGold}`,
												}}
												_placeholder={{ color: colors.mutedText }}
											/>
											{errors[field.name] && touched[field.name] && (
												<Text color={colors.badgeErrorText} fontSize='xs'>
													{errors[field.name]}
												</Text>
											)}
										</GridItem>
									))}

									<GridItem>
										<FormLabel
											display='flex'
											ms='4px'
											fontSize='md'
											fontWeight='500'
											color={colors.labelColor}
											mt={2}
											mb='1'
										>
											Position
										</FormLabel>
										<Select
											fontSize='sm'
											name='position'
											fontWeight='400'
											defaultValue={''}
											rounded='md'
											shadow='sm'
											onChange={handleChange}
											onBlur={handleBlur}
											value={values['position']}
											bg={colors.bgInput}
											borderColor={colors.borderColor}
											color={colors.headingText}
											_hover={{ borderColor: colors.accentGold }}
											_focus={{
												borderColor: colors.accentGold,
												boxShadow: `0 0 0 1px ${colors.accentGold}`,
											}}
											placeholder='Search by role'
										>
											{positionOptions?.doc?.map((item) => (
												<option value={item._id} key={item._id} style={{ background: colors.bg, color: colors.headingText }}>
													{item.value}
												</option>
											))}
										</Select>
									</GridItem>

									<GridItem>
										<FormLabel
											display='flex'
											ms='4px'
											fontSize='md'
											fontWeight='500'
											color={colors.labelColor}
											mt={2}
											mb='1'
										>
											Gender
										</FormLabel>
										<Select
											fontSize='sm'
											name='gender'
											fontWeight='400'
											defaultValue={''}
											rounded='md'
											shadow='sm'
											onChange={handleChange}
											onBlur={handleBlur}
											value={values['gender']}
											bg={colors.bgInput}
											borderColor={colors.borderColor}
											color={colors.headingText}
											_hover={{ borderColor: colors.accentGold }}
											_focus={{
												borderColor: colors.accentGold,
												boxShadow: `0 0 0 1px ${colors.accentGold}`,
											}}
											placeholder='Search by gender'
										>
											{genderOptions?.map((item) => (
												<option value={item.value} key={item.value} style={{ background: colors.bg, color: colors.headingText }}>
													{item.label}
												</option>
											))}
										</Select>
									</GridItem>

									<GridItem>
										<FormLabel
											display='flex'
											ms='4px'
											fontSize='md'
											fontWeight='500'
											color={colors.labelColor}
											mt={2}
											mb='1'
										>
											Experience Years
										</FormLabel>
										<Select
											fontSize='sm'
											name='experienceYears'
											fontWeight='400'
											defaultValue={''}
											rounded='md'
											shadow='sm'
											onChange={handleChange}
											onBlur={handleBlur}
											value={values['experienceYears']}
											bg={colors.bgInput}
											borderColor={colors.borderColor}
											color={colors.headingText}
											_hover={{ borderColor: colors.accentGold }}
											_focus={{
												borderColor: colors.accentGold,
												boxShadow: `0 0 0 1px ${colors.accentGold}`,
											}}
											placeholder='Search by experience years'
										>
											{experienceYearsOptions?.map((item) => (
												<option value={item.value} key={item.value} style={{ background: colors.bg, color: colors.headingText }}>
													{item.label}
												</option>
											))}
										</Select>
									</GridItem>

									<GridItem>
										<FormLabel
											display='flex'
											ms='4px'
											fontSize='md'
											fontWeight='400'
											color={colors.labelColor}
											mt={2}
											mb='1'
										>
											Nationality
										</FormLabel>
										<Select
											fontSize='sm'
											name='nationality'
											fontWeight='500'
											defaultValue={''}
											rounded='md'
											shadow='sm'
											onChange={handleChange}
											onBlur={handleBlur}
											value={values['nationality']}
											bg={colors.bgInput}
											borderColor={colors.borderColor}
											color={colors.headingText}
											_hover={{ borderColor: colors.accentGold }}
											_focus={{
												borderColor: colors.accentGold,
												boxShadow: `0 0 0 1px ${colors.accentGold}`,
											}}
											placeholder='Search by nationality'
										>
											{countries?.doc?.map((country) => (
												<option value={country.name} key={country.code} style={{ background: colors.bg, color: colors.headingText }}>
													{country.name}
												</option>
											))}
										</Select>
									</GridItem>

									{type !== 'interviewed' && (
										<GridItem>
											<FormLabel
												display='flex'
												ms='4px'
												fontSize='md'
												fontWeight='400'
												color={colors.labelColor}
												mt={2}
												mb='1'
											>
												Status
											</FormLabel>
											<Select
												fontSize='sm'
												name='status'
												fontWeight='400'
												defaultValue={''}
												rounded='md'
												shadow='sm'
												onChange={handleChange}
												onBlur={handleBlur}
												value={values['status']}
												bg={colors.bgInput}
												borderColor={colors.borderColor}
												color={colors.headingText}
												_hover={{ borderColor: colors.accentGold }}
												_focus={{
													borderColor: colors.accentGold,
													boxShadow: `0 0 0 1px ${colors.accentGold}`,
												}}
												placeholder='Search by status'
											>
												<option value='Pending' style={{ background: colors.bg, color: colors.headingText }}>Pending</option>
												<option value='Eligible' style={{ background: colors.bg, color: colors.headingText }}>Eligible</option>
												<option value='Not Eligible' style={{ background: colors.bg, color: colors.headingText }}>Not Eligible</option>
											</Select>
										</GridItem>
									)}

									{isSuperAdmin && (
										<GridItem>
											<FormLabel
												display='flex'
												ms='4px'
												fontSize='md'
												fontWeight='400'
												color={colors.labelColor}
												mt={2}
												mb='1'
											>
												Agency
											</FormLabel>
											<Select
												fontSize='sm'
												name='agency'
												fontWeight='400'
												defaultValue={''}
												rounded='md'
												shadow='sm'
												onChange={handleChange}
												onBlur={handleBlur}
												value={values['agency']}
												bg={colors.bgInput}
												borderColor={colors.borderColor}
												color={colors.headingText}
												_hover={{ borderColor: colors.accentGold }}
												_focus={{
													borderColor: colors.accentGold,
													boxShadow: `0 0 0 1px ${colors.accentGold}`,
												}}
												placeholder='Search by agency'
											>
												{agencies?.doc?.map((item) => (
													<option key={item._id} value={item._id} style={{ background: colors.bg, color: colors.headingText }}>
														{item.name}
													</option>
												))}
											</Select>
										</GridItem>
									)}

									{(type === 'short-listed' || type === 'invited') && (
										<GridItem>
											<FormLabel
												display='flex'
												ms='4px'
												fontSize='md'
												fontWeight='400'
												color={colors.labelColor}
												mt={2}
												mb='1'
											>
												Invite Status
											</FormLabel>
											<Select
												fontSize='sm'
												name='inviteAccepted'
												fontWeight='400'
												defaultValue={''}
												rounded='md'
												shadow='sm'
												onChange={handleChange}
												onBlur={handleBlur}
												value={values['inviteAccepted']}
												bg={colors.bgInput}
												borderColor={colors.borderColor}
												color={colors.headingText}
												_hover={{ borderColor: colors.accentGold }}
												_focus={{
													borderColor: colors.accentGold,
													boxShadow: `0 0 0 1px ${colors.accentGold}`,
												}}
												placeholder='Search by invite status'
											>
												<option value='true' style={{ background: colors.bg, color: colors.headingText }}>Accepted</option>
												<option value='false' style={{ background: colors.bg, color: colors.headingText }}>Not Accepted</option>
											</Select>
										</GridItem>
									)}

									{type === 'interviewed' && (
										<>
											<GridItem>
												<FormLabel
													display='flex'
													ms='4px'
													fontSize='md'
													fontWeight='400'
													color={colors.labelColor}
													mt={2}
													mb='1'
												>
													Job Type
												</FormLabel>
												<Select
													fontSize='sm'
													name='jobType'
													fontWeight='400'
													defaultValue={''}
													rounded='md'
													shadow='sm'
													onChange={handleChange}
													onBlur={handleBlur}
													value={values['jobType']}
													bg={colors.bgInput}
													borderColor={colors.borderColor}
													color={colors.headingText}
													_hover={{ borderColor: colors.accentGold }}
													_focus={{
														borderColor: colors.accentGold,
														boxShadow: `0 0 0 1px ${colors.accentGold}`,
													}}
													placeholder='Search by status'
												>
													{jobTypes.map((type) => (
														<option key={type.value} value={type.value} style={{ background: colors.bg, color: colors.headingText }}>
															{type.label}
														</option>
													))}
												</Select>
											</GridItem>
										</>
									)}

									<GridItem>
										<FormLabel
											display='flex'
											ms='4px'
											fontSize='md'
											fontWeight='400'
											color={colors.labelColor}
											mt={2}
											mb='1'
										>
											Visa Type
										</FormLabel>
										<Select
											fontSize='sm'
											name='visaType'
											fontWeight='400'
											defaultValue={''}
											rounded='md'
											shadow='sm'
											onChange={handleChange}
											onBlur={handleBlur}
											value={values['visaType']}
											bg={colors.bgInput}
											borderColor={colors.borderColor}
											color={colors.headingText}
											_hover={{ borderColor: colors.accentGold }}
											_focus={{
												borderColor: colors.accentGold,
												boxShadow: `0 0 0 1px ${colors.accentGold}`,
											}}
											placeholder='Search by visa type'
										>
											{visaOptions.map((type) => (
												<option key={type.value} value={type.value} style={{ background: colors.bg, color: colors.headingText }}>
													{type.label}
												</option>
											))}
										</Select>
									</GridItem>
								</Grid>
							</ModalBody>

							<ModalFooter
								bg={colors.viewFooterBg}
								borderTop={`1px solid ${colors.viewFooterBorder}`}
								borderBottomRadius='xl'
								py={4}
								px={6}
							>
								<Flex justifyContent='flex-end' width='100%'>
									<Button
										mr={3}
										variant='outline'
										onClick={() => resetForm()}
										size='sm'
										rounded='md'
										borderColor={colors.borderColor}
										color={colors.bodyText}
										_hover={{
											bg: colors.secondaryBtnHoverBg,
											color: colors.headingText,
										}}
									>
										Clear
									</Button>
									<Button
										variant='brand'
										rounded='md'
										size='sm'
										type='submit'
									>
										Search
									</Button>
								</Flex>
							</ModalFooter>
						</Form>
					)}
				</Formik>
			</ModalContent>
		</Modal>
	);
};

export default AdvancedSearch;