import { Box, Button, Flex, Text, Select, Input } from '@chakra-ui/react';
import { useModalColors } from 'hooks/useModalColors';

const RulesSection = ({ rules, setRules }) => {
	const colors = useModalColors();

	const handleRuleChange = (index, field, value) => {
		const updatedRules = [...rules];
		updatedRules[index] = { ...updatedRules[index], [field]: value };
		setRules(updatedRules);
	};

	return (
		<Box p={5} borderRadius='lg' w={{ base: '100%', md: '460px' }}>
			<Text fontWeight='600' fontSize={{ base: 'md', md: 'lg' }} mb={4} color={colors.headingText}>
				Agent Rules
			</Text>

			<Box
				borderWidth='1px'
				borderRadius='lg'
				bg={colors.bg}
				p={4}
				border='1px solid'
				borderColor={colors.borderColor}
				h={{ base: 'auto', lg: '320px' }}
				pr='5px'
				boxShadow={colors.cardShadow}
			>
				{rules.map((rule, index) => (
					<Flex
						key={index}
						align={{ base: 'flex-start', md: 'center' }}
						direction={{ base: 'column', md: 'row' }}
						gap={{ base: 2, md: 4 }}
						mb={4}
						justify='flex-start'
					>
						<Text
							minW={{ base: '100%', md: '130px' }}
							maxW={{ base: '100%', md: '130px' }}
							fontWeight='500'
							isTruncated
							fontSize='16px'
							color={colors.bodyText}
						>
							{rule.label}
						</Text>
						<Select
							size='sm'
							value={rule.action}
							onChange={(e) =>
								handleRuleChange(index, 'action', e.target.value)
							}
							w={{ base: '100%', md: '100px' }}
							minW={{ base: '100%', md: '100px' }}
							maxW={{ base: '100%', md: '100px' }}
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							mt={{ base: 0, md: '18px' }}
							fontSize='16px'
							fontWeight='400'
							borderRadius='5px'
							_hover={{ borderColor: colors.accentGold }}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						>
							<option value='Plus' style={{ background: colors.bg, color: colors.headingText }}>Plus</option>
							<option value='Minus' style={{ background: colors.bg, color: colors.headingText }}>Minus</option>
						</Select>

						<Box flexShrink={0}>
							<Text fontSize='16px' fontWeight='400' color={colors.labelColor}>
								Coins
							</Text>
							<Input
								size='sm'
								value={rule.coins}
								onChange={(e) =>
									handleRuleChange(
										index,
										'coins',
										e.target.value === '' ? '' : Number(e.target.value),
									)
								}
								w={{ base: '100%', md: '60px' }}
								minW={{ base: '100%', md: '60px' }}
								maxW={{ base: '100%', md: '60px' }}
								type='number'
								fontSize='16px'
								fontWeight='400'
								borderRadius='5px'
								bg={colors.bgInput}
								borderColor={colors.borderColor}
								color={colors.headingText}
								_hover={{ borderColor: colors.accentGold }}
								_focus={{
									borderColor: colors.accentGold,
									boxShadow: `0 0 0 1px ${colors.accentGold}`,
								}}
							/>
						</Box>

						<Box
							display={rule.label === 'Late Check In' ? 'block' : 'none'}
							flexShrink={0}
						>
							<Text fontSize='16px' fontWeight='400' color={colors.labelColor}>
								Per Min
							</Text>
							<Input
								size='sm'
								value={rule.label === 'Late Check In' ? rule.perMin || '' : ''}
								onChange={(e) =>
									handleRuleChange(index, 'perMin', Number(e.target.value))
								}
								w={{ base: '100%', md: '60px' }}
								minW={{ base: '100%', md: '60px' }}
								maxW={{ base: '100%', md: '60px' }}
								type='number'
								isDisabled={rule.label !== 'Late Check In'}
								fontSize='16px'
								fontWeight='400'
								borderRadius='5px'
								bg={colors.bgInput}
								borderColor={colors.borderColor}
								color={colors.headingText}
								_hover={{ borderColor: colors.accentGold }}
								_focus={{
									borderColor: colors.accentGold,
									boxShadow: `0 0 0 1px ${colors.accentGold}`,
								}}
								_disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
							/>
						</Box>
					</Flex>
				))}
			</Box>
		</Box>
	);
};

export default RulesSection;