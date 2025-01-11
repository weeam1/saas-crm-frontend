import keys from "config/keys";

class WebSocketService {
	constructor() {
		this.socket = null;
	}

	connect(userId) {
		if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
			this.socket = new WebSocket(`${keys.wssSocketUrl}/ws/${userId}`);
		}

		this.socket.onopen = () => console.log("WebSocket connected");
		this.socket.onclose = () => console.log("WebSocket disconnected");
		this.socket.onerror = (error) => console.error("WebSocket error:", error);
	}

	onMessage(callback) {
		if (this.socket) {
			this.socket.onmessage = (event) => {
				try {
					const message = JSON.parse(event.data);
					callback(message);
				} catch (error) {
					console.error("Error parsing WebSocket message:", error);
				}
			};
		}
	}

	disconnect() {
		if (this.socket) {
			this.socket.close();
			this.socket = null;
		}
	}
}

const webSocketService = new WebSocketService();
export default webSocketService;
