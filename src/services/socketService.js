import { io } from 'socket.io-client';

import store from '../redux/store';
import { appendMessage, addContact } from '../redux/whatsappSlice';
import { updateAllUsers } from '../redux/usersSlice';
import { setOnlineUsers } from '../redux/onlineUsersSlice';
import {
	addFreshLead,
	markLeadClaimed,
	removeFreshLead,
} from '../redux/freshLeadSlice';
import keys from 'config/keys';

class SocketService {
	constructor() {
		this.socket = null;
		this.events = new Map();
		this.connectionStatus = 'disconnected';
		this.maxReconnectionAttempts = 10;
		this.connectionPromise = null;
	}

	/**
	 * Initialize socket connection
	 * @param {string} url - Socket server URL
	 * @param {object} [options] - Socket.IO options
	 * @returns {Promise} Resolves when connected
	 */
	connect(url = keys.socketIoUrl, options = {}) {
		if (this.connectionPromise) {
			return this.connectionPromise;
		}

		// Default options with merging
		const defaultOptions = {
			path: '/socket.io',
			// transports: ['socket.io'],
			reconnection: true,
			reconnectionAttempts: Infinity || this.maxReconnectionAttempts,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			autoConnect: true,
			forceNew: true, // <-- don’t force new connection
			timeout: 5000,
		};

		this.socket = io(url, { ...defaultOptions, ...options });

		this.connectionPromise = new Promise((resolve, reject) => {
			this.socket.on('connect', () => {
				// console.log('Socket connected:', this.socket.id);
				this.connectionStatus = 'connected';
				// this.reconnectionAttempts = 0;
				resolve(this.socket.id);
			});

			this.socket.on('chatMessage', (msg) => {
				console.log('Message received:', msg);
				if (msg.roomId) {
					store.dispatch(
						appendMessage({
							chatId: msg.roomId,
							message: msg,
						}),
					);
				}
			});

			// Lead evnts
			this.socket.on('freshLead', (lead) => {
				console.log('Fresh Lead:', lead);
				// store.dispatch(setFreshLead(lead));
				store.dispatch(addFreshLead(lead));
			});

			this.socket.on('leadClaimed', (payload) => {
				console.log('Lead Claimed:', payload);
				// store.dispatch(setLeadClaimed(payload));
				store.dispatch(markLeadClaimed(payload));
			});

			this.socket.on('newContact', (contact) => {
				if (contact) {
					store.dispatch(addContact(contact));
				}
			});

			this.socket.on('user_online', (data) => {
				console.log('User online:', data);
				store.dispatch(
					updateAllUsers({ id: data.userId, updates: { isOnline: true } }),
				);
				store.dispatch(setOnlineUsers(data));
			});

			this.socket.on('user_offline', (data) => {
				console.log('User offline:', data);
				store.dispatch(
					updateAllUsers({ id: data.userId, updates: { isOnline: false } }),
				);

				store.dispatch(setOnlineUsers(data));
			});

			this.socket.on('connection_status', (data) => {
				console.log('Connection Status:', data);
			});

			this.socket.on('activity_log_created', (data) => {
				// console.log('Activity: ', data);
			});

			this.socket.on('qr', (data) => {
				console.log('QR data detalls: ', data);
			});

			// Connection error
			this.socket.on('connect_error', (error) => {
				this.connectionStatus = 'error';
				console.error('Socket connection error:', error);
				reject(error);
			});

			// Disconnection
			this.socket.on('disconnect', (reason) => {
				this.connectionStatus = 'disconnected';
				console.log('Socket disconnected:', reason);
				if (
					reason === 'io server disconnect' ||
					reason === 'ping timeout' ||
					reason === 'transport close'
				) {
					this.connectionPromise = null;
				}
			});
		});

		return this.connectionPromise;
	}

