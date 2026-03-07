import { useCallback } from 'react';
import { useUpdateItemMutation } from 'api/apiSlice';
import {
	decrementUnreadCount,
	updateNotification,
} from '../../redux/notificationSlice';
import { useDispatch } from 'react-redux';

export function useReadNotification() {
	const [updateItem, { isLoading, isError, error }] = useUpdateItemMutation();

	const dispatch = useDispatch();

	const readNotification = useCallback(
		async (id) => {
			if (!id) return null;

			let endpoint = `/notifications/${id}/read`;

			try {
				const res = await updateItem({
					path: endpoint,
				}).unwrap();

				if (id) {
					dispatch(
						updateNotification({
							id,
							updates: { read: true, readAt: new Date().toISOString() },
						}),
					);

					dispatch(decrementUnreadCount());
				}

				return res;
			} catch (err) {
				console.error('Notification read failed:', err);
				throw err;
			}
		},
		[updateItem],
	);

	return {
		readNotification,
		isReading: isLoading,
		error,
		isError,
	};
}
