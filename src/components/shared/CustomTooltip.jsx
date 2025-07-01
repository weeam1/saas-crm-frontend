import { useState, useEffect, useRef } from 'react';
import { Tooltip, Box, useMediaQuery } from '@chakra-ui/react';

const CustomTooltip = ({
	label,
	children,
	hasArrow = true,
	openDelay = 100,
	placement = 'top',
	autoCloseDelay = 2000,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isMobile] = useMediaQuery('(max-width: 768px)'); // Detect mobile devices

	// // Close tooltip when clicking outside
	// useEffect(() => {
	// 	const handleClickOutside = () => setIsOpen(false);
	// 	if (isOpen) document.addEventListener('click', handleClickOutside);
	// 	return () => document.removeEventListener('click', handleClickOutside);
	// }, [isOpen]);

	// // Toggle Tooltip on Click (For Mobile)
	// const handleToggle = (e) => {
	// 	e.stopPropagation(); // Prevent immediate closing
	// 	if (isMobile) setIsOpen((prev) => !prev);
	// };

	const ref = useRef(null);

	// Close on outside click or blur
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (ref.current && !ref.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	}, []);

	const handleToggle = (e) => {
		e.stopPropagation();
		setIsOpen(false); // Always close on click
		if (isMobile) setIsOpen((prev) => !prev); // Mobile toggles
	};

	const handleMouseEnter = () => !isMobile && setIsOpen(true);
	const handleMouseLeave = () => !isMobile && setIsOpen(false);

	return (
		<Tooltip
			label={label}
			hasArrow={hasArrow}
			whiteSpace='pre-line'
			isOpen={isMobile ? isOpen : undefined} // Mobile: Open on tap
			openDelay={openDelay}
			closeDelay={autoCloseDelay}
			placement={placement}
			{...props}
		>
			<Box
				ref={ref}
				p='0'
				m='0'
				border='none'
				outline='none'
				as='button'
				display='inline-flex'
				onClick={handleToggle} // Handle click for mobile users
				onMouseEnter={handleMouseEnter} // Show on hover (Desktop)
				onMouseLeave={handleMouseLeave} // Hide on hover out
			>
				{children}
			</Box>
		</Tooltip>
	);
};

export default CustomTooltip;
