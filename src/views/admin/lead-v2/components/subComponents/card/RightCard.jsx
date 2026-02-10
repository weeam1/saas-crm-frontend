import React, { useState } from 'react';
import EntityField from './EntityField';
import { Button, Flex } from '@chakra-ui/react';
import InfoSection from './InfoSection';
import { useSelector } from 'react-redux';
import { extractLocationData } from 'utils/helpers';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { FaEye } from 'react-icons/fa';

const RightCard = ({ lead, hiddenFields, setViewLead }) => {
	const countries = useSelector((state) => state.countries.list);
	const { city, country } = extractLocationData(lead?.ip);

	return (
		<>
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
							isInfo
						/>
					)}

					{!hiddenFields.includes('country') && (
						<EntityField
							label='Country'
							value={country}
							valueProps={{ color: '#FF0004' }}
							countries={countries}
							isInfo
						/>
					)}
				</Flex>

				{/* Info Section with Responsive Width */}
				<Flex
					// width={{ base: '100%', md: '80%' }}
					flexDirection='column'
					// alignItems={{ base: 'center', md: 'flex-end' }}
					gap={2}
					justifyContent='flex-start'
					mt={4}
				>
					<InfoSection lead={lead} />
					<Button
						variant='solid'
						fontSize={{ base: '10px', md: '12px' }}
						leftIcon={<FaEye size='10' />}
						h='6'
						color='gray.600'
						bg='cyan.100'
						fontWeight='500'
						_hover={{ bg: 'cyan.200' }}
						_active={{ bg: 'cyan.300' }}
						transition='all 0.2s ease-in-out'
						py='1'
						px='2'
						borderRadius='full'
						onClick={() =>
							setViewLead({
								isOpen: true,
								lid: lead?._id,
								tab: 'qualification',
							})
						}
					>
						Qualification
					</Button>
				</Flex>
			</Flex>
		</>
	);
};

export default RightCard;
