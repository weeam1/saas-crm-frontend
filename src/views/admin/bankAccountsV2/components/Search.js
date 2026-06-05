// import React, { useRef } from "react";
// import { InputGroup, Input, Button, Flex } from "@chakra-ui/react";
// import { SearchIcon } from "@chakra-ui/icons";

// const CustomSearchInput = ({
//   searchbox,
//   setSearchbox,
//   onSearch,
//   isLoading = false,
// }) => {
//   const inputRef = useRef(null);

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       const searchTerm = e.target.value.trim();
//       onSearch(searchTerm);
//     }
//   };

//   const handleChange = (e) => {
//     setSearchbox(e.target.value);
//   };

//   const handleSearchClick = () => {
//     onSearch(searchbox.trim());
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
//         placeholder="Search by bank name..."
//         border="none"
//         fontSize="sm"
//         height="2.5rem"
//         value={searchbox}
//         onChange={handleChange}
//         onKeyPress={handleKeyPress}
//         ref={inputRef}
//         isDisabled={isLoading}
//         _focus={{ boxShadow: "none" }}
//       />
//       <Button
//         bg="gray.100"
//         borderLeft="1px solid"
//         borderColor="gray.200"
//         px={5}
//         borderRadius="0"
//         fontSize="sm"
//         display="flex"
//         alignItems="center"
//         _hover={{ bg: "gray.50" }}
//         _active={{ bg: "gray.100" }}
//         onClick={handleSearchClick}
//         isLoading={isLoading}
//         height="100%"
//       >
//         <Flex align="center" h={"2.5rem"}>
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
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const CustomSearchInput = ({
	searchbox,
	setSearchbox,
	onSearch,
	isLoading = false,
}) => {
	const inputRef = useRef(null);

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			const searchTerm = e.target.value.trim();
			onSearch(searchTerm);
		}
	};

	const handleChange = (e) => {
		setSearchbox(e.target.value);
	};

	const handleSearchClick = () => {
		onSearch(searchbox.trim());
	};

	return (
		<InputGroup
			bg='bg.input'
			border='1px solid'
			borderColor='border.default'
			borderRadius='lg'
			width={{ base: '100%', md: '20rem' }}
			h='2.5rem'
			overflow='hidden'
			size='sm'
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
				placeholder='Search by bank name...'
				border='none'
				fontSize='sm'
				height='2.5rem'
				value={searchbox}
				onChange={handleChange}
				onKeyPress={handleKeyPress}
				ref={inputRef}
				isDisabled={isLoading}
				bg='transparent'
				color='text.body'
				_placeholder={{ color: 'text.muted' }}
				_focus={{ boxShadow: 'none' }}
				_disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
			/>

			{searchbox && (
				<InputRightElement width='auto' mr={1}>
					<Button
						size='xs'
						variant='ghost'
						onClick={() => {
							setSearchbox('');
							onSearch('');
						}}
						fontSize='xs'
						color='text.muted'
						_hover={{ color: 'gold.primary' }}
					>
						✕
					</Button>
				</InputRightElement>
			)}

			<Button
				bg='bg.elevated'
				borderLeft='1px solid'
				borderColor='border.default'
				px={5}
				borderRadius='0'
				fontSize='sm'
				display='flex'
				alignItems='center'
				_hover={{ bg: 'bg.elevated', borderColor: 'gold.primary' }}
				_active={{ bg: 'bg.elevated' }}
				onClick={handleSearchClick}
				isLoading={isLoading}
				height='100%'
				color='text.body'
				transition='all 0.2s'
			>
				<Flex align='center' h='full' gap={1}>
					Search <SearchIcon fontSize='xs' color='gold.primary' ml={1} />
				</Flex>
			</Button>
		</InputGroup>
	);
};

export default CustomSearchInput;
