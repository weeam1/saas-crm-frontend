import { VStack, Heading, Text, Select, Button } from '@chakra-ui/react';

export function StepAccountSelect() {
	return (
		<VStack spacing={4} align='start'>
			<Heading size='md'>Choose WhatsApp Account</Heading>
			<Text>Select the WhatsApp account you want to send messages from.</Text>

			<Select placeholder='Select WhatsApp Account'>
				<option value='account1'>Account 1</option>
				<option value='account2'>Account 2</option>
			</Select>

			<Button colorScheme='teal'>Confirm & Continue</Button>
		</VStack>
	);
}
