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
import { useModalColors } from 'hooks/useModalColors';

const PersonalInfoSection = ({ user }) => {
	const colors = useModalColors();

	const infoItems = [
		{
			label: 'Email',
			value: user.username,
			icon: <EmailIcon color={colors.accentGold} />,
		},
		{
			label: 'Phone',
			value: user.phoneNumber,
			icon: <PhoneIcon color={colors.accentGold} />,
		},
		{
			label: 'Location',
			value: user.location,
			icon: <FaLocationDot color={colors.accentGold} />,
		},
		{
			label: 'Date of Birth',
			value: user.dob ? new Date(user.dob).toLocaleDateString() : 'Not set',
			icon: <CalendarIcon color={colors.accentGold} />,
		},
		{
			label: 'Nationality',
			value: user.nationality || 'Not specified',
			icon: <FaFlag color={colors.accentGold} />,
		},
		{
			label: 'UAE ID',
			value: user.uaeIdNum || 'Not provided',
			icon: <FaIdCard color={colors.accentGold} />,
		},
		{
			label: 'Passport',
			value: user.passportNum || 'Not provided',
			icon: <FaPassport color={colors.accentGold} />,
		},
		{
			label: 'Driving License',
			value: user.drivingLicense || 'Not provided',
			icon: <FaCar color={colors.accentGold} />,
		},
	];

	return (
		<Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
			{infoItems.map((item, index) => (
				<GridItem key={index}>
					<HStack align='center' spacing={3}>
						<Box
							bg={colors.bgInput}
							w='36px'
							h='36px'
							display='flex'
							alignItems='center'
							justifyContent='center'
							borderRadius='full'
							border="1px solid"
							borderColor={colors.borderColor}
						>
							{item.icon}
						</Box>

						<VStack align='start' spacing={0}>
							<Text fontSize='sm' color={colors.mutedText} fontWeight='medium'>
								{item.label}
							</Text>
							<Text fontSize='md' fontWeight='normal' color={colors.headingText}>
								{item.value || 'N/A'}
							</Text>
						</VStack>
					</HStack>
				</GridItem>
			))}

			{/* Dubai Address */}
			<GridItem colSpan={{ base: 1, md: 2 }}>
				<HStack align='center' spacing={3}>
					<Box
						bg={colors.bgInput}
						w='36px'
						h='36px'
						display='flex'
						alignItems='center'
						justifyContent='center'
						borderRadius='full'
						border="1px solid"
						borderColor={colors.borderColor}
					>
						<FaLocationDot color={colors.accentGold} />
					</Box>
					<VStack spacing={0} align='start'>
						<Text fontSize='sm' fontWeight='medium' color={colors.mutedText}>
							Dubai Address
						</Text>
						<Text fontSize='md' color={colors.headingText}>
							{user.dubaiHomeAddress || 'Not provided'}
						</Text>
					</VStack>
				</HStack>
			</GridItem>

			{/* Home Country Address */}
			<GridItem colSpan={{ base: 1, md: 2 }}>
				<HStack align='center' spacing={3}>
					<Box
						bg={colors.bgInput}
						w='36px'
						h='36px'
						display='flex'
						alignItems='center'
						justifyContent='center'
						borderRadius='full'
						border="1px solid"
						borderColor={colors.borderColor}
					>
						<FaHouse color={colors.accentGold} />
					</Box>
					<VStack spacing={0} align='start'>
						<Text fontSize='sm' fontWeight='medium' color={colors.mutedText}>
							Home Country Address
						</Text>
						<Text fontSize='md' color={colors.headingText}>
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