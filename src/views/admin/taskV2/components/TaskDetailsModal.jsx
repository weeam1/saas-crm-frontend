// import React from "react";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   FormControl,
//   FormLabel,
//   Input,
//   Textarea,
//   VStack,
//   Flex,
//   Button,
//   Badge,
//   Text,
//   useColorModeValue,
// } from "@chakra-ui/react";
// import { format } from "date-fns";

// // Priority and status color maps
// const priorityColors = {
//   Low: "green",
//   Medium: "yellow",
//   High: "orange",
//   Urgent: "red",
// };

// const statusColors = {
//   Pending: "yellow",
//   "In Progress": "blue",
//   Completed: "green",
//   Overdue: "red",
// };

// const TaskDetailsModal = ({ isOpen, onClose, task }) => {

//   const headerBg = useColorModeValue("brand.300", "brand.100");
//   const headerText = useColorModeValue("brand.700", "brand.900");
//   const footerBg = useColorModeValue("gray.50", "gray.700");
//   const borderColor = useColorModeValue("gray.200", "gray.600");
//   const bgColor = useColorModeValue("white", "gray.800");
//   const inputBg = useColorModeValue("gray.50", "gray.700");

//   if (!task) return null;

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
//       <ModalOverlay />
//       <ModalContent
//         mx={{ base: 3, sm: 6 }}
//         borderRadius="2xl"
//         shadow="2xl"
//         bg={bgColor}
//         maxH="85vh"
//         overflow="hidden"
//         display="flex"
//         flexDirection="column"
//       >
//         {/* Sticky Header */}
//         <Flex
//           align="center"
//           justify="space-between"
//           bg={headerBg}
//           color={headerText}
//           px={6}
//           py={3}
//           borderBottom="1px solid"
//           borderColor={borderColor}
//           position="sticky"
//           top="0"
//           zIndex="10"
//         >
//           <Text fontSize="lg" fontWeight="bold">
//             Task Details
//           </Text>
//           <ModalCloseButton position="static" />
//         </Flex>

//         {/* Scrollable Body */}
//         <ModalBody
//           p={5}
//           overflowY="auto"
//           maxH="65vh"
//           scrollBehavior="smooth"
//           sx={{
//             "&::-webkit-scrollbar": {
//               width: "6px",
//             },
//             "&::-webkit-scrollbar-thumb": {
//               background: "#c1c1c1",
//               borderRadius: "10px",
//             },
//           }}
//         >
//           <VStack spacing={5}>
//             {/* Title */}
//             <FormControl>
//               <FormLabel>Title</FormLabel>
//               <Input value={task.title || ""} isReadOnly bg={inputBg} />
//             </FormControl>

//             {/* Description */}
//             <FormControl>
//               <FormLabel>Description</FormLabel>
//               <Textarea
//                 value={task.description || ""}
//                 isReadOnly
//                 bg={inputBg}
//                 minH="120px"
//               />
//             </FormControl>

//             {/* Due Date & Priority */}
//             <Flex gap={4} w="100%" flexDirection={{ base: "column", md: "row" }}>
//               <FormControl>
//                 <FormLabel>Due Date</FormLabel>
//                 <Input
//                   value={
//                     task.due_date
//                       ? format(new Date(task.due_date), "MMM d, yyyy")
//                       : "N/A"
//                   }
//                   isReadOnly
//                   bg={inputBg}
//                 />
//               </FormControl>

//               <FormControl>
//                 <FormLabel>Priority</FormLabel>
//                 <Badge
//                   colorScheme={priorityColors[task.priority] || "gray"}
//                   p={2}
//                   w="100%"
//                   textAlign="center"
//                   fontSize="md"
//                   borderRadius="md"
//                 >
//                   {task.priority || "N/A"}
//                 </Badge>
//               </FormControl>
//             </Flex>

//             {/* Type & Status */}
//             <Flex gap={4} w="100%" flexDirection={{ base: "column", md: "row" }}>
//               <FormControl>
//                 <FormLabel>Type</FormLabel>
//                 <Input value={task.type || "N/A"} isReadOnly bg={inputBg} />
//               </FormControl>

