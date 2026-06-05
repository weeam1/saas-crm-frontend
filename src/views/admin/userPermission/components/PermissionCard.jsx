import React from 'react';
import {
	Box,
	Flex,
	Text,
	Switch,
	Checkbox,
	Divider,
	SimpleGrid,
} from '@chakra-ui/react';
import PermissionIcon from './PermissionIcon';
import { useModalColors } from 'hooks/useModalColors';

const PermissionCard = ({
	module,
	moduleIndex,
	borderColor,
	disabledBorderColor,
	disabledTextColor,
	handleModuleToggle,
	handleSelectAll,
	handleActionToggle,
}) => {
	const colors = useModalColors();
	const cleanModuleName = module.moduleName.replace(/^[\s,]+/, '').trim();

	return (
		<Box
			borderWidth='1px'
			borderRadius='md'
			borderColor={colors.borderColor}
			bg={colors.bg}
			w='full'
			p={4}
			boxShadow={colors.cardShadow}
			transition='all 0.2s ease'
			_hover={{
				borderColor: colors.accentGold,
				boxShadow: colors.modalShadow,
			}}
		>
			{/* Module title and Check All */}
			<Flex
				justify='space-between'
				align='center'
				mb={2}
				flexWrap='wrap'
				gap={2}
			>
				<Box
					fontWeight='bold'
					fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
					display='flex'
					gap={2}
					alignItems='center'
					color={colors.accentGold}
				>
					<PermissionIcon moduleName={cleanModuleName} />

					<Text color={colors.accentGold} fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>
						{cleanModuleName}
					</Text>
				</Box>
				<Switch
					colorScheme='yellow'
					size='md'
					isChecked={module.isModuleEnabled}
					onChange={(e) => handleModuleToggle(moduleIndex, e.target.checked)}
					_focus={{ boxShadow: 'none' }}
					_active={{ boxShadow: 'none' }}
				/>
			</Flex>
			{module?.actions.length > 0 && <Divider my={3} borderColor={colors.borderColor} />}

			<Flex justify='flex-end' mb={2} mt={'-2px'}>
				{module?.actions.length > 0 && (
					<Checkbox
						size='md'
						colorScheme='yellow'
						borderColor={
							module.isModuleEnabled ? colors.accentGold : colors.borderColor
						}
						_focus={{ boxShadow: 'none' }}
						_active={{ boxShadow: 'none' }}
						_hover={{
							borderColor: module.isModuleEnabled
								? colors.accentGold
								: colors.borderColor,
						}}
						isChecked={
							module?.actions.length > 0
								? module.actions.every((a) => a.isAllowed)
								: false
						}
						onChange={(e) => handleSelectAll(moduleIndex, e.target.checked)}
						isDisabled={!module.isModuleEnabled}
						sx={{
							'& .chakra-checkbox__control': {
								borderColor: !module.isModuleEnabled
									? colors.borderColor
									: colors.borderColor,
								outline: 'none',
							},
							'.chakra-checkbox__control': {
								_focus: {
									boxShadow: `0 0 0 2px ${colors.accentGold}`,
									borderColor: colors.accentGold,
									outline: 'none',
								},
							},
						}}
					>
						<Text
							color={!module.isModuleEnabled ? colors.mutedText : colors.headingText}
						>
							Check All
						</Text>
					</Checkbox>
				)}
			</Flex>

			{/* Actions Grid */}
			<SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} flex='1'>
				{module.actions.map((action, actionIndex) => (
					<Box key={action.actionKey} width='fit-content'>
						<Checkbox
							key={action.actionKey}
							size='lg'
							colorScheme='yellow'
							borderColor={
								module.isModuleEnabled ? colors.accentGold : colors.borderColor
							}
							_focus={{ boxShadow: 'none' }}
							_active={{ boxShadow: 'none' }}
							_hover={{
								borderColor: module.isModuleEnabled
									? colors.accentGold
									: colors.borderColor,
							}}
							isChecked={action.isAllowed}
							onChange={() => handleActionToggle(moduleIndex, actionIndex)}
							isDisabled={!module.isModuleEnabled}
							sx={{
								'& .chakra-checkbox__control': {
									borderColor: !module.isModuleEnabled
										? colors.borderColor
										: colors.borderColor,
									outline: 'none',
								},
								'.chakra-checkbox__control': {
									_focus: {
										boxShadow: `0 0 0 2px ${colors.accentGold}`,
										borderColor: colors.accentGold,
										outline: 'none',
									},
								},
							}}
						>
							<Text
								fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
								color={!module.isModuleEnabled ? colors.mutedText : colors.bodyText}
							>
								{action.name}
							</Text>
						</Checkbox>
					</Box>
				))}
			</SimpleGrid>
		</Box>
	);
};

export default PermissionCard;