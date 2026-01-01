import {
	Grid,
	GridItem,
	Text,
	VStack,
	HStack,
	Badge,
	Box,
} from '@chakra-ui/react';
import { PhoneIcon, EmailIcon, CalendarIcon } from '@chakra-ui/icons';

import {
	FaLocationDot,
	FaFlag,
	FaIdCard,
	FaPassport,
	FaCar,
	FaHouse,
} from 'react-icons/fa6';
import PropTypes from 'prop-types';

const PersonalInfoSection = ({ user }) => {
	const infoItems = [
		{
			label: 'Email',
			value: user.username,
			icon: <EmailIcon color='blue.500' />,
		},
		{
			label: 'Phone',
			value: user.phoneNumber,
			icon: <PhoneIcon color='green.500' />,
		},
		{
			label: 'Location',
			value: user.location,
			icon: <FaLocationDot color='orange' />,
		},
		{
			label: 'Date of Birth',
			value: user.dob ? new Date(user.dob).toLocaleDateString() : 'Not set',
			icon: <CalendarIcon color='purple.500' />,
		},
		{
			label: 'Nationality',
			value: user.nationality || 'Not specified',
			icon: <FaFlag color='teal' />,
		},
		{
			label: 'UAE ID',
			value: user.uaeIdNum || 'Not provided',
			icon: <FaIdCard color='cyan' />,
		},
		{
			label: 'Passport',
			value: user.passportNum || 'Not provided',
			icon: <FaPassport color='red' />,
		},
		{
			label: 'Driving License',
			value: user.drivingLicense || 'Not provided',
			icon: <FaCar color='greenish' />,
		},
	];

	return (
		<Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
			{infoItems.map((item, index) => (
				<GridItem key={index}>
					<HStack align='center' spacing={1}>
						<Box
							bg='gray.50'
							w='36px'
							h='36px'
							display='flex'
							alignItems='center'
							justifyContent='center'
							borderRadius='full'
						>
							{item.icon}
						</Box>

						<VStack align='start' spacing={1}>
							<Text fontSize='sm' color='gray.600' fontWeight='medium'>
								{item.label}
							</Text>
							<Text fontSize='md' fontWeight='normal' color='gray.800'>
								{item.value}
							</Text>
						</VStack>
					</HStack>
				</GridItem>
			))}

			{/* Dubai Address */}
			<GridItem colSpan={{ base: 1, md: 2 }}>
				<HStack align='center' spacing={1}>
					<Box
						bg='gray.100'
						w='36px'
						h='36px'
						display='flex'
						alignItems='center'
						justifyContent='center'
						borderRadius='full'
					>
						<FaLocationDot color='greenish' />
					</Box>
					<VStack spacing={1} align='start' color='gray.600'>
						<Text fontSize='sm' fontWeight='medium'>
							Dubai Address
						</Text>
						<Text fontSize='md' color='gray.800'>
							{user.dubaiHomeAddress || 'Not provided'}
						</Text>
					</VStack>
				</HStack>
			</GridItem>

			{/* Home Country Address */}
			<GridItem colSpan={{ base: 1, md: 2 }}>
				<HStack align='center' spacing={1}>
					<Box
						bg='gray.100'
						w='36px'
						h='36px'
						display='flex'
						alignItems='center'
						justifyContent='center'
						borderRadius='full'
					>
						<FaHouse color='greenish' />
					</Box>
					<VStack spacing={1} align='start' color='gray.600'>
						<Text fontSize='sm' fontWeight='medium'>
							Home Country Address
						</Text>
						<Text fontSize='md' color='gray.800'>
							{user.countryHomeAddress || 'Not provided'}
						</Text>
					</VStack>
				</HStack>
			</GridItem>
		</Grid>
	);
};

PersonalInfoSection.propTypes = {
	user: PropTypes.object.isRequired,
};

export default PersonalInfoSection;
