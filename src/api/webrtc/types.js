export const StatusCodes = {
	OK: 200,
	CREATED: 201,
	ACCEPTED: 202,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	UNPROCESSABLE_ENTITY: 422,
	INTERNAL_SERVER_ERROR: 500,
	/** SMPP temporarily unavailable */
	TEMPORARILY_UNAVAILABLE: 480,
};

// FetchTransport structure
// {
//   headers: Headers,
//   status: number (StatusCodes),
//   json: any,
//   blob?: Blob
// }

// FetchError structure
// {
//   status: number (StatusCodes),
//   msg: string
// }

// Application object
// {
//   application_sid: string,
//   name: string
// }

// Queue object
// {
//   name: string,
//   length: number
// }

// RegisteredUser object
// {
//   name: string,
//   contact: string,
//   expiryTime: number,
//   protocol: string,
//   allow_direct_app_calling: boolean,
//   allow_direct_queue_calling: boolean,
//   allow_direct_user_calling: boolean,
//   registered_status: string
// }

// ConferenceParticipantActions enum
export const ConferenceParticipantActions = [
	'tag',
	'untag',
	'coach',
	'uncoach',
	'mute',
	'unmute',
	'hold',
	'unhold',
];

// ConferenceModes enum
export const ConferenceModes = ['full_participant', 'muted', 'coach'];

// ConferenceParticipantAction object
// {
//   action: one of ConferenceParticipantActions,
//   tag: string
// }

// UpdateCall object
// {
//   conferenceParticipantAction: ConferenceParticipantAction
// }
