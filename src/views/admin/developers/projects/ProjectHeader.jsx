import { SearchIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	Input,
	InputGroup,
} from '@chakra-ui/react';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import React from 'react';
import { BiX } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa';
import { buttonStyle } from 'utils/btn';

const ProjectHeader = ({
	title,
	totalDocs,
	handleSearch,
	handleClear,
	searchTermRef,
	searchClear,
	queryParams,
	handleCreate,
}) => {
	const handleInputChange = (event) => {
		searchTermRef.current = event.target.value;
	};

	return (
		<Box
			px={{ base: 4, md: 6 }}
			py={4}
			display='flex'
			bg='white'
			// borderRadius='md'
			justifyContent='space-between'
			gap='2'
			alignItems={{ base: 'stretch', md: 'center' }}
			flexDirection={{ base: 'column', md: 'row' }}
		>
			<Heading fontSize='20px' fontWeight='600'>
				{title}
				<span style={{ marginLeft: '6px' }}>
					({<CountUpComponent targetNumber={totalDocs || 0} />})
				</span>
			</Heading>
			<HStack
				gap='2'
				flexDirection={{ base: 'column', md: 'row' }}
				alignItems={{ base: 'flex-end', md: 'center' }}
			>
				{/* Search Input & Button */}
				<InputGroup
					bg='white'
					border='1px solid'
					borderColor='softGray.600'
					borderRadius='md'
					width={{ base: '100%', md: '18rem' }}
					overflow='hidden'
				>
					<Input
						id='searchInput'
						placeholder='Search'
						border='none'
						fontSize='xs'
						height='2.5rem'
						onChange={handleInputChange}
						onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
						_focus={{ boxShadow: 'none' }}
					/>
					<Button
						size='md'
						bg='softGray.700'
						borderLeft='1px solid'
						borderColor='softGray.600'
						px={4}
						borderRadius='0'
						fontSize='xs'
						display='flex'
						alignItems='center'
						_hover={{ bg: 'gray.50' }}
						_active={{ bg: 'gray.100' }}
						onClick={handleSearch}
					>
						<Flex align='center'>
							Search <SearchIcon fontSize='xs' color='brand.500' ml={1} />
						</Flex>
					</Button>
				</InputGroup>

				<HStack>
					{searchClear && (
						<Button
							{...buttonStyle}
							variant='solid'
							bg='softGray.100'
							w='fit-content'
							color='gray.800'
							sx={{
								svg: {
									fill: 'gray.800',
								},
							}}
							_active={{ bg: 'gray.200' }}
							leftIcon={<BiX />}
							aria-label='Clear'
							onClick={handleClear}
						>
							Clear
						</Button>
					)}

					<Button
						{...buttonStyle}
						 variant="brand"
						w='fit-content'
						color='white'
						sx={{
							svg: {
								fill: 'white',
							},
						}}
						leftIcon={<FaPlus />}
						aria-label='Create'
						onClick={handleCreate}
					>
						Add Project
					</Button>
				</HStack>
			</HStack>
		</Box>
	);
};

export default ProjectHeader;
