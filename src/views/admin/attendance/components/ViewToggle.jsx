import { useEffect } from 'react';
import { IconButton, HStack, Tooltip } from '@chakra-ui/react';
import { FaThLarge, FaTable } from 'react-icons/fa';
import CustomTooltip from 'components/shared/CustomTooltip';

const icons = [
	{ label: 'Grid View', icon: FaThLarge, value: 'grid' },
	{ label: 'Table View', icon: FaTable, value: 'table' },
];

const ViewToggle = ({ view, handleView }) => {
	useEffect(() => {
		localStorage.setItem('employeesView', view);
	}, [view]);

	const renderButton = ({ label, icon: Icon, value }) => {
		const isActive = view === value;

		return (
			<CustomTooltip key={value} label={label} hasArrow>
				<IconButton
					aria-label={label}
					icon={<Icon />}
					size='sm'
					variant={isActive ? 'solid' : 'ghost'}
					rounded='md'
					colorScheme='brand'
					onClick={() => handleView(value)}
				/>
			</CustomTooltip>
		);
	};

	return (
		<HStack spacing={1} bg='brand.100' px='2' py='1' rounded='md'>
			{icons.map(renderButton)}
		</HStack>
	);
};

export default ViewToggle;
