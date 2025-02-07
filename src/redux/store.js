import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './roleSlice';
import imageReducer from './imageSlice';
import userReducer from './localSlice';
import announcementsReducer from './announcementsSlice';
import missingFilesReducer from './missingFilesSlice';
import webSocketReducer from './webSocketReducer';
import positionsReducer from './positionsSlice';
import { apiSlice } from 'api/apiSlice';

const store = configureStore({
	reducer: {
		roles: roleReducer,
		positions: positionsReducer,
		images: imageReducer,
		user: userReducer,
		announcements: announcementsReducer,
		missingFiles: missingFilesReducer,
		webSocket: webSocketReducer,
		[apiSlice.reducerPath]: apiSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
