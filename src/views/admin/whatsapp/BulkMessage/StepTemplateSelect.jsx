import { VStack, Heading, Text, Select, Button } from '@chakra-ui/react';

export function StepTemplateSelect() {
	return (
		<VStack spacing={4} align='start'>
			<Heading size='md'>Select WhatsApp Template</Heading>
			<Text>Pick a pre-approved WhatsApp template to send bulk messages.</Text>

			<Select placeholder='Select Template'>
				<option value='welcome'>Welcome Template</option>
				<option value='promo'>Promotion Template</option>
			</Select>

			<Button colorScheme='teal'>Confirm & Continue</Button>
		</VStack>
	);
}
