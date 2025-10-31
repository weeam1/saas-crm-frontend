import {
	Box,
	Text,
	Flex,
	Icon,
	Divider,
	Stack,
	Modal,
	ModalContent,
	ModalOverlay,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	SimpleGrid,
	GridItem,
	Grid,
	Button,
	useColorModeValue,
} from "@chakra-ui/react";
import {
	FaUserCheck,
	FaUserShield,
	FaUserTag,
	FaUserTie,
	FaUserFriends,
	FaPercentage,
	FaMoneyBillAlt,
} from "react-icons/fa";
import { CheckCircleIcon, TimeIcon } from "@chakra-ui/icons";
import { FiX, FiXCircle } from "react-icons/fi";
import ViewDealInvoice from "./_shared/ViewDealInvoice";
import { useEffect } from "react";
import useUserSession from "hooks/useUserSession";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import { formatPostDate, formatCurrency } from "utils/helpers";

const DealDetailsModal = ({ isOpen, onClose, deal }) => {
	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	// Global modal color palette
	const headerBg = useColorModeValue("brand.300", "brand.100");
	const headerText = useColorModeValue("brand.700", "brand.900");
	const footerBg = useColorModeValue("gray.50", "gray.700");
	const bodyBg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");

	useEffect(() => {
		if (deal) {
			createUserLog({
				userId: user?._id,
				action: "VIEW",
				entity: "Deals",
				enityType: "CloseDeal",
				entityId: deal._id || null,
				status: "success",
				message: `Lead deal "${deal?.lead?.leadName || ""}" viewed by ${user?.fullName}.`,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!deal) return <Text>No Deal found!</Text>;

	const {
		lead,
		agent,
		manager,
		developer,
		salesPerson,
		projectName,
		unitNumber,
		unitType,
		unitPrice,
		downpaymentPaid,
		downpaymentPercent,
		bookingAmountPaid,
		bookingPercent,
		spaDone,
		invoiceSent,
		closedBy,
		commissionStatus,
		dealDate,
		dealStatus,
		currency = "AED",
		isSharedDeal,
		shareUser,
		sharePercent,
	} = deal;

	const PersonCard = ({ title, person, icon }) => {
		if (!person) return null;
		return (
			<Box
				p={3}
				borderRadius="md"
				borderWidth="1px"
				borderColor={borderColor}
				bg={bodyBg}
			>
				<Flex align="center" gap={3}>
					<Icon as={icon} color="brand.500" boxSize={5} />
					<Box>
						<Text fontSize="xs" color="gray.500" mb={1}>
							{title}
						</Text>
						<Text fontWeight="medium">{person.fullName || person}</Text>
					</Box>
				</Flex>
			</Box>
		);
	};

	const StatusIndicator = ({ label, value, positive }) => (
		<Flex
			p={2}
			borderRadius="md"
			bg={positive ? "green.50" : "red.50"}
			borderWidth="1px"
			borderColor={positive ? "green.100" : "red.100"}
			align="center"
			gap={2}
		>
			<Icon
				as={positive ? CheckCircleIcon : FiXCircle}
				color={positive ? "green.500" : "red.500"}
				boxSize={4}
			/>
			<Box>
				<Text fontSize="xs" color="gray.500">
					{label}
				</Text>
				<Text fontSize="sm" fontWeight="medium">
					{value}
				</Text>
			</Box>
		</Flex>
	);

	const SharedDealInfo = () => (
		<Box
			p={4}
			borderRadius="md"
			borderWidth="1px"
			borderColor={borderColor}
			bg={bodyBg}
		>
			<SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
				<Flex align="center" gap={3}>
					<Icon as={FaUserFriends} color="brand.400" boxSize={4} />
					<Box>
						<Text fontSize="xs" color="gray.500">
							Shared With
						</Text>
						<Text fontWeight="medium">
							{shareUser?.fullName || shareUser || "N/A"}
						</Text>
					</Box>
				</Flex>

				<Flex align="center" gap={3}>
					<Icon as={FaPercentage} color="brand.400" boxSize={4} />
					<Box>
						<Text fontSize="xs" color="gray.500">
							Share Percentage
						</Text>
						<Text fontWeight="medium">{sharePercent}%</Text>
					</Box>
				</Flex>

				<Flex align="center" gap={3}>
					<Icon as={FaMoneyBillAlt} color="brand.400" boxSize={4} />
					<Box>
						<Text fontSize="xs" color="gray.500">
							Share Amount
						</Text>
						<Text fontWeight="medium">
							AED {((bookingAmountPaid * sharePercent) / 100).toFixed(2)}
						</Text>
					</Box>
				</Flex>
			</SimpleGrid>
		</Box>
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="6xl"
			isCentered
			scrollBehavior="inside"
			motionPreset="slideInBottom"
		>
			<ModalOverlay backdropFilter="blur(3px)" />
			<ModalContent
				bg={bodyBg}
				borderRadius="2xl"
				shadow="2xl"
				maxW={{ base: "95vw", xl: "1200px" }}
				overflow="hidden"
				mx={{ base: 3, md: 0 }}
			>
				{/* Header */}
				<ModalHeader p={0} borderBottom="1px solid" borderColor={borderColor}>
					<Flex
						bg={headerBg}
						color={headerText}
						px={6}
						py={3}
						position="sticky"
						top="0"
						zIndex="10"
						boxShadow="md"
						align="center"
					>
						<Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
							Deal Details
						</Text>
						<ModalCloseButton
							position="absolute"
							right="12px"
							top="10px"
							color={headerText}
							_hover={{ bg: "whiteAlpha.200" }}
						/>
					</Flex>
				</ModalHeader>

				{/* Body */}
				<ModalBody p={6} borderBottom="1px solid" borderColor={borderColor}>
					<Grid
						templateColumns={{ base: "1fr", md: "1fr 1fr" }}
						gap={{ base: 5, md: 6 }}
					>
						{/* Left Column */}
						<GridItem>
							<Stack spacing={6}>
								{/* Lead Information */}
								<Box>
									<Text fontSize="md" fontWeight="bold" mb={3} color="gray.700">
										Lead Information
									</Text>
									<Box
										p={4}
										borderRadius="md"
										borderWidth="1px"
										borderColor={borderColor}
										bg={bodyBg}
									>
										<Stack spacing={3}>
											<Box>
												<Text fontSize="xs" color="gray.500">
													Client Name
												</Text>
												<Text fontWeight="medium" fontSize="lg">
													{lead?.leadName || "N/A"}
												</Text>
											</Box>
											<Divider />
											<Box>
												<Text fontSize="xs" color="gray.500">
													Client Contact
												</Text>
												<Text fontWeight="medium" fontSize="lg">
													{lead?.leadPhoneNumber || "N/A"}
												</Text>
											</Box>
										</Stack>
									</Box>
								</Box>

								{/* Team */}
								<Box>
									<Text fontSize="md" fontWeight="bold" mb={3} color="gray.700">
										Team
									</Text>
									<SimpleGrid columns={1} spacing={3}>
										{salesPerson && (
											<PersonCard
												title="Sales Person"
												person={salesPerson}
												icon={FaUserTie}
											/>
										)}
										{agent && (
											<PersonCard title="Agent" person={agent} icon={FaUserTag} />
										)}
										{manager && (
											<PersonCard
												title="Manager"
												person={manager}
												icon={FaUserShield}
											/>
										)}
										{closedBy && (
											<PersonCard
												title="Closed By"
												person={closedBy}
												icon={FaUserCheck}
											/>
										)}
									</SimpleGrid>
								</Box>

								{/* Status */}
								<Box>
									<Text fontSize="md" fontWeight="bold" mb={3} color="gray.700">
										Status
									</Text>
									<SimpleGrid columns={2} spacing={3}>
										<StatusIndicator
											label="SPA Status"
											value={spaDone ? "Signed" : "Pending"}
											positive={spaDone}
										/>
										<StatusIndicator
											label="Invoice Sent"
											value={invoiceSent ? "Yes" : "No"}
											positive={invoiceSent}
										/>

										{/* Commission Status */}
										<Flex
											p={2}
											borderRadius="md"
											bg={
												commissionStatus.includes("Fully")
													? "green.50"
													: "gray.50"
											}
											borderWidth="1px"
											borderColor={
												commissionStatus.includes("Fully")
													? "green.100"
													: "gray.100"
											}
											align="center"
											gap={2}
										>
											<Icon
												as={
													commissionStatus === "Not Eligible"
														? FiXCircle
														: commissionStatus.includes("Fully")
														? CheckCircleIcon
														: TimeIcon
												}
												color={
													commissionStatus.includes("Fully")
														? "green.500"
														: "gray.500"
												}
												boxSize={4}
											/>
											<Box>
												<Text fontSize="xs" color="gray.500">
													Commission Status
												</Text>
												<Text fontSize="sm" fontWeight="medium">
													{commissionStatus || "N/A"}
												</Text>
											</Box>
										</Flex>

										{/* Deal Status */}
										<Flex
											p={2}
											borderRadius="md"
											bg={
												dealStatus === "Confirmed"
													? "green.50"
													: "red.50"
											}
											borderWidth="1px"
											borderColor={
												dealStatus === "Confirmed"
													? "green.100"
													: "red.100"
											}
											align="center"
											gap={2}
										>
											<Icon
												as={dealStatus === "Confirmed" ? CheckCircleIcon : FiX}
												color={
													dealStatus === "Confirmed"
														? "green.500"
														: "red.500"
												}
												boxSize={4}
											/>
											<Box>
												<Text fontSize="xs" color="gray.500">
													Deal Status
												</Text>
												<Text fontSize="sm" fontWeight="medium">
													{dealStatus}
												</Text>
											</Box>
										</Flex>
									</SimpleGrid>
								</Box>
							</Stack>
						</GridItem>

						{/* Right Column */}
						<GridItem>
							<Stack spacing={6}>
								{/* Property Details */}
								<Box>
									<Text fontSize="md" fontWeight="bold" mb={3} color="gray.700">
										Property Details
									</Text>
									<Box
										p={4}
										borderRadius="md"
										borderWidth="1px"
										borderColor={borderColor}
										bg={bodyBg}
									>
										<Stack spacing={3}>
											<Box>
												<Text fontSize="xs" color="gray.500">
													Unit Number
												</Text>
												<Text fontWeight="medium">#{unitNumber}</Text>
											</Box>
											<Divider />
											<Box>
												<Text fontSize="xs" color="gray.500">
													Developer
												</Text>
												<Text fontWeight="medium">{developer}</Text>
											</Box>
											<Divider />
											<Box>
												<Text fontSize="xs" color="gray.500">
													Unit Type
												</Text>
												<Text fontWeight="medium">{unitType}</Text>
											</Box>
											<Divider />
											<Box>
												<Text fontSize="xs" color="gray.500">
													Project
												</Text>
												<Text fontWeight="medium">{projectName}</Text>
											</Box>
											<Divider />
											<Box>
												<Text fontSize="xs" color="gray.500">
													Deal Close On
												</Text>
												<Text fontWeight="medium">
													{formatPostDate(dealDate)}
												</Text>
											</Box>
										</Stack>
									</Box>
								</Box>

								{/* Shared Deal */}
								{isSharedDeal && (
									<Box>
										<Text
											fontSize="md"
											fontWeight="bold"
											mb={3}
											color="gray.700"
										>
											Shared Deal
										</Text>
										<SharedDealInfo />
									</Box>
								)}

								{/* Payment Details */}
								<Box>
									<Text fontSize="md" fontWeight="bold" mb={3} color="gray.700">
										Payment Details
									</Text>
									<Box
										p={4}
										borderRadius="md"
										borderWidth="1px"
										borderColor={borderColor}
										bg={bodyBg}
									>
										<Stack spacing={3}>
											<Box>
												<Text fontSize="xs" color="gray.500">
													Unit Price
												</Text>
												<Text fontSize="lg" fontWeight="bold" color="brand.600">
													{formatCurrency(unitPrice, currency)}
												</Text>
											</Box>
											<Divider />
											<SimpleGrid columns={2} spacing={3}>
												<Box>
													<Text fontSize="xs" color="gray.500">
														Downpayment
													</Text>
													<Text fontWeight="medium">
														{formatCurrency(downpaymentPaid, currency)}
													</Text>
													<Text fontSize="xs" color="gray.500">
														({downpaymentPercent}%)
													</Text>
												</Box>
												<Box>
													<Text fontSize="xs" color="gray.500">
														Booking Amount
													</Text>
													<Text fontWeight="medium">
														{formatCurrency(bookingAmountPaid, currency)}
													</Text>
													<Text fontSize="xs" color="gray.500">
														({bookingPercent}%)
													</Text>
												</Box>
											</SimpleGrid>
										</Stack>
									</Box>
								</Box>

								{/* Invoice */}
								<ViewDealInvoice deal={deal} type="button" />
							</Stack>
						</GridItem>
					</Grid>
				</ModalBody>

				{/* Footer */}
				<ModalFooter
					position="sticky"
					bottom="0"
					bg={footerBg}
					borderTop="1px solid"
					borderColor={borderColor}
					py={3}
					px={6}
					justifyContent="flex-end"
				>
					<Button variant="outline" colorScheme="gray" borderRadius="md" onClick={onClose}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default DealDetailsModal;
