// export const leadlabelFontSize = '0.5rem'; // 8px = 0.5rem
// export const leadValueFontSize = '0.625rem'; // 10px = 0.625rem
// export const leadIconSize = '0.625rem'; // 10px = 0.625rem

export const leadSelectInputSize = 'xs'; // md, lg, sm
// export const leadSelectInputFontSize = '0.625rem'; // 10px = 0.625rem
export const leadlabelFontSize = 'clamp(0.5rem, min(1vw, 0.5rem), 0.75rem)';
// 8px (large screens) → scales down on mid-sized → increases to 12px on XL screens

export const leadValueFontSize =
	'clamp(0.625rem, min(1.2vw, 0.625rem), 0.875rem)';
// 10px (large screens) → scales down on mid-sized → increases to 14px on XL screens

export const leadIconSize = 'clamp(0.625rem, min(1.2vw, 0.625rem), 0.875rem)';
// 10px (large screens) → scales down on mid-sized → increases to 14px on XL screens

export const leadSelectInputFontSize =
	'clamp(0.625rem, min(1.2vw, 0.625rem), 0.875rem)';
// 10px (large screens) → scales down on mid-sized → increases to 14px on XL screens

// export const leadlabelFontSize = {
// 	base: 'clamp(0.5rem, 1vw, 0.625rem)', // Min: 8px, Ideal: 1% of VW, Max: 10px
// 	sm: 'clamp(0.5rem, 0.9vw, 0.75rem)', // Scales slightly up on small screens
// 	md: 'clamp(0.625rem, 1vw, 0.875rem)', // Adapts based on viewport
// 	lg: '0.5rem', // Fixed 8px on large screens
// 	xl: '0.625rem', // 10px
// 	'2xl': '0.75rem', // 12px for very large screens
// };

// export const leadValueFontSize = {
// 	base: 'clamp(0.625rem, 1vw, 0.75rem)', // Min: 10px, Viewport-based scaling
// 	sm: 'clamp(0.75rem, 1.2vw, 0.875rem)',
// 	md: 'clamp(0.875rem, 1.3vw, 1rem)',
// 	lg: '0.625rem', // Fixed 10px on large screens
// 	xl: '0.75rem', // 12px
// 	'2xl': '0.875rem', // 14px for extra-large screens
// };

// export const leadIconSize = {
// 	base: 'clamp(0.625rem, 1vw, 0.75rem)',
// 	sm: 'clamp(0.75rem, 1.2vw, 0.875rem)',
// 	md: 'clamp(0.875rem, 1.3vw, 1rem)',
// 	lg: '0.625rem',
// 	xl: '0.75rem',
// 	'2xl': '0.875rem',
// };

// export const leadSelectInputFontSize = {
// 	base: 'clamp(0.625rem, 1vw, 0.75rem)',
// 	sm: 'clamp(0.75rem, 1.2vw, 0.875rem)',
// 	md: 'clamp(0.875rem, 1.3vw, 1rem)',
// 	lg: '0.625rem',
// 	xl: '0.75rem',
// 	'2xl': '0.875rem',
// };
