import socketService from 'services/socketService';

export function useWhatsappEvents() {
	// Initialize whatsapp client (create session)
	// if whatsapp session already stored then only get the session
	// if not then return qr code
	const whatsappInitialize = async (payload) => {
		socketService.emit('initialize_whatsapp', payload);
	};

	return { whatsappInitialize };
}
