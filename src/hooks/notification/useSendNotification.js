import { useCallback } from 'react';
import { useCreateItemMutation } from 'api/apiSlice';

export function useSendNotification() {
	const [createItem, { isLoading, isError, error }] = useCreateItemMutation();

	const sendNotification = useCallback(
		async (payload) => {
			if (!payload) return null;

			try {
				const res = await createItem({
					path: '/notifications',
					body: payload,
				}).unwrap();

				return res;
			} catch (err) {
				console.error('Notification send failed:', err);
				throw err;
			}
		},
		[createItem],
	);

	return {
		sendNotification,
		isSending: isLoading,
		error,
		isError,
	};
}
