// import {
// 	MenuItem,
// 	MenuDivider,
// 	Menu,
// 	MenuList,
// 	MenuButton,
// 	IconButton,
// } from '@chakra-ui/react';
// import { usePermissions } from 'hooks/usePermissions';
// import { FiEdit, FiEye, FiXCircle, FiMoreVertical } from 'react-icons/fi';
// import { MdDelete } from 'react-icons/md';

// const MenuOptions = ({
// 	isSuperAdmin,
// 	user,
// 	deal,
// 	handleEdit,
// 	handleDelete,
// 	handleCancelled,
// 	handleView,
// }) => {
// 	const { hasPermission } = usePermissions();

// 	return (
// 		<Menu placement='bottom-end' zIndex='100'>
// 			<MenuButton
// 				as={IconButton}
// 				icon={<FiMoreVertical />}
// 				aria-label='Options'
// 				variant='ghost'
// 				size='sm'
// 				fontSize='18px'
// 				// colorScheme='gray'
// 				rounded='full'
// 				_focus={{ boxShadow: 'none', outline: 'none' }}
// 			/>
// 			<MenuList borderRadius='xl' py={2} fontSize='md' minW='180px'>
// 				<MenuItem
// 					icon={<FiEye size={18} />}
// 					onClick={() => handleView(deal)}
// 					color='blue.600'
// 					_hover={{ bg: 'blue.50', color: 'blue.700' }}
// 				>
// 					Deal details
// 				</MenuItem>

// 				{hasPermission('deal', 'update') && (
// 					<MenuItem
// 						icon={<FiEdit size={18} />} // bigger icons in menu
// 						onClick={() => handleEdit(deal)}
// 						color='green.600'
// 						_hover={{ bg: 'green.50', color: 'green.700' }}
// 					>
// 						Edit deal
// 					</MenuItem>
// 				)}

// 				<MenuDivider />

// 				{deal.dealStatus !== 'Cancelled' &&
// 					// (isSuperAdmin || deal.closedBy._id === user._id)
// 					hasPermission('deal', 'cancel') && (
// 						<MenuItem
// 							icon={<FiXCircle size={18} />}
// 							onClick={() => handleCancelled(deal._id)}
// 							color='gray.600'
// 							_hover={{ bg: 'gray.50', color: 'gray.700' }}
// 						>
// 							Cancel Deal
// 						</MenuItem>
// 					)}

// 				{hasPermission('deal', 'delete') && (
// 					<MenuItem
// 						icon={<MdDelete size={18} />}
// 						onClick={() => handleDelete(deal._id)}
// 						color='red.500'
// 						_hover={{ bg: 'gray.50', color: 'red.600' }}
// 					>
// 						Delete
// 					</MenuItem>
// 				)}
// 			</MenuList>
// 		</Menu>
// 	);
// };

// export default MenuOptions;

import {
	MenuItem,
	MenuDivider,
	Menu,
	MenuList,
	MenuButton,
	IconButton,
} from '@chakra-ui/react';
import { usePermissions } from 'hooks/usePermissions';
import { FiEdit, FiEye, FiXCircle, FiMoreVertical } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';

const MenuOptions = ({
	isSuperAdmin,
	user,
	deal,
	handleEdit,
	handleDelete,
	handleCancelled,
	handleView,
}) => {
	const { hasPermission } = usePermissions();

	return (
		<Menu placement='bottom-end' zIndex='100'>
			<MenuButton
				as={IconButton}
				icon={<FiMoreVertical />}
				aria-label='Options'
				variant='ghost'
				size='sm'
				fontSize='18px'
				rounded='full'
				color='text.muted'
				_hover={{
					bg: 'bg.elevated',
					color: 'accent.gold',
				}}
				_active={{
					bg: 'bg.elevated',
					color: 'accent.gold',
				}}
				_focus={{ boxShadow: 'none', outline: 'none' }}
			/>
			<MenuList borderRadius='xl' py={2} fontSize='md' minW='180px'>
				<MenuItem
					icon={<FiEye size={18} />}
					onClick={() => handleView(deal)}
					color='blue.400'
					_hover={{
						bg: 'rgba(59, 130, 246, 0.08)',
						color: 'blue.300',
						borderRadius: 'md',
					}}
					_focus={{ bg: 'rgba(59, 130, 246, 0.08)' }}
				>
					Deal details
				</MenuItem>

				{hasPermission('deal', 'update') && (
					<MenuItem
						icon={<FiEdit size={18} />}
						onClick={() => handleEdit(deal)}
						color='green.400'
						_hover={{
							bg: 'rgba(16, 185, 129, 0.08)',
							color: 'green.300',
							borderRadius: 'md',
						}}
						_focus={{ bg: 'rgba(16, 185, 129, 0.08)' }}
					>
						Edit deal
					</MenuItem>
				)}

				<MenuDivider />

				{deal.dealStatus !== 'Cancelled' &&
					// (isSuperAdmin || deal.closedBy._id === user._id)
					hasPermission('deal', 'cancel') && (
						<MenuItem
							icon={<FiXCircle size={18} />}
							onClick={() => handleCancelled(deal._id)}
							color='orange.400'
							_hover={{
								bg: 'rgba(255, 181, 71, 0.08)',
								color: 'orange.300',
								borderRadius: 'md',
							}}
							_focus={{ bg: 'rgba(255, 181, 71, 0.08)' }}
						>
							Cancel Deal
						</MenuItem>
					)}

				{hasPermission('deal', 'delete') && (
					<MenuItem
						icon={<MdDelete size={18} />}
						onClick={() => handleDelete(deal._id)}
						color='red.400'
						_hover={{
							bg: 'rgba(238, 93, 80, 0.08)',
							color: 'red.300',
							borderRadius: 'md',
						}}
						_focus={{ bg: 'rgba(238, 93, 80, 0.08)' }}
					>
						Delete
					</MenuItem>
				)}
			</MenuList>
		</Menu>
	);
};

export default MenuOptions;
