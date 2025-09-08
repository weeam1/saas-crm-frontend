import {
	VStack,
	Heading,
	Text,
	Input,
	HStack,
	Button,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Checkbox,
} from '@chakra-ui/react';
import { useState } from 'react';

export function StepLeadSelect() {
	const [search, setSearch] = useState('');

	// mock leads
	const leads = [
		{ id: 1, name: 'John Doe', phone: '+123456789' },
		{ id: 2, name: 'Jane Smith', phone: '+987654321' },
	];

	const filteredLeads = leads.filter((l) =>
		l.name.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<VStack spacing={4} align='start' w='full'>
			<Heading size='md'>Select Leads</Heading>
			<Text>Search and filter leads for your bulk message campaign.</Text>

			<HStack w='full'>
				<Input
					placeholder='Search leads...'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Button colorScheme='teal'>Filter</Button>
			</HStack>

			<Table variant='simple' size='sm'>
				<Thead>
					<Tr>
						<Th>Select</Th>
						<Th>Name</Th>
						<Th>Phone</Th>
					</Tr>
				</Thead>
				<Tbody>
					{filteredLeads.map((lead) => (
						<Tr key={lead.id}>
							<Td>
								<Checkbox />
							</Td>
							<Td>{lead.name}</Td>
							<Td>{lead.phone}</Td>
						</Tr>
					))}
				</Tbody>
			</Table>

			<Button colorScheme='teal'>Confirm & Send</Button>
		</VStack>
	);
}
