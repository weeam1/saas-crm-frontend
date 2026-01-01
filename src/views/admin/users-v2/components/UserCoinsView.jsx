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
import { useUpdateItemMutation } from 'api/apiSlice';
import { useState } from 'react';
import { FaCoins, FaPencil } from 'react-icons/fa6';
import { toast } from 'react-toastify';

const UserCoinsView = ({ user, updateData }) => {
	const [mode, setMode] = useState('add');
	const [newCoins, setNewCoins] = useState('');

	const [isOpen, setIsOpen] = useState(false);

	const [updateUser, { isLoading: isUpdating }] = useUpdateItemMutation();

	const handleSaveCoins = async () => {
		const coinsDiff = mode === 'add' ? newCoins : -newCoins;
		try {
			const res = await updateUser({
				path: `/v3/users/${user?._id}`,
				body: {
					coins: Number(coinsDiff),
				},
			}).unwrap();

			toast.success('Coins have been updated!');

			setMode('add');
			setNewCoins('');
			setIsOpen(false);
			updateData(user?._id, res?.doc, 'update');
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to update coins!');
		}
	};

	return (
		<Flex
			align='center'
			justify='flex-start'
			textAlign='center'
			gap={2}
			w='full'
		>
			{/* Coins Display */}
			<Flex align='center' gap={2}>
				<FaCoins size={16} strokeWidth={1.5} color='#e2a814ff' />
				<Text
					fontWeight='600'
					fontSize='15px'
					color='gray.800'
					fontFamily='mono'
				>
					{user?.coins || 0}
				</Text>
			</Flex>

			{/* Minimal Edit Trigger */}
			<Popover
				placement='bottom-end'
				isLazy
				closeOnBlur={!isUpdating}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			>
				<PopoverTrigger>
					<IconButton
						aria-label='Edit Coins'
						icon={<FaPencil size={16} />}
						variant='ghost'
						size='xs'
						opacity={0.6}
						onClick={() => setIsOpen(true)}
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
									placeholder='Enter coins'
									type='number'
									min={1}
									value={newCoins}
									onChange={(e) => setNewCoins(e.target.value)}
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
									onClick={handleSaveCoins}
									isLoading={isUpdating}
									isDisabled={isUpdating}
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