//               <FormControl>
//                 <FormLabel>Status</FormLabel>
//                 <Badge
//                   colorScheme={statusColors[task.status] || "gray"}
//                   p={2}
//                   w="100%"
//                   textAlign="center"
//                   fontSize="md"
//                   borderRadius="md"
//                 >
//                   {task.status || "N/A"}
//                 </Badge>
//               </FormControl>
//             </Flex>

//             {/* Assigned To & Assigned By */}
//             <Flex gap={4} w="100%" flexDirection={{ base: "column", md: "row" }}>
//               <FormControl>
//                 <FormLabel>Assigned To</FormLabel>
//                 <Input
//                   value={task.assigned_to?.fullName || "N/A"}
//                   isReadOnly
//                   bg={inputBg}
//                 />
//               </FormControl>

//               <FormControl>
//                 <FormLabel>Assigned By</FormLabel>
//                 <Input
//                   value={task.assigned_by?.fullName || "N/A"}
//                   isReadOnly
//                   bg={inputBg}
//                 />
//               </FormControl>
//             </Flex>

//             {/* Created At */}
//             <FormControl>
//               <FormLabel>Created At</FormLabel>
//               <Input
//                 value={
//                   task.createdAt
//                     ? format(new Date(task.createdAt), "MMM d, yyyy h:mm a")
//                     : "N/A"
//                 }
//                 isReadOnly
//                 bg={inputBg}
//               />
//             </FormControl>
//           </VStack>
//         </ModalBody>

//         {/* Sticky Footer */}
//         <ModalFooter
//           bg={footerBg}
//           borderTop="1px solid"
//           borderColor={borderColor}
//           position="sticky"
//           bottom="0"
//           zIndex="10"
//           py={3}
//           px={5}
//           justifyContent="flex-end"
//         >
//           <Button variant="outline" onClick={onClose} size="md" borderRadius={"md"}>
//             Close
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default TaskDetailsModal;

import React from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	VStack,
	Flex,
	Button,
	Text,
	Box,
	Icon,
	HStack,
	SimpleGrid,
	Divider,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import {
	FiClock,
	FiUser,
	FiUserCheck,
	FiFlag,
	FiCalendar,
	FiCheckCircle,
	FiAlertCircle,
	FiInfo,
	FiCheckSquare,
	FiType,
	FiFileText,
} from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';

// Priority and status config with icons & colors
const priorityConfig = {
	Low: {
		color: 'green.400',
		icon: FiInfo,
		bg: 'rgba(16, 185, 129, 0.08)',
		border: 'rgba(16, 185, 129, 0.25)',
		label: 'Low Priority',
	},
	Medium: {
		color: 'blue.400',
		icon: FiInfo,
		bg: 'rgba(59, 130, 246, 0.08)',
		border: 'rgba(59, 130, 246, 0.25)',
		label: 'Medium Priority',
	},
	High: {
		color: 'orange.400',
		icon: FiAlertCircle,
		bg: 'rgba(255, 181, 71, 0.12)',
		border: 'rgba(255, 181, 71, 0.35)',
		label: 'High Priority',
	},
	Urgent: {
		color: 'red.400',
		icon: FiAlertCircle,
		bg: 'rgba(238, 93, 80, 0.12)',
		border: 'rgba(238, 93, 80, 0.35)',
		label: 'Urgent Priority',
	},
};

const statusConfig = {
	Pending: {
		color: 'orange.400',
		icon: FiClock,
		bg: 'rgba(255, 181, 71, 0.08)',
		border: 'rgba(255, 181, 71, 0.25)',
	},
	'In Progress': {
		color: 'blue.400',
		icon: FiInfo,
		bg: 'rgba(59, 130, 246, 0.08)',
		border: 'rgba(59, 130, 246, 0.25)',
	},
	Completed: {
		color: 'green.400',
		icon: FiCheckCircle,
		bg: 'rgba(16, 185, 129, 0.08)',
		border: 'rgba(16, 185, 129, 0.25)',
	},
	Overdue: {
		color: 'red.400',
		icon: FiAlertCircle,
		bg: 'rgba(238, 93, 80, 0.12)',
		border: 'rgba(238, 93, 80, 0.35)',
	},
};

