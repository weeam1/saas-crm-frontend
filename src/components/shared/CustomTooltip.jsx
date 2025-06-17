import { useState, useEffect } from 'react';
import { Tooltip, Box, useMediaQuery } from '@chakra-ui/react';

const CustomTooltip = ({
	label,
	children,
	hasArrow = true,
	openDelay = 100,
	placement = 'top',
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isMobile] = useMediaQuery('(max-width: 768px)'); // Detect mobile devices

	// Close tooltip when clicking outside
	useEffect(() => {
		const handleClickOutside = () => setIsOpen(false);
		if (isOpen) document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	}, [isOpen]);

	// Toggle Tooltip on Click (For Mobile)
	const handleToggle = (e) => {
		e.stopPropagation(); // Prevent immediate closing
		if (isMobile) setIsOpen((prev) => !prev);
	};

	return (
		<Tooltip
			label={label}
			hasArrow={hasArrow}
			whiteSpace='pre-line'
			isOpen={isMobile ? isOpen : undefined} // Mobile: Open on tap
			openDelay={openDelay}
			placement={placement}
			{...props}
		>
			<Box
				p='0'
				m='0'
				border='none'
				outline='none'
				as='button'
				display='inline-flex'
				onClick={handleToggle} // Handle click for mobile users
				onMouseEnter={!isMobile ? () => setIsOpen(true) : undefined} // Show on hover (Desktop)
				onMouseLeave={!isMobile ? () => setIsOpen(false) : undefined} // Hide on hover out
			>
				{children}
			</Box>
		</Tooltip>
	);
};

export default CustomTooltip;
