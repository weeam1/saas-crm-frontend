// import { useSelector } from "react-redux";
// import { validationLeadSearchSchema } from "schema/leadSchema";
// import { useFormik } from "formik";
// import React, { useEffect } from "react";
// import { leadLabels } from "utils/searchLabels";
// import { leadStatusLabels } from "utils/searchLabels";
// import { mainLeadStatusLabels } from "utils/searchLabels";
// import { useModalColors } from "hooks/useModalColors";
// import { useLeadStatuses } from "hooks/leads/useLeadStatuses";

// const LazyAdvancedSearchForm = React.lazy(() => import("./AdvancedForm"));

// const {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Spinner,
//   Flex,
// } = require("@chakra-ui/react");

// const AdvancedSearchModal = ({
//   setAdvaceSearch,
//   advaceSearch,
//   isLoading,
//   fetchAdvancedSearch,
//   setSearchClear,
//   setFormValues,
//   isFormReset,
//   setIsFormReset,
//   pageSize,
//   setGetTagValues,
// }) => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const tree = useSelector((state) => state.user.tree);

//   const { headerBg, headerText } = useModalColors();
//   const { leadStatusMaps } = useLeadStatuses();

//   const { mainStatusMap, subStatusMap } = leadStatusMaps;

//   const formClearHanlder = () => {
//     // handleClear();
//     formikResetForm();
//   };

//   const initialValues = {
//     leadName: "",
//     leadStatus: "",
//     eLeadStatus: "",
//     leadEmail: "",
//     leadPhoneNumber: "",
//     managerAssigned: "",
//     agentAssigned: "",
//     leadWhatsappNumber: "",
//     nationality: "",
//     ip: "",
//     leadAddress: "",
//     leadCampaign: "",
//     leadSourceDetails: "",
//     leadSourceMedium: "",
//     pageUrl: "",
//     r_u_in_uae: "",
//     timetocall: "",
//     leadLang: "",
//     lastNote: "",
//     budget: "",
//   };

//   const formik = useFormik({
//     initialValues,
//     validationSchema: validationLeadSearchSchema,
//     onSubmit: (values, { formikResetForm }) => {
//       // Initialize cleanedData and tags
//       const { cleanedData, tags } = Object.entries(values).reduce(
//         (acc, [key, value]) => {
//           if (value !== "" && value !== undefined) {
//             // Add raw value to cleanedData for API
//             acc.cleanedData[key] = value;

//             let displayValue = value;
//             let displayLabel = key;

//             // Create a proper label mapping
//             const getFieldLabel = (fieldKey) => {
//               const labelMap = {
//                 leadName: "Name",
//                 leadEmail: "Email",
//                 nationality: "Nationality",
//                 ip: "Country Source",
//                 leadAddress: "Lead Address",
//                 leadCampaign: "Lead Campaign",
//                 leadSourceDetails: "Source Content",
//                 leadSourceMedium: "Source Medium",
//                 pageUrl: "Campaign URL",
//                 r_u_in_uae: "Are You in UAE?",
//                 leadLang: "Lead Language",
//                 lastNote: "Last Note",
//                 budget: "Budget",
//                 timetocall: "Time To Call",
//                 eLeadStatus: "Main Status",
//                 leadStatus: "Status",
//                 agentAssigned: "Requested By Agent",
//                 managerAssigned: "Assigned To Manager",
//                 leadPhoneNumber: "Phone Number",
//                 leadWhatsappNumber: "Whatsapp Number",
//               };
//               return labelMap[fieldKey] || leadLabels[fieldKey] || fieldKey;
//             };

//             displayLabel = getFieldLabel(key);

//             // Special formatting for leadStatus (Status)
//             if (key === "leadStatus") {
//               const statusMap = {
//                 active: "Interested",
//                 pending: "Not Interested",
//               };
//               displayValue = statusMap[value] || subStatusMap[value] || value;
//             }

//             // Special formatting for eLeadStatus (Main Status)
//             if (key === "eLeadStatus") {
//               displayValue =
//                 value === "-1" ? "No E.Status" : mainStatusMap[value] || value;
//             }

