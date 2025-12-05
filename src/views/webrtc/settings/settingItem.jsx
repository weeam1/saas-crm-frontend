import { HStack, Text, VStack } from '@chakra-ui/react';

function SettingItem({ data, onToggleAcc }) {
	return (
		<HStack
			w={'full'}
			display={'flex'}
			marginY={'1.5'}
			border={'1px'}
			bg='gray.100'
			borderColor={'brand.200'}
			justifyContent={'start'}
			borderRadius={'6px'}
			paddingTop={'7px'}
			paddingBottom={'5px'}
			paddingX={'10px'}
			onClick={onToggleAcc}
			_hover={{
				backgroundColor: 'gray.200',
				cursor: 'pointer',
			}}
		>
			<VStack alignItems={'start'}>
				{/* <Text fontWeight={'bold'}>
					{data.decoded.sipDisplayName || data.decoded.sipUsername}
				</Text> */}
				<Text
					fontWeight='semibold'
					fontSize='sm'
				>{`${data.decoded.sipUsername}@${data.decoded.sipDomain}`}</Text>
			</VStack>
		</HStack>
	);
}

export default SettingItem;
