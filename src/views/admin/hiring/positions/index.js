import React, { useState } from 'react';
import PositionForm from './PositionForm';
import { Box, Button, Flex, Icon } from '@chakra-ui/react';
import { IoAdd, IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import PositionsList from './PositionsList';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';

const Positions = () => {
	const [mode, setMode] = useState('create');
	const [viewForm, setViewForm] = useState(false);
	const [initialData, setInitialData] = useState({});

	const {
		data: positions,
		isLoading: positionsLoading,
		refetch,
	} = useFetchItemsQuery(
		{
			path: `/positions`,
		},
		{ refetchOnMountOrArgChange: true }
	);

	const navigate = useNavigate();

	const handleEdit = (position) => {
		setMode('edit');
		setInitialData({});
		setInitialData(position);

		setViewForm(true);
	};

	return positionsLoading ? (
		<Loader />
	) : (
		<Box>
			<Flex justifyContent='flex-end' alignItems='center'>
				{/* <Button
					colorScheme='gray'
					borderRadius='5px'
					size={{ base: 'sm', md: 'md' }}
					px={{ base: 4, md: 6 }}
					py={{ base: 2, md: 3 }}
					fontSize={{ base: 'sm', md: 'md' }}
					leftIcon={<Icon as={IoArrowBack} boxSize={4} />}
					onClick={() => navigate('/hiring')}
					mb={4}
				>
					Back
				</Button> */}
				<Button
					colorScheme='brand'
					borderRadius='md'
					size={"md"}
					px={{ base: 4, md: 6 }}
					py={{ base: 2, md: 3 }}
					leftIcon={<Icon as={IoAdd} boxSize={4} />}
					onClick={() => setViewForm(true)}
					mb={4}
				>
					Add Position
				</Button>
			</Flex>

			{viewForm && (
				<PositionForm
					setViewForm={setViewForm}
					initialData={initialData}
					mode={mode}
					refetch={refetch}
					setMode={setMode}
				/>
			)}
			<PositionsList positions={positions} onEdit={handleEdit} />
		</Box>
	);
};

export default Positions;