//             // Handle agentAssigned (Requested By Agent)
//             if (key === "agentAssigned") {
//               console.log("Processing agentAssigned:", value); // Debug log
//               console.log("Tree agents:", tree.agents); // Debug log

//               if (value === "-1" || value === -1) {
//                 displayValue = "No Agent";
//               } else {
//                 // Safely flatten agents array
//                 const agentsArray = [];
//                 if (tree?.agents) {
//                   Object.values(tree.agents).forEach((managerArray) => {
//                     if (Array.isArray(managerArray)) {
//                       agentsArray.push(...managerArray);
//                     }
//                   });
//                 }

//                 const assignedAgent = agentsArray.find(
//                   (agent) => agent?._id?.toString() === value?.toString(),
//                 );

//                 displayValue = assignedAgent
//                   ? `${assignedAgent.firstName} ${assignedAgent.lastName}`
//                   : value; // Show ID if agent not found
//               }
//             }

//             // Handle managerAssigned
//             if (key === "managerAssigned") {
//               if (value === "-1" || value === -1) {
//                 displayValue = "No Manager";
//               } else {
//                 const assignedManager = tree?.managers?.find(
//                   (user) => user?._id?.toString() === value?.toString(),
//                 );
//                 displayValue = assignedManager
//                   ? `${assignedManager.firstName} ${assignedManager.lastName}`
//                   : value;
//               }
//             }

//             // Create tag object with key, label, and value
//             acc.tags.push({
//               key: key,
//               label: displayLabel, // This will be "Requested By Agent" for agentAssigned
//               value: displayValue,
//               originalValue: value,
//             });
//           }

//           return acc;
//         },
//         { cleanedData: {}, tags: [] },
//       );

//       console.log("Tags being sent to Pagination:", tags); // Debug log

//       // Call API with cleaned data
//       fetchAdvancedSearch(cleanedData, 1, pageSize);
//       setAdvaceSearch(false);

//       // Update UI with formatted tags and form values
//       setGetTagValues(tags);
//       setSearchClear(true);
//       setFormValues(values);
//     },
//   });

//   const {
//     errors,
//     touched,
//     values,
//     handleBlur,
//     handleChange,
//     handleSubmit,
//     resetForm: formikResetForm,
//     dirty,
//     setFieldValue,
//   } = formik;

//   useEffect(() => {
//     if (isFormReset) {
//       formikResetForm();
//       setIsFormReset(false);
//     }
//   }, [isFormReset, formikResetForm, setIsFormReset]);

//   return (
//     <React.Suspense
//       fallback={
//         <Flex
//           position="fixed"
//           top="0"
//           left="0"
//           right="0"
//           bottom="0"
//           alignItems="center"
//           justifyContent="center"
//           bg="rgba(0, 0, 0, 0.1)"
//           zIndex={9999}
//         >
//           <Spinner size="xl" color="brand.500" />
//         </Flex>
//       }
//     >
//       <Modal
//         size="6xl"
//         onClose={() => {
//           setAdvaceSearch(false);
//           // formikResetForm();
//         }}
//         isOpen={advaceSearch}
//         isCentered
//         motionPreset="slideInBottom"
//       >
//         <ModalOverlay backdropFilter="blur(2px)" />
//         <ModalContent mx="2" borderRadius="xl" boxShadow="xl">
//           <ModalHeader
//             display="flex"
//             gap="2"
//             bg={headerBg}
//             color={headerText}
//             borderTopRadius="xl"
//             py={4}
//             alignItems="center"
//             w="100%"
//           >
//             Advance Search
//           </ModalHeader>
//           <ModalCloseButton
//             onClick={() => {
//               setAdvaceSearch(false);
//               formikResetForm();
//             }}
//           />
//           <ModalBody width="100%">
//             <LazyAdvancedSearchForm
//               values={values}
//               errors={errors}
//               touched={touched}
//               handleChange={handleChange}
//               handleBlur={handleBlur}
//               user={user}
//               tree={tree}
//               setFieldValue={setFieldValue}
//             />
//           </ModalBody>
//           <ModalFooter>
//             <Button
//               colorScheme="red"
//               variant="outline"
//               size="sm"
//               mr={2}
//               onClick={formClearHanlder}
//             >
//               Clear
//             </Button>
//             <Button
//               colorScheme="brand"
//               size="sm"
//               onClick={handleSubmit}
//               disabled={isLoading || !dirty ? true : false}
//             >
//               {isLoading ? "Search" : "Search"}
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </React.Suspense>
//   );
// };
// export default AdvancedSearchModal;

