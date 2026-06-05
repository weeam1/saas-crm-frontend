// import { useColorModeValue } from '@chakra-ui/react';

// export const useModalColors = () => ({
// 	bg: useColorModeValue('white', 'gray.800'),
// 	headerBg: useColorModeValue('brand.300', 'brand.100'),
// 	primaryBtnBg: useColorModeValue('brand.500', 'brand.300'),
// 	secondaryBtnBg: useColorModeValue('gray.100', 'gray.300'),
// 	headerText: useColorModeValue('brand.800', 'brand.900'),
// 	closeBtnColor: useColorModeValue('brand.700', 'brand.900'),
// 	footerBg: useColorModeValue('gray.50', 'gray.700'),
// 	borderColor: useColorModeValue('gray.200', 'gray.600'),
// });

// ─────────────────────────────────────────────────────────────────────────────
// useModalColors — Style 2 "Gold Header"
// Single source of truth for ALL modal colors across the app.
// Import this hook in any modal component — never hardcode modal colors.
// ─────────────────────────────────────────────────────────────────────────────

// ── Raw token values (no Chakra dependency) ───────────────────────────────────
export const MODAL_TOKENS = {
	// Surfaces
	bg: '#10273A', // navy.800  — main modal body
	bgDeep: '#0B1C2C', // navy.900  — footer / nested panels
	bgInput: '#1A3550', // navy.700  — form field background
	bgInputHover: '#1E3D5C', // navy.600  — form field hover

	// Header (gold gradient)
	headerBg: 'linear-gradient(135deg, #F5D67B 0%, #D4AF37 50%, #C9A227 100%)',
	headerText: '#000000', // black on gold — max contrast
	headerSubText: 'rgba(0,0,0,0.6)', // muted on gold

// header navy
// View Modal (Navy theme) - matching your existing pattern
viewBg:'#0B1C2C',        // navy.800 (matches bg - for footer)
viewBodyBg: '#0B1C2C',    // navy.900 (matches bgDeep - for body)
viewHeaderBg: '#1A3550',  // navy.700 (matches bgInput - for header)
viewHeaderText: '#FFFFFF',
viewHeaderBorder: '#1E3D5C',
viewFooterBg: '#10273A',  // navy.800 (matches bg)
viewFooterBorder: '#1E3D5C',
viewButtonBg: '#1A3550',  // navy.700
viewButtonHoverBg: '#1E3D5C',
viewButtonText: '#FFFFFF',

	// Close button (lives inside gold header)
	closeBtnBg: 'rgba(0,0,0,0.15)',
	closeBtnColor: '#000000',
	closeBtnHoverBg: 'rgba(0,0,0,0.28)',

	// Borders
	borderColor: '#1E3D5C', // navy.600
	borderFocus: '#D4AF37', // gold.primary — input focus ring
	divider: '#1A3550', // navy.700 — dividers inside body

	// Labels & text
	labelColor: '#808080', // gray500   — field labels
	bodyText: '#B0B0B0', // gray300   — body / helper text
	headingText: '#FFFFFF', // white     — section headings inside body
	mutedText: '#808080', // gray500   — hints, footnotes

	// ── Primary Button (Gold CTA) ─────────────────────────────────────────────
	primaryBtnBg:
		'linear-gradient(135deg, #F5D67B 0%, #D4AF37 50%, #C9A227 100%)',
	primaryBtnText: '#000000',
	primaryBtnHoverBg:
		'linear-gradient(135deg, #F5D67B 0%, #D4AF37 60%, #C9A227 100%)',
	primaryBtnShadow: '0 0 16px rgba(212,175,55,0.35)',
	primaryBtnActiveBg: '#C9A227',

	// ── Secondary Button (Ghost) ──────────────────────────────────────────────
	secondaryBtnBg: 'transparent',
	secondaryBtnText: '#B0B0B0', // gray300
	secondaryBtnBorder: '#24496E', // navy.500
	secondaryBtnHoverBg: '#1A3550', // navy.700
	secondaryBtnHoverText: '#FFFFFF',

	// ── Danger / Destructive Button ───────────────────────────────────────────
	dangerBtnBg: '#EE5D50',
	dangerBtnText: '#FFFFFF',
	dangerBtnHoverBg: 'rgba(238,93,80,0.12)',
	dangerBtnBorder: 'rgba(238,93,80,0.35)',

	// ── Footer ────────────────────────────────────────────────────────────────
	footerBg: '#0B1C2C', // navy.900
	footerBorder: '#1E3D5C', // navy.600

	// ── Overlay / Backdrop ────────────────────────────────────────────────────
	overlayBg: 'rgba(0, 0, 0, 0.65)',

	// ── Status badges inside modals ───────────────────────────────────────────
	badgeSuccessBg: 'rgba(1,181,116,0.12)',
	badgeSuccessText: '#10B981',
	badgeSuccessBorder: 'rgba(16,185,129,0.3)',

	badgeWarningBg: 'rgba(255,179,71,0.12)',
	badgeWarningText: '#FFB347',
	badgeWarningBorder: 'rgba(255,179,71,0.3)',

	badgeErrorBg: 'rgba(238,93,80,0.12)',
	badgeErrorText: '#EE5D50',
	badgeErrorBorder: 'rgba(238,93,80,0.3)',

	badgeInfoBg: 'rgba(46,92,135,0.25)',
	badgeInfoText: '#7AAAC4',
	badgeInfoBorder: 'rgba(74,123,163,0.35)',

accentGold: '#D4AF37',  // ADD THIS
	goldLight: '#F5D67B',    // ADD THIS
	goldDark: '#C9A227',     // ADD THIS

	// ── Box shadows ───────────────────────────────────────────────────────────
	modalShadow: '0px 20px 60px rgba(0,0,0,0.6)',
	cardShadow: '0px 10px 30px rgba(0,0,0,0.4)',
};

