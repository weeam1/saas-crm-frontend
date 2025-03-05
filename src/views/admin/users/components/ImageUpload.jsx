// import { useEffect, useState } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import {
// 	Box,
// 	Button,
// 	FormControl,
// 	FormErrorMessage,
// 	IconButton,
// 	Image,
// 	Input,
// } from '@chakra-ui/react';
// import { FaCamera } from 'react-icons/fa';
// import { constant } from 'constant';
// import DefaultUserImage from 'assets/img/avatars/user.jpg';

// const ImageUpload = ({ profileImage, formik }) => {
// 	const [preview, setPreview] = useState(DefaultUserImage);

// 	const handleFileChange = (event) => {
// 		const file = event.currentTarget.files[0];
// 		if (file) {
// 			formik.setFieldValue('profileImage', file);
// 			setPreview(URL.createObjectURL(file));
// 		}
// 	};

// 	useEffect(() => {
// 		if (profileImage && typeof profileImage === 'string') {
// 			setPreview(`${constant['baseUrl']}/${profileImage}`);
// 		}
// 	}, [profileImage]);

// 	return (
// 		<Box textAlign='center' mt={5}>
// 			{/* Profile Image Container */}
// 			<Box
// 				position='relative'
// 				display='inline-block'
// 				w='120px'
// 				h='120px'
// 				borderRadius='full'
// 				overflow='hidden'
// 				boxShadow='lg'
// 			>
// 				<Image
// 					src={preview}
// 					alt='Profile'
// 					w='full'
// 					h='full'
// 					objectFit='cover'
// 				/>

// 				{/* Camera Icon Button */}
// 				<FormControl
// 					isInvalid={formik.errors.profileImage && formik.touched.profileImage}
// 				>
// 					<IconButton
// 						icon={<FaCamera />}
// 						position='absolute'
// 						bottom='2px'
// 						right='35%'
// 						borderRadius='full'
// 						colorScheme='brand'
// 						size='sm'
// 						onClick={() => document.getElementById('imageUpload').click()}
// 					/>
// 					<Input
// 						type='file'
// 						id='imageUpload'
// 						accept='image/png, image/jpeg'
// 						hidden
// 						onChange={handleFileChange}
// 					/>
// 					<FormErrorMessage>{formik.errors.profileImage}</FormErrorMessage>
// 				</FormControl>
// 			</Box>
// 		</Box>
// 	);
// };

// export default ImageUpload;

import { useState, useEffect } from 'react';
import {
	Box,
	FormControl,
	FormErrorMessage,
	IconButton,
	Image,
	Input,
} from '@chakra-ui/react';
import { FaCamera } from 'react-icons/fa';
import DefaultUserImage from 'assets/img/avatars/user.jpg';
import { constant } from 'constant';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

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
			setPreview(`${constant['baseUrl']}${profileImage}`);
		}
	}, []);

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
			<Box
				position='relative'
				display='inline-block'
				w='120px'
				h='120px'
				borderRadius='full'
				overflow='hidden'
				boxShadow='lg'
			>
				<Image
					src={preview}
					alt='Profile'
					w='full'
					h='full'
					objectFit='cover'
				/>
				<FormControl
					isInvalid={formik.errors.profileImage && formik.touched.profileImage}
				>
					<IconButton
						icon={<FaCamera />}
						position='absolute'
						bottom='2px'
						right='35%'
						borderRadius='full'
						colorScheme='brand'
						size='sm'
						onClick={() => document.getElementById('imageUpload').click()}
					/>
					<Input
						type='file'
						id='imageUpload'
						accept='image/png, image/jpeg'
						hidden
						onChange={handleFileChange}
					/>
					<FormErrorMessage>{formik.errors.profileImage}</FormErrorMessage>
				</FormControl>
			</Box>
		</Box>
	);
};

export default ImageUpload;
