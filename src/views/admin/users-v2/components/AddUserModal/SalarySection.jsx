import React from 'react';
import { Box, Heading, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { FaDollarSign, FaPercent, FaAward } from 'react-icons/fa';
import FormField from './FormField';
import { getSalaryType } from 'schema/userSchema';
import { salaryTypes, userCommissionTypes } from 'utils/options';

const SalarySection = ({ formik }) => {
	const selectedSalaryType = formik.values.salaryType || salaryTypes[0]?.value;

	const config = getSalaryType(selectedSalaryType);

	// if (!selectedSalaryType) {
	// 	return (
	// 		<Box bg='gray.50' borderRadius='lg' p={5} mb={6}>
	// 			<Flex align='center' gap={2} mb={4}>
	// 				<FaDollarSign color='#B79045' />
	// 				<Heading size='sm' color='gray.700'>
	// 					Salary Details
	// 				</Heading>
	// 			</Flex>
	// 			<Text color='gray.500' fontSize='sm' textAlign='center' py={4}>
	// 				Select a salary type to configure salary details
	// 			</Text>
	// 		</Box>
	// 	);
	// }

	return (
		<Box bg='gray.50' borderRadius='lg' p={5} mb={6}>
			<Flex align='center' gap={2} mb={4}>
				<FaDollarSign color='#B79045' />
				<Heading size='sm' color='gray.700'>
					Salary Details
				</Heading>
			</Flex>

			<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
				<FormField
					label='Salary Type'
					name='salaryType'
					icon={<FaDollarSign size={14} />}
					formik={formik}
					isRequired
					as='select'
					options={salaryTypes}
					onChange={(e) => {
						formik.handleChange(e);
						// Reset dependent fields when salary type changes
						const type = getSalaryType(e.target.value);
						if (!type?.hasBaseSalary) formik.setFieldValue('salary', '');
						if (!type?.hasCommission) formik.setFieldValue('commission', '');
						if (!type?.hasIncentive) formik.setFieldValue('incentive', '');
					}}
				/>

				{config?.hasBaseSalary && (
					<FormField
						label='Base Salary'
						name='salary'
						type='number'
						icon={<FaDollarSign size={14} />}
						formik={formik}
						isRequired={config?.hasBaseSalary}
						placeholder='0.00'
					/>
				)}

				{config?.hasCommission && (
					<FormField
						label='Commission %'
						name='commission'
						type='number'
						icon={<FaPercent size={14} />}
						formik={formik}
						isRequired={config?.hasCommission}
						placeholder='0'
						min={0}
						max={100}
					/>
				)}

				{config?.hasIncentive && (
					<FormField
						label='Incentive Amount'
						name='incentive'
						type='number'
						icon={<FaAward size={14} />}
						formik={formik}
						isRequired={config?.hasIncentive}
						placeholder='0.00'
					/>
				)}
			</SimpleGrid>

			<Box mt={4}>
				<FormField
					label='Commission Type'
					name='commissionType'
					formik={formik}
					as='select'
					options={userCommissionTypes}
				/>
			</Box>
		</Box>
	);
};

export default SalarySection;