	/**
	 * Register user with the server
	 *  Registration payload
	 */
	registerUser(payload) {
		console.log({ socket: this.socket?.connected });
		if (this.socket?.connected) {
			this.socket.emit('register', payload);
		} else {
			if (!this.connectionPromise) {
				console.warn(
					'Socket not connected, registration will be attempted when connection is established',
				);
			}
		}
	}
	/**
	 * Register user with the server
	 *  Registration payload
	 */
	registerWhatsappUser(payload) {
		if (this.socket?.connected) {
			this.socket.emit('whatsapp_register', payload);
		} else {
			if (!this.connectionPromise) {
				console.warn(
					'Socket not connected, whatsapp registration will be attempted when connection is established',
				);
			}
		}
	}

	/**
	 * Register user with the server
	 *  Registration payload
	 */
	createUserActivityLog(payload) {
		if (this.socket?.connected) {
			this.socket.emit('user_activity', payload);
		} else {
			if (!this.connectionPromise) {
				console.warn(
					'Socket not connected, user activity log will be attempted when connection is established',
				);
			}
		}
	}

	/**
	 * Register user with the server
	 *  Registration payload
	 */
	buyFreshLead(payload) {
		if (this.socket?.connected) {
			this.socket.emit('buyLead', payload);
		} else {
			if (!this.connectionPromise) {
				console.warn(
					'Socket not connected, fresh lead purchase will be attempted when connection is established',
				);
			}
		}
	}

	/**
	 * Disconnect socket
	 */
	disconnect() {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
			this.connectionPromise = null;
			this.connectionStatus = 'disconnected';
			// this.reconnectionAttempts = 0;
		}
	}

	/**
	 * Register event listener
	 * @param {string} event - Event name
	 * @param {function} callback - Callback function
	 */
	on(event, handler) {
		if ((this.connectionStatus = 'connected')) {
			if (!this.events.has(event)) this.events.set(event, []);
			this.events.get(event).push(handler);
			if (this.socket) this.socket.on(event, handler);
		}
	}

	/**
	 * Unregister event listener
	 * @param {string} event - Event name
	 * @param {function} handler - (optional) specific handler to remove
	 */
	off(event, handler) {
		if (!this.events.has(event)) return;

		if (handler) {
			// Remove only this handler
			const handlers = this.events.get(event).filter((h) => h !== handler);
			this.events.set(event, handlers);

			if (this.socket) {
				this.socket.off(event, handler);
			}
		} else {
			// Remove all handlers for this event

			const handlers = this.events.get(event);
			this.events.delete(event);

			if (this.socket) {
				for (const h of handlers) {
					this.socket.off(event, h);
				}
			}
		}
	}

	/**
	 * Internal: bind all registered events to socket
	 */
	_bindEvents() {
		for (const [event, handlers] of this.events.entries()) {
			for (const h of handlers) {
				this.socket.on(event, h);
			}
		}
	}

	/**
	 * Emit an event to the server
	 * @param {string} event - Event name
	 * @param {*} data - Data to send
	 * @param {function} [ack] - Acknowledgement callback
	 * @returns {Promise} Resolves when acknowledged if no callback provided
	 */
	emit(event, data, ack) {
		if (!this.socket || !this.socket.connected) {
			// return Promise.reject(new Error('Socket not connected'));
			console.warn('Socket not connected!');
			return -1;
		}

		if (ack) {
			return this.socket.emit(event, data, ack);
		}

		return new Promise((resolve, reject) => {
			this.socket.emit(event, data, (response) => {
				if (response.error) {
					reject(response.error);
				} else {
					resolve(response);
				}
			});
		});
	}

	/**
	 * Get current connection status
	 * @returns {string} Connection status
	 */
	getConnectionStatus() {
		return this.connectionStatus;
	}

	/**
	 * Get socket instance
	 * @returns {Socket|null} Socket instance
	 */
	getSocket() {
		return this.socket;
	}
}

const socketService = new SocketService();

export default socketService;
