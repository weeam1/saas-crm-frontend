import { Box, Text, Flex } from '@chakra-ui/react';
import CountUpComponent from 'components/countUpComponent/countUpComponent';

const LeadsProgress = ({ totalLeads, userData }) => {
	return (
		<Box>
			<Flex
				justify='space-between'
				align='center'
				mb={1}
				flexDirection='row'
				flexWrap='wrap'
				gap={2}
			>
				<Text
					fontSize={{ base: '15px', md: '22px' }}
					fontWeight='medium'
					fontFamily="'DM Sans', sans-serif"
				>
					Leads {totalLeads && <CountUpComponent targetNumber={totalLeads} />}
				</Text>

				{userData?.coins !== undefined && (
					<Text
						fontSize={{ base: '15px', md: '22px' }}
						fontFamily="'DM Sans', sans-serif"
						backgroundColor='#B79045'
						textColor='white'
						p='3px'
						borderRadius='5px'
					>
						{/* Coins: <CountUpComponent targetNumber={userData?.coins || 0} /> */}
						Coins: {userData?.coins || 0}
					</Text>
				)}
			</Flex>
		</Box>
	);
};

export default LeadsProgress;
