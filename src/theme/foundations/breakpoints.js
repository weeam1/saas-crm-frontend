import { createBreakpoints } from "@chakra-ui/theme-tools";

export const breakpoints = createBreakpoints({
  base: "0em",
  sm: "320px",
  md: "768px",
  lg: "960px",
  xl: "1200px",
  "2xl": "1600px",
  "2sm": "380px",
  "3xl": "1920px",
});
// export const breakpoints = createBreakpoints({
// 	base: '0em', // Default (mobile-first)
// 	sm: '320px', // Small devices
// 	'2sm': '380px', // Custom small+ devices (optional)
// 	md: '768px', // Medium devices
// 	lg: '960px', // Large devices
// 	xl: '1200px', // Extra-large
// 	'2xl': '1600px', // Ultra-wide
// 	'3xl': '1920px', // 4K+ screens (optional)
// });

// export default breakpoints
