// import React, { useRef } from "react";
// import { InputGroup, Input, Button, Flex } from "@chakra-ui/react";
// import { SearchIcon } from "@chakra-ui/icons";

// const CustomSearchInput = ({
//   fetchData,
//   setDisplaySearchData,
//   searchTerm,
//   setSearchTerm,
//   pageIndex,
//   pageSize,
//   width,
// }) => {
//   const justARef = useRef();

//   const handleInputChange = (e) => {
//     const newSearchTerm = e.target.value;
//     setSearchTerm(newSearchTerm);
//     if (!newSearchTerm) {
//       setDisplaySearchData(false);
//       fetchData({ pageIndex: 0, pageSize, search: "" });
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       const newSearchTerm = e.target.value.trim();
//       if (newSearchTerm) {
//         setDisplaySearchData(true);
//         fetchData({ pageIndex: 0, pageSize, search: newSearchTerm });
//       }
//     }
//   };

//   const handleSearchClick = () => {
//     const newSearchTerm = searchTerm.trim();
//     if (newSearchTerm) {
//       setDisplaySearchData(true);
//       fetchData({ pageIndex: 0, pageSize, search: newSearchTerm });
//     }
//   };

//   return (
//     <InputGroup
//       bg="white"
//       border="1px solid"
//       borderColor="gray.200"
//       borderRadius="md"
//       width={{ base: "100%", md: "18rem" }}
//       overflow="hidden"
//       size="sm"
//     >
//       <Input
//         type="text"
//         fontSize="sm"
//         fontWeight="500"
//         value={searchTerm}
//         onChange={handleInputChange}
//         onKeyDown={handleKeyDown}
//         ref={justARef}
//         placeholder="Search by Developer Name..."
//         border="none"
//         height="2.5rem"
//         _focus={{ boxShadow: "none" }}
//       />
//       <Button
//         bg="gray.100"
//         borderLeft="1px solid"
//         borderColor="gray.200"
//         px={4}
//         borderRadius="0"
//         fontSize="sm"
//         display="flex"
//         alignItems="center"
//         height="2.5rem"
//         _hover={{ bg: "gray.50" }}
//         _active={{ bg: "gray.100" }}
//         onClick={handleSearchClick}
//       >
//         <Flex align="center">
//           Search <SearchIcon fontSize="sm" color="brand.500" ml={1} />
//         </Flex>
//       </Button>
//     </InputGroup>
//   );
// };

// export default CustomSearchInput;

import React, { useRef } from 'react';
import {
	InputGroup,
	Input,
	Button,
	Flex,
	InputLeftElement,
	InputRightElement,
	IconButton,
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';

const CustomSearchInput = ({
	fetchData,
	setDisplaySearchData,
	searchTerm,
	setSearchTerm,
	pageIndex,
	pageSize,
	width,
}) => {
	const inputRef = useRef();

	const handleInputChange = (e) => {
		const newSearchTerm = e.target.value;
		setSearchTerm(newSearchTerm);
		if (!newSearchTerm) {
			setDisplaySearchData(false);
			fetchData({ pageIndex: 0, pageSize, search: '' });
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			const newSearchTerm = e.target.value.trim();
			if (newSearchTerm) {
				setDisplaySearchData(true);
				fetchData({ pageIndex: 0, pageSize, search: newSearchTerm });
			}
		}
	};

	const handleSearchClick = () => {
		const newSearchTerm = searchTerm.trim();
		if (newSearchTerm) {
			setDisplaySearchData(true);
			fetchData({ pageIndex: 0, pageSize, search: newSearchTerm });
		}
	};

	const handleClear = () => {
		setSearchTerm('');
		setDisplaySearchData(false);
		fetchData({ pageIndex: 0, pageSize, search: '' });
		inputRef.current?.focus();
	};

	return (
		<InputGroup
			bg='bg.input'
			border='1px solid'
			borderColor='border.default'
			borderRadius='lg'
			width={width || { base: '100%', md: '20rem' }}
			overflow='hidden'
			size='md'
			height='2.5rem'
			transition='all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
			_focusWithin={{
				borderColor: 'gold.primary',
				boxShadow: '0 0 0 1px #D4AF37',
			}}
			_hover={{
				borderColor: 'gold.dark',
			}}
		>
			<Input
				type='text'
				fontSize='sm'
				fontWeight='500'
				value={searchTerm}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				ref={inputRef}
				placeholder='Search by Developer Name...'
				border='none'
				pr={searchTerm ? '2rem' : '1rem'}
				height='2.5rem'
				bg='transparent'
				color='text.body'
				_placeholder={{ color: 'text.muted' }}
				_focus={{ boxShadow: 'none' }}
				_hover={{ bg: 'transparent' }}
				transition='all 0.2s'
			/>

			{searchTerm && (
				<InputRightElement width='auto' mr={1}>
					<IconButton
						aria-label='Clear search'
						icon={<CloseIcon boxSize={2.5} />}
						size='xs'
						variant='ghost'
						onClick={handleClear}
						_hover={{ color: 'gold.primary', transform: 'scale(1.1)' }}
						transition='all 0.2s'
					/>
				</InputRightElement>
			)}

			<Button
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
				onClick={handleSearchClick}
				transition='all 0.2s'
			>
				<Flex align='center' gap={1}>
					Search
					<SearchIcon fontSize='xs' color='gold.primary' ml={1} />
				</Flex>
			</Button>
		</InputGroup>
	);
};

export default CustomSearchInput;
