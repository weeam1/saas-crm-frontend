// import {
// 	Box,
// 	Button,
// 	Flex,
// 	Text,
// 	Heading,
// 	Input,
// 	Badge,
// 	Divider,
// 	SimpleGrid,
// 	Spinner,
// 	VStack,
// 	Select,
// } from '@chakra-ui/react';
// import { useFetchItemsQuery } from 'api/apiSlice';
// import { useEffect, useMemo, useState } from 'react';
// import { FiMessageSquare } from 'react-icons/fi';
// import { buttonStyle } from 'utils/btn';

// export function StepTemplateSelect({ businessId, onNext, onBack }) {
// 	const [selectedTemplate, setSelectedTemplate] = useState(null);
// 	const [placeholderValues, setPlaceholderValues] = useState({});
// 	const [placeholderModes, setPlaceholderModes] = useState({});

// 	const [errors, setErrors] = useState({});
// 	const [touched, setTouched] = useState({});

// 	const {
// 		data: templates = [],
// 		isLoading: isTemplatesLoading,
// 		isError,
// 	} = useFetchItemsQuery(
// 		{
// 			path: `/whatsapp/templates`,
// 			params: { businessId },
// 		},
// 		{
// 			skip: !businessId,
// 			refetchOnMountOrArgChange: true,
// 		}
// 	);

// 	useEffect(() => {
// 		if (Array.isArray(templates?.doc)) {
// 			const filtered = templates.doc.filter(
// 				(template) =>
// 					typeof template.name === 'string' &&
// 					!template.name.toLowerCase().includes('hello_world')
// 			);

// 			if (filtered.length > 0) {
// 				setSelectedTemplate(filtered[0]);
// 			} else {
// 				setSelectedTemplate(null);
// 			}
// 		}
// 	}, [templates?.doc]);

// 	const filteredTemplates = Array.isArray(templates?.doc)
// 		? templates.doc.filter(
// 				(template) =>
// 					typeof template.name === 'string' &&
// 					!template.name.toLowerCase().includes('hello_world')
// 			)
// 		: [];

// 	// Extract template body + footer
// 	const templateHeader =
// 		selectedTemplate?.components?.find((c) => c.type === 'HEADER')?.text || '';
// 	const templateBody =
// 		selectedTemplate?.components?.find((c) => c.type === 'BODY')?.text || '';
// 	const templateFooter =
// 		selectedTemplate?.components?.find((c) => c.type === 'FOOTER')?.text || '';

// 	// Compute preview
// 	const previewText = useMemo(() => {
// 		let result = templateBody;

// 		Object.entries(placeholderValues).forEach(([key, value]) => {
// 			result = result.replace(
// 				new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
// 				value || `{{${key}}}`
// 			);
// 		});

// 		const finalBody =
// 			(templateHeader ? `${templateHeader}\n\n` : '') +
// 			result +
// 			(templateFooter ? `\n\n${templateFooter}` : '');

// 		return finalBody;
// 	}, [templateBody, templateHeader, templateFooter, placeholderValues]);

// 	const extractPlaceholders = useMemo(() => {
// 		const body = selectedTemplate?.components?.find(
// 			(c) => c.type === 'BODY'
// 		)?.text;

// 		const matches = body?.match(/{{(\d+)}}/g);
// 		const unique = [...new Set(matches?.map((m) => m.match(/\d+/)?.[0]))];

// 		setPlaceholderValues({});
// 		setPlaceholderModes({});
// 		return unique || [];
// 	}, [selectedTemplate]);

// 	const validatePlaceholders = () => {
// 		const newErrors = {};
// 		extractPlaceholders?.forEach((key) => {
// 			if (!placeholderValues[key]?.trim()) {
// 				newErrors[key] = 'This field is required';
// 			}
// 		});
// 		setErrors(newErrors);
// 		return Object.keys(newErrors).length === 0;
// 	};

// 	const handleNextStep = () => {
// 		let placeholderArray = [];
// 		if (extractPlaceholders?.length > 0) {
// 			const isValid = validatePlaceholders();
// 			if (!isValid) return;

