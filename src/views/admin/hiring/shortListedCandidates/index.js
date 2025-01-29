import React, { useState } from 'react';
import { Box, Heading, Button } from '@chakra-ui/react';
import InvitedData from './InvitedData';
import ShortListedData from './ShortListedData';

const ShortListedCandidates = () => {
	const [activeTab, setActiveTab] = useState(0);

	return (
		<Box>
			{/* Header */}
			<Box mb={6} bg='white' rounded='md' shadow='sm' p='1rem'>
				<Heading size='md' color='gray.800'>
					Short Listed Candidates
				</Heading>
			</Box>

			{/* Tabs for navigation */}
			<Box>
				{/* Button Navigation for Tabs */}
				<Box display='flex' mb={4}>
					<Button
						onClick={() => setActiveTab(0)}
						colorScheme={activeTab === 0 ? 'brand' : 'gray'}
						bg={activeTab === 0 ? 'brand.500' : 'white'}
						color={activeTab === 0 ? 'white' : 'gray.800'}
						_focus={{ outline: 'none' }}
						mr={4}
						transition='background-color 0.1s ease, color 0.1s ease'
						borderRadius='5px'
						_hover={{
							bg: activeTab === 0 ? 'brand.600' : 'gray.100',
							color: activeTab === 0 ? 'white' : 'gray.800',
						}}
						fontWeight='normal'
					>
						Short Listed
					</Button>
					<Button
						onClick={() => setActiveTab(1)}
						colorScheme={activeTab === 1 ? 'brand' : 'gray'}
						bg={activeTab === 1 ? 'brand.500' : 'white'}
						color={activeTab === 1 ? 'white' : 'gray.800'}
						_focus={{ outline: 'none' }}
						borderRadius='5px'
						transition='background-color 0.1s ease, color 0.1s ease'
						_hover={{
							bg: activeTab === 1 ? 'brand.600' : 'gray.100',
							color: activeTab === 1 ? 'white' : 'gray.800',
						}}
						fontWeight='normal'
					>
						Invited Candidates
					</Button>
				</Box>

				{/* Tab Panels */}
				{activeTab === 0 ? <ShortListedData /> : <InvitedData />}
			</Box>
		</Box>
	);
};

export default ShortListedCandidates;
