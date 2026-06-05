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
	setQueryData,
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
			width={{ base: '100%', xl: 'fit-content' }}
			bg='bg.surface'
			border='1px solid'
			borderColor='border.default'
			p='1'
			borderRadius='md'
		>
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
							size='md'
							variant='ghost'
							px={4}
							fontSize='xs'
							onClick={handleSearch}
							isDisabled={isLoading}
						>
							<Flex align='center' gap={1}>
								Search
								<SearchIcon fontSize='xs' color='text.accent' />
							</Flex>
						</Button>
					</InputRightElement>
				</InputGroup>
				<HStack>
					<Button
						variant='outline'
						px={4}
						fontSize='xs'
						height='2.2rem'
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
				setQueryData={setQueryData}
			/>
		</Flex>
	);
};

export default SearchBox;
