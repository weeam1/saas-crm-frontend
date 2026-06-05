
import React, { useState } from 'react';
import EntityField from './EntityField';
import { Button, Flex } from '@chakra-ui/react';
import InfoSection from './InfoSection';
import { useSelector } from 'react-redux';
import { extractLocationData } from 'utils/helpers';
import { FaEye } from 'react-icons/fa';

const RightCard = ({ lead, hiddenFields, setViewLead }) => {
	const countries = useSelector((state) => state.countries.list);
	const { city, country } = extractLocationData(lead?.ip);

	return (
		<>
			<Flex
				minWidth={{ base: '100%', md: 'fit-content' }}
				gap={1}
				flexDirection={{ base: 'row', md: 'column' }}
				justifySelf='end'
				justifyContent='space-between'
				align='flex-start'
				px='2'
			>
				{/* Lead details */}
				<Flex
					flexDirection='column'
					height='100%'
					gap={2}
					mt={6}
				>
					{!hiddenFields.includes('city') && (
						<EntityField
							label='City'
							value={city}
							valueProps={{ color: 'text.body' }}
							isInfo
						/>
					)}

					{!hiddenFields.includes('country') && (
						<EntityField
							label='Country'
							value={country}
							valueProps={{ color: 'text.body' }}
							countries={countries}
							isInfo
						/>
					)}
				</Flex>

				{/* Info Section with Responsive Width */}
				<Flex
					flexDirection='column'
					gap={2}
					justifyContent='flex-start'
					mt={4}
				>
					<InfoSection lead={lead} />
					<Button
						variant='outline'
						fontSize={{ base: '10px', md: '12px' }}
						leftIcon={<FaEye size='10' />}
						h='5'
						color='text.body'
						bg='transparent'
						fontWeight='500'
						_hover={{ bg: 'bg.elevated', color: 'text.accent' }}
						_active={{ bg: 'bg.elevated' }}
						transition='all 0.2s ease-in-out'
						py='1'
						px='2'
						border='1px solid'
						borderColor='border.default'
						borderRadius='md'
						shadow='sm'
						mb='1'
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