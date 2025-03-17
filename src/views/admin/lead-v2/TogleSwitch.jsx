import { Switch, Text, Flex, Icon } from '@chakra-ui/react';
import { FaTable, FaThLarge } from 'react-icons/fa';

const ToggleSwitch = ({ isTableView, handleToggle }) => {
	return (
		<Flex
			align='center'
			bg='white'
			p={3}
			borderRadius='md'
			alignSelf='end'
			boxShadow='sm'
			w='fit-content'
			fontFamily="'DM Sans', sans-serif"
		>
			{/* Cards View */}
			<Flex
				align='center'
				gap={2}
				cursor='pointer'
				onClick={() => !isTableView && handleToggle()}
			>
				<Icon
					as={FaThLarge}
					boxSize={4}
					color={!isTableView ? 'brand.500' : 'gray.500'}
				/>
				<Text
					fontSize='md'
					fontWeight='medium'
					color={!isTableView ? 'brand.600' : 'gray.500'}
				>
					Cards
				</Text>
			</Flex>

			{/* Toggle Switch */}
			<Switch
				colorScheme='brand'
				isChecked={isTableView}
				onChange={handleToggle}
				mx={4}
			/>

			{/* Table View */}
			<Flex
				align='center'
				gap={2}
				cursor='pointer'
				onClick={() => isTableView && handleToggle()}
			>
				<Icon
					as={FaTable}
					boxSize={4}
					color={isTableView ? 'brand.500' : 'gray.500'}
				/>
				<Text
					fontSize='md'
					fontWeight='medium'
					color={isTableView ? 'brand.600' : 'gray.500'}
				>
					Table
				</Text>
			</Flex>
		</Flex>
	);
};

export default ToggleSwitch;
