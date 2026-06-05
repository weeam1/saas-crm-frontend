// // import {
// //   Input,
// //   InputGroup,
// //   InputRightElement,
// //   Button,
// //   HStack,
// //   Box,
// //   Flex,
// // } from "@chakra-ui/react";
// // import { SearchIcon } from "@chakra-ui/icons";
// // // import DateFilterButton from './DateFilterButton';

// // const SearchBox = ({
// //   dateTimeOnOpen,
// //   setAdvanceSearch,
// //   handleSearchByName,
// //   searchTermRef,
// // }) => {
// //   const handleInputChange = (event) => {
// //     searchTermRef.current = event.target.value;
// //   };

// //   return (
// //     <Box
// //       // alignSelf='end'
// //       width={{ base: "100%", xl: "fit-content" }}
// //       bg="softGray.50"
// //       p="1"
// //       borderRadius="md"
// //       // sx={{
// //       // 	width: {
// //       // 		base: '100%',
// //       // 	},
// //       // 	'@media (min-width: 1795px)': {
// //       // 		wdith: 'fit-content',
// //       // 	},
// //       // }}
// //     >
// //       <HStack
// //         spacing={3}
// //         gap="2"
// //         display="flex"
// //         justifyContent={{ base: "center" }}
// //         flexDirection={{ base: "column", md: "row" }}
// //       >
// //         {/* Search Input & Button */}
// //         <InputGroup
// //           bg="white"
// //           border="1px solid"
// //           borderColor="softGray.600"
// //           borderRadius="md"
// //           width={{ base: "100%", xl: "18rem" }}
// //           // sx={{
// //           // 	width: {
// //           // 		base: '100%',
// //           // 	},
// //           // 	'@media (min-width: 1695px)': {
// //           // 		wdith: '18rem',
// //           // 	},
// //           // }}
// //           overflow="hidden"
// //         >
// //           <Input
// //             id="searchInput"
// //             placeholder="search.."
// //             border="none"
// //             fontSize="xs"
// //             height="2.5rem"
// //             onChange={handleInputChange}
// //             onKeyDown={(e) => e.key === "Enter" && handleSearchByName()}
// //             _focus={{ boxShadow: "none" }}
// //           />
// //           <Button
// //             size="md"
// //             bg="softGray.700"
// //             borderLeft="1px solid"
// //             borderColor="softGray.600"
// //             px={4}
// //             borderRadius="0"
// //             fontSize="xs"
// //             display="flex"
// //             alignItems="center"
// //             _hover={{ bg: "gray.50" }}
// //             _active={{ bg: "gray.100" }}
// //             onClick={handleSearchByName}
// //           >
// //             <Flex align="center">
// //               Search <SearchIcon fontSize="xs" color="brand.500" ml={1} />
// //             </Flex>
// //           </Button>
// //         </InputGroup>

// //         <HStack gap="2">
// //           {/* Advance Search Button */}
// //           <Button
// //             border="1px solid"
// //             borderColor="softGray.600"
// //             bg="white"
// //             borderRadius="md"
// //             px={4}
// //             fontSize="xs"
// //             w="auto"
// //             minW="max-content"
// //             height="2.2rem"
// //             _hover={{ bg: "gray.50" }}
// //             _active={{ bg: "gray.100" }}
// //             onClick={() => setAdvanceSearch(true)}
// //           >
// //             Advance Search
// //           </Button>
// //         </HStack>
// //       </HStack>
// //     </Box>
// //   );
// // };

// // export default SearchBox;

// import { useState } from "react";
// import {
//   Input,
//   InputGroup,
//   InputRightElement,
//   Button,
//   HStack,
//   Box,
//   Flex,
//   IconButton,
// } from "@chakra-ui/react";
// import { SearchIcon } from "@chakra-ui/icons";
// import { BiX } from "react-icons/bi";

// const SearchBox = ({
//   setAdvanceSearch,
//   handleSearchByName,
//   searchTermRef,
//   onClear,
// }) => {
//   const [inputValue, setInputValue] = useState("");
//   const handleInputChange = (event) => {
//     const value = event.target.value;
//     setInputValue(value);
//     searchTermRef.current = value;
//   };

//   const handleClearInput = () => {
//     setInputValue("");
//     searchTermRef.current = "";
//     onClear();
//   };
//   console.log("SearchBox inputValue:", inputValue);

