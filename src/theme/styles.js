// import { extendTheme } from '@chakra-ui/react';
// import { mode } from '@chakra-ui/theme-tools';

// export const globalStyles = extendTheme({
// 	colors: {
// 		greenish: {
// 			50: '#E6F7F6', // Very light background / card
// 			100: '#BFEFE9', // Lighter backgrounds, hover states
// 			200: '#99E7DC', // Soft borders / secondary buttons
// 			300: '#66DCCF', // Info highlights, badges
// 			400: '#33D1C2', // Buttons, icons hover
// 			500: '#158477', // Primary modal background, main buttons
// 			600: '#12665E', // Active states, borders
// 			700: '#0F534B', // Dark modal header/footer
// 			800: '#0C3F38', // Floating action button shadow, overlay
// 			900: '#07221C', // Text shadow, deepest accents
// 		},
// 		brand: {
// 			50: '#FAF7E7',
// 			100: '#F5ECCB',
// 			200: '#EDD199',
// 			300: '#E5B668',
// 			400: '#D99A36',
// 			500: '#B79045',
// 			600: '#B79045',
// 			700: '#755A24',
// 			800: '#544013',
// 			900: '#332602',
// 		},
// 		brandScheme: {
// 			100: '#F5ECCB',
// 			200: '#E5B668',
// 			300: '#E5B668',
// 			400: '#D99A36',
// 			500: '#B79045',
// 			600: '#B79045',
// 			700: '#755A24',
// 			800: '#544013',
// 			900: '#332602',
// 		},
// 		brandTabs: {
// 			100: '#F5ECCB',
// 			200: '#EDD199',
// 			300: '#EDD199',
// 			400: '#EDD199',
// 			500: '#EDD199',
// 			600: '#B79045',
// 			700: '#755A24',
// 			800: '#544013',
// 			900: '#332602',
// 		},
// 		softGray: {
// 			50: '#E7E7E7',
// 			100: '#eeeeef',
// 			200: '#BEBEBE',
// 			300: '#969696',
// 			400: '#F5F5F5',
// 			500: '#C4C4C4',
// 			600: '#D9D9D9',
// 			700: '#F6F6F6',
// 			800: '#F2F2F2',
// 		},
// 		secondaryGray: {
// 			100: '#E0E5F2',
// 			200: '#E1E9F8',
// 			300: '#F4F7FE',
// 			400: '#E9EDF7',
// 			500: '#8F9BBA',
// 			600: '#A3AED0',
// 			700: '#707EAE',
// 			800: '#707EAE',
// 			900: '#1B2559',
// 		},
// 		red: {
// 			100: '#FEEFEE',
// 			300: '#eb7b74',
// 			500: '#EE5D50',
// 			600: '#E31A1A',
// 		},
// 		blue: {
// 			50: '#EFF4FB',
// 			400: '#3B82F6',
// 			500: '#3965FF',
// 		},
// 		orange: {
// 			100: '#FFF6DA',
// 			400: '#fde04ce8',
// 			500: '#FFB547',
// 		},
// 		green: {
// 			100: '#E6FAF5',
// 			400: '#10B981',
// 			500: '#01B574',
// 			600: '#32BD00',
// 			700: '#32BD00',
// 		},
// 		navy: {
// 			50: '#d0dcfb',
// 			100: '#aac0fe',
// 			200: '#a3b9f8',
// 			300: '#728fea',
// 			400: '#3652ba',
// 			500: '#1b3bbb',
// 			600: '#24388a',
// 			700: '#1B254B',
// 			800: '#111c44',
// 			900: '#0b1437',
// 		},
// 		gray: {
// 			100: '#FAFCFE',
// 			200: '#E2E8F0',
// 			300: '#CBD5E0',
// 			400: '#A0AEC0',
// 			500: '#718096',
// 			600: '#4A5568',
// 			700: '#2D3748',
// 			800: '#1A202C',
// 			900: '#171923',
// 		},
// 	},

// 	styles: {
// 		global: (props) => ({
// 			'*:focus': {
// 				outline: 'none !important',
// 				boxShadow: 'none !important',
// 			},
// 			body: {
// 				overflowX: 'hidden',
// 				bg: mode('secondaryGray.300', 'navy.800')(props),
// 				fontFamily: 'DM Sans, sans-serif',
// 				letterSpacing: '-0.5px',
// 			},
// 			input: {
// 				color: 'gray.700',
// 			},
// 			html: {
// 				fontFamily: 'DM Sans, sans-serif',
// 			},
// 		}),
// 	},
// });

