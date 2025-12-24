// CallState enum
export const CallState = {
	RINGING: 'RINGING',
	ANSWERED: 'ANSWERED',
	COMPLETED: 'COMPLETED',
	FAILED: 'FAILED',
};

// CallAction enum
export const CallAction = {
	OUTBOUND: 'OUTBOUND',
	ANSWER: 'ANSWER',
	CANCEL: 'CANCEL',
	BYE: 'BYE',
	DTMF: 'DTMF',
};

// MessageEvent enum
export const MessageEvent = {
	Call: 'CALL',
	OpenPhoneWindow: 'OPEN_PHONE_WINDOW',
};

// SipCallDirection type
// JS doesn't have types, so use comments or JSDoc for clarity
/**
 * @typedef {'outgoing' | 'incoming' | 'none'} SipCallDirection
 */
