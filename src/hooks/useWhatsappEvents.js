import { useState } from 'react';
import socketService from 'services/socketService';

export function useWhatsappEvents() {
	const [whatsappQR, setWhatsappQR] = useState('');
	// Initialize whatsapp client (create session)
	// if whatsapp session already stored then only get the session
	// if not then return qr code
	const whatsappInitialize = async (payload) => {
		console.log('Whatsapp register: ', payload);
		socketService.emit('initialize_whatsapp', payload);
	};

	socketService.on('qr_code', (data) => {
		console.log('QR data: ', data);
		setWhatsappQR(data?.qrCode);
	});

	return {
		whatsappInitialize,
		whatsappQR,
		isSocketConnected: socketService.connectionStatus === 'connected',
	};
}
