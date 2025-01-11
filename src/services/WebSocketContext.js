import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import webSocketService from "./webSocket";
import { toast } from "react-toastify";
import { addAnnouncement } from "./../redux/announcementsSlice";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children, user }) => {
	const dispatch = useDispatch();
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		if (user && user._id) {
			webSocketService.connect(user._id);

			webSocketService.onMessage((message) => {
				if (message.type === 1 && message.data) {
					dispatch(addAnnouncement(message.data));

					console.log({ message });

					if (Notification.permission === "granted") {
						new Notification("New Announcement", {
							body: message.data.message || "Check out the latest updates!",
							icon: "/path/to/icon.png", // optional
						});
					} else {
						toast.success("Check out the latest updates!");
					}

					const sound = new Audio("assets/sounds/new-notification.wav");
					sound
						.play()
						.catch((error) => console.error("Error playing sound:", error));

					setIsModalOpen(true); // Open modal for announcements
				}

				// Add more handling for other message types as needed
			});

			return () => {
				webSocketService.disconnect();
			};
		}
	}, [user, dispatch]);

	return (
		<WebSocketContext.Provider value={{ isModalOpen, setIsModalOpen }}>
			{children}
		</WebSocketContext.Provider>
	);
};

export const useWebSocket = () => useContext(WebSocketContext);
