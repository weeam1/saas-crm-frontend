import { useState, useEffect, useMemo } from 'react';

const useIsMobile = () => {
	const [windowWidth, setWindowWidth] = useState(
		typeof window !== 'undefined' ? window.innerWidth : 0
	);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const isMobile = useMemo(() => windowWidth < 768, [windowWidth]); // Tailwind md = 768px

	return isMobile;
};

export default useIsMobile;
