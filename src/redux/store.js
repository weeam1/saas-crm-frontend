import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './roleSlice';
import imageReducer from './imageSlice';
import userReducer from './localSlice';
import announcementsReducer from './announcementsSlice';
import missingFilesReducer from './missingFilesSlice';
import webSocketReducer from './webSocketReducer';
import positionsReducer from './positionsSlice';
import filtersReducer from './filtersSlice';
import invoiceModalDataReducer from './invoiceSlice';
import countriesReducer, {
	setCountries,
	setCountryNames,
} from './countriesSlice';
import usersReducer from './usersSlice';
import leadsReducer from './leadsSlice';
import { apiSlice } from 'api/apiSlice';
import { expensesSlice } from 'api/expenses/index';
import countriesData from 'data/countries.json';

const store = configureStore({
	reducer: {
		leads: leadsReducer,
		roles: roleReducer,
		filters: filtersReducer,
		positions: positionsReducer,
		countries: countriesReducer,
		users: usersReducer,
		images: imageReducer,
		user: userReducer,
		announcements: announcementsReducer,
		missingFiles: missingFilesReducer,
		invoiceModalData: invoiceModalDataReducer,
		webSocket: webSocketReducer,
		[apiSlice.reducerPath]: apiSlice.reducer,
		[expensesSlice.reducerPath]: expensesSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware, expensesSlice.middleware),
});

// Load countries from JSON into Redux store
store.dispatch(setCountries(countriesData));
store.dispatch(
	setCountryNames(countriesData.map((country) => country.name.toLowerCase()))
);

export default store;
