import React, { useState, useEffect } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	FormControl,
	FormLabel,
	Input,
	Button,
	VStack,
	SimpleGrid,
	useBreakpointValue,
	useColorModeValue,
	Flex,
	Text,
	Divider,
} from '@chakra-ui/react';
import SearchUsers from 'views/admin/whatsapp/WhatsappSettings/SearchUsers';

const AdvancedSearchModal = ({
	isOpen,
	onClose,
	onApplyFilters,
	initialFilters,
	usersData,
}) => {
	const [filters, setFilters] = useState(initialFilters);
	const colSpan = useBreakpointValue({ base: 1, sm: 1, md: 2 });

	useEffect(() => {
		if (isOpen) setFilters(initialFilters);
	}, [isOpen, initialFilters]);

	const handleApply = () => {
		const cleanedFilters = Object.fromEntries(
			Object.entries(filters).filter(
				([_, value]) => value !== '' && value !== undefined && value !== null
			)
		);
		onApplyFilters(cleanedFilters);
		onClose();
	};

	const handleClear = () => setFilters({});

	const isFilterUnchanged =
		JSON.stringify(filters) === JSON.stringify(initialFilters);

	const bgColor = useColorModeValue('white', 'gray.800');
	const headerColor = useColorModeValue('brand.300', 'brand.100');
	const textColor = useColorModeValue('brand.700', 'brand.900');
	const borderColor = useColorModeValue('gray.200', 'gray.700');
	const inputBg = useColorModeValue('gray.50', 'gray.900');

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='xl'
			isCentered
			scrollBehavior='inside'
			motionPreset='slideInBottom'
		>
			<ModalOverlay />
			<ModalContent
				bg={bgColor}
				borderRadius='2xl'
				shadow='2xl'
				overflow='hidden'
				mx={{ base: 3, md: 0 }}
			>
				{/* Header */}
				<ModalHeader
					p={0}
					borderBottom='1px solid'
					borderColor={borderColor}
					fontWeight='semibold'
					fontSize='lg'
				>
					<Flex
						align='center'
						justify='space-between'
						bg={headerColor}
						color={textColor}
						px={6}
						py={3}
						position='sticky'
						top='0'
						zIndex='10'
						boxShadow='sm'
					>
						<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='semibold'>
							Advanced Search
						</Text>
						<ModalCloseButton
							color={textColor}
							position='relative'
							top='0'
							size='sm'
						/>
					</Flex>
				</ModalHeader>

				{/* Body */}
				<ModalBody
					p={5}
					overflowY='auto'
					maxH='65vh'
					bg={inputBg}
					borderBottom='1px solid'
					borderColor={borderColor}
				>
					<VStack spacing={5} align='stretch'>
						<FormControl>
							<FormLabel fontWeight='medium'>Select User</FormLabel>
							<SearchUsers
								selectedUserId={filters.user || null}
								users={usersData?.doc || []}
								onSelectUser={(user) =>
									setFilters({ ...filters, user: user?._id || '' })
								}
							/>
						</FormControl>

						{/* <SimpleGrid columns={colSpan} gap={5} w="full">
              <FormControl>
                <FormLabel fontWeight="medium">
                  SIP ID
                </FormLabel>
                <Input
                  value={filters.sipId || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, sipId: e.target.value })
                  }
                  placeholder="Enter SIP ID"
                  bg={bgColor}
                  focusBorderColor="brand.500"
                  borderRadius="md"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="medium">
                  Extension ID
                </FormLabel>
                <Input
                  value={filters.extensionId || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, extensionId: e.target.value })
                  }
                  placeholder="Enter Extension ID"
                  bg={bgColor}
                  focusBorderColor="brand.500"
                  borderRadius="md"
                />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={colSpan} gap={5} w="full">
              <FormControl>
                <FormLabel fontWeight="medium">
                  SIP IP
                </FormLabel>
                <Input
                  value={filters.sipIp || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, sipIp: e.target.value })
                  }
                  placeholder="Enter SIP IP"
                  bg={bgColor}
                  focusBorderColor="brand.500"
                  borderRadius="md"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="medium" >
                  SIP Port
                </FormLabel>
                <Input
                  value={filters.sipPort || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, sipPort: e.target.value })
                  }
                  placeholder="Enter SIP Port"
                  bg={bgColor}
                  focusBorderColor="brand.500"
                  borderRadius="md"
                />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel fontWeight="medium">
                SIM Number
              </FormLabel>
              <Input
                value={filters.sipSimNumber || ""}
                onChange={(e) =>
                  setFilters({ ...filters, sipSimNumber: e.target.value })
                }
                placeholder="Enter SIM Number"
                bg={bgColor}
                focusBorderColor="brand.500"
                borderRadius="md"
              />
            </FormControl> */}
					</VStack>
				</ModalBody>

				<Divider />

				{/* Footer */}
				<ModalFooter
					position='sticky'
					bottom='0'
					bg={bgColor}
					borderTop='1px solid'
					borderColor={borderColor}
					py={3}
					px={5}
					zIndex='10'
					justifyContent='flex-end'
					gap={3}
				>
					<Button
						variant='outline'
						colorScheme='gray'
						size='sm'
						onClick={handleClear}
						borderRadius='md'
						isDisabled={Object.keys(filters).length === 0}
					>
						Clear
					</Button>
					<Button
						colorScheme='brand'
						size='sm'
						onClick={handleApply}
						isDisabled={isFilterUnchanged}
						borderRadius='md'
					>
						Apply Filters
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AdvancedSearchModal;
