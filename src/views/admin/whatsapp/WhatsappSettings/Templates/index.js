import { Box, Button, Flex, Icon, Text, useDisclosure } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useFetchItemsQuery } from 'api/apiSlice';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import AppButton from 'components/shared/AppButton';
import { FaChevronLeft } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import TemplatesTable from './TemplatesTable';
import Loader from 'components/loading/Loader';
import { useEffect } from 'react';
import { setTemplates } from '../../../../../redux/whatsappSlice';
import { useDispatch } from 'react-redux';
import { useModalColors } from 'hooks/useModalColors';

const Templates = () => {
	const colors = useModalColors();
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
			<Box bg={colors.badgeErrorBg} color={colors.badgeErrorText} p='6' w='full' m='auto' borderRadius='lg'>
				Something went wrong. Please try again later!
			</Box>
		);
	}

	return isTemplatesLoading ? (
		<Loader />
	) : (
		<>
			<AppButton
				leftIcon={<FaChevronLeft />}
				onClick={() => navigate(-1)}
				mb='4'
			>
				Back
			</AppButton>
			<Box p={6} bg={colors.bg} borderRadius='lg' boxShadow={colors.cardShadow} border='1px solid' borderColor={colors.borderColor}>
				<Flex
					justify='space-between'
					align='center'
					mb={4}
					flexDir={{ base: 'column', sm: 'column', md: 'row' }}
				>
					<Flex gap='2' fontSize='lg' fontWeight='bold'>
						<Text color={colors.headingText}>Whatsapp Templates</Text>
						<CountUpComponent
							key={templates?.results}
							targetNumber={templates?.results}
						/>
					</Flex>
					<Button
						leftIcon={<Icon as={FiPlus} />}
						variant='brand'
						size='sm'
						onClick={() =>
							navigate(
								`/whatsapp/settings/message_templates/${businessId}/create_template`
							)
						}
					>
						Create Template
					</Button>
				</Flex>

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