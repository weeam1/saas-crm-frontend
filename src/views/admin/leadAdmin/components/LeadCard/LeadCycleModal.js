import React, { useState, useEffect, memo, useRef } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Box,
	Flex,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';

import { getApi } from 'services/api';
import LeadHistoryTimeline from '../../../leadCycle/components/LeadHistoryTimeline';
import { HSeparator } from 'components/separator/Separator';
import Spinner from 'components/spinner/Spinner';

const LeadCycleModal = memo(({ isOpen, onClose, leadId }) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const user = JSON.parse(localStorage.getItem('user'));
	const hasFetched = useRef(false);

	const fetchData = async () => {
		if (hasFetched.current) return;
		hasFetched.current = true;
		setLoading(true);

		try {
			const response = await getApi(`api/lead/cycle/${leadId}`);
			const responseData = response?.data;

			const timelineData = [];
			let createdByName = 'Unknown';
			if (responseData.lead?.createBy?.firstName) {
				createdByName =
					responseData.lead.createBy.firstName +
					' ' +
					responseData.lead.createBy.lastName;
			}
			timelineData.push({
				type: 'creation',
				updatedAt: new Date(responseData.lead.createdDate)?.toUTCString(),
				updatedBy: createdByName,
				updatedData: '',
			});
			responseData?.data?.forEach((updated) =>
				timelineData.push({
					type: updated.type,
					updatedAt: updated.updatedAt,
					updatedBy: updated.updatedBy?.fullName,
					updatedData: updated.updatedData,
				})
			);

			setData(timelineData);
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong!');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user && user?._id && leadId && isOpen && !hasFetched.current) {
			fetchData();
		}
		return () => {
			if (!isOpen) hasFetched.current = false;
		};
	}, [leadId, isOpen]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='2xl' isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Lead Cycle</ModalHeader>
				<ModalCloseButton />
				<ModalBody overflow='hidden' width='100%'>
					<Box
						width='100%'
						m='0'
						maxH='400px'
						overflowY='auto'
						sx={{
							'&::-webkit-scrollbar': {
								width: '6px',
							},
							'&::-webkit-scrollbar-thumb': {
								background: 'brand.500',
								borderRadius: '8px',
							},
							'&::-webkit-scrollbar-thumb:hover': {
								background: 'brand.600',
							},
						}}
					>
						{loading ? (
							<Flex justifyContent='center' alignItems='center' width='100%'>
								<Spinner />
							</Flex>
						) : (
							<Box>
								<HSeparator />
								<Box mt={5} pl={10}>
									<LeadHistoryTimeline timelineData={data} />
								</Box>
							</Box>
						)}
					</Box>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
});

export default LeadCycleModal;