//   return (
//     <Box
//       width={{ base: "100%", xl: "fit-content" }}
//       bg="softGray.50"
//       p="1"
//       borderRadius="md"
//     >
//       <HStack
//         spacing={3}
//         gap="2"
//         justifyContent={{ base: "center" }}
//         flexDirection={{ base: "column", md: "row" }}
//       >
//         <Flex
//           bg="white"
//           border="1px solid"
//           borderColor="softGray.600"
//           borderRadius="md"
//           width={{ base: "100%", xl: "18rem" }}
//           overflow="hidden"
//         >
//           <InputGroup flex="1">
//             <Input
//               id="searchInput"
//               placeholder="search.."
//               border="none"
//               fontSize="xs"
//               height="2.5rem"
//               value={inputValue}
//               onChange={handleInputChange}
//               onKeyDown={(e) => e.key === "Enter" && handleSearchByName()}
//               _focus={{ boxShadow: "none" }}
//             />

//             {inputValue && (
//               <InputRightElement height="100%">
//                 <IconButton
//                   icon={<BiX />}
//                   size="md"
//                   variant="ghost"
//                   onClick={handleClearInput}
//                   aria-label="clear search"
//                 />
//               </InputRightElement>
//             )}
//           </InputGroup>

//           <Button
//             size="md"
//             bg="softGray.700"
//             borderLeft="1px solid"
//             borderColor="softGray.600"
//             px={4}
//             borderRadius="0"
//             fontSize="xs"
//             _hover={{ bg: "gray.50" }}
//             _active={{ bg: "gray.100" }}
//             onClick={handleSearchByName}
//           >
//             <Flex align="center">
//               Search <SearchIcon fontSize="xs" color="brand.500" ml={1} />
//             </Flex>
//           </Button>
//         </Flex>

//         <HStack gap="2">
//           <Button
//             border="1px solid"
//             borderColor="softGray.600"
//             bg="white"
//             borderRadius="md"
//             px={4}
//             fontSize="xs"
//             minW="max-content"
//             height="2.2rem"
//             _hover={{ bg: "gray.50" }}
//             _active={{ bg: "gray.100" }}
//             onClick={() => setAdvanceSearch(true)}
//           >
//             Advance Search
//           </Button>
//         </HStack>
//       </HStack>
//     </Box>
//   );
// };

// export default SearchBox;

import { useState } from 'react';
import {
	Input,
	InputGroup,
	InputRightElement,
	Button,
	HStack,
	Box,
	Flex,
	IconButton,
	Tooltip,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { BiX } from 'react-icons/bi';

const SearchBox = ({
	setAdvanceSearch,
	handleSearchByName,
	searchTermRef,
	onClear,
}) => {
	const [inputValue, setInputValue] = useState('');

	const handleInputChange = (event) => {
		const value = event.target.value;
		setInputValue(value);
		searchTermRef.current = value;
	};

	const handleClearInput = () => {
		setInputValue('');
		searchTermRef.current = '';
		if (onClear) onClear();
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSearchByName();
		}
	};

	return (
		<Box
			width={{ base: '100%', xl: 'fit-content' }}
			bg='bg.surface'
			border='1px solid'
			borderColor='border.default'
			p='1'
			borderRadius='md'
		>
			<HStack
				spacing={3}
				gap='2'
				justifyContent={{ base: 'center' }}
				flexDirection={{ base: 'column', md: 'row' }}
			>
				<Flex
					bg='bg.input'
					border='1px solid'
					borderColor='border.default'
					borderRadius='md'
					width={{ base: '100%', xl: '18rem' }}
					overflow='hidden'
					_focusWithin={{
						borderColor: 'border.focus',
						boxShadow: 'goldGlow',
					}}
				>
					<InputGroup flex='1'>
						<Input
							id='searchInput'
							placeholder='search..'
							border='none'
							fontSize='xs'
							height='2.5rem'
							value={inputValue}
							onChange={handleInputChange}
							onKeyDown={handleKeyPress}
							_focus={{ boxShadow: 'none' }}
							_placeholder={{
								color: 'text.muted',
							}}
							color='text.heading'
							bg='transparent'
						/>

						{inputValue && (
							<InputRightElement height='100%'>
								<Tooltip label='Clear search' hasArrow placement='top'>
									<IconButton
										icon={<BiX />}
										size='sm'
										variant='ghost'
										onClick={handleClearInput}
										aria-label='clear search'
									/>
								</Tooltip>
							</InputRightElement>
						)}
					</InputGroup>

					<Button
						size='md'
						variant='ghost'
						px={4}
						fontSize='xs'
						onClick={handleSearchByName}
					>
						<Flex align='center' gap={1}>
							Search
							<SearchIcon fontSize='xs' color='text.accent' />
						</Flex>
					</Button>
				</Flex>

				<HStack gap='2'>
					<Button
						variant='outline'
						px={4}
						fontSize='xs'
						height='2.2rem'
						onClick={() => setAdvanceSearch(true)}
					>
						Advance Search
					</Button>
				</HStack>
			</HStack>
		</Box>
	);
};

export default SearchBox;