// Reusable detail card component
const DetailCard = ({ label, value, icon, color = 'accent.goldLight' }) => (
	<Box
		bg='bg.app'
		border='1px solid'
		borderColor='rgba(212, 175, 55, 0.2)'
		borderRadius='xl'
		p={4}
		transition='all 0.2s'
		_hover={{
			borderColor: 'rgba(212, 175, 55, 0.4)',
			boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
		}}
	>
		<Flex align='center' gap={3} mb={2}>
			<Flex
				align='center'
				justify='center'
				bg='rgba(212, 175, 55, 0.1)'
				borderRadius='lg'
				p={2}
				flexShrink={0}
			>
				<Icon as={icon} color={color} boxSize={4} />
			</Flex>
			<Text
				fontSize='xs'
				color='text.muted'
				fontWeight='medium'
				textTransform='uppercase'
				letterSpacing='wider'
			>
				{label}
			</Text>
		</Flex>
		<Text fontSize='md' fontWeight='semibold' color='text.heading' ml={1}>
			{value || 'N/A'}
		</Text>
	</Box>
);

// Status badge component
const StatusBadge = ({ config, value, icon: IconComponent }) => (
	<Box
		bg={config?.bg || 'bg.app'}
		border='1px solid'
		borderColor={config?.border || 'border.default'}
		borderRadius='xl'
		p={4}
		transition='all 0.2s'
		_hover={{
			borderColor: config?.border || 'border.default',
			boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
		}}
	>
		<Flex align='center' gap={3} mb={2}>
			<Flex
				align='center'
				justify='center'
				bg={config?.bg || 'bg.app'}
				borderRadius='full'
				p={2}
				flexShrink={0}
			>
				<Icon
					as={config?.icon || IconComponent}
					color={config?.color || 'gray.400'}
					boxSize={5}
				/>
			</Flex>
			<Text
				fontSize='xs'
				color='text.muted'
				fontWeight='medium'
				textTransform='uppercase'
				letterSpacing='wider'
			>
				{value === 'priority' ? 'Priority Level' : 'Current Status'}
			</Text>
		</Flex>
		<Text
			fontSize='lg'
			fontWeight='bold'
			color={config?.color || 'gray.400'}
			ml={1}
			textTransform='capitalize'
		>
			{value || 'N/A'}
		</Text>
	</Box>
);