import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// ============================================================
// 🎨 DESIGN TOKENS — SINGLE SOURCE OF TRUTH
// Edit here to control the entire app's visual identity
// ============================================================

const tokens = {
	// ── Brand Navy (Primary / 80% usage) ──────────────────────
	navy: {
		900: '#0B1C2C', // Main background  (50%)
		800: '#10273A', // Sections / cards (20%)
		700: '#1A3550', // Hover states / mid surfaces
		600: '#1E3D5C', // Borders / dividers
		500: '#24496E', // Input backgrounds
		400: '#2E5C87', // Active accents (non-gold)
		300: '#4A7BA3', // Info / badge backgrounds
		200: '#7AAAC4', // Disabled foreground on dark
		100: '#B3D0E4', // Very light tints
		50: '#E8F2F8', // Near-white navy tint (light mode use)
		black: '#000000', // Depth / overlays (10%)
	},

	// ── Gold (Accent / 5% usage) ──────────────────────────────
	gold: {
		primary: '#D4AF37', // CTA / Headline highlight  (2%)
		light: '#F5D67B', // Gradients / hover          (1.5%)
		dark: '#C9A227', // Shadows / borders           (1.5%)
		glow: '#FFB347', // Glow / highlights
		// Gradient string (use in bgGradient / background CSS)
		gradient: 'linear-gradient(135deg, #F5D67B 0%, #D4AF37 50%, #C9A227 100%)',
	},

	// ── Neutral / Text System (15% usage) ────────────────────
	neutral: {
		white: '#FFFFFF', // Headings
		gray300: '#B0B0B0', // Secondary text
		gray500: '#808080', // Disabled text
		overlay: 'rgba(0, 0, 0, 0.6)', // Depth overlay
	},
};

// ============================================================
// 🧩 COMPONENT TOKENS — Buttons, Cards, Inputs, etc.
// ============================================================

