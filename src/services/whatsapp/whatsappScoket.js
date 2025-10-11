import socketService from 'services/socketService';
import {
	qrCode,
	authFail,
	authenticated,
	ready,
	fail,
	error,
	chatsLoaded,
	chatLoaded,
	newMessage,
	messageAck,
	disconnect,
	whatsappLoading,
	setChatsFetching,
} from './../../redux/whatsappWebSlice';
import { WHATSAPP_EVENTS } from './types';

let listenersRegistered = false;

export const registerWhatsappSocket = (store) => {
	const isSocketConnected = socketService.connectionStatus === 'connected';

	// if (!isSocketConnected) return;

	if (!isSocketConnected || listenersRegistered) return;

	listenersRegistered = true; // prevent double registration

	socketService.on(WHATSAPP_EVENTS.QR_CODE, (payload) =>
		store.dispatch(qrCode(payload))
	);
	socketService.on(WHATSAPP_EVENTS.WHATSAPP_LOADING, (payload) =>
		store.dispatch(whatsappLoading(payload))
	);
	socketService.on(WHATSAPP_EVENTS.AUTH_FAIL, (payload) =>
		store.dispatch(authFail(payload))
	);
	socketService.on(WHATSAPP_EVENTS.AUTHENTICATED, () =>
		store.dispatch(authenticated())
	);
	socketService.on(WHATSAPP_EVENTS.READY, () => store.dispatch(ready()));
	socketService.on(WHATSAPP_EVENTS.FAIL, (payload) =>
		store.dispatch(fail(payload))
	);
	socketService.on(WHATSAPP_EVENTS.ERROR, (payload) =>
		store.dispatch(error(payload))
	);
	socketService.on(WHATSAPP_EVENTS.CHATS_LOADED, (payload) => {
		store.dispatch(chatsLoaded(payload));
		store.dispatch(setChatsFetching(false));
	});
	socketService.on(WHATSAPP_EVENTS.CHAT_LOADED, (payload) =>
		store.dispatch(chatLoaded(payload))
	);
	socketService.on(WHATSAPP_EVENTS.MESSAGE_SENT, (payload) =>
		store.dispatch(newMessage(payload))
	);
	socketService.on(WHATSAPP_EVENTS.NEW_MESSAGE, (payload) =>
		store.dispatch(newMessage(payload))
	);
	socketService.on(WHATSAPP_EVENTS.MESSAGE_ACK, (payload) =>
		store.dispatch(messageAck(payload))
	);
	socketService.on(WHATSAPP_EVENTS.DISCONNECT, (payload) =>
		store.dispatch(disconnect(payload))
	);
};
