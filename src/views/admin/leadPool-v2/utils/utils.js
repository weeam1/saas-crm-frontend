import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const COIN_COST_BY_STATUS = {
	new: 300,
	default: 50,
};

export const handleCopy = (text) => {
	navigator.clipboard
		.writeText(text)
		.then(() => {
			toast.success('Copied to clipboard!', {
				position: 'top-right',
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: 'light',
			});
		})
		.catch((err) => {
			toast.error('Failed to copy!', {
				position: 'top-right',
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: 'light',
			});
			console.error('Clipboard error: ', err);
		});
};
