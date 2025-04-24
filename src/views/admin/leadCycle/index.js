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

	console.log('LOADING STATUS: ', loading);

	const fetchData = async () => {
		try {
			console.log('fetching data ');
			setLoading(true);
			const data = await getApi(`api/lead/cycle/${isLeadCycle?.id}`);
			const response = data?.data;
			setLeadName(response.lead.leadName);

			const timelineData = [];
			let createdByName = 'Unknown';
			if (response.lead?.createBy?.firstName) {
				createdByName =
					response.lead.createBy.firstName +
					' ' +
					response.lead.createBy.lastName;
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
						updated.updatedBy?.firstName + ' ' + updated.updatedBy?.lastName,
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
				size='2xl'
				onClose={() => setIsLeadCycle({ isOpen: false, id: null })}
				isOpen={isLeadCycle?.isOpen}
				isCentered
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Lead Cycle</ModalHeader>
					<ModalCloseButton />
					<ModalBody overflow='hidden' width='100%'>
						<Box
							width='100%'
							m='0'
							background='brand'
							maxH='400px' // Set max height for the modal body
							overflowY='auto' // Enable vertical scrolling when content exceeds max height
							sx={{
								'&::-webkit-scrollbar': {
									width: '6px', // Custom scrollbar width
								},
								'&::-webkit-scrollbar-thumb': {
									background: 'brand.500', // Custom brand color (adjust according to your theme)
									borderRadius: '8px',
								},
								'&::-webkit-scrollbar-thumb:hover': {
									background: 'brand.600', // Slightly darker on hover
								},
							}}
						>
							{loading ? (
								<Loader />
							) : (
								<div>
									{/* <Heading size="lg" mb={4}>
                    Lead Cycle for <small>{leadName}</small>
                  </Heading> */}
									<HSeparator />
									<Box mt={5} pl={10}>
										<LeadHistoryTimeline timelineData={data} />
									</Box>
								</div>
							)}
						</Box>
					</ModalBody>
					<ModalFooter></ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default LeadCycle;
