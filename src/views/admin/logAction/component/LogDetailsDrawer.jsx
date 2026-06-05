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
	HStack,
} from '@chakra-ui/react';
import { FiX, FiUser } from 'react-icons/fi';
import { formatPostDate } from 'utils/helpers';
import DeviceInfoRow from './DeviceInfoRow';
import { toast } from 'react-toastify';

import { CopyIcon } from '@chakra-ui/icons';
import PermissionDisplay from './PermissionDisplay';
import GeoNavigationButton from './GeoNavigationButton';
import { useModalColors } from 'hooks/useModalColors';

const LeadIdDisplay = ({ leadId, type = 'single' }) => {
	const colors = useModalColors();
	const handleCopy = () => {
		navigator.clipboard.writeText(leadId);
		toast.success(`Lead ID ${leadId} copied to clipboard.`);
	};

	if (!leadId) return null;

	return (
		<Box>
			{type === 'single' && (
				<Text fontSize='sm' color={colors.mutedText}>
					Lead ID
				</Text>
			)}
			<HStack
				p={2}
				bg={colors.bgInput}
				borderRadius='md'
				justify='space-between'
				spacing={2}
				border="1px solid"
				borderColor={colors.borderColor}
			>
				<Text fontSize='xs' color={colors.bodyText} noOfLines={1}>
					{leadId}
				</Text>
				<IconButton
					size='sm'
					aria-label='Copy Lead ID'
					icon={<CopyIcon />}
					onClick={handleCopy}
					variant='ghost'
					color={colors.bodyText}
					_hover={{ color: colors.accentGold, bg: colors.secondaryBtnHoverBg }}
					transition='all 0.2s ease'
				/>
			</HStack>
		</Box>
	);
};

