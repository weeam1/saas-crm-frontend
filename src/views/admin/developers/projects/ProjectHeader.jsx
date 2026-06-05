import { SearchIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	Input,
	InputGroup,
	IconButton,
} from '@chakra-ui/react';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import React from 'react';
import { BiX } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa';
import { buttonStyle } from 'utils/btn';
import CustomTooltip from 'components/shared/CustomTooltip';
import RefreshButton from 'components/refresh/RefreshButton';

// const ProjectHeader = ({
// 	title,
// 	totalDocs,
// 	handleSearch,
// 	handleClear,
// 	searchTermRef,
// 	searchClear,
// 	queryParams,
// 	handleCreate,
// 	isLoading,
// 	refetch,
// 	isFetching,
// }) => {
// 	const handleInputChange = (event) => {
// 		searchTermRef.current = event.target.value;
// 	};

// 	return (
// 		<Box
// 			px={{ base: 4, md: 6 }}
// 			py={4}
// 			display='flex'
// 			// borderRadius='md'
// 			justifyContent='space-between'
// 			gap='2'
// 			alignItems={{ base: 'stretch', md: 'center' }}
// 			flexDirection={{ base: 'column', md: 'row' }}
// 		>
// 			<Heading fontSize='20px' color='text.heading' fontWeight='600'>
// 				{title}
// 				<span style={{ marginLeft: '6px' }}>
// 					({<CountUpComponent targetNumber={totalDocs || 0} />})
// 				</span>
// 			</Heading>
// 			<HStack
// 				gap='2'
// 				flexDirection={{ base: 'column', md: 'row' }}
// 				alignItems={{ base: 'flex-end', md: 'center' }}
// 			>
// 				{/* Search Input & Button */}
// 				<InputGroup
// 					bg='white'
// 					border='1px solid'
// 					borderColor='softGray.600'
// 					borderRadius='md'
// 					width={{ base: '100%', md: '18rem' }}
// 					overflow='hidden'
// 				>
// 					<Input
// 						id='searchInput'
// 						placeholder='Search'
// 						border='none'
// 						fontSize='xs'
// 						height='2.5rem'
// 						onChange={handleInputChange}
// 						onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
// 						_focus={{ boxShadow: 'none' }}
// 					/>

// 					<Button
// 						size='md'
// 						bg='softGray.700'
// 						borderLeft='1px solid'
// 						borderColor='softGray.600'
// 						px={4}
// 						borderRadius='0'
// 						fontSize='xs'
// 						display='flex'
// 						alignItems='center'
// 						_hover={{ bg: 'gray.50' }}
// 						_active={{ bg: 'gray.100' }}
// 						onClick={handleSearch}
// 					>
// 						<Flex align='center'>
// 							Search <SearchIcon fontSize='xs' color='brand.500' ml={1} />
// 						</Flex>
// 					</Button>
// 				</InputGroup>

// 				<HStack>
// 					{searchClear && (
// 						<Button
// 							{...buttonStyle}
// 							variant='solid'
// 							bg='softGray.100'
// 							w='fit-content'
// 							color='gray.800'
// 							sx={{
// 								svg: {
// 									fill: 'gray.800',
// 								},
// 							}}
// 							_active={{ bg: 'gray.200' }}
// 							leftIcon={<BiX />}
// 							aria-label='Clear'
// 							onClick={handleClear}
// 						>
// 							Clear
// 						</Button>
// 					)}

// 					<Button
// 						{...buttonStyle}
// 						variant='brand'
// 						w='fit-content'
// 						color='white'
// 						sx={{
// 							svg: {
// 								fill: 'white',
// 							},
// 						}}
// 						leftIcon={<FaPlus />}
// 						aria-label='Create'
// 						onClick={handleCreate}
// 					>
// 						Add Project
// 					</Button>
// 				</HStack>

// 			</HStack>
// 		</Box>
// 	);
// };

const ProjectHeader = ({
	title,
	totalDocs,
	handleSearch,
	handleClear,
	searchTermRef,
	searchClear,
	queryParams,
	handleCreate,
	isLoading,
	refetch,
	isFetching,
}) => {
	const handleInputChange = (event) => {
		searchTermRef.current = event.target.value;
	};

	return (
		<Box
			px={{ base: 4, md: 6 }}
			py={4}
			display='flex'
			justifyContent='space-between'
			gap={4}
			alignItems={{ base: 'stretch', md: 'center' }}
			flexDirection={{ base: 'column', md: 'row' }}
			roundedTopRight='xl'
			roundedTopLeft='xl'
			borderBottom='1px solid'
			borderBottomColor='border.default'
			bg='bg.surface'
		>
			<Heading fontSize='20px' color='text.heading' fontWeight='600'>
				{title}
				<Box as='span' ml={2} color='gold.primary'>
					(<CountUpComponent targetNumber={totalDocs || 0} />)
				</Box>
			</Heading>

			<HStack
				gap={3}
				flexDirection={{ base: 'column', md: 'row' }}
				alignItems={{ base: 'stretch', md: 'center' }}
			>
				{/* Search Input Group */}
				<InputGroup
					bg='bg.input'
					border='1px solid'
					borderColor='border.default'
					borderRadius='lg'
					width={{ base: '100%', md: '20rem' }}
					overflow='hidden'
					height='2.5rem'
					transition='all 0.2s'
					_focusWithin={{
						borderColor: 'gold.primary',
						boxShadow: '0 0 0 1px #D4AF37',
					}}
					_hover={{
						borderColor: 'gold.dark',
					}}
				>
					<Input
						id='searchInput'
						placeholder='Search projects...'
						border='none'
						fontSize='sm'
						height='2.5rem'
						onChange={handleInputChange}
						onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
						bg='transparent'
						color='text.body'
						_placeholder={{ color: 'text.muted' }}
						_focus={{ boxShadow: 'none' }}
					/>

					<Button
						size='md'
						bg='bg.elevated'
						borderLeft='1px solid'
						borderColor='border.default'
						px={5}
						borderRadius='0'
						fontSize='sm'
						fontWeight='500'
						display='flex'
						alignItems='center'
						height='2.75rem'
						color='text.body'
						_hover={{
							bg: 'bg.elevated',
							borderColor: 'gold.primary',
							color: 'gold.primary',
						}}
						_active={{ bg: 'bg.elevated' }}
						onClick={handleSearch}
						transition='all 0.2s'
					>
						<Flex align='center' gap={1}>
							Search
							<SearchIcon fontSize='xs' color='gold.primary' ml={1} />
						</Flex>
					</Button>
				</InputGroup>

				<HStack spacing={2}>
					{searchClear && (
						<Button
							variant='outline'
							size='sm'
							borderRadius='lg'
							borderColor='border.default'
							color='text.body'
							leftIcon={<BiX />}
							onClick={handleClear}
							_hover={{
								bg: 'bg.elevated',
								borderColor: 'gold.primary',
								color: 'gold.primary',
							}}
							transition='all 0.2s'
						>
							Clear
						</Button>
					)}

					<Button
						variant='brand'
						size='sm'
						borderRadius='lg'
						leftIcon={<FaPlus />}
						onClick={handleCreate}
					>
						Add Project
					</Button>

<RefreshButton
	label="Refresh"
		onClick={() => refetch()}
	isLoading={isLoading}
	isFetching={isFetching}
	size="sm"
	/>


				</HStack>
			</HStack>
		</Box>
	);
};
export default ProjectHeader;
