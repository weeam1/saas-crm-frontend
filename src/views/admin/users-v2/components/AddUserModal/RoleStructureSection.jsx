import { Box, Heading, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import {
	FaDollarSign,
	FaPercent,
	FaAward,
	FaUserAltSlash,
} from 'react-icons/fa';
import FormField from './FormField';
import { getSalaryType } from 'schema/userSchema';
import { useRoles } from 'hooks/user/userRoles';
import { useTeamStructure } from 'hooks/user/useTeamStructure';

const RoleStructureSection = ({ formik }) => {
	const { roles } = useRoles();
	const { team: managers, getTeamLeadsByManager } = useTeamStructure();

	const role = roles?.find((role) => role?._id === formik.values?.roles);

	const teamLeaders = getTeamLeadsByManager(formik.values?.parent);

	return (
		<Box bg='gray.50' borderRadius='lg' p={5} mb={6}>
			<Flex align='center' gap={2} mb={4}>
				<FaUserAltSlash color='#B79045' />
				<Heading size='sm' color='gray.700'>
					Role & Reporting Structure
				</Heading>
			</Flex>

			<SimpleGrid mt={4} columns={{ base: 1, lg: 2 }} spacing={4}>
				<FormField
					label='Role'
					name='roles'
					icon={<FaDollarSign size={14} />}
					formik={formik}
					isRequired
					placeholder='Select Role'
					as='select'
					options={roles?.map((role) => {
						return {
							label: role?.roleName,
							value: role?._id,
						};
					})}
				/>

				{['Agent', 'Team Leader'].includes(role?.roleName) && (
					<FormField
						label='Manager'
						name='parent'
						formik={formik}
						isRequired={true}
						as='select'
						placeholder='Select Manager'
						options={managers?.map((manager) => {
							return {
								value: manager?._id,
								label: manager?.fullName,
							};
						})}
					/>
				)}
				{['Agent'].includes(role?.roleName) && (
					<FormField
						label='Team Leader'
						name='teamLead'
						formik={formik}
						isRequired={true}
						as='select'
						placeholder='Select Team Leader'
						options={teamLeaders?.map((tl) => {
							return {
								value: tl?._id,
								label: tl?.fullName,
							};
						})}
					/>
				)}
			</SimpleGrid>
		</Box>
	);
};

export default RoleStructureSection;
