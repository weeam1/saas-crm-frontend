import countryCodes from '../data/countryCodes.json';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

// countryCodeJson = your JSON file with Country, CountryCode, Iso2
// e.g. { "name": "Pakistan", "dial_code": "+92", "code": "PK" }

export function normalizePhone(input, countryName) {
	if (!input || !countryName) return null;

	// 1. Find country from JSON
	const country = countryCodes?.find(
		(c) => c.name.toLowerCase() === countryName.toLowerCase()
	);

	console.log({ countryName, country });

	if (!country) return null;

	// 2. Clean number (remove spaces, dashes, brackets)
	let cleaned = input.replace(/[^\d+]/g, '');

	// 3. If number starts with "0" after country code, strip leading zero
	if (cleaned.startsWith('0')) {
		cleaned = cleaned.replace(/^0+/, '');
	}

	// 4. Ensure it has dial_code
	if (!cleaned.startsWith('+')) {
		cleaned = `${country.dial_code}${cleaned}`;
	}

	// 5. Validate with libphonenumber
	const phoneNumber = parsePhoneNumberFromString(cleaned, country.code);
	return phoneNumber?.isValid() ? phoneNumber.number : null; // returns E.164 format
}
