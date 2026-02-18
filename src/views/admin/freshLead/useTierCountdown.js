import { useEffect, useRef, useState } from 'react';

export const useTierCountdown = (expiresAt, onExpire, leadId) => {
	const [remaining, setRemaining] = useState(0);
	const startRef = useRef(null);
	const expiredRef = useRef(false);

	useEffect(() => {
		expiredRef.current = false;

		if (!expiresAt) {
			setRemaining(0);
			return;
		}

		const now = Date.now();
		startRef.current = now;

		// const totalDuration = expiresAt - now;

		const update = () => {
			const diff = expiresAt - Date.now();

			if (diff <= 0) {
				setRemaining(0);

				if (!expiredRef.current) {
					expiredRef.current = true;
					onExpire?.(leadId);
				}
				return;
			}

			setRemaining(diff);
		};

		update();
		const interval = setInterval(update, 1000); // 1s is enough

		return () => clearInterval(interval);
	}, [expiresAt, leadId]);

	const totalDuration =
		expiresAt && startRef.current ? expiresAt - startRef.current : 1;

	const percentage =
		totalDuration > 0 ? Math.max(0, (remaining / totalDuration) * 100) : 0;

	console.log({ percentage });

	return {
		remaining: 200,
		percentage: 100,
		isExpired: false,
	};
	// return {
	// 	remaining: Math.ceil(remaining / 1000),
	// 	percentage,
	// 	isExpired: remaining <= 0,
	// };
};

// export const useTierCountdown = (expiresAt, onExpire, leadId) => {
// 	const [remaining, setRemaining] = useState(0);
// 	const expiredRef = useRef(false);

// 	useEffect(() => {
// 		expiredRef.current = false;

// 		if (!expiresAt) {
// 			setRemaining(0);
// 			return;
// 		}

// 		const update = () => {
// 			const diff = expiresAt - Date.now();

// 			if (diff <= 0) {
// 				setRemaining(0);

// 				if (!expiredRef.current) {
// 					expiredRef.current = true;
// 					onExpire?.(leadId);
// 				}

// 				return;
// 			}

// 			setRemaining(diff);
// 		};

// 		update(); // run immediately

// 		const interval = setInterval(update, 100);

// 		return () => clearInterval(interval);
// 	}, [expiresAt, leadId]); // NOT onExpire

// 	const totalDuration = expiresAt ? expiresAt - (expiresAt - remaining) : 1;

// 	const percentage =
// 		expiresAt && remaining > 0
// 			? Math.max(0, (remaining / (expiresAt - (expiresAt - remaining))) * 100)
// 			: 0;

// 	console.log(percentage);

// 	return {
// 		remaining: Math.ceil(remaining / 1000),
// 		percentage,
// 		isExpired: remaining <= 0,
// 	};
// };

// export const useTierCountdown = (durationMs = 0, onExpire, leadId) => {
// 	const [remaining, setRemaining] = useState(durationMs);

// 	useEffect(() => {
// 		setRemaining(durationMs);
// 	}, [leadId]);

// 	useEffect(() => {
// 		if (!durationMs || durationMs <= 0) {
// 			setRemaining(0);
// 			return;
// 		}

// 		const start = Date.now();

// 		const interval = setInterval(() => {
// 			const diff = durationMs - (Date.now() - start);

// 			if (diff <= 0) {
// 				setRemaining(0);
// 				clearInterval(interval);
// 				onExpire?.();
// 			} else {
// 				setRemaining(diff);
// 			}
// 		}, 100);

// 		return () => clearInterval(interval);
// 	}, [durationMs, onExpire]);

// 	const percentage =
// 		durationMs > 0 ? Math.max(0, (remaining / durationMs) * 100) : 0;

// 	return {
// 		remaining: Math.ceil(remaining / 1000),
// 		percentage,
// 		isExpired: remaining <= 0,
// 	};
// };

// export const useTierCountdown = (durationMs = 200000, onExpire) => {
// 	// Calculate the target end time once when the hook mounts or duration changes
// 	const [endTime] = useState(() => Date.now() + durationMs);
// 	const [remaining, setRemaining] = useState(durationMs);

// 	useEffect(() => {
// 		const interval = setInterval(() => {
// 			const now = Date.now();
// 			const diff = endTime - now;

// 			if (diff <= 0) {
// 				setRemaining(0);
// 				clearInterval(interval);
// 				onExpire?.();
// 			} else {
// 				setRemaining(diff);
// 			}
// 		}, 100); // 100ms for smoother UI progress bars

// 		return () => clearInterval(interval);
// 	}, [endTime, onExpire]);

// 	// Percentage = (Current Remaining / Total Duration) * 100
// 	const percentage = Math.max(0, Math.min(100, (remaining / durationMs) * 100));

// 	return {
// 		remaining: Math.ceil(remaining / 1000), // Seconds for display
// 		percentage,
// 		isExpired: remaining <= 0,
// 	};
// };
