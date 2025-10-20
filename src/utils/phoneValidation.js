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

export function normalizePhone(input) {
	if (!input) return null;

	// 1. Clean input (remove spaces, dashes, parentheses)
	let cleaned = input.replace(/[^\d+]/g, '');

	// Ensure cleaned always starts with '+'
	if (!cleaned.startsWith('+')) {
		cleaned = '+' + cleaned;
	}

	// 2. Find matching country by dial code prefix
	const country = countryCodes.find((c) => cleaned.startsWith(c.dial_code));

	if (!country) return null; // no match for any known dial code

	// 3. Remove extra zeros if appear after dial code
	const dialCode = country.dial_code;
	let localPart = cleaned.slice(dialCode.length);
	localPart = localPart.replace(/^0+/, '');

	// 4. Reconstruct normalized number
	const normalized = `${dialCode}${localPart}`;

	// 5. Validate using libphonenumber
	const phoneNumber = parsePhoneNumberFromString(normalized, country.code);

	return phoneNumber?.isValid() ? phoneNumber.number : null; // returns E.164 if valid
}

export function formatToWhatsappId(number) {
	if (!number) return null;

	// Remove any non-digit characters
	const cleaned = number.replace(/\D/g, '');

	// Return formatted WhatsApp ID
	return `${cleaned}@c.us`;
}
