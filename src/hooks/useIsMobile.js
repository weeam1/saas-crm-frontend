import { useState, useEffect, useCallback } from 'react';

export function useIsMobile(breakpoint = 1024) {
	const [isMobile, setIsMobile] = useState(() => {
		if (typeof window === 'undefined') return false;
		return window.innerWidth < breakpoint;
	});

	// stable callback
	const checkScreen = useCallback(() => {
		if (typeof window !== 'undefined') {
			setIsMobile(window.innerWidth < breakpoint);
		}
	}, [breakpoint]);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		// attach listener
		window.addEventListener('resize', checkScreen);
		// run once at mount
		checkScreen();

		return () => window.removeEventListener('resize', checkScreen);
	}, [checkScreen]);

	return isMobile;
}