const components = {
	Button: {
		baseStyle: {
			fontWeight: 'semibold',
			borderRadius: '12px',
			_focus: { boxShadow: 'none' },
		},
		variants: {
			// 🟡 Gold CTA — Primary action
			brand: {
				background: tokens.gold.gradient,
				color: '#000000',
				padding: '16px 24px',
				borderRadius: '12px',
				_hover: {
					background: `linear-gradient(135deg, ${tokens.gold.light} 0%, ${tokens.gold.primary} 60%, ${tokens.gold.dark} 100%)`,
					boxShadow: `0 0 20px rgba(212, 175, 55, 0.5)`,
					transform: 'translateY(-1px)',
				},
				_active: {
					background: tokens.gold.gradient,
					transform: 'translateY(0)',
				},
			},
			// 🔲 Outlined secondary
			outline: {
				border: `1px solid ${tokens.gold.primary}`,
				color: tokens.gold.primary,
				background: 'transparent',
				borderRadius: '12px',
				_hover: {
					background: `rgba(212, 175, 55, 0.08)`,
					boxShadow: `0 0 12px rgba(212, 175, 55, 0.3)`,
				},
			},
			// 🌑 Ghost dark — for sidebar / nav
			ghost: {
				color: tokens.neutral.gray300,
				background: 'transparent',
				_hover: {
					background: tokens.navy[700],
					color: tokens.gold.primary,
				},
				_active: {
					background: tokens.navy[700],
					color: tokens.gold.primary,
				},
			},
		},
		defaultProps: {
			variant: 'brand',
			size: 'sm',
		},
	},

	// ── Card ──────────────────────────────────────────────────
	Card: {
		baseStyle: {
			container: {
				background: tokens.navy[800],
				borderRadius: '16px',
				boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.4)',
				color: tokens.neutral.white,
			},
		},
	},

	// ── Input ─────────────────────────────────────────────────
	Input: {
		variants: {
			outline: {
				field: {
					background: tokens.navy[500],
					borderColor: tokens.navy[600],
					color: tokens.neutral.white,
					borderRadius: '10px',
					_hover: { borderColor: tokens.gold.dark },
					_focus: {
						borderColor: tokens.gold.primary,
						boxShadow: `0 0 0 1px ${tokens.gold.primary}`,
					},
					_placeholder: { color: tokens.neutral.gray500 },
				},
			},
		},
		defaultProps: { variant: 'outline' },
	},

	// ── Select ────────────────────────────────────────────────
	Select: {
		variants: {
			outline: {
				field: {
					background: tokens.navy[500],
					borderColor: tokens.navy[600],
					color: tokens.neutral.white,
					borderRadius: '10px',
					_hover: { borderColor: tokens.gold.dark },
					_focus: {
						borderColor: tokens.gold.primary,
						boxShadow: `0 0 0 1px ${tokens.gold.primary}`,
					},
				},
			},
		},
		defaultProps: { variant: 'outline' },
	},

	// ── Textarea ──────────────────────────────────────────────
	Textarea: {
		variants: {
			outline: {
				background: tokens.navy[500],
				borderColor: tokens.navy[600],
				color: tokens.neutral.white,
				borderRadius: '10px',
				_hover: { borderColor: tokens.gold.dark },
				_focus: {
					borderColor: tokens.gold.primary,
					boxShadow: `0 0 0 1px ${tokens.gold.primary}`,
				},
				_placeholder: { color: tokens.neutral.gray500 },
			},
		},
		defaultProps: { variant: 'outline' },
	},

	// ── Table ─────────────────────────────────────────────────
	Table: {
		variants: {
			simple: {
				th: {
					background: tokens.navy[900],
					color: tokens.gold.primary,
					borderColor: tokens.navy[600],
					fontWeight: 'semibold',
					letterSpacing: '0.05em',
				},
				td: {
					color: tokens.neutral.white,
					borderColor: tokens.navy[700],
				},
				tr: {
					_hover: { background: tokens.navy[700] },
				},
			},
		},
	},

	// ── Badge ─────────────────────────────────────────────────
	// Badge: {
	// 	variants: {
	// 		gold: {
	// 			background: `rgba(212, 175, 55, 0.15)`,
	// 			color: tokens.gold.primary,
	// 			border: `1px solid ${tokens.gold.dark}`,
	// 			borderRadius: '6px',
	// 		},
	// 		subtle: {
	// 			background: tokens.navy[700],
	// 			color: tokens.neutral.gray300,
	// 			borderRadius: '6px',
	// 		},
	// 	},
	// },

	Badge: {
		variants: {
			erp: {
				background: tokens.navy[700],
				color: tokens.neutral.gray300,
				borderRadius: '6px',
			},
			gold: {
				background: `rgba(212, 175, 55, 0.15)`,
				color: tokens.gold.primary,
				border: `1px solid ${tokens.gold.dark}`,
				borderRadius: '6px',
			},
		},
	},

	// ── Tabs ──────────────────────────────────────────────────
	Tabs: {
		variants: {
			line: {
				tab: {
					color: tokens.neutral.gray300,
					borderColor: 'transparent',
					_selected: {
						color: tokens.gold.primary,
						borderColor: tokens.gold.primary,
					},
					_hover: { color: tokens.gold.light },
				},
			},
			'soft-rounded': {
				tab: {
					color: tokens.neutral.gray300,
					_selected: {
						background: `rgba(212, 175, 55, 0.15)`,
						color: tokens.gold.primary,
					},
				},
			},
		},
	},

	// ── Menu ──────────────────────────────────────────────────
	Menu: {
		baseStyle: {
			list: {
				background: tokens.navy[800],
				borderColor: tokens.navy[600],
				boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.4)',
				borderRadius: '12px',
			},
			item: {
				background: 'transparent',
				color: tokens.neutral.white,
				_hover: {
					background: tokens.navy[700],
					color: tokens.gold.primary,
				},
				_focus: { background: tokens.navy[700] },
			},
		},
	},

	// ── Modal ─────────────────────────────────────────────────
	Modal: {
		baseStyle: {
			dialog: {
				background: tokens.navy[800],
				borderRadius: '16px',
				boxShadow: '0px 20px 60px rgba(0, 0, 0, 0.6)',
			},
			header: {
				background: tokens.navy[900],
				borderRadius: '16px 16px 0 0',
				color: tokens.neutral.white,
				borderBottom: `1px solid ${tokens.navy[600]}`,
			},
			footer: {
				background: tokens.navy[900],
				borderRadius: '0 0 16px 16px',
				borderTop: `1px solid ${tokens.navy[600]}`,
			},
			body: { color: tokens.neutral.white },
			overlay: { background: tokens.neutral.overlay },
		},
	},

	// ── Tooltip ───────────────────────────────────────────────
	Tooltip: {
		baseStyle: {
			background: tokens.navy[700],
			color: tokens.neutral.white,
			borderRadius: '8px',
			fontSize: '13px',
			boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
		},
	},

	// ── Drawer ────────────────────────────────────────────────
	Drawer: {
		baseStyle: {
			dialog: {
				background: tokens.navy[900],
			},
			header: {
				color: tokens.neutral.white,
				borderBottom: `1px solid ${tokens.navy[600]}`,
			},
			body: { color: tokens.neutral.white },
		},
	},

	// ── Divider ───────────────────────────────────────────────
	Divider: {
		baseStyle: {
			borderColor: tokens.navy[600],
			opacity: 1,
		},
	},

	// ── Switch ────────────────────────────────────────────────
	Switch: {
		baseStyle: {
			track: {
				_checked: { background: tokens.gold.primary },
			},
		},
	},

	// ── Checkbox ──────────────────────────────────────────────
	Checkbox: {
		baseStyle: {
			control: {
				borderColor: tokens.navy[400],
				_checked: {
					background: tokens.gold.primary,
					borderColor: tokens.gold.primary,
					color: '#000',
				},
				_focus: { boxShadow: 'none' },
			},
			label: { color: tokens.neutral.white },
		},
	},
};

