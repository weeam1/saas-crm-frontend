import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

import { Box, Flex, Text, IconButton, Button } from '@chakra-ui/react';
import { useUpdateItemMutation } from 'api/apiSlice';
import { useReadNotification } from 'hooks/notification/useReadNotification';
import { useModalColors } from 'hooks/useModalColors';

const AnnouncementSlider = ({
	announcements: initialAnnouncements,
	onAcknowledge,
}) => {
	const colors = useModalColors();
	const [announcements, setAnnouncements] = useState(initialAnnouncements);
	const [currentIndex, setCurrentIndex] = useState(0);

	const [updateAnnouncement, { isLoading: isUpdatingAnnouncement }] =
		useUpdateItemMutation();

	const { readNotification } = useReadNotification();

	useEffect(() => {
		if (initialAnnouncements) {
			setAnnouncements(initialAnnouncements);
		}
	}, [initialAnnouncements]);

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % announcements.length);
	};

	const handlePrev = () => {
		setCurrentIndex((prev) =>
			prev === 0 ? announcements.length - 1 : prev - 1,
		);
	};

	const markAnnouncementAsRead = async (id) => {
		try {
			await readNotification(id);
		} catch (error) {
			console.log(error);
		}
	};

	const handleAcknowledge = async () => {
		const currentId = announcements[currentIndex]?.id;
		if (currentId) {
			onAcknowledge(currentId);
			const updatedAnnouncements = announcements.filter(
				(announcement) => announcement.id !== currentId,
			);

			setAnnouncements(updatedAnnouncements);
			if (updatedAnnouncements.length === 0) {
				setCurrentIndex(0);
			} else if (currentIndex >= updatedAnnouncements.length) {
				setCurrentIndex(updatedAnnouncements.length - 1);
			}

			await markAnnouncementAsRead(currentId);
		}
	};

	return (
		<Box
			position='relative'
			textAlign='center'
			bg={colors.bg}
			borderRadius='lg'
			maxW='2xl'
			mx='auto'
		>
			{/* Announcement Content */}
			{announcements.length > 0 ? (
				<Text
					fontSize={{ base: 'xs', md: 'sm', lg: 'lg' }}
					fontWeight='medium'
					textAlign={{ base: 'left', md: 'justify' }}
					mb={6}
					mt={4}
					p={2}
					lineHeight='1.6'
					color={colors.bodyText}
					whiteSpace='pre-line'
				>
					{announcements[currentIndex]?.message}
				</Text>
			) : (
				<Text fontSize='lg' fontWeight='medium' mb={6} color={colors.mutedText} mt={4}>
					No announcements to display.
				</Text>
			)}

			{/* Navigation Buttons */}
			{announcements.length > 1 && (
				<Flex justify='space-between' align='center' position='relative'>
					{/* Previous Button */}
					<IconButton
						icon={<ChevronLeftIcon />}
						onClick={handlePrev}
						aria-label='Previous'
						position='absolute'
						left='-50px'
						top='50%'
						transform='translateY(-50%)'
						size='lg'
						variant='ghost'
						borderRadius='full'
						transition='all 0.3s ease'
						color={colors.bodyText}
						_hover={{
							color: colors.accentGold,
							transform: 'translate(-10px, -50%)',
						}}
					/>

					{/* Next Button */}
					<IconButton
						icon={<ChevronRightIcon />}
						onClick={handleNext}
						aria-label='Next'
						position='absolute'
						right='-50px'
						top='50%'
						transform='translateY(-50%)'
						size='lg'
						variant='ghost'
						borderRadius='full'
						transition='all 0.3s ease'
						color={colors.bodyText}
						_hover={{
							color: colors.accentGold,
							transform: 'translate(10px, -50%)',
						}}
					/>
				</Flex>
			)}

			{/* Acknowledge Button */}
			{announcements.length > 0 && (
				<Button
					mt={6}
					py={4}
					mb={4}
					px={8}
					variant='outline'
					borderWidth='2px'
					borderColor={colors.accentGold}
					color={colors.accentGold}
					borderRadius='lg'
					fontWeight='medium'
					fontSize='sm'
					letterSpacing='wide'
					textTransform='uppercase'
					transition='all 0.2s'
					_hover={{
						bg: colors.bgDeep,
						borderColor: colors.goldLight,
						color: colors.goldLight,
					}}
					_active={{
						bg: colors.bgDeep,
					}}
					onClick={handleAcknowledge}
				>
					✓ Acknowledged
				</Button>
			)}

			{/* Pagination */}
			{announcements.length > 1 && (
				<Text fontSize='sm' color={colors.mutedText}>
					{currentIndex + 1} / {announcements.length}
				</Text>
			)}
		</Box>
	);
};

export default AnnouncementSlider;