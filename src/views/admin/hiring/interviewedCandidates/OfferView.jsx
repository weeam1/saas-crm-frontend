import { Button, Box, Text, Heading, Flex } from '@chakra-ui/react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';

const OfferView = () => {
	const navigate = useNavigate();

	const { id } = useParams();
	const {
		data: interview,
		isLoading,
		isSuccess,
	} = useFetchItemsQuery(
		{
			path: `/interviews/${id}`,
		},
		{ refetchOnMountOrArgChange: true }
	);

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	useEffect(() => {
		if (isSuccess) {
			createUserLog({
				userId: user?._id,
				action: 'VIEW',
				entity: 'Hiring',
				entityType: 'Interview',
				entityId: id,
				status: 'success',
				message: `Offer letter for ${interview.doc.candidate?.name} viewed by ${user?.fullName}.`,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess]);

	return isLoading ? (
		<Loader />
	) : interview ? (
		<Box>
			<Button
				colorScheme='gray'
				borderRadius='5px'
				size={{ base: 'sm', md: 'md' }}
				px={{ base: 4, md: 6 }}
				py={{ base: 2, md: 3 }}
				fontSize={{ base: 'sm', md: 'md' }}
				leftIcon={<IoArrowBack />}
				onClick={() => navigate('/hiring?tab=interviewed-candidates')}
				mb={4}
			>
				Back
			</Button>
			<Box bg='white' p={8} mb={4} rounded='md' shadow='sm'>
				<Flex
					borderBottom='1px'
					py='2'
					justifyContent='space-between'
					alignItems='center'
					mb={4}
				>
					<Text
						fontSize={{ base: 'md', md: 'lg', lg: '2xl' }}
						fontWeight='bold'
					>
						Offer Letter
					</Text>

					<Button
						bg='#EDC270'
						color='gray.800'
						fontSize={{ base: 'sm', md: 'md' }}
						fontWeight='normal'
						shadow='sm'
						rounded='md'
						_hover={{ bg: '#E0B960' }}
						_active={{ bg: '#D4AC50' }}
						onClick={() =>
							navigate(
								`/hiring/interviewed-candidates/offer-letter/${interview?.doc?._id}?type=edit`
							)
						}
					>
						Edit Offer
					</Button>
				</Flex>

				<Box>
					<Box
						dangerouslySetInnerHTML={{ __html: interview?.doc?.offerMail }}
					/>
				</Box>
			</Box>
		</Box>
	) : (
		<Text>Offer details not found!</Text>
	);
};

export default OfferView;
