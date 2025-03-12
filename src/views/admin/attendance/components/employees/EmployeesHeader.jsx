import { Box, Heading, Input, Icon } from '@chakra-ui/react';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { CiSearch } from 'react-icons/ci';

const EmployeesHeader = ({ data, searchTerm, setSearchTerm }) => {
	return (
		<Box
			px={{ base: 4, md: 6, lg: 12 }}
			py={4}
			display='flex'
			bg='white'
			borderRadius='md'
			justifyContent='space-between'
			alignItems='center'
			mb={4}
		>
			<Heading fontSize='24px' fontWeight='600'>
				Employees
				{data && (
					<span style={{ marginLeft: '6px' }}>
						({<CountUpComponent targetNumber={data?.totalResults || 0} />})
					</span>
				)}
			</Heading>

			{/* Search Bar */}
			<Box display='flex' alignItems='center'>
				<Box h='30px' w='1px' bg='#E3E3E3' mr={3} />
				<Box
					display='flex'
					alignItems='center'
					bg='#F6F6F6'
					w={{ base: '100%', sm: '287px' }}
					h='36px'
					px={3}
					borderRadius='md'
					border='1px solid #E2E8F0'
				>
					<Icon as={CiSearch} color='gray.500' mr={2} />
					<Input
						variant='unstyled'
						placeholder='Quick Search...'
						w='100%'
						fontSize='14px'
						fontWeight='400'
						color='gray.700'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default EmployeesHeader;
