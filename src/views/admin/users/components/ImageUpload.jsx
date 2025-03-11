import { useState, useEffect } from 'react';
// import DefaultUserImage from 'assets/img/avatars/user.jpg';
import DefaultUserImage from 'assets/logo/logo.png';
import { constant } from 'constant';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import {
	Box,
	Image,
	FormControl,
	FormErrorMessage,
	Input,
	Button,
} from '@chakra-ui/react';

const compressImage = async (file) => {
	const options = {
		maxSizeMB: 0.5,
		maxWidthOrHeight: 800,
		useWebWorker: true,
	};
	return await imageCompression(file, options);
};

const ImageUpload = ({ profileImage, formik }) => {
	const [preview, setPreview] = useState(DefaultUserImage);

	useEffect(() => {
		if (profileImage && typeof profileImage === 'string') {
			const imageUrl = `${constant['baseUrl']}${profileImage}`;

			const img = new window.Image();
			img.src = imageUrl;

			console.log({ imageUrl, img });

			img.onload = () => setPreview(imageUrl);
			img.onerror = () => setPreview(DefaultUserImage);
		} else {
			setPreview(DefaultUserImage);
		}
	}, [profileImage]);

	const handleFileChange = async (event) => {
		const file = event.currentTarget.files[0];

		if (file) {
			const allowedTypes = ['image/png', 'image/jpeg'];
			if (!allowedTypes.includes(file.type)) {
				toast.error('Only PNG and JPEG files are allowed!');
				return;
			}

			try {
				const compressedBlob = await compressImage(file);

				// Convert Blob to File & Retain MIME Type
				const compressedFile = new File([compressedBlob], file.name, {
					type: file.type,
					lastModified: Date.now(),
				});

				formik.setFieldValue('profileImage', compressedFile);
				setPreview(URL.createObjectURL(compressedFile));
			} catch (error) {
				toast.error('Error processing image file!');
			}
		}
	};

	return (
		<Box textAlign='center' mt={5}>
			<Box position='relative' display='inline-block'>
				<Box
					w='140px'
					h='140px'
					borderRadius='full'
					overflow='hidden'
					boxShadow='lg'
					border='4px solid'
					borderColor='gray.200'
					position='relative'
					_hover={{ borderColor: 'gray.300' }}
				>
					<Image
						src={preview || '/default-avatar.png'}
						alt='Profile'
						w='full'
						h='full'
						objectFit='cover'
					/>
				</Box>

				<FormControl
					isInvalid={formik.errors.profileImage && formik.touched.profileImage}
					mt={3}
				>
					<Input
						type='file'
						id='imageUpload'
						accept='image/png, image/jpeg'
						hidden
						onChange={handleFileChange}
					/>
					<Button
						colorScheme='green'
						variant='outline'
						size='sm'
						onClick={() => document.getElementById('imageUpload').click()}
						mt={3}
						borderRadius='full'
						fontWeight='medium'
						_hover={{ bg: 'green.500', color: 'white' }}
					>
						{preview ? 'Change Photo' : 'Upload Photo'}
					</Button>
					<FormErrorMessage>{formik.errors.profileImage}</FormErrorMessage>
				</FormControl>
			</Box>
		</Box>
	);
};

export default ImageUpload;
