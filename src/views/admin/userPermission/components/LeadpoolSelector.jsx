import { Box, Text, Flex, Switch, Icon } from '@chakra-ui/react';
import {
	MdOutlineAdminPanelSettings,
	MdOutlineGroup,
	MdPeopleOutline,
} from 'react-icons/md';

export default function LeadpoolSelector({ modules, setModules }) {
	const leadPoolModules = modules.filter((m) =>
		m.moduleId.toLowerCase().includes('leadpool'),
	);

	const handleModuleToggle = (moduleId) => {
		setModules((prev) =>
			prev.map((m) => {
				if (!m.moduleId.toLowerCase().includes('leadpool')) return m;

				if (m.moduleId === moduleId) {
					// if already true, turn it off → allows disabling
					return { ...m, isModuleEnabled: !m.isModuleEnabled };
				}
				// all others off
				return { ...m, isModuleEnabled: false };
			}),
		);
	};

	return (
		<Box
			mb='6'
			bg='bg.elevated'
			rounded='md'
			p='6'
			borderWidth='1px'
			borderColor='gold.400'
			boxShadow='base'
			fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
		>
			{/* <Flex align='center' justify='space-between' mb={4}>
				<Text color='gray.600'>Enable Leadpool modules</Text>
				<Switch
					colorScheme='green'
					isChecked={leadpoolEnabled}
					onChange={(e) => toggleLeadpool(e.target.checked)}
				/>
			</Flex> */}
			<Flex align='center' mb={4}>
				<Icon as={MdOutlineGroup} w={6} h={6} color='orange.500' mr={2} />
				<Text fontWeight='semibold' color='orange.500'>
					Leadpool Access
				</Text>
			</Flex>

			<Text color='text.muted' mb={4} fontSize='sm'>
				Select one leadpool access type (only one can be active at a time)
			</Text>

			<Flex direction={{ base: 'column', md: 'column' }} gap='4' w='full'>
				{leadPoolModules.map((module) => (
					<Box
						key={module.moduleId}
						borderWidth='1px'
						borderRadius='md'
						w='full'
						p={4}
						// bg={module.isModuleEnabled ? 'green.50' : 'white'}
						// borderColor={module.isModuleEnabled ? 'green.400' : 'gray.200'}
						transition='all 0.2s ease-in-out'
					>
						<Flex align='center' justify='space-between'>
							<Text
								color='orange.500'
								// fontSize='md'
								fontWeight='semibold'
								display='flex'
								gap={2}
								flexDir='row'
								align='center'
							>
								<Icon
									as={
										module.moduleId === 'leadpool_agents'
											? MdPeopleOutline
											: MdOutlineAdminPanelSettings
									}
									width='20px'
									height='20px'
									color='inherit'
								/>
								{module.moduleName}
							</Text>
							<Switch
								colorScheme='brand'
								isChecked={module.isModuleEnabled}
								onChange={() => handleModuleToggle(module.moduleId)}
							/>
						</Flex>
					</Box>
				))}
			</Flex>
		</Box>
	);
}
