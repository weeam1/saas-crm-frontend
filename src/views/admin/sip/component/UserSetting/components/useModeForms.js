import { useFormik } from 'formik';
import * as Yup from 'yup';

export const MODES = ['wss', 'tls', 'udp'];

export const getSlotNumber = (payload = {}, initialData = {}) => {
	for (const mode of MODES) {
		const username =
			payload?.modes?.[mode]?.username?.trim() ||
			initialData?.modes?.[mode]?.username?.trim();

		if (username) return username;
	}

	return null;
};

export const configuredIndexes = (initialData = {}) =>
	MODES.map((mode, index) =>
		initialData?.modes?.[mode]?.username?.trim() ? index : null,
	).filter((v) => v !== null);

// Validation schema for each mode
const modeValidationSchema = Yup.object().shape({
	cid: Yup.string()
		.required('CID is required')
		.matches(/^[1-9]\d{2,}$/, 'Must be 3 digits or more starting from 100')
		.test('min-value', 'Must be ≥ 100', (value) => parseInt(value) >= 100),
	username: Yup.string()
		.required('Username is required')
		.matches(
			/^[a-zA-Z0-9_]+$/,
			'Username can only contain letters, numbers and underscore',
		),
	password: Yup.string()
		.required('Password is required')
		.min(6, 'Password must be at least 6 characters'),
	domain: Yup.string()
		.required('Domain is required')
		.matches(
			/^[a-zA-Z0-9][a-zA-Z0-9-.]+\.[a-zA-Z]{2,}$/,
			'Invalid domain format',
		),
	port: Yup.number()
		.required('Port is required')
		.min(1, 'Port must be between 1 and 65535')
		.max(65535, 'Port must be between 1 and 65535'),
});

export const buildModesPayload = (forms) => {
	const payload = {};

	for (const mode of MODES) {
		const f = forms[mode];

		// Skip if untouched or invalid
		if (!f.dirty || !f.isValid) continue;

		payload[mode] = {
			...f.values,
			port: Number(f.values.port),
		};
	}

	return payload;
};

const REQUIRED_FIELDS = ['cid', 'username', 'password', 'domain', 'port'];

export const isModeConfigured = (form) => {
	const v = form.values;

	// at least one field must contain a value
	const hasAnyValue = REQUIRED_FIELDS.some((key) => v[key]);

	// mode considered "configured" only if:
	// 1) has some values
	// 2) validation has zero errors
	return hasAnyValue && Object.keys(form.errors).length === 0;
};

// Pre-fill modeForms
export const useModeForms = (initialData = {}) => {
	const defaultValues = {
		cid: '',
		username: '',
		password: '',
		domain: '',
		port: '',
	};

	const initialFormik = {
		validationSchema: modeValidationSchema,
		enableReinitialize: true, // IMPORTANT: refreshes when initialData changes
		validateOnMount: true,
		validateOnChange: true,
		validateOnBlur: true,
		onSubmit: () => {}, // you removed save buttons → no submit needed
	};

	const udp = useFormik({
		...initialFormik,
		initialValues: initialData?.modes?.udp || defaultValues,
	});

	const tls = useFormik({
		...initialFormik,
		initialValues: initialData?.modes?.tls || defaultValues,
	});

	const wss = useFormik({
		...initialFormik,
		initialValues: initialData?.modes?.wss || defaultValues,
	});

	return { udp, tls, wss };
};
