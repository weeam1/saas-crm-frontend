import { setTree, setActiveTree } from './../../../redux/localSlice';
import { getApi } from 'services/api';

export const fetchAndDispatch = async (endpoint, action, dispatch) => {
	try {
		const response = await getApi(endpoint);
		const data = response.data || null;
		dispatch(action(data));
	} catch (err) {
		console.error(`Error fetching ${endpoint}:`, err);
	}
};

export const fetchActiveTree = (dispatch) =>
	fetchAndDispatch('api/v2/user/active_tree', setActiveTree, dispatch);

export const fetchTree = (dispatch) =>
	fetchAndDispatch('api/user/tree', setTree, dispatch);