import { useSelector } from 'react-redux';
import { validationLeadSearchSchema } from 'schema/leadSchema';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { leadLabels } from 'utils/searchLabels';
import { useModalColors } from 'hooks/useModalColors';
import { useLeadStatuses } from 'hooks/leads/useLeadStatuses';

const LazyAdvancedSearchForm = React.lazy(() => import('./AdvancedForm'));

const {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	Spinner,
	Flex,
	Text,
} = require('@chakra-ui/react');

const AdvancedSearchModal = ({
	setAdvaceSearch,
	advaceSearch,
	isLoading,
	fetchAdvancedSearch,
	setSearchClear,
	setFormValues,
	isFormReset,
	setIsFormReset,
	pageSize,
	setGetTagValues,
}) => {
	const user = JSON.parse(localStorage.getItem('user'));
	const tree = useSelector((state) => state.user.tree);

	const mc = useModalColors();
	const { leadStatusMaps, leadStatuses, allSubStatuses } = useLeadStatuses();

	const { mainStatusMap, subStatusMap } = leadStatusMaps;

	// Helper function to get all agents from tree
	const getAllAgents = () => {
		const agentsArray = [];
		if (tree?.agents) {
			Object.values(tree.agents).forEach((managerArray) => {
				if (Array.isArray(managerArray)) {
					agentsArray.push(...managerArray);
				}
			});
		}
		return agentsArray;
	};

	// Helper function to get agent name by ID
	const getAgentNameById = (agentId) => {
		if (!agentId || agentId === '-1' || agentId === -1) return null;
		const agents = getAllAgents();
		const agent = agents.find(
			(agent) => agent?._id?.toString() === agentId?.toString(),
		);
		return agent ? `${agent.firstName} ${agent.lastName}` : null;
	};

	// Helper function to get manager name by ID
	const getManagerNameById = (managerId) => {
		if (!managerId || managerId === '-1' || managerId === -1) return null;
		const manager = tree?.managers?.find(
			(user) => user?._id?.toString() === managerId?.toString(),
		);
		return manager ? `${manager.firstName} ${manager.lastName}` : null;
	};

	// Helper function to get main status label by value
	const getMainStatusLabel = (statusValue) => {
		if (!statusValue) return null;
		if (statusValue === '-1') return 'No E.Status';
		const status = leadStatuses?.find(
			(item) => item.value?.toString() === statusValue?.toString(),
		);
		return status?.label || mainStatusMap[statusValue] || null;
	};

	// Helper function to get sub status label by value
	const getSubStatusLabel = (statusValue) => {
		if (!statusValue) return null;
		const status = allSubStatuses?.find(
			(item) => item.value?.toString() === statusValue?.toString(),
		);

		return status?.label || subStatusMap[statusValue] || null;
	};

	const formClearHanlder = () => {
		formikResetForm();
	};

	const initialValues = {
		leadName: '',
		leadStatus: '',
		eLeadStatus: '',
		leadEmail: '',
		leadPhoneNumber: '',
		managerAssigned: '',
		agentAssigned: '',
		leadWhatsappNumber: '',
		nationality: '',
		ip: '',
		leadAddress: '',
		leadCampaign: '',
		leadSourceDetails: '',
		leadSourceMedium: '',
		pageUrl: '',
		r_u_in_uae: '',
		timetocall: '',
		leadLang: '',
		lastNote: '',
		budget: '',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: validationLeadSearchSchema,
		onSubmit: (values, { formikResetForm }) => {
			// Initialize cleanedData and tags
			const { cleanedData, tags } = Object.entries(values).reduce(
				(acc, [key, value]) => {
					if (value !== '' && value !== undefined && value !== null) {
						// Add raw value to cleanedData for API
						acc.cleanedData[key] = value;

						let displayValue = value;
						let displayLabel = key;

						// Field label mapping
						const getFieldLabel = (fieldKey) => {
							const labelMap = {
								leadName: 'Name',
								leadEmail: 'Email',
								nationality: 'Nationality',
								ip: 'Country Source',
								leadAddress: 'Lead Address',
								leadCampaign: 'Lead Campaign',
								leadSourceDetails: 'Source Content',
								leadSourceMedium: 'Source Medium',
								pageUrl: 'Campaign URL',
								r_u_in_uae: 'Are You in UAE?',
								leadLang: 'Lead Language',
								lastNote: 'Last Note',
								budget: 'Budget',
								timetocall: 'Time To Call',
								eLeadStatus: 'Main Status',
								leadStatus: 'Status',
								agentAssigned: 'Agent',
								managerAssigned: 'Assigned To Manager',
								leadPhoneNumber: 'Phone Number',
								leadWhatsappNumber: 'Whatsapp Number',
							};
							return labelMap[fieldKey] || leadLabels[fieldKey] || fieldKey;
						};

						displayLabel = getFieldLabel(key);

						// Format based on field type
						if (key === 'leadStatus') {
							const statusLabel = getSubStatusLabel(value);
							console.log(
								'Finding sub status label for value:',
								value,
								'Found label:',
								statusLabel,
							); // Debug log
							displayValue = statusLabel;
						} else if (key === 'eLeadStatus') {
							const mainStatusLabel = getMainStatusLabel(value);
							displayValue = mainStatusLabel || value;
						} else if (key === 'agentAssigned') {
							const agentName = getAgentNameById(value);
							displayValue =
								agentName ||
								(value === '-1' || value === -1 ? 'No Agent' : value);
						} else if (key === 'managerAssigned') {
							const managerName = getManagerNameById(value);
							displayValue =
								managerName ||
								(value === '-1' || value === -1 ? 'No Manager' : value);
						}

						// IMPORTANT: Match the structure expected by Pagination component
						// Pagination expects: { key, label, value, originalKey, originalValue }
						acc.tags.push({
							key: displayLabel, // Use the original field name as the key for identification
							value: displayValue, // This is the formatted value shown to user
							originalKey: key, // This is the original field name for API
							originalValue: value, // This is the original value for API
						});
					}

					return acc;
				},
				{ cleanedData: {}, tags: [] },
			);

			console.log('Tags being sent to Pagination:', tags);

			// Call API with cleaned data
			fetchAdvancedSearch(cleanedData, 1, pageSize);
			setAdvaceSearch(false);

			// Update UI with formatted tags and form values
			setGetTagValues(tags);
			setSearchClear(true);
			setFormValues(values);
		},
	});

	const {
		errors,
		touched,
		values,
		handleBlur,
		handleChange,
		handleSubmit,
		resetForm: formikResetForm,
		dirty,
		setFieldValue,
	} = formik;

	useEffect(() => {
		if (isFormReset) {
			formikResetForm();
			setIsFormReset(false);
		}
	}, [isFormReset, formikResetForm, setIsFormReset]);

	return (
		// <React.Suspense
		//   fallback={
		//     <Flex
		//       position="fixed"
		//       top="0"
		//       left="0"
		//       right="0"
		//       bottom="0"
		//       alignItems="center"
		//       justifyContent="center"
		//       bg="rgba(0, 0, 0, 0.1)"
		//       zIndex={9999}
		//     >
		//       <Spinner size="xl" color="brand.500" />
		//     </Flex>
		//   }
		// >
		//   <Modal
		//     size="6xl"
		//     onClose={() => {
		//       setAdvaceSearch(false);
		//     }}
		//     isOpen={advaceSearch}
		//     isCentered
		//     motionPreset="slideInBottom"
		//   >
		//     <ModalOverlay backdropFilter="blur(2px)" />
		//     <ModalContent mx="2" borderRadius="xl" boxShadow="xl">
		//       <ModalHeader
		//         display="flex"
		//         gap="2"
		//         bg={headerBg}
		//         color={headerText}
		//         borderTopRadius="xl"
		//         py={4}
		//         alignItems="center"
		//         w="100%"
		//       >
		//         Advance Search
		//       </ModalHeader>
		//       <ModalCloseButton
		//         onClick={() => {
		//           setAdvaceSearch(false);
		//           formikResetForm();
		//         }}
		//       />
		//       <ModalBody width="100%">
		//         <LazyAdvancedSearchForm
		//           values={values}
		//           errors={errors}
		//           touched={touched}
		//           handleChange={handleChange}
		//           handleBlur={handleBlur}
		//           user={user}
		//           tree={tree}
		//           setFieldValue={setFieldValue}
		//         />
		//       </ModalBody>
		//       <ModalFooter>
		//         <Button
		//           colorScheme="red"
		//           variant="outline"
		//           size="sm"
		//           mr={2}
		//           onClick={formClearHanlder}
		//         >
		//           Clear
		//         </Button>
		//         <Button
		//           colorScheme="brand"
		//           size="sm"
		//           onClick={handleSubmit}
		//           disabled={isLoading || !dirty}
		//         >
		//           {isLoading ? "Searching..." : "Search"}
		//         </Button>
		//       </ModalFooter>
		//     </ModalContent>
		//   </Modal>
		// </React.Suspense>

		<Modal
			size='6xl'
			onClose={() => {
				setAdvaceSearch(false);
			}}
			isOpen={advaceSearch}
			isCentered
			motionPreset='slideInBottom'
		>
			<ModalOverlay backdropFilter='blur(3px)' bg={mc.overlayBg} />
			<ModalContent
				mx='2'
				borderRadius='2xl'
				boxShadow={mc.modalShadow}
				bg={mc.bg}
				border='1px solid'
				borderColor={mc.borderColor}
				overflow='hidden'
			>
				{/* Header — Gold Gradient */}
				<ModalHeader
					display='flex'
					gap='3'
					background={mc.headerBg}
					color={mc.headerText}
					borderTopRadius='2xl'
					py={4}
					px={6}
					alignItems='center'
					w='100%'
					boxShadow='0 2px 10px rgba(0,0,0,0.15)'
				>
					<Text fontWeight='bold' color='inherit' fontSize='lg'>
						Advance Search
					</Text>
				</ModalHeader>
				<ModalCloseButton
					onClick={() => {
						setAdvaceSearch(false);
						formikResetForm();
					}}
					top='14px'
					right='14px'
					bg={mc.closeBtnBg}
					color={mc.closeBtnColor}
					borderRadius='full'
					_hover={{ bg: mc.closeBtnHoverBg }}
					_focus={{ boxShadow: 'none' }}
				/>

				{/* Body */}
				<ModalBody width='100%' py={6} px={{ base: 4, md: 6 }}>
					<LazyAdvancedSearchForm
						values={values}
						errors={errors}
						touched={touched}
						handleChange={handleChange}
						handleBlur={handleBlur}
						user={user}
						tree={tree}
						setFieldValue={setFieldValue}
					/>
				</ModalBody>

				{/* Footer — Navy with gold accent */}
				<ModalFooter
					bg={mc.footerBg}
					borderTop='2px solid'
					borderColor={mc.headerBg}
					py={4}
					px={6}
					gap={3}
				>
					<Button
						variant='ghost'
						size='sm'
						onClick={formClearHanlder}
						color={mc.secondaryBtnText}
						_hover={{
							bg: mc.secondaryBtnHoverBg,
							color: mc.secondaryBtnHoverText,
						}}
						borderRadius='md'
					>
						Clear
					</Button>
					<Button
						size='sm'
						onClick={handleSubmit}
						disabled={isLoading || !dirty}
						background={mc.primaryBtnBg}
						color={mc.primaryBtnText}
						fontWeight='bold'
						borderRadius='md'
						px={6}
						_hover={{
							background: mc.primaryBtnHoverBg,
							boxShadow: mc.primaryBtnShadow,
							transform: 'translateY(-1px)',
						}}
						_active={{
							background: mc.primaryBtnActiveBg,
							transform: 'translateY(0)',
						}}
						_disabled={{
							opacity: 0.5,
							cursor: 'not-allowed',
							transform: 'none',
							boxShadow: 'none',
						}}
						isLoading={isLoading}
						loadingText='Searching...'
					>
						{isLoading ? 'Searching...' : 'Search'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AdvancedSearchModal;
