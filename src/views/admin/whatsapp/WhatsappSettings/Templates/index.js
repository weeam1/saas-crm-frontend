import { Box, Button, Flex, Icon, Text, useDisclosure } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useFetchItemsQuery } from 'api/apiSlice';
import { buttonStyle } from 'utils/btn';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import AppButton from 'components/shared/AppButton';
import { FaChevronLeft } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import TemplatesTable from './TemplatesTable';
import Loader from 'components/loading/Loader';
import { useEffect } from 'react';
import { setTemplates } from '../../../../../redux/whatsappSlice';
import { useDispatch } from 'react-redux';

const Templates = () => {
	const { businessId } = useParams();
	const dispatch = useDispatch();

	const {
		data: templates = [],
		isLoading: isTemplatesLoading,
		isFetching: isTemplatesFetching,
		isError,
	} = useFetchItemsQuery(
		{
			path: `/whatsapp/templates`,
			params: { businessId },
		},
		{
			skip: !businessId,
			refetchOnMountOrArgChange: true,
		}
	);

	useEffect(() => {
		if (templates?.doc?.length > 0) {
			dispatch(setTemplates(templates?.doc));
		}
	}, [dispatch, templates?.doc]);

	const navigate = useNavigate();

	if (isError) {
		return (
			<Box bg='red.100' color='red.500' p='6' w='full' m='auto'>
				Something went wrong. please try again letter!
			</Box>
		);
	}
	return isTemplatesLoading ? (
		<Loader />
	) : (
		<>
			<AppButton
				leftIcon={<FaChevronLeft />}
				onClick={() => navigate('/settings/whatsapp_manager')}
				mb='4'
			>
				Back
			</AppButton>
			<Box p={6} bg='white' borderRadius='md' boxShadow='sm'>
				<Flex justify='space-between' align='center' mb={4} flexDir={{base:"column", sm: "column", md:"row"}}>
					<Flex gap='2' fontSize='lg' fontWeight='bold'>
						<Text>Whatsapp Templates</Text>
						<CountUpComponent
							key={templates?.results}
							targetNumber={templates?.results}
						/>
					</Flex>
					<Button
						{...buttonStyle}
						leftIcon={<Icon as={FiPlus} />}
						colorScheme='brand'
						variant='solid'
						size='sm'
						onClick={() =>
							navigate(
								`/settings/whatsapp_manager/message_templates/${businessId}/create_template`
							)
						}
					>
						Create Template
					</Button>
				</Flex>

				{/* {!isTemplatesLoading && (
					<TopPagination
						currentPage={queryParams.page}
						totalPages={templates?.totalPages}
						onPageChange={handlePageChange}
						totalItems={templates?.totalItems}
						itemsPerPage={queryParams.limit}
						refetching={isTemplatesFetching}
						loading={isTemplatesLoading}
						handlePageSize={handlePageSize}
					/>
				)} */}

				<TemplatesTable
					data={templates?.doc}
					isLoading={isTemplatesLoading}
					isFetching={isTemplatesFetching}
				/>
			</Box>
		</>
	);
};

export default Templates;
