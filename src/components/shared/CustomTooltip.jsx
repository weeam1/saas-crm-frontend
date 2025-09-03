import React, { useState, useRef, useEffect, useCallback } from 'react';
/******************************************* */

const CustomTooltip = ({
	label,
	children,
	hasArrow = true,
	openDelay = 100,
	closeDelay = 300,
	hoverCloseDelay = 500,
	placement = 'top',
	className = '',
	disabled = false,
	variant = 'default',
	size = 'md',
	trigger = 'auto', // 'auto', 'hover', 'click', 'focus'
	persistent = false, // If true, only closes on outside click or ESC
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [actualPlacement, setActualPlacement] = useState(placement);
	const [interactionType, setInteractionType] = useState(null); // 'hover' | 'click' | 'focus'

	const tooltipRef = useRef(null);
	const triggerRef = useRef(null);
	const openTimeoutRef = useRef(null);
	const closeTimeoutRef = useRef(null);
	const hoverTimeoutRef = useRef(null);

	// Detect mobile devices and touch capability
	useEffect(() => {
		const checkMobile = () => {
			const isTouchDevice =
				'ontouchstart' in window || navigator.maxTouchPoints > 0;
			const isSmallScreen = window.innerWidth <= 768;
			setIsMobile(isTouchDevice || isSmallScreen);
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Clear all timeouts
	const clearAllTimeouts = useCallback(() => {
		[openTimeoutRef, closeTimeoutRef, hoverTimeoutRef].forEach((ref) => {
			if (ref.current) {
				clearTimeout(ref.current);
				ref.current = null;
			}
		});
	}, []);

	// Enhanced close tooltip function
	const closeTooltip = useCallback(
		(immediate = false) => {
			clearAllTimeouts();

			if (immediate || persistent) {
				setIsOpen(false);
				setInteractionType(null);
				return;
			}

			// Use different delays based on interaction type
			const delay = interactionType === 'hover' ? hoverCloseDelay : closeDelay;

			closeTimeoutRef.current = setTimeout(() => {
				setIsOpen(false);
				setInteractionType(null);
			}, delay);
		},
		[closeDelay, hoverCloseDelay, persistent, interactionType]
	);

	// Open tooltip function
	const openTooltip = useCallback(
		(type, immediate = false) => {
			if (disabled) return;

			clearAllTimeouts();
			setInteractionType(type);

			if (immediate) {
				setIsOpen(true);
				return;
			}

			openTimeoutRef.current = setTimeout(() => {
				setIsOpen(true);
			}, openDelay);
		},
		[disabled, openDelay]
	);

	// Handle click outside and escape key
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				isOpen &&
				tooltipRef.current &&
				!tooltipRef.current.contains(event.target) &&
				triggerRef.current &&
				!triggerRef.current.contains(event.target)
			) {
				closeTooltip(true);
			}
		};

		const handleEscapeKey = (event) => {
			if (event.key === 'Escape' && isOpen) {
				closeTooltip(true);
			}
		};

		const handleScroll = () => {
			if (isOpen && !persistent) {
				closeTooltip(true);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			document.addEventListener('keydown', handleEscapeKey);
			window.addEventListener('scroll', handleScroll, true);

			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
				document.removeEventListener('keydown', handleEscapeKey);
				window.removeEventListener('scroll', handleScroll, true);
			};
		}
	}, [isOpen, closeTooltip, persistent]);

	// Auto-close tooltip after a certain time for click interactions
	useEffect(() => {
		if (isOpen && interactionType === 'click' && !persistent) {
			const autoCloseTimeout = setTimeout(() => {
				closeTooltip(true);
			}, 3000); // Auto close after 3 seconds for click interactions

			return () => clearTimeout(autoCloseTimeout);
		}
	}, [isOpen, interactionType, persistent, closeTooltip]);

	// Position tooltip with collision detection
	useEffect(() => {
		if (isOpen && tooltipRef.current && triggerRef.current) {
			const tooltip = tooltipRef.current;
			const trigger = triggerRef.current;
			const triggerRect = trigger.getBoundingClientRect();
			const tooltipRect = tooltip.getBoundingClientRect();
			const viewport = {
				width: window.innerWidth,
				height: window.innerHeight,
			};

			const offset = 12;
			const arrowSize = hasArrow ? 8 : 0;

			// Calculate positions for all placements
			const positions = {
				top: {
					top: triggerRect.top - tooltipRect.height - offset - arrowSize,
					left:
						triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
				},
				bottom: {
					top: triggerRect.bottom + offset + arrowSize,
					left:
						triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
				},
				left: {
					top:
						triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
					left: triggerRect.left - tooltipRect.width - offset - arrowSize,
				},
				right: {
					top:
						triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
					left: triggerRect.right + offset + arrowSize,
				},
			};

			// Collision detection
			let bestPlacement = placement;
			let position = positions[placement];

			const isOutOfBounds = (pos) => {
				return (
					pos.top < 8 ||
					pos.left < 8 ||
					pos.top + tooltipRect.height > viewport.height - 8 ||
					pos.left + tooltipRect.width > viewport.width - 8
				);
			};

			if (isOutOfBounds(position)) {
				const alternatives = {
					top: ['bottom', 'right', 'left'],
					bottom: ['top', 'right', 'left'],
					left: ['right', 'top', 'bottom'],
					right: ['left', 'top', 'bottom'],
				};

				for (const alt of alternatives[placement]) {
					if (!isOutOfBounds(positions[alt])) {
						bestPlacement = alt;
						position = positions[alt];
						break;
					}
				}
			}

			// Constrain to viewport
			position.left = Math.max(
				8,
				Math.min(position.left, viewport.width - tooltipRect.width - 8)
			);
			position.top = Math.max(
				8,
				Math.min(position.top, viewport.height - tooltipRect.height - 8)
			);

			tooltip.style.top = `${position.top}px`;
			tooltip.style.left = `${position.left}px`;
			setActualPlacement(bestPlacement);
		}
	}, [isOpen, placement, hasArrow]);

	// Determine effective trigger based on device and settings
	const getEffectiveTrigger = () => {
		if (trigger !== 'auto') return trigger;
		return isMobile ? 'click' : 'hover';
	};

	const effectiveTrigger = getEffectiveTrigger();

	// Event handlers
	const handleMouseEnter = () => {
		if (effectiveTrigger === 'hover' || effectiveTrigger === 'focus') {
			openTooltip('hover');
		}
	};

	const handleMouseLeave = () => {
		if (effectiveTrigger === 'hover' && interactionType === 'hover') {
			closeTooltip();
		}
	};

	const handleClick = (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (effectiveTrigger === 'click' || isMobile) {
			if (isOpen && interactionType === 'click') {
				closeTooltip(true);
			} else {
				openTooltip('click', true);
			}
		}
	};

	const handleFocus = () => {
		if (effectiveTrigger === 'focus') {
			openTooltip('focus', true);
		}
	};

	const handleBlur = () => {
		if (effectiveTrigger === 'focus' && interactionType === 'focus') {
			closeTooltip();
		}
	};

	const handleTooltipMouseEnter = () => {
		// Keep tooltip open when hovering over it
		if (interactionType === 'hover') {
			clearAllTimeouts();
		}
	};

	const handleTooltipMouseLeave = () => {
		// Close tooltip when mouse leaves tooltip area
		if (interactionType === 'hover') {
			closeTooltip();
		}
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => clearAllTimeouts();
	}, [clearAllTimeouts]);

	return (
		<>
			<style jsx>{`
				.tooltip-container {
					position: relative;
					display: inline-block;
				}

				.tooltip-trigger {
					display: inline-flex;
					cursor: ${effectiveTrigger === 'click'
						? 'pointer'
						: effectiveTrigger === 'hover'
							? 'help'
							: 'default'};
					transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
					outline: none;
				}

				.tooltip-trigger:hover:not(.disabled) {
					transform: translateY(-1px);
				}

				.tooltip-trigger:focus-visible {
					// outline: 2px solid #3b82f6;
					outline-offset: 2px;
					border-radius: 4px;
				}

				.tooltip-trigger.disabled {
					cursor: not-allowed;
					opacity: 0.6;
				}

				.tooltip-base {
					position: fixed;
					z-index: 9999;
					font-weight: 500;
					border-radius: 8px;
					box-shadow:
						0 10px 25px rgba(0, 0, 0, 0.1),
						0 4px 6px rgba(0, 0, 0, 0.05);
					backdrop-filter: blur(10px);
					border: 1px solid rgba(255, 255, 255, 0.1);
					pointer-events: auto;
					transform-origin: center;
					transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
					word-wrap: break-word;
					line-height: 1.4;
				}

				.tooltip-base.show {
					opacity: 1;
					transform: scale(1) translateY(0);
					animation: tooltipSlideIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
				}

				.tooltip-base.hide {
					opacity: 0;
					transform: scale(0.95) translateY(4px);
				}

				@keyframes tooltipSlideIn {
					0% {
						opacity: 0;
						transform: scale(0.9) translateY(8px);
					}
					100% {
						opacity: 1;
						transform: scale(1) translateY(0);
					}
				}

				/* Size variants */
				.tooltip-sm {
					padding: 6px 10px;
					font-size: 12px;
					max-width: 200px;
				}

				.tooltip-md {
					padding: 8px 12px;
					font-size: 14px;
					max-width: 280px;
				}

				.tooltip-lg {
					padding: 12px 16px;
					font-size: 16px;
					max-width: 320px;
				}

				/* Variant styles */
				.tooltip-default {
					background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
					color: #f9fafb;
				}

				.tooltip-primary {
					background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
					color: #ffffff;
				}

				.tooltip-success {
					background: linear-gradient(135deg, #10b981 0%, #059669 100%);
					color: #ffffff;
				}

				.tooltip-warning {
					background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
					color: #ffffff;
				}

				.tooltip-error {
					background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
					color: #ffffff;
				}

				.tooltip-info {
					background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
					color: #ffffff;
				}

				.tooltip-dark {
					background: linear-gradient(135deg, #111827 0%, #000000 100%);
					color: #f9fafb;
					border: 1px solid #374151;
				}

				.tooltip-light {
					background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
					color: #1f2937;
					border: 1px solid #e5e7eb;
					box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
				}

				/* Arrow styles */
				.tooltip-arrow {
					position: absolute;
					width: 0;
					height: 0;
					border-style: solid;
					filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
				}

				.tooltip-arrow-top {
					bottom: -8px;
					left: 50%;
					transform: translateX(-50%);
					border-left: 8px solid transparent;
					border-right: 8px solid transparent;
					border-top: 8px solid;
				}

				.tooltip-arrow-bottom {
					top: -8px;
					left: 50%;
					transform: translateX(-50%);
					border-left: 8px solid transparent;
					border-right: 8px solid transparent;
					border-bottom: 8px solid;
				}

				.tooltip-arrow-left {
					right: -8px;
					top: 50%;
					transform: translateY(-50%);
					border-top: 8px solid transparent;
					border-bottom: 8px solid transparent;
					border-left: 8px solid;
				}

				.tooltip-arrow-right {
					left: -8px;
					top: 50%;
					transform: translateY(-50%);
					border-top: 8px solid transparent;
					border-bottom: 8px solid transparent;
					border-right: 8px solid;
				}

				/* Arrow colors for variants */
				.tooltip-default .tooltip-arrow-top {
					border-top-color: #374151;
				}
				.tooltip-default .tooltip-arrow-bottom {
					border-bottom-color: #374151;
				}
				.tooltip-default .tooltip-arrow-left {
					border-left-color: #374151;
				}
				.tooltip-default .tooltip-arrow-right {
					border-right-color: #374151;
				}

				.tooltip-primary .tooltip-arrow-top {
					border-top-color: #3b82f6;
				}
				.tooltip-primary .tooltip-arrow-bottom {
					border-bottom-color: #3b82f6;
				}
				.tooltip-primary .tooltip-arrow-left {
					border-left-color: #3b82f6;
				}
				.tooltip-primary .tooltip-arrow-right {
					border-right-color: #3b82f6;
				}

				.tooltip-success .tooltip-arrow-top {
					border-top-color: #10b981;
				}
				.tooltip-success .tooltip-arrow-bottom {
					border-bottom-color: #10b981;
				}
				.tooltip-success .tooltip-arrow-left {
					border-left-color: #10b981;
				}
				.tooltip-success .tooltip-arrow-right {
					border-right-color: #10b981;
				}

				.tooltip-warning .tooltip-arrow-top {
					border-top-color: #f59e0b;
				}
				.tooltip-warning .tooltip-arrow-bottom {
					border-bottom-color: #f59e0b;
				}
				.tooltip-warning .tooltip-arrow-left {
					border-left-color: #f59e0b;
				}
				.tooltip-warning .tooltip-arrow-right {
					border-right-color: #f59e0b;
				}

				.tooltip-error .tooltip-arrow-top {
					border-top-color: #ef4444;
				}
				.tooltip-error .tooltip-arrow-bottom {
					border-bottom-color: #ef4444;
				}
				.tooltip-error .tooltip-arrow-left {
					border-left-color: #ef4444;
				}
				.tooltip-error .tooltip-arrow-right {
					border-right-color: #ef4444;
				}

				.tooltip-info .tooltip-arrow-top {
					border-top-color: #06b6d4;
				}
				.tooltip-info .tooltip-arrow-bottom {
					border-bottom-color: #06b6d4;
				}
				.tooltip-info .tooltip-arrow-left {
					border-left-color: #06b6d4;
				}
				.tooltip-info .tooltip-arrow-right {
					border-right-color: #06b6d4;
				}

				.tooltip-dark .tooltip-arrow-top {
					border-top-color: #111827;
				}
				.tooltip-dark .tooltip-arrow-bottom {
					border-bottom-color: #111827;
				}
				.tooltip-dark .tooltip-arrow-left {
					border-left-color: #111827;
				}
				.tooltip-dark .tooltip-arrow-right {
					border-right-color: #111827;
				}

				.tooltip-light .tooltip-arrow-top {
					border-top-color: #ffffff;
				}
				.tooltip-light .tooltip-arrow-bottom {
					border-bottom-color: #ffffff;
				}
				.tooltip-light .tooltip-arrow-left {
					border-left-color: #ffffff;
				}
				.tooltip-light .tooltip-arrow-right {
					border-right-color: #ffffff;
				}

				/* Responsive design */
				@media (max-width: 768px) {
					.tooltip-base {
						max-width: 250px;
						font-size: 13px;
					}
					.tooltip-lg {
						max-width: 280px;
						font-size: 14px;
					}
				}

				/* Accessibility */
				@media (prefers-reduced-motion: reduce) {
					.tooltip-base {
						transition: opacity 0.15s ease;
					}
					.tooltip-base.show {
						animation: none;
					}
				}

				/* Click indicator for mobile */
				@media (max-width: 768px) {
					.tooltip-trigger::after {
						content: '';
						position: absolute;
						top: -2px;
						right: -2px;
						width: 4px;
						height: 4px;
						border-radius: 50%;
						background: #3b82f6;
						opacity: 0.7;
					}
				}
			`}</style>

			<div className='tooltip-container'>
				<div
					ref={triggerRef}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onClick={handleClick}
					onFocus={handleFocus}
					onBlur={handleBlur}
					className={`tooltip-trigger ${disabled ? 'disabled' : ''}`}
					tabIndex={effectiveTrigger === 'focus' ? 0 : -1}
					aria-describedby={isOpen ? 'tooltip' : undefined}
				>
					{children}
				</div>

				{isOpen && (
					<div
						ref={tooltipRef}
						onMouseEnter={handleTooltipMouseEnter}
						onMouseLeave={handleTooltipMouseLeave}
						className={`
							tooltip-base
							tooltip-${variant}
							tooltip-${size}
							${isOpen ? 'show' : 'hide'}
							${className}
						`}
						role='tooltip'
						id='tooltip'
						aria-hidden={!isOpen}
						{...props}
					>
						{label}
						{hasArrow && (
							<div
								className={`tooltip-arrow tooltip-arrow-${actualPlacement}`}
							/>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default CustomTooltip;

/******************************************* */

// const CustomTooltip = ({
// 	label,
// 	children,
// 	hasArrow = true,
// 	openDelay = 100,
// 	placement = 'top',
// 	autoCloseDelay = 1000,
// 	...props
// }) => {
// 	const [isOpen, setIsOpen] = useState(false);
// 	const [isMobile] = useMediaQuery('(max-width: 768px)');

// 	const ref = useRef(null);

// 	// Close on outside click or blur
// 	useEffect(() => {
// 		const handleClickOutside = (event) => {
// 			if (ref.current && !ref.current.contains(event.target)) {
// 				setIsOpen(false);
// 			}
// 		};

// 		document.addEventListener('click', handleClickOutside);
// 		return () => document.removeEventListener('click', handleClickOutside);
// 	}, []);

// 	const handleToggle = (e) => {
// 		e.stopPropagation();
// 		setIsOpen(false); // Always close on click
// 		if (isMobile) setIsOpen((prev) => !prev); // Mobile toggles
// 	};

// 	const handleMouseEnter = () => !isMobile && setIsOpen(true);
// 	const handleMouseLeave = () => !isMobile && setIsOpen(false);

// 	return (
// 		<Tooltip
// 			label={label}
// 			hasArrow={hasArrow}
// 			whiteSpace='pre-line'
// 			isOpen={isMobile ? isOpen : undefined} // Mobile: Open on tap
// 			openDelay={openDelay}
// 			closeDelay={autoCloseDelay}
// 			placement={placement}
// 			{...props}
// 		>
// 			<Box
// 				ref={ref}
// 				p='0'
// 				m='0'
// 				border='none'
// 				outline='none'
// 				as='button'
// 				display='inline-flex'
// 				onClick={handleToggle} // Handle click for mobile users
// 				onMouseEnter={handleMouseEnter} // Show on hover (Desktop)
// 				onMouseLeave={handleMouseLeave} // Hide on hover out
// 			>
// 				{children}
// 			</Box>
// 		</Tooltip>
// 	);
// };

/******************************************* */

// const CustomTooltip = ({
// 	label,
// 	children,
// 	hasArrow = true,
// 	openDelay = 100,
// 	autoCloseDelay = 500,
// 	placement = 'top',
// 	className = '',
// 	disabled = false,
// 	variant = 'default',
// 	size = 'md',
// 	...props
// }) => {
// 	const [isOpen, setIsOpen] = useState(false);
// 	const [isMobile, setIsMobile] = useState(false);
// 	const [actualPlacement, setActualPlacement] = useState(placement);
// 	const tooltipRef = useRef(null);
// 	const triggerRef = useRef(null);
// 	const timeoutRef = useRef(null);

// 	// Detect mobile devices
// 	useEffect(() => {
// 		const checkMobile = () => setIsMobile(window.innerWidth <= 768);
// 		checkMobile();
// 		window.addEventListener('resize', checkMobile);
// 		return () => window.removeEventListener('resize', checkMobile);
// 	}, []);

// 	// Close tooltip on outside click
// 	useEffect(() => {
// 		const handleClickOutside = (event) => {
// 			if (
// 				tooltipRef.current &&
// 				!tooltipRef.current.contains(event.target) &&
// 				triggerRef.current &&
// 				!triggerRef.current.contains(event.target)
// 			) {
// 				setIsOpen(false);
// 			}
// 		};

// 		if (isOpen) {
// 			document.addEventListener('click', handleClickOutside);
// 			return () => document.removeEventListener('click', handleClickOutside);
// 		}
// 	}, [isOpen]);

// 	// Position tooltip with collision detection
// 	useEffect(() => {
// 		if (isOpen && tooltipRef.current && triggerRef.current) {
// 			const tooltip = tooltipRef.current;
// 			const trigger = triggerRef.current;
// 			const triggerRect = trigger.getBoundingClientRect();
// 			const tooltipRect = tooltip.getBoundingClientRect();
// 			const viewport = {
// 				width: window.innerWidth,
// 				height: window.innerHeight,
// 			};

// 			const offset = 12;
// 			const arrowSize = hasArrow ? 8 : 0;

// 			// Calculate positions for all placements
// 			const positions = {
// 				top: {
// 					top: triggerRect.top - tooltipRect.height - offset - arrowSize,
// 					left:
// 						triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
// 				},
// 				bottom: {
// 					top: triggerRect.bottom + offset + arrowSize,
// 					left:
// 						triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
// 				},
// 				left: {
// 					top:
// 						triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
// 					left: triggerRect.left - tooltipRect.width - offset - arrowSize,
// 				},
// 				right: {
// 					top:
// 						triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
// 					left: triggerRect.right + offset + arrowSize,
// 				},
// 			};

// 			// Check if preferred placement fits
// 			let bestPlacement = placement;
// 			let position = positions[placement];

// 			// Collision detection - find best placement
// 			const isOutOfBounds = (pos) => {
// 				return (
// 					pos.top < 0 ||
// 					pos.left < 0 ||
// 					pos.top + tooltipRect.height > viewport.height ||
// 					pos.left + tooltipRect.width > viewport.width
// 				);
// 			};

// 			if (isOutOfBounds(position)) {
// 				// Try alternative placements
// 				const alternatives = {
// 					top: ['bottom', 'right', 'left'],
// 					bottom: ['top', 'right', 'left'],
// 					left: ['right', 'top', 'bottom'],
// 					right: ['left', 'top', 'bottom'],
// 				};

// 				for (const alt of alternatives[placement]) {
// 					if (!isOutOfBounds(positions[alt])) {
// 						bestPlacement = alt;
// 						position = positions[alt];
// 						break;
// 					}
// 				}
// 			}

// 			// Adjust position to stay within viewport
// 			position.left = Math.max(
// 				8,
// 				Math.min(position.left, viewport.width - tooltipRect.width - 8)
// 			);
// 			position.top = Math.max(
// 				8,
// 				Math.min(position.top, viewport.height - tooltipRect.height - 8)
// 			);

// 			// Apply position
// 			tooltip.style.top = `${position.top}px`;
// 			tooltip.style.left = `${position.left}px`;

// 			setActualPlacement(bestPlacement);
// 		}
// 	}, [isOpen, placement, hasArrow]);

// 	// Handle open/close with delay
// 	const handleMouseEnter = () => {
// 		if (!isMobile && !disabled) {
// 			clearTimeout(timeoutRef.current);
// 			timeoutRef.current = setTimeout(() => setIsOpen(true), openDelay);
// 		}
// 	};

// 	const handleMouseLeave = () => {
// 		if (!isMobile && !disabled) {
// 			clearTimeout(timeoutRef.current);
// 			timeoutRef.current = setTimeout(() => setIsOpen(false), autoCloseDelay);
// 		}
// 	};

// 	const handleClick = (e) => {
// 		e.stopPropagation();
// 		if (disabled) return;

// 		if (isMobile) {
// 			setIsOpen((prev) => !prev);
// 		}
// 	};

// 	// Cleanup timeout on unmount
// 	useEffect(() => {
// 		return () => {
// 			if (timeoutRef.current) {
// 				clearTimeout(timeoutRef.current);
// 			}
// 		};
// 	}, []);

// 	return (
// 		<>
// 			<style jsx>{`
// 				.tooltip-container {
// 					position: relative;
// 					display: inline-block;
// 				}

// 				.tooltip-trigger {
// 					display: inline-flex;
// 					cursor: pointer;
// 					transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
// 				}

// 				.tooltip-trigger:hover {
// 					transform: translateY(-1px);
// 				}

// 				.tooltip-trigger.disabled {
// 					cursor: not-allowed;
// 					opacity: 0.6;
// 				}

// 				.tooltip-base {
// 					position: fixed;
// 					z-index: 9999;
// 					font-weight: 500;
// 					border-radius: 8px;
// 					box-shadow:
// 						0 10px 25px rgba(0, 0, 0, 0.1),
// 						0 4px 6px rgba(0, 0, 0, 0.05);
// 					backdrop-filter: blur(10px);
// 					border: 1px solid rgba(255, 255, 255, 0.1);
// 					pointer-events: none;
// 					transform-origin: center;
// 					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
// 				}

// 				.tooltip-base.show {
// 					opacity: 1;
// 					transform: scale(1) translateY(0);
// 					animation: tooltipSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
// 				}

// 				.tooltip-base.hide {
// 					opacity: 0;
// 					transform: scale(0.95) translateY(4px);
// 				}

// 				@keyframes tooltipSlideIn {
// 					0% {
// 						opacity: 0;
// 						transform: scale(0.9) translateY(8px);
// 					}
// 					50% {
// 						opacity: 0.8;
// 						transform: scale(1.02) translateY(-2px);
// 					}
// 					100% {
// 						opacity: 1;
// 						transform: scale(1) translateY(0);
// 					}
// 				}

// 				@keyframes tooltipPulse {
// 					0%,
// 					100% {
// 						transform: scale(1);
// 					}
// 					50% {
// 						transform: scale(1.05);
// 					}
// 				}

// 				.tooltip-base:hover {
// 					animation: tooltipPulse 2s infinite;
// 				}

// 				/* Size variants */
// 				.tooltip-sm {
// 					padding: 6px 10px;
// 					font-size: 12px;
// 					max-width: 200px;
// 				}

// 				.tooltip-md {
// 					padding: 8px 12px;
// 					font-size: 14px;
// 					max-width: 280px;
// 				}

// 				.tooltip-lg {
// 					padding: 12px 16px;
// 					font-size: 16px;
// 					max-width: 320px;
// 				}

// 				/* Variant styles */
// 				.tooltip-default {
// 					background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
// 					color: #f9fafb;
// 				}

// 				.tooltip-primary {
// 					background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
// 					color: #ffffff;
// 				}

// 				.tooltip-success {
// 					background: linear-gradient(135deg, #10b981 0%, #059669 100%);
// 					color: #ffffff;
// 				}

// 				.tooltip-warning {
// 					background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
// 					color: #ffffff;
// 				}

// 				.tooltip-error {
// 					background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
// 					color: #ffffff;
// 				}

// 				.tooltip-info {
// 					background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
// 					color: #ffffff;
// 				}

// 				.tooltip-dark {
// 					background: linear-gradient(135deg, #111827 0%, #000000 100%);
// 					color: #f9fafb;
// 					border: 1px solid #374151;
// 				}

// 				.tooltip-light {
// 					background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
// 					color: #1f2937;
// 					border: 1px solid #e5e7eb;
// 					box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
// 				}

// 				/* Arrow styles */
// 				.tooltip-arrow {
// 					position: absolute;
// 					width: 0;
// 					height: 0;
// 					border-style: solid;
// 					filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
// 				}

// 				.tooltip-arrow-top {
// 					bottom: -8px;
// 					left: 50%;
// 					transform: translateX(-50%);
// 					border-left: 8px solid transparent;
// 					border-right: 8px solid transparent;
// 					border-top: 8px solid;
// 				}

// 				.tooltip-arrow-bottom {
// 					top: -8px;
// 					left: 50%;
// 					transform: translateX(-50%);
// 					border-left: 8px solid transparent;
// 					border-right: 8px solid transparent;
// 					border-bottom: 8px solid;
// 				}

// 				.tooltip-arrow-left {
// 					right: -8px;
// 					top: 50%;
// 					transform: translateY(-50%);
// 					border-top: 8px solid transparent;
// 					border-bottom: 8px solid transparent;
// 					border-left: 8px solid;
// 				}

// 				.tooltip-arrow-right {
// 					left: -8px;
// 					top: 50%;
// 					transform: translateY(-50%);
// 					border-top: 8px solid transparent;
// 					border-bottom: 8px solid transparent;
// 					border-right: 8px solid;
// 				}

// 				/* Arrow colors for variants */
// 				.tooltip-default .tooltip-arrow-top {
// 					border-top-color: #374151;
// 				}
// 				.tooltip-default .tooltip-arrow-bottom {
// 					border-bottom-color: #374151;
// 				}
// 				.tooltip-default .tooltip-arrow-left {
// 					border-left-color: #374151;
// 				}
// 				.tooltip-default .tooltip-arrow-right {
// 					border-right-color: #374151;
// 				}

// 				.tooltip-primary .tooltip-arrow-top {
// 					border-top-color: #3b82f6;
// 				}
// 				.tooltip-primary .tooltip-arrow-bottom {
// 					border-bottom-color: #3b82f6;
// 				}
// 				.tooltip-primary .tooltip-arrow-left {
// 					border-left-color: #3b82f6;
// 				}
// 				.tooltip-primary .tooltip-arrow-right {
// 					border-right-color: #3b82f6;
// 				}

// 				.tooltip-success .tooltip-arrow-top {
// 					border-top-color: #10b981;
// 				}
// 				.tooltip-success .tooltip-arrow-bottom {
// 					border-bottom-color: #10b981;
// 				}
// 				.tooltip-success .tooltip-arrow-left {
// 					border-left-color: #10b981;
// 				}
// 				.tooltip-success .tooltip-arrow-right {
// 					border-right-color: #10b981;
// 				}

// 				.tooltip-warning .tooltip-arrow-top {
// 					border-top-color: #f59e0b;
// 				}
// 				.tooltip-warning .tooltip-arrow-bottom {
// 					border-bottom-color: #f59e0b;
// 				}
// 				.tooltip-warning .tooltip-arrow-left {
// 					border-left-color: #f59e0b;
// 				}
// 				.tooltip-warning .tooltip-arrow-right {
// 					border-right-color: #f59e0b;
// 				}

// 				.tooltip-error .tooltip-arrow-top {
// 					border-top-color: #ef4444;
// 				}
// 				.tooltip-error .tooltip-arrow-bottom {
// 					border-bottom-color: #ef4444;
// 				}
// 				.tooltip-error .tooltip-arrow-left {
// 					border-left-color: #ef4444;
// 				}
// 				.tooltip-error .tooltip-arrow-right {
// 					border-right-color: #ef4444;
// 				}

// 				.tooltip-info .tooltip-arrow-top {
// 					border-top-color: #06b6d4;
// 				}
// 				.tooltip-info .tooltip-arrow-bottom {
// 					border-bottom-color: #06b6d4;
// 				}
// 				.tooltip-info .tooltip-arrow-left {
// 					border-left-color: #06b6d4;
// 				}
// 				.tooltip-info .tooltip-arrow-right {
// 					border-right-color: #06b6d4;
// 				}

// 				.tooltip-dark .tooltip-arrow-top {
// 					border-top-color: #111827;
// 				}
// 				.tooltip-dark .tooltip-arrow-bottom {
// 					border-bottom-color: #111827;
// 				}
// 				.tooltip-dark .tooltip-arrow-left {
// 					border-left-color: #111827;
// 				}
// 				.tooltip-dark .tooltip-arrow-right {
// 					border-right-color: #111827;
// 				}

// 				.tooltip-light .tooltip-arrow-top {
// 					border-top-color: #ffffff;
// 				}
// 				.tooltip-light .tooltip-arrow-bottom {
// 					border-bottom-color: #ffffff;
// 				}
// 				.tooltip-light .tooltip-arrow-left {
// 					border-left-color: #ffffff;
// 				}
// 				.tooltip-light .tooltip-arrow-right {
// 					border-right-color: #ffffff;
// 				}

// 				/* Responsive design */
// 				@media (max-width: 768px) {
// 					.tooltip-base {
// 						max-width: 250px;
// 						font-size: 13px;
// 					}

// 					.tooltip-lg {
// 						max-width: 280px;
// 						font-size: 14px;
// 					}
// 				}

// 				/* Accessibility */
// 				.tooltip-base[role='tooltip'] {
// 					outline: none;
// 				}

// 				@media (prefers-reduced-motion: reduce) {
// 					.tooltip-base {
// 						transition: opacity 0.2s ease;
// 					}

// 					.tooltip-base.show {
// 						animation: none;
// 					}

// 					.tooltip-base:hover {
// 						animation: none;
// 					}
// 				}
// 			`}</style>

// 			<div className='tooltip-container'>
// 				<div
// 					ref={triggerRef}
// 					onMouseEnter={handleMouseEnter}
// 					onMouseLeave={handleMouseLeave}
// 					onClick={handleClick}
// 					className={`tooltip-trigger ${disabled ? 'disabled' : ''}`}
// 				>
// 					{children}
// 				</div>

// 				{isOpen && (
// 					<div
// 						ref={tooltipRef}
// 						className={`
//               tooltip-base
//               tooltip-${variant}
//               tooltip-${size}
//               ${isOpen ? 'show' : 'hide'}
//               ${className}
//             `}
// 						role='tooltip'
// 						aria-hidden={!isOpen}
// 						{...props}
// 					>
// 						{label}
// 						{hasArrow && (
// 							<div
// 								className={`tooltip-arrow tooltip-arrow-${actualPlacement}`}
// 							/>
// 						)}
// 					</div>
// 				)}
// 			</div>
// 		</>
// 	);
// };

// export default CustomTooltip;

// Demo Component
// const TooltipDemo = () => {
//   return (
//     <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
//       <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem', textAlign: 'center' }}>
//         Professional Tooltip Component with Custom CSS
//       </h1>

//       <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//         {/* Variant Examples */}
//         <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//           <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
//             Variant Examples
//           </h2>
//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
//             <CustomTooltip label="Default variant with gradient background" variant="default">
//               <button style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
//                 Default
//               </button>
//             </CustomTooltip>

//             <CustomTooltip label="Primary variant for important actions" variant="primary">
//               <button style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
//                 Primary
//               </button>
//             </CustomTooltip>

//             <CustomTooltip label="Success variant for positive actions" variant="success">
//               <button style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
//                 Success
//               </button>
//             </CustomTooltip>

//             <CustomTooltip label="Warning variant for cautionary messages" variant="warning">
//               <button style={{ padding: '0.5rem 1rem', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
//                 Warning
//               </button>
//             </CustomTooltip>

//             <CustomTooltip label="Error variant for destructive actions" variant="error">
//               <button style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
//                 Error
//               </button>
//             </CustomTooltip>

//             <CustomTooltip label="Info variant for informational content" variant="info">
//               <button style={{ padding: '0.5rem 1rem', backgroundColor: '#06b6d4', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
//                 Info
//               </button>
//             </CustomTooltip>
//           </div>
//         </div>

//         {/* Size Examples */}
//         <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//           <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
//             Size Examples
//           </h2>
//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
//             <CustomTooltip label="Small tooltip" size="sm" variant="primary">
//               <button style={{ padding: '0.25rem 0.75rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}>
//                 Small
//               </button>
//             </CustomTooltip>

//             <CustomTooltip label="Medium tooltip with more content" size="md" variant="success">
//               <button style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
//                 Medium
//               </button>
//             </CustomTooltip>

//             <CustomTooltip label="Large tooltip with extensive content that can span multiple lines and provide detailed information" size="lg" variant="warning">
//               <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.125rem' }}>
//                 Large
//               </button>
//             </CustomTooltip>
//           </div>
//         </div>

//         {/* Placement Examples */}
//         <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//           <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
//             Placement Examples
//           </h2>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', justifyItems: 'center' }}>
//             <CustomTooltip label="Top placement with smooth animation" placement="top" variant="dark">
//               <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}>
//                 ⬆️ Top
//               </div>
//             </CustomTooltip>

//             <CustomTooltip label="Right placement with collision detection" placement="right" variant="info">
//               <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}>
//                 ➡️ Right
//               </div>
//             </CustomTooltip>

//             <CustomTooltip label="Bottom placement with backdrop blur" placement="bottom" variant="light">
//               <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}>
//                 ⬇️ Bottom
//               </div>
//             </CustomTooltip>

//             <CustomTooltip label="Left placement with gradient background" placement="left" variant="primary">
//               <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}>
//                 ⬅️ Left
//               </div>
//             </CustomTooltip>
//           </div>
//         </div>

//         {/* Special Features */}
//         <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//           <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
//             Special Features
//           </h2>
//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
//             <CustomTooltip label="No arrow tooltip" hasArrow={false} variant="error">
//               <div style={{ padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '50%', cursor: 'pointer' }}>
//                 <svg width="24" height="24" fill="#ef4444" viewBox="0 0 24 24">
//                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
//                 </svg>
//               </div>
//             </CustomTooltip>

//             <CustomTooltip label="Instant tooltip (no delay)" openDelay={0} autoCloseDelay={0} variant="success">
//               <span style={{ padding: '0.5rem 1rem', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '500' }}>
//                 ⚡ Instant
//               </span>
//             </CustomTooltip>

//             <CustomTooltip label="This tooltip is disabled" disabled variant="default">
//               <button style={{ padding: '0.5rem 1rem', backgroundColor: '#9ca3af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'not-allowed' }}>
//                 Disabled
//               </button>
//             </CustomTooltip>

//             <CustomTooltip
//               label="Custom styled tooltip with additional classes"
//               variant="primary"
//               className="custom-tooltip"
//               style={{ fontWeight: 'bold', letterSpacing: '0.5px' }}
//             >
//               <button style={{ padding: '0.5rem 1rem', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
//                 Custom Style
//               </button>
//             </CustomTooltip>
//           </div>
//         </div>

//         {/* Usage Guide */}
//         <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//           <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
//             Features & Usage
//           </h2>
//           <div style={{ color: '#6b7280', lineHeight: '1.6' }}>
//             <p style={{ marginBottom: '0.5rem' }}>
//               <strong>🎨 Variants:</strong> default, primary, success, warning, error, info, dark, light
//             </p>
//             <p style={{ marginBottom: '0.5rem' }}>
//               <strong>📏 Sizes:</strong> sm, md, lg with responsive design
//             </p>
//             <p style={{ marginBottom: '0.5rem' }}>
//               <strong>🎭 Animations:</strong> Smooth slide-in, scale, and pulse effects
//             </p>
//             <p style={{ marginBottom: '0.5rem' }}>
//               <strong>📱 Mobile:</strong> Touch-friendly with tap to toggle
//             </p>
//             <p style={{ marginBottom: '0.5rem' }}>
//               <strong>🔧 Smart Positioning:</strong> Automatic collision detection and repositioning
//             </p>
//             <p style={{ marginBottom: '0.5rem' }}>
//               <strong>♿ Accessibility:</strong> ARIA attributes and reduced motion support
//             </p>
//             <p>
//               <strong>🎯 Custom Styling:</strong> CSS-in-JS with full customization support
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TooltipDemo;
