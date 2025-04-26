import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import './clock.css';
import moment from 'moment';

const AnalogClock = ({ timezone }) => {
	const hrRef = useRef(null);
	const mnRef = useRef(null);
	const scRef = useRef(null);

	const deg = 6;

	useEffect(() => {
		const updateClock = () => {
			const now = moment().tz(timezone);
			// setCurrentTime(now);

			const hh = now.hours() * 30; // 360° / 12 hours = 30° per hour
			const mm = now.minutes() * deg; // 360° / 60 minutes = 6° per minute
			const ss = now.seconds() * deg; // 360° / 60 seconds = 6° per second

			if (hrRef.current) {
				hrRef.current.style.transform = `rotateZ(${hh + mm / 12}deg)`;
			}
			if (mnRef.current) {
				mnRef.current.style.transform = `rotateZ(${mm}deg)`;
			}
			if (scRef.current) {
				scRef.current.style.transform = `rotateZ(${ss}deg)`;
			}
		};

		const timer = setInterval(updateClock, 1000);
		updateClock(); // Initial call

		return () => clearInterval(timer);
	}, []);

	return (
		<Box bg='brand.100' rounded='full' shadow='sm'>
			<div className='clock'>
				<div className='hour'>
					<div className='hr' id='hr' ref={hrRef}></div>
				</div>

				<div className='min'>
					<div className='mn' id='mn' ref={mnRef}></div>
				</div>

				<div className='sec'>
					<div className='sc' id='sc' ref={scRef}></div>
				</div>
			</div>
		</Box>
	);
};

export default AnalogClock;
