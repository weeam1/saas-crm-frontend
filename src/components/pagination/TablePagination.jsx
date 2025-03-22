import { useEffect } from 'react';
import {
	Box,
	Flex,
	IconButton,
	Tooltip,
	Select,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	Text,
} from '@chakra-ui/react';
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
} from '@chakra-ui/icons';

const TablePagination = ({
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
	totalDocs,
}) => {
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
				fontSize={{ base: 'sm', md: 'md' }}
				flexDirection={{ base: 'column', md: 'row' }}
			>
				{pageOptions?.length !== 1 && (
					<Flex gap={2} alignItems='center'>
						<Tooltip label='First Page'>
							<IconButton
								size={{ base: 'sm', md: 'md' }}
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
									maxW={{ base: '20', md: '28' }}
									min={1}
									max={pageOptions?.length}
									value={gopageValue === 0 ? 1 : gopageValue}
									onChange={(valueAsString, valueAsNumber) => {
										if (!valueAsNumber || valueAsNumber < 1) {
											valueAsNumber = 1; // Set min value
										} else if (valueAsNumber > pageOptions?.length) {
											valueAsNumber = pageOptions.length; // Set max value
										}

										setGopageValue(valueAsNumber);
										gotoPage(valueAsNumber - 1);
									}}
								>
									<NumberInputField
										bg='gray.100'
										color='gray.800'
										border='2px solid'
										_focus={{
											border: '2px solid',
											borderColor: 'brand.500',
										}}
									/>
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>
							</Flex>
						</>
					)}
					<Select
						w={{ base: '24', md: '32' }}
						value={pageSize}
						bg='gray.100' // Background color
						color='gray.800' // Text color
						border='2px solid'
						_focus={{
							border: '2px solid',
							borderColor: 'brand.500', // Border color when focused
						}}
						onChange={(e) => setPageSize(Number(e.target.value))}
					>
						{(() => {
							const options = [];
							const step = 10; // Define a step increment for the page size options
							for (let i = step; i <= totalDocs; i += step) {
								options.push(
									<option key={i} value={i}>
										Show {i}
									</option>
								);
							}
							// Add a max option if totalDocs is not divisible by step
							if (totalDocs % step !== 0) {
								options.push(
									<option key={totalDocs} value={totalDocs}>
										Show {totalDocs}
									</option>
								);
							}
							return options;
						})()}
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

export default TablePagination;
