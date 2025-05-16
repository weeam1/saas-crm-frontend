import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
	return (
		<Flex
			alignItems='center'
			fontFamily='DM Sans, sans-serif'
			fontSize={{ base: 'sm', md: 'md' }}
			mb={4}
		>
			{items?.map((item, index) => (
				<Box
					key={index}
					bg={index === items.length - 1 ? '#B79045' : 'gray.200'} // Last item gets #B79045, others gray.200
					px={4}
					py={2}
					position='relative'
					ml={index > 0 ? '14px' : 0} // Margin-left for all except the first item
					_before={{
						content: index > 0 ? '""' : undefined, // Only add _before for items after the first
						position: 'absolute',
						left: '-15px',
						top: 0,
						width: '15px',
						height: '100%',
						background: 'white',
						clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
						zIndex: 2,
					}}
					_after={{
						content: index < items.length - 1 ? '""' : undefined, // No _after for the last item
						position: 'absolute',
						right: '-15px',
						top: 0,
						width: '15px',
						height: '100%',
						background: index === items.length - 1 ? '#B79045' : 'gray.200',
						clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
						zIndex: 1,
					}}
				>
					{/* {item.path ? (
						<Link
							as={RouterLink}
							to={item.path}
							color={index === items.length - 1 ? 'white' : 'black'}
							fontWeight={index === items.length - 1 ? 'bold' : 'medium'}
							_hover={{ textDecoration: 'underline' }}
						>
							{item.label}
						</Link>
					) : (
						<Text
							color={index === items.length - 1 ? 'white' : 'black'}
							fontWeight={index === items.length - 1 ? 'bold' : 'medium'}
						>
							{item.label}
						</Text>
					)} */}

					{index !== items.length - 1 && item.path ? (
						<Link
							as={RouterLink}
							to={item.path}
							color='black'
							fontWeight='medium'
							_hover={{ textDecoration: 'underline' }}
						>
							{item.label}
						</Link>
					) : (
						<Text
							color={index === items.length - 1 ? 'white' : 'black'}
							fontWeight={index === items.length - 1 ? 'bold' : 'medium'}
						>
							{item.label}
						</Text>
					)}
				</Box>
			))}
		</Flex>
	);
};

export default Breadcrumb;
