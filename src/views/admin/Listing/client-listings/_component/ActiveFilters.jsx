import { Box, Button, Flex, HStack, Text, Badge } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const MotionBadge = motion(Badge);

const ActiveFilters = ({ activeFilters, handleReset }) => {
	return (
		<Box py={2}>
			<AnimatePresence>
				{Object.keys(activeFilters).length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
					>
						<Box
							p={3}
							bg='white'
							borderRadius='lg'
							border='1px'
							borderColor='gray.200'
							boxShadow='sm'
						>
							<HStack justify='space-between' mb={2}>
								<Text fontSize='sm' fontWeight='medium' color='gray.600'>
									Active Filters
								</Text>
								<Button
									size='xs'
									variant='ghost'
									colorScheme='red'
									onClick={handleReset}
									rightIcon={<FiX />}
								>
									Clear All
								</Button>
							</HStack>
							<Flex wrap='wrap' gap={2}>
								{Object.entries(activeFilters).map(([key, value]) => {
									return (
										<MotionBadge
											key={key}
											colorScheme='brand'
											px={3}
											py={1}
											borderRadius='full'
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											exit={{ scale: 0 }}
											textTransform='none'
										>
											<HStack fontSize='sm' spacing={1}>
												<Text textTransform='capitalize'>
													{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
												</Text>
												<Text fontWeight='bold'>{String(value)}</Text>
											</HStack>
										</MotionBadge>
									);
								})}
							</Flex>
						</Box>
					</motion.div>
				)}
			</AnimatePresence>
		</Box>
	);
};

export default ActiveFilters;
