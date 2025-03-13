import { CloseIcon, SearchIcon } from '@chakra-ui/icons';
import {
	Box,
	Heading,
	Input,
	Icon,
	InputGroup,
	Button,
	Flex,
	InputLeftElement,
	InputRightElement,
	HStack,
	useDisclosure,
	Text,
	IconButton,
} from '@chakra-ui/react';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { useRef } from 'react';
import { CiSearch } from 'react-icons/ci';
import { buttonStyle } from '../../constants';
import { BiX } from 'react-icons/bi';
import TabButton from 'components/shared/TabButton';
import { MdFilter } from 'react-icons/md';
import { FiFilter } from 'react-icons/fi';

const EmployeesHeader = ({
	data,
	handleSearch,
	searchTermRef,
	handleClear,
	searchClear,
	filterOpen,
	queryParams,
}) => {
	const handleInputChange = (event) => {
		searchTermRef.current = event.target.value;
	};

	return (
		<Box
			px={{ base: 4, md: 6, lg: 12 }}
			py={4}
			display='flex'
			bg='white'
			borderRadius='md'
			justifyContent='space-between'
			gap='2'
			alignItems={{ base: 'stretch', md: 'center' }}
			flexDirection={{ base: 'column', md: 'row' }}
			mb={4}
		>
			<Heading fontSize='24px' fontWeight='600'>
				{queryParams.agency && (
					<span style={{ paddingRight: '5px' }}>{queryParams.agency}</span>
				)}
				Employees
				{data && (
					<span style={{ marginLeft: '6px' }}>
						({<CountUpComponent targetNumber={data?.totalResults || 0} />})
					</span>
				)}
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
						height='2.2rem'
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
					<IconButton
						icon={<FiFilter />}
						onClick={filterOpen}
						aria-label='Filter Date'
						colorScheme='brand'
						variant='solid'
						size='sm'
						borderRadius='full'
						boxShadow='md'
					/>

					{searchClear && (
						<Button
							{...buttonStyle}
							variant='solid'
							bg='red.400'
							w='fit-content'
							color='white'
							sx={{
								svg: {
									fill: 'white',
								},
							}}
							leftIcon={<BiX />}
							aria-label='Clear'
							onClick={handleClear}
						>
							Clear
						</Button>
					)}
				</HStack>
			</HStack>
		</Box>
	);
};

export default EmployeesHeader;
