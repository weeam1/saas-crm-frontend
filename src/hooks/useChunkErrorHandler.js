import { useEffect } from 'react';

const useChunkErrorHandler = () => {
	useEffect(() => {
		const handleChunkError = (e) => {
			if (e.message.includes('Loading chunk')) {
				console.warn('Chunk Load Error detected. Reloading the page...');
				window.location.reload();
			}
		};

		window.addEventListener('error', handleChunkError);

		return () => {
			window.removeEventListener('error', handleChunkError);
		};
	}, []);
};

export default useChunkErrorHandler;