// ─────────────────────────────────────────────────────────────────────────────
// Chakra-ready hook  (drop-in replacement for the old useColorModeValue version)
// ─────────────────────────────────────────────────────────────────────────────
export const useModalColors = () => ({
	// Surfaces
	bg: MODAL_TOKENS.bg,
	bgDeep: MODAL_TOKENS.bgDeep,
	bgInput: MODAL_TOKENS.bgInput,
	bgInputHover: MODAL_TOKENS.bgInputHover,

	// Header
	headerBg: MODAL_TOKENS.headerBg,
	headerText: MODAL_TOKENS.headerText,
	headerSubText: MODAL_TOKENS.headerSubText,

// view header
viewBg: MODAL_TOKENS.viewBg,
	viewHeaderBg: MODAL_TOKENS.viewHeaderBg,
	viewHeaderText: MODAL_TOKENS.viewHeaderText,
	viewHeaderBorder: MODAL_TOKENS.viewHeaderBorder,
	viewFooterBg: MODAL_TOKENS.viewFooterBg,
	viewFooterBorder: MODAL_TOKENS.viewFooterBorder,
	viewButtonBg: MODAL_TOKENS.viewButtonBg,
	viewButtonHoverBg: MODAL_TOKENS.viewButtonHoverBg,
	viewButtonText: MODAL_TOKENS.viewButtonText,

	// Close button
	closeBtnBg: MODAL_TOKENS.closeBtnBg,
	closeBtnColor: MODAL_TOKENS.closeBtnColor,
	closeBtnHoverBg: MODAL_TOKENS.closeBtnHoverBg,

	// Borders
	borderColor: MODAL_TOKENS.borderColor,
	borderFocus: MODAL_TOKENS.borderFocus,
	divider: MODAL_TOKENS.divider,

	// Text
	labelColor: MODAL_TOKENS.labelColor,
	bodyText: MODAL_TOKENS.bodyText,
	headingText: MODAL_TOKENS.headingText,
	mutedText: MODAL_TOKENS.mutedText,

	// Primary button
	primaryBtnBg: MODAL_TOKENS.primaryBtnBg,
	primaryBtnText: MODAL_TOKENS.primaryBtnText,
	primaryBtnHoverBg: MODAL_TOKENS.primaryBtnHoverBg,
	primaryBtnShadow: MODAL_TOKENS.primaryBtnShadow,
	primaryBtnActiveBg: MODAL_TOKENS.primaryBtnActiveBg,

	// Secondary button
	secondaryBtnBg: MODAL_TOKENS.secondaryBtnBg,
	secondaryBtnText: MODAL_TOKENS.secondaryBtnText,
	secondaryBtnBorder: MODAL_TOKENS.secondaryBtnBorder,
	secondaryBtnHoverBg: MODAL_TOKENS.secondaryBtnHoverBg,
	secondaryBtnHoverText: MODAL_TOKENS.secondaryBtnHoverText,

	// Danger button
	dangerBtnBg: MODAL_TOKENS.dangerBtnBg,
	dangerBtnText: MODAL_TOKENS.dangerBtnText,
	dangerBtnHoverBg: MODAL_TOKENS.dangerBtnHoverBg,
	dangerBtnBorder: MODAL_TOKENS.dangerBtnBorder,

	// Footer
	footerBg: MODAL_TOKENS.footerBg,
	footerBorder: MODAL_TOKENS.footerBorder,

accentGold: MODAL_TOKENS.accentGold,  // ADD THIS
	goldLight: MODAL_TOKENS.goldLight,    // ADD THIS
	goldDark: MODAL_TOKENS.goldDark,

	// Overlay

	overlayBg: MODAL_TOKENS.overlayBg,

	// Status badges
	badgeSuccessBg: MODAL_TOKENS.badgeSuccessBg,
	badgeSuccessText: MODAL_TOKENS.badgeSuccessText,
	badgeSuccessBorder: MODAL_TOKENS.badgeSuccessBorder,
	badgeWarningBg: MODAL_TOKENS.badgeWarningBg,
	badgeWarningText: MODAL_TOKENS.badgeWarningText,
	badgeWarningBorder: MODAL_TOKENS.badgeWarningBorder,
	badgeErrorBg: MODAL_TOKENS.badgeErrorBg,
	badgeErrorText: MODAL_TOKENS.badgeErrorText,
	badgeErrorBorder: MODAL_TOKENS.badgeErrorBorder,
	badgeInfoBg: MODAL_TOKENS.badgeInfoBg,
	badgeInfoText: MODAL_TOKENS.badgeInfoText,
	badgeInfoBorder: MODAL_TOKENS.badgeInfoBorder,

	// Shadows
	modalShadow: MODAL_TOKENS.modalShadow,
	cardShadow: MODAL_TOKENS.cardShadow,
});
