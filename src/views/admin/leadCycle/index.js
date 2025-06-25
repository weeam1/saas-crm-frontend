import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getApi } from 'services/api';
import { useParams } from 'react-router-dom';
import Card from 'components/card/Card';
import {
	Box,
	CircularProgress,
	Flex,
	Heading,
	Icon,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { HSeparator } from 'components/separator/Separator';
import LeadHistoryTimeline from './components/LeadHistoryTimeline';
import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useStateContext } from 'contexts/store';
import Loader from 'components/loading/Loader';
import CardShimmer from 'components/loading/CardShimmer';
import { FiClock } from 'react-icons/fi';
class TimelineItem {
	constructor(type, updatedAt, updatedBy, updatedData) {
		this.type = type;
		this.updatedAt = updatedAt;
		this.updatedBy = updatedBy;
		this.updatedData = updatedData;
	}
}

const LeadCycle = ({}) => {
	// const params = useParams();

	const [data, setData] = useState([]);
	const [leadName, setLeadName] = useState('');
	const [loading, setLoading] = useState(false);
	// const [] = useState(true);
	const user = JSON.parse(localStorage.getItem('user'));
	const { isLeadCycle, setIsLeadCycle } = useStateContext();

	const fetchData = async () => {
		try {
			console.log('fetching data ');
			setLoading(true);
			const data = await getApi(`api/lead/cycle/${isLeadCycle?.id}`);
			const response = data?.data;
			setLeadName(response.lead.leadName);

			const timelineData = [];
			let createdByName = 'Unknown';
			if (response.lead?.createBy?.fullName) {
				createdByName = response.lead.createBy.fullName;
			}
			const leadCreatedItem = new TimelineItem(
				'creation',
				new Date(response.lead.createdDate)?.toUTCString(),
				createdByName,
				''
			);
			timelineData.push(leadCreatedItem);
			if (response?.data?.length) {
				response?.data?.forEach((updated) => {
					const newCallItem = new TimelineItem(
						updated.type,
						updated.updatedAt,
						updated.updatedBy?.fullName,
						updated.updatedData
					);
					timelineData.push(newCallItem);
				});
			}

			setData(timelineData);
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong!');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user && user?._id && isLeadCycle?.isOpen) {
			fetchData();
		}
	}, [isLeadCycle]);

	return (
		<>
			<Modal
				size='3xl'
				onClose={() => setIsLeadCycle({ isOpen: false, id: null })}
				isOpen={isLeadCycle?.isOpen}
				isCentered
			>
				<ModalOverlay />
				<ModalContent m='2'>
					<ModalHeader>Lead Cycle</ModalHeader>
					<ModalCloseButton _focus={{ outline: 'none' }} />
					<ModalBody overflow='hidden' width='100%'>
						<Box
							width='100%'
							p='2'
							maxH={{ base: '50vh', md: '70vh' }}
							scrollBehavior='smooth'
							overflowY='scroll'
						>
							{loading ? (
								<CardShimmer
									count={6}
									height='100px'
									columns={{ base: 1, sm: 1, md: 1, lg: 1, xl: 1, '2xl': 1 }}
								/>
							) : (
								<>
									{/* <Flex align='center' mb={6}>
										<Icon as={FiClock} color='brand.500' boxSize={6} mr={3} />
										<Box>
											<Text
												fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
												fontWeight='bold'
											>
												Lead Activity Timeline
											</Text>
											<Text color='gray.600' fontSize='sm' mt={1}>
												Complete history for <strong>{leadName}</strong>
											</Text>
										</Box>
									</Flex>
									<HSeparator mb={6} /> */}
									<LeadHistoryTimeline timelineData={data} />
								</>
							)}
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default LeadCycle;
