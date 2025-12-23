import {
	Box,
	Flex,
	Text,
	IconButton,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverArrow,
	Input,
	Button,
	PopoverBody,
	Portal,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaCoins, FaPencil } from 'react-icons/fa6';

const UserCoinsView = ({ user }) => {
	const [mode, setMode] = useState('add');
	const [amount, setAmount] = useState(0);

	return (
		<Flex align='center' justify='center' textAlign='center' gap={2} w='full'>
			{/* Coins Display */}
			<Flex align='center' gap={2}>
				<FaCoins size={16} strokeWidth={1.5} color='#e2a814ff' />
				<Text
					fontWeight='600'
					fontSize='15px'
					color='gray.800'
					fontFamily='mono'
				>
					{user?.coins || 450}
				</Text>
			</Flex>

			{/* Minimal Edit Trigger */}
			<Popover placement='bottom-end' isLazy>
				<PopoverTrigger>
					<IconButton
						aria-label='Edit Coins'
						icon={<FaPencil size={16} />}
						variant='ghost'
						size='xs'
						opacity={0.6}
						_hover={{
							opacity: 1,
							bg: 'gray.100',
						}}
					/>
				</PopoverTrigger>

				<Portal>
					{/* Portal ensures popover renders above ALL z-index stack */}
					<PopoverContent
						w='220px'
						borderRadius='14px'
						p={3}
						boxShadow='0px 6px 24px rgba(0,0,0,0.12)'
						zIndex={2000}
						border='1px solid'
						borderColor='gray.100'
						bg='white'
						animation='fadeIn 0.15s ease-out'
						_focus={{
							outline: 'none',
							boxShadow: '0px 6px 24px rgba(0,0,0,0.12) !important',
						}}
					>
						<PopoverArrow />
						<PopoverBody>
							<Flex direction='column' gap={4}>
								{/* Segmented Toggle */}
								<Flex bg='gray.100' p='4px' borderRadius='10px' gap='4px'>
									<Box
										flex={1}
										textAlign='center'
										py={1}
										fontSize='sm'
										fontWeight='600'
										cursor='pointer'
										borderRadius='8px'
										bg={mode === 'add' ? 'green.500' : 'transparent'}
										color={mode === 'add' ? 'white' : 'gray.700'}
										transition='all 0.15s'
										onClick={() => setMode('add')}
									>
										Add
									</Box>

									<Box
										flex={1}
										textAlign='center'
										py={1}
										fontSize='sm'
										fontWeight='600'
										cursor='pointer'
										borderRadius='8px'
										bg={mode === 'subtract' ? 'red.500' : 'transparent'}
										color={mode === 'subtract' ? 'white' : 'gray.700'}
										transition='all 0.15s'
										onClick={() => setMode('subtract')}
									>
										Sub
									</Box>
								</Flex>

								{/* Minimal Input */}
								<Input
									variant='flushed'
									placeholder='Enter amount'
									type='number'
									min={1}
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									fontSize='sm'
									_focus={{ borderColor: 'gray.400' }}
								/>

								{/* Apply Button */}
								<Button
									size='sm'
									borderRadius='10px'
									bg={mode === 'add' ? 'green.500' : 'red.500'}
									color='white'
									fontWeight='600'
									_hover={{
										bg: mode === 'add' ? 'green.600' : 'red.600',
									}}
									onClick={() => {}}
								>
									Apply
								</Button>
							</Flex>
						</PopoverBody>
					</PopoverContent>
				</Portal>
			</Popover>
		</Flex>
	);
};

export default UserCoinsView;
