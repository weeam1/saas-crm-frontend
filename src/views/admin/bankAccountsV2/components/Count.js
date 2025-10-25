import React from 'react';
import { Text } from '@chakra-ui/react';
import CountUpComponent from 'components/countUpComponent/countUpComponent';

const AccountCount = ({ count }) => {
	const formattedCount = count.toString().padStart(2, '0');

	return (
		<Text
			fontSize={"20px"}
			fontWeight="bold"
			color='#333'
		>
			All Bank Accounts (
			<CountUpComponent targetNumber={Number(formattedCount)} />)
		</Text>
	);
};

export default AccountCount;