// 			placeholderArray = Object.keys(placeholderValues)
// 				.sort((a, b) => Number(a) - Number(b))
// 				.map((key) => placeholderValues[key]?.trim() || '');
// 		}

// 		onNext({
// 			message: previewText,
// 			templateName: selectedTemplate.name,
// 			placeholders: placeholderArray,
// 			languageCode: selectedTemplate.language,
// 			type: 'template',
// 		});
// 	};

// 	return (
// 		<VStack align='stretch' spacing={6}>
// 			{/* <FiMessageSquare size={20} /> */}
// 			<Box mb='2'>
// 				<Heading size='md'>WhatsApp Template</Heading>
// 				<Text color='gray.500' fontSize='sm'>
// 					Select template and customize placeholders before sending.
// 				</Text>
// 			</Box>

// 			{isTemplatesLoading ? (
// 				<VStack justify='center' align='center' minH='200px'>
// 					<Spinner size='xl' color='green.500' />
// 					<Text>Loading templates...</Text>
// 				</VStack>
// 			) : isError ? (
// 				<Text color='red.500'>Failed to load templates. Please try again.</Text>
// 			) : (
// 				<Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
// 					{/* Template List */}
// 					<Box w={{ base: 'full', lg: '350px' }}>
// 						<Text fontSize='sm' color='gray.500' mb={2}>
// 							Available Templates ({filteredTemplates.length})
// 						</Text>
// 						<SimpleGrid
// 							columns={1}
// 							spacing={1}
// 							maxHeight={{ base: '30vh', md: '50vh' }}
// 							overflowY='auto'
// 							scrollBehavior='smooth'
// 							bg='softGray.100'
// 							rounded='md'
// 							p='4'
// 							mb='4'
// 						>
// 							{filteredTemplates?.map((template) => (
// 								<Box
// 									key={template.id}
// 									cursor='pointer'
// 									p={3}
// 									mb={3}
// 									borderRadius='lg'
// 									borderWidth='1px'
// 									borderColor={
// 										selectedTemplate?.id === template.id
// 											? 'green.300'
// 											: 'gray.100'
// 									}
// 									bg={
// 										selectedTemplate?.id === template.id
// 											? 'green.50'
// 											: 'gray.100'
// 									}
// 									_hover={{ borderColor: 'green.200' }}
// 									transition='all 0.2s ease'
// 									onClick={() => setSelectedTemplate(template)}
// 									position='relative'
// 									pl={10}
// 								>
// 									<Flex
// 										position='absolute'
// 										left={3}
// 										top='50%'
// 										transform='translateY(-50%)'
// 										w={5}
// 										h={5}
// 										borderWidth='2px'
// 										borderColor={
// 											selectedTemplate?.id === template.id
// 												? 'green.400'
// 												: 'gray.300'
// 										}
// 										borderRadius='full'
// 										align='center'
// 										justify='center'
// 									>
// 										{selectedTemplate?.id === template.id && (
// 											<Box w={3} h={3} bg='green.400' borderRadius='full' />
// 										)}
// 									</Flex>

// 									<Flex justify='space-between' align='center'>
// 										<Text
// 											fontWeight='medium'
// 											fontSize={{ base: 'sm', md: 'md' }}
// 											color='gray.700'
// 										>
// 											{template.name}
// 										</Text>
// 									</Flex>
// 								</Box>
// 							))}
// 						</SimpleGrid>
// 					</Box>

// 					{/* Template Preview + Placeholders */}
// 					<Box flex='1' maxHeight='60vh' overflowY='auto'>
// 						{selectedTemplate ? (
// 							<>
// 								{selectedTemplate &&
// 									extractPlaceholders?.length > 0 &&
// 									extractPlaceholders.map((key) => {
// 										const isClientSelected = Object.entries(
// 											placeholderModes
// 										).some(([k, v]) => v === 'client' && k !== key);
// 										const mode = placeholderModes[key] || 'custom';

