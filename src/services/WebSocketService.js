import keys from "config/keys";
import { addAnnouncement } from "./../redux/announcementsSlice";
import store from "./../redux/store";

class WebSocketService {
	constructor() {
		this.socket = null;
	}

	connect(userId) {
		if (!userId) {
			console.error("User ID is required for WebSocket connection.");
			return;
		}

		if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
			this.socket = new WebSocket(`${keys.wssSocketUrl}/ws/${userId}`);

			this.socket.onopen = () => {
				console.log("WebSocket connection established.");
			};

			this.socket.onmessage = (event) => {
				const message = JSON.parse(event.data);

				console.log({ message });
				if (message.type === 1) {
					console.log("Announcement message received added");
					// Add to Redux store
					store.dispatch(addAnnouncement(message.data));
				}
				console.log("Message from server:", message);
			};

			this.socket.onerror = (error) => {
				console.error("WebSocket error:", error);
			};

			this.socket.onclose = (event) => {
				console.log("WebSocket connection closed:", event);
			};
		}
	}

	disconnect() {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.close();
			console.log("WebSocket connection terminated.");
		}
	}

	sendMessage(data) {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify(data));
		} else {
			console.error("WebSocket is not connected.");
		}
	}
}

const webSocketService = new WebSocketService();
export default webSocketService;
