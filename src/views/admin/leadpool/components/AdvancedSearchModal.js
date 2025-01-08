import { useSelector } from "react-redux";
import { validationLeadSearchSchema } from "schema/leadSchema";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import useFetchUserHierarchy from "hooks/useFetchUserHierarchy";

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
} = require("@chakra-ui/react");

const LazyAdvancedSearchForm = React.lazy(() => import("./AdvancedSearchForm"));

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
	const user = JSON.parse(localStorage.getItem("user"));
	const tree = useSelector((state) => state.user.tree);

	const { agents } = useFetchUserHierarchy(user);

	console.log({ agents });

	const formClearHanlder = () => {
		// handleClear();
		formikResetForm();
	};

	const initialValues = {
		leadName: "",
		leadStatus: "",
		eLeadStatus: "",
		leadEmail: "",
		agentAssigned: "",
		nationality: "",
		ip: "",
		leadAddress: "",
		leadCampaign: "",
		leadSourceDetails: "",
		leadSourceMedium: "",
		pageUrl: "",
		r_u_in_uae: "",
		timetocall: "",
		leadLang: "",
		lastNote: "",
		budget: "",
	};

	// const initialValues = {
	// 	leadName: "",
	// 	leadStatus: "",
	// 	lastNote: "",
	// 	dateAndTime: "", // Added
	// 	timetocall: "",
	// 	nationality: "",
	// 	ip: "",
	// 	leadAddress: "",
	// 	leadCampaign: "",
	// 	leadSourceDetails: "",
	// 	leadSourceMedium: "",
	// 	pageUrl: "",
	// 	r_u_in_uae: "",
	// };

	const formik = useFormik({
		initialValues,
		validationSchema: validationLeadSearchSchema,
		onSubmit: (values, { formikResetForm }) => {
			// Initialize cleanedData and tags
			const { cleanedData, tags } = Object.entries(values).reduce(
				(acc, [key, value]) => {
					if (value !== "" && value !== undefined) {
						// Add raw value to cleanedData for API
						acc.cleanedData[key] = value;

						let displayValue = value;

						// Special formatting rules for score range
						if (key === "fromLeadScore" || key === "toLeadScore") {
							displayValue = `${values.fromLeadScore || 0}-${
								values.toLeadScore || "max"
							}`;
						}

						// Special formatting for leadStatus
						if (key === "leadStatus") {
							displayValue =
								value === "active"
									? "Interested"
									: value === "pending"
										? "Not Interested"
										: value;
						}

						// Handle agentAssigned
						if (key === "agentAssigned") {
							const assignedAgent = agents.find(
								(agent) => agent?._id?.toString() === value
							);

							console.log({ assignedAgent });

							displayValue = assignedAgent
								? `${assignedAgent.name}`
								: value === "-1"
									? "No Agent"
									: value;
						}

						// Add formatted value to tags for UI
						acc.tags.push(`${key}: ${displayValue}`);
					}

					return acc;
				},
				{ cleanedData: {}, tags: [] }
			);

			// Call API with cleaned data
			fetchAdvancedSearch(cleanedData, 1, pageSize);
			setAdvaceSearch(false);

			// Update UI with tags
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
	} = formik;

	// Send the reset function to the parent
	useEffect(() => {
		if (isFormReset) {
			formikResetForm();
			setIsFormReset(false);
		}
	}, [isFormReset, formikResetForm, setIsFormReset]);

	return (
		<React.Suspense fallback={<Spinner />}>
			<Modal
				size="5xl"
				onClose={() => {
					setAdvaceSearch(false);
				}}
				isOpen={advaceSearch}
				isCentered
				motionPreset="slideInBottom"
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Advance Search</ModalHeader>
					<ModalCloseButton
						onClick={() => {
							setAdvaceSearch(false);
							formikResetForm();
						}}
					/>
					<ModalBody
						width="100%"
						maxH="500px" // Set max height for the modal body
						overflowY="auto" // Enable vertical scrolling when content exceeds max height
						sx={{
							"&::-webkit-scrollbar": {
								width: "6px", // Custom scrollbar width
							},
							"&::-webkit-scrollbar-thumb": {
								background: "brand.500", // Custom brand color (adjust according to your theme)
								borderRadius: "8px",
							},
							"&::-webkit-scrollbar-thumb:hover": {
								background: "brand.600", // Slightly darker on hover
							},
						}}
					>
						<LazyAdvancedSearchForm
							values={values}
							errors={errors}
							touched={touched}
							handleChange={handleChange}
							handleBlur={handleBlur}
							user={user}
							tree={tree}
							agents={agents}
						/>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="red"
							variant="outline"
							size="sm"
							mr={2}
							onClick={formClearHanlder}
						>
							Clear
						</Button>
						<Button
							colorScheme="brand"
							size="sm"
							onClick={handleSubmit}
							disabled={isLoading || !dirty ? true : false}
						>
							{isLoading ? <Spinner /> : "Search"}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</React.Suspense>
	);
};
export default AdvancedSearchModal;

// const AdvancedSearchModal = ({
//   setAdvaceSearch,
//   resetForm,
//   advaceSearch,
//   handleChange,
//   handleBlur,
//   errors,
//   touched,
//   values,
//   isLoading,
//   dirty,
//   handleSubmit,
// }) => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const tree = useSelector((state) => state.user.tree);
//   return (
//     <Modal
//       size="2xl"
//       onClose={() => {
//         setAdvaceSearch(false);
//         resetForm();
//       }}
//       isOpen={advaceSearch}
//       isCentered
//     >
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>Advance Search</ModalHeader>
//         <ModalCloseButton
//           onClick={() => {
//             setAdvaceSearch(false);
//             resetForm();
//           }}
//         />
//         <ModalBody>
//           <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={2}>
//             <GridItem colSpan={{ base: 12, md: 6 }}>
//               <FormLabel
//                 display="flex"
//                 ms="4px"
//                 fontSize="sm"
//                 fontWeight="600"
//                 color={"#000"}
//                 mb="0"
//                 mt={2}
//               >
//                 Name
//               </FormLabel>
//               <Input
//                 fontSize="sm"
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values?.leadName}
//                 name="leadName"
//                 placeholder="Enter Lead Name"
//                 fontWeight="500"
//               />
//               <Text mb="10px" color={"red"}>
//                 {" "}
//                 {errors.leadName && touched.leadName && errors.leadName}
//               </Text>
//             </GridItem>
//             <GridItem colSpan={{ base: 12, md: 6 }}>
//               <FormLabel
//                 display="flex"
//                 ms="4px"
//                 fontSize="sm"
//                 fontWeight="600"
//                 color={"#000"}
//                 mb="0"
//                 mt={2}
//               >
//                 Status
//               </FormLabel>
//               <Select
//                 value={values?.leadStatus}
//                 fontSize="sm"
//                 name="leadStatus"
//                 onChange={handleChange}
//                 fontWeight="500"
//                 placeholder={"Select Lead Status"}
//               >
//                 <option value="active">Interested</option>
//                 <option value="pending">Not-interested</option>
//                 <option value="sold">Sold</option>
//                 <option value="new">New</option>
//                 <option value="no_answer">No answer</option>
//                 <option value="unreachable">Unreachable</option>