// ============================================================
// 🔠 TYPOGRAPHY TOKENS
// ============================================================

const typography = {
	fonts: {
		heading: `'Cairo', 'Montserrat', sans-serif`, // Arabic: Cairo  |  English: Montserrat
		body: `'Tajawal', 'Poppins', sans-serif`, // Arabic: Tajawal|  English: Poppins
		mono: `'Fira Code', 'Courier New', monospace`,
	},
	fontSizes: {
		h1: 'clamp(40px, 5vw, 64px)', // Main headlines
		h2: 'clamp(28px, 3.5vw, 40px)', // Sections
		h3: '24px', // Cards
		body: '16px', // Content
		small: '13px', // Labels
		xs: '11px', // Micro
	},
	lineHeights: {
		heading: '1.3', // 130% as per RTL rules
		body: '1.6',
	},
	letterSpacings: {
		heading: '0', // 0% Arabic — do not modify
		body: '0',
		wide: '0.05em', // For all-caps labels only
	},
};

// ============================================================
// 📐 SPACING (8pt Grid)
// ============================================================

const space = {
	xs: '4px',
	sm: '8px',
	md: '16px',
	lg: '24px',
	xl: '32px',
	xxl: '48px',
};

// ============================================================
// 🌑 SHADOWS
// ============================================================

const shadows = {
	card: '0px 10px 30px rgba(0, 0, 0, 0.4)',
	soft: '0px 8px 24px rgba(0, 0, 0, 0.3)',
	goldGlow: '0 0 20px rgba(212, 175, 55, 0.5)',
	deep: '0px 20px 60px rgba(0, 0, 0, 0.6)',
};

// ============================================================
// 🎨 SEMANTIC COLORS — app-level roles
// ============================================================

