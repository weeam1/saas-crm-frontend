import { Skeleton, Td, Tr } from '@chakra-ui/react';
import React from 'react';

const TableLoading = ({ columns, length, py = 1 }) => {
	return Array.from({ length }).map((_, index) => (
		<Tr key={index}>
			{columns.map((col, colIndex) => (
				<Td key={colIndex} py={py}>
					<Skeleton
						height='20px'
						width={`${Math.random() * (90 - 60) + 60}%`} // Randomized width between 60% and 90%
						borderRadius='4px'
						startColor='gray.100'
						endColor='gray.200' // Gradient shimmer effect
					/>
				</Td>
			))}
		</Tr>
	));
};

export default TableLoading;
