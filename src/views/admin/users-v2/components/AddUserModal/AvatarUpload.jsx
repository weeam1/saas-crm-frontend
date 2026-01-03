import { useEffect, useRef, useState } from 'react';
import {
	Box,
	Image,
	FormControl,
	FormErrorMessage,
	Input,
	Button,
	Spinner,
	Text,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import DefaultUserImage from 'assets/logo/logo.png';
import { getImageUrl } from 'views/admin/Listing/client-listings/propertyUtils';

const compressImage = async (file) => {
	return imageCompression(file, {
		maxSizeMB: 0.5,
		maxWidthOrHeight: 800,
		useWebWorker: true,
	});
};

const AvatarUpload = ({ profileImage, formik }) => {
	const [preview, setPreview] = useState(DefaultUserImage);
	const [isLoading, setIsLoading] = useState(false);
	const fileInputRef = useRef(null);

	// Load existing image (edit mode)
	useEffect(() => {
		if (typeof profileImage === 'string') {
			const url = getImageUrl(profileImage);
			setPreview(url);
		}
	}, [profileImage]);

	const handleFileChange = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const allowedTypes = ['image/jpeg', 'image/png'];
		if (!allowedTypes.includes(file.type)) {
			toast.error('Only JPG and PNG images are allowed');
			return;
		}

		setIsLoading(true);

		try {
			const compressed = await compressImage(file);
			const compressedFile = new File([compressed], file.name, {
				type: file.type,
				lastModified: Date.now(),
			});

			// Set Formik value
			formik.setFieldValue('profileImage', compressedFile);

			// Preview
			const objectUrl = URL.createObjectURL(compressedFile);
			setPreview(objectUrl);

			// Cleanup
			return () => URL.revokeObjectURL(objectUrl);
		} catch (err) {
			console.error(err);
			toast.error('Image upload failed');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Box textAlign='center' mt={6}>
			<Box position='relative' display='inline-block'>
				<Box
					w='150px'
					h='150px'
					borderRadius='full'
					overflow='hidden'
					border='3px solid'
					borderColor='gray.200'
					_hover={{ borderColor: 'green.400' }}
					transition='border-color 0.2s'
				>
					{isLoading && (
						<Box
							position='absolute'
							inset='0'
							bg='blackAlpha.600'
							display='flex'
							alignItems='center'
							justifyContent='center'
							zIndex={1}
						>
							<Spinner color='white' />
						</Box>
					)}

					<Image
						src={preview}
						alt='Profile image'
						w='full'
						h='full'
						objectFit='cover'
					/>
				</Box>

				<FormControl
					isInvalid={
						formik.touched.profileImage && Boolean(formik.errors.profileImage)
					}
					mt={4}
				>
					<Input
						ref={fileInputRef}
						type='file'
						accept='image/png, image/jpeg'
						display='none'
						onChange={handleFileChange}
					/>

					<Button
						size='sm'
						variant='outline'
						colorScheme='green'
						borderRadius='full'
						onClick={() => fileInputRef.current?.click()}
						isLoading={isLoading}
						loadingText='Uploading'
					>
						{preview === DefaultUserImage ? 'Upload Photo' : 'Change Photo'}
					</Button>

					<Text fontSize='xs' color='gray.500' mt={2}>
						JPG or PNG • Max 500KB
					</Text>

					<FormErrorMessage>{formik.errors.profileImage}</FormErrorMessage>
				</FormControl>
			</Box>
		</Box>
	);
};

export default AvatarUpload;
