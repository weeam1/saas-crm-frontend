import { Flex, Text, Link, Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const BreadCrumb = ({ items }) => {
	return (
		<Flex
			align='center'
			wrap='wrap'
			gap={2}
			py={3}
			fontSize={{ base: 'sm', md: 'md' }}
			color='gray.200'
			aria-label='Breadcrumb'
		>
			{items.map((item, index) => (
				<Flex key={index} align='center'>
					{index > 0 && (
						<Icon
							as={FiChevronRight}
							mx={1}
							color='gray.400'
							boxSize={4}
							aria-hidden='true'
						/>
					)}

					{item.path ? (
						<Link
							as={RouterLink}
							to={item.path}
							color={index === items.length - 1 ? 'gray.200' : 'gray.300'}
							fontWeight={index === items.length - 1 ? 'semibold' : 'normal'}
							_hover={{
								color: 'gray.400',
								textDecoration: 'none',
							}}
							transition='color 0.2s'
							aria-current={index === items.length - 1 ? 'page' : undefined}
						>
							{item.label}
						</Link>
					) : (
						<Text
							color={index === items.length - 1 ? 'brand.500' : 'gray.600'}
							fontWeight={index === items.length - 1 ? 'semibold' : 'normal'}
							aria-current={index === items.length - 1 ? 'page' : undefined}
						>
							{item.label}
						</Text>
					)}
				</Flex>
			))}
		</Flex>
	);
};

export default BreadCrumb;
