import countryCodes from '../data/countryCodes.json';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

// countryCodeJson = your JSON file with Country, CountryCode, Iso2
// e.g. { "name": "Pakistan", "dial_code": "+92", "code": "PK" }

// export function normalizePhone(input, countryName) {
// 	if (!input || !countryName) return null;

// 	// 1. Find country from JSON
// 	const country = countryCodes?.find(
// 		(c) => c.name.toLowerCase() === countryName.toLowerCase()
// 	);

// 	console.log({ countryName, country });

// 	if (!country) return null;

// 	if (!country) return null;

// 	// 2. Clean number (remove spaces, dashes, brackets)
// 	let cleaned = input.replace(/[^\d+]/g, '');

// 	// 3. If number starts with "0" after country code, strip leading zero
// 	if (cleaned.startsWith('0')) {
// 		cleaned = cleaned.replace(/^0+/, '');
// 	}

// 	// 4. Ensure it has dial_code
// 	if (!cleaned.startsWith('+')) {
// 		cleaned = `${country.dial_code}${cleaned}`;
// 	}

// 	// 5. Validate with libphonenumber
// 	const phoneNumber = parsePhoneNumberFromString(cleaned, country.code);
// 	return phoneNumber?.isValid() ? phoneNumber.number : null; // returns E.164 format
// }

/* ---------- Cache ---------- */
const inputCache = new Map(); // input → normalized
const dialCache = new Map(); // dial_code → [countries]
const prefixMap = {}; // trie-like index

/* ---------- Build Prefix Map Once ---------- */
(function buildPrefixMap() {
	for (const c of countryCodes) {
		const dial = c.dial_code.replace('+', '');
		if (!prefixMap[dial]) prefixMap[dial] = [];
		prefixMap[dial].push(c.code);
	}
})();

function detectCountryCodes(cleaned) {
	const digits = cleaned.replace(/^\+/, '');

	// Max dial code length worldwide is 4
	for (let len = 4; len > 0; len--) {
		const prefix = digits.slice(0, len);

		if (dialCache.has(prefix)) return dialCache.get(prefix);

		if (prefixMap[prefix]) {
			dialCache.set(prefix, prefixMap[prefix]); // cache it
			return prefixMap[prefix];
		}
	}

	return null;
}

function preprocessLocalNumber(input) {
	// remove formatting
	let num = input.replace(/[^\d]/g, '');

	// UAE local mobile: 05XXXXXXXX
	if (/^05\d{7,8}$/.test(num)) {
		return '+971' + num.slice(1); // remove 0 → 9715…
	}

	// Pakistan local mobile: 03XXXXXXXX
	if (/^03\d{8}$/.test(num)) {
		return '+92' + num.slice(1); // remove 0 → 92 3…
	}

	// If already starts with country prefix (without +)
	if (/^92/.test(num)) return '+' + num;
	if (/^971/.test(num)) return '+' + num;

	// If already has +
	if (input.startsWith('+')) return input;

	return input; // unknown region
}

export function normalizePhone(input) {
	if (!input) return null;

	// First fix local numbers (UAE, PK, etc.)
	const preNumber = preprocessLocalNumber(input);
	if (!preNumber) return null;

	// Return from cache if available
	if (inputCache.has(preNumber)) return inputCache.get(preNumber);

	// Cleanup
	let cleaned = preNumber.replace(/[^\d+]/g, '');
	if (!cleaned.startsWith('+')) cleaned = '+' + cleaned;

	/* ----- Try full parse directly (fast path) ----- */
	const direct = parsePhoneNumberFromString(cleaned);

	if (direct?.isValid()) {
		const res = direct.number;
		inputCache.set(preNumber, res);
		return res;
	}

	/* ----- Detect country ----- */
	const possibleCountries = detectCountryCodes(cleaned);
	if (!possibleCountries) return null;

	/* ----- Try each for strict validation (2–3 max) ----- */
	for (const code of possibleCountries) {
		const parsed = parsePhoneNumberFromString(cleaned, code);
		if (parsed?.isValid()) {
			const res = parsed.number;
			inputCache.set(preNumber, res);
			return res;
		}
	}

	return null;
}

// export function normalizePhone(input) {
// 	if (!input) return null;

// 	// 1. Clean input (remove spaces, dashes, parentheses)
// 	let cleaned = input.replace(/[^\d+]/g, '');

// 	// Ensure cleaned always starts with '+'
// 	if (!cleaned.startsWith('+')) {
// 		cleaned = '+' + cleaned;
// 	}

// 	// 2. Find matching country by dial code prefix
// 	const country = countryCodes.find((c) => cleaned.startsWith(c.dial_code));

// 	console.log({ country, cleaned });

// 	if (!country) return null; // no match for any known dial code

// 	// 3. Remove extra zeros if appear after dial code
// 	const dialCode = country.dial_code;
// 	let localPart = cleaned.slice(dialCode.length);
// 	localPart = localPart.replace(/^0+/, '');

// 	// 4. Reconstruct normalized number
// 	const normalized = `${dialCode}${localPart}`;

// 	// 5. Validate using libphonenumber
// 	const phoneNumber = parsePhoneNumberFromString(normalized, country.code);

// 	return phoneNumber?.isValid() ? phoneNumber.number : null; // returns E.164 if valid
// }

export function formatWebRTCPhone(number) {
	// Step 1: Normalize input to international format (E.164-like)
	const normalized = normalizePhone(number);

	if (!normalized || !normalized.startsWith('+')) {
		return null; // invalid or non-international
	}

	// Step 2: Strip leading "+"
	const withoutPlus = normalized.slice(1);

	// Step 3: Validate: must be only digits
	if (!/^\d+$/.test(withoutPlus)) {
		return null; // invalid characters
	}

	// Step 4: Convert to 00CC format
	return `00${withoutPlus}`;
}

export function formatToWhatsappId(number) {
	if (!number) return null;

	// Remove any non-digit characters
	const cleaned = number.replace(/\D/g, '');

	// Return formatted WhatsApp ID
	return `${cleaned}@c.us`;
}

function normalizePhone2(number) {
	const cleaned = number.toString().replace(/\D/g, ''); // remove non-digits

	let phone;

	// Try with a leading + (for detection)
	phone = parsePhoneNumberFromString('+' + cleaned);

	if (!phone || !phone.isValid()) {
		return 'Invalid number';
	}

	const countryCode = phone.countryCallingCode; // e.g. 971
	const national = phone.nationalNumber; // e.g. 585577271

	return `00${countryCode}${national}`;
}
