import {
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Checkbox,
	Select,
	InputGroup,
	InputLeftElement,
	Icon,
	Box,
} from '@chakra-ui/react';
import { Field } from 'formik';
import {
	FiUser,
	FiMail,
	FiGlobe,
	FiClock,
	FiDollarSign,
	FiMapPin,
	FiMessageSquare,
	FiLink,
	FiCheckCircle,
	FiHome,
	FiCalendar,
	FiTarget,
} from 'react-icons/fi';

const iconMap = {
	leadName: FiUser,
	leadEmail: FiMail,
	nationality: FiGlobe,
	timetocall: FiClock,
	budget: FiDollarSign,
	ip: FiGlobe,
	city: FiMapPin,
	country: FiGlobe,
	leadLang: FiMessageSquare,
	leadSourceDetails: FiCheckCircle,
	leadSourceChannel: FiTarget,
	leadSourceMedium: FiMessageSquare,
	leadCampaign: FiTarget,
	pageUrl: FiLink,
	r_u_in_uae: FiHome,
	leadAddress: FiMapPin,
	attendanceDay: FiCalendar,
	adset: FiTarget,
	eLeadStatus: FiCheckCircle,
	leadStatus: FiCheckCircle,
};

const RenderFields = ({ fields }) => {
	return (
		<>
			{fields?.map((field) => {
				const FieldIcon = iconMap[field.name] || null;

				return (
					<Field name={field.name} key={field.name}>
						{({ field: formikField, meta }) => (
							<Box w='100%'>
								<FormControl isInvalid={meta.touched && meta.error} w='100%'>
									{field.type !== 'checkbox' && (
										<FormLabel
											htmlFor={field.name}
											fontSize='sm'
											fontWeight='600'
											color='gray.700'
											mb='1'
										>
											{field.label}
										</FormLabel>
									)}

									{field.type === 'textarea' ? (
										<Textarea
											id={field.name}
											{...formikField}
											bg='gray.50'
											borderColor='gray.300'
											_hover={{ borderColor: 'brand.400' }}
											_focus={{
												borderColor: 'brand.500',
												boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
											}}
											placeholder={field.label}
											minH='100px'
										/>
									) : field.type === 'checkbox' ? (
										<Checkbox
											id={field.name}
											{...formikField}
											isChecked={formikField.value}
											colorScheme='brand'
										>
											{field.label}
										</Checkbox>
									) : field.type === 'select' ? (
										<InputGroup
											border={'1px solid'}
											bg='gray.50'
											borderColor='gray.300'
											_hover={{ borderColor: 'brand.400' }}
											_focus={{
												borderColor: 'brand.500',
												boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
											}}
											borderRadius={'md'}
										>
											{FieldIcon && (
												<InputLeftElement pointerEvents='none'>
													<Icon as={FieldIcon} color='gray.400' boxSize={4} />
												</InputLeftElement>
											)}
											<Select
												id={field.name}
												{...formikField}
												bg='gray.50'
												border={'none'}
												outline={'none'}
												borderColor='none'
												pl={FieldIcon ? 6 : 4}
												height='42px'
												_hover={{ borderColor: 'none' }}
												_focus={{
													borderColor: 'none',
												}}
											>
												<option value=''>{field.label}</option>
												{field.options?.map((option) => (
													<option key={option.value} value={option.value}>
														{option.label}
													</option>
												))}
											</Select>
										</InputGroup>
									) : (
										<InputGroup>
											{FieldIcon && (
												<InputLeftElement pointerEvents='none'>
													<Icon as={FieldIcon} color='gray.400' boxSize={4} />
												</InputLeftElement>
											)}
											<Input
												id={field.name}
												type={field.type}
												{...formikField}
												bg='gray.50'
												borderColor='gray.300'
												pl={FieldIcon ? 10 : 4}
												height='42px'
												_hover={{ borderColor: 'brand.400' }}
												_focus={{
													borderColor: 'brand.500',
													boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
												}}
												placeholder={field.label}
											/>
										</InputGroup>
									)}

									{meta.touched && meta.error && (
										<Box color='red.500' fontSize='xs' mt={1}>
											{meta.error}
										</Box>
									)}
								</FormControl>
							</Box>
						)}
					</Field>
				);
			})}
		</>
	);
};

export default RenderFields;
