import AppButton from 'components/shared/AppButton';
import { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import CreateAgency from './CreateAgency';
import AgencyTable from './AgencyTable';
import { useFetchItemsQuery } from 'api/apiSlice';
import { Box, Heading, HStack } from '@chakra-ui/react';
import CountUpComponent from 'components/countUpComponent/countUpComponent';

const Agency = () => {
	const navigate = useNavigate();
	const [openModal, setOpenModal] = useState(false);

	const { data, isLoading, refetch } = useFetchItemsQuery(
		{
			path: `/agencies`,
		},
		{ refetchOnMountOrArgChange: true }
	);

	console.log({ openModal });

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
					size='sm'
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
					<AppButton colorScheme='brand' onClick={() => setOpenModal(true)}>
						Create Agency
					</AppButton>
				</HStack>
				<AgencyTable data={data?.doc} />
			</Box>
		</div>
	);
};

export default Agency;
