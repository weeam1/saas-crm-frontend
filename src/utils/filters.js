export const getNameById = (list = [], id) => {
	if (!id) return null;
	return list.find((item) => item._id === id)?.name ?? id;
};