// 										return (
// 											<Box key={key} mb={4}>
// 												<Text fontSize='sm' fontWeight='medium' mb={1}>
// 													Field for <b>{key}</b>
// 												</Text>

// 												<Flex gap={2}>
// 													<Select
// 														size='sm'
// 														bg='white'
// 														width='40%'
// 														value={mode}
// 														borderColor={'gray.300'}
// 														_hover={{
// 															borderColor: 'gray.400',
// 														}}
// 														focusBorderColor={'brand.500'}
// 														onChange={(e) => {
// 															const value = e.target.value;
// 															setPlaceholderModes((prev) => ({
// 																...prev,
// 																[key]: value,
// 															}));

// 															// Clear value if switching back to custom
// 															if (value === 'custom') {
// 																setPlaceholderValues((prev) => ({
// 																	...prev,
// 																	[key]: '',
// 																}));
// 															} else
// 																setPlaceholderValues((prev) => ({
// 																	...prev,
// 																	[key]: 'client_name',
// 																}));
// 														}}
// 														isDisabled={mode !== 'client' && isClientSelected}
// 													>
// 														<option value='custom'>Custom</option>
// 														<option value='client'>Client Name</option>
// 													</Select>

// 													<Input
// 														placeholder={
// 															mode === 'client'
// 																? 'Client Name (auto-filled)'
// 																: `Enter value for {{${key}}}`
// 														}
// 														size='sm'
// 														bg='white'
// 														isDisabled={mode === 'client'}
// 														borderColor={errors[key] ? 'red.500' : 'gray.300'}
// 														_hover={{
// 															borderColor: errors[key] ? 'red.600' : 'gray.400',
// 														}}
// 														focusBorderColor={
// 															errors[key] ? 'red.500' : 'brand.500'
// 														}
// 														value={placeholderValues[key] || ''}
// 														onChange={(e) =>
// 															setPlaceholderValues((prev) => ({
// 																...prev,
// 																[key]: e.target.value,
// 															}))
// 														}
// 														onBlur={() =>
// 															setTouched({ ...touched, [key]: true })
// 														}
// 													/>
// 												</Flex>

// 												{errors[key] && (
// 													<Text color='red.500' fontSize='xs' mt={1}>
// 														{errors[key]}
// 													</Text>
// 												)}
// 											</Box>
// 										);
// 									})}

// 								<Box mb={4}>
// 									<Text fontSize='sm' color='gray.500' mb={2}>
// 										Template Preview
// 									</Text>
// 									<Box
// 										p={4}
// 										bg='gray.50'
// 										rounded='lg'
// 										borderWidth='1px'
// 										borderColor='gray.200'
// 										as='pre'
// 										whiteSpace='pre-wrap'
// 										fontFamily='DM Sans, sans-serif'
// 									>
// 										<Text fontSize='sm' whiteSpace='pre-line'>
// 											{previewText}
// 										</Text>
// 									</Box>
// 								</Box>

// 								<Box p={3} bg='gray.50' rounded='lg'>
// 									<Text fontSize='sm' fontWeight='medium' mb={1}>
// 										Template Details
// 									</Text>
// 									<Text fontSize='sm'>
// 										Language: {selectedTemplate.language}
// 									</Text>
// 									<Text fontSize='sm'>
// 										Status:{' '}
// 										<Badge
// 											colorScheme={
// 												selectedTemplate.status === 'APPROVED'
// 													? 'green'
// 													: 'orange'
// 											}
// 											fontSize='x-small'
// 										>
// 											{selectedTemplate.status}
// 										</Badge>
// 									</Text>
// 									<Text fontSize='sm'>
// 										Category: {selectedTemplate.category}
// 									</Text>
// 								</Box>
// 							</>
// 						) : (
// 							<Text color='gray.500'>Select a template to preview</Text>
// 						)}
// 					</Box>
// 				</Flex>
// 			)}

// 			<Divider />

