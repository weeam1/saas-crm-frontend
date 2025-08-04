import {
	Box,
	Heading,
	Text,
	Grid,
	GridItem,
	useBreakpointValue,
	VStack,
	HStack,
	IconButton,
	useClipboard,
	Icon,
} from '@chakra-ui/react';
import { HSeparator } from 'components/separator/Separator';
import { useEffect, useState } from 'react';
import { getApi } from 'services/api';
import { extractLocationData } from 'utils/helpers';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { mainLeadStatusLabels } from 'utils/searchLabels';
import { leadStatusLabels } from 'utils/searchLabels';
import CardShimmer from 'components/loading/CardShimmer';
import NoData from 'components/Message/NoData';
import { format } from 'date-fns';
import { CopyIcon } from '@chakra-ui/icons';
import { InfoIcon } from '@chakra-ui/icons';

import CustomTooltip from 'components/shared/CustomTooltip';
import { leadIconSize } from './components/constants';

const LeadDetails = ({ leadId, reFreshData, isInLeadPool }) => {
	const user = JSON.parse(localStorage.getItem('user'));
	const countries = useSelector((state) => state.countries.countryNames);


	const [data, setData] = useState();
	const [leadIp, setLeadIp] = useState({
		ip: '',
		city: '',
		country: '',
	});

	const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
      setIsLoading(true);
      let response = await getApi("api/lead/view/", leadId);
      setData(response.data?.lead);

      const { ip, city, country } = extractLocationData(
        response?.data?.lead?.ip,
        countries
      );
      setLeadIp({ ip, city, country });
      setIsLoading(false);

  };

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [searchParams] = useSearchParams();

	let hideContact = false;

	if (user?.roles[0]?.roleName === 'Manager') {
		hideContact = true;
	} else if (
		searchParams.get('invite') &&
		user?.roles[0]?.roleName !== 'superAdmin'
	) {
		hideContact = user?._id !== data?.agentAssigned;
	}

	const responsiveCols = useBreakpointValue({ base: 1, sm: 1, md: 2, lg: 2 });
	const sectionColSpan = useBreakpointValue({ base: 1, sm: 1, md: 1, lg: 1 });

	if (isLoading) {
		return (
			<VStack gap='2' width='100%'>
				<CardShimmer
					count={4}
					height='200px'
					columns={{ base: 1, sm: 1, md: 2, lg: 2, xl: 2, '2xl': 2 }}
				/>
				<CardShimmer
					count={1}
					height='100px'
					width={{ base: 'full' }}
					columns={{ base: 1, sm: 1, md: 1, lg: 1, xl: 1, '2xl': 1 }}
				/>
			</VStack>
		);
	}

	if (!data) {
		<Box>
			<NoData label='lead detals' />
		</Box>;
	}

	const formatValue = (value) => {
		if (!value) return 'N/A';

		return typeof value === 'object' ? value.result || value.text : value;
	};

	return (
		<Grid
			templateColumns={{
				base: 'repeat(1,1fr)',
				sm: 'repeat(1, 1fr)',
				md: 'repeat(1,1fr)',
			}}
			gap={2}
		>
			{/* Basic Information Section */}
			<GridItem colSpan={{ base: 1, sm: 1, md: 2 }}>
				<SectionCard title='Basic Information'>
					<DetailGrid>
						<DetailItem label='Lead Name' value={data?.leadName} />
						{(user?.role === 'superAdmin' ||
							(!hideContact && !isInLeadPool)) && (
							<>
								<DetailItem label='Email' value={data?.leadEmail} />
								<DetailItem
									label='Phone'
									value={formatValue(data?.leadPhoneNumber)}
								/>
								<DetailItem
									label='WhatsApp'
									value={formatValue(data?.leadWhatsappNumber)}
								/>
							</>
						)}
						<DetailItem label='Address' value={data?.leadAddress} />
					</DetailGrid>
				</SectionCard>
			</GridItem>

			{/* Status & Timeline Section */}
			<GridItem colSpan={sectionColSpan}>
				<SectionCard title='Status & Timeline'>
					<DetailGrid>
						<DetailItem
							label='Status'
							value={
								data?.leadStatus ? leadStatusLabels[data?.leadStatus] : 'N/A'
							}
						/>
						<DetailItem
							label='Main Status'
							value={
								data?.eLeadStatus
									? mainLeadStatusLabels[data?.eLeadStatus]
									: 'N/A'
							}
						/>
						<DetailItem
							label='Follow-up Status'
							value={data?.leadFollowUpStatus}
						/>
						<DetailItem
							label='Created Date'
							value={
								data?.createdDate
									? format(new Date(data?.createdDate), 'd MMM, yyyy h:mm a')
									: 'N/A'
							}
						/>
						{/* <DetailItem
							label='Assigned Agent'
							value={data?.leadAssignedAgent}
						/> */}
					</DetailGrid>
				</SectionCard>
			</GridItem>

			{/* Source & Tracking Section */}
			<GridItem colSpan={sectionColSpan}>
				<SectionCard title='Source & Tracking'>
					<DetailGrid>
						<DetailItem label='Source' value={data?.leadSource} />
						<DetailItem
							label='Channel'
							value={data?.leadSourceChannel || data?.leadSourceMedium}
						/>
						<DetailItem label='Campaign' value={data?.leadCampaign} />
						<DetailItem label='Adset' value={data?.adset} />
						<DetailItem
							label='Source Content'
							value={data?.leadSourceDetails}
						/>
						<DetailItem
							label='Page URL'
							value={data?.pageUrl}
							isLink={Boolean(data?.pageUrl)}
						/>
					</DetailGrid>
				</SectionCard>
			</GridItem>

			{/* Additional Details Section */}
			<GridItem colSpan={sectionColSpan}>
				<SectionCard title='Additional Details'>
					<DetailGrid>
						<DetailItem label='Nationality' value={data?.nationality} />
						<DetailItem label='Preferred Time' value={data?.timetocall} />
						<DetailItem label='In UAE?' value={formatValue(data?.r_u_in_uae)} />
						<DetailItem label='Interest' value={data?.interest} />
						<DetailItem label='Language' value={data?.leadLang} />
					</DetailGrid>
				</SectionCard>
			</GridItem>

			{/* Technical Details Section */}
			<GridItem colSpan={2}>
				<SectionCard title='Technical Details'>
					<DetailGrid>
						<DetailItem
							label='City'
							value={leadIp?.city}
							textTransform='capitalize'
						/>
						<DetailItem
							label='Country'
							value={leadIp?.country}
							textTransform='capitalize'
						/>
						{/* {!['Agent'].includes(user?.roles[0]?.roleName) && (
							<DetailItem label='IP Address' value={data?.ip} />
						)} */}
					</DetailGrid>
				</SectionCard>
			</GridItem>
		</Grid>
	);
};