const semanticTokens = {
	colors: {
		// Surfaces
		'bg.app': { default: tokens.navy[900] }, // Main app background
		'bg.surface': { default: tokens.navy[800] }, // Cards / panels
		'bg.elevated': { default: tokens.navy[700] }, // Hover / active surfaces
		'bg.input': { default: tokens.navy[500] }, // Form fields
		'bg.sidebar': { default: tokens.navy[900] }, // ERP Sidebar
		'bg.topbar': { default: tokens.navy[800] }, // ERP Topbar
		'bg.overlay': { default: tokens.neutral.overlay },

		// Borders
		'border.default': { default: tokens.navy[600] },
		'border.focus': { default: tokens.gold.primary },
		'border.subtle': { default: tokens.navy[700] },
		'border.gold': { default: tokens.gold.primary },
		// Text
		'text.heading': { default: tokens.neutral.white },
		'text.body': { default: tokens.neutral.gray300 },
		'text.muted': { default: tokens.neutral.gray500 },
		'text.accent': { default: tokens.gold.primary },
		'text.inverse': { default: tokens.navy[900] },
		'text.white': { default: tokens.neutral.white },
		'text.black': { default: tokens.neutral.black },

		// Accent
		'accent.gold': { default: tokens.gold.primary },
		'accent.goldLight': { default: tokens.gold.light },
		'accent.goldDark': { default: tokens.gold.dark },
		'accent.glow': { default: tokens.gold.glow },

		// ERP-specific roles
		'erp.sidebar.bg': { default: tokens.navy[900] },
		'erp.sidebar.active': { default: tokens.gold.primary },
		'erp.topbar.bg': { default: tokens.navy[800] },
		'erp.table.bg': { default: tokens.navy[800] },
		'erp.table.header': { default: tokens.navy[900] },
	},
};

// ============================================================
// 🏗️ FINAL THEME EXPORT
// ============================================================

export const globalStyles = extendTheme({
	// ── Raw token palettes (keep for Chakra internal use) ─────
	colors: {
		// Brand → Navy (was greenish, now primary brand)
		brand: {
			50: tokens.navy[50],
			100: tokens.navy[100],
			200: tokens.navy[200],
			300: tokens.navy[300],
			400: tokens.navy[400],
			500: tokens.navy[500],
			600: tokens.navy[600],
			700: tokens.navy[700],
			800: tokens.navy[800],
			900: tokens.navy[900],
		},
		// Keep navy alias for backwards compatibility
		navy: {
			50: tokens.navy[50],
			100: tokens.navy[100],
			200: tokens.navy[200],
			300: tokens.navy[300],
			400: tokens.navy[400],
			500: tokens.navy[500],
			600: tokens.navy[600],
			700: tokens.navy[700],
			800: tokens.navy[800],
			900: tokens.navy[900],
		},
		// Gold system
		gold: {
			50: '#FBF5DC',
			100: '#F5D67B',
			200: '#F0C84E',
			300: '#D4AF37',
			400: '#C9A227',
			500: '#B8901E',
			600: '#9A7818',
			700: '#7B6012',
			800: '#5C480D',
			900: '#3D3008',
		},
		// Neutral text system
		neutral: {
			50: '#FFFFFF',
			100: '#F5F5F5',
			200: '#E0E0E0',
			300: '#B0B0B0',
			400: '#909090',
			500: '#808080',
			600: '#606060',
			700: '#404040',
			800: '#202020',
			900: '#000000',
		},
		// Status colors
		red: {
			100: '#FEEFEE',
			300: '#eb7b74',
			500: '#EE5D50',
			600: '#E31A1A',
		},
		green: {
			100: '#E6FAF5',
			400: '#10B981',
			500: '#01B574',
			600: '#32BD00',
		},
		orange: {
			100: '#FFF6DA',
			400: '#fde04ce8',
			500: '#FFB547',
		},
		blue: {
			50: '#EFF4FB',
			400: '#3B82F6',
			500: '#3965FF',
		},
		// Legacy aliases (keep for any existing component references)
		secondaryGray: {
			100: '#1A3550',
			200: '#1E3D5C',
			300: '#0B1C2C',
			400: '#10273A',
			500: tokens.neutral.gray500,
			600: tokens.neutral.gray300,
			700: '#4A7BA3',
			800: '#4A7BA3',
			900: tokens.navy[900],
		},
		gray: {
			100: '#FAFCFE',
			200: '#E2E8F0',
			300: '#CBD5E0',
			400: '#A0AEC0',
			500: '#718096',
			600: '#4A5568',
			700: '#2D3748',
			800: '#1A202C',
			900: '#171923',
		},
		softGray: {
			50: '#E7E7E7',
			100: '#eeeeef',
			200: '#BEBEBE',
			300: '#969696',
			400: '#F5F5F5',
			500: '#C4C4C4',
			600: '#D9D9D9',
			700: '#F6F6F6',
			800: '#F2F2F2',
		},
	},

	// ── Semantic tokens (recommended usage layer) ─────────────
	semanticTokens,

	// ── Global body / base styles ─────────────────────────────
	styles: {
		global: (props) => ({
			'*': {
				boxSizing: 'border-box',
			},
			'*:focus': {
				outline: 'none !important',
				boxShadow: 'none !important',
			},
			'*::-webkit-scrollbar': {
				width: '6px',
				height: '6px',
			},
			'*::-webkit-scrollbar-track': {
				background: tokens.navy[900],
			},
			'*::-webkit-scrollbar-thumb': {
				background: tokens.navy[600],
				borderRadius: '3px',
				_hover: { background: tokens.gold.dark },
			},
			body: {
				overflowX: 'hidden',
				background: tokens.navy[900], // Always dark — #0B1C2C
				color: tokens.neutral.white,
				fontFamily: typography.fonts.body,
				letterSpacing: typography.letterSpacings.body,
				lineHeight: typography.lineHeights.body,
				// RTL support hook (set dir="rtl" on <html> for Arabic)
				'[dir="rtl"] &': {
					textAlign: 'right',
				},
			},
			h1: {
				fontFamily: typography.fonts.heading,
				fontSize: typography.fontSizes.h1,
				fontWeight: '700',
				color: tokens.neutral.white,
				lineHeight: typography.lineHeights.heading,
				letterSpacing: typography.letterSpacings.heading,
			},
			h2: {
				fontFamily: typography.fonts.heading,
				fontSize: typography.fontSizes.h2,
				fontWeight: '600',
				color: tokens.neutral.white,
				lineHeight: typography.lineHeights.heading,
			},
			h3: {
				fontFamily: typography.fonts.heading,
				fontSize: typography.fontSizes.h3,
				fontWeight: '500',
				color: tokens.neutral.white,
			},
			p: {
				color: tokens.neutral.gray300,
				fontSize: typography.fontSizes.body,
			},
			input: {
				color: tokens.neutral.white,
			},
			html: {
				fontFamily: typography.fonts.body,
			},
			// Highlight utility: wrap text in <span className="gold-text">
			'.gold-text': {
				background: tokens.gold.gradient,
				WebkitBackgroundClip: 'text',
				WebkitTextFillColor: 'transparent',
				backgroundClip: 'text',
			},
			// Gold glow utility
			'.gold-glow': {
				boxShadow: shadows.goldGlow,
			},
		}),
	},

	// ── Typography ────────────────────────────────────────────
	fonts: typography.fonts,
	fontSizes: typography.fontSizes,
	lineHeights: typography.lineHeights,
	letterSpacings: typography.letterSpacings,

	// ── Spacing ───────────────────────────────────────────────
	space,

	// ── Shadows ───────────────────────────────────────────────
	shadows,

	// ── Border radii ──────────────────────────────────────────
	radii: {
		sm: '6px',
		md: '10px',
		lg: '12px', // Buttons
		xl: '16px', // Cards
		'2xl': '20px',
		full: '9999px',
	},

	// ── Component overrides ───────────────────────────────────
	components,
});

