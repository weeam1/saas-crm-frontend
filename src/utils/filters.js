export const getNameById = (list = [], id, label = 'name') => {
	if (!id) return null;
	return list.find((item) => item._id === id)?.[label] ?? id;
};
