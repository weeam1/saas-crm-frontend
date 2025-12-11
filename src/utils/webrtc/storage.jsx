// window ID
const windowIdKey = 'windowIdKey';

export const saveWindowIdKey = (id) => {
	localStorage.setItem(windowIdKey, id.toString());
};

export const getWindowIdKey = () => {
	const str = localStorage.getItem(windowIdKey);
	if (str) {
		return Number(str);
	}
	return -1;
};

export const deleteWindowIdKey = () => {
	localStorage.removeItem(windowIdKey);
};
