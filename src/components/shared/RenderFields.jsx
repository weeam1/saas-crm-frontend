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
											color='text.body'
											mb='1'
										>
											{field.label}
										</FormLabel>
									)}

									{field.type === 'textarea' ? (
										<Textarea
											id={field.name}
											{...formikField}
											bg='bg.input'
											borderColor='border.default'
											_hover={{ borderColor: 'border.focus' }}
											_focus={{
												borderColor: 'border.focus',
												boxShadow: 'goldGlow',
											}}
											placeholder={field.label}
											color='text.heading'
											_placeholder={{ color: 'text.muted' }}
											minH='100px'
										/>
									) : field.type === 'checkbox' ? (
										<Checkbox
											id={field.name}
											{...formikField}
											isChecked={formikField.value}
											colorScheme='yellow'
											sx={{
												'.chakra-checkbox__control': {
													_focus: { boxShadow: 'none' },
												},
											}}
										>
											{field.label}
										</Checkbox>
									) : field.type === 'select' ? (
										<InputGroup
											border='1px solid'
											bg='bg.input'
											borderColor='border.default'
											_hover={{ borderColor: 'border.focus' }}
											_focusWithin={{
												borderColor: 'border.focus',
												boxShadow: 'goldGlow',
											}}
											borderRadius='md'
										>
											{FieldIcon && (
												<InputLeftElement pointerEvents='none'>
													<Icon as={FieldIcon} color='text.accent' boxSize={4} />
												</InputLeftElement>
											)}
											<Select
												id={field.name}
												{...formikField}
												bg='transparent'
												border='none'
												color='text.heading'
												pl={FieldIcon ? 8 : 4}
												_focus={{ border: 'none', boxShadow: 'none' }}
											>
												<option value='' style={{ background: '#24496E', color: '#B0B0B0' }}>
													{field.label}
												</option>
												{field.options?.map((option) => (
													<option
														key={option.value}
														value={option.value}
														style={{ background: '#24496E', color: '#B0B0B0' }}
													>
														{option.label}
													</option>
												))}
											</Select>
										</InputGroup>
									) : (
										<InputGroup>
											{FieldIcon && (
												<InputLeftElement pointerEvents='none'>
													<Icon as={FieldIcon} color='text.accent' boxSize={4} />
												</InputLeftElement>
											)}
											<Input
												id={field.name}
												type={field.type}
												{...formikField}
												bg='bg.input'
												borderColor='border.default'
												pl={FieldIcon ? 10 : 4}
												color='text.heading'
												_placeholder={{ color: 'text.muted' }}
												_focus={{
													borderColor: 'border.focus',
													boxShadow: 'goldGlow',
												}}
												_hover={{ borderColor: 'border.focus' }}
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