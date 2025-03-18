import React, { useState, useEffect } from 'react';
import {
	Box,
	Text,
	HStack,
	VStack,
	Button,
	Icon,
	Tooltip,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { formattedDate } from 'utils/helpers';
import CardHeader from './LeadCard/CardHeader';
import InfoPair from './LeadCard/InfoPair';
import InputPair from './LeadCard/InputPair';
import LeadCycleModal from './LeadCard/LeadCycleModal';
import LeadsModal from '../../lead/LeadsModal';
import { leadStatus } from 'utils/options';
class TimelineItem {
	constructor(type, updatedAt, updatedBy, updatedData) {
		this.type = type;
		this.updatedAt = updatedAt;
		this.updatedBy = updatedBy;
		this.updatedData = updatedData;
	}
}
const getLabelByValue = (value) => {
	const status = leadStatus.find((status) => status.value === value);
	return status ? status.label : 'N/A';
};
const LeadCard = ({
	_id,
	intID,
	leadId,
	leadName,
	city,
	nationality,
	sourceContent,
	timetocall,
	eLeadStatus,
	r_u_in_uae,
	leadCampaign,
	leadStatus: leadStatusValue,
	budget,
	approvalStatus,
	createdDate,
	lastNote,
	sendRequest,
	cancelRequest,
	buyLoading,
	refreshData,
}) => {
	const formattedCreatedDate = formattedDate(createdDate);
	const user = JSON.parse(localStorage.getItem('user') || '{}');
	const userId = user?._id;

	const [cancelLoading, setCancelLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [leadsModal, setLeadsModal] = useState({ isOpen: false, lid: null });

	useEffect(() => {
		console.log('leadsModal state updated:', leadsModal);
	}, [leadsModal]);

	const displayButtonText = () => {
		switch (leadStatusValue?.toLowerCase()) {
			case 'pending':
				return 'Buy for 50 coins';
			case 'rejected':
				return 'Rejected';
			case 'new':
				return 'Buy for 300 coins';
			default:
				return 'Buy for 50 coins';
		}
	};

	const handleBuyClick = () => {
		if (leadStatusValue?.toLowerCase() !== 'rejected') {
			sendRequest(_id);
		}
	};

	const handleCancelClick = async () => {
		if (approvalStatus?.toLowerCase() === 'pending' && cancelRequest) {
			setCancelLoading(true);
			try {
				await cancelRequest(_id, leadId || _id, userId);
				setCancelLoading(false);
			} catch (error) {
				console.error('Cancel failed:', error);
				setCancelLoading(false);
			}
		}
	};

	const getStatusStyles = (approvalStatus) => {
		switch (approvalStatus?.toLowerCase()) {
			case 'pending':
				return {
					borderColor: '#FFEB3B',
					buttonBg: '#FFEB3B',
					buttonHoverBg: '#FFB300',
					buttonColor: 'black',
				};
			case 'rejected':
				return {
					borderColor: '#FF3B3B',
					buttonBg: '#FF3B3B',
					buttonHoverBg: '#D32F2F',
					buttonColor: 'white',
				};
			default:
				return {
					borderColor: '#D8D8D9',
					buttonBg: '#34C759',
					buttonHoverBg: '#32BD00',
					buttonColor: 'white',
				};
		}
	};

	const {
		borderColor,
		buttonBg: dynamicButtonBg,
		buttonHoverBg: dynamicButtonHoverBg,
		buttonColor: dynamicButtonColor,
	} = getStatusStyles(approvalStatus);

	const isRejected = approvalStatus?.toLowerCase() === 'rejected';
	const isPending = approvalStatus?.toLowerCase() === 'pending';

	const handleViewLeadCycle = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleLeadsModal = (lid) => {
		console.log('handleLeadsModal called with lid:', lid);
		setLeadsModal({
			isOpen: true,
			lid,
		});
	};

	const renderValue = (value) => {
		if (typeof value === 'object' && value !== null) {
			if (value.hyperlink) {
				return (
					<a
						href={value.hyperlink}
						target='_blank'
						rel='noopener noreferrer'
						style={{ color: '#3182CE', textDecoration: 'underline' }}
					>
						{value.text || 'N/A'}
					</a>
				);
			}
			return value.text || 'N/A';
		}
		return value || 'N/A';
	};

	return (
		<Box
			borderRadius='lg'
			p='3'
			height='320px'
			overflow='hidden'
			_hover={{
				boxShadow: '0 15px 20px -3px #E2E8F0, 0 4px 6px -2px #E2E8F0',
			}}
			transition='box-shadow 0.2s ease-in-out'
			display='flex'
			flexDirection='column'
			border='1px solid'
			borderColor={borderColor}
		>
			<CardHeader
				id={intID}
				onViewLeadCycle={handleViewLeadCycle}
				onViewLead={handleLeadsModal}
				leadId={leadId || _id}
			/>
			<HStack align='start' spacing={1} w='100%' h='calc(100% - 30px)'>
				<VStack align='start' spacing={1} flex='2' minWidth='0' h='100%'>
					<Text fontSize='12px' fontWeight='bold' fontFamily='DM Sans'>
						{renderValue(leadName)}
					</Text>
					<HStack spacing={2} w='100%' flexWrap='wrap'>
						<VStack align='start' spacing={0} flex='1' minW={0}>
							<Text fontSize='xs' color='#C0C0C0' fontFamily='DM Sans'>
								Source Content
							</Text>
							<Text
								fontSize='10px'
								color='#FFBB00'
								fontWeight='bold'
								fontFamily='DM Sans'
							>
								{renderValue(sourceContent)}
							</Text>
						</VStack>
						<VStack align='start' spacing={0} flex='1' minW={0}>
							<Text fontSize='xs' color='#BEBEBE' fontFamily='DM Sans'>
								Time To Call
							</Text>
							<Text
								fontSize='10px'
								color='#32BD00'
								fontWeight='bold'
								fontFamily='DM Sans'
							>
								{renderValue(timetocall)}
							</Text>
						</VStack>
					</HStack>
					<HStack spacing={0.5} w='100%' flexWrap='wrap'>
						<InputPair
							label='M Status'
							width={{ base: '70px', md: '85px', lg: '100px' }}
							value={renderValue(eLeadStatus)}
							bg='#E5B668'
							color='white'
						/>
						<InputPair
							label='Status'
							width={{ base: '70px', md: '85px', lg: '100px' }}
							value={renderValue(getLabelByValue(leadStatusValue))}
							bg='#FEEFEE'
							color='black'
						/>
					</HStack>
					<VStack align='start' spacing={0} width='100%'>
						<HStack>
							<Text fontSize='xs' color='#C1C1C1' fontFamily='DM Sans'>
								Lead Note
							</Text>
							<Tooltip label={renderValue(lastNote)} placement='top' hasArrow>
								<span>
									<Icon
										as={InfoIcon}
										boxSize={3}
										color='#63B3ED'
										cursor='pointer'
									/>
								</span>
							</Tooltip>
						</HStack>
						<Text
							fontSize={lastNote?.length > 100 ? 'xx-small' : 'xs'}
							color='gray.500'
							fontFamily='DM Sans'
						>
							{renderValue(lastNote)}
						</Text>
					</VStack>
					<VStack
						h='auto'
						w='100%'
						align='start'
						justify='center'
						flex='1'
						spacing={0}
					>
						{isPending ? (
							<Button
								bg='red.500'
								color='white'
								size='xs'
								width='100%'
								maxWidth='200px'
								fontFamily='DM Sans'
								borderRadius='5px'
								_hover={{ bg: 'red.600' }}
								onClick={handleCancelClick}
								isLoading={cancelLoading}
								isDisabled={cancelLoading}
							>
								Cancel
							</Button>
						) : isRejected ? (
							<Button
								bg={dynamicButtonBg}
								color={dynamicButtonColor}
								size='xs'
								width='100%'
								maxWidth='200px'
								fontFamily='DM Sans'
								borderRadius='5px'
								_hover={{ bg: dynamicButtonHoverBg }}
								flexShrink={0}
								// isDisabled={true}
							>
								Rejected
							</Button>
						) : (
							<Button
								bg={dynamicButtonBg}
								color={dynamicButtonColor}
								size='xs'
								width='100%'
								maxWidth='200px'
								fontFamily='DM Sans'
								borderRadius='5px'
								_hover={{ bg: dynamicButtonHoverBg }}
								flexShrink={0}
								onClick={handleBuyClick}
								isLoading={buyLoading[_id]}
								isDisabled={buyLoading[_id]}
							>
								{displayButtonText()}
							</Button>
						)}
					</VStack>
				</VStack>
				<VStack
					align='start'
					spacing={2}
					flex='1'
					minWidth='0'
					h='100%'
					ml='15px'
					justify='space-between'
				>
					<VStack align='start' spacing={2} w='100%'>
						<InfoPair
							label='City'
							value={
								<Text fontWeight='bold' fontFamily='DM Sans'>
									{renderValue(city)}
								</Text>
							}
						/>
						<InfoPair
							label='Country'
							value={
								<Text fontWeight='bold' fontFamily='DM Sans'>
									{renderValue(nationality)}
								</Text>
							}
						/>
					</VStack>
					<VStack align='start' spacing={1} w='100%' pl={2}>
						<Text
							fontSize='xs'
							color='#AEBAC9'
							fontWeight='bold'
							fontFamily='DM Sans'
						>
							Info
						</Text>
						{[
							{ label: 'Budget', value: renderValue(budget) },
							{ label: 'Campaign', value: renderValue(leadCampaign) },
							{ label: 'Campaign Url', value: 'N/A' },
							{ label: 'Medium', value: 'N/A' },
							{ label: 'In UAE?', value: renderValue(r_u_in_uae) },
						].map((item) => (
							<HStack
								key={item.label}
								w='100%'
								justify='space-between'
								spacing={0}
								lineHeight='18px'
							>
								<Text
									fontSize='10px'
									color='black'
									fontWeight={500}
									fontFamily='DM Sans'
								>
									{item.label}
								</Text>
								<Tooltip label={item.value} placement='right' hasArrow>
									<Icon
										as={InfoIcon}
										color='blue.300'
										boxSize={3.5}
										cursor='pointer'
									/>
								</Tooltip>
							</HStack>
						))}
					</VStack>
				</VStack>
			</HStack>
			<HStack width='100%' justifyContent='flex-end' mt={1}>
				<Text fontSize='10px' color='#32343D' fontFamily='DM Sans'>
					Lead time: {renderValue(formattedCreatedDate)}
				</Text>
			</HStack>

			{isModalOpen && (
				<LeadCycleModal
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					leadId={leadId || _id}
				/>
			)}

			{leadsModal.isOpen && (
				<LeadsModal
					leadsModal={leadsModal}
					onClose={() => {
						console.log('Closing LeadsModal');
						setLeadsModal({ isOpen: false, lid: null });
					}}
					reFreshData={refreshData}
					isInLeadPool
				/>
			)}
		</Box>
	);
};

export default LeadCard;