//                 <option value="waiting">Waiting</option>
//                 <option value="follow_up">Follow Up</option>
//                 <option value="meeting">Meeting</option>
//                 <option value="follow_up_after_meeting">
//                   Follow Up After Meeting
//                 </option>
//                 <option value="deal">Deal</option>
//                 <option value="junk">Junk</option>
//                 <option value="whatsapp_send">Whatsapp Send</option>
//                 <option value="whatsapp_rec">Whatsapp Rec</option>
//                 <option value="deal_out">Deal Out</option>
//                 <option value="shift_project">Shift Project</option>
//                 <option value="wrong_number">Wrong Number</option>
//                 <option value="broker">Broker</option>
//                 <option value="voice_mail">Voice Mail</option>
//                 <option value="request">Request</option>
//               </Select>
//               <Text mb="10px" color={"red"}>
//                 {" "}
//                 {errors.leadStatus && touched.leadStatus && errors.leadStatus}
//               </Text>
//             </GridItem>

//             <GridItem colSpan={{ base: 12, md: 6 }}>
//               <FormLabel
//                 display="flex"
//                 ms="4px"
//                 fontSize="sm"
//                 fontWeight="600"
//                 color={"#000"}
//                 mb="0"
//                 mt={2}
//               >
//                 Email
//               </FormLabel>
//               <Input
//                 fontSize="sm"
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values?.leadEmail}
//                 name="leadEmail"
//                 placeholder="Enter Lead Email"
//                 fontWeight="500"
//               />
//               <Text mb="10px" color={"red"}>
//                 {" "}
//                 {errors.leadEmail && touched.leadEmail && errors.leadEmail}
//               </Text>
//             </GridItem>
//             <GridItem colSpan={{ base: 12, md: 6 }}>
//               <FormLabel
//                 display="flex"
//                 ms="4px"
//                 fontSize="sm"
//                 fontWeight="600"
//                 color={"#000"}
//                 mb="0"
//                 mt={2}
//               >
//                 Phone Number
//               </FormLabel>
//               <Input
//                 fontSize="sm"
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values?.leadPhoneNumber}
//                 name="leadPhoneNumber"
//                 placeholder="Enter Lead PhoneNumber"
//                 fontWeight="500"
//               />
//               <Text mb="10px" color={"red"}>
//                 {" "}
//                 {errors.leadPhoneNumber &&
//                   touched.leadPhoneNumber &&
//                   errors.leadPhoneNumber}
//               </Text>
//             </GridItem>
//             {/* <GridItem colSpan={{ base: 12, md: 6 }}> */}