// 			<Flex justify='space-between'>
// 				<Button
// 					{...buttonStyle}
// 					px='10'
// 					py='5'
// 					bg='gray.100'
// 					color='gray.800'
// 					_active={{ bg: 'gray.200' }}
// 					fontSize={{ base: 'sm', md: 'lg' }}
// 					variant='outline'
// 					onClick={onBack}
// 				>
// 					Back
// 				</Button>
// 				<Button
// 					{...buttonStyle}
// 					px='10'
// 					py='5'
// 					fontSize={{ base: 'sm', md: 'lg' }}
// 					colorScheme='green'
// 					onClick={handleNextStep}
// 					isDisabled={!selectedTemplate}
// 				>
// 					Next
// 				</Button>
// 			</Flex>
// 		</VStack>
// 	);
// }

import {
	Box,
	Button,
	Flex,
	Text,
	Heading,
	Input,
	Badge,
	Divider,
	SimpleGrid,
	Spinner,
	VStack,
	Select,
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useEffect, useMemo, useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';

export function StepTemplateSelect({ businessId, onNext, onBack }) {
	const colors = useModalColors();
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const [placeholderValues, setPlaceholderValues] = useState({});
	const [placeholderModes, setPlaceholderModes] = useState({});

	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	const {
		data: templates = [],
		isLoading: isTemplatesLoading,
		isError,
	} = useFetchItemsQuery(
		{
			path: `/whatsapp/templates`,
			params: { businessId },
		},
		{
			skip: !businessId,
			refetchOnMountOrArgChange: true,
		}
	);

	useEffect(() => {
		if (Array.isArray(templates?.doc)) {
			const filtered = templates.doc.filter(
				(template) =>
					typeof template.name === 'string' &&
					!template.name.toLowerCase().includes('hello_world')
			);

			if (filtered.length > 0) {
				setSelectedTemplate(filtered[0]);
			} else {
				setSelectedTemplate(null);
			}
		}
	}, [templates?.doc]);

	const filteredTemplates = Array.isArray(templates?.doc)
		? templates.doc.filter(
				(template) =>
					typeof template.name === 'string' &&
					!template.name.toLowerCase().includes('hello_world')
			)
		: [];

	// Extract template body + footer
	const templateHeader =
		selectedTemplate?.components?.find((c) => c.type === 'HEADER')?.text || '';
	const templateBody =
		selectedTemplate?.components?.find((c) => c.type === 'BODY')?.text || '';
	const templateFooter =
		selectedTemplate?.components?.find((c) => c.type === 'FOOTER')?.text || '';

	// Compute preview
	const previewText = useMemo(() => {
		let result = templateBody;

		Object.entries(placeholderValues).forEach(([key, value]) => {
			result = result.replace(
				new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
				value || `{{${key}}}`
			);
		});

		const finalBody =
			(templateHeader ? `${templateHeader}\n\n` : '') +
			result +
			(templateFooter ? `\n\n${templateFooter}` : '');

		return finalBody;
	}, [templateBody, templateHeader, templateFooter, placeholderValues]);

	const extractPlaceholders = useMemo(() => {
		const body = selectedTemplate?.components?.find(
			(c) => c.type === 'BODY'
		)?.text;

		const matches = body?.match(/{{(\d+)}}/g);
		const unique = [...new Set(matches?.map((m) => m.match(/\d+/)?.[0]))];

		setPlaceholderValues({});
		setPlaceholderModes({});
		return unique || [];
	}, [selectedTemplate]);

	const validatePlaceholders = () => {
		const newErrors = {};
		extractPlaceholders?.forEach((key) => {
			if (!placeholderValues[key]?.trim()) {
				newErrors[key] = 'This field is required';
			}
		});
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleNextStep = () => {
		let placeholderArray = [];
		if (extractPlaceholders?.length > 0) {
			const isValid = validatePlaceholders();
			if (!isValid) return;

			placeholderArray = Object.keys(placeholderValues)
				.sort((a, b) => Number(a) - Number(b))
				.map((key) => placeholderValues[key]?.trim() || '');
		}

		onNext({
			message: previewText,
			templateName: selectedTemplate.name,
			placeholders: placeholderArray,
			languageCode: selectedTemplate.language,
			type: 'template',
		});
	};

	return (
		<VStack align='stretch' spacing={6}>
			<Box mb='2'>
				<Heading size='md' color={colors.headingText}>WhatsApp Template</Heading>
				<Text color={colors.mutedText} fontSize='sm'>
					Select template and customize placeholders before sending.
				</Text>
			</Box>

			{isTemplatesLoading ? (
				<VStack justify='center' align='center' minH='200px'>
					<Spinner size='xl' color={colors.accentGold} />
					<Text color={colors.bodyText}>Loading templates...</Text>
				</VStack>
			) : isError ? (
				<Text color={colors.badgeErrorText}>Failed to load templates. Please try again.</Text>
			) : (
				<Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
					{/* Template List */}
					<Box w={{ base: 'full', lg: '350px' }}>
						<Text fontSize='sm' color={colors.mutedText} mb={2}>
							Available Templates ({filteredTemplates.length})
						</Text>
						<SimpleGrid
							columns={1}
							spacing={1}
							maxHeight={{ base: '30vh', md: '50vh' }}
							overflowY='auto'
							scrollBehavior='smooth'
							bg={colors.bgInput}
							rounded='md'
							p='4'
							mb='4'
						>
							{filteredTemplates?.map((template) => (
								<Box
									key={template.id}
									cursor='pointer'
									p={3}
									mb={3}
									borderRadius='lg'
									borderWidth='1px'
									borderColor={
										selectedTemplate?.id === template.id
											? colors.accentGold
											: colors.borderColor
									}
									bg={
										selectedTemplate?.id === template.id
											? colors.badgeInfoBg
											: colors.bg
									}
									_hover={{ borderColor: colors.accentGold }}
									transition='all 0.2s ease'
									onClick={() => setSelectedTemplate(template)}
									position='relative'
									pl={10}
								>
									<Flex
										position='absolute'
										left={3}
										top='50%'
										transform='translateY(-50%)'
										w={5}
										h={5}
										borderWidth='2px'
										borderColor={
											selectedTemplate?.id === template.id
												? colors.accentGold
												: colors.borderColor
										}
										borderRadius='full'
										align='center'
										justify='center'
									>
										{selectedTemplate?.id === template.id && (
											<Box w={3} h={3} bg={colors.accentGold} borderRadius='full' />
										)}
									</Flex>

									<Flex justify='space-between' align='center'>
										<Text
											fontWeight='medium'
											fontSize={{ base: 'sm', md: 'md' }}
											color={colors.headingText}
										>
											{template.name}
										</Text>
									</Flex>
								</Box>
							))}
						</SimpleGrid>
					</Box>

					{/* Template Preview + Placeholders */}
					<Box flex='1' maxHeight='60vh' overflowY='auto'>
						{selectedTemplate ? (
							<>
								{selectedTemplate &&
									extractPlaceholders?.length > 0 &&
									extractPlaceholders.map((key) => {
										const isClientSelected = Object.entries(
											placeholderModes
										).some(([k, v]) => v === 'client' && k !== key);
										const mode = placeholderModes[key] || 'custom';

										return (
											<Box key={key} mb={4}>
												<Text fontSize='sm' fontWeight='medium' mb={1} color={colors.labelColor}>
													Field for <b>{key}</b>
												</Text>

												<Flex gap={2}>
													<Select
														size='sm'
														bg={colors.bgInput}
														width='40%'
														value={mode}
														borderColor={colors.borderColor}
														color={colors.headingText}
														_hover={{
															borderColor: colors.accentGold,
														}}
														_focus={{
															borderColor: colors.accentGold,
															boxShadow: `0 0 0 1px ${colors.accentGold}`,
														}}
														onChange={(e) => {
															const value = e.target.value;
															setPlaceholderModes((prev) => ({
																...prev,
																[key]: value,
															}));

															if (value === 'custom') {
																setPlaceholderValues((prev) => ({
																	...prev,
																	[key]: '',
																}));
															} else
																setPlaceholderValues((prev) => ({
																	...prev,
																	[key]: 'client_name',
																}));
														}}
														isDisabled={mode !== 'client' && isClientSelected}
													>
														<option value='custom' style={{ background: colors.bg, color: colors.headingText }}>Custom</option>
														<option value='client' style={{ background: colors.bg, color: colors.headingText }}>Client Name</option>
													</Select>

													<Input
														placeholder={
															mode === 'client'
																? 'Client Name (auto-filled)'
																: `Enter value for {{${key}}}`
														}
														size='sm'
														bg={colors.bgInput}
														isDisabled={mode === 'client'}
														borderColor={errors[key] ? colors.badgeErrorText : colors.borderColor}
														color={colors.headingText}
														_placeholder={{ color: colors.mutedText }}
														_hover={{
															borderColor: errors[key] ? colors.badgeErrorText : colors.accentGold,
														}}
														_focus={{
															borderColor: errors[key] ? colors.badgeErrorText : colors.accentGold,
															boxShadow: `0 0 0 1px ${errors[key] ? colors.badgeErrorText : colors.accentGold}`,
														}}
														value={placeholderValues[key] || ''}
														onChange={(e) =>
															setPlaceholderValues((prev) => ({
																...prev,
																[key]: e.target.value,
															}))
														}
														onBlur={() =>
															setTouched({ ...touched, [key]: true })
														}
													/>
												</Flex>

												{errors[key] && (
													<Text color={colors.badgeErrorText} fontSize='xs' mt={1}>
														{errors[key]}
													</Text>
												)}
											</Box>
										);
									})}

								<Box mb={4}>
									<Text fontSize='sm' color={colors.mutedText} mb={2}>
										Template Preview
									</Text>
									<Box
										p={4}
										bg={colors.bgInput}
										rounded='lg'
										borderWidth='1px'
										borderColor={colors.borderColor}
										as='pre'
										whiteSpace='pre-wrap'
										fontFamily='DM Sans, sans-serif'
									>
										<Text fontSize='sm' whiteSpace='pre-line' color={colors.bodyText}>
											{previewText}
										</Text>
									</Box>
								</Box>

								<Box p={3} bg={colors.bgInput} rounded='lg' border='1px solid' borderColor={colors.borderColor}>
									<Text fontSize='sm' fontWeight='medium' mb={1} color={colors.headingText}>
										Template Details
									</Text>
									<Text fontSize='sm' color={colors.bodyText}>
										Language: {selectedTemplate.language}
									</Text>
									<Text fontSize='sm' color={colors.bodyText}>
										Status:{' '}
										<Badge
											bg={
												selectedTemplate.status === 'APPROVED'
													? colors.badgeSuccessBg
													: colors.badgeWarningBg
											}
											color={
												selectedTemplate.status === 'APPROVED'
													? colors.badgeSuccessText
													: colors.badgeWarningText
											}
											fontSize='x-small'
											px={2}
											py={1}
											borderRadius='full'
										>
											{selectedTemplate.status}
										</Badge>
									</Text>
									<Text fontSize='sm' color={colors.bodyText}>
										Category: {selectedTemplate.category}
									</Text>
								</Box>
							</>
						) : (
							<Text color={colors.mutedText}>Select a template to preview</Text>
						)}
					</Box>
				</Flex>
			)}

			<Divider borderColor={colors.borderColor} />

			<Flex justify='space-between'>
				<Button
					px='10'
					py='5'
					fontSize={{ base: 'sm', md: 'lg' }}
					variant='outline'
					onClick={onBack}
				>
					Back
				</Button>
				<Button
					px='10'
					py='5'
					fontSize={{ base: 'sm', md: 'lg' }}
					variant='brand'
					onClick={handleNextStep}
					isDisabled={!selectedTemplate}
				>
					Next
				</Button>
			</Flex>
		</VStack>
	);
}