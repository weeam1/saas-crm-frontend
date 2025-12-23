import { useEffect, useState, useCallback } from 'react';
import {
	Box,
	Badge,
	HStack,
	VStack,
	Text,
	Icon,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
	FaChevronLeft,
	FaChevronRight,
	FaImage,
	FaTimes,
} from 'react-icons/fa';
import { getImageUrl } from '../propertyUtils';

import FALLBACK_IMAGE from 'assets/logo/logo_2.png';

const MotionBox = motion(Box);
const MotionImage = motion('img');

/**
 * @param {string[]} images
 * @param {string} projectName
 * @param {(url: string) => string} getImageUrl
 */
const ImageSlider = ({
	images = [],
	projectName = '',
	sliderHeight = '250px',
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isOpen, setIsOpen] = useState(false);

	const hasImages = Array.isArray(images) && images.length > 0;
	const hasMultiple = images.length > 1;

	const nextImage = useCallback(() => {
		setCurrentIndex((i) => (i + 1) % images.length);
	}, [images.length]);

	const prevImage = useCallback(() => {
		setCurrentIndex((i) => (i - 1 + images.length) % images.length);
	}, [images.length]);

	const goToImage = (index) => setCurrentIndex(index);
	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);

	// Keyboard controls (fullscreen only)
	useEffect(() => {
		if (!isOpen) return;

		const handler = (e) => {
			if (e.key === 'ArrowRight') nextImage();
			if (e.key === 'ArrowLeft') prevImage();
			if (e.key === 'Escape') close();
		};

		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [isOpen, nextImage, prevImage]);

	// Empty state
	if (!hasImages) {
		return (
			<Box
				h='250px'
				bg='gray.100'
				borderRadius='lg'
				display='flex'
				alignItems='center'
				justifyContent='center'
			>
				<VStack spacing={2}>
					<Icon as={FaImage} boxSize={10} color='gray.400' />
					<Text fontSize='sm' color='gray.500'>
						No images available
					</Text>
				</VStack>
			</Box>
		);
	}

	return (
		<>
			{/* ---------- Preview Slider ---------- */}
			<Box
				position='relative'
				h={sliderHeight}
				borderRadius='lg'
				overflow='hidden'
				cursor='zoom-in'
			>
				<AnimatePresence mode='wait'>
					<MotionImage
						key={currentIndex}
						src={getImageUrl(images[currentIndex])}
						alt={`${projectName} image ${currentIndex + 1}`}
						style={{ width: '100%', height: '100%', objectFit: 'cover' }}
						onClick={open}
						initial={{ opacity: 0, scale: 1.04 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.96 }}
						transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
						onError={(e) => {
							// prevent infinite loop
							if (e.currentTarget.src !== FALLBACK_IMAGE) {
								e.currentTarget.src = FALLBACK_IMAGE;
							}
						}}
					/>
				</AnimatePresence>

				{hasMultiple && (
					<>
						{/* Arrows */}
						<NavArrow left onClick={prevImage} />
						<NavArrow onClick={nextImage} />

						{/* Dots */}
						<HStack
							position='absolute'
							bottom='3'
							left='50%'
							transform='translateX(-50%)'
							spacing={1}
						>
							{images.map((_, i) => (
								<Box
									key={i}
									w='2'
									h='2'
									bg={i === currentIndex ? 'white' : 'whiteAlpha.500'}
									borderRadius='full'
									cursor='pointer'
									onClick={() => goToImage(i)}
								/>
							))}
						</HStack>
					</>
				)}

				{/* Count */}
				{hasMultiple && (
					<Badge
						position='absolute'
						right='3'
						bottom='3'
						bg='blackAlpha.600'
						color='white'
						rounded='full'
						fontSize='xs'
					>
						{currentIndex + 1} / {images.length}
					</Badge>
				)}
			</Box>

			{/* ---------- Fullscreen Lightbox ---------- */}
			<Modal isOpen={isOpen} onClose={close} size='full'>
				<ModalOverlay bg='blackAlpha.900' />
				<ModalContent bg='transparent' overflow='hidden' m='4'>
					<ModalBody p={0} onClick={close}>
						<Box
							w='95vw'
							h='95vh'
							m='auto'
							position='relative'
							onClick={(e) => e.stopPropagation()} // prevent close when clicking image
						>
							<AnimatePresence mode='wait'>
								<MotionImage
									key={currentIndex}
									src={getImageUrl(images[currentIndex])}
									alt=''
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'contain',
									}}
									initial={{ opacity: 0, scale: 0.97 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 1.03 }}
									transition={{ duration: 0.35 }}
									onError={(e) => {
										// prevent infinite loop
										if (e.currentTarget.src !== FALLBACK_IMAGE) {
											e.currentTarget.src = FALLBACK_IMAGE;
										}
									}}
								/>
							</AnimatePresence>

							{/* Close */}
							<Box
								position='absolute'
								top='5'
								right='5'
								color='white'
								cursor='pointer'
								onClick={close}
							>
								<FaTimes size={22} />
							</Box>

							{hasMultiple && (
								<>
									<FullscreenArrow left onClick={prevImage} />
									<FullscreenArrow onClick={nextImage} />

									{/* Dots */}
									<HStack
										position='absolute'
										bottom='3'
										left='50%'
										transform='translateX(-50%)'
										spacing={1}
									>
										{images.map((_, i) => (
											<Box
												key={i}
												w='2'
												h='2'
												bg={i === currentIndex ? 'white' : 'whiteAlpha.500'}
												borderRadius='full'
												cursor='pointer'
												onClick={() => goToImage(i)}
											/>
										))}
									</HStack>
								</>
							)}
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ImageSlider;

/* ---------- Helpers ---------- */

const NavArrow = ({ left, onClick }) => (
	<MotionBox
		position='absolute'
		top='50%'
		transform='translateY(-50%)'
		left={left ? '3' : undefined}
		right={!left ? '3' : undefined}
		w='36px'
		h='36px'
		bg='blackAlpha.500'
		color='white'
		borderRadius='full'
		display='flex'
		alignItems='center'
		justifyContent='center'
		cursor='pointer'
		onClick={onClick}
		_hover={{ background: 'blackAlpha.600' }}
		// whileHover={{ scale: 1.1 }}
	>
		<Icon as={left ? FaChevronLeft : FaChevronRight} />
	</MotionBox>
);

const FullscreenArrow = ({ left, onClick }) => (
	<Box
		position='absolute'
		top='50%'
		transform='translateY(-50%)'
		left={left ? '6' : undefined}
		right={!left ? '6' : undefined}
		color='white'
		cursor='pointer'
		onClick={onClick}
	>
		<Icon as={left ? FaChevronLeft : FaChevronRight} boxSize={8} />
	</Box>
);
