import AppButton from 'components/shared/AppButton';
import { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import CreateAgency from './CreateAgency';
import AgencyTable from './AgencyTable';
import { useFetchItemsQuery } from 'api/apiSlice';
import { Box, Button, Grid, Heading, HStack } from '@chakra-ui/react';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import EditAgency from './EditAgency';
import { buttonStyle } from '../lead-v2/components/constants';

const Agency = () => {
	const navigate = useNavigate();
	const [openModal, setOpenModal] = useState(false);
	const [openEditModal, setOpenEditModal] = useState(false);
	const [agency, setAgency] = useState(null);

	const { data, isLoading, refetch } = useFetchItemsQuery(
		{
			path: `/agencies`,
		},
		{ refetchOnMountOrArgChange: true }
	);

	const handleEdit = (data) => {
		setAgency(data);
		setOpenEditModal(true);
	};

	return (
		<div>
			<AppButton
				leftIcon={<IoArrowBack />}
				onClick={() => navigate('/admin-setting')}
			>
				Back
			</AppButton>

			{openModal && (
				<CreateAgency
					isOpen={openModal}
					onClose={() => setOpenModal(false)}
					refreshData={refetch}
					size='lg'
				/>
			)}

			{openEditModal && (
				<EditAgency
					isOpen={openEditModal}
					onClose={() => setOpenEditModal(false)}
					refreshData={refetch}
					data={agency}
					size='lg'
				/>
			)}

			<Box my='2' bg='white' p='4' rounded='md' shadow='sm'>
				<HStack mb='4' justifyContent='space-between' alignItems='center'>
					<Heading size='md' color='gray.800'>
						Agencies
						{data && (
							<span style={{ marginLeft: '6px' }}>
								({<CountUpComponent targetNumber={data?.totalDocs || 0} />})
							</span>
						)}
					</Heading>
					<Button
						{...buttonStyle}
						mt={3}
						bg='brand.500'
						colorScheme='brand'
						onClick={() => setOpenModal(true)}
					>
						Add Agency
					</Button>
				</HStack>
				<AgencyTable
					handleEdit={handleEdit}
					data={data?.doc}
					isLoading={isLoading}
				/>
			</Box>

			{/* grid system */}
			{/* <Grid
				templateColumns={{
					base: '1fr',
					md: 'repeat(2, 1fr)',
				}}
				gap='4'
				mx='auto'
				p='10'
				maxW='800px'
			>
				<Grid
					templateColumns={{
						base: '1fr',
					}}
					gap='4'
				>
					<Box bg='red.200' h='10vh' color='white' p='5'>
						1
					</Box>
					<Box bg='red.200' h='10vh' color='white' p='5'>
						2
					</Box>
					<Box bg='red.200' h='10vh' color='white' p='5'>
						3
					</Box>
				</Grid>
				<Grid
					templateColumns={{
						base: '1fr',
					}}
					gap='4'
				>
					<Box bg='blue.200' h='21.5vh' color='white' p='5'>
						5
					</Box>
					<Box bg='red.200' h='10vh' color='white' p='5'>
						6
					</Box>
				</Grid>
			</Grid> */}
		</div>
	);
};

export default Agency;
