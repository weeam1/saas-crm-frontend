import keys from 'config/keys';

class WebSocketService {
	constructor() {
		this.socket = null;
	}

	connect(userId) {
		if (!userId) {
			console.error('User ID is required for WebSocket connection.');
			return;
		}

		if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
			this.socket = new WebSocket(`${keys.wssSocketUrl}/ws/${userId}`);

			this.socket.onopen = () => {
				console.log('WebSocket connection established.');
			};

			// this.socket.onmessage = (event) => {
			// 	const socketData = JSON.parse(event.data);

			// 	console.log('WebSocket message:', socketData);

			// 	// Type = 1 mean Announcemnents
			// 	if (socketData.type === 1 && socketData.data.length > 0) {
			// 		socketData.data.forEach((announcement) =>
			// 			store.dispatch(addAnnouncement(announcement))
			// 		);
			// 	} else if (socketData.type === 1 && socketData.data.message) {
			// 		store.dispatch(addAnnouncement(socketData));
			// 		store.dispatch(newNotifyItem(socketData));
			// 	} else if (socketData.type === 2 && socketData.data.message) {
			// 		store.dispatch(newNotifyItem(socketData));
			// 	}
			// };

			this.socket.onerror = (error) => {
				console.error('WebSocket error:', error);
			};

			this.socket.onclose = (event) => {
				console.log('WebSocket connection closed:', event);
			};
		}
	}

	disconnect() {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.close();
			console.log('WebSocket connection terminated.');
		}
	}

	sendMessage(data) {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify(data));
		} else {
			console.error('WebSocket is not connected.');
		}
	}
}

const webSocketService = new WebSocketService();
export default webSocketService;
