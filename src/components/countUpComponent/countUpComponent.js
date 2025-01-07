import React, { useState, useEffect } from "react";

// function CountUpComponent({ targetNumber }) {
//     const [count, setCount] = useState(0);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (count < targetNumber) {
//                 setCount(prevCount => prevCount + 1);
//             }
//         }, targetNumber > 500 ? 0 : 20); // Change the interval duration as needed (in milliseconds)

//         return () => {
//             clearInterval(interval);
//         };
//     }, [count, targetNumber]);

//     return <span>{typeof targetNumber === "number" ? count : targetNumber}</span>
// }

import { Text } from "@chakra-ui/react";

function CountUpComponent({ targetNumber, duration = 1000 }) {
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (typeof targetNumber !== "number" || targetNumber < 0) return;

		let startTime = null;

		const animateCount = (currentTime) => {
			if (!startTime) startTime = currentTime; // Set the start time on the first frame

			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1); // Clamp progress to [0, 1]

			// Calculate the next count value
			const nextCount = Math.round(progress * targetNumber);

			setCount(nextCount);

			if (progress < 1) {
				requestAnimationFrame(animateCount);
			}
		};

		requestAnimationFrame(animateCount);

		return () => setCount(0); // Reset on unmount
	}, [targetNumber, duration]);

	return (
		<Text fontSize="xl" fontWeight="bold">
			{typeof targetNumber === "number" ? count : targetNumber}
		</Text>
	);
}

export default CountUpComponent;
