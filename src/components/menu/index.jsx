import {
	Box,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Spinner,
	Tooltip,
} from '@chakra-ui/react';
import { useState } from 'react';

export const IconButtonMenu = ({
	icon,
	onOpen,
	onClick,
	tooltip,
	noResultLabel,
}) => {
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleOnOpen = () => {
		setIsLoading(true);
		onOpen()
			.then((values) => setItems(values))
			.finally(() => setIsLoading(false));
	};
	return (
		<Menu onOpen={handleOnOpen}>
			<Tooltip label={tooltip}>
				<MenuButton
					as={IconButton}
					aria-label='Options'
					icon={icon}
					variant='unstyled'
				/>
			</Tooltip>

			<MenuList>
				{isLoading ? (
					<MenuItem>
						<Spinner color='brand.500' size='xs' />
					</MenuItem>
				) : items.length > 0 ? (
					<Box overflowY='auto' maxH='250px'>
						{items.map((i, idx) => (
							<MenuItem key={idx} onClick={() => onClick(i.name, i.value)}>
								{i.name}
							</MenuItem>
						))}
					</Box>
				) : (
					<MenuItem>{noResultLabel}</MenuItem>
				)}
			</MenuList>
		</Menu>
	);
};

export default IconButtonMenu;
