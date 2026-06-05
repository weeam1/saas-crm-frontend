
import { Flex, Button, IconButton, Box, HStack, Text } from '@chakra-ui/react';
import AddAccountModal from './AddAccount';
import CustomTooltip from 'components/shared/CustomTooltip';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import RefreshButton from 'components/refresh/RefreshButton';

const Header = ({
	accountCount,
	onAdd,
	isAdding,
	searchComponent,
	onClear,
	searchQuery,
	refetch,
	isLoading,
	searchTerm,
	isFetching,
}) => {
	return (
		<Flex
			justify='space-between'
			align='center'
			bg='bg.surface'
			p={5}
			mb={4}
			roundedTopRight='xl'
			roundedTopLeft='xl'
			borderBottom='1px solid'
			borderBottomColor='border.default'
			direction={{ base: 'column', md: 'row' }}
			w='100%'
			gap={5}
		>
			{/* Left Section - Back Button & Account Count */}
			<HStack spacing={4} w={{ base: '100%', md: 'auto' }}>
				{/* Account Count Component */}
				<Text fontSize={'20px'} fontWeight='bold' color='text.heading'>
					All Bank Accounts (
					<CountUpComponent targetNumber={Number(accountCount || 0)} />)
				</Text>
			</HStack>

			{/* Right Section - Search, Actions */}
			<Flex
				align='center'
				gap={3}
				w={{ base: '100%', md: 'auto' }}
				direction={{ base: 'column', sm: 'row' }}
			>
				{/* Search Component */}
				<Box w={{ base: '100%', sm: 'auto' }}>{searchComponent}</Box>

				{/* Clear Button */}
				{searchTerm && (
					<Button
						size='sm'
						variant='outline'
						onClick={onClear}
						borderRadius='lg'
						borderColor='border.default'
						color='text.body'
						_hover={{
							bg: 'bg.elevated',
							borderColor: 'gold.primary',
							color: 'gold.primary',
						}}
						transition='all 0.2s'
					>
						Clear
					</Button>
				)}

				{/* Add Account Button */}
				<AddAccountModal onAdd={onAdd} isAdding={isAdding} />

			<RefreshButton
								label="Refresh"
								onClick={() => refetch()}
								isLoading={isLoading}
								isFetching={isFetching}
								size="sm"
							/>
			</Flex>
		</Flex>
	);
};

export default Header;
