import React, { useState } from 'react';
import {
	Input,
	InputGroup,
	InputRightElement,
	Button,
	HStack,
	Box,
	Flex,
	useDisclosure,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import AdvancedSearchModal from './AdvancedSearchModal';
import DateFilterButton from './DateFilterButton';
import DateFilter from './DateFilter';
import { formattedDate } from 'utils/helpers';

const SearchBox = ({
	fetchSearchedData,
	fetchAdvancedSearch,
	pageSize,
	setData,
	setTotalPages,
	setTotalLeads,
	setIsLoading,
	setDisplaySearchData,
	onClearSearch,
	isLoading,
	setSearchTerm: setParentSearchTerm,
	setTags,
	searchTerm: parentSearchTerm,
	setDateTime,
}) => {
	const [searchTerm, setSearchTerm] = useState(parentSearchTerm || '');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formValues, setFormValues] = useState({});
	const [isFormReset, setIsFormReset] = useState(false);
	const [searchClear, setSearchClear] = useState(false);
	const [getTagValues, setGetTagValues] = useState([]);
	React.useEffect(() => {
		setSearchTerm(parentSearchTerm || '');
	}, [parentSearchTerm]);
	const handleSearch = () => {
		if (searchTerm.trim()) {
			fetchSearchedData(searchTerm, 1, pageSize);
			setSearchClear(true);
			setParentSearchTerm(searchTerm);
			setTags([]);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};
	const handleClear = () => {
		// setDateTime('');
		setSearchTerm('');
		setSearchClear(false);
		setGetTagValues([]);
		setFormValues({});
		setDisplaySearchData(false);
		setParentSearchTerm('');
		setTags([]);
		onClearSearch();
	};

	return (
		<Flex
			display='flex'
			height={{ base: '80px', md: '30px' }}
			justifyContent={{ base: 'center', md: 'center' }}
			alignItems='center'
			width='100%'
		>
			<Box width={{ base: '100%', md: 'fit-content' }} p='2' borderRadius='md'>
				<HStack
					spacing={1}
					flexDirection={{ base: 'column', md: 'row' }}
					justifyContent='center'
				>
					<InputGroup
						bg='white'
						border='1px solid'
						borderColor='softGray.600'
						borderRadius='md'
						w={{ base: '100%', md: '280px', lg: '310px' }}
						pr='0'
						overflow='hidden'
					>
						<Input
							placeholder='Search by lead name...'
							border='none'
							fontSize='xs'
							height='2.5rem'
							_focus={{ boxShadow: 'none' }}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyPress={handleKeyPress}
							pr='4.5rem'
							fontFamily="'DM Sans', sans-serif"
						/>
						<InputRightElement width='auto' height='100%' alignItems='center'>
							<Button
								size='sm'
								w='80px'
								bg='softGray.700'
								borderLeft='1px solid'
								borderColor='softGray.600'
								px={4}
								borderRadius='0'
								fontSize='xs'
								display='flex'
								alignItems='center'
								height='100%'
								_hover={{ bg: 'gray.50' }}
								_active={{ bg: 'gray.100' }}
								onClick={handleSearch}
								isDisabled={isLoading}
								fontFamily="'DM Sans', sans-serif"
							>
								<Flex align='center' display='inline-flex' alignItems='center'>
									Search <SearchIcon fontSize='xs' color='brand.500' ml={1} />
								</Flex>
							</Button>
						</InputRightElement>
					</InputGroup>
					<HStack>
						<Button
							border='1px solid'
							borderColor='softGray.600'
							bg='white'
							borderRadius='md'
							px={4}
							fontSize='xs'
							w='auto'
							minW='max-content'
							height='2.2rem'
							_hover={{ bg: 'gray.50' }}
							_active={{ bg: 'gray.100' }}
							onClick={() => setIsModalOpen(true)}
							isDisabled={isLoading}
						>
							Advance Search
						</Button>
					</HStack>
				</HStack>

				<AdvancedSearchModal
					setAdvanceSearch={setIsModalOpen}
					advanceSearch={isModalOpen}
					isLoading={isLoading}
					fetchAdvancedSearch={fetchAdvancedSearch}
					setSearchClear={setSearchClear}
					setFormValues={setFormValues}
					isFormReset={isFormReset}
					setIsFormReset={setIsFormReset}
					pageSize={pageSize}
					setGetTagValues={(tags) => {
						setGetTagValues(tags);
						setTags(tags);
						setParentSearchTerm('');
					}}
					setDisplaySearchData={setDisplaySearchData}
					onClearSearch={handleClear}
				/>
			</Box>
		</Flex>
	);
};

export default SearchBox;