//             {/* </GridItem> */}

//             {user?.role === "superAdmin" && (
//               <GridItem colSpan={{ base: 12, md: 6 }}>
//                 <FormLabel
//                   display="flex"
//                   ms="4px"
//                   fontSize="sm"
//                   fontWeight="600"
//                   color={"#000"}
//                   mb="0"
//                   mt={2}
//                 >
//                   Manager
//                 </FormLabel>
//                 <Box>
//                   <Select
//                     name="managerAssigned"
//                     onChange={handleChange}
//                     value={values["managerAssigned"]}
//                   >
//                     <option selected value={""}>
//                       Select manager
//                     </option>
//                     {tree &&
//                       tree["managers"] &&
//                       tree["managers"]?.map((user) => {
//                         return (
//                           <option
//                             key={user?._id?.toString()}
//                             value={user?._id?.toString()}
//                           >
//                             {user?.firstName + " " + user?.lastName}
//                           </option>
//                         );
//                       })}
//                   </Select>
//                 </Box>

//                 <Text mb="10px" color={"red"}>
//                   {" "}
//                   {errors.fromLeadScore &&
//                     touched.fromLeadScore &&
//                     errors.fromLeadScore}
//                 </Text>
//               </GridItem>
//             )}

//             {user?.role === "superAdmin" && (
//               <GridItem colSpan={{ base: 12, md: 6 }}>
//                 <FormLabel
//                   display="flex"
//                   ms="4px"
//                   fontSize="sm"
//                   fontWeight="600"
//                   color={"#000"}
//                   mb="0"
//                   mt={2}
//                 >
//                   Agent
//                 </FormLabel>
//                 <Box>
//                   <Select
//                     name="agentAssigned"
//                     onChange={handleChange}
//                     value={values["agentAssigned"]}
//                   >
//                     <option selected value={""}>
//                       Select agent
//                     </option>
//                     {tree &&
//                       tree["managers"] &&
//                       Object.values(tree["agents"])
//                         ?.flat()
//                         ?.map((user) => {
//                           return (
//                             <option
//                               key={user?._id?.toString()}
//                               value={user?._id?.toString()}
//                             >
//                               {user?.firstName + " " + user?.lastName}
//                             </option>
//                           );
//                         })}
//                   </Select>
//                 </Box>

//                 <Text mb="10px" color={"red"}>
//                   {" "}
//                   {errors.fromLeadScore &&
//                     touched.fromLeadScore &&
//                     errors.fromLeadScore}
//                 </Text>
//               </GridItem>
//             )}

//             {user?.roles[0]?.roleName === "Manager" && (
//               <GridItem colSpan={{ base: 12, md: 6 }}>
//                 <FormLabel
//                   display="flex"
//                   ms="4px"
//                   fontSize="sm"
//                   fontWeight="600"
//                   color={"#000"}
//                   mb="0"
//                   mt={2}
//                 >
//                   Agent
//                 </FormLabel>
//                 <Box>
//                   <Select
//                     name="agentAssigned"
//                     onChange={handleChange}
//                     value={values["agentAssigned"]}
//                   >
//                     <option selected value={""}>
//                       Select agent
//                     </option>
//                     {tree &&
//                       tree["managers"] &&
//                       tree["agents"]["manager-" + user?._id?.toString()]?.map(
//                         (user) => {
//                           return (
//                             <option
//                               key={user?._id?.toString()}
//                               value={user?._id?.toString()}
//                             >
//                               {user?.firstName + " " + user?.lastName}
//                             </option>
//                           );
//                         }
//                       )}
//                   </Select>
//                 </Box>

//                 <Text mb="10px" color={"red"}>
//                   {" "}
//                   {errors.fromLeadScore &&
//                     touched.fromLeadScore &&
//                     errors.fromLeadScore}
//                 </Text>
//               </GridItem>
//             )}
//           </Grid>
//         </ModalBody>
//         <ModalFooter>
//           <Button
//             colorScheme="brand"
//             size="sm"
//             mr={2}
//             onClick={handleSubmit}
//             disabled={isLoading || !dirty ? true : false}
//           >
//             {isLoading ? <Spinner /> : "Search"}
//           </Button>
//           <Button
//             colorScheme="red"
//             variant="outline"
//             size="sm"
//             onClick={() => resetForm()}
//           >
//             Clear
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };
