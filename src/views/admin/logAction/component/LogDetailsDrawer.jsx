import React from 'react';
import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	Flex,
	Text,
	IconButton,
	Stack,
	Divider,
	SimpleGrid,
	Box,
	Badge,
	Icon,
	useColorModeValue,
	HStack,
} from '@chakra-ui/react';
import { FiX, FiUser } from 'react-icons/fi';
import { formatPostDate } from 'utils/helpers';
import DeviceInfoRow from './DeviceInfoRow';
import { toast } from 'react-toastify';

import { CopyIcon } from '@chakra-ui/icons';
import PermissionDisplay from './PermissionDisplay';

const LeadIdDisplay = ({ leadId, type = 'single' }) => {
	const handleCopy = () => {
		navigator.clipboard.writeText(leadId);
		toast.success(`Lead ID ${leadId} copied to clipboard.`);
	};

	if (!leadId) return null;

	return (
		<Box>
			{type === 'single' && (
				<Text fontSize='sm' color='gray.500'>
					Lead ID
				</Text>
			)}
			<HStack
				p={2}
				bg='gray.50'
				borderRadius='md'
				justify='space-between'
				spacing={2}
			>
				<Text fontSize='xs' color='gray.700' noOfLines={1}>
					{leadId}
				</Text>
				<IconButton
					size='sm'
					aria-label='Copy Lead ID'
					icon={<CopyIcon />}
					onClick={handleCopy}
					variant='ghost'
				/>
			</HStack>
		</Box>
	);
};