const TaskDetailsModal = ({ isOpen, onClose, task }) => {
	const mc = useModalColors();

	if (!task) return null;

	const priority = priorityConfig[task.priority];
	const status = statusConfig[task.status];

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='xl' isCentered>
			<ModalOverlay backdropFilter='blur(3px)' bg={mc.overlayBg} />
			<ModalContent
				mx={{ base: 3, sm: 6 }}
				borderRadius='2xl'
				boxShadow={mc.modalShadow}
				bg={mc.bg}
				border='1px solid'
				borderColor={mc.borderColor}
				maxH='85vh'
				overflow='hidden'
				display='flex'
				flexDirection='column'
			>
				{/* Sticky Header — Gold Gradient */}
				<Flex
					align='center'
					justify='space-between'
					background={mc.headerBg}
					color={mc.headerText}
					px={6}
					py={4}
					boxShadow='0 2px 10px rgba(0,0,0,0.15)'
					position='sticky'
					top='0'
					zIndex='10'
				>
					<HStack spacing={3}>
						<Icon as={FiCheckSquare} boxSize={5} />
						<Text fontSize='lg' color='inherit' fontWeight='bold'>
							Task Details
						</Text>
					</HStack>
					<ModalCloseButton
						position='relative'
						top='0'
						right='0'
						bg={mc.closeBtnBg}
						color={mc.closeBtnColor}
						borderRadius='full'
						_hover={{ bg: mc.closeBtnHoverBg }}
						_focus={{ boxShadow: 'none' }}
					/>
				</Flex>

				{/* Scrollable Body */}
				<ModalBody
					p={6}
					overflowY='auto'
					maxH='65vh'
					scrollBehavior='smooth'
					sx={{
						'&::-webkit-scrollbar': {
							width: '6px',
						},
						'&::-webkit-scrollbar-track': {
							background: mc.bgDeep,
							borderRadius: '3px',
						},
						'&::-webkit-scrollbar-thumb': {
							background: mc.borderColor,
							borderRadius: '3px',
							_hover: { background: mc.borderFocus },
						},
					}}
				>
					<VStack spacing={5} align='stretch'>
						{/* Title — Hero Section */}
						<Box
							bg='bg.app'
							border='1px solid'
							borderColor='rgba(212, 175, 55, 0.3)'
							borderRadius='xl'
							p={5}
							position='relative'
							overflow='hidden'
						>
							{/* Gold accent line at top */}
							<Box
								position='absolute'
								top='0'
								left='0'
								right='0'
								height='3px'
								background='linear-gradient(90deg, #C9A227, #F5D67B, #D4AF37)'
							/>
							<Flex align='flex-start' gap={4}>
								<Box flex={1}>
									<Text
										fontSize='xs'
										color='text.muted'
										fontWeight='medium'
										textTransform='uppercase'
										letterSpacing='wider'
										mb={1}
									>
										Task Title
									</Text>
									<Text
										fontSize='2xl'
										fontWeight='bold'
										color='text.heading'
										lineHeight='1.3'
									>
										{task.title || 'Untitled Task'}
									</Text>
								</Box>
							</Flex>
						</Box>

						{/* Description */}
						{task.description && (
							<Box
								bg='bg.app'
								border='1px solid'
								borderColor='rgba(212, 175, 55, 0.15)'
								borderRadius='xl'
								p={5}
							>
								<Flex align='center' gap={3} mb={3}>
									<Icon as={FiFileText} color='accent.goldLight' boxSize={4} />
									<Text
										fontSize='xs'
										color='text.muted'
										fontWeight='medium'
										textTransform='uppercase'
										letterSpacing='wider'
									>
										Description
									</Text>
								</Flex>
								<Text
									fontSize='md'
									color='text.body'
									lineHeight='1.7'
									whiteSpace='pre-wrap'
								>
									{task.description}
								</Text>
							</Box>
						)}

						{/* Priority & Status */}
						<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
							<StatusBadge
								config={priority}
								value={task.priority}
								icon={FiFlag}
							/>
							<StatusBadge
								config={status}
								value={task.status}
								icon={FiCheckCircle}
							/>
						</SimpleGrid>

						<Divider borderColor='rgba(212, 175, 55, 0.15)' />

						{/* Meta Details Grid */}
						<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
							<DetailCard
								label='Due Date'
								value={
									task.due_date
										? format(new Date(task.due_date), 'MMM d, yyyy')
										: null
								}
								icon={FiCalendar}
							/>
							<DetailCard label='Task Type' value={task.type} icon={FiType} />
						</SimpleGrid>

						{/* People Grid */}
						<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
							<DetailCard
								label='Assigned To'
								value={task.assigned_to?.fullName}
								icon={FiUser}
							/>
							<DetailCard
								label='Assigned By'
								value={task.assigned_by?.fullName}
								icon={FiUserCheck}
							/>
						</SimpleGrid>

						{/* Created At */}
						<DetailCard
							label='Created At'
							value={
								task.createdAt
									? format(new Date(task.createdAt), 'MMM d, yyyy h:mm a')
									: null
							}
							icon={FiClock}
						/>
					</VStack>
				</ModalBody>

				{/* Sticky Footer — Navy with gold accent */}
				<ModalFooter
					bg={mc.footerBg}
					borderTop='2px solid'
					borderColor={mc.headerBg}
					position='sticky'
					bottom='0'
					zIndex='10'
					py={4}
					px={6}
					justifyContent='flex-end'
				>
					<Button
						variant='ghost'
						onClick={onClose}
						borderRadius='md'
						color={mc.secondaryBtnText}
						_hover={{
							bg: mc.secondaryBtnHoverBg,
							color: mc.secondaryBtnHoverText,
						}}
					>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default TaskDetailsModal;
