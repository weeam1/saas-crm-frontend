import { useState } from 'react';
import { Box, HStack, Heading, Button, Grid, Icon } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock } from 'react-icons/fa';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import CandidateCard from '../../candidates/components/CandidateCard';
import { useModalColors } from 'hooks/useModalColors';

const MeetingSection = ({ invitedCandidates, refetch, setActiveTab }) => {
	const colors = useModalColors();
	const [isOpen, setIsOpen] = useState(false);

	if (invitedCandidates?.doc?.length === 0) return null;

	return (
		<Box mb={4} marginTop={"-15px"} marginLeft={"-4px"} borderRadius={"0px"}>
			{/* Header Section - Click to Toggle */}
			<HStack
				bg={colors.bg}
				rounded='md'
				shadow={colors.cardShadow}
				p='1rem'
				justifyContent='space-between'
				alignItems='center'
				mb={2}
				cursor='pointer'
				transition='.3s ease-in-out'
				border="1px solid"
				borderColor={colors.borderColor}
				_hover={{ bg: colors.bgInputHover, shadow: colors.modalShadow }}
				onClick={() => setIsOpen((prev) => !prev)}
			>
				<HStack gap={2}>
					<Icon as={FaClock} w={5} h={5} color={colors.accentGold} />
					<Heading size='md' color={colors.headingText}>
						Upcoming Interviews
					</Heading>
				</HStack>

				<HStack gap={2}>
					<Button
						variant='link'
						fontWeight='normal'
						onClick={(e) => {
							e.stopPropagation();
							setActiveTab(1);
							window.scrollBy({
								top: window.innerHeight * 0.8,
								behavior: 'smooth',
							});
						}}
						color={colors.accentGold}
						_hover={{ color: colors.goldLight }}
					>
						View All
					</Button>

					<Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon} w={5} h={5} color={colors.accentGold} />
				</HStack>
			</HStack>

			{/* Meetings Grid with Animation */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
					>
						<Grid
							templateColumns={{
								base: '1fr',
								md: 'repeat(2, 1fr)',
								lg: 'repeat(4, 1fr)',
							}}
							gap={2}
						>
							{invitedCandidates?.doc?.map((candidate) => (
								<CandidateCard
									key={candidate._id}
									candidate={candidate}
									refetch={refetch}
								/>
							))}
						</Grid>
					</motion.div>
				)}
			</AnimatePresence>
		</Box>
	);
};

export default MeetingSection;