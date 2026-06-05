// import { Box, Text, Flex } from '@chakra-ui/react';
// import CountUpComponent from 'components/countUpComponent/countUpComponent';

// const LeadsProgress = ({ totalLeads, userData }) => {
// 	return (
// 		<Box>
// 			<Flex
// 				justify='space-between'
// 				align='center'
// 				mb={1}
// 				flexDirection='row'
// 				flexWrap='wrap'
// 				gap={2}
// 			>
// 				<Text
// 					fontSize={{ base: '15px', md: '22px' }}
// 					fontWeight='medium'
// 					fontFamily="'DM Sans', sans-serif"
// 				>
// 					Leads {totalLeads && <CountUpComponent targetNumber={totalLeads} />}
// 				</Text>

// 				{userData?.coins !== undefined && (
// 					<Text
// 						fontSize={{ base: '15px', md: '22px' }}
// 						fontFamily="'DM Sans', sans-serif"
// 						backgroundColor='#B79045'
// 						textColor='white'
// 						p='3px'
// 						borderRadius='5px'
// 					>
// 						{/* Coins: <CountUpComponent targetNumber={userData?.coins || 0} /> */}
// 						Coins: {userData?.coins || 0}
// 					</Text>
// 				)}
// 			</Flex>
// 		</Box>
// 	);
// };

// export default LeadsProgress;
import { Box, Text, Flex, HStack } from '@chakra-ui/react';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { FaCoins } from 'react-icons/fa';

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
					color='white'
				>
					Leads {totalLeads && <CountUpComponent targetNumber={totalLeads} />}
				</Text>

				{userData?.coins !== undefined && (
					<HStack spacing={2}>
						<FaCoins
							size={24}
							color='#e9be69'
							// color="brand.200"
							style={{
								filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
							}}
						/>
						<Text
							fontSize={{ base: '15px', md: '22px' }}
							fontFamily="'DM Sans', sans-serif"
							fontWeight='medium'
							// color="#9c762d"
						>
							<CountUpComponent targetNumber={userData?.coins || 0} />
						</Text>
					</HStack>
				)}
			</Flex>
		</Box>
	);
};

export default LeadsProgress;
