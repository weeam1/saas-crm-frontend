import React from 'react';
import EntityField from './EntityField';
import { Flex } from '@chakra-ui/react';
import InfoSection from './InfoSection';
import { useSelector } from 'react-redux';
import { extractLocationData } from 'utils/helpers';

const RightCard = ({ lead, hiddenFields }) => {
	const countries = useSelector((state) => state.countries.countryNames);
	const { city, country } = extractLocationData(lead?.ip, countries);

	return (
		<Flex
			// flex='1'
			minWidth={{ base: '100%', md: 'fit-content' }}
			gap={1}
			flexDirection={{ base: 'row', md: 'column' }}
			// flexGrow='1'
			justifySelf='end'
			// bg='red.400'
			justifyContent='space-between'
			// alignItems={{ base: 'center', md: 'flex-start' }}
			align='flex-start'
			px='2'
		>
			{/* Lead details */}
			<Flex
				// width={{ base: '100%', md: '100%' }}
				// templateColumns={{ base: 'repeat(1, 1fr)', md: '1fr' }}
				// display='flex'
				flexDirection='column'
				// alignItems={{ base: 'flex-start', md: 'start' }}
				// justifyContent='center'
				height='100%'
				gap={2}
				mt={6}
			>
				{!hiddenFields.includes('city') && (
					<EntityField
						label='City'
						value={city}
						valueProps={{ color: '#FF0004' }}
					/>
				)}

				{!hiddenFields.includes('country') && (
					<EntityField
						label='Country'
						value={country}
						valueProps={{ color: '#FF0004' }}
					/>
				)}
			</Flex>

			{/* Info Section with Responsive Width */}
			<Flex
				// width={{ base: '100%', md: '80%' }}
				flexDirection='column'
				// alignItems={{ base: 'center', md: 'flex-end' }}
				gap={2}
				mt={4}
			>
				<InfoSection lead={lead} />
			</Flex>
		</Flex>
	);
};

export default RightCard;
