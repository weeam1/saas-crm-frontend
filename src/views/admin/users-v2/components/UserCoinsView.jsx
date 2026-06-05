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
import { useModalColors } from 'hooks/useModalColors';

const UserCoinsView = ({ user, updateData }) => {
	const colors = useModalColors();
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
				<FaCoins size={16} strokeWidth={1.5} color={colors.accentGold} />
				<Text
					fontWeight='600'
					fontSize='15px'
					color={colors.headingText}
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
						color={colors.bodyText}
						_hover={{
							opacity: 1,
							color: colors.accentGold,
							bg: colors.secondaryBtnHoverBg,
						}}
						transition='all 0.2s ease'
					/>
				</PopoverTrigger>

				<Portal>
					<PopoverContent
						w='220px'
						borderRadius='14px'
						p={3}
						boxShadow={colors.modalShadow}
						zIndex={2000}
						border='1px solid'
						borderColor={colors.borderColor}
						bg={colors.bg}
					>
						<PopoverArrow bg={colors.bg} borderColor={colors.borderColor} />
						<PopoverBody>
							<Flex direction='column' gap={4}>
								{/* Segmented Toggle */}
								<Flex bg={colors.bgInput} p='4px' borderRadius='10px' gap='4px'>
									<Box
										flex={1}
										textAlign='center'
										py={1}
										fontSize='sm'
										fontWeight='600'
										cursor='pointer'
										borderRadius='8px'
										bg={mode === 'add' ? colors.accentGold : 'transparent'}
										color={mode === 'add' ? colors.headerText : colors.bodyText}
										transition='all 0.15s'
										onClick={() => setMode('add')}
										_hover={{
											bg: mode === 'add' ? colors.goldLight : colors.bgInputHover,
											color: mode === 'add' ? colors.headerText : colors.headingText,
										}}
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
										bg={mode === 'subtract' ? colors.badgeErrorText : 'transparent'}
										color={mode === 'subtract' ? colors.headerText : colors.bodyText}
										transition='all 0.15s'
										onClick={() => setMode('subtract')}
										_hover={{
											bg: mode === 'subtract' ? colors.badgeErrorText : colors.bgInputHover,
											color: mode === 'subtract' ? colors.headerText : colors.headingText,
										}}
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
									borderColor={colors.borderColor}
									color={colors.headingText}
									_focus={{ borderColor: colors.accentGold }}
									_placeholder={{ color: colors.mutedText }}
								/>

								{/* Apply Button */}
								<Button
									size='sm'
									borderRadius='10px'
									bg={mode === 'add' ? colors.accentGold : colors.badgeErrorText}
									color={colors.headerText}
									fontWeight='600'
									_hover={{
										bg: mode === 'add' ? colors.goldLight : colors.badgeErrorText,
										transform: 'translateY(-1px)',
										boxShadow: colors.goldGlow,
									}}
									_active={{ transform: 'translateY(0)' }}
									onClick={handleSaveCoins}
									isLoading={isUpdating}
									isDisabled={isUpdating}
									transition='all 0.2s ease'
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