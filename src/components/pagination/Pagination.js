import {
	ArrowLeftIcon,
	ArrowRightIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from '@chakra-ui/icons';
import {
	Box,
	Flex,
	IconButton,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
	Text,
	Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import { useEffect } from 'react';

const Pagination = (props) => {
	const {
		gotoPage,
		gopageValue,
		setGopageValue,
		pageCount,
		canPreviousPage,
		previousPage,
		canNextPage,
		pageOptions,
		setPageSize,
		nextPage,
		pageSize,
		pageIndex,
	} = props;

	useEffect(() => {
		setGopageValue(1);
	}, []);

	return (
		<Box mt={4} overflowX='auto' w='100%' mb='4'>
			<Flex
				justifyContent={pageOptions?.length !== 1 ? 'space-between' : 'end'}
				mt={2}
				alignItems='center'
				flexWrap='wrap'
				gap={4}
				fontSize={{ base: 'sm', md: 'md' }} // Small text for small screens
				flexDirection={{ base: 'column', md: 'row' }} // Stack items on small screens
			>
				{pageOptions?.length !== 1 && (
					<Flex gap={2} alignItems='center'>
						<Tooltip label='First Page'>
							<IconButton
								size={{ base: 'sm', md: 'md' }} // Smaller button on small screens
								onClick={() => {
									gotoPage(0);
									setGopageValue(1);
								}}
								isDisabled={!canPreviousPage}
								icon={<ArrowLeftIcon h={3} w={3} />}
							/>
						</Tooltip>
						<Tooltip label='Previous Page'>
							<IconButton
								size={{ base: 'sm', md: 'md' }}
								onClick={() => {
									previousPage();
									setGopageValue((prev) => prev - 1);
								}}
								isDisabled={!canPreviousPage}
								icon={<ChevronLeftIcon h={6} w={6} />}
							/>
						</Tooltip>
					</Flex>
				)}

				<Flex alignItems='center' gap={2}>
					{pageOptions?.length !== 1 && (
						<>
							<Text>
								Page{' '}
								<Text as='span' fontWeight='bold'>
									{pageIndex + 1}
								</Text>{' '}
								of{' '}
								<Text as='span' fontWeight='bold'>
									{pageOptions?.length}
								</Text>
							</Text>
							<Flex gap={2} alignItems='center'>
								<Text>Go to page:</Text>
								<NumberInput
									// size={{ base: "sm", md: "md" }}
									maxW={{ base: '20', md: '28' }} // Adjust width for small screens
									min={1}
									max={pageOptions?.length}
									value={gopageValue === 0 ? 1 : gopageValue}
									onChange={(value) => {
										const page = value ? value - 1 : 0;
										gotoPage(page);
										setGopageValue(value);
									}}
								>
									<NumberInputField />
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>
							</Flex>
						</>
					)}
					<Select
						// size={{ base: "sm", md: "md", lg: "lg" }}
						w={{ base: '24', md: '32' }}
						value={pageSize}
						onChange={(e) => setPageSize(Number(e.target.value))}
					>
						{[5, 10, 20, 30, 40, 50, 80, 100, 200].map((size) => (
							<option key={size} value={size}>
								Show {size}
							</option>
						))}
					</Select>
				</Flex>

				{pageOptions?.length !== 1 && (
					<Flex gap={2}>
						<Tooltip label='Next Page'>
							<IconButton
								size={{ base: 'sm', md: 'md' }}
								onClick={() => {
									nextPage();
									setGopageValue((prev) => prev + 1);
								}}
								isDisabled={!canNextPage}
								icon={<ChevronRightIcon h={6} w={6} />}
							/>
						</Tooltip>
						<Tooltip label='Last Page'>
							<IconButton
								size={{ base: 'sm', md: 'md' }}
								onClick={() => {
									gotoPage(pageCount - 1);
									setGopageValue(pageCount);
								}}
								isDisabled={!canNextPage}
								icon={<ArrowRightIcon h={3} w={3} />}
							/>
						</Tooltip>
					</Flex>
				)}
			</Flex>
		</Box>
	);
};

export default Pagination;