// ============================================================
// 🔧 EXPORT RAW TOKENS for use outside Chakra
// (e.g., styled-components, inline styles, CSS vars)
// ============================================================

export { tokens, typography, shadows, space };

/*
  ── USAGE GUIDE ──────────────────────────────────────────────

  SEMANTIC (recommended):
    bg="bg.app"         → navy.900 background
    bg="bg.surface"     → navy.800 card
    color="text.accent" → gold.primary text
    borderColor="border.focus" → gold border on focus

  PALETTE (direct):
    bg="navy.800"
    color="gold.300"    → #D4AF37

  GOLD GRADIENT (CTA):
    <Button variant="brand">Buy Now</Button>

  GOLD TEXT HIGHLIGHT:
    <Text><span className="gold-text">Premium</span> ERP</Text>

  ERP LAYOUT:
    Sidebar bg  → semanticToken "erp.sidebar.bg"  → navy.900
    Topbar  bg  → semanticToken "erp.topbar.bg"   → navy.800
    Active menu → semanticToken "erp.sidebar.active" → gold

  RTL (Arabic):
    Add dir="rtl" to <html> tag
    Font will auto-switch to Cairo/Tajawal
    Alignment handled via CSS [dir="rtl"] rules

  ────────────────────────────────────────────────────────────
*/