const LogDetailsDrawer = ({
	isOpen,
	onClose,
	selectedLog,
	renderSecurityLevel,
	getStatusColor,
}) => {
	const colors = useModalColors();

	if (!selectedLog) return null;

	const isLeadId =
		['Lead', 'Lead_Pool'].includes(selectedLog?.entity) &&
		selectedLog?.rawPayload?.leadId;

	const isBulkLeads =
		selectedLog?.entity === 'Lead' && selectedLog?.rawPayload?.leadIds;

	console.log('selectedLog', selectedLog);
	return (
		<Drawer isOpen={isOpen} placement='right' onClose={onClose} size='lg'>
			<DrawerOverlay bg={colors.overlayBg} />
			<DrawerContent bg={colors.bg} borderLeft={`1px solid ${colors.borderColor}`}>
				<DrawerHeader bg={colors.bgDeep} color={colors.headingText} py={3}>
					<Flex justify='space-between' align='center'>
						<Text fontSize='md' fontWeight='semibold'>Log Details</Text>
						<IconButton
							icon={<FiX />}
							variant='ghost'
							color={colors.bodyText}
							_hover={{ bg: colors.bgInput, color: colors.accentGold }}
							onClick={onClose}
							aria-label='Close'
							size='md'
							transition='all 0.2s ease'
						/>
					</Flex>
				</DrawerHeader>
				<DrawerBody p={4}>
					<Stack spacing={4}>
						<SimpleGrid columns={2} spacing={4}>
							<Box>
								<Text fontSize='sm' color={colors.mutedText}>
									User
								</Text>
								<Text fontWeight='medium' color={colors.headingText} fontSize='xs'>
									<Flex align='center'>
										<Icon as={FiUser} mr={2} color={colors.accentGold} />
										{selectedLog.userName?.charAt(0).toUpperCase() +
											selectedLog.userName?.slice(1).toLowerCase()}
									</Flex>
								</Text>
							</Box>
							<Box>
								<Text fontSize='sm' color={colors.mutedText}>
									Action
								</Text>
								<Text fontWeight='medium' color={colors.headingText} fontSize='xs'>
									{selectedLog.action.replace(/_/g, ' ')}
								</Text>
							</Box>
							<Box>
								<Text fontSize='sm' color={colors.mutedText}>
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
								<Text fontSize='sm' color={colors.mutedText}>
									Module
								</Text>
								<Text fontWeight='medium' color={colors.headingText} fontSize='xs'>
									{selectedLog.entity}
								</Text>
							</Box>
							<Box>
								<Text fontSize='sm' color={colors.mutedText}>
									Security Level
								</Text>
								<Flex justifyContent={'flex-start'} mt={1}>
									{renderSecurityLevel(selectedLog.securityLevel)}
								</Flex>
							</Box>
							<Box>
								<Text fontSize='sm' color={colors.mutedText}>
									Timestamp
								</Text>
								<Text fontWeight='medium' color={colors.headingText} fontSize='xs'>
									{formatPostDate(selectedLog.metadata.timestamp)}
								</Text>
							</Box>
						</SimpleGrid>

						<Divider borderColor={colors.borderColor} />

						<Box>
							<Text fontSize='sm' color={colors.mutedText}>
								Message
							</Text>
							<Text
								fontWeight='medium'
								color={colors.bodyText}
								p={2}
								bg={colors.bgInput}
								borderRadius='md'
								fontSize='xs'
								border="1px solid"
								borderColor={colors.borderColor}
							>
								<Text>{selectedLog.message}</Text>
								<Text>
									{selectedLog?.rawPayload?.permission && (
										<PermissionDisplay
											permission={selectedLog?.rawPayload?.permission}
										/>
									)}
								</Text>
							</Text>
							{isLeadId ? (
								<LeadIdDisplay leadId={selectedLog?.rawPayload?.leadId} />
							) : isBulkLeads ? (
								<Box py='2'>
									<Text fontSize='sm' mb='2' color={colors.mutedText}>
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
										bg={colors.bgInput}
										py='2'
										px='4'
										m='2'
										rounded='md'
										border="1px solid"
										borderColor={colors.borderColor}
									>
										{selectedLog?.rawPayload?.leadIds?.map((leadId, idx) => (
											<LeadIdDisplay key={idx} leadId={leadId} type='bulk' />
										))}
									</Flex>
								</Box>
							) : null}
						</Box>

						<Divider borderColor={colors.borderColor} />

						<Box>
							<Text
								fontSize='md'
								fontWeight='bold'
								mb={2}
								color={colors.headingText}
							>
								Metadata
							</Text>
							<SimpleGrid columns={2} spacing={4}>
								<Box>
									<Text fontSize='sm' color={colors.mutedText}>
										IP Address
									</Text>
									<Text fontWeight='medium' color={colors.headingText} fontSize='xs'>
										{selectedLog.metadata.ip}
									</Text>
								</Box>
								<Box>
									<Text fontSize='sm' color={colors.mutedText}>
										City
									</Text>
									<Text fontWeight='medium' color={colors.headingText} fontSize='xs'>
										{selectedLog.metadata.city?.charAt(0).toUpperCase() +
											selectedLog.metadata.city?.slice(1).toLowerCase()}
									</Text>
								</Box>
								<Box>
									<Text fontSize='sm' color={colors.mutedText}>
										Country
									</Text>
									<Text fontWeight='medium' color={colors.headingText} fontSize='xs'>
										{selectedLog.metadata.country?.charAt(0).toUpperCase() +
											selectedLog.metadata.country?.slice(1).toLowerCase()}
									</Text>
								</Box>
							</SimpleGrid>

							{selectedLog.metadata?.latitude &&
								selectedLog.metadata?.longitude && (
									<GeoNavigationButton
										latitude={selectedLog.metadata.latitude}
										longitude={selectedLog.metadata.longitude}
									/>
								)}
						</Box>

						<Divider borderColor={colors.borderColor} />

						<Box>
							<Text
								fontSize='md'
								fontWeight='bold'
								mb={2}
								color={colors.headingText}
							>
								Device Information
							</Text>
							<SimpleGrid columns={2} spacing={4}>
								<DeviceInfoRow
									value={selectedLog.metadata.browser}
									label='Browser'
									iconColor={colors.accentGold}
								/>
								<DeviceInfoRow
									value={selectedLog.metadata.browserVersion}
									label='Browser Version'
								/>
								<DeviceInfoRow
									value={selectedLog.metadata.os}
									label='OS'
									iconColor={colors.accentGold}
								/>
								<DeviceInfoRow
									value={selectedLog.metadata.osVersion}
									label='OS Version'
								/>
								<DeviceInfoRow
									value={selectedLog.metadata.device}
									label='Device'
									iconColor={colors.accentGold}
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