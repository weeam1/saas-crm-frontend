import { Skeleton } from '@chakra-ui/react';

const ShimmerSkeleton = ({ width = '100%', height = 'full', ...props }) => {
	return (
		<Skeleton
			height={height}
			width={width}
			borderRadius='4px'
			startColor='gray.100'
			endColor='gray.200'
			{...props}
		/>
	);
};

export default ShimmerSkeleton;
