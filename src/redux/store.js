import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "./roleSlice";
import imageReducer from "./imageSlice";
import userReducer from "./localSlice";
import announcementsReducer from "./announcementsSlice";

const store = configureStore({
	reducer: {
		roles: roleReducer,
		images: imageReducer,
		user: userReducer,
		announcements: announcementsReducer,
	},
});

export default store;