const LogDetailsDrawer = ({
	isOpen,
	onClose,
	selectedLog,
	grayColors,
	renderSecurityLevel,
	getStatusColor,
}) => {
	const textColor = useColorModeValue(grayColors.text, 'white');
	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const headerBg = useColorModeValue(grayColors.primary, grayColors.darkest);

	if (!selectedLog) return null;

	const isLeadId =
		['Lead', 'Lead_Pool'].includes(selectedLog?.entity) &&
		selectedLog?.rawPayload?.leadId;

	const isBulkLeads =
		selectedLog?.entity === 'Lead' && selectedLog?.rawPayload?.leadIds;

		console.log("selectedLog", selectedLog)
	return (
		<Drawer isOpen={isOpen} placement='right' onClose={onClose} size='lg'>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerHeader bg={headerBg} color='white' py={3}>
					<Flex justify='space-between' align='center'>
						<Text fontSize='md'>Log Details</Text>
						<IconButton
							icon={<FiX />}
							variant='ghost'
							color='white'
							_hover={{ bg: grayColors.dark }}
							onClick={onClose}
							aria-label='Close'
							size='md'
						/>
					</Flex>
				</DrawerHeader>
				<DrawerBody p={4}>
					<Stack spacing={4}>
						<SimpleGrid columns={2} spacing={4}>
							<Box>
								<Text fontSize='sm' color='gray.500'>
									User
								</Text>
								<Text fontWeight='medium' color={textColor} fontSize='xs'>
									<Flex align='center'>
										<Icon as={FiUser} mr={2} color={grayColors.primary} />
										{selectedLog.userName?.charAt(0).toUpperCase() +
											selectedLog.userName?.slice(1).toLowerCase()}
									</Flex>
								</Text>
							</Box>
							<Box>
								<Text fontSize='sm' color='gray.500'>
									Role
								</Text>
								<Text fontWeight='medium' color={textColor} fontSize='xs'>
									{selectedLog.action.replace(/_/g, ' ')}
								</Text>
							</Box>
							<Box>
								<Text fontSize='sm' color='gray.500'>
									Action
								</Text>
								<Text fontWeight='medium' color={textColor} fontSize='xs'>
									{selectedLog.action.replace(/_/g, ' ')}
								</Text>
							</Box>
							<Box>
								<Text fontSize='sm' color='gray.500'>
									Status
								</Text>
								<Badge
									colorScheme={getStatusColor(selectedLog.status)}
									px={2}
									py={0.5}
									borderRadius='full'
									fontSize='xs'
									fontWeight='bold'
								>
									{selectedLog.status}
								</Badge>
							</Box>
							<Box>
								<Text fontSize='sm' color='gray.500'>
									Module
								</Text>
								<Text fontWeight='medium' color={textColor} fontSize='xs'>
									{selectedLog.entity}
								</Text>
							</Box>
							<Box>
								<Text fontSize='sm' color='gray.500'>
									Security Level
								</Text>
								<Flex justifyContent={'flex-start'} mt={1}>
									{renderSecurityLevel(selectedLog.securityLevel)}
								</Flex>
							</Box>
							<Box>
								<Text fontSize='sm' color='gray.500'>
									Timestamp
								</Text>
								<Text fontWeight='medium' color={textColor} fontSize='xs'>
									{formatPostDate(selectedLog.metadata.timestamp)}
								</Text>
							</Box>
						</SimpleGrid>

						<Divider borderColor={borderColor} />

						<Box>
							<Text fontSize='sm' color='gray.500'>
								Message
							</Text>
							<Text
								fontWeight='medium'
								color={textColor}
								p={2}
								bg={'gray.50'}
								borderRadius='md'
								fontSize='xs'
							>
								<Text>{selectedLog.message}</Text>
								<Text>{selectedLog?.rawPayload?.permission && (
									<PermissionDisplay permission={selectedLog?.rawPayload?.permission}/>
								)}</Text>

							</Text>
							{isLeadId ? (
								<LeadIdDisplay leadId={selectedLog?.rawPayload?.leadId} />
							) : isBulkLeads ? (
								<Box py='2'>
									<Text fontSize='sm' mb='2' color='gray.500'>
										Leads ({selectedLog?.rawPayload?.leadIds?.length || 0})
									</Text>
									<Flex
										maxH='20vh'
										overflowY='scroll'
										scrollBehavior='smooth'
										gap='2'
										flexWrap='wrap'
										justifyContent='flex-start'
										alignItems='center'
										bg='softGray.100'
										py='2'
										px='4'
										m='2'
										rounded='md'
									>
										{selectedLog?.rawPayload?.leadIds?.map((leadId) => (
											<LeadIdDisplay leadId={leadId} type='bulk' />
										))}
									</Flex>
								</Box>
							) : null}
						</Box>

						<Divider borderColor={borderColor} />

						<Box>
							<Text
								fontSize='md'
								fontWeight='bold'
								mb={2}
								color={grayColors.primary}
							>
								Metadata
							</Text>
							<SimpleGrid columns={2} spacing={4}>
								<Box>
									<Text fontSize='sm' color='gray.500'>
										IP Address
									</Text>
									<Text fontWeight='medium' color={textColor} fontSize='xs'>
										{selectedLog.metadata.ip}
									</Text>
								</Box>
								<Box>
									<Text fontSize='sm' color='gray.500'>
										City
									</Text>
									<Text fontWeight='medium' color={textColor} fontSize='xs'>
										{selectedLog.metadata.city?.charAt(0).toUpperCase() +
											selectedLog.metadata.city?.slice(1).toLowerCase()}
									</Text>
								</Box>
								<Box>
									<Text fontSize='sm' color='gray.500'>
										Country
									</Text>
									<Text fontWeight='medium' color={textColor} fontSize='xs'>
										{selectedLog.metadata.country?.charAt(0).toUpperCase() +
											selectedLog.metadata.country?.slice(1).toLowerCase()}
									</Text>
								</Box>
							</SimpleGrid>
						</Box>
						<Divider borderColor={borderColor} />
						<Box>
							<Text
								fontSize='md'
								fontWeight='bold'
								mb={2}
								color={grayColors.primary}
							>
								Device Information
							</Text>
							<SimpleGrid columns={2} spacing={4}>
								<DeviceInfoRow
									value={selectedLog.metadata.browser}
									label='Browser'
									iconColor={grayColors.primary}
								/>
								<DeviceInfoRow
									value={selectedLog.metadata.browserVersion}
									label='Browser Version'
								/>
								<DeviceInfoRow
									value={selectedLog.metadata.os}
									label='OS'
									iconColor={grayColors.primary}
								/>
								<DeviceInfoRow
									value={selectedLog.metadata.osVersion}
									label='OS Version'
								/>
								<DeviceInfoRow
									value={selectedLog.metadata.device}
									label='Device'
									iconColor={grayColors.primary}
								/>
							</SimpleGrid>
						</Box>
					</Stack>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default LogDetailsDrawer;