const SectionCard = ({ title, children }) => (
	<Box
		p={2}
		rounded='lg'
		shadow='md'
		bg='gray.100'
		borderWidth='1px'
		borderColor='gray.100'
		height='100%'
	>
		<Heading size='xs' mb={1} color='gray.700' fontWeight='500'>
			{title}
		</Heading>
		<HSeparator mb='1' />
		{children}
	</Box>
);

const DetailGrid = ({ children }) => (
	<Grid
		templateColumns={{
			base: 'repeat(1,1fr)',
			sm: 'repeat(1, 1fr)',
			md: 'repeat(2,1fr)',
		}}
		gap={4}
	>
		{children}
	</Grid>
);

const DetailItem = ({ label, value, isLink = false, ...props }) => {
	const { hasCopied, onCopy } = useClipboard(value || '');
	return (
		<Box>
			<Text fontSize='xs' color='gray.500' fontWeight='500' mb={1}>
				{label}
			</Text>
			{isLink && value !== 'N/A' ? (
				<HStack>
					<Text
						color='blue.400'
						isTruncated
						fontWeight='500'
						maxWidth='200px'
						{...props}
						fontSize={'xs'}
					>
						<a href={value} target='_blank' rel='noreferrer'>
							{value}
						</a>
					</Text>

					<CustomTooltip label={value || 'N/A'}>
						<Icon
							as={InfoIcon}
							boxSize={leadIconSize}
							color='blue.300'
							cursor='pointer'
						/>
					</CustomTooltip>
				</HStack>
			) : (
				<Text
					fontSize='xs'
					color='gray.800'
					fontWeight='500'
					isTruncated
					{...props}
				>
					{value || 'N/A'}
				</Text>
			)}
		</Box>
	);
};

export default LeadDetails;
