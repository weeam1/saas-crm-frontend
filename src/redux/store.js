import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './roleSlice';
import imageReducer from './imageSlice';
import userReducer from './localSlice';
import announcementsReducer from './announcementsSlice';
import missingFilesReducer from './missingFilesSlice';
import webSocketReducer from './webSocketReducer';
import positionsReducer from './positionsSlice';
import filtersReducer from './filtersSlice';
import countriesReducer, {
	setCountries,
	setCountryNames,
} from './countriesSlice';
import usersReducer from './usersSlice';
import leadsReducer from './leadsSlice';
import { apiSlice } from 'api/apiSlice';
import countriesData from 'data/countries.json';

const store = configureStore({
	reducer: {
		roles: roleReducer,
		filters: filtersReducer,
		positions: positionsReducer,
		countries: countriesReducer,
		leads: leadsReducer,
		users: usersReducer,
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

// Load countries from JSON into Redux store
store.dispatch(setCountries(countriesData));
store.dispatch(
	setCountryNames(countriesData.map((country) => country.name.toLowerCase()))
);

export default store;
